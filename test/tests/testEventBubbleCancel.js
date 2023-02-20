export const testEventBubbleCancel = () => {
	while(document.body.firstChild)
	{
		document.body.firstChild.remove();
	}

	const Mixin = require('curvature/base/Mixin').Mixin;
	const EventTargetMixin = require('curvature/mixin/EventTargetMixin').EventTargetMixin;

	const Target = class extends Mixin.with(EventTargetMixin) {};

	const target = new Target;
	const targetParent = new Target;
	const targetGrandparent = new Target;

	target[EventTargetMixin.Parent] = targetParent;
	targetParent[EventTargetMixin.Parent] = targetGrandparent;

	target.addEventListener('one', event => event.stopPropagation());
	target.addEventListener('one', event => document.body.innerHTML += 'First,');

	target.addEventListener('two', event => false);

	target.addEventListener('three', event => event.stopPropagation());

	targetParent.addEventListener('two', event => document.body.innerHTML += 'Second,');
	targetGrandparent.addEventListener('three', event => document.body.innerHTML += 'Third');

	target.dispatchEvent(new CustomEvent('one', {bubbles: true}));
	target.dispatchEvent(new CustomEvent('two', {bubbles: true, cancelable: true}));
	target.dispatchEvent(new CustomEvent('three', {bubbles: true, cancelable: true}));

	return new Promise(accept => setTimeout(() => accept(document.body.innerHTML), 2000));
};
