export const testListCascade = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<pre cv-each = "numbers:number">[[number]]\n</pre>');

	view.render(document.body);

	view.args.numbers = [];

	let x = 0;

	const cascade = () => {

		if(x > 128)
		{
			return;
		}

		view.args.numbers.push(x++);

		while(view.args.numbers.length > 32)
		{
			view.args.numbers.shift();
		}
	};

	setInterval(cascade, 10);

	return require('Delay')(160 * 10).then(() => document.body.innerHTML);
};
