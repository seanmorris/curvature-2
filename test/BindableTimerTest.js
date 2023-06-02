import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class BindableTimerTest extends TestBase
{
	testDelay()
	{
		const name = 'testDelay';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testThrottle()
	{
		const name = 'testThrottle';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testWait()
	{
		const name = 'testWait';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

// 	testIdle()
// 	{
// 		const name = 'testIdle';

// 		return this.wrapTest(
// 			name,
// 			require(`./tests/${name}`)[name],
// 			rawquire(`./tests/${name}.txt`),
// 			true
// 		);
// 	}

// 	testFrame()
// 	{
// 		const name = 'testFrame';

// 		return this.wrapTest(
// 			name,
// 			require(`./tests/${name}`)[name],
// 			rawquire(`./tests/${name}.txt`),
// 			true
// 		);
// 	}
}
