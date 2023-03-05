export const testFlicker = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>[[number]]</h1>\n');

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

	setInterval(cascade, 10);

	return require('Delay')(2000).then(() => document.body.innerHTML);
};
