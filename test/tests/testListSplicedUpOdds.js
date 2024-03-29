export const testListSplicedUpOdds = () => {
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

		view.args.numbers.unshift(x++);

		while(view.args.numbers.length > 32)
		{
			view.args.numbers.pop();
		}

		for(let i = view.args.numbers.length; i > 0; i--)
		{
			if(view.args.numbers[i] % 2)
			{
				view.args.numbers.splice(i, 1);
			}
		}
	};

	setInterval(cascade, 10);

	return require('Delay')(160 * 10).then(() => document.body.innerHTML);
};
