import { Field } from './Field';

export class TextareaField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || 'textarea';

		this.template = `
			<label
				for       = "${this.getName()}"
				data-type = "${attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<textarea
						name      = "${this.getName()}"
						cv-bind   = "value"
						cv-ref    = "input:curvature/base/Tag"
						cv-expand = "attrs"
				></textarea>
				<cv-template cv-if = "attrs.data-caption">
					<p>[[attrs.data-caption]]</p>
				</cv-template>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
	}
}
