const AppConfig = {};

try { Object.assign(AppConfig, require('Config').Config || {}); }
catch(error){ console.warn(error); }

export class Config
{
	static get(name)
	{
		return this.configs[name];
	}

	static set(name, value)
	{
		this.configs[name] = value;

		return this;
	}

	static dump()
	{
		return this.configs;
	}

	static init(...configs)
	{
		for(const i in configs)
		{
			let config = configs[i];

			if(typeof config === 'string')
			{
				config = JSON.parse(config);
			}

			for(const name in config)
			{
				const value = config[name];

				return this.configs[name] = value;
			}
		}

		return this;
	}
}

Object.defineProperty(Config, 'configs', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      AppConfig
});
