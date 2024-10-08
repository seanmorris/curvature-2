import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvLinkTagTest extends TestBase
{
	async testHrefPresent()
	{
		const name = 'testHrefPresent';
		const testScript = await import(`./tests/cvLinkTagTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/cvLinkTagTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
