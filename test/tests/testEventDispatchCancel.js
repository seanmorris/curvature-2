export const testEventDispatchCancel = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Mixin = require('curvature/base/Mixin').Mixin;
	const EventTargetMixin = require('curvature/mixin/EventTargetMixin').EventTargetMixin;

	const Target = class extends Mixin.with(EventTargetMixin) {};
	const target = new Target;

	target.addEventListener('one',   event => false);
	target.addEventListener('one',   event => event.stopPropagation());
	target.addEventListener('one',   event => document.body.innerHTML += 'First,');

	target.addEventListener('two',   event => false);
	target.addEventListener('two',   event => document.body.innerHTML += 'Second,');

	target.addEventListener('three', event => document.body.innerHTML += 'Third');

	target.dispatchEvent(new CustomEvent('one'));
	target.dispatchEvent(new CustomEvent('two', {cancelable: true}));
	target.dispatchEvent(new CustomEvent('three'));

	return new Promise(accept => {
		setTimeout(() => accept(document.body.innerHTML), 2000);
	});
};
