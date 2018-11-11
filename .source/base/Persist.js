import { Bindable } from './Bindable';

export class Persist
{
	constructor(bucket, object)
	{
		Bindable.makeBindable(this);

		let index    = {};
		let bindings = {};
		let indexKey = `${bucket}::#[index]`;
		let _index;

		let store = (key, value) => {
			index[key] = 1;

			if(bindings[key])
			{
				bindings[key]();
				delete bindings[key];
			}

			if(value instanceof Object)
			{
				let bindable = Bindable.makeBindable(value);

				bindings[key] = bindable.bindTo((v,k,t,d)=>{
					t[k] = v;
					localStorage.setItem(
						`${bucket}::$[${key}]`
						, JSON.stringify({key, value})
					);
				});
			}

			localStorage.setItem(
				`${bucket}::$[${key}]`
				, JSON.stringify({key, value})
			);

			localStorage.setItem(
				indexKey
				, JSON.stringify(index)
			);
		};

		object.bindTo((v,k,t,d)=>{
			t[k] = v;
			store(k, v);
		});

		if(_index = localStorage.getItem(indexKey))
		{
			index = JSON.parse(_index);

			for(let i in index)
			{
				let source = localStorage.getItem(
					`${bucket}::$[${i}]`
				);

				let {key,value} = JSON.parse(source);

				object[key] = value;
			}
		}
	}
}