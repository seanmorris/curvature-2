export class Bindable {
	static isBindable(object)
	{
		if(!object.isBindable)
		{
			return false;
		}

		return object.isBindable === Bindable;
	}
	static makeBindable(object) {

		if(!object
			|| object.isBindable
			|| typeof object !== 'object'
			|| object instanceof Node
		) {
			return object;
		}

		Object.defineProperty(object, 'ref', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'bindTo', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'binding', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'bindingAll', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'isBindable', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'executing', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'stack', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'stackTime', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'before', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'after', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'toString', {
			enumerable: false
			, writable: true
		});

		Object.defineProperty(object, 'setCount', {
			enumerable: false
			, writable: true
		});

		object.isBindable = Bindable;
		object.binding    = {};
		object.bindingAll = [];
		object.bindTo     = ((object) => (property, callback = null) => {
			if(callback == null) {
				callback = property;
				object.bindingAll.push(callback);
				for(let i in object) {
					callback(object[i], i, object, false);
				}
				return;
			}

			if(!object.binding[property]) {
				object.binding[property] = [];
			}

			object.binding[property].push(callback);

			callback(object[property], property, object, false);

		})(object);

		object.stack      = [];
		object.stackTime  = [];
		object.before     = [];
		object.after      = [];
		object.setCount   = {};

		object.toString = ((object) => () => {
			if(typeof object == 'object')
			{
				return JSON.stringify(object);
				return '[object]'
			}

			return object;
		})(object);

		for(let i in object)
		{
			if(object[i]
				&& typeof object[i] == 'object'
				&& !object[i] instanceof Node
			){
				object[i] = Bindable.makeBindable(object[i]);
			}
		}

		let set = ((object) => (target, key, value) =>
		{
			if(target[key] === value && typeof value !== object)
			{
				return true;
			}

			// console.log(`Setting ${key}`, value);

			if(value && typeof value == 'object' && !(value instanceof Node))
			{
				if(value.isBindable !== Bindable)
				{
					value = Bindable.makeBindable(value);

					for(let i in value)
					{
						if(value[i] && typeof value[i] == 'object')
						{
							value[i] = Bindable.makeBindable(value[i]);
						}
					}
				}
			}

			for(let i in object.bindingAll)
			{
				object.bindingAll[i](value, key, target, false);
			}

			let stop = false;

			if(key in object.binding) {
				for(let i in object.binding[key])
				{
					if(object.binding[key][i](value, key, target, false) === false)
					{
						stop = true;
					}
				}
			}

			if(!stop)
			{
				target[key] = value;				
			}

			if(!target.setCount[key])
			{
				target.setCount[key] = 0;
			}

			target.setCount[key]++;

			const warnOn = 10;

			if(target.setCount[key] > warnOn && value instanceof Object)
			{
				console.log(
					'Warning: Resetting bindable reference "'
						+ key
						+ '" to object '
						+ target.setCount[key]
						+ ' times.'
				);
			}

			return true;
		})(object);

		let del = ((object) => (target, key) => {
			// console.log(key, 'DEL');

			if(!(key in target)) {
				return false;
			}

			for(let i in object.bindingAll) {
				object.bindingAll[i](undefined, key, target, true);
			}

			if(key in object.binding) {
				for(let i in object.binding[key]) {
					object.binding[key][i](undefined, key, target, true);
				}
			}

			if(Array.isArray(target)) {
				target.splice(key, 1);
			}
			else {
				delete target[key];
			}

			return true;
		})(object);

		let get = ((object) => (target, key) =>
		{
			if(typeof target[key] == 'function')
			{
				let newFunc = function() {
					target.executing = key;

					target.stack.unshift(key);
					target.stackTime.unshift((new Date).getTime());

					// console.log(`Start ${key}()`);

					for(let i in target.before)
					{
						target.before[i](target, key, object);
					}

					let ret = target[key].apply(target, arguments);

					for(let i in target.after)
					{
						target.after[i](target, key, object);
					}

					target.executing = null;

					let execTime = (new Date).getTime() - target.stackTime[0];

					if(execTime > 150)
					{
						// console.log(`End ${key}(), took ${execTime} ms`);
					}

					target.stack.shift();
					target.stackTime.shift();

					return ret;
				};

				return newFunc;
			}

			// console.log(`Getting ${key}`);

			return target[key];
		})(object);

		object.ref = new Proxy(object, {
			deleteProperty: del
			, get:          get
			, set:          set
		});

		return object.ref;
	}
	static clearBindings(object)
	{
		object.binding = {};
	}
}