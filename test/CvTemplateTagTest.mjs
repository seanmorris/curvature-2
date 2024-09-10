import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvTemplateTagTest extends TestBase
{
	async testSingleTemplate()
	{
		const name = 'testSingleTemplate';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testMultiTemplate()
	{
		const name = 'testMultiTemplate';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}