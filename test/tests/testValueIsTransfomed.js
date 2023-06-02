export const testValueIsTransfomed = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>[[value|reverse]]</h1>');

	view.reverse = string => String(string).split('').reverse().join('');

	view.render(document.body);

	view.args.value = 'Hello, world!';

	return document.body.innerHTML;
};
