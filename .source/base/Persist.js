import { Bindable } from './Bindable';

export class Persist
{
	static watch(bucket, object, refresh = false)
	{
		let index    = {};
		let bindings = {};
		let indexKey = `${bucket}::#[index]`;
		let _index;

		// if(refresh)
		// {
		// 	let index = JSON.parse(localStorage.getItem(indexKey));
		// 	for(let i in index)
		// 	{
		// 		localStorage.removeItem(`${bucket}::$[${index[i]}]`);
		// 	}
		// 	console.log(index);
		// }

		let store = (key, value, del = false) => {
			index[key] = 1;

			if(bindings[key])
			{
				bindings[key]();
				delete bindings[key];
			}

			if(del)
			{
				localStorage.removeItem(`${bucket}::$[${key}]`);
				delete index[key];
			}
			else
			{
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
			}

			localStorage.setItem(
				indexKey
				, JSON.stringify(index)
			);
		};

		if(_index = localStorage.getItem(indexKey))
		{
			index = JSON.parse(_index);

			let values = {};

			for(let i in index)
			{
				let source = localStorage.getItem(
					`${bucket}::$[${i}]`
				);

				if(!source)
				{
					continue;
				}

				let {key,value} = JSON.parse(source);

				values[key] = value;
			}

			if(Array.isArray(object))
			{
				while(object.pop());
			}

			for(let i in values)
			{
				if(Array.isArray(object))
				{
					if(i !== object.length)
					{
						localStorage.removeItem(`${bucket}::$[${i}]`);
					}
					object.push(values[i]);
					continue;
				}
				object[key] = values[i];
			}
		}

		let debind = object.bindTo((v,k,t,d)=>{
			store(k, v, d);
		}, {wait: 0});

		return () => {
			debind();
			for(let i in bindings)
			{
				bindings[i]();
			}
		};
	}
}