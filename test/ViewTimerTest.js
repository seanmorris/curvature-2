import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class ViewTimerTest extends TestBase
{
	testTimeout()
	{
		const name = 'testTimeout';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testClearTimeout()
	{
		const name = 'testClearTimeout';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testPausedTimeout()
	{
		const name = 'testPausedTimeout';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testInterval()
	{
		const name = 'testInterval';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testClearInterval()
	{
		const name = 'testClearInterval';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testPausedInterval()
	{
		const name = 'testPausedInterval';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testOnNextFrame()
	{
		const name = 'testOnNextFrame';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testOnFrame()
	{
		const name = 'testOnFrame';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}
}
