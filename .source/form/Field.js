import { Bindable } from 'curvature/base/Bindable';

import { View } from '../base/View';

export class Field extends View {
	constructor(values, form, parent, key) {
		let skeleton = Object.assign(values);
		
		super(values);
		
		this.args.title = this.args.title || '';
		this.args.value = this.args.value || '';
		this.skeleton   = skeleton;

		this.args.valueString = '';

		this.form   = form;
		this.parent = parent;
		this.key    = key;

		this.ignore = this.args.attrs['data-cv-ignore'] || false;

		let setting = null;

		this.args.bindTo(
			'value'
			, (v, k) => {
				// console.trace();
				// console.log(this.args.name, v, k);

				if(setting == key)
				{
					return;
				}

				// console.log(this.args.name, v, k);

				this.args.valueString = JSON.stringify(v||'', null, 4);

				setting = key;

				if(this.args.attrs.type == 'file')
				{
					if(this.tags.input && this.tags.input.element.files)
					{
						console.log(this.tags.input.element.files[0]);

						this.parent.args.value[key] = this.tags.input.element.files[0];
					}
				}
				else
				{
					this.parent.args.value[key] = v;
				}
				setting = null;
			}
		);

		// this.parent.args.value = Bindable.makeBindable(this.parent.args.value);

		this.parent.args.value.bindTo(key, (v, k)=>{
			if(setting == k)
			{
				return;
			}

			setting = k;

			if(this.args.attrs.type == 'file')
			{
				if(this.tags.input && this.tags.input.element.files)
				{
					this.args.value = this.tags.input.element.files[0];
				}
			}
			else
			{
				this.args.value = v;
			}

			setting = null;
		});

		let extra = '';

		if(this.args.attrs.type == 'checkbox')
		{
			extra = 'value = "1"';
		}

		this.template = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
				cv-ref    = "label:curvature/base/Tag"
			>
				<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>
				<input
					name    = "${this.args.name}"
					type    = "${this.args.attrs.type||'text'}"
					cv-bind = "value"
					cv-ref  = "input:curvature/base/Tag"
					${extra}
				/>
			</label>
		`;
		//type    = "${this.args.attrs.type||'text'}"
	}
	hasChildren()
	{
		return false;
	}
}
