export const testUnexpectedErrorRouting = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const routes = {
		page: () => { throw new Error('Unexpected Error!!!') }
		, '': 'index string!'
	};

	const Router = require('curvature/base/Router').Router;

	routes[Router.InternalError] = 'Custom Error Page';

	const View = require('curvature/base/View').View;
	const view = View.from('<b>[[content]]</b>\n');

	view.render(document.body);

	Router.listen(view, routes);

	Router.go('/page', -1);

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 1000);
	});
};
