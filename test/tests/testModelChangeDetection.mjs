export const testModelChangeDetection = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Model   = require('curvature/model/Model').Model;
	const Changed = Model.Changed;

	const model = Model.from({id: 1, type: 'something', value: 'foobar'});

	const a = document.createElement('p');
	const b = document.createElement('p');
	const c = document.createElement('p');
	const d = document.createElement('p');
	const e = document.createElement('p');

	document.body.append(a);
	document.body.append(b);
	document.body.append(c);
	document.body.append(d);
	document.body.append(e);

	a.innerText = JSON.stringify(model[Changed]);

	model.value = 'updated';

	b.innerText = JSON.stringify(model[Changed]);

	model.markStored();

	c.innerText = JSON.stringify(model[Changed]);

	model.value = 'updated 2';

	d.innerText = JSON.stringify(model[Changed]);

	model.markDeleted();

	e.innerText = JSON.stringify(model[Changed]);

	return document.body.innerHTML;
};
