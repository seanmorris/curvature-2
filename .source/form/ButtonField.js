import { Field } from './Field';

export class ButtonField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.args.title = this.args.title || this.args.value;
		this.template = `
			<label for = "${this.args.name}" cv-ref = "label:curvature/base/Tag">
				<input
					name  = "${this.args.name}"
					type  = "${this.args.attrs.type}"
					value = "[[title]]"
					on    = "click:clicked(event)"
				/>
			</label>
		`;
	}
	clicked(event) {
		this.form.buttonClick(this.args.name);
	}
}
