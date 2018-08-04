import { Bindable } from './Bindable';

export class Cookie
{
	static set(name, value)
	{
		Cookie.jar[name] = value;
	}

	static get(name)
	{
		return JSON.parse(Cookie.jar[name]);
	}

	static delete(name)
	{
		delete Cookie.jar[name];
	}
};

Cookie.jar = Cookie.jar || Bindable.makeBindable({});

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
			t[k] = null;
		}
		
		const cookieString = `${encodeURIComponent(k)}=${JSON.stringify(t[k])}`;
		// console.log(cookieString);
		document.cookie = cookieString;
	});
}
