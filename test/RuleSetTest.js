import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class RuleSetTest extends TestBase
{
	testGlobalRule()
	{
		const name = 'testGlobalRule';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testLocalRule()
	{
		const name = 'testLocalRule';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testRuleReturnsWrappedTag()
	{
		const name = 'testRuleReturnsWrappedTag';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testRuleReturnsView()
	{
		const name = 'testRuleReturnsView';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
