export class Cache
{
	static store(key, value, expiry, bucket = 'standard')
	{
		let expiration = (expiry * 1000) + (new Date).getTime();

		// console.log(
		// 	`Caching ${key} until ${expiration} in ${bucket}.`
		// 	, value
		// 	, this.bucket
		// );

		if(!this.bucket)
		{
			this.bucket = {};
		}

		if(!this.bucket[bucket])
		{
			this.bucket[bucket]	= {};
		}

		this.bucket[bucket][key] = {expiration, value};
	}

	static load(key, defaultvalue = false, bucket = 'standard')
	{
		// console.log(
		// 	`Checking cache for ${key} in ${bucket}.`
		// 	, this.bucket
		// );

		if(this.bucket && this.bucket[bucket] && this.bucket[bucket][key])
		{
			// console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
			if(this.bucket[bucket][key].expiration > (new Date).getTime())
			{
				return this.bucket[bucket][key].value;
			}
		}

		return defaultvalue;
	}
}