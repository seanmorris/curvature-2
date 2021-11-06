export const testHtmlField = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;

	const view = View.from(
		'<div contenteditable = "true" cv-bind = "value"></div>\n'
	);

	view.render(document.body);

	view.args.value = 'something';

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 1000);
	});
};
