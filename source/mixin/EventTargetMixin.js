import { Mixin } from '../base/Mixin';

const Target = Symbol('Target');
const Parent = Symbol('Parent');

const CallHandler = Symbol('CallHandler');
const Capture     = Symbol('Capture');
const Bubble      = Symbol('Bubble');

const HandlersBubble  = Symbol('HandlersBubble');
const HandlersCapture = Symbol('HandlersCapture');

export const EventTargetMixin = {
	[Mixin.Constructor]()
	{
		this[HandlersCapture] = new Map;
		this[HandlersBubble]  = new Map;
	}

	, setParent(target)
	{
		this[Parent] = target;
	}

	, dispatchEvent(...args)
	{
		let event = args[0];

		if(typeof event === 'string')
		{
			event = new CustomEvent(event);

			args[0] = event;
		}

		event.cvPath   = event.cvPath || [];

		this[Capture](...args);

		const handlers = [];

		event.cvTarget = this;

		if(this[HandlersCapture].has(event.type))
		{
			handlers.push(...this[HandlersCapture].get(event.type));
		}

		if(this[HandlersBubble].has(event.type))
		{
			handlers.push(...this[HandlersBubble].get(event.type));
		}

		let result;

		for(const handler of handlers)
		{
			result = handler(event);

			if(result === false)
			{
				break;
			}
		}

		if(result !== false)
		{
			this[Bubble](...args);
		}

		if(!this[Parent])
		{
			Object.freeze(event.cvPath);
		}

		return event.returnValue;
	}

	, addEventListener(type, callback, options = {})
	{
		if(options === true)
		{
			options = {useCapture:true};
		}

		let handlers = HandlersBubble;

		if(options.useCapture)
		{
			handlers = HandlersCapture;
		}

		if(!this[handlers].has(type))
		{
			this[handlers].set(type, new Set);
		}

		this[handlers].get(type).add(callback);
	}

	, removeEventListener(type, callback, options)
	{
		if(options === true)
		{
			options = {useCapture:true};
		}

		let handlers = HandlersBubble;

		if(options.useCapture)
		{
			handlers = HandlersCapture;
		}

		if(!this[handlers].has(type))
		{
			return;
		}

		this[handlers].get(type).delete(callback);
	}

	, [Capture](...args)
	{
		const event = args[0];

		event.cvPath.push(this);

		if(!this[Parent])
		{
			return;
		}

		let result = this[Parent][Capture](...args);

		if(result === false)
		{
			return;
		}

		if(!this[Parent][HandlersCapture].has(event.type))
		{
			return;
		}

		event.cvCurrentTarget = this[Parent];

		for(const handler of this[Parent][HandlersCapture].get(event.type))
		{
			result = handler(event);

			if(result === false)
			{
				break;
			}
		}

		return result;
	}

	, [Bubble](...args)
	{
		const event = args[0];

		if(!event.bubbles || !this[Parent])
		{
			return;
		}

		if(!this[Parent][HandlersBubble].has(event.type))
		{
			return this[Parent][Bubble](...args);
		}

		let result;

		event.cvCurrentTarget = this[Parent];

		for(const handler of this[Parent][HandlersBubble].get(event.type))
		{
			result = handler(event);

			if(result === false)
			{
				return result;
			}
		}

		return this[Parent][Bubble](...args);
	}
}

Object.defineProperty(EventTargetMixin, 'Parent', {value:Parent});

Object.defineProperties(EventTargetMixin, {
	ALLOW_PROPAGATION:  {value: 0}
	, STOP_PROPAGATION: {value: 1}
	, ZERO_PROPAGATION: {value: 2}
});