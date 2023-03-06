export const testFormOutputFlicker = () => {
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
		const formTag = document.querySelector('form');

		formTag.style.display = 'flex';
		formTag.style.flexDirection = 'column';

		const cascade = () => {

			if(x > 128)
			{
				return;
			}

			form.args.value.title = x + ' this is the title';
			form.args.value.email = `me${x}@example.com`;
			form.args.value.body  = x + ' this is the message';

			view.args.number = x++;
		};

		setInterval(cascade, 10);


	}, 100);


	return require('Delay')(128 * 11).then(() => JSON.stringify(form.value, null, 4) + "\n");
};
