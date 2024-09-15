export const testModelCreation = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Model  = require('curvature/model/Model').Model;

	const modelA = Model.from({id: 1, type: 'something', value: 'foobar'});
	const modelB = Model.from({id: 2, type: 'something', value: 'foobar'});

	const modelA2 = Model.from({id: 1, type: 'something', value: 'foobar updated 1'});
	const modelB2 = Model.from({id: 2, type: 'something', value: 'foobar updated 2'});

	console.assert(modelA === modelA2, 'Model references should be identical.');
	console.assert(modelB === modelB2, 'Model references should be identical.');

	console.assert(modelA.value === 'foobar updated 1', 'Model value should be updated.');
	console.assert(modelB.value === 'foobar updated 2', 'Model value should be updated.');

	const p1 = document.createElement('p');
	const p2 = document.createElement('p');

	p1.innerText = modelA.value;
	p2.innerText = modelB.value;

	document.body.append(p1);
	document.body.append(p2);

	return document.body.innerHTML;
};
