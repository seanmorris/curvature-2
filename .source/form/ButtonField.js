import { Field } from './Field';

export class ButtonField extends Field
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);

		this.args.title = this.args.title || this.args.value;
		this._onClick   = [];

		this.template   = `
			<label
				for       = "${this.args.name}"
				data-type = "${this.args.attrs.type}"
				cv-ref    = "label:curvature/base/Tag">
				<input
					name      = "${this.args.name}"
					type      = "${this.args.attrs.type}"
					value     = "[[title]]"
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
