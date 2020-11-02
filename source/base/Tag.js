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

		this.style = ((_this) => Bindable.make(function(styles){
			if(!_this.node)
			{
				return;
			}

			let styleEvent = new CustomEvent('cvStyle', {detail:{styles}});

			if(!_this.node.dispatchEvent(styleEvent))
			{
				return;
			}

			for(const property in styles)
			{
				if(property[0] === '-')
				{
					_this.node.style.setProperty(property, styles[property]);
				}

				_this.node.style[property] = styles[property];
			}
		}))(this);

		this.proxy = Bindable.make(this);

		this.proxy.style.bindTo((v,k)=>{
			this.element.style[k] = v;
		});

		this.proxy.bindTo((v,k)=>{
			if(k in element)
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
	}

	remove()
	{
		this.node.remove();

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

		this.node = this.element = this.ref = this.parent = null;
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
}
