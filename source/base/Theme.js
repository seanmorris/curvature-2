export class Theme
{
	static get(key = '')
	{
		if(!this.instances)
		{
			this.instances = {};
		}

		if(!this.instances[key])
		{
			this.instances[key] = new this(key);
		}

		return this.instances[key];
	}

	constructor(key)
	{
		this.key         = key;
		this.viewMap     = new Map();
		this.templateMap = new Map();
		this.fallbacks   = [];
	}

	setFallback(...fallbacks)
	{
		this.fallbacks.push(...fallbacks);

		return this;
	}

	setView(type, viewType)
	{
		this.viewMap.set(type, viewType);

		return this;
	}

	getView(object)
	{
		return this.resolve(object, 'viewMap');
	}

	setTemplate(type, viewType)
	{
		this.viewMap.set(type, viewType);

		return this;
	}

	getTemplate(object)
	{
		return this.resolve(object, 'templateMap');
	}

	resolve(object, whichMap)
	{
		const type = object.constructor;
		const map  = this[whichMap];

		if(map.has(type))
		{
			return map.get(type);
		}

		let result = false;

		for(const [key, value] of map)
		{
			if(type.prototype instanceof key)
			{
				result = value;
			}
		}

		if(!result)
		{
			for(const theme of this.fallbacks)
			{
				if(result = theme.resolve(object, whichMap))
				{
					return result;
				}
			}
		}

		if(result)
		{
			map.set(type, result);
		}

		return result;
	}
}
