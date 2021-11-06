export const testFormBasic = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const Form = require('curvature/form/Form').Form;

	const view = View.from('[[form]]\n');

	view.render(document.body);

	const form = view.args.form = new Form({
		title: {}
		, email: {}
		, body: {type: 'textarea'}
	});

	setTimeout(() => {
		const form = document.querySelector('form');

		form.style.display = 'flex';
		form.style.flexDirection = 'column';

		const title = document.querySelector('[name=title]');
		const email = document.querySelector('[name=email]');
		const body  = document.querySelector('[name=body]');

		title.value = 'this is the title';
		email.value = 'me@example.com';
		body.value  = 'this is the message';

		title.dispatchEvent(new Event('input'));
		email.dispatchEvent(new Event('input'));
		body.dispatchEvent(new Event('input'));

	}, 100);


	return new Promise(accept => {
		setTimeout(() => accept(JSON.stringify(form.value, null, 4) + "\n"), 1000);
	});
};
