import { Field } from './Field';

export class TextareaField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.args.attrs.type = this.args.attrs.type || 'hidden';
		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<textarea
						name    = "${this.args.name}"
						cv-bind = "value"
						cv-ref  = "input:curvature/base/Tag"
				></textarea>
			</label>
		`;
	}
}
