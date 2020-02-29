import { Field } from './Field';

export class FileField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
			>
				<input
					name    = "${this.args.name}"
					type    = "${this.args.attrs.type}"
					cv-bind = "value"
					cv-ref  = "input:curvature/base/Tag"
					cv-expand = "attrs"
				/>
				<span style = "display:none" cv-if = "value">[[[value]]]</span>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
	}
}
