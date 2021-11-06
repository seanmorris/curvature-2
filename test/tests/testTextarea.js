export const testTextarea = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;

	const view = View.from(
		'<h1>[[value]]</h1><textarea cv-bind = "value"></textarea>\n'
	);

	view.render(document.body);

	const textarea = document.querySelector('textarea');

	textarea.value = 'something';

	textarea.dispatchEvent(new Event('input'));

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 1000);
	});
};
