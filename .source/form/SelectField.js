import { Field } from './Field';

export class SelectField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);
		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
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
			</label>
		`;

		this.args.bindTo('value', (v,k,t,d,p)=>{
			// console.log(this.args.name,v,p);
		});
	}

	postRender(parentNode)
	{
		this.onTimeout(0,()=>{
			let tag = this.tags.input.element;

			for(let i in tag.options)
			{
				let option = tag.options[i];

				if(option.value == this.args.value)
				{
					tag.selectedIndex = i;
				}
			}
		});
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
