import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class DatabaseTest extends TestBase
{
	async testInsertAndSelect()
	{
		const name = 'testInsertAndSelect';
		const testScript = await import(`./tests/databaseTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/databaseTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testStoreAndIndexListing()
	{
		const name = 'testStoreAndIndexListing';
		const testScript = await import(`./tests/databaseTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/databaseTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testModelCreation()
	{
		const name = 'testModelCreation';
		const testScript = await import(`./tests/databaseTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/databaseTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testModelChangeDetection()
	{
		const name = 'testModelChangeDetection';
		const testScript = await import(`./tests/databaseTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/databaseTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
