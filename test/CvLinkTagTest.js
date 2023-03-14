import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvLinkTagTest extends TestBase
{
	testHrefPresent()
	{
		const name = 'testHrefPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
