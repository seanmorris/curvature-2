import { Bindable } from './Bindable';
import { Mixin    } from './Mixin';

import { EventTargetMixin  } from '../mixin/EventTargetMixin';

const toId   = int => Number(int);
const fromId = id  => parseInt(id);

const Mapped = Symbol('Mapped');
const Has    = Symbol('Has');
const Add    = Symbol('Add');
const Remove = Symbol('Remove');
const Delete = Symbol('Delete');

export class Bag extends Mixin.with(EventTargetMixin)
{
	constructor(changeCallback = undefined)
	{
		super();

		this.changeCallback = changeCallback;

		this.content = new Map;
		this.current = 0;
		this.length  = 0;
		this.list    = Bindable.makeBindable([]);
		this.meta    = Symbol('meta');
		this.type    = undefined;
	}

	has(item)
	{
		if(this[Mapped])
		{
			return this[Mapped].has(item);
		}

		return this[Has](item);
	}

	[Has](item)
	{
		return this.content.has(item);
	}

	add(item)
	{
		if(this[Mapped])
		{
			return this[Mapped].add(item);
		}

		return this[Add](item);
	}

	[Add](item)
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

		item = Bindable.make(item);

		if(this.content.has(item))
		{
			return;
		}

		const adding = new CustomEvent('adding', {detail: {item}});

		if(!this.dispatchEvent(adding))
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

		const add = new CustomEvent('added', {detail: {item, id}});

		this.dispatchEvent(add);

		this.length = this.size;

		return id;
	}

	remove(item)
	{
		if(this[Mapped])
		{
			return this[Mapped].remove(item);
		}

		return this[Remove](item);
	}

	[Remove](item)
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

		item = Bindable.make(item);

		if(!this.content.has(item))
		{
			if(this.changeCallback)
			{
				this.changeCallback(item, this.meta, 0, undefined);
			}

			return false;
		}

		const removing = new CustomEvent('removing', {detail: {item}});

		if(!this.dispatchEvent(removing))
		{
			return;
		}

		const id = this.content.get(item);

		delete this.list[id];

		this.content.delete(item);

		if(this.changeCallback)
		{
			this.changeCallback(item, this.meta, Bag.ITEM_REMOVED, id);
		}

		const remove = new CustomEvent('removed', {detail: {item, id}});

		this.dispatchEvent(remove);

		this.length = this.size;

		return item;
	}

	delete(item)
	{
		if(this[Mapped])
		{
			return this[Mapped].delete(item);
		}

		this[Delete](item);
	}

	[Delete](item)
	{
		this.remove(item);
	}

	map(mapper = x => x, filter = x => x)
	{
		const mappedItems = new WeakMap;
		const mappedBag   = new Bag;

		mappedBag[Mapped] = this;

		this.addEventListener('added', event => {
			const item = event.detail.item;

			if(!filter(item))
			{
				return;
			}

			if(mappedItems.has(item))
			{
				return;
			}

			const mapped = mapper(item);

			mappedItems.set(item, mapped);

			mappedBag[Add](mapped);
		});

		this.addEventListener('removed', event => {
			const item = event.detail.item;

			if(!mappedItems.has(item))
			{
				return;
			}

			const mapped = mappedItems.get(item);

			mappedItems.delete(item);
			mappedBag[Remove](mapped);
		});

		return mappedBag;
	}

	get size()
	{
		return this.content.size;
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
