export const testOptionalNamedArgRouting = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const routes = {
		page: 'page string!'
		, '': 'index string!'
		, 'var/%abc/%xyz':  args => args.abc + '::'  + args.xyz
		, 'var/%abc/%xyz?': args => args.abc + ':::' + args.xyz
	};

	const Router = require('curvature/base/Router').Router;
	const View = require('curvature/base/View').View;
	const view = View.from('<b>[[content]]</b>');

	view.render(document.body);

	Router.listen(view, routes);


	Router.go('/var/foo', -1);

	return document.body.innerHTML;
};
