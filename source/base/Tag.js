import { Bindable } from './Bindable';

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

		this[Bindable.OnAllGet] = (name) => {
			if(typeof this[name] === 'function')
			{
				return this[name];
			}

			if(typeof this.element[name] === 'function')
			{
				return (...args) => this.element[name](...args);
			}

			if(name in this.element)
			{
				return this.element[name];
			}

			return this[name];
		};

		this.proxy = Bindable.makeBindable(this);

		this.proxy.bindTo((v,k)=>{
			if(k in element)
			{
				element[k] = v;
			}

			return false;
		})

		return this.proxy;

		// this.detachListener = (event) => {
		// 	return;

		// 	if(event.target != this.element)
		// 	{
		// 		return;
		// 	}
		// 	if(event.path[event.path.length -1] !== window)
		// 	{
		// 		return;
		// 	}

		// 	this.element.removeEventListener('cvDomDetached', this.detachListener);

		// 	this.remove();
		// };

		// this.element.addEventListener('cvDomDetached', this.detachListener);

		// return this.proxy;
	}

	remove()
	{
		Bindable.clearBindings(this);

		let cleanup;

		while(cleanup = this.cleanup.shift())
		{
			cleanup();
		}

		this.clear();

		if(!this.element)
		{
			return;
		}

		let detachEvent = new Event('cvDomDetached');

		this.element.dispatchEvent(detachEvent);
		this.element.remove();

		this.element = this.ref = this.parent = null;
	}

	clear()
	{
		if(!this.element)
		{
			return;
		}

		let detachEvent = new Event('cvDomDetached');

		while(this.element.firstChild)
		{
			this.element.firstChild.dispatchEvent(detachEvent);
			this.element.removeChild(this.element.firstChild);
		}
	}

	pause(paused = true)
	{

	}

	style(styles)
	{
		if(!this.element)
		{
			return;
		}

		let styleEvent = new CustomEvent('cvStyle', {detail:{styles}});

		if(!this.element.dispatchEvent(styleEvent))
		{
			return;
		}

		for(const property in styles)
		{
			if(property[0] === '-')
			{
				this.element.style.setProperty(property, styles[property]);
			}

			this.element.style[property] = styles[property];
		}
	}
}
