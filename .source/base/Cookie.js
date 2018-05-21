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
		delete Cookie.jar[name];
	}
};

Cookie.jar = Cookie.jar || Bindable.makeBindable({});

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

	Cookie.jar[decodeURIComponent(key)] = value;
});

Cookie.jar.bindTo((v,k,t,d) => {
	t[k] = v;

	if(d)
	{
		t[k] = null;
	}
	
	const cookieString = `${encodeURIComponent(k)}=${JSON.stringify(t[k])}`;
	document.cookie = cookieString;

	console.log(document.cookie);
});
