import { View } from '../base/View';

export class HtmlField extends View {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.ignore = this.args.attrs['data-cv-ignore'] || false;
		this.args.contentEditable = this.args.attrs.contenteditable || false;
		this.template = `<div
			name            = "${this.args.name}"
			cv-ref          = "input:curvature/base/Tag"
			contenteditable = "[[contentEditable]]"
		>[[$value]]</div>`;
	}
	hasChildren()
	{
		return false;
	}
	disable()
	{
		this.args.disabled = 'disabled';
	}
	getName()
	{
		if(this.tags.input)
		{
			return this.tags.input.element.getAttribute('name');
		}

		return this.args.name;
	}
}
