import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class BasicViewTest extends TestBase
{
	testTemplate()
	{
		const name = 'testTemplate';

		const testScript = require(`./tests/${name}`);

		return this.wrapTest(
			name,
			testScript[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testFindTag()
	{
		const name = 'testFindTag';

		const testScript = require(`./tests/${name}`);

		return this.wrapTest(
			name,
			testScript[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testFindTags()
	{
		const name = 'testFindTags';

		const testScript = require(`./tests/${name}`);

		return this.wrapTest(
			name,
			testScript[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListenSelf()
	{
		const name = 'testListenSelf';

		const testScript = require(`./tests/${name}`);

		return this.wrapTest(
			name,
			testScript[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListenNode()
	{
		const name = 'testListenNode';

		const testScript = require(`./tests/${name}`);

		return this.wrapTest(
			name,
			testScript[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testFlicker()
	{
		const name = 'testFlicker';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testHtmlEscape()
	{
		const name = 'testHtmlEscape';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testHtmlNoEscape()
	{
		const name = 'testHtmlNoEscape';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testViewEscaped()
	{
		const name = 'testViewEscaped';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testViewNoEscape()
	{
		const name = 'testViewNoEscape';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}

