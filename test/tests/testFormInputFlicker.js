export const testFormInputFlicker = () => {
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

	let x = 0;

	setTimeout(() => {
		const form = document.querySelector('form');

		form.style.display = 'flex';
		form.style.flexDirection = 'column';

		const title = document.querySelector('[name=title]');
		const email = document.querySelector('[name=email]');
		const body  = document.querySelector('[name=body]');

		const cascade = () => {

			if(x > 128)
			{
				return;
			}

			title.value = x + ' this is the title';
			email.value = `me${x}@example.com`;
			body.value  = x + ' this is the message';

			title.dispatchEvent(new Event('input'));
			email.dispatchEvent(new Event('input'));
			body.dispatchEvent(new Event('input'));

			view.args.number = x++;
		};

		setInterval(cascade, 10);


	}, 100);


	return require('Delay')(128 * 11).then(() => JSON.stringify(form.value, null, 4) + "\n");
};
