import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvOnTagTest extends TestBase
{
	async testOnFocusEvent()
	{
		const name = 'testOnFocusEvent';
		const testScript = await import(`./tests/cvOnTagTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/cvOnTagTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
