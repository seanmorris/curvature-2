export const testTextField = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;

	const view = View.from(
		'<h1>[[value]]</h1><input cv-bind = "value" />\n'
	);

	view.render(document.body);

	const input = document.querySelector('input');

	input.value = 'something';

	input.dispatchEvent(new Event('input'));

	return document.body.innerHTML;
};
