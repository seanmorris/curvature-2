import { Field } from './Field';

export class SelectField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label for = "${this.args.name}" cv-ref = "label:curvature/base/Tag">
				<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>
				<select
					name    = "${this.args.name}"
					cv-bind = "value"
					cv-each = "options:option:optionText"
					cv-ref  = "input:curvature/base/Tag"
				/>
					<option value = "[[option]]">[[optionText]]</option>
				</select>
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
