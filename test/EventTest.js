import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

export class EventTest extends TestBase
{
	testEventDispatch()
	{
		const name = 'testEventDispatch';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(code))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}

	testEventDispatchCancel()
	{
		const name = 'testEventDispatchCancel';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(code))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testEventBubble()
	{
		const name = 'testEventBubble';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(code))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testEventBubbleCancel()
	{
		const name = 'testEventBubbleCancel';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(code))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testEventCapture()
	{
		const name = 'testEventCapture';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(code))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testEventCaptureCancel()
	{
		const name = 'testEventCaptureCancel';

		const code = `(()=>{
			const exports = {};

			${rawquire(`./build/tests/${name}.js`)}

			return exports;
		})().${name}`;

		return this.wrapTest(
			name,
			code,
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(code))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}
}
