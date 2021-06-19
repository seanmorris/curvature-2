import { Cache } from '../base/Cache';
import { Bindable } from '../base/Bindable';

const Saved   = Symbol('Saved');
const Changed = Symbol('Changed');

export class Model
{
	static get keyProps(){ return ['id', 'class'] };

	constructor()
	{
		Object.defineProperty(this, Changed, {value: Bindable.make({})});

		Object.defineProperty(this, Saved, {writable: true, value:  false});

		return Bindable.makeBindable(this);
	}

	static from(skeleton)
	{
		const keyProps = this.prototype.constructor.keyProps;
		const cacheKey = keyProps.map(prop => skeleton[prop]).join('::');

		const bucket   = 'models-by-type-and-publicId';
		const cached   = Cache.load(cacheKey, false, bucket);

		const instance = cached ? cached : new this;

		for(const keyProp of keyProps)
		{
			instance[keyProp] = instance[keyProp] ?? skeleton[keyProp] ?? null;
		}

		instance.consume(skeleton);

		Cache.store(cacheKey, instance, 0, bucket);

		if(!cached)
		{
			let changed = false;

			instance.bindTo((v,k,t) => {

				if(typeof k === 'symbol')
				{
					return;
				}

				if(v === t[k])
				{
					return;
				}

				instance[Changed][k] = changed;
				instance[Saved]      = !!(changed ? false : this[Saved]);
			});

			changed = true;
		}

		return instance;
	}

	consume(skeleton, override = false)
	{
		const keyProps = Model.keyProps;

		const setProp = (property, value) => {

			if(value && typeof value === 'object' && value.constructor.keyProps)
			{
				const subKeyProps  = value.constructor.keyProps;
				const propCacheKey = subKeyProps.map(prop => value[prop]).join('::');

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
			if(!override && this[Changed][property])
			{
				continue;
			}

			if(keyProps.includes(property))
			{
				continue;
			}

			setProp(property, skeleton[property]);
		}
	}

	changed()
	{
		this[Saved] = false;
	}

	stored()
	{
		for(const property in this[Changed])
		{
			this[Changed][property] = false;
		}

		this[Saved] = true;
	}

	isSaved()
	{
		return this[Saved];
	}
}

Object.defineProperty(Model, 'Saved',   {value: Saved});
Object.defineProperty(Model, 'Changed', {value: Changed});

