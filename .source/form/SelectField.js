import { Field } from './Field';

export class SelectField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label cv-ref = "label:base/Tag">
				<span cv-if = "title" cv-ref = "title:base/Tag">[[title]]:</span>
				<select
					name    = "${this.args.name}"
					cv-bind = "value"
					cv-each = "options:option:optionText"
					cv-ref  = "input:base/Tag"
				/>
					<option value = "[[option]]">[[optionText]]</option>
				</select>
			</label>
		`;
	}
	getLabel(value)
	{
		for(let i in this.args.options)
		{
			if(this.args.options[i] == value)
			{
				return i;
			}
		}
	}
}
