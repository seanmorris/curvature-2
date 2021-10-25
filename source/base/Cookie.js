import { Bindable } from './Bindable';

export class Cookie
{
	static jar = Bindable.make({});

	static set(name, value)
	{
		this.jar[name] = value;
	}

	static get(name)
	{
		return this.jar[name];
	}

	static delete(name)
	{
		delete this.jar[name];
	}
}

if(typeof document.cookie === 'string' && window.location.href.substr(0,4) !== 'data')
{
	document.cookie.split(';').map(c => {

		let [key, value] = c.split('=');

		try
		{
			value = JSON.parse(value);
		}
		catch(error)
		{
			value = value;
		}

		key = key.trim();

		Cookie.jar[decodeURIComponent(key)] = value;

	});

	Cookie.jar.bindTo((v,k,t,d) => {
		if(d)
		{
			document.cookie = `${encodeURIComponent(k)}=;expires=${new Date(0)}`;
		}
		else
		{
			document.cookie = `${encodeURIComponent(k)}=${v}`;
		}
	});
}
