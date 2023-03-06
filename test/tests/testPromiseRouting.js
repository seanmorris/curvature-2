export const testPromiseRouting = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const routes = {
		page: () => new Promise(accept => accept('Promise page!'))
		, '': 'index string!'
	};

	const Router = require('curvature/base/Router').Router;
	const View = require('curvature/base/View').View;
	const view = View.from('<b>[[content]]</b>\n');

	view.render(document.body);

	Router.listen(view, routes);

	Router.go('/page', -1);

	return require('Delay')(1).then(() => document.body.innerHTML);
};
