export const testFocusClick = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<style type="text/css">input{width: 100px;} body{margin:0}</style><input><input><input cv-bind = "value"><input>[[value]]');

	view.render(document.body);
};
