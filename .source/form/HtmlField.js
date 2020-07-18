import { Field } from './Field';

export class HtmlField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		this.key = key;

		this.args.displayValue = this.args.value;

		this.args.fragment = new DocumentFragment;

		this.args.bindTo('value', v => {

			if(this.tags.input)
			{
				if(this.tags.input.element === document.activeElement)
				{
					return;
				}
			}
			else
			{
				return;
			}

			const element = this.tags.input.element;


			const nodes = Array.from(element.childNodes).filter(node => {

				return node.length > 0 || node.nodeType !== node.TEXT_NODE

			});

			const value = nodes.map(n => n.outerHTML).join("\n");

			this.args.displayValue = value;

		});

		this.args.attrs = this.args.attrs || {};

		this.ignore = this.args.attrs['data-cv-ignore'] || false;
		this.args.contentEditable = this.args.attrs.contenteditable || false;
		this.template = `<div
			name            = "${this.getName()}"
			cv-ref          = "input:curvature/base/Tag"
			contenteditable = "[[contentEditable]]"
			cv-expand       = "attrs"
			cv-bind         = "$displayValue"
			cv-on           = "
				blur:inputProvided(event);
				input:inputProvided(event);
				changed:inputProvided(event);
			"
		></div>`;
	}

	inputProvided(event)
	{
		const inputTag = this.tags.input.element;

		if(inputTag !== event.target)
		{
			return;
		}

		if(this.tags.input && this.tags.input.element.matches('[contenteditable]'))
		{
			if(this.tags.input.element === document.activeElement)
			{
				return;
			}
		}

		this.args.value = event.target.innerHTML;
	}

	hasChildren()
	{
		return false;
	}

	disable()
	{
		this.args.disabled = 'disabled';
	}

	getName()
	{
		let name = this.key;

		if(this.tags.input)
		{
			// return this.tags.input.element.getAttribute('name');
		}

		return name;
	}
}
