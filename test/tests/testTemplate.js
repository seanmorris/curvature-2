export const testTemplate = () => {

	console.assert(true, 'this is an internal assertion');
	console.assert(false, 'this is an internal assertion');
	console.assert(true, 'this is an internal assertion');
	console.assert(true, 'this is an internal assertion');

	document.addEventListener('mousemove', ({x,y}) => console.log({x,y}));

	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	console.log('Document cleared.');

	const View = require('curvature/base/View').View;
	const view = View.from('<h1>Test!</h1>\n');

	view.render(document.body);

	console.log('Test complete.');
	console.dir({a:1,b:['a', 'b', 'c']});

	// return new Promise(accept => {
	// 	setTimeout(() => accept(document.body.innerHTML), 2000 * 1000);
	// });

	return document.body.innerHTML;
};
