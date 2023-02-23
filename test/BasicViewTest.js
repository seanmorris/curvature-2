import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

const hostname = `file://${process.cwd()}/../html/index.html`;

console.log(process.cwd());

export class BasicViewTest extends TestBase
{
	testTemplate()
	{
		const name = 'testTemplate';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.startCoverage()
		// .then(() => this.pobot.goto(`${hostname}`))
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name])).then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ))
		// .then(() => this.pobot.takeCoverage())
		// .then(coverage => fsp.writeFile('/tmp/view-coverage.json', JSON.stringify(coverage, null, 4)))
		// .then(() => this.pobot.stopCoverage());
	}

	testFlicker()
	{
		const name = 'testFlicker';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.startCoverage()
		// .then(() => this.pobot.goto(`${hostname}`))
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ))
		// .then(() => this.pobot.takeCoverage())
		// .then(coverage => fsp.writeFile('/tmp/flicker-coverage.json', JSON.stringify(coverage, null, 4)))
		// .then(() => this.pobot.stopCoverage());
	}

	testHtmlEscape()
	{
		const name = 'testHtmlEscape';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.startCoverage()
		// .then(() => this.pobot.goto(`${hostname}`))
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result => this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ))
		// .then(() => this.pobot.takeCoverage())
		// .then(coverage => fsp.writeFile('/tmp/escape-coverage.json', JSON.stringify(coverage, null, 4)))
		// .then(() => this.pobot.stopCoverage());
	}

	testHtmlNoEscape()
	{
		const name = 'testHtmlNoEscape';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);

		// return this.pobot.startCoverage()
		// .then(() => this.pobot.goto(`${hostname}`))
		// .then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		// .then(result =>
		// this.assert(
		// 	result === rawquire(`./tests/${name}.txt`)
		// 	, 'Document body incorrect or corrupted.'
		// ))
		// .then(() => this.pobot.takeCoverage())
		// .then(coverage => fsp.writeFile('/tmp/no-escape-coverage.json', JSON.stringify(coverage, null, 4)))
		// .then(() => this.pobot.stopCoverage());
	}

	testViewEscaped()
	{
		const name = 'testViewEscaped';

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

	testViewNoEscape()
	{
		const name = 'testViewNoEscape';

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

	testList()
	{
		const name = 'testList';

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

	testListPrefill()
	{
		const name = 'testListPrefill';

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

	testListCascade()
	{
		const name = 'testListCascade';

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

	testListCascadeUp()
	{
		const name = 'testListCascadeUp';

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

	testListSplicedOdds()
	{
		const name = 'testListSplicedOdds';

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

	testListSplicedUpOdds()
	{
		const name = 'testListSplicedUpOdds';

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

	testObjectSetProperties()
	{
		const name = 'testObjectSetProperties';

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

	testObjectDeleteOdds()
	{
		const name = 'testObjectDeleteOdds';

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

	testObjectRefill()
	{
		const name = 'testObjectRefill';

		return this.pobot.goto(`${hostname}`)
		.then(() => this.pobot.inject(require(`./tests/${name}`)[name]))
		.then(result => this.assert(
			result === rawquire(`./tests/${name}.txt`)
			, 'Document body incorrect or corrupted.'
		));
	}
}

