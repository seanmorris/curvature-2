import { TestBase } from './TestBase.mjs';
import os from 'node:os';

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
	}
}
