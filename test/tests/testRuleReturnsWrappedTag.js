export const testRuleReturnsWrappedTag = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const Tag  = require('curvature/base/Tag').Tag;
	const view = View.from('<h1></h1>');

	view.ruleSet.add('h1', tag => new Tag('<span>this is a wrapped tag.</span>'));

	view.render(document.body);

	return document.body.innerHTML;
};
