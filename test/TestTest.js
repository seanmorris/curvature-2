import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const os = require("os");

export class TestTest extends TestBase
{
	testEnvironment()
	{
		this.assert(true);

		return this.pobot.getVersion().then(version => this.annotate({
			shell:       os.userInfo().shell
			,username:   os.userInfo().username
			, hostname:  os.hostname()
			, timestamp: String(new Date)
			, browser:   version
			, system: {
				platform:  os.platform()
				, type:    os.type()
				, version: os.version()
				, release: os.release()
				, machine: os.machine()
			}
		}));

		return Promise.resolve();
	}

	testTest()
	{
		// const name = 'testTemplate';

		// this.assert(false, 'Assert level: Notice', this.NOTICE);
		// this.assert(false, 'Assert level: Warning', this.WARN);
		// this.assert(false, 'Assert level: Error');
		// // this.assert(0, 'Assert level: Error');

		// return this.wrapTest(
		// 	name,
		// 	require(`./tests/${name}`)[name],
		// 	rawquire(`./tests/${name}.txt`),
		// 	true
		// );
	}

	// testTest2()
	// {
	// 	const name = 'testFormGroupInput';

	// 	// this.assert(false, 'Assert level: Notice', this.NOTICE);
	// 	this.assert(false, 'Assert level: Warning', this.WARN);
	// 	// this.assert(false, 'Assert level: Error');

	// 	// return this.wrapTest(
	// 	// 	name,
	// 	// 	require(`./tests/${name}`)[name],
	// 	// 	rawquire(`./tests/${name}.txt`),
	// 	// 	true
	// 	// );
	// }
}
