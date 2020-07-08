import { Field } from './Field';

export class HiddenField extends Field {
	constructor(values, form, parent, key) {

		values.type = 'hidden';

		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		this.args.type = attrs.type = 'hidden';
		this.args.name = attrs.name = attrs.name || this.args.name || key;

		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${attrs.type}"
				style     = "display:none"
				cv-ref    = "label:curvature/base/Tag">
				<input
						name      = "${this.args.name}"
						type      = "hidden"
						cv-bind   = "value"
						cv-ref    = "input:curvature/base/Tag"
						cv-expand = "attrs"
				/>
				<span cv-if = "value">[[[value]]]</span>
			</label>
		`;
	}
}
