import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvWithTagTest extends TestBase
{
	testVariablesRaised()
	{
		const name = 'testVariablesRaised';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
