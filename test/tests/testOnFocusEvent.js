export const testOnFocusEvent = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<textarea cv-on = "click"></textarea>[[wasFocused]]');
	view.click = () => view.args.wasFocused = 'something';

	view.render(document.body);

	setTimeout(() => document.querySelector('textarea').click(), 250);

	return require('Delay')(300).then(() => document.body.innerHTML);
};
