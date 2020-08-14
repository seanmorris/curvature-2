const ConfigData = {};

try{
	const AppConfig = require('Config').Config || {};

	Object.assign(ConfigData, AppConfig);
} catch(error) {
	console.warn(error);
}

export class Config
{
	static get(name)
	{
		return this.data[name]
	}

	static set(name, value)
	{
		this.data[name] = value;

		return this;
	}

	static dump()
	{
		return this.data;
	}

	static init(...configBlobs)
	{
		for(const i in configBlobs)
		{
			const configBlob = configBlobs[i];

			if(typeof configBlob === 'string')
			{
				configBlob = JSON.parse(configBlob);
			}

			for(const name in configBlob)
			{
				const value = configBlob[name];

				return this.data[name] = value;
			}
		}

		return this;
	}
}

Config.data = ConfigData || {};
