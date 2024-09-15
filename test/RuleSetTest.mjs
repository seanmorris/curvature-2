import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class RuleSetTest extends TestBase
{
	async testGlobalRule()
	{
		const name = 'testGlobalRule';
		const testScript = await import(`./tests/ruleSetTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/ruleSetTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testLocalRule()
	{
		const name = 'testLocalRule';
		const testScript = await import(`./tests/ruleSetTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/ruleSetTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testRuleReturnsWrappedTag()
	{
		const name = 'testRuleReturnsWrappedTag';
		const testScript = await import(`./tests/ruleSetTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/ruleSetTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testRuleReturnsView()
	{
		const name = 'testRuleReturnsView';
		const testScript = await import(`./tests/ruleSetTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/ruleSetTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
