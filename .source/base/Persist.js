import { View }     from './View';
import { Bindable } from './Bindable';

export class Persist
{
	static watch(bucket, object)
	{
		let subBinding = {};
		let key        = `Persist::[${bucket}]`;

		let _source = localStorage.getItem(key);
		let source;

		object = Bindable.makeBindable(object);

		let debind = object.bindTo((v,k,t,d,p)=>{
			if(subBinding[k])
			{
				subBinding[k]();
			}

			if(typeof v === 'object')
			{
				subBinding[k] = Persist.watch(`${bucket}::${k}`, v);
			}

			localStorage.setItem(key, JSON.stringify(object));

		}, {delay: 0});

		if(source = JSON.parse(_source))
		{
			for(let i in source)
			{
				object[i] = source[i];
			}
		}
		
		return ()=>{
			debind()
			for(let i in subBinding)
			{
				subBinding[i]();
			}
			localStorage.removeItem(key);
		};
	}
}
