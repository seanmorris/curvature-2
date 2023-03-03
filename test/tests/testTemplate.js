export const testTemplate = () => {

	console.log('Clearing document...');

	document.addEventListener('mousemove', ({x,y}) => console.log({x,y}));

	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	console.log('Starting test...');

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>Test!</h1>\n');

	view.render(document.body);

	console.log('Test complete.');

	return document.body.innerHTML;
};
