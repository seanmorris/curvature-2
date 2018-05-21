import { Field } from './Field';

export class FileField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label>
				<input
						name    = "${this.args.name}"
						type    = "${this.args.attrs.type}"
						cv-bind = "value"
				/>
				<span style = "display:none" cv-if = "value">[[[value]]]</span>
			</label>
		`;
	}
}
