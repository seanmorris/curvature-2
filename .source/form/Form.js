import { View } from '../base/View';

import { Field       } from './Field';
import { FieldSet    } from './FieldSet';
import { SelectField } from './SelectField';
import { HtmlField   } from './HtmlField';
import { HiddenField } from './HiddenField';
import { ButtonField } from './ButtonField';

// import { Router           } from 'Router';

// import { Repository       } from '../Repository';

// import { FieldSet         } from './FieldSet';

// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';

export class Form extends View
{
	constructor(skeleton)
	{
		super({});
		this.args.flatValue = this.args.flatValue || {};
		this.args.value     = this.args.value     || {};

		this.args.method    = skeleton._method || 'GET';

		this.args.classes   = this.args.classes || [];

		this.args.bindTo('classes', (v)=>{
			this.args._classes = v.join(' ');
		});

		this._onSubmit  = [];
		this.action     = '';
		this.template   = `
			<form
				class   = "[[_classes]]"
				method  = "[[method]]"
				cv-each = "fields:field"
				cv-on   = "submit:submit(event)"
				cv-ref  = "formTag:curvature/base/Tag"
			>
				[[field]]
			</form>
		`;

		this.args.fields    = Form.renderFields(skeleton, this);

		this.args.bindTo(
			'value'
			, (v) => {
				this.args.valueString = JSON.stringify(v, null, 4);
			}
		);
	}
	submitHandler(event)
	{
		event.preventDefault();
		event.stopPropagation();
	}

	submit(event)
	{
		this.args.valueString = JSON.stringify(
			this.args.value
			, null
			, 4
		);

		for(let i in this._onSubmit)
		{
			this._onSubmit[i](this, event);
		}
	}
	buttonClick(event)
	{
		console.log(event);
	}
	onSubmit(callback)
	{
		this._onSubmit.push(callback);
	}
	static renderFields(skeleton, parent = null)
	{
		let fields = {};
		for(let i in skeleton)
		{
			if(fields[i])
			{
				continue;
			}
			if(i.substr(0,1) == '_')
			{
				continue;
			}

			let field = null;
			let form  = null;
			if(parent instanceof Form)
			{
				form = parent;
			}
			else
			{
				form = parent.form;
			}

			switch(skeleton[i].type)
			{
				case 'fieldset':
					field = new FieldSet(skeleton[i], form, parent, i);
					break;
				case 'select':
					field = new SelectField(skeleton[i], form, parent, i);
					break;
				case 'html':
					field = new HtmlField(skeleton[i], form, parent, i);
					break;
				case 'submit':
				case 'button':
					field = new ButtonField(skeleton[i], form, parent, i);
					break;
				case 'hidden':
					field = new HiddenField(skeleton[i], form, parent, i);
					break;
				default :
					field = new Field(skeleton[i], form, parent, i);
					break;
			}

			fields[i] = field;

			field.args.bindTo(
				'value'
				, (v, k ,t, d) => {
					// console.log(t,v);
					if(t.type == 'html' && !t.contentEditable || t.type == 'fieldset')
					{
						return;
					}
					form.args.flatValue[ field.args.name ] = v;
				}
			);
		}
		return fields;
	}
	queryString(args = {})
	{
		let parts = [];
		
		for(let i in this.args.flatValue)
		{
			args[i] = args[i] || this.args.flatValue[i];
		}

		for(let i in args)
		{
			parts.push(i + '=' + encodeURIComponent(args[i]));
		}

		return parts.join('&');
	}
	populate(values)
	{
		// console.log(values);

		for(let i in values)
		{
			this.args.value[i] = values[i];
		}
	}
}
