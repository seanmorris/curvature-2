export const testTemplate = () => {
	console.log('Clearing document...');

	// console.error('Testing console.error...');
	// console.warn('Testing console.warn...');
	// console.log('Testing console.log...');
	// console.dir('Testing console.dir...');
	// console.assert(false, 'Testing console.assert (error)...');
	// console.assert(false, 'Testing console.assert (warn)...', 3);
	// console.assert(false, 'Testing console.assert (notice)...', 4);
	console.trace('Testing console.trace...');

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
