import { TestBase } from './TestBase';
import { rawquire } from 'rawquire/rawquire.macro';

export class CvBindTagTest extends TestBase
{
	testValueIsPresent()
	{
		const name = 'testValueIsPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testValueIsTransfomed()
	{
		const name = 'testValueIsTransfomed';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testValueIsEscaped()
	{
		const name = 'testValueIsEscaped';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testValueIsNotEscaped()
	{
		const name = 'testValueIsNotEscaped';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testTemplateIsNotEscaped()
	{

	}

	testInterpolatedValueIsPresent()
	{
		const name = 'testInterpolatedValueIsPresent';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testInterpolatedValueIsEscaped()
	{
		const name = 'testInterpolatedValueIsEscaped';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testInterpolatedValueIsNotEscaped()
	{
		const name = 'testInterpolatedValueIsNotEscaped';

		return this.wrapTest(
			name,
			require(`./tests/${name}`)[name],
			rawquire(`./tests/${name}.txt`),
			true
		);
	}

	testInterpolatedTemplateIsEscaped(){}

	testInterpolatedTemplateIsNotEscaped(){}

	// testInterpolatedValueIsTransformed()
	// {
	// 	const name = 'testValueIsPresent';

	// 	return this.wrapTest(
	// 		name,
	// 		require(`./tests/${name}`)[name],
	// 		rawquire(`./tests/${name}.txt`),
	// 		true
	// 	);
	// }
}
