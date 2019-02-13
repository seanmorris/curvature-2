import { Field } from './Field';

export class HiddenField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.args.attrs.type = this.args.attrs.type || 'hidden';
		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
				style     = "display:none"
				cv-ref    = "label:curvature/base/Tag">
				<input
						name      = "${this.args.name}"
						type      = "${this.args.attrs.type}"
						cv-bind   = "value"
						cv-ref    = "input:curvature/base/Tag"
						cv-expand = "attrs"
				/>
				<span cv-if = "value">[[[value]]]</span>
			</label>
		`;
	}
}
