import { TestBase } from './TestBase.mjs';
import fs from 'node:fs';
import http from 'node:http';

export class ElicitTest extends TestBase
{
	parallel = false;

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

	async testNormalGetRequest()
	{
		const name = 'testNormalGetRequest';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testTimedOutGetRequest()
	{
		let requests = 0;

		this.respond = () => new Promise(accept => {
			const timeoutMs = requests < 4 ? 5000 : 0;
			setTimeout(() => accept({data: 'Hello, world!'}), timeoutMs);
			requests++;
		});

		const name = 'testTimedOutGetRequest';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testGetDataUri()
	{
		const name = 'testGetDataUri';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testGetJson()
	{
		const name = 'testGetJson';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	async testGetBytes()
	{
		const name = 'testGetBytes';
		const testScript = await import(`./tests/${name}.mjs`);

		return this.wrapTest(
			name,
			testScript[name],
			fs.readFileSync(`./tests/${name}.txt`, {encoding: 'utf8'}),
			true
		);
	}

	breakDown()
	{
		this.http.close();

		return super.breakDown();
	}
}
