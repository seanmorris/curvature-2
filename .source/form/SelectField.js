import { Field } from './Field';

export class SelectField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${attrs.type || 'select'}"
				cv-ref    = "label:curvature/base/Tag">
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<select
					name      = "${this.args.name}"
					cv-bind   = "value"
					cv-each   = "options:option:optionText"
					cv-ref    = "input:curvature/base/Tag"
					cv-expand = "attrs"
				/>
					<option value = "[[option]]">[[optionText]]</option>
				</select>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
	}

	postRender()
	{
		this.args.bindTo('value', v => this.selectOptionByValue(v));
		this.args.bindTo('options', v => this.selectOptionByValue(this.args.value), {frame:true});
	}

	selectOptionByValue(value)
	{
		let tag = this.tags.input.element;

		for(const option of tag.options)
		{
			if(option.value == value)
			{
				tag.selectedIndex = option.index;
			}
		}
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
