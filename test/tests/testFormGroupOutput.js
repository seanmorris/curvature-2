export const testFormGroupOutput = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const Form = require('curvature/form/Form').Form;

	const view = View.from('[[form]]\n');

	view.render(document.body);

	const personField = {
		type:    'fieldset'
		, title: 'Person'
		, array: true
		, children: {
			id: {type:'number'}
			, name:  {}
		}
	};

	const peopleField = {
		type:    'fieldset'
		, title: 'People'
		, array: true
		, children: [
			personField
			, personField
			, personField
		]
	};

	const form = new Form({
		_method:  'POST'
		, people: peopleField
		, submit: {type: 'submit', value: 'submit'}
	});

	view.args.form = form;

	let x = 0;

	setTimeout(() => {
		const formTag = document.querySelector('form');

		formTag.style.display = 'flex';
		formTag.style.flexDirection = 'column';

		const cascade = () => {

			if(x > 128)
			{
				return;
			}

			form.args.value.people[x%3].id   = x;
			form.args.value.people[x%3].name = `me${x}@example.com`;

			x++;
		};

		setInterval(cascade, 10);

	}, 100);


	return new Promise(accept => {
		setTimeout(() => accept(JSON.stringify(form.value, null, 4) + "\n"), 3000);
	});
};
