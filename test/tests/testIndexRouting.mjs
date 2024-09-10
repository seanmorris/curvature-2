export const testIndexRouting = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const routes = {page: 'page string!', '': 'index string!'};

	const Router = require('curvature/base/Router').Router;
	const View = require('curvature/base/View').View;
	const view = View.from('<b>[[content]]</b>');

	view.render(document.body);

	Router.listen(view, routes);

	Router.go('', -1);

	return require('Delay')(1).then(() => document.body.innerHTML);
};
