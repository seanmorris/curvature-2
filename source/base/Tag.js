import { Bindable } from './Bindable';

const CurrentStyle = Symbol('CurrentStyle');

const styler = function(styles) {
	if(!this.node)
	{
		return;
	}

	for(const property in styles)
	{
		const stringedProperty = String( styles[property] );

		if(this[CurrentStyle].has(property) && this[CurrentStyle].get(property) === styles[property])
		{
			continue;
		}

		if(property[0] === '-')
		{
			this.node.style.setProperty(property, stringedProperty);
		}
		else
		{
			this.node.style[property] = stringedProperty;
		}

		if(styles[property] !== undefined)
		{
			this[CurrentStyle].set(property, styles[property]);
		}
		else
		{
			this[CurrentStyle].delete(property);
		}
	}
};

const getter = function(name) {

	if(typeof this[name] === 'function')
	{
		return this[name];
	}

	if(this.node && (typeof this.node[name] === 'function'))
	{
		return this[name] = (...args) => this.node[name](...args);
	}

	if(name === 'style')
	{
		return this.proxy.style;
	}

	if(this.node && (name in this.node))
	{
		return this.node[name];
	}

	return this[name];
};

export class Tag
{
	constructor(element, parent, ref, index, direct)
	{
		if(typeof element === 'string')
		{
			const subdoc = document.createRange().createContextualFragment(element);

			element = subdoc.firstChild;
		}

		this.element = Bindable.makeBindable(element);
		this.node    = this.element;
		this.parent  = parent;
		this.direct  = direct;
		this.ref     = ref;
		this.index   = index;

		this.cleanup = [];

		this[Bindable.OnAllGet] = getter.bind(this);

		this[CurrentStyle] = new Map;

		const boundStyler = Bindable.make(styler.bind(this));

		Object.defineProperty(this, 'style', {value: boundStyler});

		this.proxy = Bindable.make(this);

		this.proxy.style.bindTo((v,k,t,d)=>{

			if(this[CurrentStyle].has(k) && this[CurrentStyle].get(k) === v)
			{
				return;
			}

			this.node.style[k] = v;

			if(!d && v !== undefined)
			{
				this[CurrentStyle].set(k, v);
			}
			else
			{
				this[CurrentStyle].delete(k);
			}
		});

		this.proxy.bindTo((v,k)=>{
			if(k === 'index')
			{
				return;
			}

			if(k in element && element[k] !== v)
			{
				element[k] = v;
			}

			return false;
		});

		return this.proxy;
	}

	attr(attributes)
	{
		for(const attribute in attributes)
		{
			if(attributes[attribute] === undefined)
			{
				this.node.removeAttribute(attribute);
			}
			else if(attributes[attribute] === null)
			{
				this.node.setAttribute(attribute, '');
			}
			else
			{
				this.node.setAttribute(attribute, attributes[attribute]);
			}
		}

		return this;
	}

	remove()
	{
		if(this.node)
		{
			this.node.remove();
		}

		Bindable.clearBindings(this);

		let cleanup;

		while(cleanup = this.cleanup.shift())
		{
			cleanup();
		}

		this.clear();

		if(!this.node)
		{
			return;
		}

		let detachEvent = new Event('cvDomDetached');

		this.node.dispatchEvent(detachEvent);

		this.node = this.element = this.ref = this.parent = undefined;
	}

	clear()
	{
		if(!this.node)
		{
			return;
		}

		let detachEvent = new Event('cvDomDetached');

		while(this.node.firstChild)
		{
			this.node.firstChild.dispatchEvent(detachEvent);
			this.node.removeChild(this.node.firstChild);
		}
	}

	pause(paused = true)
	{

	}

	listen(eventName, callback, options)
	{
		const node = this.node;

		node.addEventListener(eventName, callback, options);

		let remove = () => {
			node.removeEventListener(eventName, callback, options);
		}

		const remover = () => {
			remove();

			remove = () => console.warn('Already removed!');
		}

		this.parent.onRemove(() => remover());

		return remover;
	}
}
