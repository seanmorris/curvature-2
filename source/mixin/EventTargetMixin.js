import { Mixin } from '../base/Mixin';

const EventTargetParent = Symbol('EventTargetParent');
const CallHandler = Symbol('CallHandler');
const Capture     = Symbol('Capture');
const Bubble      = Symbol('Bubble');
const Target      = Symbol('Target');

const HandlersBubble  = Symbol('HandlersBubble');
const HandlersCapture = Symbol('HandlersCapture');

export const EventTargetMixin = {
	[Mixin.Constructor]()
	{
		this[HandlersCapture] = new Map;
		this[HandlersBubble]  = new Map;
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
		event.cvTarget = event.cvCurrentTarget = this;

		let result = this[Capture](...args);

		if(event.cancelable && (result === false || event.cancelBubble))
		{
			return result;
		}

		const handlers = [];

		if(this[HandlersCapture].has(event.type))
		{
			const handlerMap  = this[HandlersCapture].get(event.type);
			const newHandlers = [...handlerMap];

			newHandlers.forEach(h => h.push(handlerMap));

			handlers.push(...newHandlers);
		}

		if(this[HandlersBubble].has(event.type))
		{
			const handlerMap  = this[HandlersBubble].get(event.type);
			const newHandlers = [...handlerMap];

			newHandlers.forEach(h => h.push(handlerMap));

			handlers.push(...newHandlers);
		}

		handlers.push([() => this[CallHandler](...args), {}, null]);

		for(const [handler, options, map] of handlers)
		{
			if(options.once)
			{
				map.delete(handler);
			}

			result = handler(event);

			if(event.cancelable && result === false)
			{
				break;
			}
		}

		if(!event.cancelable || (!event.cancelBubble && result !== false))
		{
			this[Bubble](...args);
		}

		if(!this[EventTargetParent])
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
			this[handlers].set(type, new Map);
		}

		this[handlers].get(type).set(callback, options);

		if(options.signal)
		{
			options.signal.addEventListener(
				'abort'
				, event => this.removeEventListener(type, callback, options)
				, {once:true}
			);
		}
	}

	, removeEventListener(type, callback, options = {})
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

		if(!this[EventTargetParent])
		{
			return;
		}

		let result = this[EventTargetParent][Capture](...args);

		if(event.cancelable && (result === false || event.cancelBubble))
		{
			return;
		}

		if(!this[EventTargetParent][HandlersCapture].has(event.type))
		{
			return;
		}

		event.cvCurrentTarget = this[EventTargetParent];

		const { type } = event;
		const handlers = this[EventTargetParent][HandlersCapture].get(type);

		for(const [handler, options] of handlers)
		{
			if(options.once)
			{
				handlers.delete(handler);
			}

			result = handler(event);

			if(event.cancelable && (result === false || event.cancelBubble))
			{
				break;
			}
		}

		return result;
	}

	, [Bubble](...args)
	{
		const event = args[0];

		if(!event.bubbles || !this[EventTargetParent] || event.cancelBubble)
		{
			return;
		}

		if(!this[EventTargetParent][HandlersBubble].has(event.type))
		{
			return this[EventTargetParent][Bubble](...args);
		}

		let result;

		event.cvCurrentTarget = this[EventTargetParent];

		const { type } = event;
		const handlers = this[EventTargetParent][HandlersBubble].get(event.type);

		for(const [handler, options] of handlers)
		{
			if(options.once)
			{
				handlers.delete(handler);
			}

			result = handler(event);

			if(event.cancelable && result === false)
			{
				return result;
			}
		}

		result = this[EventTargetParent][CallHandler](...args);

		if(event.cancelable && (result === false || event.cancelBubble))
		{
			return result;
		}

		return this[EventTargetParent][Bubble](...args);
	}

	, [CallHandler](...args)
	{
		const event = args[0];

		if(event.defaultPrevented)
		{
			return;
		}

		const defaultHandler = `on${event.type[0].toUpperCase() + event.type.slice(1)}`;

		if(typeof this[defaultHandler] === 'function')
		{
			return this[defaultHandler](event);
		}
	}
}

Object.defineProperty(EventTargetMixin, 'Parent', {value:EventTargetParent});
