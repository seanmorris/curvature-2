export const testListPrefill = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from(
		'<pre cv-each = "numbers:number">[[number]]\n</pre>\n'
	);

	// Load the data BEFORE the render call:
	view.args.numbers = Array.from(Array(32)).map((_,i) => i);

	view.render(document.body);

	return require('Delay')(10).then(() => document.body.innerHTML);
};
