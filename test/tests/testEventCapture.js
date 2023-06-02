export const testEventCapture = () => {
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

	targetGrandparent.addEventListener('one', event => document.body.innerHTML += 'First,', {useCapture:true});
	targetParent.addEventListener('two', event => document.body.innerHTML += 'Second,', {useCapture:true});
	target.addEventListener('three', event => document.body.innerHTML += 'Third');

	const one   = new CustomEvent('one');
	const two   = new CustomEvent('two');
	const three = new CustomEvent('three');

	target.dispatchEvent(one);
	target.dispatchEvent(two);
	target.dispatchEvent(three);

	return document.body.innerHTML;
};
