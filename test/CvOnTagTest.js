import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvOnTagTest extends TestBase
{
	testOnFocusEvent()
	{
		const name = 'testOnFocusEvent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
