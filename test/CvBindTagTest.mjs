import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvBindTagTest extends TestBase
{
	async testValueIsPresent()
	{
		const name = 'testValueIsPresent';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testValueIsTransfomed()
	{
		const name = 'testValueIsTransfomed';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testValueIsEscaped()
	{
		const name = 'testValueIsEscaped';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testValueIsNotEscaped()
	{
		const name = 'testValueIsNotEscaped';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testTemplateIsNotEscaped(){}

	async testInterpolatedValueIsPresent()
	{
		const name = 'testInterpolatedValueIsPresent';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testInterpolatedValueIsEscaped()
	{
		const name = 'testInterpolatedValueIsEscaped';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testInterpolatedValueIsNotEscaped()
	{
		const name = 'testInterpolatedValueIsNotEscaped';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testInterpolatedTemplateIsEscaped(){}
	async testInterpolatedTemplateIsNotEscaped(){}

	// testInterpolatedValueIsTransformed()
	// {
	// 	const name = 'testValueIsPresent';

	// 	return this.wrapTest(
	// 		name,
	// 		require(`./tests/${name}`)[name],
	// 		fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
	// 		true
	// 	);
	// }
}
