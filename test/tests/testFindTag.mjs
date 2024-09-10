export const testFindTag = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1></h1>');

	view.render(document.body);

	require('Delay')(100).then(() => {
		const h1x = document.querySelector('h1');
		const h1y = view.findTag('h1');

		h1x.innerText += 'Foo';
		h1y.innerText += 'Bar';
	});

	return require('Delay')(200).then(() => document.body.innerHTML);
};
