import { FormWrapper } from './FormWrapper';
import { HiddenField } from '../../form/HiddenField';

export class CreateForm extends FormWrapper
{
	constructor(args, path, method = 'GET', customFields = {})
	{
		super(
			args
			, path
			, 'POST'
			, customFields || {
				// title: HiddenField
			}
		);

		this.creating = !!args.publicId;
	}

	onLoad(form)
	{
		for(let i in form.args.fields)
		{
			if(!form.args.fields[i].tags.input)
			{
				continue;
			}

			if(form.args.fields[i].args.attrs.type == 'hidden')
			{
				continue;
			}

			let element = form.args.fields[i].tags.input.element;

			element.focus();

			break;
		}

		super.onLoad(form);
	}

	onRequest()
	{
		this.args.view.args.loading = true;
		this.args.view.args.classes += ' loading';

		return super.onRequest();
	}

	onResponse(response)
	{
		this.args.view.args.loading = false;
		this.args.view.args.classes = '';

		if(!response.body)
		{
			super.onResponse(response);
			return;
		}

		if(!this.args.wrapper)
		{
			this.args.view.addRecord(response.body);
		}
		else
		{
			this.args.wrapper.refresh(response.body);
		}

		this.args.view.args.creating = '';

		super.onResponse(response);
	}
}
