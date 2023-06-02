import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvPrerenderTagTest extends TestBase
{
	testNormalRender()
	{
		const name = 'testNormalRender';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testPreRender()
	{
		const name = 'testPreRender';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
