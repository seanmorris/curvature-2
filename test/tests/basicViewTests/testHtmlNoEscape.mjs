export const testHtmlNoEscape = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('[[$html]]\n');

	view.render(document.body);

	view.args.html = '<u>html no escape test</u>'

	return document.body.innerHTML;
};

