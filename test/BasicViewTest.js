import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

export class BasicViewTest extends TestBase
{
	testTemplate()
	{
		const name = 'testTemplate';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testFlicker()
	{
		const name = 'testFlicker';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testList()
	{
		const name = 'testList';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testListPrefill()
	{
		const name = 'testListPrefill';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testListCascade()
	{
		const name = 'testListCascade';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testListCascadeUp()
	{
		const name = 'testListCascadeUp';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testListSplicedOdds()
	{
		const name = 'testListSplicedOdds';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testListSplicedUpOdds()
	{
		const name = 'testListSplicedUpOdds';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testObjectSetProperties()
	{
		const name = 'testObjectSetProperties';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testObjectDeleteOdds()
	{
		const name = 'testObjectDeleteOdds';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testObjectRefill()
	{
		const name = 'testObjectRefill';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}
}

