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
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<textarea
						name      = "${this.args.name}"
						cv-bind   = "value"
						cv-ref    = "input:curvature/base/Tag"
						cv-expand = "attrs"
				></textarea>
				<cv-template cv-if = "attrs.data-caption">
					<p>[[attrs.data-caption]]</p>
				</cv-template>
			</label>
		`;
	}
}
