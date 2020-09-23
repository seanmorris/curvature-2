import { Bindable } from './Bindable';

const Constructor = Symbol('constructor');
const MixinList   = Symbol('mixinList');

export class Mixin
{
	static from(baseClass, ...mixins)
	{
		const constructors = [];

		const newClass = class  extends baseClass { constructor(...args) {

			super(...args);

			for(const mixin of mixins)
			{
				if(mixin[ Mixin.constructor ])
				{
					mixin[ Mixin.constructor ].apply(this);
				}

				switch(typeof mixin)
				{
					// case 'function':
					// 	this.mixClass(mixin, newClass);
					// 	break;

					case 'object':
						Mixin.mixObject(mixin, this);
						break;
				}
			}

		}};

		return newClass;
	}

	static with(...mixins)
	{
		return this.from(Object, ...mixins);
	}

	static mixObject(mixin, instance)
	{
		for(const func of Object.getOwnPropertyNames(mixin))
		{
			if(typeof mixin[func] === 'function')
			{
				instance[func] = mixin[func].bind(instance);

				continue;
			}

			instance[func] = mixin[func];
		}

		for(const func of Object.getOwnPropertySymbols(mixin))
		{
			if(typeof mixin[func] === 'function')
			{
				instance[func] = mixin[func].bind(instance);

				continue;
			}

			instance[func] = mixin[func];
		}
	}

	static mixClass(cls, newClass)
	{
		for(const func of Object.getOwnPropertyNames(cls.prototype))
		{
			newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
		}

		for(const func of Object.getOwnPropertySymbols(cls.prototype))
		{
			newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
		}

		for(const func of Object.getOwnPropertyNames(cls))
		{
			if(typeof cls[func] !== 'function')
			{
				continue;
			}

			const prev = newClass[func] || false;
			const meth = cls[func].bind(newClass);

			newClass[func] = (...args) => {
				prev && prev(...args);
				return meth(...args);
			};
		}

		for(const func of Object.getOwnPropertySymbols(cls))
		{
			if(typeof cls[func] !== 'function')
			{
				continue;
			}

			const prev = newClass[func] || false;
			const meth = cls[func].bind(newClass);

			newClass[func] = (...args) => {
				prev && prev(...args);
				return meth(...args);
			};
		}
	}

	static mix(mixinTo)
	{
		const constructors = [];
		const allStatic    = {};
		const allInstance  = {};

		const mixable = Bindable.makeBindable(mixinTo);

		for(
			let base = this
			; base && base.prototype
			; base = Object.getPrototypeOf(base)
		){
			const instanceNames = Object.getOwnPropertyNames(base.prototype);
			const staticNames   = Object.getOwnPropertyNames(base);

			const prefix = /^(before|after)__(.+)/;

			for(const methodName of staticNames)
			{
				const match = methodName.match(prefix);

				if(match)
				{
					switch(match[1])
					{
						case 'before':
							mixable.___before((t,e,s,o,a) => {

								if(e !== match[2])
								{
									return;
								}

								const method = base[methodName].bind(o);

								return method(...a);

							});

							break;
						case 'after':
							mixable.___after((t,e,s,o,a) => {

								if(e !== match[2])
								{
									return;
								}

								const method = base[methodName].bind(o);

								return method(...a);

							});
							break;

					}

					continue;
				}

				if(allStatic[methodName])
				{
					continue;
				}

				if(typeof base[methodName] !== 'function')
				{
					continue;
				}

				allStatic[methodName] = base[methodName];
			}

			for(const methodName of instanceNames)
			{
				const match = methodName.match(prefix);

				if(match)
				{
					switch(match[1])
					{
						case 'before':
							mixable.___before((t,e,s,o,a) => {
								if(e !== match[2])
								{
									return;
								}

								const method = base.prototype[methodName].bind(o);

								return method(...a);

							});

							break;
						case 'after':
							mixable.___after((t,e,s,o,a) => {

								if(e !== match[2])
								{
									return;
								}

								const method = base.prototype[methodName].bind(o);

								return method(...a);

							});
							break;

					}

					continue;
				}

				if(allInstance[methodName])
				{
					continue;
				}

				if(typeof base.prototype[methodName] !== 'function')
				{
					continue;
				}

				allInstance[methodName] = base.prototype[methodName];
			}
		}

		for(const methodName in allStatic)
		{
			mixinTo[methodName] = allStatic[methodName].bind(mixinTo);
		}

		for(const methodName in allInstance)
		{
			mixinTo.prototype[methodName] = function(...args){
				return allInstance[methodName].apply(this, args);
			};
		}

		return mixable;
	}
}

Mixin.constructor = Constructor;
