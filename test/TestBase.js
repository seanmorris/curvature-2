import { Test } from 'cv3-test/Test';

const fsp = require('fs').promises;
const Pobot = require('pobot/Pobot');
const pending = new Set;

import { Delay } from './helpers/Delay';

export class TestBase extends Test
{
	testEnvironment = `file://${process.cwd()}/../html/index.html`;

	options = ['--window-size=640,480'].concat(
		!process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []
	);

	helpers = [
		{ modules: [['Delay', Delay]] }
		, {
			inits: [() => window.console.assert = (...a) => window.externalAssert(JSON.stringify(a))]
			, bindings: [[ 'externalAssert', (...a) => this.assert(...a) ]]
		}
	];

	setUp()
	{
		return Pobot.get(this.options).then(pobot=> {

			const addBindings = this.helpers.filter(h => h.bindings).map(h => pobot.addBindings(h.bindings));
			const addInits    = this.helpers.filter(h => h.inits).map(h => pobot.addInits(h.inits));

			const printConsole = event => {
				const all = Promise.all(event.args.map(a => pobot.getObject(a))).then(mapped => {
					this.reporter.Print(`     [${event.type}] ` + this.reporter.Format(
						mapped.map(JSON.stringify).join(', '), this.reporter.METHOD_WARN
					));
				});

				pending.add(all);

				all.finally(() => pending.delete(all));

				return all;
			};

			const addHandlers = pobot.addConsoleHandler({
				warning: printConsole
				, error: printConsole
				, dir:   printConsole
				, log:   printConsole
				, '!':   event => console.dir(event, {depth:null})
			});

			const addExceptionHandler = pobot.client.Runtime.exceptionThrown(exception => console.dir(exception, {depth:null}));

			this.pobot = pobot;

			return Promise.all([addBindings, addInits, addHandlers, addExceptionHandler]);
		});
	}

	breakDown()
	{
		return this.pobot.kill();
	}

	wrapTest(name, script, expected, withCoverage = false)
	{
		const {pobot, reporter} = this;

		const init = (withCoverage ? pobot.startCoverage() : Promise.resolve())
		.then(() => pobot.goto(this.testEnvironment))
		.then(() => Promise.all(this.helpers.filter(h => h.modules).map(h => pobot.addModules(h.modules))))

		const runTest = init.then(() => pobot.inject(script));

		// const getHtml = runTest.then(() => pobot.getHtml('body'));
		// const snapshotFile  = `${process.cwd()}/../snapshots/${name}.txt`;
		// const checkSnapshot = fsp.access(snapshotFile);
		// const getSnapshot = checkSnapshot
		// .catch(() => getHtml.then(result => fsp.writeFile(snapshotFile, result)))
		// .then(()  => fsp.readFile(snapshotFile, 'utf-8'));

		const check = runTest
		.then(result => this.assert(result === expected, 'Document body incorrect or corrupted.\n'
			+ `\x1b[32m[+] Expected:\x1b[0m\n`
			+ `\x1b[32m[-] ${JSON.stringify(expected)}\x1b[0m\n`
			+ `\x1b[31m[-] Got:\x1b[0m\n`
			+ `\x1b[31m[+] ${JSON.stringify(result)}\x1b[0m`
		))
		.catch(error => {
			this.fail[this.EXCEPTION]++;

			if(error.result)
			{
				let formatStackTrace;

				if(error.result.type === 'object' && error.result.subtype === 'error')
				{
					formatStackTrace = Promise.resolve('     [EXCEPTION] ' + error.result.description.replace(/\n/g, '\n     '));
				}
				else
				{
					formatStackTrace = pobot.getObject(error.result).then(message => {
						const lines = error.exceptionDetails.stackTrace.callFrames.map(frame => frame.functionName
							? `${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
							: `${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`
						);
						return `     ${error.exceptionDetails.text} "${message}"\n       at ${lines.join('\n       at ')}`;
					});
				}

				return formatStackTrace.then(trace => reporter.Print(reporter.Format(trace, reporter.EXCEPTION)));
			}
			else if(error.response)
			{
				error.response.data && reporter.Print(
					reporter.Format('        [EXCEPTION] ' + error.response.data.replace(/\n/g, '\n     '), reporter.EXCEPTION)
				);
				console.error(error);
			}
			else
			{
				console.error(error);
			}
		});

		const filename = `${process.cwd()}/../screenshots/${name}.png`;

		const takeScreenshot = check.then(() => pobot.getScreenshot({filename, captureBeyondViewport:true}));

		if(!withCoverage)
		{
			return check;
		}

		const coverageFile = `${process.cwd()}/../coverage/v8/${name}-coverage.json`;

		return check
		.then(() => pobot.takeCoverage())
		.then(coverage => fsp.writeFile(coverageFile, JSON.stringify(coverage, null, 4)))
		.then(() => pobot.stopCoverage())
		.then(() => Promise.all([takeScreenshot, ...pending]));
	}
}
