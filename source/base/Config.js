let AppConfig = {};

const _require = require;

const win = typeof globalThis === 'object' ? globalThis : (typeof window === 'object' ? window : (typeof self === 'object' ? self : this));

try
{
	AppConfig = _require('/Config').Config;
}
catch (error)
{
	win.devMode === true && console.error(error);
	AppConfig = {};
}

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
