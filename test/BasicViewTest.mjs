import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class BasicViewTest extends TestBase
{
	async testTemplate()
	{
		const name = 'testTemplate';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFindTag()
	{
		const name = 'testFindTag';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFindTags()
	{
		const name = 'testFindTags';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testListenSelf()
	{
		const name = 'testListenSelf';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testListenNode()
	{
		const name = 'testListenNode';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testFlicker()
	{
		const name = 'testFlicker';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testHtmlEscape()
	{
		const name = 'testHtmlEscape';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testHtmlNoEscape()
	{
		const name = 'testHtmlNoEscape';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testViewEscaped()
	{
		const name = 'testViewEscaped';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testViewNoEscape()
	{
		const name = 'testViewNoEscape';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}

