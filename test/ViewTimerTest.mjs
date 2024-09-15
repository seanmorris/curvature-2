import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

export class ViewTimerTest extends TestBase
{
	async testTimeout()
	{
		const name = 'testTimeout';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testClearTimeout()
	{
		const name = 'testClearTimeout';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testPausedTimeout()
	{
		const name = 'testPausedTimeout';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testInterval()
	{
		const name = 'testInterval';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testClearInterval()
	{
		const name = 'testClearInterval';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testPausedInterval()
	{
		const name = 'testPausedInterval';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testOnNextFrame()
	{
		const name = 'testOnNextFrame';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testOnFrame()
	{
		const name = 'testOnFrame';
		const testScript = await import(`./tests/viewTimerTests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/viewTimerTests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
