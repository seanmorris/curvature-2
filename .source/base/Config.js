import { Config as ConfigData } from 'Config';

export class Config
{
	static get(name)
	{
		return this.data[name]
	}

	static set(name, value)
	{
		return this.data[name] = value;
	}
}

Config.data = ConfigData || {};
