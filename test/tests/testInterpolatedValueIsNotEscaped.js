export const testInterpolatedValueIsNotEscaped = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>The value "[[$value]]" is interpolated.</h1>');

	view.render(document.body);

	view.args.value = '<b>Hello, world!</b>';

	return document.body.innerHTML;
};
