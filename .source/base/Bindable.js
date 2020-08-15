const Ref        = Symbol('ref');
const Deck       = Symbol('deck');
const Binding    = Symbol('binding');
const BindingAll = Symbol('bindingAll');
const IsBindable = Symbol('isBindable')
const Executing  = Symbol('executing');
const Stack      = Symbol('stack');
const ObjSymbol  = Symbol('object');
const Wrapped    = Symbol('wrapped');

export class Bindable
{
	static isBindable(object)
	{
		if (!object[Binding])
		{
			return false;
		}

		return object[Binding] === Bindable;
	}

	static makeBindable(object)
	{
		return this.make(object);
	}

	static make(object)
	{
		if (!object
			|| !(object instanceof Object)
			|| object instanceof Node
			|| object instanceof IntersectionObserver
			|| Object.isSealed(object)
			|| !Object.isExtensible(object)
		) {
			// console.log('Cannot bind to object', object);
			return object;
		}

		if(object[Ref])
		{
			// console.log('Already bound to object', object[Ref]);
			return object;
		}

		if(object[Binding])
		{
			return object;
		}

		Object.defineProperty(object, Ref, {
			configurable: false
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

				for (let i in object) {
					callback(object[i], i, object, false);
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

			object[Binding][property].push(callback);

			callback(object[property], property, object, false);

			let cleaned = false;

			return () => {

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
			if(object[Deck][key] === value)
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
				if(value.___isBindable___ !== Bindable)
				{
					value = Bindable.makeBindable(value);

					if(this.isBindable(value))
					{
						for(let i in value)
						{
							if(value[i] && value[i] instanceof Object)
							{
								value[i] = Bindable.makeBindable(value[i]);
							}
						}
					}
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
			if(key === Ref || key === 'isBound')
			{
				return target[key];
			}

			if(target[key] instanceof Function)
			{
				if(target[Wrapped][key])
				{
					return target[Wrapped][key];
				}

				const descriptor = Object.getOwnPropertyDescriptor(object, key);

				if(descriptor && !descriptor.configurable && !descriptor.writable)
				{
					target[Wrapped][key] = target[key];

					return target[Wrapped][key];
				}

				target[Wrapped][key] = (...providedArgs) => {

					target[Executing] = key;

					target[Stack].unshift(key);

					for(let i in target.___before___)
					{
						target.___before___[i](target, key, target[Stack], object, providedArgs);
					}

					const objRef = (object instanceof Promise || object instanceof EventTarget)
						? object
						: object[Ref];

					const ret = target[key].apply(objRef, providedArgs);

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

		object[Ref] = new Proxy(object, {
			deleteProperty, construct, get, set
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
			// , object[Ref]
		);

		// object[BindingAll]  = [];
		// object.___after___  = [];
		// object.___before___ = [];

		// object[Ref]         = {};
		// object[Wrapped]     = {};
		// object[Binding]     = {};
	}

	static resolve(object, path, owner = false)
	{
		// console.log(path, object);

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
		 return (v,k,t,d) => {

			setTimeout(()=>callback(v,k,t,d,t[k]), delay);

		};
	}

	static wrapThrottleCallback(callback, throttle)
	{
		return ((callback) => {

			let throttle = false;

			return (v,k,t,d) => {

				if (throttle)
				{
					return;
				}

				callback(v,k,t,d,t[k]);

				throttle = true;

				setTimeout(()=> {throttle = false}, throttle);

			}
		})(callback);
	}

	static wrapWaitCallback(callback, wait)
	{
		let waiter = false;

		return (v,k,t,d) => {

			if (waiter)
			{
				clearTimeout(waiter);
				waiter = false;
			}

			waiter = setTimeout(()=> callback(v,k,t,d,t[k]), wait);
		};
	}

	static wrapFrameCallback(callback, frames)
	{
		return (v,k,t,d,p) => {
			requestAnimationFrame(() => callback(v,k,t,d,p));
		};
	}

	static wrapIdleCallback(callback)
	{
		return (v,k,t,d,p) => {
			requestIdleCallback(() => callback(v,k,t,d,p));
		};
	}
}
