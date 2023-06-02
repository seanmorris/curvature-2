export const testFindTags = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<h1></h1><h1></h1><h1></h1>');

	view.render(document.body);

	require('Delay')(100).then(() => {
		const h1s = view.findTags('h1');
		h1s.forEach((h,i) => h.innerText = i);
	});

	return require('Delay')(200).then(() => document.body.innerHTML);
};
