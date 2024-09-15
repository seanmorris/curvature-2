export const testEventDispatch = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Mixin = require('curvature/base/Mixin').Mixin;
	const EventTargetMixin = require('curvature/mixin/EventTargetMixin').EventTargetMixin;

	const Target = class extends Mixin.with(EventTargetMixin) {};
	const target = new Target;

	target.addEventListener('one',   event => document.body.innerHTML += 'First,');
	target.addEventListener('two',   event => document.body.innerHTML += 'Second,');
	target.addEventListener('three', event => document.body.innerHTML += 'Third');

	target.dispatchEvent('one');
	target.dispatchEvent('two');
	target.dispatchEvent('three');

	return document.body.innerHTML;
};
