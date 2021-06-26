import { Dom  } from './Dom';
import { Tag  } from './Tag';
import { View } from './View';

export class RuleSet
{
	static add(selector, callback)
	{
		this.globalRules = this.globalRules || {};
		this.globalRules[selector] = this.globalRules[selector] || [];
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
					wrapped(node);
				}
			}
		}
	}

	add(selector, callback)
	{
		this.rules = this.rules || {};
		this.rules[selector] = this.rules[selector] || [];

		this.rules[selector].push(callback);

		return this;
	}

	apply(doc = document, view = null)
	{
		RuleSet.apply(doc, view);

		for(let selector in this.rules)
		{
			for(let i in this.rules[selector])
			{
				const callback = this.rules[selector][i];
				const wrapped  = RuleSet.wrap(doc, callback, view);
				const nodes    = doc.querySelectorAll(selector);

				for(let node of nodes)
				{
					wrapped(node);
				}
			}
		}
	}

	purge()
	{
		if(!this.rules)
		{
			return;
		}

		for(const [k,v] of Object.entries(this.rules))
		{
			if(!this.rules[k])
			{
				continue;
			}

			for(const kk in this.rules[k])
			{
				delete this.rules[k][kk];
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

	static wrap(doc, originalCallback, view = null)
	{
		let callback = originalCallback;

		if(originalCallback instanceof View
			|| (originalCallback
				&& originalCallback.prototype
				&& originalCallback.prototype instanceof View
			)
		){
			callback = () => originalCallback;
		}

		return (element) => {
			if(typeof element.___cvApplied___ === 'undefined')
			{
				Object.defineProperty(
					element
					, '___cvApplied___'
					, {
						enumerable: false,
						writable: false,
						value: new WeakSet
					}
				);
			}

			if(element.___cvApplied___.has(originalCallback))
			{
				return;
			}

			let direct, parentView;

			if(view)
			{
				direct = parentView = view;

				if(view.viewList)
				{
					parentView = view.viewList.parent;
				}
			}

			const tag     = new Tag(element, parentView, null, undefined, direct);
			const parent  = tag.element.parentNode;
			const sibling = tag.element.nextSibling;

			let result    = callback(tag);

			if(result !== false)
			{
				element.___cvApplied___.add(originalCallback);
			}

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
				result = new result({}, view);
			}

			if(result instanceof View)
			{
				if(view)
				{
					view.cleanup.push(((r)=>()=>{
						r.remove();
					})(result));

					view.cleanup.push(
						view.args.bindTo((v, k,t)=>{
							t[k] = v;
							result.args[k] = v;
						})
					);
					view.cleanup.push(
						result.args.bindTo((v, k, t, d)=>{
							t[k] = v;
							view.args[k] = v;
						})
					);
				}

				tag.clear();
				result.render(tag.element);
			}
		};
	}
}
