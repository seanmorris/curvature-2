export const testFocusOrder = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const View = require('curvature/base/View').View;
	const view = View.from('<input><input><input cv-bind = "value"><input>[[value]]');

	view.render(document.body);

	return document.body.innerHTML;

	// const Mixin = require('curvature/base/Mixin').Mixin;
	// const EventTargetMixin = require('curvature/mixin/EventTargetMixin').EventTargetMixin;

	// const Target = class extends Mixin.with(EventTargetMixin) {};
	// const target = new Target;

	// target.addEventListener('one',   event => document.body.innerHTML += 'First,');
	// target.addEventListener('two',   event => document.body.innerHTML += 'Second,');
	// target.addEventListener('three', event => document.body.innerHTML += 'Third');

	// target.dispatchEvent('one');
	// target.dispatchEvent('two');
	// target.dispatchEvent('three');

	// return new Promise(accept => {setTimeout(() => accept(document.body.innerHTML), 2_000)});
};
