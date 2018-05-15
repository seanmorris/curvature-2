import { View } from 'curvature/base/View';

export class HtmlField extends View {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.ignore = this.args.attrs['data-cv-ignore'] || false;
		this.args.contentEditable = this.args.attrs.contenteditable || false;
		this.template = `<div contenteditable = "[[contentEditable]]">[[$value]]</div>`;
	}	
}
