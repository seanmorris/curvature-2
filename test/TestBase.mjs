import { Test } from 'cv3-test/Test.mjs';
import { Pobot } from 'pobot/Pobot.mjs';
import { Delay } from './helpers/Delay.mjs';

import { Console } from 'node:console';
import fs from 'node:fs';

const fsp = fs.promises;

const pendingRequests = new Set;
const pendingPrintLog = new Set;

const konsole = new Console({stdout: process.stderr, stderr: process.stderr});

export class TestBase extends Test
{
	parallel = true;

	startDocument = `file://${process.cwd()}/html/index.html`;

	options = ['--window-size=640,480', '--js-flags="--jitless"', `--url="${this.startDocument}"`].concat(
		!process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []
	);

	helpers = [
		{ modules: [['Delay', Delay]] }
		, {
			inits: [
				() => {
					const o = console.assert;
					const assert = (...a) => {
						(window.externalAssert||o)(JSON.stringify(a));
						o(...a);
					};
					window.console.assert = assert;
				}
			]
			, bindings: {
				externalAssert: (...a) => this.assertSilent(...a)
			}
		}
	];

	async setUp()
	{
		Error.stackTraceLimit = Infinity;

		const pobot = this.pobot = await Pobot.get(this.options);

		const addBindings = this.helpers.filter(h => h.bindings).map(h => pobot.addBindings(h.bindings));
		const addInits    = this.helpers.filter(h => h.inits).map(h => pobot.addInits(h.inits));

		const printConsole = (event, icon, color) => {

			const stars = {
				warning:  this.reporter.Format('\u2622', this.reporter.METHOD_WARN)
				, error:  this.reporter.Format('\u2BBF', this.reporter.METHOD_FAIL)
				, dir:    this.reporter.Format('\uD83D\uDF87', this.reporter.METHOD_SUCCESS)
				, log:    this.reporter.Format('\uD83D\uDF87', this.reporter.DIM)
			};

			const star = icon || stars[event.type];

			const all = Promise.all(event.args.map(a => pobot.getObject(a)));

			const frame = event.stackTrace.callFrames[0];

			const printer = (mapped) => {

				const line = ((mapped.length === 1 && typeof mapped[0] !== 'object') ? mapped[0] : mapped.map(JSON.stringify).join(', '));

				if(event.type === 'error')
				{
					this.assertSilent(false, line);
				}

				if(event.type === 'warning')
				{
					this.assertSilent(false, line, this.WARN);
				}

				let position;

				if(frame)
				{
					position = event.type === frame.functionName
						? ` ${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
						: ` ${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`;
				}

				const justify = ' '.repeat(Math.max(0, 40 - line.length));

				if(!color && ['trace', 'assert'].includes(event.type))
				{
					color = this.reporter.DIM;
				}
				else if(!color && ['error'].includes(event.type))
				{
					color = this.reporter.METHOD_FAIL;
				}
				else if(!color && ['warning'].includes(event.type))
				{
					color = this.reporter.METHOD_WARN;
				}

				this.reporter.Print(
					`    ${star||'\uD83D\uDF87'} `
						+ this.reporter.Format(line, color || this.reporter.NORMAL)
						+ (position
							? (justify + this.reporter.Format(position, this.reporter.DIMMER))
							: ''
						)
				);
			};

			const waitFor = Promise.allSettled(pendingPrintLog);

			const waiter  = all.then(args => waitFor.then(() => printer(args)));

			pendingPrintLog.add(waiter);

			waiter.finally(() => pendingPrintLog.delete(waiter));

			pendingRequests.add(all);

			all.finally(() => pendingRequests.delete(all));

			return waiter;
		};

		const printTrace = event => {

			let level = 0;

			if(event.type === 'assert')
			{
				event.stackTrace.callFrames.shift();
				level = event.args.length > 1 ? event.args.pop().value : this.ERROR;
			}
			else if(event.type === 'error')
			{
				level = 2;
			}

			const stars = [
				this.reporter.Format('\uD83D\uDF87', this.reporter.DIM)
				, '\uD83D\uDF87'
				, this.reporter.Format('\u2716', this.reporter.METHOD_FAIL)
				, this.reporter.Format('\u2622', this.reporter.METHOD_WARN)
				, this.reporter.Format('\uD83D\uDFB4', this.reporter.METHOD_NOTICE)
			];

			const colors = [
				null
				, null
				, this.reporter.METHOD_FAIL
				, this.reporter.METHOD_WARN
				, this.reporter.METHOD_NOTICE
			];

			const color = colors[level] || null;
			const star  = stars[level]  || '\uD83D\uDF87';

			const printLine = printConsole(event, star, color);

			if(event.type === 'assert' && level >= this.WARN || !event.stackTrace || !event.stackTrace.callFrames || !event.stackTrace.callFrames.length)
			{
				return;
			}

			const waitFor = Promise.allSettled(pendingPrintLog);

			const printer = () => {
				this.reporter.Print(`       at ` + event.stackTrace.callFrames.map(frame => frame.functionName
					? `${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
					: `${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`
				).join('\n       at '));
			};

			const waiter = waitFor.then(() => printLine.then(printer));

			waitFor.finally(() => pendingPrintLog.delete(waiter));

			pendingPrintLog.add(waiter);
		}

		const addHandlers = pobot.addConsoleHandler({
			warning:  printConsole
			, assert: printTrace
			, trace:  printTrace
			, error:  printTrace
			, dir:    printConsole
			, log:    printConsole
			, '!':    event => console.dir(event, {depth:null})
		});

		const addExceptionHandler = pobot.client.Runtime.exceptionThrown(exception => console.dir(exception, {depth:null}));

		await Delay(100);

		return Promise.all([addBindings, addInits, addHandlers, addExceptionHandler]);
	}

	breakDown()
	{
		return this.pobot.kill();
	}

	wrapTest(name, script, expected, withCoverage = false)
	{
		return this.wrapScript(name, script, expected, withCoverage);
	}

	wrapScript(name, script, expected, withCoverage = false)
	{
		const {pobot, reporter} = this;

		withCoverage = withCoverage && pobot.adapter.type === 'chrome';

		const init = (withCoverage ? pobot.startCoverage() : Promise.resolve())
		.then(() => pobot.goto(this.startDocument))
		.then(() => Promise.all(this.helpers.filter(h => h.modules).map(h => pobot.addModules(h.modules))));

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

		const runTest = init.then(() => pobot.inject(script));
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
				error.response.data && reporter.exceptionCaught(error.response.data, this);
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

		const screenshotFile = `${process.cwd()}/screenshots/${name}.png`;

		const takeScreenshot = check.then(() => pobot.getScreenshot({filename: screenshotFile, captureBeyondViewport:true}));

		if(!withCoverage)
		{
			return check.finally(() => Promise.all([takeScreenshot, ...pendingRequests]));
		}

		const coverageFile = `${process.cwd()}/coverage/v8/${name}-coverage.json`;

		return check
		.then(() => pobot.takeCoverage())
		.then(coverage => fsp.writeFile(coverageFile, JSON.stringify(coverage, null, 4)))
		.then(() => pobot.stopCoverage())
		.then(() => Promise.all([takeScreenshot, ...pendingRequests]));
	}
}
