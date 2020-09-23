import { Bindable } from './Bindable';

export class Cookie
{
	static set(name, value)
	{
		Cookie.jar[name] = value;
	}

	static get(name)
	{
		return Cookie.jar[name];
	}

	static delete(name)
	{
		Cookie.jar[name] = undefined;
		delete Cookie.jar[name];
	}
};

Cookie.jar = Cookie.jar || Bindable.make({});

if(window.location.href.substr(0,4) !== 'data')
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
		// console.log(Cookie.jar);
	});

	Cookie.jar.bindTo((v,k,t,d) => {
		t[k] = v;

		if(d)
		{
			delete t[k];
		}

		const cookieString = `${encodeURIComponent(k)}=${t[k]}`;
		// console.log(cookieString);
		document.cookie = cookieString;
	});
}
