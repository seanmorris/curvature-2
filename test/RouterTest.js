import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

export class RouterTest extends TestBase
{
	testIndexRouting()
	{
		const name = 'testIndexRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testStaticRouting()
	{
		const name = 'testStaticRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testWildcardRoutingA()
	{
		const name = 'testWildcardRoutingA';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testWildcardRoutingB()
	{
		const name = 'testWildcardRoutingB';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testWildcardRoutingC()
	{
		const name = 'testWildcardRoutingC';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testVariadicRouting0()
	{
		const name = 'testVariadicRouting0';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testVariadicRouting1()
	{
		const name = 'testVariadicRouting1';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testVariadicRouting2()
	{
		const name = 'testVariadicRouting2';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testVariadicRouting3()
	{
		const name = 'testVariadicRouting3';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testFunctionRouting()
	{
		const name = 'testFunctionRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testPromiseRouting()
	{
		const name = 'testPromiseRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testPromiseFailRouting()
	{
		const name = 'testPromiseFailRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testNotFoundRouting()
	{
		const name = 'testNotFoundRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}

	testUnexpectedErrorRouting()
	{
		const name = 'testUnexpectedErrorRouting';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.goto(`${hostname}`)
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ));
	}
}
