export const testTemplate = () => {
	console.log('Clearing document...');

	// console.dir('Testing console.dir...');
	// console.log('Testing console.log...');
	// console.warn('Testing console.warn...');
	// console.error('Testing console.error...');
	// console.trace('Testing console.trace...');
	// console.assert(false, 'Testing console.assert');

	// throw new Error('xyz');

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
