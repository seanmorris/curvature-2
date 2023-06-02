import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const os = require("os");

export class PoolTest extends TestBase
{
	testTimedPool()
	{
		const name = 'testTimedPool';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
