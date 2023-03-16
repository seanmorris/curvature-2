import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvEachTagTest extends TestBase
{
	parallel = false;

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
