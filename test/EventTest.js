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

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(code))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}
}
