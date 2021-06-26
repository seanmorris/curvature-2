export class Cache
{
	static store(key, value, expiry, bucket = 'standard')
	{
		let expiration = 0;

		if(expiry)
		{
			expiration = (expiry * 1000) + (new Date).getTime();
		}

		if(!this.buckets)
		{
			this.buckets = new Map;
		}

		if(!this.buckets.has(bucket))
		{
			this.buckets.set(bucket, new Map);
		}

		let eventEnd = new CustomEvent('cvCacheStore', {
			cancelable: true
			, detail:   {
				key, value, expiry, bucket
			}
		});

		if(document.dispatchEvent(eventEnd))
		{
			this.buckets.get(bucket).set(key, {value, expiration});
		}
	}

	static load(key, defaultvalue = false, bucket = 'standard')
	{
		let eventEnd = new CustomEvent('cvCacheLoad', {
			cancelable: true
			, detail:   {
				key, defaultvalue, bucket
			}
		});

		if(!document.dispatchEvent(eventEnd))
		{
			return defaultvalue;
		}

		if(this.buckets && this.buckets.has(bucket) && this.buckets.get(bucket).has(key))
		{
			const entry = this.buckets.get(bucket).get(key);
			// console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
			if(entry.expiration === 0 || entry.expiration > (new Date).getTime())
			{
				return this.buckets.get(bucket).get(key).value;
			}
		}

		return defaultvalue;
	}
}
