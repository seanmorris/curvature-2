import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class CvAttrTagTest extends TestBase
{
	async testAttributesPresent()
	{
		const name = 'testAttributesPresent';
		const testScript = await import(`./tests/cvAttrTagTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/cvAttrTagTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testExpandedAttributesPresent()
	{
		const name = 'testExpandedAttributesPresent';
		const testScript = await import(`./tests/cvAttrTagTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/cvAttrTagTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
