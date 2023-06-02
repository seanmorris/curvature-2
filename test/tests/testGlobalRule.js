export const testGlobalRule = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const RuleSet = require('curvature/base/RuleSet').RuleSet;

	RuleSet.add('h1', tag => tag.setAttribute('data-modified', true));

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>Test!</h1>');

	view.render(document.body);

	return document.body.innerHTML;
};
