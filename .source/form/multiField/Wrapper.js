import { Config     } from 'Config';
import { View       } from '../../base/View';
import { Repository } from '../../base/Repository';

export class Wrapper extends View
{
	constructor(args)
	{
		super(args);

		this.template = `
			<div
				class = "wrapped-field [[classes]]"
				cv-on = "click:editRecord(event, key)"
				title = "[[fieldName]]: [[id]]"
			>
				<div
					cv-on = "click:deleteImage(event, key)"
					style = "display: inline; cursor:pointer;"
				>
					[[icon]]
				</div>
				<div class = "field-content">
					[[title]]
				</div>
			</div>
			<div style = "display:none">[[field]]</div>
		`;

		// console.log(this.args.field);

		this.args.field     = this.args.field || '!';
		this.args.keyword   = '';
		this.args.title     = '';
		this.args.record    = {};
		this.args.key       = this.args.field.key;
		this.args.classes   = '';
		this.args.icon      = '×';
		this.deleted        = false;


		this.args.field.args.bindTo('fieldName', (v)=>{
			this.args.fieldName = v;
		});

		this.args.fieldName = this.args.field.args.name;

		this.args.id = this.args.field.args.value.id;

		this.args.bindTo('id', (v)=>{
			this.args.field.args.value.id = v;
		});

		this.args.field.args.value.bindTo('id', (v,k)=>{
			if(!v)
			{
				return;
			}

			Repository.request(
				this.backendPath()
				, {id: v}
			).then(response=>{
				this.args.id = v;

				let record = response.body[0];

				if(!record)
				{
					this.args.publicId = null;
					this.args.title    = null;

					return;
				}

				this.refresh(record);
			});
		}, {wait: 0});

		this.args.field.args.value.bindTo('keyword', (v)=>{
			this.args.keyword = v;
		});
	}

	editRecord()
	{
		this.args.parent.editRecord(
			this.args.record
			, this
		);
	}

	deleteImage(event, index)
	{
		event.stopPropagation();

		if(!this.deleted)
		{
			this.args.icon = '↺';
			this.args.parent.deleteImage(index);
			this.deleted = true;
		}
		else
		{
			this.args.icon = '×';
			this.args.parent.undeleteImage(index);
			this.deleted = false;
		}
	}

	backendPath()
	{
		const backend = Config ? Config.backend : '//';

		return backend + this.args.parent.args.attrs['data-endpoint'];
	}

	getRecordTitle(record)
	{
		if(record._titleField)
		{
			return record[ record._titleField ];
		}

		return record.title
			|| record.publicId
			|| record.id;
	}

	refresh(model)
	{
		for(let i in model)
		{
			this.args[i] = model[i];
		}

		this.args.record = model;

		this.args.title = this.getRecordTitle(model);
	}
}
