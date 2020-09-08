import { Field } from './Field';
import { Form  } from './Form';

export class FieldSet extends Field
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || 'fieldset';

		this.array = false;

		if(values.array || attrs['data-array'] || attrs['data-multi'])
		{
			this.array = attrs['data-array'] = true;
		}

		this.args.value  = {};
		this.args.fields = Form.renderFields(values.children, this);
		this.fields      = this.args.fields;

		this.template    = `
			<label
				for        = "${this.getName()}"
				data-type  = "${attrs.type}"
				data-multi = "${attrs['data-multi'] ? 'true' : 'false'}"
				cv-ref     = "label:curvature/base/Tag"
			>
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<fieldset
					name   = "${this.getName()}"
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
