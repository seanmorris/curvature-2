import { Test } from 'cv3-test/Test';
import { rawquire } from 'rawquire/rawquire.macro';
const fsp = require('fs').promises;

const Pobot = require('pobot/Pobot');

const hostname = `file://${process.cwd()}/../html/index.html`;

const delay = d => () => new Promise(accept => setTimeout(accept,d));

export class TestBase extends Test
{
	options = [].concat(
		!process.env.VISIBLE
		? ['--headless', '--disable-gpu']
		: []
	);

	setUp()
	{
		return Pobot.get(this.options).then(pobot=> this.pobot = pobot);
	}

	breakDown()
	{
		return this.pobot.kill();
	}

	wrapTest(name, script, expected, withCoverage = false)
	{
		const init = withCoverage ? this.pobot.startCoverage() : Promise.resolve();

		const test = init
		.then(this.pobot.goto(`${hostname}`))
		.then(() => this.pobot.inject(script))
		.then(result => this.assert(result === expected, 'Document body incorrect or corrupted.'));

		if(!withCoverage)
		{
			return test;
		}

		return test
		.then(delay(500))
		.then(() => this.pobot.takeCoverage())
		.then(coverage => fsp.writeFile(`${process.cwd()}/../coverage/v8/${name}-coverage.json`, JSON.stringify(coverage, null, 4)))
		.then(() => this.pobot.stopCoverage());
	}
}
