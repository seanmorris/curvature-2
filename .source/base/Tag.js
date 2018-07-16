import { Bindable } from './Bindable';
export class Tag
{
	constructor(element, parent, ref, index)
	{
		this.element = Bindable.makeBindable(element);
		this.parent  = parent;
		this.ref     = ref;
		this.index   = index;

		this.proxy   = Bindable.makeBindable(this)
		this.cleanup = [];

		this.detachListener = (event) => {
			// return;
			if(event.target != this.element)
			{
				return;
			}
			if(event.path[event.path.length -1] !== window)
			{
				return;
			}
			this.remove();
			this.element.removeEventListener('cvDomDetached', this.detachListener);
			this.element = this.ref = this.parent = null;
		};

		this.element.addEventListener('cvDomDetached', this.detachListener);

		return this.proxy;
	}
	remove()
	{
		let cleanup;

		while(cleanup = this.cleanup.shift())
		{
			cleanup();
		}

		Bindable.clearBindings(this);

		this.clear();
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
}
