import { Dom  } from './Dom';
import { Tag  } from './Tag';
import { View } from './View';

export class RuleSet
{
	static add(selector, callback)
	{
		this.globalRules = this.globalRules
			|| {};
		this.globalRules[selector] = this.globalRules[selector]
			|| [];

		this.globalRules[selector].push(callback);

		return this;
	}

	static apply(doc = document, view = null)
	{
		for(let selector in this.globalRules)
		{
			for(let i in this.globalRules[selector])
			{
				const callback = this.globalRules[selector][i];
				const wrapped  = this.wrap(doc, callback, view);
				const nodes    = doc.querySelectorAll(selector);

				for(let node of nodes)
				{
					console.log(node);
					wrapped(node);
				}
			}
		}
	}

	add(selector, callback)
	{
		this.rules = this.rules
			|| {};
		this.rules[selector] = this.rules[selector]
			|| [];

		this.rules[selector].push(callback);

		return this;
	}

	apply(doc = document, view = null)
	{
		RuleSet.apply(doc);

		for(let selector in this.rules)
		{
			for(let i in this.rules[selector])
			{
				const callback = this.rules[selector][i];
				const wrapped  = RuleSet.wrap(doc, callback, view);
				const nodes    = doc.querySelectorAll(selector);

				for(let node of nodes)
				{
					console.log(node);
					wrapped(node);
				}
			}
		}
	}

	static wait(event = 'DOMContentLoaded', node = document)
	{
		let listener = ((event, node) => () => {
			node.removeEventListener(event, listener);
			return this.apply();
		})(event, node);

		node.addEventListener(event, listener);
	}

	static wrap(doc, callback, view = null)
	{
		if(callback instanceof View
			|| (callback
				&& callback.prototype
				&& callback.prototype instanceof View
			)
		){
			callback = ((callback)=>()=>callback)(callback);
		}

		return (element) => {
			if(!element.___cvApplied___)
			{
				Object.defineProperty(
					element
					, '___cvApplied___'
					, {
						enumerable: false,
						writable: true
					}
				);

				element.___cvApplied___ = [];
			}

			for(let i in element.___cvApplied___)
			{
				if(callback == element.___cvApplied___[i])
				{
					return;
				}
			}

			element.___cvApplied___.push(callback);

			const tag     = new Tag(element);
			const parent  = tag.element.parentNode;
			const sibling = tag.element.nextSibling;

			let result    = callback(tag);

			if(result instanceof HTMLElement)
			{
				result = new Tag(result);
			}

			if(result instanceof Tag)
			{
				if(!result.element.contains(tag.element))
				{
					while(tag.element.firstChild)
					{
						result.element.appendChild(tag.element.firstChild);
					}

					tag.remove();
				}

				if(sibling)
				{
					parent.insertBefore(result.element, sibling);
				}
				else
				{
					parent.appendChild(result.element);
				}
			}

			if(result
				&& result.prototype
				&& (result.prototype instanceof View)
			){
				result = new result();
			}

			if(result instanceof View)
			{
				if(view)
				{
					view.cleanup.push(((r)=>()=>{
						r.remove();
					})(result));
				}

				tag.clear();
				result.render(tag.element);
			}
		};
	}
}
