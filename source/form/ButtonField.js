import { Field } from './Field';

export class ButtonField extends Field
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);

		this.args.title = this.args.title || this.args.value;
		this._onClick   = [];

		const attrs = this.args.attrs || {};

		attrs.type = attrs.type || this.args.type;

		this.args.name = attrs.name = this.args.name || key;

		this.template   = `
			<label
				for       = "${this.getName()}"
				data-type = "${attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<input
					name      = "${this.getName()}"
					type      = "${attrs.type}"
					value     = "[[value]]"
					cv-on     = "click:clicked(event)"
					cv-ref    = "input:curvature/base/Tag"
					cv-expand = "attrs"
				/>
			</label>
		`;
	}

	clicked(event)
	{
		const cancels = this._onClick.map((callback)=>{
			return callback(event) === false;
		}).filter(r=>r);

		if(cancels.length)
		{
			if(this.args.attrs.type == 'submit')
			{
				event.preventDefault();
				event.stopPropagation();
			}
			return;
		}

		if(this.args.attrs.type == 'submit')
		{
			event.preventDefault();
			event.stopPropagation();

			this.form.tags.formTag.element.dispatchEvent(new Event(
				'submit', {
					'cancelable': true
					, 'bubbles':  true
				}
			));
		}
	}

	onClick(callback)
	{
		this._onClick.push(callback);
	}
}
