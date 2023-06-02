export const testViewEscaped = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<p>[[view]]</p>\n');

	view.render(document.body);

	view.args.view = '[[escaped]]'
	view.args.escaped = '<u>view escape test</u>'

	return document.body.innerHTML;
};

