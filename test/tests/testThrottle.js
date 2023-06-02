export const testThrottle = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Bindable = require('curvature/base/Bindable').Bindable;

	const obj = Bindable.make({});

	obj.x = 100;

	obj.bindTo('x', v => {
		const a = document.createElement('p');
		a.innerText = v;
		document.body.append(a);

	}, {throttle: 50});

	const timeout  = setTimeout(() => clearInterval(interval), 500);
	const interval = setInterval(() => obj.x = obj.x + 100, 25);

	return require('Delay')(1000).then(() => document.body.innerHTML);
};
