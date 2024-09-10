import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvPrerenderTagTest extends TestBase
{
	async testNormalRender()
	{
		const name = 'testNormalRender';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testPreRender()
	{
		const name = 'testPreRender';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}