import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const http = require('http');

export class ElicitTest extends TestBase
{
	setUp()
	{
		this.respond = () => Promise.resolve({data: 'Hello, world!'});

		this.http = http.createServer((request,response) => {
			const { headers, method, url } = request;

			this.reporter.Print(`    \uD835\uDD8E` + this.reporter.Format(`[${new Date}] ${method} `, this.reporter.DIM) + url);

			response.writeHead(200, {
				'Access-Control-Allow-Methods':  'GET'
				, 'Access-Control-Allow-Origin': '*'
				, 'Content-Type': 'application/json'
			});

			this.respond().then(doc => response.end(JSON.stringify(doc)))
		});

		this.http.listen(8038);

		return super.setUp();
	}

	testNormalGetRequest()
	{
		const name = 'testNormalGetRequest';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testTimedOutGetRequest()
	{
		let requests = 0;

		this.respond = () => new Promise(accept => {
			const timeoutMs = requests < 4 ? 5000 : 0;
			setTimeout(() => accept({data: 'Hello, world!'}), timeoutMs);
			requests++;
		});

		const name = 'testTimedOutGetRequest';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testGetDataUri()
	{
		const name = 'testGetDataUri';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testGetJson()
	{
		const name = 'testGetJson';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testGetBytes()
	{
		const name = 'testGetBytes';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	breakDown()
	{
		this.http.close();

		return super.breakDown();
	}
}
