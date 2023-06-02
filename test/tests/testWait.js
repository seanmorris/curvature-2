export const testWait = () => {
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
	}, {wait: 50});

	const timeout  = setTimeout(() => clearInterval(interval), 500);
	const interval = setInterval(() => obj.x = obj.x + 1, 45);

	return require('Delay')(1000).then(() => document.body.innerHTML);
};
