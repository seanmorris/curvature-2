import { View     } from '../base/View';
import { Bindable } from '../base/Bindable';

export class Field extends View {
	constructor(values, form, parent, key) {
		let skeleton = Object.assign({}, values);

		super(skeleton);

		this.args.title = this.args.title ?? key;
		this.args.value = this.args.value ?? '';
		this.value      = this.args.value ?? '';
		this.skeleton   = skeleton;
		this.disabled   = null;

		this.args.valueString = '';

		this.form   = form;
		this.parent = parent;
		this.key    = key;

		this.ignore = this.args.attrs
			? this.args.attrs['data-cv-ignore'] || false
			: false;

		let extra = '';

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || skeleton.type || null;
		this.args.name = attrs.name = attrs.name || this.args.name || key;

		if(attrs.type == 'checkbox')
		{
			extra = 'value = "1"';
		}

		this.template = `
			<label
				for           = "${this.getName()}"
				data-type     = "${attrs.type || 'text'}"
				cv-ref        = "label:curvature/base/Tag"
			>
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>
				<input
					name      = "${this.getName()}"
					type      = "${attrs.type || 'text'}"
					cv-bind   = "value"
					cv-ref    = "input:curvature/base/Tag"
					cv-expand = "attrs"
					${extra}
				/>
				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>
			</label>
		`;
		//type    = "${this.args.attrs.type||'text'}"

		// let key     = this.key;
		let setting = null;

		this.args.bindTo('value', (v, k) => {

			if(!isNaN(v)
				&& v.length
				&& v == Number(v)
				&& v.length === String(Number(v)).length
			){
				v = Number(v);
			}

			this.value = v;

			if(setting == k)
			{
				return;
			}

			setting = key;

			this.args.valueString = JSON.stringify(v||'', null, 4);
			this.valueString = this.args.valueString;

			if(attrs.type == 'file'
				&& this.tags.input
				&& this.tags.input.element.files
				&& this.tags.input.element.length
			){
				if(!attrs.multiple)
				{
					this.parent.args.value[key] = this.tags.input.element.files[0];
				}
				else
				{
					const files = Array.from(this.tags.input.element.files);

					if(!this.parent.args.value[k] || !files.length)
					{
						this.parent.args.value[key] = files;
					}
					else
					{
						for(const i in files)
						{
							if(files[i] !== this.parent.args.value[key][i])
							{
								this.parent.args.value[key] = files;
							}
						}

						this.parent.args.value.splice(files.length);
					}
				}
			}
			else
			{
				if(!this.parent.args.value)
				{
					this.parent.args.value = {};
				}

				this.parent.args.value[key] = v;
			}

			this.args.errors = [];

			setting = null;
		});

		// this.parent.args.value = Bindable.makeBindable(this.parent.args.value);

		this.parent.args.value[this.key] = this.args.value;

		this.parent.args.value.bindTo(key, (v, k)=>{

			if(setting == k)
			{
				return;
			}

			setting = k;


			if(attrs.type == 'file')
			{
				if(this.tags.input
					 && this.tags.input.element.files
					 && this.tags.input.element.files.length
				){
					if(!attrs.multiple)
					{
						this.parent.args.value[key] = this.tags.input.element.files[0];
					}
					else
					{
						const files = Array.from(this.tags.input.element.files);

						if(!this.parent.args.value[key] || !files.length)
						{
							this.parent.args.value[key] = files;
						}
						else
						{
							for(const i in files)
							{
								if(files[i] !== this.parent.args.value[key][i])
								{
									this.parent.args.value[key] = files;
								}
							}

							this.parent.args.value[key].splice(files.length);
						}

					}
				}
				else
				{
					this.args.value = v;
				}
			}
			else
			{
				this.args.value = v;
			}

			setting = null;
		});
	}

	disable()
	{
		if(this.hasChildren())
		{
			// for(let i in this.args.fields)
			// {
			// 	this.args.fields[i].disable();
			// }
		}

		this.disabled = 'disabled';
	}

	enable()
	{
		if(this.hasChildren())
		{
			// for(let i in this.args.fields)
			// {
			// 	this.args.fields[i].disable();
			// }
		}

		this.disabled = false;
	}

	hasChildren()
	{
		return false;
	}

	getName(cascadeIfPossible = true)
	{
		if(this.tags.input)
		{
			return this.tags.input.element.getAttribute('name');
		}

		let name = this.key;

		if(cascadeIfPossible)
		{
			let parent = this.parent;

			const names = [name];

			while(parent && parent.array && typeof parent.key !== 'undefined')
			{
				names.unshift(parent.key);
				parent = parent.parent;
			}

			name = names.shift();

			if(names.length)
			{
				name += `[${names.join('][')}]`;
			}
		}

		return name;
	}
}
