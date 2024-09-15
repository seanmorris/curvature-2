export const testClearInterval = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	window.prerenderer = true;

	const View = require('curvature/base/View').View;
	const view = View.from(`[[foo]]`);

	view.args.foo = 100;

	view.onTimeout(50, () => console.assert(Number(document.body.innerHTML) === 100, 'Body text should be 100 before timeout.'));

	timer = view.onInterval(100, () => view.args.foo++);

	setTimeout(() => view.clearInterval(timer), 350);

	view.render(document.body);

	return require('Delay')(500).then(() => document.body.innerHTML);
	return document.body.innerHTML;
};
