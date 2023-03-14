import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvAttrTagTest extends TestBase
{
	testAttributesPresent()
	{
		const name = 'testAttributesPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testExpandedAttributesPresent()
	{
		const name = 'testExpandedAttributesPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
