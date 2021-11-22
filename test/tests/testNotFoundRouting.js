export const testNotFoundRouting = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}


	const Router = require('curvature/base/Router').Router;
	const routes = {
		page: () => new Promise((accept,reject) => reject('Promise failure page!'))
		, '': 'index string!'
	};

	routes[Router.NotFoundError] = 'Error: 404';

	const View = require('curvature/base/View').View;
	const view = View.from('<b>[[content]]</b>\n');


	view.render(document.body);

	Router.listen(view, routes);

	Router.go('/doesnt-exist', -1);

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 1000);
	});
};
