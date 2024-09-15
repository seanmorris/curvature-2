export const testPausedTimeout = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	window.prerenderer = true;

	const View = require('curvature/base/View').View;
	const view = View.from(`[[foo]]`);

	view.args.foo = 100;

	view.onTimeout(200, () => view.args.foo++);

	setTimeout(() => view.pause(true), 100);
	setTimeout(() => view.pause(false), 300);

 	setTimeout(() => console.assert(Number(document.body.innerHTML) === 100, 'Body text should be 100 before timeout.'), 150);
 	setTimeout(() => console.assert(Number(document.body.innerHTML) === 100, 'Body text should be 100 before timeout.'), 250);
 	setTimeout(() => console.assert(Number(document.body.innerHTML) === 100, 'Body text should be 100 before timeout.'), 350);
 	setTimeout(() => console.assert(Number(document.body.innerHTML) === 101, 'Body text should be 101 after timeout.'), 450);

	view.render(document.body);

	return require('Delay')(1000).then(() => document.body.innerHTML);
	return document.body.innerHTML;
};
