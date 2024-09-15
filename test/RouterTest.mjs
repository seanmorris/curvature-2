import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

const hostname = `file://${process.cwd()}/html/index.html`;

export class RouterTest extends TestBase
{
	async testIndexRouting()
	{
		const name = 'testIndexRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testNamedArgRouting()
	{
		const name = 'testNamedArgRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testOptionalNamedArgRouting()
	{
		const name = 'testOptionalNamedArgRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testStaticRouting()
	{
		const name = 'testStaticRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testWildcardRoutingA()
	{
		const name = 'testWildcardRoutingA';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testWildcardRoutingB()
	{
		const name = 'testWildcardRoutingB';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testWildcardRoutingC()
	{
		const name = 'testWildcardRoutingC';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testVariadicRouting0()
	{
		const name = 'testVariadicRouting0';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testVariadicRouting1()
	{
		const name = 'testVariadicRouting1';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testVariadicRouting2()
	{
		const name = 'testVariadicRouting2';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testVariadicRouting3()
	{
		const name = 'testVariadicRouting3';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFunctionRouting()
	{
		const name = 'testFunctionRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testPromiseRouting()
	{
		const name = 'testPromiseRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testPromiseFailRouting()
	{
		const name = 'testPromiseFailRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testNotFoundRouting()
	{
		const name = 'testNotFoundRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testUnexpectedErrorRouting()
	{
		const name = 'testUnexpectedErrorRouting';
		const testScript = await import(`./tests/routerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/routerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
