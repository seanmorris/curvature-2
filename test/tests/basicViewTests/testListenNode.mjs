export const testListenNode = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>Title here</h1>[[wasClicked]]');

	view.args.wasClicked = '...';

	view.render(document.body);

	require('Delay')(100).then(() => {
		const h1 = document.querySelector('h1');
		view.listen(h1, 'click', event => view.args.wasClicked = 'clicked.');
		h1.click()
	});

	return require('Delay')(1000).then(() => document.body.innerHTML);
};
