import { Mixin } from '../base/Mixin';

const _EventTarget = Symbol('Target');

export const EventTargetMixin = {
	[Mixin.Constructor]()
	{
		try
		{
			this[_EventTarget] = new EventTarget;
		}
		catch(error)
		{
			this[_EventTarget] = document.createDocumentFragment();
		}
	}

	, dispatchEvent(...args)
	{
		let [event] = args;

		if(typeof event === 'string')
		{
			event = new CustomEvent(event);

			args[0] = event;
		}

		this[_EventTarget].dispatchEvent(...args);

		const defaultHandler = `on${event.type[0].toUpperCase() + event.type.slice(1)}`;

		if(typeof this[defaultHandler] === 'function')
		{
			this[defaultHandler](event);
		}

		return event.returnValue;
	}

	, addEventListener(...args)
	{
		this[_EventTarget].addEventListener(...args);
	}

	, removeEventListener(...args)
	{
		this[_EventTarget].removeEventListener(...args);
	}
}
