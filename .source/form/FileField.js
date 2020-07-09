import { Field } from './Field';

export class FileField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || this.args.type || 'file';

		this.template = `
			<label
				for       = "${this.getName()}"
				data-type = "${attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
			>
				<input
					name    = "${this.getName()}"
					type    = "${attrs.type}"
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
