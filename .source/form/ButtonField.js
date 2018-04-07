import { Field } from './Field';

export class ButtonField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.args.title = this.args.title || this.args.value;
		this.template = `
			<input
				name  = "${this.args.name}"
				type  = "${this.args.attrs.type}"
				value = "[[title]]"
				on    = "click:clicked(event)"
			/>
		`;
	}
	clicked(event) {
		this.form.buttonClick(this.args.name);
	}
}
