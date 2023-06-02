import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvViewTagTest extends TestBase
{
	testViewIsPresent()
	{
		const name = 'testViewIsPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
