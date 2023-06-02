export const testList = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<pre cv-each = "numbers:number">[[number]]\n</pre>\n');

	view.render(document.body);

	view.args.numbers = Array.from(Array(32)).map((_,i) => i);

	return require('Delay')(10).then(() => document.body.innerHTML);;
};
