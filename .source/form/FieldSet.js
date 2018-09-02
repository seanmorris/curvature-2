import { Field } from './Field';
import { Form  } from './Form';

export class FieldSet extends Field
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);
		this.args.value  = {};
		this.args.fields = Form.renderFields(values.children, this);
		this.template    = `
			<label
				for        = "${this.args.name}"
				data-type  = "${this.args.attrs.type}"
				data-multi = "${this.args.attrs['data-multi'] ? 'true' : 'false'}"
			>
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<fieldset name = "${this.args.name}" cv-expand="attrs">
					<div cv-each = "fields:field">
						<div cv-bind = "field"></div>
					</div>
				</fieldset>
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
