export const testFocusOrder = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<input><input><input cv-bind = "value"><input>[[value]]');

	view.render(document.body);

	return require('Delay')(100).then(() => document.body.innerHTML);
};
