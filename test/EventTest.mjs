import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';

const hostname = `file://${process.cwd()}/html/index.html`;

export class EventTest extends TestBase
{
	async testEventDispatch()
	{
		const name = 'testEventDispatch';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testEventDispatchCancel()
	{
		const name = 'testEventDispatchCancel';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testEventBubble()
	{
		const name = 'testEventBubble';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testEventBubbleCancel()
	{
		const name = 'testEventBubbleCancel';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testEventCapture()
	{
		const name = 'testEventCapture';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testEventCaptureCancel()
	{
		const name = 'testEventCaptureCancel';

		return this.wrapTest(
			name,
			(await import(`./tests/${name}.mjs`))[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}
}
