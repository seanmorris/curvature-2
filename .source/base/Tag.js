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
			this.clear();
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
	}
	clear()
	{
		let detachEvent = new Event('cvDomDetached');

		while(this.element.firstChild)
		{
			this.element.firstChild.dispatchEvent(detachEvent);
			this.element.removeChild(this.element.firstChild);
		}
	}
}
