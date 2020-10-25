import { Cache } from '../base/Cache';
import { Bindable } from '../base/Bindable';

export class Model
{
	static keyProps(){ return ['class', 'id'] }

	static from(skeleton)
	{
		const keyProps = this.keyProps();
		const cacheKey = keyProps.map(prop => skeleton[prop]).join('::');

		const bucket   = 'models-by-type-and-publicId';
		const cached   = Cache.load(cacheKey, false, bucket);

		const instance = cached
			? cached
			: Bindable.makeBindable(new this);

		instance.consume(skeleton);

		Cache.store(cacheKey, instance, 0, bucket);

		return instance;
	}

	consume(skeleton)
	{
		const setProp = (property, value) => {

			if(typeof value === 'object' && value.class && value.id)
			{
				console.log(this, value);

				const keyProps     = this.__proto__.constructor.keyProps();
				const cacheKey     = keyProps.map(prop => skeleton[prop]).join('::');
				const propCacheKey = keyProps.map(prop => value[prop]).join('::');
				const bucket       = 'models-by-type-and-publicId';
				const propCached   = Cache.load(propCacheKey, false, bucket);

				if(propCached)
				{
					propCached.consume(value);

					value = propCached;
				}
			}

			this[property] = value;
		};

		for(const property in skeleton)
		{
			setProp(property, skeleton[property]);
		}

		// console.log(skeleton, Object.getOwnPropertySymbols(skeleton));

		for(const property of Object.getOwnPropertySymbols(skeleton))
		{
			// this[property] = skeleton[property];
			// setProp(property, skeleton[property]);
		}
	}
}
