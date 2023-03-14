import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class DatabaseTest extends TestBase
{
	testInsertAndSelect()
	{
		const name = 'testInsertAndSelect';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testModelCreation()
	{
		const name = 'testModelCreation';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testModelChangeDetection()
	{
		const name = 'testModelChangeDetection';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
