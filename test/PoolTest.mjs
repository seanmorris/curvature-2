import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class PoolTest extends TestBase
{
	async testTimedPool()
	{
		const name = 'testTimedPool';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
