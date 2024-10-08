import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvWithTagTest extends TestBase
{
	async testVariablesRaised()
	{
		const name = 'testVariablesRaised';
		const testScript = await import(`./tests/cvWithTagTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/cvWithTagTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
