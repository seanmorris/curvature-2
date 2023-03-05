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

	testList()
	{
		const name = 'testList';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListPrefill()
	{
		const name = 'testListPrefill';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListCascade()
	{
		const name = 'testListCascade';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListCascadeUp()
	{
		const name = 'testListCascadeUp';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListSplicedOdds()
	{
		const name = 'testListSplicedOdds';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testListSplicedUpOdds()
	{
		const name = 'testListSplicedUpOdds';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testObjectSetProperties()
	{
		const name = 'testObjectSetProperties';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testObjectDeleteOdds()
	{
		const name = 'testObjectDeleteOdds';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testObjectRefill()
	{
		const name = 'testObjectRefill';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}

