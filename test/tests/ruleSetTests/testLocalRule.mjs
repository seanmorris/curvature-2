export const testLocalRule = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>Test!</h1>');

	view.ruleSet.add('h1', tag => tag.setAttribute('data-modified', true));

	view.render(document.body);

	return document.body.innerHTML;
};
