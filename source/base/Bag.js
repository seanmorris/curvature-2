import { Bindable } from './Bindable';

const toId   = int => Number(int);
const fromId = id  => parseInt(id);

export class Bag
{
	constructor(changeCallback = undefined)
	{
		this.meta    = Symbol('meta');
		this.content = new Map;
		this.list    = Bindable.makeBindable([]);
		this.current = 0;
		this.type    = undefined;

		this.changeCallback = changeCallback;
	}

	has(item)
	{
		return this.content.has(item);
	}

	add(item)
	{
		if(item === undefined || !(item instanceof Object))
		{
			throw new Error('Only objects may be added to Bags.');
		}

		if(this.type && !(item instanceof this.type))
		{
			console.error(this.type, item);

			throw new Error(
				`Only objects of type ${this.type} may be added to this Bag.`
			);
		}

		if(this.content.has(item))
		{
			return;
		}

		const id = toId(this.current++);

		this.content.set(item, id);

		this.list[id] = item;

		if(this.changeCallback)
		{
			this.changeCallback(item, this.meta, Bag.ITEM_ADDED, id);
		}
	}

	remove(item)
	{
		if(item === undefined || !(item instanceof Object))
		{
			throw new Error('Only objects may be removed from Bags.');
		}

		if(this.type && !(item instanceof this.type))
		{
			console.error(this.type, item);

			throw new Error(
				`Only objects of type ${this.type} may be removed from this Bag.`
			);
		}

		if(!this.content.has(item))
		{
			if(this.changeCallback)
			{
				this.changeCallback(item, this.meta, 0, undefined);
			}

			return false;
		}

		const id = this.content.get(item);

		delete this.list[id];

		this.content.delete(item);

		if(this.changeCallback)
		{
			this.changeCallback(item, this.meta, Bag.ITEM_REMOVED, id);
		}

		return item;
	}

	items()
	{
		return Array.from(this.content.entries()).map(entry => entry[0]);
	}
}

Object.defineProperty(Bag, 'ITEM_ADDED', {
	configurable: false
	, enumerable: false
	, writable:   true
	, value:      1
});

Object.defineProperty(Bag, 'ITEM_REMOVED', {
	configurable: false
	, enumerable: false
	, writable:   true
	, value:      -1
});
