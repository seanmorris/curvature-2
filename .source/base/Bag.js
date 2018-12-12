export class Bag
{
	constructor(changeCallback)
	{
		this.meta    = Symbol('meta');
		this.content = {};
		this._items  = false;

		this.changeCallback = changeCallback;
	}

	add(item)
	{
		if(typeof item instanceof Object)
		{
			throw new Error('Only objects may be added/removed from Bags.');
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
		if(typeof item !== 'object')
		{
			throw new Error('Only objects may be added/removed from Bags.');
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
		return Object.getOwnPropertySymbols(
			this.content
		).slice();
	}

	items()
	{
		return this.keys().map((key)=>this.get(key)).slice();

		let newItems = this.keys().map((key)=>this.get(key)).slice();

		if(!this._items)
		{
			this._items = [];
		}

		let add    = [];
		let remove = [];

		for(let i in this.items)
		{
			console.log('R', newItems.indexOf(this.items[i]));

			if(newItems.indexOf(this.items[i]) < 0)
			{
				remove.push(i);
			}
		}

		remove.sort();
		remove.reverse();

		for(let i in newItems)
		{
			console.log('A', this._items.indexOf(newItems[i]));

			if(this._items.indexOf(newItems[i]) < 0)
			{
				add.push(i);
			}
		}

		console.log(add, remove);

		for(let i in remove)
		{
			this._items.splice(remove[i], 1);
		}

		for(let i in add)
		{
			this._items.push(newItems[add[i]]);
		}

		console.log(newItems, this._items);

		return this._items;
	}
}