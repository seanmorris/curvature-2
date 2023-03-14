import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';
const fsp = require('fs').promises;

const hostname = `file://${process.cwd()}/../html/index.html`;

export class InputTest extends TestBase
{
	testFocusOrder()
	{
		const name = 'testFocusOrder';
		const script = require(`./tests/${name}.js`)[name];
		const expected = rawquire(`./tests/${name}.txt`);

		const steps = [
			(r) => this.pobot.inject(script)
			, (r) => this.pobot.type(['Tab', 'Tab', 'Tab', 'A', 'S', 'D', 'F'])
			, (r) => this.pobot.inject(() => document.body.innerHTML)
		];

		return this.wrapSteps(name, steps, expected, true);
	}

	testFocusClick()
	{
		const name = 'testFocusClick';
		const script = require(`./tests/${name}.js`)[name];
		const expected = rawquire(`./tests/${name}.txt`);

		const steps = [
			(r) => this.pobot.inject(script)
			, (r) => this.pobot.click(250, 10)
			, (r) => this.pobot.type(['A', 'S', 'D', 'F'])
			, (r) => this.pobot.inject(() => document.body.innerHTML)
			// , (r) => new Promise(a => setTimeout(() => a(document.body.innerHTML), 2000000))
		];

		return this.wrapSteps(name, steps, expected, true);
	}

	wrapSteps(name, steps, expected, withCoverage = false)
	{
		withCoverage = false;

		const checkResult = (result, expected) => {
			this.assert(
				result === expected
				, 'Document body incorrect or corrupted.\n'
					+ `\x1b[32m[--] Expected:\x1b[0m\n`
					+ `\x1b[32m[--] ${JSON.stringify(result)}\x1b[0m\n`
					+ `\x1b[31m[++] Got:\x1b[0m\n`
					+ `\x1b[31m[++] ${JSON.stringify(expected)}\x1b[0m\n`
			);
		};

		const pobot = this.pobot;

		const iterate = (steps, prevResult) => steps.shift()(prevResult).then(result => steps.length ? iterate(steps, result) : result);

		// const init = withCoverage ? this.pobot.startCoverage() : Promise.resolve();
		const init = (withCoverage ? pobot.startCoverage() : Promise.resolve())
		.then(() => pobot.goto(this.startDocument))
		.then(() => Promise.all(this.helpers.filter(h => h.modules).map(h => pobot.addModules(h.modules))));


		const test = init
		.then(() => iterate(steps))
		.then(result => checkResult(result, expected));

		if(!withCoverage)
		{
			return test;
		}

		const coverageFile = `${process.cwd()}/../coverage/v8/${name}-coverage.json`;

		return test
		.then(() => pobot.takeCoverage())
		.then(coverage => fsp.writeFile(coverageFile, JSON.stringify(coverage, null, 4)))
		.then(() => pobot.stopCoverage());
	}

}
