import { Config      } from 'Config';
import { FormWrapper } from './FormWrapper';
import { HiddenField } from '../../form/HiddenField';
import { Repository  } from '../../base/Repository';

const backend = Config ? Config.backend : '//';

export class SearchForm extends FormWrapper
{
	constructor(args, path, method = 'GET', customFields = {})
	{
		super(
			args
			, path
			, 'POST'
			, {search: HiddenField}
		);

		this.superTemplate = this.template;

		this.args.records = [];
		this.selected     = null;

		this.template = `
			${this.superTemplate}
			<div cv-each = "records:record:r" class = "dropdown-results">
				<div
					cv-on         = "click:select(event)"
					data-index    = "[[r]]"
					data-publicId = "[[record.publicId]]"
					class         = "[[record.classes]]"
				>
					[[record.title]]
				</div>
			</div>
		`;
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

		form.args.flatValue.bindTo('keyword', (v)=>{
			this.args.records = [];
			this.selected     = null;

			if(!v)
			{
				return;
			}

			console.log(this.path, v);

			Repository.request(
				backend + this.path
				, {keyword: v}
			).then((response)=>{
				console.log(response.body);
				if(!response.body)
				{
					return;
				}

				this.args.records = response.body.map((r)=>{
					r.classes = '';
					if(r.title == v)
					{
						r.classes = 'selected';
						this.selected = r;
					}
					return r;
				});
			});
		})


		super.onLoad(form);
	}

	onRequest()
	{
		// this.args.view.args.loading = true;
		// this.args.view.args.classes += ' loading';

		return super.onRequest();
	}

	onResponse(response)
	{
		// this.args.view.args.loading = false;
		// this.args.view.args.classes = '';

		// if(!this.args.wrapper)
		// {
		// 	this.args.view.addRecord(response.body);
		// }
		// else
		// {
		// 	this.args.wrapper.refresh(response.body);
		// }

		// this.args.view.addButtonClicked();

		super.onResponse(response);
	}

	select(event)
	{
		let index    = event.target.getAttribute('data-index');
		let publicId = event.target.getAttribute('data-publicId');

		let record   = this.args.records[index];

		console.log(record);

		this.args.view.addRecord(record);
		this.args.view.addButtonClicked();

		return;

		Repository.request(
			backend
				+ this.path
				+ '/'
				+ publicId
		).then((response)=>{
			console.log(response.body);
			if(!response.body)
			{
				return;
			}

			this.args.view.addRecord(response.body);
			this.args.view.addButtonClicked();
		});
	}

	onSubmit(form, event)
	{
		event.preventDefault();
		event.stopPropagation();
		if(this.selected)
		{
			this.args.view.addRecord(this.selected);
			this.args.view.addButtonClicked();
		}
		return false;
	}
}
