import { Field } from './Field';

export class HtmlField extends Field {
	constructor(values, form, parent, key) {
		super(values, form, parent, key);

		this.key = key;

		this.args.tagName = this.args.tagName || 'div';

		this.args.displayValue = this.args.value;

		this.args.attrs = this.args.attrs || {};

		this.ignore = this.args.attrs['data-cv-ignore'] || false;

		this.args.contentEditable = this.args.attrs.contenteditable || false;

		this.args.bindTo('value', v => {
			if(!this.tags.input)
			{
				return;
			}

			if(this.tags.input.element === document.activeElement)
			{
				return;
			}

			this.args.displayValue = v;
		});

		this.template = `<${this.args.tagName}
			name            = "${this.getName()}"
			cv-ref          = "input:curvature/base/Tag"
			contenteditable = "[[contentEditable]]"
			cv-expand       = "attrs"
			cv-bind         = "$displayValue"
			cv-on           = "input:inputProvided(event);"
		></${this.args.tagName}>`;
	}

	postRender()
	{
		this.observer = new MutationObserver(mutations => {

			const element = this.tags.input.element;

			const nodes = Array.from(element.childNodes).filter(node => {

				return node.length > 0 || node.nodeType !== node.TEXT_NODE

			});

			const lines = nodes.map(n => (n.outerHTML || n.textContent));

			this.args.value = lines.join('')
				.replace(/&lt;/i, '<')
				.replace(/&gt;/i, '>');
		});

		this.observer.observe(
			this.tags.input.element
			, {
				characterData: true
				, attributes:  true
				, childList:   true
				, subtree:     true
			}
		);
	}

	inputProvided(event)
	{
		this.args.value = event.target.innerHTML;
	}

	hasChildren()
	{
		return false;
	}

	getName()
	{
		return this.key;
	}
}
