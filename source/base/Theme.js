class ThemeList
{
	themes = [];

	constructor(themes)
	{
		this.themes.push(...themes);
	}

	getTemplate(object)
	{
		for(const i in this.themes)
		{
			const theme = this.themes[i].getTemplate(object);

			if(theme)
			{
				return theme;
			}
		}
	}

	getView(object)
	{
		for(const i in this.themes)
		{
			const theme = this.themes[i].getView(object);

			if(theme)
			{
				return theme;
			}
		}
	}
}

export class Theme
{
	static instances = {};

	static get(...keys)
	{
		if(keys.length <= 1)
		{
			const key = String(keys[0] || '');

			if(!this.instances[key])
			{
				this.instances[key] = new this(key);
			}

			return this.instances[key];
		}

		const themes = [];

		for(const i in keys)
		{
			themes.push( this.get(keys[i]) );
		}

		return new ThemeList(themes);
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
		const type = this.resolve(object, 'viewMap');

		if(!type)
		{
			return null;
		}

		const view = new type(object);

		return view;
	}

	setTemplate(type, template)
	{
		this.templateMap.set(type, template);

		return this;
	}

	getTemplate(object)
	{
		return this.resolve(object, 'templateMap');
	}

	resolve(object, whichMap)
	{
		if(object.___object___ && object.isBound)
		{
			object = object.___object___;
		}

		const type = object.__proto__.constructor;
		const map  = this[whichMap];

		if(map.has(type, object))
		{
			return map.get(type);
		}

		let result = null;

		for(const [key, value] of map)
		{
			if(object instanceof key)
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
