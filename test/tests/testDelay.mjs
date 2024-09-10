export const testDelay = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const a = document.createElement('p');
	const b = document.createElement('p');

	const Bindable = require('curvature/base/Bindable').Bindable;

	const obj = Bindable.make({});

	let outer = 99;

	obj.bindTo('x', v => outer = v, {delay: 50});

	obj.x = 100;

	a.innerText = outer;
	document.body.append(a);

	const delay = require('Delay');

	delay(100).then(() => {
		b.innerText = outer;
		document.body.append(b);
	});

	return delay(250).then(() => document.body.innerHTML);
};
