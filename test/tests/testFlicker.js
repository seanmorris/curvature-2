export const testFlicker = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>[[number]]</h1>\n');

	view.render(document.body);

	view.args.numbers = [];

	let x = 0;

	const cascade = () => {

		if(x > 128)
		{
			return;
		}

		view.args.number = x++;
	};

	setInterval(cascade, 10);

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 2000);
	});
};
