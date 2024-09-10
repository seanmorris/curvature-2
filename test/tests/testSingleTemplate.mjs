export const testSingleTemplate = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from(
		`<template cv-template = "foobar">This is a <b>template</b>. It can have HTML, [[a]] <span cv-bind = "b"></span> and everything else View templates can use.</template>`
		+ `<div cv-slot = "foobar"></div>`
	);

	view.render(document.body);

	view.args.a = 'interpolation';
	view.args.b = 'cv-tags';

	return document.body.innerHTML;
	return require('Delay')(1_000_000_000).then(() => document.body.innerHTML);
};
