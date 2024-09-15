import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

const hostname = `file://${process.cwd()}/html/index.html`;

export class FormTest extends TestBase
{
	parallel = false;

	async testTextField()
	{
		const name = 'testTextField';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testTextarea()
	{
		const name = 'testTextarea';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testHtmlField()
	{
		const name = 'testHtmlField';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFormBasic()
	{
		const name = 'testFormBasic';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFormInputFlicker()
	{
		const name = 'testFormInputFlicker';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFormOutputFlicker()
	{
		const name = 'testFormOutputFlicker';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFormGroupInput()
	{
		const name = 'testFormGroupInput';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFormGroupOutput()
	{
		const name = 'testFormGroupOutput';
		const testScript = await import(`./tests/formTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/formTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	// testFormGroups
	// testForm
}
