import { View } from '../base/View';

import { Field         } from './Field';
import { FieldSet      } from './FieldSet';
import { SelectField   } from './SelectField';
import { RadioField    } from './RadioField';
import { HtmlField     } from './HtmlField';
import { HiddenField   } from './HiddenField';
import { ButtonField   } from './ButtonField';
import { TextareaField } from './TextareaField';

import { View as MultiField } from './multiField/View';

import { Bindable } from '../base/Bindable';

// import { Router           } from 'Router';

// import { Repository       } from '../Repository';

// import { FieldSet         } from './FieldSet';

// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';

export class Form extends View
{
	constructor(skeleton, customFields = {})
	{
		super({});

		this.args.flatValue = this.args.flatValue || {};
		this.args.value     = this.args.value     || {};
		this.args.method    = skeleton._method || 'GET';
		this.args.classes   = this.args.classes || [];
		this.skeleton       = skeleton;

		this.args.bindTo('classes', (v)=>{
			this.args._classes = v.join(' ');
		});

		this._onSubmit   = [];
		this._onRender   = [];
		this.action      = '';
		this.template    = `
			<form
				class     = "[[_classes]]"
				method    = "[[method]]"
				enctype   = "multipart/form-data"
				cv-on     = "submit:submit(event)"
				cv-ref    = "formTag:curvature/base/Tag"
				cv-each   = "fields:field"
				cv-expand = "attrs"
			>
				[[field]]
			</form>
		`;

		this.args.fields = Form.renderFields(skeleton, this, customFields);

		this.fields = this.args.fields;

		const _this = Bindable.makeBindable(this);

		this.args.bindTo(
			'value'
			, (v) => {
				_this.value = v;
			}
		);
		this.args.bindTo(
			'valueString'
			, (v) => {
				_this.json = v;
			}
		);

		return _this;
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
		// console.log(event);
	}

	onSubmit(callback)
	{
		this._onSubmit.push(callback);
	}

	onRender(callback)
	{
		if(this.nodes)
		{
			callback(this);
			return;
		}

		this._onRender.push(callback);
	}

	static renderFields(skeleton, parent = null, customFields = {})
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

			if(parent)
			{
				if(parent instanceof Form)
				{
					form = parent;
				}
				else
				{
					form = parent.form;
				}
			}

			// console.log(customFields);

			if(customFields && skeleton[i].name in customFields)
			{
				field = new customFields[ skeleton[i].name ](skeleton[i], form, parent, i)
			}
			else
			{
				switch(skeleton[i].type)
				{
					case 'fieldset':
						if(skeleton[i].attrs && skeleton[i].attrs['data-multi'])
						{
							field = new MultiField(skeleton[i], form, parent, i);
						}
						else
						{
							field = new FieldSet(skeleton[i], form, parent, i);
						}
						break;
					case 'select':
						field = new SelectField(skeleton[i], form, parent, i);
						break;
					case 'radios':
						field = new RadioField(skeleton[i], form, parent, i);
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
					case 'textarea':
						field = new TextareaField(skeleton[i], form, parent, i);
						break;
					default :
						field = new Field(skeleton[i], form, parent, i);
						break;
				}
			}

			fields[i] = field;

			const fieldName = field.key;//field.getName();

			field.args.bindTo('value', (v, k ,t, d) => {
				// console.log(t,v);
				if(t.type == 'html'
					&& !t.contentEditable
					|| t.type == 'fieldset'
				){
					return;
				}

				// let fieldName = field.args.name;

				if(t.disabled)
				{
					delete form.args.flatValue[ fieldName ];

					return;
				}

				t.attrs = t.attrs || {};

				const multiple = t.attrs.multiple;
				const newArray = Array.isArray(v);
				const oldArray = parent.args.value[fieldName];

				const exists = t.attrs.multiple && newArray && Array.isArray(oldArray);

				if(exists)
				{
					for(const i in v)
					{
						if(v[i] !== parent.args.value[fieldName][i])
						{
							parent.args.value[ fieldName ][i] = v[i];
						}

						parent.args.value[ fieldName ].splice(v.length);
					}
				}
				else
				{
					parent.args.value[ fieldName ] = v;
				}

				form.args.flatValue[ fieldName ] = v;

				form.args.valueString = JSON.stringify(form.args.value, null, 4);
				console.log();


			});
		}
		return fields;
	}

	formData(append = null, field = null, chain = [])
	{
		if(!append)
		{
			append = new FormData();
		}

		if(!field)
		{
			field = this;
		}

		let parts = [];

		for(let i in field.args.fields)
		{

			if(field.args.fields[i]
				&& field.args.fields[i].disabled
			){
				continue;
			}

			let subchain = chain.slice(0);

			subchain.push(i);

			if(field.args.fields[i]
				&& field.args.fields[i].hasChildren()
			){
				this.formData(
					append
					, field.args.fields[i]
					, subchain
				);
			}
			else if(field.args.fields[i])
			{
				// let fieldName = field.args.fields[i].args.name;

				let fieldName = field.args.fields[i].getName();

				if(field.args.fields[i].args.type == 'file'
					&& field.args.fields[i].tags.input.element.files.length
				){
					if(field.args.fields[i].args.attrs.multiple)
					{
						let files = field.args.fields[i].tags.input.element.files;

						for(let i = 0; i < files.length; i++)
						{
							if(!files[i])
							{
								continue;
							}
							append.append(fieldName + '[]', files[i]);
						}
					}
					else if(field.args.fields[i].tags.input.element.files[0])
					{
						append.append(
							fieldName
							, field.args.fields[i].tags.input.element.files[0]
						);
					}
				}
				else if(
					field.args.fields[i].args.type !== 'file'
					|| field.args.fields[i].args.value
				){
					append.append(
						fieldName
						, field.args.fields[i].args.value === undefined
							? ''
							: field.args.fields[i].args.value
					);
				}
			}
		}

		return append;
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

	static _updateFields(parent, skeleton)
	{
		for(const i in parent.args.fields)
		{
			const field = parent.args.fields[i];

			// console.log(i, field, skeleton[i]);

			if(skeleton[i])
			{
				if(skeleton[i].value)
				{
					field.args.value = skeleton[i].value;
				}

				if(skeleton[i].errors)
				{
					field.args.errors = skeleton[i].errors;
				}

				if(skeleton[i].title)
				{
					field.args.title = skeleton[i].title;
				}

				if(skeleton[i].options)
				{
					field.args.options = skeleton[i].options;
				}

				if(skeleton[i].attrs)
				{
					field.args.attrs = skeleton[i].attrs;
				}

				if(field.children && skeleton[i].children)
				{
					this._updateFields(field, skeleton[i].children);
				}
			}
		}
	}

	hasChildren()
	{
		return !!Object.keys(this.args.fields).length;
	}

	postRender()
	{
		for(let i in this._onRender)
		{
			this._onRender[i](this);
		}
	}
}
