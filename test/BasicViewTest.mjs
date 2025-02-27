import { BotTest } from 'cv3-test/BotTest.mjs';
import { Delay } from './helpers/Delay.mjs';

export class BasicViewTest extends BotTest
{
	startDocument = `file://${process.cwd()}/html/index.html`;
	helpers = [ { modules: [['Delay', Delay]] } ];
	testTemplate = this.generateTestMethod(`./tests/basicViewTests/testTemplate`);
	testFindTag = this.generateTestMethod(`./tests/basicViewTests/testFindTag`);
	testFindTags = this.generateTestMethod(`./tests/basicViewTests/testFindTags`);
	testListenSelf = this.generateTestMethod(`./tests/basicViewTests/testListenSelf`);
	testListenNode = this.generateTestMethod(`./tests/basicViewTests/testListenNode`);
	testFlicker = this.generateTestMethod(`./tests/basicViewTests/testFlicker`);
	testHtmlEscape = this.generateTestMethod(`./tests/basicViewTests/testHtmlEscape`);
	testHtmlNoEscape = this.generateTestMethod(`./tests/basicViewTests/testHtmlNoEscape`);
	testViewEscaped = this.generateTestMethod(`./tests/basicViewTests/testViewEscaped`);
	testViewNoEscape = this.generateTestMethod(`./tests/basicViewTests/testViewNoEscape`);
}
