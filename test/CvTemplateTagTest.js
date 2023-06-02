import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvTemplateTagTest extends TestBase
{
	testSingleTemplate()
	{
		const name = 'testSingleTemplate';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testMultiTemplate()
	{
		const name = 'testMultiTemplate';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
