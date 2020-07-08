import { Field } from './Field';
import { Form  } from './Form';

export class FieldSet extends Field
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);
		this.args.value  = {};
		this.args.fields = Form.renderFields(values.children, this);
		this.fields      = this.args.fields;

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || 'fieldset';

		this.template    = `
			<label
				for        = "${this.args.name}"
				data-type  = "${attrs.type}"
				data-multi = "${attrs['data-multi'] ? 'true' : 'false'}"
				cv-ref     = "label:curvature/base/Tag"
			>
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<fieldset
					name   = "${this.args.name}"
					cv-ref = "input:curvature/base/Tag"
					cv-expand="attrs"
					cv-each = "fields:field"
				>
					[[field]]
				</fieldset>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
	}
	hasChildren()
	{
		return !!Object.keys(this.args.fields).length;
	}
	wrapSubfield(field)
	{
		return field;
	}
}
