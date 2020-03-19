export class Bag
{
	constructor(changeCallback = undefined)
	{
		this.meta    = Symbol('meta');
		this.content = new Set;
		this._items  = false;

		this.changeCallback = changeCallback;
	}

	add(item)
	{
		if(item === undefined || !(item instanceof Object))
		{
			throw new Error('Only objects may be added to Bags.');
		}

		if(this.content.has(item))
		{
			return;
		}

		this.content.add(item);

		if(this.changeCallback)
		{
			this.changeCallback(item, this.meta, 1);
		}
	}

	remove(item)
	{
		if(item === undefined || !(item instanceof Object))
		{
			throw new Error('Only objects may be removed from Bags.');
		}

		if(!this.content.has(item))
		{
			if(this.changeCallback)
			{
				this.changeCallback(undefined, this.meta, 0);
			}

			return false;
		}

		this.content.delete(item);

		if(this.changeCallback)
		{
			this.changeCallback(item, this.meta, -1);
		}

		return item;
	}

	items()
	{
		return Array.from(this.content.entries()).map(entry => entry[0]);
	}
}
