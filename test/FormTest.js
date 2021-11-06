import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

export class FormTest extends TestBase
{
	testTextField()
	{
		const name = 'testTextField';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testTextarea()
	{
		const name = 'testTextarea';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testHtmlField()
	{
		const name = 'testHtmlField';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testFormBasic()
	{
		const name = 'testFormBasic';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Form values incorrect or corrupted.'
		));
	}

	testFormInputFlicker()
	{
		const name = 'testFormInputFlicker';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Form values incorrect or corrupted.'
		));
	}

	testFormOutputFlicker()
	{
		const name = 'testFormOutputFlicker';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Form values incorrect or corrupted.'
		));
	}

	testFormGroupInput()
	{
		const name = 'testFormGroupInput';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Form values incorrect or corrupted.'
		));
	}

	testFormGroupOutput()
	{
		const name = 'testFormGroupOutput';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Form values incorrect or corrupted.'
		));
	}

	// testFormGroups
	// testForm
}
