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
		while(this.element.firstChild)
		{
			this.element.removeChild(this.element.firstChild);
		}
	}
}