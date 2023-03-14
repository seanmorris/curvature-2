export const testPausedInterval = () => {
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

	view.onInterval(100, cascade);

	setTimeout(() => {view.pause(true);  console.log('pausing...')},   10 + 100 * 64);
	setTimeout(() => {view.pause(false); console.log('unpausing...')}, 10 + 100 * 128);

	setTimeout(() => console.assert(x === 64, `Current x should be 64 rather than ${x}`),  10 + 100 * 96);
	setTimeout(() => console.assert(x === 64, `Current x should be 64 rather than ${x}`),  10 + 100 * 128);

	return require('Delay')(100 * 256).then(() => document.body.innerHTML);
};
