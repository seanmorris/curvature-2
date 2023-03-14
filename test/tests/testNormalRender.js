export const testNormalRender = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from(`<span cv-prerender = "never">never</span><span cv-prerender = "only">only</span>`);

	view.render(document.body);

	return document.body.innerHTML;
	return require('Delay')(1_000_000_000).then(() => document.body.innerHTML);
};
