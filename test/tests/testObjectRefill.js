export const testObjectRefill = () => {
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
	let y = 0;

	const cascade = () => {

		if(x > 25)
		{
			return;
		}

		view.args.keys[ 'prop-' + String.fromCharCode(97 + x++) ] = x;
	};

	const filter = () => {
		for(const key in view.args.keys)
		{
			if(view.args.keys[key] % 2)
			{
				delete view.args.keys[key];

				break;
			}
		}
	};

	const refill = () => {
		if(y > 25)
		{
			return;
		}

		view.args.keys[ 'prop-' + String.fromCharCode(97 + y++) ] = -25 + y;
	};

	setInterval(cascade, 10);


	setTimeout(() => {

		const filterInterval = setInterval(filter, 10)

		setTimeout(() => {
			clearInterval(filterInterval);
			setInterval(refill, 10)
		}, 1000);


	}, 1000);

	return new Promise(accept => {

		setTimeout(() => accept(document.body.innerHTML), 4000);
	});
};
