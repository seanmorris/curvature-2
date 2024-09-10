export const testHrefPresent = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	window.prerenderer = true;

	const View = require('curvature/base/View').View;
	const view = View.from(`<a cv-link = "/about">about</a>`);

	view.render(document.body);

	return document.body.innerHTML;
	return require('Delay')(1_000_000_000).then(() => document.body.innerHTML);
};
