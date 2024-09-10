export const testOnNextFrame = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	window.prerenderer = true;

	const View = require('curvature/base/View').View;
	const view = View.from(`[[foo]]`);

	view.args.foo = 100;

	view.render(document.body);

	view.onNextFrame(() => view.args.foo++);

	return require('Delay')(250).then(() => document.body.innerHTML);

	return document.body.innerHTML;
};
