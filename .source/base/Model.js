import { Cache } from './Cache';
import { Bindable   } from './Bindable';
import { Repository } from './Repository';

export class Model
{
	constructor(repository)
	{
		this.repository = repository;
	}

	consume(values)
	{
		for(let property in values)
		{
			let value = values[property];

			if(values[property] instanceof Object
				&& values[property].class
				&& values[property].publicId
			){
				let cacheKey = `${values[property].class}::${values[property].publidId}`;

				let cached = Cache.load(cacheKey, false, 'model-type-repo');

				value = Bindable.makeBindable(new Model(this.repository));

				if(cached)
				{
					value = cached;
				}

				value.consume(values[property]);

				Cache.store(
					cacheKey
					, value
					, 0
					, 'model-type-repo'
				);
			}

			this[property] = value;
		}
	}
}
