import { Field } from './Field';

export class RadioField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		const attrs = this.args.attrs || {};

		this.args.name = attrs.name = attrs.name || this.args.name || key;

		this.args.value = this.args.value || '';

		this.template = `
			<label
				for       = "${this.getName()}"
				data-type = "${attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<span cv-each  = "options:option:optionText"/>
					<label>
						<input
							name      = "${this.args.name}"
							type      = "radio"
							value     = "[[option]]"
							cv-bind   = "value"
							cv-expand = "attrs"
							cv-on     = "change:changed(event)"
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

	changed(event)
	{
		this.args.value = event.target.value;
	}

	postRender()
	{
		this.args.bindTo('value', v => this.selectOptionByValue(v));

		this.args.options.bindTo(
			v => this.selectOptionByValue(this.args.value)
			, {frame: 1}
		);
	}

	selectOptionByValue(value)
	{
		this.findTags('input').forEach(option => {
			console.log(option.value, value);
			if(option.value == value)
			{
				option.checked = true;
			}
		});
	}
}
