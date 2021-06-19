export class SetMap
{
	_map = new Map;

	has(key)
	{
		return this._map.has(key);
	}

	get(key)
	{
		return this._map.get(key);
	}

	getOne(key)
	{
		const set = this.get(key);

		for(const entry of set)
		{
			return entry;
		}
	}

	add(key, value)
	{
		let set = this._map.get(key);

		if(!set)
		{
			this._map.set(key, set = new Set);
		}

		return set.add(value);
	}

	remove(key, value)
	{
		let set = this._map.get(key);

		if(!set)
		{
			return;
		}

		const res = set.delete(value);

		if(!set.size)
		{
			this._map.delete(key);
		}

		return res;
	}

	values()
	{
		return new Set( ...[ ...this._map.values() ].map( set => [ ...set.values() ] ) );
	}
}
