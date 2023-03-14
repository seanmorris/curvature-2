import { Cache } from '../base/Cache';
import { Bindable } from '../base/Bindable';
import { Database } from './Database';

const Changed  = Symbol('Changed');
const Deleted  = Symbol('Deleted');
const Saved    = Symbol('Saved');
const Keys     = Symbol('Keys');

export class Model
{
	id;
	class;

	static get keyProps(){ return ['id', 'class'] };

	constructor()
	{
		Object.defineProperty(this, Changed, {value: Bindable.make({})});
		Object.defineProperty(this, Deleted, {writable: true, value: false});
		Object.defineProperty(this, Saved, {writable: true, value: false});
		Object.defineProperty(this, Keys, {writable: true, value: new Set});

		return Bindable.make(this);
	}

	static from(skeleton, isSaved = false)
	{
		const keyProps = this.keyProps;

		const cacheProps = keyProps.map(prop => skeleton[prop]);

		cacheProps.unshift(this.name);

		const cacheKey = cacheProps.join('::');

		const bucket   = 'models-by-type-and-publicId';
		const cached   = Cache.load(cacheKey, false, bucket);

		const instance = cached ? cached : new this;

		for(const keyProp of keyProps)
		{
			instance[keyProp] = instance[keyProp] ?? skeleton[keyProp] ?? null;
		}

		instance.consume(skeleton);

		if(!cached)
		{
			Cache.store(cacheKey, instance, 0, bucket);

			let changed = false;

			instance.bindTo((v,k,t,d) => {
				if(typeof k === 'symbol')
				{
					return;
				}

				if(v === t[k])
				{
					return;
				}

				instance[Changed][k] = changed;
				instance[Saved]      = !!(changed ? false : instance[Saved]);
			});

			if(Object.keys(instance[Changed]).length === 0)
			{
				instance[Saved] = isSaved;
			}

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

			if(!override && this[Changed][property])
			{
				return;
			}

			this[property] = value;
		};

		if(Database.PKSymbol in skeleton)
		{
			setProp(Database.PKSymbol, skeleton[ Database.PKSymbol ]);
		}

		this[Keys] = new Set([
			...this[Keys]
			, ...Object.keys(this)
			, ...Object.keys(skeleton)
		]);

		for(const property of this[Keys])
		{
			if(!override && this[Changed][property])
			{
				continue;
			}

			if(keyProps.includes(property))
			{
				continue;
			}

			if(property in skeleton)
			{
				setProp(property, skeleton[property]);
			}
		}
	}

	changed()
	{
		this[Saved] = false;
	}

	markDeleted()
	{
		for(const property in this[Changed])
		{
			this[Changed][property] = false;
		}

		this[Deleted] = true;
		this[Saved]   = false;
	}

	markStored()
	{
		for(const property in this)
		{
			this[Changed][property] = false;
		}

		this[Deleted] = false;
		this[Saved]   = true;
	}

	isSaved()
	{
		return this[Saved];
	}
}

Object.defineProperty(Model, 'Changed', {value: Changed});
Object.defineProperty(Model, 'Deleted', {value: Deleted});
Object.defineProperty(Model, 'Saved',   {value: Saved});

