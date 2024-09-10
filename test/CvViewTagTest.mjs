import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvViewTagTest extends TestBase
{
	async testViewIsPresent()
	{
		const name = 'testViewIsPresent';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
