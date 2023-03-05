export const testEventCaptureCancel = () => {
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

	targetGrandparent.addEventListener('one',   event => document.body.innerHTML += 'First,', {useCapture:true});

	targetGrandparent.addEventListener('one',   event => event.stopPropagation(), {useCapture:true});
	targetGrandparent.addEventListener('two',   event => false, {useCapture:true});
	targetGrandparent.addEventListener('three', event => event.stopPropagation(), {useCapture:true});

	targetParent.addEventListener('two', event => document.body.innerHTML += 'Second,', {useCapture:true});

	target.addEventListener('three', event => document.body.innerHTML += 'Third');

	target.dispatchEvent(new CustomEvent('one'));
	target.dispatchEvent(new CustomEvent('two',   {cancelable: true}));
	target.dispatchEvent(new CustomEvent('three', {cancelable: true}));

	return document.body.innerHTML;
};
