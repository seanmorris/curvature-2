import { Field } from './Field';

export class RadioField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		this.args.name = attrs.name = attrs.name || this.args.name || key;

		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<span
					cv-each  = "options:option:optionText"
					cv-carry = "value"
					--cv-ref  = "input:curvature/base/Tag"
				/>
					<label>
						<input
							name      = "${this.args.name}"
							type      = "radio"
							value     = "[[option]]"
							cv-bind   = "value"
							cv-expand = "attrs"
					/>
						[[optionText]]
					</label>
				</span>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
	}
	getLabel()
	{
		for(let i in this.args.options)
		{
			if(this.args.options[i] == this.args.value)
			{
				return i;
			}
		}
	}
}
