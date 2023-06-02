export const testInterval = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>[[number]]</h1>');

	view.render(document.body);

	const h1 = document.querySelector('h1');

	view.args.numbers = [];

	let x = 0;

	const cascade = () => {

		if(x > 128)
		{
			return;
		}

		view.args.number = x;

		console.assert(String(x) === h1.innerText, `x [${x}] and H1 [${h1.innerText}] should match.`);

		x++;
	};

	view.onInterval(10, cascade);

	return require('Delay')(128 * 11).then(() => document.body.innerHTML);
};
