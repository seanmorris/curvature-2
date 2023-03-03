import { Test } from 'cv3-test/Test';
import { rawquire } from 'rawquire/rawquire.macro';
const fsp = require('fs').promises;

const Pobot = require('pobot/Pobot');

const pending = new Set;

const objectMapper = (pobot,object) => {
	switch(object.type)
	{
		case 'object':
			return !object.objectId ? Promise.resolve(object) : pobot.client.Runtime
			.getProperties({objectId: object.objectId})
			.then(({result}) => {

				const mapped = result
				.filter(p => p.enumerable)
				.map( p => objectMapper(pobot,p.value).then( value => ({[p.name]: value}) ) );

				const getObject = Promise.all(mapped).then(p => p.reduce((a,b) => ({...a, ...b}), {}));

				getObject.then(() => pending.delete(pending));

				pending.add(pending);

				if(object.subtype === 'array')
				{
					return getObject.then(object => Object.assign([], object));
				}

				return getObject;
			});

		case 'number':
		case 'string':
		case 'boolean':
		case 'function':
			return Promise.resolve(object.value);
			break;
	}

	return Promise.reject(`Unknown type: "${object.type}"`);
};

const formatStackTrace = (pobot,error) => {
	if(error.result.type === 'object' && error.result.subtype === 'error')
	{
		return Promise.resolve('        [EXCEPTION] ' + error.result.description.replace(/\n/g, '\n     '));
	}

	return objectMapper(pobot, error.result).then(message => {
		const lines = error.exceptionDetails.stackTrace.callFrames.map(frame => frame.functionName
			? `${frame.functionName} (${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber})`
			: `${frame.url||'<anonymous>'}:${frame.lineNumber}:${frame.columnNumber}`
		);
		return `        ${error.exceptionDetails.text} "${message}"\n          at ${lines.join('\n          at ')}`;
	});
};

export class TestBase extends Test
{
	testEnvironment = `file://${process.cwd()}/../html/index.html`;

	options = [].concat(
		!process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []
	);

	bindings = new Map

	setUp()
	{
		const consoleHandler = {
			'*': event => {
				console.dir(event, {colors:true, depth:null})
			}
			, log: event => {
				const all = Promise.all(event.args.map(a => objectMapper(this.pobot, a))).then(mapped => {
					this.reporter.Print(`        [${event.type}] ` + this.reporter.Format(
						mapped.map(JSON.stringify).join(', '), this.reporter.METHOD_WARN
					));
				});

				pending.add(all);

				all.then(() => pending.delete(all));

				return all;
			}
			, warning: (...a) => consoleHandler.log(...a)
			, error: (...a) => consoleHandler.log(...a)
			, dir: (...a) => consoleHandler.log(...a)
		};

		const handleConsole = event => {
			if(event.type in consoleHandler) consoleHandler[ event.type ](event);
			else if(consoleHandler['*']) consoleHandler['*'](event);
		};

		const handleException = event => {
			// console.dir(event, {depth:null});
		}

		return Pobot.get(this.options).then(pobot=> {
			pobot.client.Runtime.consoleAPICalled(handleConsole);
			pobot.client.Runtime.exceptionThrown(handleException);
			pobot.client.Runtime.bindingCalled(event => this.callBinding(event));
			this.pobot = pobot
		});
	}

	breakDown()
	{
		return this.pobot.kill();
	}

	wrapTest(name, script, expected, withCoverage = false)
	{
		const checkResult = (result, expected) => {
			this.assert(result === expected, 'Document body incorrect or corrupted.');
			if(result !== expected)
			{
				console.log(`        \x1b[32m[+] Expected:\x1b[0m`);
				console.log(`        \x1b[31m[-] ${JSON.stringify(expected)}\x1b[0m`);
				console.log(`        \x1b[31m[-] Got:\x1b[0m`);
				console.log(`        \x1b[32m[+] ${JSON.stringify(result)}\x1b[0m`);
			}
		};

		const init = withCoverage
		? this.pobot.startCoverage()
		: Promise.resolve;

		const test = init
		.then(() => this.addBinding('externalAssert', (condition,message) => this.assert(condition,message)) )
		.then(() => this.pobot.goto(this.testEnvironment))
		.then(() => this.pobot.inject( require('./helpers/ExternalAssert.js').ExternalAssert ))
		.then(() => this.pobot.inject(script))
		.then(result => checkResult(result, expected))
		.catch(error => {
			this.fail[this.EXCEPTION]++;
			// this.assert(false, 'Exception thrown!');
			if(error.result)
			{
				return formatStackTrace(this.pobot, error)
				.then(trace => this.reporter.Print(this.reporter.Format(trace, this.reporter.EXCEPTION)))
			}
			else if(error.response)
			{
				this.reporter.Print(
					this.reporter.Format('        [EXCEPTION] ' + error.response.data.replace(/\n/g, '\n     '), this.reporter.EXCEPTION)
				);
				console.error(error);
			}
		});

		if(!withCoverage)
		{
			return test;
		}

		return test
		.then(() => Promise.all([...pending]))
		.then(() => this.pobot.takeCoverage())
		.then(coverage => fsp.writeFile(`${process.cwd()}/../coverage/v8/${name}-coverage.json`, JSON.stringify(coverage, null, 4)))
		.then(() => this.pobot.stopCoverage())
	}

	addBinding(name, callback)
	{
		this.bindings.set(name, callback);
		return this.pobot.client.Runtime.addBinding({name});
	}

	callBinding({name, payload})
	{
		const args = JSON.parse(payload);
		const callback = this.bindings.get(name);
		callback(...args);
	}
}
