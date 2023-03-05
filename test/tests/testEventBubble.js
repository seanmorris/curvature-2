export const testEventBubble = () => {
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

	target.addEventListener('one', event => document.body.innerHTML += 'First,');
	targetParent.addEventListener('two', event => document.body.innerHTML += 'Second,');
	targetGrandparent.addEventListener('three', event => document.body.innerHTML += 'Third');

	target.dispatchEvent(new CustomEvent('one',   {bubbles: true}));
	target.dispatchEvent(new CustomEvent('two',   {bubbles: true}));
	target.dispatchEvent(new CustomEvent('three', {bubbles: true}));

	return require('Delay')(2000).then(() => document.body.innerHTML);
};
