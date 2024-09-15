export const testViewIsPresent = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;

	const view = View.from('<div cv-view = "foobar">this is a [[xyz]]</div>');

	view.render(document.body);

	view.views.get('foobar').args.xyz = 'subview';

	return document.body.innerHTML;
};
