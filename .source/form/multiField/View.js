import { Config      } from 'Config';
import { Form        } from '../../form/Form';
import { FieldSet    } from '../../form/FieldSet';
import { CreateForm  } from './CreateForm';
import { SearchForm  } from './SearchForm';
import { FormWrapper } from './FormWrapper';
import { Wrapper     } from './Wrapper';
// import { Loader     } from '../Ui/ZZ';

export class View extends FieldSet
{
	constructor(values, form, parent, key)
	{
		super(values, form, parent, key);

		this.args._fields = [];

		this.dragging = false;
		this.dropping = false;

		for(let i in this.args.fields)
		{
			this.args._fields[i] = this.wrapSubfield(this.args.fields[i]);
		}

		this.args.fields[-1].disable();

		this.args.creating  = '';
		this.args.fieldType = '';

		this.args.createForm = this.args.createForm || '';
		this.args.searchForm = this.args.searchForm || '';
		this.args.createFormReady = false;

		this.setCreateForm({view: this});

		this.args.loader  = '...';
		this.args.addIcon = '&#215;';
		this.args.addIcon = 'a';
		this.args.addIcon = '+';

		this.args.draggable = 'true';

		this.template = `
			<label
				for        = "${this.args.name}"
				data-type  = "${this.args.attrs.type}"
				data-multi = "${this.args.attrs['data-multi'] ? 'true' : 'false'}"
			>
				<span cv-if = "title">
					<span cv-ref = "title:curvature/base/Tag">[[title]]</span>
				</span>

				<fieldset
					name  = "${this.args.name}"
					class = "multi-field [[creating]] [[fieldType]]"
				>

					<div class = "record-list" cv-each = "_fields:field:f">
						<div
							class     = "single-record"
							data-for  = "[[f]]"
							draggable = "[[draggable]]"
							cv-on     = "
								drop:drop(event);
								dragstart:drag(event);
								dragend:dragStop(event);
								dragover:dragOver(event);
							"
						>
							[[field]]
						</div>
					</div>

					<div class = "overlay create">
						<div class = "form constrict">
							<div
								cv-on = "click:addButtonClicked(event)"
								class = "bubble bottom left-margin close"
							>
								&#215;
							</div>
						</div>
						[[createForm]]
						[[searchForm]]
					</div>

					<div class = "overlay loading">
						[[loader]]
					</div>
					<div cv-if = "createFormReady" class="add-button-holder">

						<div
							cv-on = "click:addButtonClicked(event)"
							class = "bubble bottom left-margin add"
							tab-index = "0"
						>[[addIcon]]</div>

					</div>

				</fieldset>

				<span cv-each = "errors:error:e">
					<p class = "cv-error">[[error]]</p>
				</span>

			</label>
		`;
	}

	setCreateForm(args)
	{
		let origin = '';

		if(Config && Config.backend)
		{
			origin = Config.backend;
		}

		if(this.args.attrs['data-create-endpoint'] !== false)
		{
			this.args.createForm = new CreateForm(
				Object.assign({}, args)
				, this.args.attrs['data-create-endpoint']
					? origin + this.args.attrs['data-create-endpoint']
					: (args.publicId
						? origin + `${this.args.attrs['data-endpoint']}/${args.publicId}/edit`
						: origin + `${this.args.attrs['data-endpoint']}/create`
					)
			);

			this.args.createForm._onLoad.push((wrap, form)=>{
				this.args.createFormReady = true;
			});
		}
		else
		{
			this.args.createFormReady = true;
		}

		console.log(this.args.createFormReady);

		this.args.searchForm = new SearchForm(
			Object.assign({}, args)
			, origin + this.args.attrs['data-endpoint']
		);
	}

	wrapSubfield(field)
	{
		return new Wrapper({field, parent:this});
	}

	addButtonClicked()
	{
		if(!this.args.creating)
		{
			this.args.creating = 'creating';
		}
	}

	addRecord(record)
	{
		this.args.creating = '';

		if(!Array.isArray(record))
		{
			record = [record];
		}

		for(let i in record)
		{
			let fieldClass = this.args.fields[-1].constructor;

			let skeleton   = Object.assign({}, this.args.fields[-1].skeleton);
			let name       = Object.values(this.args.fields).length - 1;

			skeleton = this.cloneSkeleton(skeleton);

			skeleton = this.correctNames(skeleton, name);
			skeleton.attrs = skeleton.attrs ?? {};

			skeleton.attrs['data-array'] = true;

			let superSkeleton = {};

			superSkeleton[name] = skeleton;

			let newField = Form.renderFields(superSkeleton, this)[name];

			this.args.fields[name] = newField;

			let newWrap = this.wrapSubfield(newField);

			newField.args.value.id    = record[i].id    || '';
			newField.args.value.class = record[i].class || '';
			newField.args.value.title = record[i].title || '';

			this.args._fields.push(newWrap);

			newWrap.refresh(record[i]);
		}

	}

	editRecord(record, wrapper)
	{
		this.setCreateForm({
			view: this
			, publicId: record.publicId
			, wrapper
		});

		this.args.creating = this.args.creating ? '' : 'creating';
	}

	deleteImage(index)
	{
		console.log(index, this.args.fields);

		this.args.fields[index].disable();
		this.args._fields[index].args.classes = 'deleted';
	}

	undeleteImage(index)
	{
		this.args.fields[index].enable();
		// console.log(this.args.fields[index]);
		// console.log(this.args._fields[index]);
		// console.log('===============');

		this.args._fields[index].args.classes = '';
	}

	cloneSkeleton(object, level = 0)
	{
		let _object = {};

		if(Array.isArray(object))
		{
			_object = [];
		}

		for(let i in object)
		{
			if(i == 'fields')
			{
				continue;
			}

			if(!object[i] || typeof object[i] !== 'object')
			{
				_object[i] = object[i];

				continue;
			}

			_object[i] = Object.assign({}, this.cloneSkeleton(
				object[i]
				, level+1
			));
		}

		return _object;
	}

	correctNames(skeleton, id)
	{
		skeleton.name = skeleton.name.replace(
			/\[-1\]/
			, `[${id}]`
		);

		skeleton.attrs.name = skeleton.name;

		if('children' in skeleton)
		{
			for(let i in skeleton.children)
			{
				skeleton.children[i] = this.correctNames(
					skeleton.children[i]
					, id
				);
			}
		}

		return skeleton;
	}

	drag(event)
	{
		this.dragging = event.target;
	}

	dragOver(event)
	{
		if(!this.dragging)
		{
			return false;
		}

		let dropping = event.target;

		while(dropping && !dropping.matches('[draggable="true"]'))
		{
			dropping = dropping.parentNode;
		}

		if(dropping)
		{
			this.dropping = dropping;
			event.preventDefault();
		}
	}

	drop(event)
	{
		event.stopPropagation();

		let dragLabel = this.dragging.querySelector('label');
		let dropLabel = this.dropping.querySelector('label');

		let dragName = dragLabel.getAttribute('for');
		let dropName = dropLabel.getAttribute('for');

		let dragIndex = this.extractIndex(dragName);
		let dropIndex = this.extractIndex(dropName);

		if(dragIndex == dropIndex || dragIndex == dropIndex - 1)
		{
			this.dragging = false;
			this.dropping = false;
			return;
		}

		let dragFields = dragLabel.querySelectorAll(
			'[name^="' + dragName + '"]'
		);
		let dragLabels = dragLabel.querySelectorAll(
			'[for^="' + dragName + '"]'
		);

		let dropFields = dropLabel.querySelectorAll(
			'[name^="' + dropName + '"]'
		);
		let dropLabels = dropLabel.querySelectorAll(
			'[for^="' + dropName + '"]'
		);

		let dropBefore = this.dropping;

		let offset = 0;

		let dragField, dropField;

		for(let i in this.args.fields)
		{
			let currentFieldSet = this.args.fields[i].tags.input.element;
			let currentLabel    = this.args.fields[i].tags.label.element;
			let currentName     = currentFieldSet.getAttribute('name');

			if(dragLabel == currentLabel)
			{
				dragField = this.args.fields[i];
			}

			if(dropLabel == currentLabel)
			{
				dropField = this.args.fields[i];
			}

			let currentIndex    = this.extractIndex(currentName);
			let newName         = false;

			if(currentIndex < 0)
			{
				continue;
			}

			if(dragIndex > dropIndex
				&& currentIndex >= dropIndex
				&& currentIndex <= dragIndex
			){
				newName = this.changeIndex(currentName, currentIndex + 1);
				offset = -1;
			}
			else if(
				dragIndex < dropIndex
				&& currentIndex <= dropIndex
				&& currentIndex >= dragIndex
			){
				newName = this.changeIndex(currentName, currentIndex - 1);
				offset = 0;
			}

			if(newName !== false)
			{
				this.changeAttributePrefix(
					currentLabel
					, 'for'
					, currentName
					, newName
				);

				this.args.fields[i].args.fieldName = newName;

				this.changeAttributePrefix(
					currentFieldSet
					, 'name'
					, currentName
					, newName
				);

				let currentFields = currentFieldSet.parentNode.querySelectorAll(
					'[name^="' + currentName + '"]'
				);

				for(let i = 0; i < currentFields.length; i++)
				{
					this.changeAttributePrefix(
						currentFields[i]
						, 'name'
						, currentName
						, newName
					);
				}

				let currentLabels = currentFieldSet.parentNode.querySelectorAll(
					'[for^="' + currentName + '"]'
				);

				for(let i = 0; i < currentLabels.length; i++)
				{
					this.changeAttributePrefix(
						currentLabels[i]
						, 'for'
						, currentName
						, newName
					);
				}
			}
		}

		dragName = dragLabel.getAttribute('for');
		dropName = dropLabel.getAttribute('for');

		dragIndex = this.extractIndex(dragName);
		dropIndex = this.extractIndex(dropName);

		this.changeAttributePrefix(
			dragLabel
			, 'for'
			, dragName
			, this.changeIndex(dragName, dropIndex + offset)
		);

		for(let i =0; i < dragFields.length; i++)
		{
			this.changeAttributePrefix(
				dragFields[i]
				, 'name'
				, dragName
				, this.changeIndex(dragName, dropIndex + offset)
			);
		}

		for(let i =0; i < dragLabels.length; i++)
		{
			this.changeAttributePrefix(
				dragLabels[i]
				, 'for'
				, dragName
				, this.changeIndex(dragName, dropIndex + offset)
			);
		}

		dragField.args.fieldName = dragLabel.getAttribute('for');

		this.changeAttributePrefix(
			dropLabel
			, 'for'
			, dropName
			, this.changeIndex(dropName, (dropIndex + offset) + 1)
		);

		for(let i =0; i < dropFields.length; i++)
		{
			this.changeAttributePrefix(
				dropFields[i]
				, 'name'
				, dropName
				, this.changeIndex(dropName, (dropIndex + offset) + 1)
			);
		}

		for(let i =0; i < dropLabels.length; i++)
		{
			this.changeAttributePrefix(
				dropLabels[i]
				, 'for'
				, dropName
				, this.changeIndex(dropName, (dropIndex + offset) + 1)
			);
		}

		dropField.args.fieldName = dropLabel.getAttribute('for');

		this.dragging.parentNode.insertBefore(
			this.dragging, dropBefore
		);

		this.dragging = false;
		this.dropping = false;
	}

	dragStop()
	{
		this.dragging = false;
		this.dropping = false;
	}

	changeAttributePrefix(node, attribute, oldPrefix, newPrefix)
	{
		let oldName = node.getAttribute(attribute);

		let newName = newPrefix
			+ node.getAttribute(attribute).substring(
				oldPrefix.length
			);

		node.setAttribute(attribute, newName);
	}

	extractIndex(name)
	{
		let groups;

		if(groups = /\[(-?\d+)\]$/.exec(name))
		{
			return parseInt(groups[1]);
		}

		return false;
	}

	changeIndex(name, index)
	{
		let newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');

		return newName;
	}

	cancel(event)
	{
		event.stopPropagation();
	}
}
