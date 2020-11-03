const Ref        = Symbol('ref');
const Original   = Symbol('original');
const Deck       = Symbol('deck');
const Binding    = Symbol('binding');
const SubBinding = Symbol('subBinding');
const BindingAll = Symbol('bindingAll');
const IsBindable = Symbol('isBindable');
const Executing  = Symbol('executing');
const Stack      = Symbol('stack');
const ObjSymbol  = Symbol('object');
const Wrapped    = Symbol('wrapped');
const GetProto   = Symbol('getProto');
const OnGet      = Symbol('onGet');
const OnAllGet   = Symbol('onAllGet');

export class Bindable
{
	static throttles = new WeakMap;

	static isBindable(object)
	{
		if (!object || !object[IsBindable])
		{
			return false;
		}

		return object[IsBindable] === Bindable;
	}

	static onDeck(object, key)
	{
		return object[Deck][key] || false;
	}

	static ref(object)
	{
		return object[Ref] || false;
	}

	static makeBindable(object)
	{
		return this.make(object);
	}

	static make(object)
	{
		if(!object || !['function', 'object'].includes(typeof object))
		{
			return object;
		}

		const win = window || {};

		const excludedClasses = [
			win.Node
			, win.Map
			, win.Set
			, win.ResizeObserver
			, win.MutationObserver
			, win.PerformanceObserver
			, win.IntersectionObserver
		].filter(x=>typeof x === 'function');

		if (excludedClasses.filter(x => object instanceof x).length
			|| Object.isSealed(object)
			|| !Object.isExtensible(object)
		) {
			return object;
		}

		if(object[Ref])
		{
			return object;
		}

		if(object[Binding])
		{
			return object;
		}

		Object.defineProperty(object, Ref, {
			configurable: true
			, enumerable: false
			, writable:   true
			, value:      object
		});

		Object.defineProperty(object, Deck, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      {}
		});

		Object.defineProperty(object, Binding, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      {}
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
			, value:      []
		});

		Object.defineProperty(object, IsBindable, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      Bindable
		});

		Object.defineProperty(object, Executing, {
			enumerable: false,
			writable: true
		});

		Object.defineProperty(object, Stack, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      []
		});

		Object.defineProperty(object, '___before___', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      []
		});

		Object.defineProperty(object, '___after___', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      []
		});

		Object.defineProperty(object, Wrapped, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      {}
		});

		const bindTo = (property, callback = null, options = {}) => {
			let bindToAll = false;

			if(Array.isArray(property))
			{
				const debinders = property.map(p => bindTo(p, callback, options));

				return () => debinders.map(d => d());
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
				let bindIndex = object[BindingAll].length;

				object[BindingAll].push(callback);

				if(!('now' in options) || options.now)
				{
					for (let i in object)
					{
						callback(object[i], i, object, false);
					}
				}

				return () => {
					delete object[BindingAll][bindIndex];
				};
			}

			if (!object[Binding][property])
			{
				object[Binding][property] = [];
			}

			let bindIndex = object[Binding][property].length;

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

			object[Binding][property].push(callback);

			if(!('now' in options) || options.now)
			{
				callback(object[property], property, object, false);
			}

			let cleaned = false;

			const debinder = () => {

				const subDebind = object[SubBinding].get(callback);

				if(subDebind)
				{
					object[SubBinding].delete(callback);

					subDebind();
				}

				if(cleaned)
				{
					return;
				}

				cleaned = true;

				if (!object[Binding][property])
				{
					return;
				}

				delete object[Binding][property][bindIndex];

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

			const beforeIndex = object.___before___.length;

			object.___before___.push(callback);

			let cleaned = false;

			return () => {

				if(cleaned)
				{
					return;
				}

				cleaned = true;

				delete object.___before___[beforeIndex];
			};
		};

		const ___after = (callback) => {

			const afterIndex = object.___after___.length;

			object.___after___.push(callback);

			let cleaned = false;

			return () => {

				if(cleaned)
				{
					return;
				}

				cleaned = true;

				delete object.___after___[afterIndex];
			};
		};

		Object.defineProperty(object, 'bindChain', {
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
						v = t[k] = this.makeBindable({});
					}

					debind = debind.concat(v.bindChain(rest, callback));
				}));

				// console.log(debind);

				return () => debind.map(x=>x());
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
			for (let i in object[BindingAll]) {
				if (object[BindingAll][i]) {
					return true;
				}
			}

			for (let i in object[Binding]) {
				for (let j in object[Binding][i]) {
					if (object[Binding][i][j]) {
						return true;
					}
				}
			}
			return false;
		};

		Object.defineProperty(object, 'isBound', {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      isBound
		});

		for (let i in object) {
			if (object[i]
				&& object[i] instanceof Object
				&& !object[i] instanceof Node
				&& !object[i] instanceof Promise
			) {
				object[i] = Bindable.make(object[i]);
			}
		}

		const set = (target, key, value) => {
			if(object[Deck][key] !== undefined && object[Deck][key] === value)
			{
				return true;
			}

			if(typeof key === 'string'
				&& key.substring(0,3) === '___'
				&& key.slice(-3) === '___'
			){
				return true;
			}

			if(target[key] === value)
			{
				return true;
			}

			if(value && value instanceof Object && !(value instanceof Node))
			{
				if(!Bindable.isBindable(value))
				{
					value = Bindable.makeBindable(value);
				}
			}

			object[Deck][key] = value;

			for(let i in object[BindingAll])
			{
				if(!object[BindingAll][i])
				{
					continue;
				}

				object[BindingAll][i](value, key, target, false);
			}

			let stop = false;

			if(key in object[Binding])
			{
				for(let i in object[Binding][key])
				{
					if(!object[Binding][key])
					{
						continue;
					}

					if(!object[Binding][key][i])
					{
						continue;
					}

					if (object[Binding][key][i](value, key, target, false, target[key]) === false)
					{
						stop = true;
					}
				}
			}

			delete object[Deck][key];

			if (!stop)
			{
				let descriptor = Object.getOwnPropertyDescriptor(target, key);

				let excluded = (
					target instanceof File
					&& key == 'lastModifiedDate'
				);

				if(!excluded
					&& (!descriptor || descriptor.writable)
					&& target[key] === value
				){
					target[key] = value;
				}
			}

			return Reflect.set(target, key, value);
		};

		const deleteProperty = (target, key) => {
			if(!(key in target))
			{
				return true;
			}

			for(let i in object[BindingAll])
			{
				object[BindingAll][i](undefined, key, target, true, target[key]);
			}

			if(key in object[Binding])
			{
				for(let i in object[Binding][key])
				{
					if(!object[Binding][key][i])
					{
						continue;
					}

					object[Binding][key][i](undefined, key, target, true, target[key]);
				}
			}

			delete target[key];

			return true;
		};

		const get = (target, key) => {
			if(key === Ref || key === 'isBound' || key === 'bindTo' || key === '__proto__')
			{
				return target[key];
			}

			const descriptor = Object.getOwnPropertyDescriptor(object, key);

			if(descriptor && !descriptor.configurable && !descriptor.writable)
			{
				return target[key];
			}

			if(object[OnAllGet])
			{
				return object[OnAllGet](key);
			}

			if(object[OnGet] && !(key in object))
			{
				return object[OnGet](key);
			}

			if(target[key] instanceof Function)
			{
				if(target[Wrapped][key])
				{
					return Bindable.make(target[Wrapped][key]);
				}

				if(descriptor && !descriptor.configurable && !descriptor.writable)
				{
					target[Wrapped][key] = target[key];

					return target[Wrapped][key];
				}

				target[Wrapped][key] = function(...providedArgs){

					target[Executing] = key;

					target[Stack].unshift(key);

					for(let i in target.___before___)
					{
						target.___before___[i](target, key, target[Stack], object, providedArgs);
					}

					const objRef = (
						object instanceof Promise
						|| object instanceof EventTarget
						|| object instanceof MutationObserver
						|| object instanceof IntersectionObserver
						|| object instanceof MutationObserver
						|| object instanceof PerformanceObserver
						|| (typeof ResizeObserver === 'function' && object instanceof ResizeObserver)
						|| object instanceof Map
						|| object instanceof Set
					)	? object
						: object[Ref];

					const ret = new.target
						? new target[key](...providedArgs)
						: target[key].apply(objRef || object, providedArgs);

					for(const i in target.___after___)
					{
						target.___after___[i](target, key, target[Stack], object, providedArgs);
					}

					target[Executing] = null;

					target[Stack].shift();

					return ret;
				};

				return target[Wrapped][key];
			}

			if(target[key] instanceof Object && !target[key][Ref])
			{
				Bindable.make(target[key]);
			}

			return target[key];
		};

		const construct = (target, args) => {

			const key = 'constructor';

			for(let i in target.___before___)
			{
				target.___before___[i](target, key, target[Stack], undefined, args);
			}

			const instance = Bindable.make( new target(...args) );

			for(let i in target.___after___)
			{
				target.___after___[i](target, key, target[Stack], instance, args);
			}

			return instance;
		};

		const getPrototypeOf = (target) => {
			if(GetProto in object)
			{
				return object[GetProto];
			}

			return Reflect.getPrototypeOf(target);
		}

		Object.defineProperty(object, Ref, {
			configurable: false
			, enumerable: false
			, writable:   true
			, value:      object[Ref]
		});

		Object.defineProperty(object, Original, {
			configurable: false
			, enumerable: false
			, writable:   false
			, value:      object
		});

		object[Ref] = new Proxy(object, {
			get, set, construct, getPrototypeOf, deleteProperty
		});

		return object[Ref];
	}

	static clearBindings(object) {
		const clearObj  = o => Object.keys(o).map(k => delete o[k]);
		const maps      = func => (...os) => os.map(func);
		const clearObjs = maps(clearObj);

		clearObjs(
			object[Wrapped]
			, object[Binding]
			, object[BindingAll]
			, object.___after___
			, object.___before___
		);
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
				let obj = this.makeBindable(object);

				return [obj, pathParts.shift(), top];
			}

			node = pathParts.shift();

			if(!node in object
				|| !object[node]
				|| !(object[node] instanceof Object)
			){
				object[node] = {};
			}

			object = this.makeBindable(object[node]);
		}

		return [this.makeBindable(object), node, top];
	}

	static wrapDelayCallback(callback, delay)
	{
		return (v,k,t,d) => setTimeout(()=>callback(v,k,t,d,t[k]), delay);
	}

	static wrapThrottleCallback(callback, throttle)
	{
		this.throttles.set(callback, false);

		return ((callback) => {

			return (v,k,t,d) => {

				if(this.throttles.get(callback, true))
				{
					return;
				}

				callback(v,k,t,d,t[k]);

				this.throttles.set(callback, true);

				setTimeout(()=> {this.throttles.set(callback, false)}, throttle);

			}
		})(callback);
	}

	static wrapWaitCallback(callback, wait)
	{
		let waiter = false;

		return (v,k,t,d,p,...args) => {

			if (waiter)
			{
				clearTimeout(waiter);
				waiter = false;
			}

			waiter = setTimeout(()=> callback(v,k,t,d,t[k],...args), wait);
		};
	}

	static wrapFrameCallback(callback, frames)
	{
		return (v,k,t,d,p,...args) => {
			requestAnimationFrame(() => callback(v,k,t,d,p,...args));
		};
	}

	static wrapIdleCallback(callback)
	{
		return (v,k,t,d,p,...args) => {
			// Compatibility for Safari 08/2020
			const req = window.requestIdleCallback || requestAnimationFrame;
			req(() => callback(v,k,t,d,p,...args));
		};
	}
}

Object.defineProperty(Bindable, 'OnGet', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      OnGet
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
