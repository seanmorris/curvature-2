export const testValueIsPresent = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1 cv-bind = "value"></h1>');

	view.render(document.body);

	view.args.value = 'Hello, world!';

	return document.body.innerHTML;
};
