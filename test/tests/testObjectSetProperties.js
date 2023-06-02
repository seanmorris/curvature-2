export const testObjectSetProperties = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from(
		'<pre cv-each = "keys:value:key">[[key]]: [[value]]\n</pre>\n'
	);

	view.render(document.body);

	view.args.keys = {};

	let x = 0;

	const cascade = () => {

		if(x > 25)
		{
			return;
		}

		view.args.keys[ 'prop-' + String.fromCharCode(97 + x++) ] = x;
	};

	setInterval(cascade, 10);

	return require('Delay')(2000).then(() => document.body.innerHTML);
};
