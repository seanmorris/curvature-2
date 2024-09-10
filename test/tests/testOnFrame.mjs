export const testOnFrame = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	window.prerenderer = true;

	const View = require('curvature/base/View').View;
	const view = View.from(`[[foo]]`);

	view.args.foo = 100;

	view.render(document.body);

	const cancel = view.onFrame(() => view.args.foo++);

	setTimeout(cancel, 1000);

	return require('Delay')(2000).then(() => String(document.body.innerHTML).substring(0,2));

	return document.body.innerHTML;
};
