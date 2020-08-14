import { Bindable } from './Bindable';

export class Mixin
{
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
