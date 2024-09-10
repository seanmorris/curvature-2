const Ref         = Symbol('ref');
const Original    = Symbol('original');
const Deck        = Symbol('deck');
const Binding     = Symbol('binding');
const SubBinding  = Symbol('subBinding');
const BindingAll  = Symbol('bindingAll');
const IsBindable  = Symbol('isBindable');
const Wrapping    = Symbol('wrapping');
const Names       = Symbol('Names');
const Executing   = Symbol('executing');
const Stack       = Symbol('stack');
const ObjSymbol   = Symbol('object');
const Wrapped     = Symbol('wrapped');
const Unwrapped   = Symbol('unwrapped');
const GetProto    = Symbol('getProto');
const OnGet       = Symbol('onGet');
const OnAllGet    = Symbol('onAllGet');
const BindChain   = Symbol('bindChain');
const Descriptors = Symbol('Descriptors');
const Before      = Symbol('Before');
const After       = Symbol('After');
const NoGetters   = Symbol('NoGetters');
const Prevent     = Symbol('Prevent');

const TypedArray  = Object.getPrototypeOf(Int8Array);

const SetIterator = Set.prototype[Symbol.iterator];
const MapIterator = Map.prototype[Symbol.iterator];

const win = typeof globalThis === 'object' ? globalThis : (typeof window === 'object' ? window : (typeof self === 'object' ? self : this));

const isExcluded = object =>
       (typeof win.Map === 'function' && object instanceof win.Map)
	|| (typeof win.Set === 'function'                   && object instanceof win.Set)
	|| (typeof win.Node === 'function'                  && object instanceof win.Node)
	|| (typeof win.WeakMap === 'function'               && object instanceof win.WeakMap)
	|| (typeof win.Location === 'function'              && object instanceof win.Location)
	|| (typeof win.Storage === 'function'               && object instanceof win.Storage)
	|| (typeof win.WeakSet === 'function'               && object instanceof win.WeakSet)
	|| (typeof win.ArrayBuffer === 'function'           && object instanceof win.ArrayBuffer)
	|| (typeof win.Promise === 'function'               && object instanceof win.Promise)
	|| (typeof win.File === 'function'                  && object instanceof win.File)
	|| (typeof win.Event === 'function'                 && object instanceof win.Event)
	|| (typeof win.CustomEvent === 'function'           && object instanceof win.CustomEvent)
	|| (typeof win.Gamepad === 'function'               && object instanceof win.Gamepad)
	|| (typeof win.ResizeObserver === 'function'        && object instanceof win.ResizeObserver)
	|| (typeof win.MutationObserver === 'function'      && object instanceof win.MutationObserver)
	|| (typeof win.PerformanceObserver === 'function'   && object instanceof win.PerformanceObserver)
	|| (typeof win.IntersectionObserver === 'function'  && object instanceof win.IntersectionObserver)
	|| (typeof win.IDBCursor === 'function'             && object instanceof win.IDBCursor)
	|| (typeof win.IDBCursorWithValue === 'function'    && object instanceof win.IDBCursorWithValue)
	|| (typeof win.IDBDatabase === 'function'           && object instanceof win.IDBDatabase)
	|| (typeof win.IDBFactory === 'function'            && object instanceof win.IDBFactory)
	|| (typeof win.IDBIndex === 'function'              && object instanceof win.IDBIndex)
	|| (typeof win.IDBKeyRange === 'function'           && object instanceof win.IDBKeyRange)
	|| (typeof win.IDBObjectStore === 'function'        && object instanceof win.IDBObjectStore)
	|| (typeof win.IDBOpenDBRequest === 'function'      && object instanceof win.IDBOpenDBRequest)
	|| (typeof win.IDBRequest === 'function'            && object instanceof win.IDBRequest)
	|| (typeof win.IDBTransaction === 'function'        && object instanceof win.IDBTransaction)
	|| (typeof win.IDBVersionChangeEvent === 'function' && object instanceof win.IDBVersionChangeEvent)
	|| (typeof win.FileSystemFileHandle === 'function'  && object instanceof win.FileSystemFileHandle)
	|| (typeof win.RTCPeerConnection === 'function'     && object instanceof win.RTCPeerConnection)
	|| (typeof win.ServiceWorkerRegistration === 'function' && object instanceof win.ServiceWorkerRegistration);

export class Bindable
{
	static waiters   = new WeakMap;
	static throttles = new WeakMap;

	static isBindable(object)
	{
		if (!object || !object[IsBindable] || !object[Prevent])
		{
			return false;
		}

		return object[IsBindable] === Bindable;
	}

	static onDeck(object, key)
	{
		return object[Deck].get(key) || false;
	}

	static ref(object)
	{
		return object[Ref] || object || false;
	}

	static makeBindable(object)
	{
		return this.make(object);
	}

	static shuck(original, seen)
	{
		seen = seen || new Map;

		const clone = Object.create({});

		if(original instanceof TypedArray || original instanceof ArrayBuffer)
		{
			const clone = original.slice(0);
			seen.set(original, clone);
			return clone;
		}

		const properties = Object.keys(original);

		for(const i in properties)
		{
			const ii = properties[i];

			if(ii.substring(0, 3) === '___')
			{
				continue;
			}

			const alreadyCloned = seen.get(original[ii]);

			if(alreadyCloned)
			{
				clone[ii] = alreadyCloned;
				continue;
			}

			if(original[ii] === original)
			{
				seen.set(original[ii], clone);
				clone[ii] = clone;
				continue;
			}

			if(original[ii] && typeof original[ii] === 'object')
			{
				let originalProp = original[ii];

				if(Bindable.isBindable(original[ii]))
				{
					originalProp = original[ii][Original];
				}

				clone[ii] = this.shuck(originalProp, seen);
			}
			else
			{
				clone[ii] = original[ii];
			}

			seen.set(original[ii], clone[ii]);
		}

		if(Bindable.isBindable(original))
		{
			delete clone.bindTo;
			delete clone.isBound;
		}

		return clone;
	}

	static make(object)
	{
		if(object[Prevent])
		{
			return object;
		}

		if(!object || !['function', 'object'].includes(typeof object))
		{
			return object;
		}

		if(Ref in object)
		{
			return object[Ref];
		}

		if(object[IsBindable])
		{
			return object;
		}

		if(Object.isSealed(object)
			|| Object.isFrozen(object)
			|| !Object.isExtensible(object)
			|| isExcluded(object)
		){
			return object;
		}

		Object.defineProperty(object, IsBindable, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Bindable
		});

		Object.defineProperty(object, Ref, {
			configurable: true
			, enumerable: false
			, writable:   true
			, value:      false
		});

		Object.defineProperty(object, Original, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      object
		});

		Object.defineProperty(object, Deck, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Map
		});

		Object.defineProperty(object, Binding, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Object.create(null)
		});

		Object.defineProperty(object, SubBinding, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Map
		});

		Object.defineProperty(object, BindingAll, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Set
		});

		Object.defineProperty(object, Executing, {
			enumerable: false,
			writable: true
		});

		Object.defineProperty(object, Wrapping, {
			enumerable: false,
			writable: true
		});

		Object.defineProperty(object, Stack, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      []
		});

		Object.defineProperty(object, Before, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Set
		});

		Object.defineProperty(object, After, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Set
		});

		Object.defineProperty(object, Wrapped, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Object.preventExtensions(new Map)
		});

		Object.defineProperty(object, Unwrapped, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Object.preventExtensions(new Map)
		});


		Object.defineProperty(object, Descriptors, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Object.preventExtensions(new Map)
		});

		const bindTo = (property, callback = null, options = {}) => {

			let bindToAll = false;

			if(Array.isArray(property))
			{
				const debinders = property.map(p => bindTo(p, callback, options));

				return () => debinders.forEach(d => d());
			}

			if(property instanceof Function)
			{
				options   = callback || {};
				callback  = property;
				bindToAll = true;
			}

			if(options.delay >= 0)
			{
				callback = this.wrapDelayCallback(callback, options.delay);
			}

			if(options.throttle >= 0)
			{
				callback = this.wrapThrottleCallback(callback, options.throttle);
			}

			if (options.wait >= 0)
			{
				callback = this.wrapWaitCallback(callback, options.wait);
			}

			if(options.frame)
			{
				callback = this.wrapFrameCallback(callback, options.frame);
			}

			if(options.idle)
			{
				callback = this.wrapIdleCallback(callback);
			}

			if(bindToAll)
			{
				object[BindingAll].add(callback);

				if(!('now' in options) || options.now)
				{
					for(let i in object)
					{
						callback(object[i], i, object, false);
					}
				}

				return () => {
					object[BindingAll].delete(callback);
				};
			}

			if(!object[Binding][property])
			{
				object[Binding][property] = new Set;
			}

			// let bindIndex = object[Binding][property].length;

			if(options.children)
			{
				const original = callback;

				callback = (...args) => {

					const v = args[0];

					const subDebind = object[SubBinding].get(original);

					if(subDebind)
					{
						object[SubBinding].delete(original);

						subDebind();
					}

					if(typeof v !== 'object')
					{
						original(...args);
						return;
					}

					const vv = Bindable.make(v);

					if(Bindable.isBindable(vv))
					{
						object[SubBinding].set(original, vv.bindTo(
							(...subArgs) => original(...args, ...subArgs)
							, Object.assign({}, options, {children: false})
						));
					}

					original(...args);
				}
			}

			object[Binding][property].add(callback);

			if(!('now' in options) || options.now)
			{
				callback(object[property], property, object, false);
			}

			const debinder = () => {

				const subDebind = object[SubBinding].get(callback);

				if(subDebind)
				{
					object[SubBinding].delete(callback);

					subDebind();
				}

				if(!object[Binding][property])
				{
					return;
				}

				if(!object[Binding][property].has(callback))
				{
					return;
				}

				object[Binding][property].delete(callback);
			};

			if(options.removeWith && options.removeWith instanceof View)
			{
				options.removeWith.onRemove(()=>debinder);
			}

			return debinder;
		};

		Object.defineProperty(object, 'bindTo', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      bindTo
		});

		const ___before = (callback) => {
			object[Before].add(callback);
			return () => object[Before].delete(callback);
		};

		const ___after = (callback) => {
			object[After].add(callback);
			return () => object[After].delete(callback);
		};

		Object.defineProperty(object, BindChain, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      (path, callback) => {
				const parts    = path.split('.');
				const node     = parts.shift();
				const subParts = parts.slice(0);
				let   debind   = [];

				debind.push(object.bindTo(node, (v,k,t,d) => {

					const rest = subParts.join('.');

					if(subParts.length === 0)
					{
						callback(v,k,t,d);
						return;
					}

					if(v === undefined)
					{
						v = t[k] = this.make({});
					}

					debind = debind.concat(v[BindChain](rest, callback));
				}));

				return () => debind.forEach(x=>x());
			}
		});

		Object.defineProperty(object, '___before', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      ___before
		});

		Object.defineProperty(object, '___after', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      ___after
		});

		const isBound = () => {
			if(object[BindingAll].size)
			{
				return true;
			}

			for(const callbacks of Object.values(object[Binding]))
			{
				if(callbacks.size)
				{
					return true;
				}
				// for(let callback of callbacks)
				// {
				// 	if(callback)
				// 	{
				// 		return true;
				// 	}
				// }
			}

			return false;
		};

		Object.defineProperty(object, 'isBound', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      isBound
		});

		for(let i in object)
		{
			// const descriptors = Object.getOwnPropertyDescriptors(object);

			if(!object[i] || typeof object[i] !== 'object')
			{
				continue;
			}

			if(object[i][Ref] || object[i] instanceof Promise)
			{
				continue;
			}

			if(!Object.isExtensible(object[i]) || Object.isSealed(object[i]))
			{
				continue;
			}

			if(!isExcluded(object[i]))
			{
				object[i] = Bindable.make(object[i]);
			}
		}

		const descriptors = object[Descriptors];
		const wrapped     = object[Wrapped];
		const stack       = object[Stack];

		const set = (target, key, value) => {
			if(value && typeof value === 'object')
			{
				value = Bindable.make(value);

				if(target[key] === value)
				{
					return true;
				}
			}

			if(wrapped.has(key))
			{
				wrapped.delete(key);
			}

			const onDeck    = object[Deck];
			const isOnDeck  = onDeck.has(key);
			const valOnDeck = isOnDeck && onDeck.get(key);

			// if(onDeck[key] !== undefined && onDeck[key] === value)
			if(isOnDeck && valOnDeck === value)
			{
				return true;
			}

			if(key.slice && key.slice(-3) === '___' )
			{
				return true;
			}

			if(target[key] === value || (typeof value === 'number' && isNaN(valOnDeck) && isNaN(value)))
			{
				return true;
			}

			onDeck.set(key, value);

			for(const callback of object[BindingAll])
			{
				callback(value, key, target, false);
			}

			if(key in object[Binding])
			{
				for(const callback of object[Binding][key])
				{
					callback(value, key, target, false, target[key]);
				}
			}

			onDeck.delete(key);

			const excluded = win.File && target instanceof win.File && key == 'lastModifiedDate';

			if(!excluded)
			{
				Reflect.set(target, key, value);
			}

			if(Array.isArray(target) && object[Binding]['length'])
			{
				for(let i in object[Binding]['length'])
				{
					const callback = object[Binding]['length'][i];

					callback(target.length, 'length', target, false, target.length);
				}
			}

			return true;
		};

		const deleteProperty = (target, key) => {

			const onDeck    = object[Deck];
			const isOnDeck  = onDeck.has(key);

			if(isOnDeck)
			{
				return true;
			}

			if(!(key in target))
			{
				return true;
			}

			if(descriptors.has(key))
			{
				const descriptor = descriptors.get(key);

				if(descriptor && !descriptor.configurable)
				{
					return false;
				}

				descriptors.delete(key);
			}

			onDeck.set(key, null);

			if(wrapped.has(key))
			{
				wrapped.delete(key);
			}

			for(const callback of object[BindingAll])
			{
				callback(undefined, key, target, true, target[key]);
			}

			if(key in object[Binding])
			{
				for(const binding of object[Binding][key])
				{
					binding(undefined, key, target, true, target[key]);
				}
			}

			Reflect.deleteProperty(target, key);

			onDeck.delete(key);

			return true;
		};

		const construct = (target, args) => {

			const key = 'constructor';

			for(const callback of target[Before])
			{
				callback(target, key, object[Stack], undefined, args);
			}

			const instance = Bindable.make(new target[Original](...args));

			for(const callback of target[After])
			{
				callback(target, key, object[Stack], instance, args);
			}

			return instance;
		};

		const get = (target, key) => {

			if(wrapped.has(key))
			{
				return wrapped.get(key);
			}

			if(key === Ref
				|| key === Original
				|| key === 'apply'
				|| key === 'isBound'
				|| key === 'bindTo'
				|| key === '__proto__'
				|| key === 'constructor'
			){
				return object[key];
			}

			let descriptor;

			if(descriptors.has(key))
			{
				descriptor = descriptors.get(key)
			}
			else
			{
				descriptor = Object.getOwnPropertyDescriptor(object, key);

				descriptors.set(key, descriptor);
			}

			if(descriptor && !descriptor.configurable && !descriptor.writable)
			{
				return object[key];
			}

			if(OnAllGet in object)
			{
				return object[OnAllGet](key);
			}

			if((OnGet in object) && !(key in object))
			{
				return object[OnGet](key);
			}

			if(descriptor && !descriptor.configurable && !descriptor.writable)
			{
				wrapped.set(key, object[key]);

				return object[key];
			}

			if(typeof object[key] === 'function')
			{
				if(Names in object[key])
				{
					return object[key];
				}

				object[Unwrapped].set(key, object[key]);

				const prototype = Object.getPrototypeOf(object);
				const isMethod  = prototype[key] === object[key];
				const objRef = (
					// (typeof Promise === 'function'                    && object instanceof Promise)
					// || (typeof Storage === 'function'                 && object instanceof Storage)
					// || (typeof Map === 'function'                     && object instanceof Map)
					// || (typeof Set === 'function'                     && object instanceof Set)
					// || (typeof WeakMap === 'function'                 && object instanceof WeakMap)
					// || (typeof WeakSet === 'function'                 && object instanceof WeakSet)
					// || (typeof ArrayBuffer === 'function'             && object instanceof ArrayBuffer)
					// || (typeof ResizeObserver === 'function'          && object instanceof ResizeObserver)
					// || (typeof MutationObserver === 'function'        && object instanceof MutationObserver)
					// || (typeof PerformanceObserver === 'function'     && object instanceof PerformanceObserver)
					// || (typeof IntersectionObserver === 'function'    && object instanceof IntersectionObserver)
					isExcluded(object)
					|| (typeof object[Symbol.iterator] === 'function' && key === 'next')
					|| (typeof TypedArray === 'function'              && object instanceof TypedArray)
					|| (typeof EventTarget === 'function'             && object instanceof EventTarget)
					|| (typeof Date === 'function'                    && object instanceof Date)
					|| (typeof MapIterator === 'function'             && object.prototype === MapIterator)
					|| (typeof SetIterator === 'function'             && object.prototype === SetIterator)
				)	? object
					: object[Ref];

				const wrappedMethod = function(...providedArgs){

					object[Executing] = key;

					stack.unshift(key);

					for(const beforeCallback of object[Before])
					{
						beforeCallback(object, key, stack, object, providedArgs);
					}

					let ret;

					if(new.target)
					{
						ret = new (object[Unwrapped].get(key)) (...providedArgs);
					}
					else
					{
						const func = object[Unwrapped].get(key);

						if(isMethod)
						{
							ret = func.apply(objRef || object, providedArgs);
						}
						else
						{
							ret = func(...providedArgs);
						}
					}

					for(const afterCallback of object[After])
					{
						afterCallback(object, key, stack, object, providedArgs);
					}

					object[Executing] = null;

					stack.shift();

					return ret;
				}

				wrappedMethod[OnAllGet] = (_key) => object[key][_key];

				const result = Bindable.make(wrappedMethod);

				wrapped.set(key, result);

				return result;
			}

			return object[key];
		};

		const getPrototypeOf = (target) => {
			if(GetProto in object)
			{
				return object[GetProto];
			}

			return Reflect.getPrototypeOf(target);
		}

		const handlerDef = Object.create(null);

		handlerDef.set = set;
		handlerDef.construct = construct;
		handlerDef.deleteProperty = deleteProperty;

		if(!object[NoGetters])
		{
			handlerDef.getPrototypeOf = getPrototypeOf;
			handlerDef.get = get;
		}

		Object.defineProperty(object, Ref, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      new Proxy(object, handlerDef)
		});

		return object[Ref];
	}

	static clearBindings(object) {
		const maps      = func => (...os) => os.map(func);
		const clearObj  = o => Object.keys(o).map(k => delete o[k]);
		const clearObjs = maps(clearObj);

		object[BindingAll].clear();

		clearObjs(object[Wrapped], object[Binding], object[After], object[Before]);
	}

	static resolve(object, path, owner = false)
	{
		let node;
		let pathParts = path.split('.');
		let top       = pathParts[0];

		while(pathParts.length)
		{
			if(owner && pathParts.length === 1)
			{
				let obj = this.make(object);

				return [obj, pathParts.shift(), top];
			}

			node = pathParts.shift();

			if(!(node in object)
				|| !object[node]
				|| !(typeof object[node] === 'object')
			){
				object[node] = Object.create(null);
			}

			object = this.make(object[node]);
		}

		return [this.make(object), node, top];
	}

	static wrapDelayCallback(callback, delay)
	{
		return (...args) => setTimeout(()=>callback(...args), delay);
	}

	static wrapThrottleCallback(callback, throttle)
	{
		this.throttles.set(callback, false);

		return (...args) => {

			if(this.throttles.get(callback, true))
			{
				return;
			}

			callback(...args);

			this.throttles.set(callback, true);

			setTimeout(()=> {this.throttles.set(callback, false)}, throttle);

		};
	}

	static wrapWaitCallback(callback, wait)
	{
		return (...args) => {

			let waiter;

			if(waiter = this.waiters.get(callback))
			{
				this.waiters.delete(callback);
				clearTimeout(waiter);
			}

			waiter = setTimeout(() => callback(...args), wait);

			this.waiters.set(callback, waiter);
		};
	}

	static wrapFrameCallback(callback, frames)
	{
		return (...args) => {
			requestAnimationFrame(() => callback(...args));
		};
	}

	static wrapIdleCallback(callback)
	{
		return (...args) => {
			// Compatibility for Safari 08/2020
			const req = window.requestIdleCallback || requestAnimationFrame;
			req(() => callback(...args));
		};
	}
}

Object.defineProperty(Bindable, 'Prevent', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      Prevent
});

Object.defineProperty(Bindable, 'OnGet', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      OnGet
});

Object.defineProperty(Bindable, 'NoGetters', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      NoGetters
});

Object.defineProperty(Bindable, 'GetProto', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      GetProto
});

Object.defineProperty(Bindable, 'OnAllGet', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      OnAllGet
});
