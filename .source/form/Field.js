import { View } from 'base/View';

export class Field extends View {
	constructor(values, form, parent, key) {
		super(values);
		this.args.title = this.args.title || '';
		this.args.value = this.args.value || '';

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

				this.parent.args.value[key] = v;
				setting = null;
			}
		);

		this.parent.args.value.bindTo(key, (v, k)=>{
			if(setting == k)
			{
				return;
			}

			setting = k;

			this.args.value = v;

			setting = null;
		});

		this.template = `
			<label cv-ref = "label:base/Tag">
				<span cv-if = "title" cv-ref = "title:base/Tag">[[title]]:</span>
				<input
					name    = "${this.args.name}"
					type    = "${this.args.attrs.type||'text'}"
					cv-bind = "value"
					cv-ref  = "input:base/Tag"
				/>
			</label>
		`;
		//type    = "${this.args.attrs.type||'text'}"
	}	
}
