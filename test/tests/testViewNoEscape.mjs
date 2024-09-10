export const testViewNoEscape = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<p>[[$$view]]</p>\n');

	view.args.html = '<u>view no escape test</u>'

	view.render(document.body);

	view.args.view = '[[$html]]'
	view.args.html = '-<u>view no escape test</u>-'

	return document.body.innerHTML;
};

