import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class BindableTimerTest extends TestBase
{
	async testDelay()
	{
		const name = 'testDelay';
		const testScript = await import(`./tests/bindableTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/bindableTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testThrottle()
	{
		const name = 'testThrottle';
		const testScript = await import(`./tests/bindableTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/bindableTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testWait()
	{
		const name = 'testWait';
		const testScript = await import(`./tests/bindableTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/bindableTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

// 	testIdle()
// 	{
// 		const name = 'testIdle';

// 		return this.wrapTest(
// 			name,
// 			require(`./tests/bindableTimerTests/${name}`)[name],
// 			fs.readFileSync(`./tests/bindableTimerTests/${name}.txt`, {encoding: 'utf8'}),
// 			true
// 		);
// 	}

// 	testFrame()
// 	{
// 		const name = 'testFrame';

// 		return this.wrapTest(
// 			name,
// 			require(`./tests/bindableTimerTests/${name}`)[name],
// 			fs.readFileSync(`./tests/bindableTimerTests/${name}.txt`, {encoding: 'utf8'}),
// 			true
// 		);
// 	}
}
