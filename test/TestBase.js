import { Test } from 'cv3-test/Test';

const fsp = require('fs').promises;
const Pobot = require('pobot/Pobot');
const pending = new Set;

const { Console } = require('console');

const konsole = new Console({stdout: process.stderr, stderr: process.stderr});

import { Delay } from './helpers/Delay';

export class TestBase extends Test
{
	testEnvironment = `file://${process.cwd()}/../html/index.html`;

	options = ['--window-size=640,480', '--js-flags="--jitless"', `--url="${this.testEnvironment}"`].concat(
		!process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []
	);

	helpers = [
		{ modules: [['Delay', Delay]] }
		, {
			inits: [() => {const {assert:original} = console; const assert = (...a) => {window.externalAssert(JSON.stringify(a)); original(...a);}; window.console.assert = assert;}]
			, bindings: [[ 'externalAssert', (...a) => this.assert(...a) ]]
		}
	];

	setUp()
	{
		return Pobot.get(this.options).then(pobot=> {

			const addBindings = this.helpers.filter(h => h.bindings).map(h => pobot.addBindings(h.bindings));
			const addInits    = this.helpers.filter(h => h.inits).map(h => pobot.addInits(h.inits));


			const printConsole = event => {
				const stars = {
					warning:  this.reporter.Format('\u25CF', this.reporter.METHOD_WARN)
					, assert: this.reporter.Format('\u25CF', this.reporter.METHOD_FAIL)
					, error:  this.reporter.Format('\u25CF', this.reporter.METHOD_FAIL)
					, dir:    this.reporter.Format('\u25CF', this.reporter.METHOD_SUCCESS)
					, log:    '\u25CF'
				};

				const star = stars[event.type];

				const all = Promise.all(event.args.map(a => pobot.getObject(a)));

				const frame = event.stackTrace.callFrames[0];

				all.then(mapped => {

					const line = (mapped.length === 1 ? mapped[0] : mapped.map(JSON.stringify).join(', '));
					const position = event.type === 'trace' ? '' : (frame.functionName
						? ` ${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
						: ` ${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`
					);

					const justify = ' '.repeat(Math.max(0, 40 - line.length));

					this.reporter.Print(
						`    ${star||'\u25CF'} `
							+ this.reporter.Format(line, event.type === 'trace' ? this.reporter.METHOD_WARN : this.reporter.NORMAL)
							+ justify
							+ this.reporter.Format(position, this.reporter.DIMMER));
				});

				pending.add(all);

				all.finally(() => pending.delete(all));

				return all;
			};

			const printTrace = event => {
				(event.type === 'assert' ? Promise.resolve() : printConsole(event)).then(args => {
					this.reporter.Print(`        at ` + event.stackTrace.callFrames.map(frame => frame.functionName
						? `${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
						: `${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`
					).join('\n        at '));
				});
			}

			const addHandlers = pobot.addConsoleHandler({
				warning:  printConsole
				, assert: printTrace
				, trace:  printTrace
				, error:  printConsole
				, dir:    printConsole
				, log:    printConsole
				, '!':    event => console.dir(event, {depth:null})
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
		.then(() => Promise.all(this.helpers.filter(h => h.modules).map(h => pobot.addModules(h.modules))));

		const runTest = init.then(() => pobot.inject(script));

		// const getHtml = runTest.then(() => pobot.getHtml('body'));
		// const snapshotFile  = `${process.cwd()}/../snapshots/${name}.txt`;
		// const checkSnapshot = fsp.access(snapshotFile);
		// const getSnapshot = checkSnapshot
		// .catch(() => getHtml.then(result => fsp.writeFile(snapshotFile, result)))
		// .then(()  => fsp.readFile(snapshotFile, 'utf-8'));

		const docCheckMessage = (a,b) => 'Document body incorrect or corrupted.\n'
			+ `\x1b[32m[-] Expected:\x1b[0m `
			+ `\x1b[31m[+] Actual:\x1b[0m\n`
			+ `\x1b[32m[-] ${JSON.stringify(a)}\x1b[0m\n`
			+ `\x1b[31m[+] ${JSON.stringify(b)}\x1b[0m`;

		Error.stackTraceLimit = Infinity;

		const check = runTest
		.then(result => this.assertEquals(expected, result, docCheckMessage))
		.catch(error => {
			this.fail[this.EXCEPTION]++;

			if(error.result)
			{
				let getStackTrace;

				if(error.result.type === 'object' && error.result.subtype === 'error')
				{
					getStackTrace = Promise.resolve(error.result.description);
				}
				else
				{
					getStackTrace = pobot.getStackTrace(error);
				}

				return getStackTrace.then(trace => reporter.exceptionCaught(trace, this));
			}
			else if(error.response)
			{
				error.response.data && reporter.exceptionCaught(error.response.data, reporter.EXCEPTION, this);
			}
			else if(error.exceptionDetails)
			{
				reporter.exceptionCaught(error.exceptionDetails.text, this);
			}
			else
			{
				reporter.exceptionCaught(error, this);
			}
		});

		const screenshotFile = `${process.cwd()}/../screenshots/${name}.png`;

		const takeScreenshot = check.then(() => pobot.getScreenshot({filename: screenshotFile, captureBeyondViewport:true}));

		if(!withCoverage)
		{
			return check.finally(() => Promise.all([takeScreenshot, ...pending]));
		}

		const coverageFile = `${process.cwd()}/../coverage/v8/${name}-coverage.json`;

		return check
		.then(() => pobot.takeCoverage())
		.then(coverage => fsp.writeFile(coverageFile, JSON.stringify(coverage, null, 4)))
		.then(() => pobot.stopCoverage())
		.then(() => Promise.all([takeScreenshot, ...pending]));
	}
}
