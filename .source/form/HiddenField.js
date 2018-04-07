import { Field } from './Field';

export class HiddenField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label cv-ref = "label:base/Tag">
				<input
						name    = "${this.args.name}"
						type    = "${this.args.attrs.type}"
						cv-bind = "value"
						cv-ref  = "input:base/Tag"
				/>
				<span style = "display:none" cv-if = "value">[[[value]]]</span>
			</label>
		`;
	}
}
