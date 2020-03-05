export class Bag
{
	constructor(changeCallback = undefined)
	{
		this.meta    = Symbol('meta');
		this.content = {};
		this._items  = false;

		this.changeCallback = changeCallback;
	}

	add(item)
	{
		if(item === undefined || !item instanceof Object)
		{
			throw new Error('Only objects may be added to Bags.');
		}

		if(!item[this.meta])
		{
			item[this.meta] = Symbol('bagId');
		}

		this.content[ item[this.meta] ] = item;

		if(this.changeCallback)
		{
			this.changeCallback(
				this.content[ item[this.meta] ]
				, this.meta
				, 1
			);
		}
	}

	remove(item)
	{
		if(item === undefined || !item instanceof Object)
		{
			throw new Error('Only objects may be removed from Bags.');
		}

		if(!item[this.meta] || !this.content[ item[this.meta] ])
		{
			if(this.changeCallback)
			{
				this.changeCallback(
					undefined
					, this.meta
					, 0
				);
			}
			return false;
		}

		let removed = this.content[ item[this.meta] ];

		delete this.content[ item[this.meta] ];

		if(this.changeCallback)
		{
			this.changeCallback(
				removed
				, this.meta
				, -1
			);
		}
	}

	id(item)
	{
		return item[ this.meta ];
	}

	get(key)
	{
		return this.content[ key ];
	}

	keys()
	{
		return Object.getOwnPropertySymbols(this.content);
	}

	items()
	{
		return this.keys().map((key)=>this.get(key));
	}
}
