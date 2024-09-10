import { Bindable } from './Bindable';
import { ViewList } from './ViewList';
import { Router   } from './Router';
import { Uuid     } from './Uuid';
import { Dom      } from './Dom';
import { Tag      } from './Tag';
import { Bag      } from './Bag';
import { RuleSet  } from './RuleSet';
import { Mixin    } from './Mixin';

import { EventTargetMixin } from '../mixin/EventTargetMixin';

const dontParse  = Symbol('dontParse');
const expandBind = Symbol('expandBind');
const uuid       = Symbol('uuid');

export class View extends Mixin.with(EventTargetMixin)
{
	get _id()
	{
		return this[uuid];
	}

	static from(template, args = {}, mainView = null)
	{
		const view = new this(args, mainView);

		view.template = template;

		return view;
	}

	constructor(args = {}, mainView = null)
	{
		super(args, mainView);

		this[EventTargetMixin.Parent] = mainView;

		Object.defineProperty(this, 'args', { value: Bindable.make(args) });
		Object.defineProperty(this, uuid,   { value: this.constructor.uuid() });

		Object.defineProperty(this, 'nodesAttached',  { value: new Bag((i,s,a) => {}) });
		Object.defineProperty(this, 'nodesDetached',  { value: new Bag((i,s,a) => {}) });

		Object.defineProperty(this, '_onRemove', { value: new Bag((i,s,a) => {}) });
		Object.defineProperty(this, 'cleanup',   { value: [] });

		Object.defineProperty(this, 'parent',    { value: mainView, writable: true });

		Object.defineProperty(this, 'views',     { value: new Map });
		Object.defineProperty(this, 'viewLists', { value: new Map });
		Object.defineProperty(this, 'withViews', { value: new Map });

		Object.defineProperty(this, 'tags',      { value: Bindable.make({}) });
		Object.defineProperty(this, 'nodes',     { value: Bindable.make([]) });

		Object.defineProperty(this, 'timeouts',  { value: new Map });
		Object.defineProperty(this, 'intervals', { value: new Map });
		Object.defineProperty(this, 'frames',    { value: [] });

		Object.defineProperty(this, 'ruleSet',    { value: new RuleSet });
		Object.defineProperty(this, 'preRuleSet', { value: new RuleSet });

		Object.defineProperty(this, 'subBindings', { value: {} });
		Object.defineProperty(this, 'templates',   { value: {} });
		Object.defineProperty(this, 'postMapping', { value: new Set });

		Object.defineProperty(this, 'eventCleanup', { value: [] });

		Object.defineProperty(this, 'unpauseCallbacks', { value: new Map });

		Object.defineProperty(this, 'interpolateRegex', {
			value: /(\[\[((?:\$+)?[\w\.\|-]+)\]\])/g
		});

		Object.defineProperty(this, 'rendered', {
			value: new Promise((accept, reject) => Object.defineProperty(
				this
				, 'renderComplete'
				, {value: accept}
			))
		});

		this.onRemove(() => {
			if(!this[EventTargetMixin.Parent])
			{
				return;
			}
			this[EventTargetMixin.Parent] = null;
		});

		this.controller = this;

		this.template  = ``;

		this.firstNode = null;
		this.lastNode  = null;

		this.viewList  = null;
		this.mainView  = null;

		this.preserve  = false;
		this.removed   = false;

		this.loaded = Promise.resolve(this);

		// return Bindable.make(this);
	}

	static isView()
	{
		return View;
	}

	onFrame(callback)
	{
		let stopped = false;

		const cancel = () => {
			stopped = true;
		};

		let c = (timestamp) => {

			if(this.removed || stopped)
			{
				return;
			}

			if(!this.paused)
			{
				callback(Date.now());
			}

			requestAnimationFrame(c);
		};

		requestAnimationFrame(() => c(Date.now()));

		this.frames.push(cancel);

		return cancel;
	}

	onNextFrame(callback)
	{
		return requestAnimationFrame(() => callback(Date.now()));
	}

	onIdle(callback)
	{
		return requestIdleCallback(() => callback(Date.now()));
	}

	onTimeout(time, callback)
	{
		const timeoutInfo = {
			timeout:    null
			, callback: null
			, time:     time
			, fired:    false
			, created:  (new Date).getTime()
			, paused:   false
		};

		const wrappedCallback = () => {
			callback();
			timeoutInfo.fired = true;
			this.timeouts.delete(timeoutInfo.timeout);
		};

		const timeout = setTimeout(wrappedCallback, time);

		timeoutInfo.callback = wrappedCallback;
		timeoutInfo.timeout  = timeout;

		this.timeouts.set(timeoutInfo.timeout, timeoutInfo);

		return timeout;
	}

	clearTimeout(timeout)
	{
		if(!this.timeouts.has(timeout))
		{
			return;
		}

		const timeoutInfo = this.timeouts.get(timeout);

		clearTimeout(timeoutInfo.timeout);

		this.timeouts.delete(timeoutInfo.timeout);
	}

	onInterval(time, callback)
	{
		let timeout = setInterval(callback, time);

		this.intervals.set(timeout, {
			timeout:    timeout
			, callback: callback
			, time:     time
			, paused:   false
		});

		return timeout;
	}

	clearInterval(timeout)
	{
		if(!this.intervals.has(timeout))
		{
			return;
		}

		const timeoutInfo = this.intervals.get(timeout);

		clearTimeout(timeoutInfo.timeout);

		this.intervals.delete(timeoutInfo.timeout);
	}

	pause(paused = undefined)
	{
		if(paused === undefined)
		{
			this.paused = !this.paused;
		}

		this.paused = paused;

		if(this.paused)
		{
			for(const [callback, timeout] of this.timeouts)
			{
				if(timeout.fired)
				{
					this.timeouts.delete(timeout.timeout);
					continue;
				}

				clearTimeout(timeout.timeout);

				timeout.paused = true;
				timeout.time   = Math.max(0, timeout.time - (Date.now() - timeout.created));
			}

			for(const [callback, timeout] of this.intervals)
			{
				clearInterval(timeout.timeout);

				timeout.paused = true;
			}
		}
		else
		{
			for(const [callback, timeout] of this.timeouts)
			{
				if(!timeout.paused)
				{
					continue;
				}


				if(timeout.fired)
				{
					this.timeouts.delete(timeout.timeout);
					continue;
				}

				timeout.timeout = setTimeout(timeout.callback, timeout.time);
				timeout.paused  = false;
			}

			for(const [callback, timeout] of this.intervals)
			{
				if(!timeout.paused)
				{
					continue;
				}

				timeout.timeout = setInterval(timeout.callback, timeout.time);
				timeout.paused  = false;
			}

			for(const [, callback] of this.unpauseCallbacks)
			{
				callback();
			}

			this.unpauseCallbacks.clear();
		}

		for(const [tag, viewList] of this.viewLists)
		{
			viewList.pause(!!paused);
		}

		for(let i in this.tags)
		{
			if(Array.isArray(this.tags[i]))
			{
				for(var j in this.tags[i])
				{
					this.tags[i][j].pause(!!paused);
				}
				continue;
			}
			this.tags[i].pause(!!paused);
		}
	}

	render(parentNode = null, insertPoint = null, outerView = null)
	{
		const { document } = globalThis.window;

		if(parentNode instanceof View)
		{
			parentNode = parentNode.firstNode.parentNode;
		}

		if(insertPoint instanceof View)
		{
			insertPoint = insertPoint.firstNode;
		}

		if(this.firstNode)
		{
			return this.reRender(parentNode, insertPoint, outerView);
		}

		this.dispatchEvent(new CustomEvent('render'));

		const templateIsFragment = (typeof this.template === 'object' && typeof this.template.cloneNode === 'function');

		const templateParsed = templateIsFragment || View.templates.has(this.template);

		let subDoc;

		if(templateParsed)
		{
			if(templateIsFragment)
			{
				subDoc = this.template.cloneNode(true);
			}
			else
			{
				subDoc = View.templates.get(this.template).cloneNode(true);
			}
		}
		else
		{
			subDoc = document.createRange().createContextualFragment(this.template);
		}

		if(!templateParsed && !templateIsFragment)
		{
			View.templates.set(this.template, subDoc.cloneNode(true));
		}

		this.mainView || this.preRuleSet.apply(subDoc, this);

		this.mapTags(subDoc);

		this.mainView || this.ruleSet.apply(subDoc, this);

		if(globalThis.devMode === true)
		{
			this.firstNode = document.createComment(`Template ${this._id} Start`);
			this.lastNode = document.createComment(`Template ${this._id} End`);
		}
		else
		{
			this.firstNode = document.createTextNode('');
			this.lastNode = document.createTextNode('');
		}

		this.nodes.push(
			this.firstNode
			, ...Array.from(subDoc.childNodes)
			, this.lastNode
		);

		this.postRender(parentNode);

		this.dispatchEvent(new CustomEvent('rendered'));

		if(!this.dispatchAttach())
		{
			return;
		}

		if(parentNode)
		{
			if(insertPoint)
			{
				parentNode.insertBefore(this.firstNode, insertPoint);
				parentNode.insertBefore(this.lastNode, insertPoint);
			}
			else
			{
				parentNode.appendChild(this.firstNode);
				parentNode.appendChild(this.lastNode);
			}

			parentNode.insertBefore(subDoc, this.lastNode);

			const rootNode = parentNode.getRootNode();

			if(rootNode.isConnected)
			{
				this.attached(rootNode, parentNode);
				this.dispatchAttached(rootNode, parentNode, outerView);
			}
			else if(outerView)
			{
				const firstDomAttach = event => {
					const rootNode = parentNode.getRootNode();

					this.attached(rootNode, parentNode);
					this.dispatchAttached(rootNode, parentNode, outerView);

					outerView.removeEventListener('attached', firstDomAttach);
				};

				outerView.addEventListener('attached', firstDomAttach);
			}
		}

		this.renderComplete(this.nodes);

		return this.nodes;
	}

	dispatchAttach()
	{
		const { CustomEvent } = globalThis.window;

		return this.dispatchEvent(new CustomEvent('attach', {
			cancelable: true, target: this
		}));
	}

	dispatchAttached(rootNode, parentNode, view = undefined)
	{
		const { CustomEvent } = globalThis.window;

		this.dispatchEvent(new CustomEvent('attached', {detail: {
			view: view || this, node: parentNode, root: rootNode, mainView: this
		}}));

		this.dispatchDomAttached(view);

		for(const callback of this.nodesAttached.items())
		{
			callback(rootNode, parentNode);
		}
	}

	dispatchDomAttached(view)
	{
		const { Node , CustomEvent } = globalThis.window;

		this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).forEach(child => {
			if(!child.matches)
			{
				return;
			}

			child.dispatchEvent(new CustomEvent('cvDomAttached', {
				target: child
				, detail: { view: view || this, mainView: this }
			}));

			Dom.mapTags(child, false, (tag, walker) => {

				if(!tag.matches)
				{
					return;
				}

				tag.dispatchEvent(new CustomEvent('cvDomAttached', {
					target: tag
					, detail: { view: view || this, mainView: this }
				}));
			});
		});
	}

	reRender(parentNode, insertPoint, outerView)
	{
		const { CustomEvent } = globalThis.window;

		const willReRender = this.dispatchEvent(new CustomEvent('reRender'), {
			cancelable:true, target:this, view: outerView
		});

		if(!willReRender)
		{
			return;
		}

		const subDoc = new DocumentFragment;

		if(this.firstNode.isConnected)
		{
			const detach = this.nodesDetached.items();

			for(let i in detach)
			{
				detach[i]();
			}
		}

		subDoc.append(...this.nodes);

		if(parentNode)
		{
			if(insertPoint)
			{
				parentNode.insertBefore(this.firstNode, insertPoint);
				parentNode.insertBefore(this.lastNode, insertPoint);
			}
			else
			{
				parentNode.appendChild(this.firstNode);
				parentNode.appendChild(this.lastNode);
			}

			parentNode.insertBefore(subDoc, this.lastNode);


			this.dispatchEvent(new CustomEvent('reRendered'), {
				cancelable:true, target:this, view: outerView
			});

			const rootNode = parentNode.getRootNode();

			if(rootNode.isConnected)
			{
				this.attached(rootNode, parentNode);
				this.dispatchAttached(rootNode, parentNode);
			}
		}

		return this.nodes;
	}

	mapTags(subDoc)
	{
		Dom.mapTags(subDoc, false, (tag, walker)=>{

			if(tag[dontParse])
			{
				return;
			}

			if(tag.matches)
			{
				tag = this.mapInterpolatableTag(tag);

				tag = tag.matches('[cv-template]')
					&& this.mapTemplateTag(tag)
					|| tag;

				tag = tag.matches('[cv-slot]')
					&& this.mapSlotTag(tag)
					|| tag;

				tag = tag.matches('[cv-prerender]')
					&& this.mapPrendererTag(tag)
					|| tag;

				tag = tag.matches('[cv-link]')
					&& this.mapLinkTag(tag)
					|| tag;

				tag = tag.matches('[cv-attr]')
					&& this.mapAttrTag(tag)
					|| tag;

				tag = tag.matches('[cv-expand]')
					&& this.mapExpandableTag(tag)
					|| tag;

				tag = tag.matches('[cv-ref]')
					&& this.mapRefTag(tag)
					|| tag;

				tag = tag.matches('[cv-on]')
					&& this.mapOnTag(tag)
					|| tag;

				tag = tag.matches('[cv-each]')
					&& this.mapEachTag(tag)
					|| tag;

				tag = tag.matches('[cv-bind]')
					&& this.mapBindTag(tag)
					|| tag;

				tag = tag.matches('[cv-with]')
					&& this.mapWithTag(tag)
					|| tag;

				tag = tag.matches('[cv-if]')
					&& this.mapIfTag(tag)
					|| tag;

				tag = tag.matches('[cv-view]')
					&& this.mapViewTag(tag)
					|| tag;
			}
			else
			{
				tag = this.mapInterpolatableTag(tag);
			}

			if(tag !== walker.currentNode)
			{
				walker.currentNode = tag;
			}
		});

		this.postMapping.forEach(c => c());
	}

	mapExpandableTag(tag)
	{
		// const tagCompiler = this.compileExpandableTag(tag);
		// const newTag = tagCompiler(this);
		// tag.replaceWith(newTag);
		// return newTag;

		let existing = tag[expandBind];

		if(existing)
		{
			existing();

			tag[expandBind] = false;
		}

		const [proxy, expandProperty] = Bindable.resolve(
			this.args
			, tag.getAttribute('cv-expand')
			, true
		);

		tag.removeAttribute('cv-expand');

		if(!proxy[expandProperty])
		{
			proxy[expandProperty] = {};
		}

		proxy[expandProperty] = Bindable.make(proxy[expandProperty]);

		this.onRemove(tag[expandBind] = proxy[expandProperty].bindTo(
			(v,k,t,d,p) => {

				if(d || v === undefined)
				{
					tag.removeAttribute(k, v);
					return;
				}

				if(v === null)
				{
					tag.setAttribute(k, '');
					return;
				}

				tag.setAttribute(k, v);

			}
		));

		// let expandProperty = tag.getAttribute('cv-expand');
		// let expandArg = Bindable.makeBindable(
		// 	this.args[expandProperty] || {}
		// );

		// tag.removeAttribute('cv-expand');

		// for(let i in expandArg)
		// {
		// 	if(i === 'name' || i === 'type')
		// 	{
		// 		continue;
		// 	}

		// 	let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
		// 		tag.setAttribute(i, v);
		// 	})(tag,i));

		// 	this.onRemove(()=>{
		// 		debind();
		// 		if(expandArg.isBound())
		// 		{
		// 			Bindable.clearBindings(expandArg);
		// 		}
		// 	});
		// }

		return tag;
	}

	// compileExpandableTag(sourceTag)
	// {
	// 	return (bindingView) => {

	// 		const tag = sourceTag.cloneNode(true);

	// 		let expandProperty = tag.getAttribute('cv-expand');
	// 		let expandArg = Bindable.make(
	// 			bindingView.args[expandProperty] || {}
	// 		);

	// 		tag.removeAttribute('cv-expand');

	// 		for(let i in expandArg)
	// 		{
	// 			if(i === 'name' || i === 'type')
	// 			{
	// 				continue;
	// 			}

	// 			let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
	// 				tag.setAttribute(i, v);
	// 			})(tag,i));

	// 			bindingView.onRemove(()=>{
	// 				debind();
	// 				if(expandArg.isBound())
	// 				{
	// 					Bindable.clearBindings(expandArg);
	// 				}
	// 			});
	// 		}

	// 		return tag;
	// 	};
	// }

	mapAttrTag(tag)
	{
		const tagCompiler = this.compileAttrTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;

		// let attrProperty = tag.getAttribute('cv-attr');

		// tag.removeAttribute('cv-attr');

		// let pairs = attrProperty.split(',');
		// let attrs = pairs.map((p) => p.split(':'));

		// for (let i in attrs)
		// {
		// 	let proxy        = this.args;
		// 	let bindProperty = attrs[i][1];
		// 	let property     = bindProperty;

		// 	if(bindProperty.match(/\./))
		// 	{
		// 		[proxy, property] = Bindable.resolve(
		// 			this.args
		// 			, bindProperty
		// 			, true
		// 		);
		// 	}

		// 	let attrib = attrs[i][0];

		// 	this.onRemove(proxy.bindTo(
		// 		property
		// 		, (v)=>{
		// 			if(v == null)
		// 			{
		// 				tag.setAttribute(attrib, '');
		// 				return;
		// 			}
		// 			tag.setAttribute(attrib, v);
		// 		}
		// 	));
		// }

		// return tag;
	}

	compileAttrTag(sourceTag)
	{
		const attrProperty = sourceTag.getAttribute('cv-attr');

		const pairs = attrProperty.split(/[,;]/);
		const attrs = pairs.map((p) => p.split(':'));

		sourceTag.removeAttribute('cv-attr');

		return (bindingView) => {

			const tag = sourceTag.cloneNode(true);

			for (let i in attrs)
			{
				const bindProperty = attrs[i][1] || attrs[i][0];

				const [proxy, property] = Bindable.resolve(
					bindingView.args
					, bindProperty
					, true
				);

				const attrib = attrs[i][0];

				bindingView.onRemove(proxy.bindTo( property , (v,k,t,d) => {

					if(d || v === undefined)
					{
						tag.removeAttribute(attrib, v);
						return;
					}

					if(v === null)
					{
						tag.setAttribute(attrib, '');
						return;
					}

					tag.setAttribute(attrib, v);

				}));
			}

			return tag;
		};
	}

	mapInterpolatableTag(tag)
	{
		let regex = this.interpolateRegex;

		const { Node, document} = globalThis.window;

		if(tag.nodeType === Node.TEXT_NODE)
		{
			let original = tag.nodeValue;

			if(!this.interpolatable(original))
			{
				return tag;
			}

			let header = 0;
			let match;

			while(match = regex.exec(original))
			{
				let bindProperty = match[2];

				let unsafeHtml = false;
				let unsafeView = false;

				const propertySplit = bindProperty.split('|');
				let transformer = false;

				if(propertySplit.length > 1)
				{
					transformer = this.stringTransformer(propertySplit.slice(1));

					bindProperty = propertySplit[0];
				}

				if(bindProperty.substr(0, 2) === '$$')
				{
					unsafeHtml   = true;
					unsafeView   = true;
					bindProperty = bindProperty.substr(2);
				}

				if(bindProperty.substr(0, 1) === '$')
				{
					unsafeHtml   = true;
					bindProperty = bindProperty.substr(1);
				}

				if(bindProperty.substr(0, 3) === '000')
				{
					expand       = true;
					bindProperty = bindProperty.substr(3);

					continue;
				}

				let staticPrefix = original.substring(header, match.index);

				header = match.index + match[1].length;

				let staticNode = document.createTextNode(staticPrefix);

				staticNode[dontParse] = true;

				tag.parentNode.insertBefore(staticNode, tag);

				let dynamicNode;

				if(unsafeHtml)
				{
					dynamicNode = document.createElement('div');
				}
				else
				{
					dynamicNode = document.createTextNode('');
				}

				dynamicNode[dontParse] = true;

				let proxy    = this.args;
				let property = bindProperty;

				if(bindProperty.match(/\./))
				{
					[proxy, property] = Bindable.resolve(
						this.args
						, bindProperty
						, true
					);
				}

				tag.parentNode.insertBefore(dynamicNode, tag);

				if(typeof proxy !== 'object')
				{
					break;
				}

				proxy = Bindable.make(proxy);

				let debind = proxy.bindTo(property, (v,k,t) => {
					if(t[k] !== v && (t[k] instanceof View || t[k] instanceof Node || t[k] instanceof Tag))
					{
						if(!t[k].preserve)
						{
							t[k].remove();
						}
					}

					dynamicNode.nodeValue = '';

					if(unsafeView && !(v instanceof View))
					{
						const unsafeTemplate = v ?? '';

						v = new View(this.args, this);

						v.template = unsafeTemplate;
					}

					if(transformer)
					{
						v = transformer(v);
					}

					if(v instanceof View)
					{
						v[EventTargetMixin.Parent] = this;

						v.render(tag.parentNode, dynamicNode, this);

						const cleanup = () => {
							if(!v.preserve)
							{
								v.remove();
							}
						};

						this.onRemove(cleanup);

						v.onRemove(() => this._onRemove.remove(cleanup));
					}
					else if(v instanceof Node)
					{
						tag.parentNode.insertBefore(v, dynamicNode);

						this.onRemove(() => v.remove());
					}
					else if(v instanceof Tag)
					{
						if(v.node)
						{
							tag.parentNode.insertBefore(v.node, dynamicNode);
							this.onRemove(() => v.remove());
						}
						else
						{
							v.remove();
						}
					}
					else
					{
						if(v instanceof Object && v.__toString instanceof Function)
						{
							v = v.__toString();
						}

						if(unsafeHtml)
						{
							dynamicNode.innerHTML = v;
						}
						else
						{
							dynamicNode.nodeValue = v;
						}
					}

					dynamicNode[dontParse] = true;
				});

				this.onRemove(debind);
			}

			let staticSuffix = original.substring(header);

			let staticNode = document.createTextNode(staticSuffix);

			staticNode[dontParse] = true;

			tag.parentNode.insertBefore(staticNode, tag);

			tag.nodeValue = '';
		}
		else if(tag.nodeType === Node.ELEMENT_NODE)
		{
			for (let i = 0; i < tag.attributes.length; i++)
			{
				if(!this.interpolatable(tag.attributes[i].value))
				{
					continue;
				}

				let header    = 0;
				let match;
				let original  = tag.attributes[i].value;
				let attribute = tag.attributes[i];

				let bindProperties = {};
				let segments       = [];

				while(match = regex.exec(original))
				{
					segments.push(original.substring(header, match.index));

					if(!bindProperties[match[2]])
					{
						bindProperties[match[2]] = [];
					}

					bindProperties[match[2]].push(segments.length);

					segments.push(match[1]);

					header = match.index + match[1].length;
				}

				segments.push(original.substring(header));

				for(let j in bindProperties)
				{
					let proxy    = this.args;
					let property = j;

					const propertySplit = j.split('|');
					let transformer = false;

					let longProperty = j;

					if(propertySplit.length > 1)
					{
						transformer = this.stringTransformer(propertySplit.slice(1));

						property = propertySplit[0];
					}

					if(property.match(/\./))
					{
						[proxy, property] = Bindable.resolve(
							this.args
							, property
							, true
						);
					}

					const matching = [];
					const bindProperty = j;

					const matchingSegments = bindProperties[longProperty];

					// const changeAttribute = (v, k, t, d) => {
					// 	tag.setAttribute(attribute.name, segments.join(''));
					// };

					this.onRemove(proxy.bindTo(property, (v,k,t,d) => {

						if(transformer)
						{
							v = transformer(v);
						}

						for(let i in bindProperties)
						{
							for(let j in bindProperties[longProperty])
							{
								segments[ bindProperties[longProperty][j] ] = t[i];

								if(k === property)
								{
									segments[ bindProperties[longProperty][j] ] = v;
								}
							}
						}

						if(!this.paused)
						{
							// changeAttribute(v,k,t,d);
							tag.setAttribute(attribute.name, segments.join(''))
						}
						else
						{
							// this.unpauseCallbacks.set(attribute, () => changeAttribute(v,k,t,d));
							this.unpauseCallbacks.set(attribute, () => tag.setAttribute(attribute.name, segments.join('')));
						}
					}));

					// this.onRemove(()=>{
					// 	if(!proxy.isBound())
					// 	{
					// 		Bindable.clearBindings(proxy);
					// 	}
					// });
				}
			}
		}

		return tag;
	}

	mapRefTag(tag)
	{
		let refAttr = tag.getAttribute('cv-ref');
		let [refProp, refClassname = null, refKey = null] = refAttr.split(':');

		let refClass = Tag;

		if(refClassname)
		{
			refClass = this.stringToClass(refClassname);
		}

		tag.removeAttribute('cv-ref');

		Object.defineProperty(tag, '___tag___', {
            enumerable: false,
            writable: true
        });

        this.onRemove(()=>{
        	tag.___tag___ = null;
			tag.remove()
		});

		let parent = this;
		let direct = this;

		if(this.viewList)
		{
			parent = this.viewList.parent;
			// if(!this.viewList.parent.tags[refProp])
			// {
			// 	this.viewList.parent.tags[refProp] = [];
			// }

			// let refKeyVal = this.args[refKey];

			// this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
			// 	tag, this, refProp, refKeyVal
			// );
		}
		// else
		// {
		// 	this.tags[refProp] = new refClass(
		// 		tag, this, refProp
		// 	);
		// }

		let tagObject = new refClass(
			tag, this, refProp, undefined, direct
		);

		tag.___tag___ = tagObject;

		this.tags[refProp] = tagObject;

		while(parent)
		{
			let refKeyVal = this.args[refKey];

			if(refKeyVal !== undefined)
			{
				if(!parent.tags[refProp])
				{
					parent.tags[refProp] = [];
				}

				parent.tags[refProp][refKeyVal] = tagObject;
			}
			else
			{
				parent.tags[refProp] = tagObject;
			}

			if(!parent.parent)
			{
				break;
			}

			parent = parent.parent;
		}

		return tag;
	}

	mapBindTag(tag)
	{
		let bindArg  = tag.getAttribute('cv-bind');
		let proxy    = this.args;
		let property = bindArg;
		let top      = null;

		if(bindArg.match(/\./))
		{
			[proxy, property, top] = Bindable.resolve(
				this.args
				, bindArg
				, true
			);
		}

		if(proxy !== this.args)
		{
			this.subBindings[bindArg] = this.subBindings[bindArg] || [];

			this.onRemove(this.args.bindTo(top, ()=>{
				while(this.subBindings.length)
				{
					this.subBindings.shift()();
				}
			}));
		}

		let unsafeHtml = false;

		if(property.substr(0, 1) === '$')
		{
			property = property.substr(1);
			unsafeHtml = true;
		}

		let autoEventStarted = false;

		let debind = proxy.bindTo(property, (v,k,t,d,p) => {
			if((p instanceof View || p instanceof Node || p instanceof Tag) && p !== v)
			{
				p.remove();
			}

			if(['INPUT', 'SELECT', 'TEXTAREA'].includes(tag.tagName))
			{
				const type = tag.getAttribute('type');

				if(type && type.toLowerCase() === 'checkbox')
				{
					tag.checked = !!v;
				}
				else if(type && type.toLowerCase() === 'radio')
				{
					tag.checked = (v == tag.value);
				}
				else if(type !== 'file')
				{
					if(tag.tagName === 'SELECT')
					{
						const selectOption = () => {
							for(let i = 0; i < tag.options.length; i++)
							{
								const option = tag.options[i];

								if(option.value == v)
								{
									tag.selectedIndex = i;
								}
							}
						};

						selectOption();

						this.nodesAttached.add(selectOption);
					}
					else
					{
						tag.value = v == null ? '' : v;
					}
				}

				if(autoEventStarted)
				{
					tag.dispatchEvent(new CustomEvent('cvAutoChanged', {bubbles: true}));
				}

				autoEventStarted = true;
			}
			else
			{
				if(v instanceof View)
				{
					for(const node of tag.childNodes)
					{
						node.remove();
					}

					v[EventTargetMixin.Parent] = this;

					v.render(tag, null, this);
				}
				else if(v instanceof Node)
				{
					tag.insert(v);
				}
				else if(v instanceof Tag)
				{
					tag.append(v.node);
				}
				else if(unsafeHtml)
				{
					if(tag.innerHTML !== v)
					{
						v = String(v);

						if(tag.innerHTML === v.substring(0, tag.innerHTML.length))
						{
							tag.innerHTML += v.substring(tag.innerHTML.length);
						}
						else
						{
							for(const node of tag.childNodes)
							{
								node.remove();
							}

							tag.innerHTML = v;
						}

						Dom.mapTags(tag, false, t => t[dontParse] = true);
					}
				}
				else
				{
					if(tag.textContent !== v)
					{
						for(const node of tag.childNodes)
						{
							node.remove();
						}

						tag.textContent = v;
					}
				}
			}
		});

		if(proxy !== this.args)
		{
			this.subBindings[bindArg].push(debind);
		}

		this.onRemove(debind);

		const type  = tag.getAttribute('type');
		const multi = tag.getAttribute('multiple');

		let inputListener = (event) => {
			if(event.target !== tag)
			{
				return;
			}

			if(type && type.toLowerCase() === 'checkbox')
			{
				if (tag.checked) {
					proxy[property] = event.target.getAttribute('value');
				}
				else {
					proxy[property] = false;
				}
			}
			else if(event.target.matches('[contenteditable=true]'))
			{
				proxy[property] = event.target.innerHTML;
			}
			else if(type === 'file' && multi)
			{
				const files   = Array.from(event.target.files);
				const current = proxy[property] || Bindable.onDeck(proxy, property);

				if(!current || !files.length)
				{
					proxy[property] = files;
				}
				else
				{
					for(const i in files)
					{
						if(files[i] !== current[i])
						{
							files[i].toJSON = () => {
								return {
									name: file[i].name
									, size: file[i].size
									, type: file[i].type
									, date: file[i].lastModified
								};
							}

							current[i] = files[i];

							break;
						}
					}
				}

			}
			else if(type === 'file' && !multi && event.target.files.length)
			{
				const file = event.target.files.item(0);

				file.toJSON = () => {
					return {
						name: file.name
						, size: file.size
						, type: file.type
						, date: file.lastModified
					};
				};

				proxy[property] = file;
			}
			else
			{
				proxy[property] = event.target.value;
			}
		};

		if(type === 'file' || type === 'radio')
		{
			tag.addEventListener('change', inputListener);
		}
		else
		{
			tag.addEventListener('input',         inputListener);
			tag.addEventListener('change',        inputListener);
			tag.addEventListener('value-changed', inputListener);
		}

		this.onRemove(()=>{
			if(type === 'file' || type === 'radio')
			{
				tag.removeEventListener('change', inputListener);
			}
			else
			{
				tag.removeEventListener('input',         inputListener);
				tag.removeEventListener('change',        inputListener);
				tag.removeEventListener('value-changed', inputListener);
			}
		});

		tag.removeAttribute('cv-bind');

		return tag;
	}

	mapOnTag(tag)
	{
		const referents = String(tag.getAttribute('cv-on'));

		referents.split(';').map(a=> a.split(':')).forEach((a)=>{

			a = a.map(a => a.trim());
			const argLen = a.length;

			let eventName    = String(a.shift()).trim();

			let callbackName = String(a.shift() || eventName).trim();
			let eventFlags   = String(a.shift() || '').trim();

			let argList      = [];
			let groups = /(\w+)(?:\(([$\w\s-'",]+)\))?/.exec(callbackName);

			if(groups)
			{
				callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');

				if(groups[2])
				{
					argList = groups[2].split(',').map(s => s.trim());
				}
			}

			if(!argList.length)
			{
				argList.push('$event');
			}

			if(!eventName || argLen === 1)
			{
				eventName = callbackName;
			}

			const eventListener = ((event) => {
				let eventMethod;
				let parent = this;

				while(parent)
				{
					const controller = parent.controller;

					if(typeof controller[callbackName] === 'function')
					{
						eventMethod = (...args) => {
							controller[callbackName](...args);
						};
						break;
					}
					else if(typeof parent[callbackName] === 'function')
					{
						eventMethod = (...args) => {
							parent[callbackName](...args);
						};
						break;
					}

					if(parent.parent)
					{
						parent = parent.parent;
					}
					else
					{
						break;
					}
				}
				const argRefs = argList.map((arg) => {
					let match;
					if(Number(arg) == arg)
					{
						return arg;
					}
					else if(arg === 'event' || arg === '$event')
					{
						return event;
					}
					else if(arg === '$view')
					{
						return parent;
					}
					else if(arg === '$controller')
					{
						return controller;
					}
					else if(arg === '$tag')
					{
						return tag;
					}
					else if(arg === '$parent')
					{
						return this.parent;
					}
					else if(arg === '$subview')
					{
						return this;
					}
					else if(arg in this.args)
					{
						return this.args[arg];
					}
					else if(match = /^['"]([\w-]+?)["']$/.exec(arg))
					{
						return match[1];
					}
				});

				if(!(typeof eventMethod === 'function'))
				{
					throw new Error(
						`${callbackName} is not defined on View object.`
						+ "\n" + `Tag:`
						+ "\n" + `${tag.outerHTML}`
					);
				}

				eventMethod(...argRefs);
			});

			let eventOptions = {};

			if(eventFlags.includes('p'))
			{
				eventOptions.passive = true;
			}
			else if(eventFlags.includes('P'))
			{
				eventOptions.passive = false;
			}

			if(eventFlags.includes('c'))
			{
				eventOptions.capture = true;
			}
			else if(eventFlags.includes('C'))
			{
				eventOptions.capture = false;
			}

			if(eventFlags.includes('o'))
			{
				eventOptions.once = true;
			}
			else if(eventFlags.includes('O'))
			{
				eventOptions.once = false;
			}

			switch(eventName)
			{
				case '_init':
					eventListener();
					break;

				case '_attach':
					this.nodesAttached.add(eventListener);
					break;

				case '_detach':
					this.nodesDetached.add(eventListener);
					break;

				default:
					tag.addEventListener(eventName, eventListener, eventOptions);

					this.onRemove(()=>{
						tag.removeEventListener(eventName, eventListener, eventOptions);
					});
					break;
			}

			return [eventName, callbackName, argList];
		});

		tag.removeAttribute('cv-on');

		return tag;
	}

	mapLinkTag(tag)
	{
		// const tagCompiler = this.compileLinkTag(tag);

		// const newTag = tagCompiler(this);

		// tag.replaceWith(newTag);

		// return newTag;

		let linkAttr = tag.getAttribute('cv-link');

		tag.setAttribute('href', linkAttr);

		let linkClick = (event) => {

			event.preventDefault();

			if(linkAttr.substring(0, 4) === 'http' || linkAttr.substring(0, 2) === '//')
			{
				globalThis.open(tag.getAttribute('href', linkAttr));
				return;
			}

			Router.go(tag.getAttribute('href'));
		};

		tag.addEventListener('click', linkClick);

		this.onRemove( ((tag, eventListener) => ()=>{
			tag.removeEventListener('click', eventListener);
			tag           = undefined;
			eventListener = undefined;
		})(tag, linkClick));

		tag.removeAttribute('cv-link');

		return tag;
	}

	// compileLinkTag(sourceTag)
	// {
	// 	const linkAttr = sourceTag.getAttribute('cv-link');
	// 	sourceTag.removeAttribute('cv-link');
	// 	return (bindingView) => {
	// 		const tag = sourceTag.cloneNode(true);
	// 		tag.setAttribute('href', linkAttr);
	// 		return tag;
	// 	};
	// }

	mapPrendererTag(tag)
	{
		let prerenderAttr = tag.getAttribute('cv-prerender');
		let prerendering  = globalThis.prerenderer || navigator.userAgent.match(/prerender/i);

		tag.removeAttribute('cv-prerender');

		if(prerendering)
		{
			globalThis.prerenderer = globalThis.prerenderer || true;
		}

		if(prerenderAttr === 'never' && prerendering
			|| prerenderAttr === 'only' && !prerendering
		){
			this.postMapping.add(() => tag.parentNode.removeChild(tag));
		}

		return tag;
	}

	mapWithTag(tag)
	{
		let withAttr  = tag.getAttribute('cv-with');
		let carryAttr = tag.getAttribute('cv-carry');
		let viewAttr  = tag.getAttribute('cv-view');

		tag.removeAttribute('cv-with');
		tag.removeAttribute('cv-carry');
		tag.removeAttribute('cv-view');

		const viewClass = viewAttr
			? this.stringToClass(viewAttr)
			: View;

		let subTemplate = new DocumentFragment;

		[...tag.childNodes].forEach(n => subTemplate.appendChild(n));

		let carryProps = [];

		if(carryAttr)
		{
			carryProps = carryAttr.split(',').map(s=>s.trim());
		}

		let debind = this.args.bindTo(withAttr, (v,k,t,d) => {
			if(this.withViews.has(tag))
			{
				this.withViews.delete(tag);
			}

			while(tag.firstChild)
			{
				tag.removeChild(tag.firstChild);
			}

			let view = new viewClass({}, this);

			this.onRemove(((view)=>()=>{
				view.remove();
			})(view));

			view.template = subTemplate;

			for(let i in carryProps)
			{
				let debind = this.args.bindTo(carryProps[i], (v, k) => {
					view.args[k] = v;
				});

				view.onRemove(debind);

				this.onRemove(()=>{
					debind();
					view.remove();
				});
			}

			for(let i in v)
			{
				if(typeof v !== 'object')
				{
					continue;
				}

				v = Bindable.make(v);

				let debind = v.bindTo(i, (vv, kk, tt, dd) => {
					if(!dd)
					{
						view.args[kk] = vv;
					}
					else if(kk in view.args)
					{
						delete view.args[kk];
					}
				});

				let debindUp = view.args.bindTo(i, (vv, kk, tt, dd) => {
					if(!dd)
					{
						v[kk] = vv;
					}
					else if(kk in v)
					{
						delete v[kk];
					}
				});

				this.onRemove(()=>{
					debind();
					if(!v.isBound())
					{
						Bindable.clearBindings(v);
					}
					view.remove();
				});

				view.onRemove(()=>{
					debind();
					if(!v.isBound())
					{
						Bindable.clearBindings(v);
					}
				});
			}

			view.render(tag, null, this);

			this.withViews.set(tag, view);
		});

		this.onRemove(()=>{
			this.withViews.delete(tag);
			debind();
		});

		return tag;
	}

	mapViewTag(tag)
	{
		const viewAttr = tag.getAttribute('cv-view');

		tag.removeAttribute('cv-view');

		let subTemplate = new DocumentFragment;

		[...tag.childNodes].forEach(n => subTemplate.appendChild(n));

		const parts = viewAttr.split(':');

		const viewName  = parts.shift();
		const viewClass = parts.length
			? this.stringToClass(parts[0])
			: View;

		let view = new viewClass(this.args, this);

		this.views.set(tag, view);
		this.views.set(viewName, view);

		this.onRemove(() => {
			view.remove();
			this.views.delete(tag);
			this.views.delete(viewName);
		});

		view.template = subTemplate;

		view.render(tag, null, this);

		return tag;
	}

	mapEachTag(tag)
	{
		const eachAttr = tag.getAttribute('cv-each');
		const viewAttr = tag.getAttribute('cv-view');

		tag.removeAttribute('cv-each');
		tag.removeAttribute('cv-view');

		const viewClass = viewAttr
			? this.stringToClass(viewAttr)
			: View;

		const subTemplate = new DocumentFragment();

		[...tag.childNodes].forEach(n => subTemplate.appendChild(n));

		const [eachProp, asProp, keyProp] = eachAttr.split(':');

		let proxy    = this.args;
		let property = eachProp;

		if(eachProp.match(/\./))
		{
			[proxy, property] = Bindable.resolve(
				this.args
				, eachProp
				, true
			);
		}

		const debind = proxy.bindTo(property, (v,k,t,d,p) => {

			if(v instanceof Bag)
			{
				v = v.list;
			}

			if(this.viewLists.has(tag))
			{
				this.viewLists.get(tag).remove();
			}

			const viewList = new ViewList(subTemplate, asProp, v, this, keyProp, viewClass);
			const viewListRemover = () => viewList.remove();

			this.onRemove(viewListRemover);

			viewList.onRemove(()=>this._onRemove.remove(viewListRemover));

			const debindA = this.args.bindTo((v,k,t,d)=>{
				if(k === '_id')
				{
					return;
				}

				if(!d)
				{
					viewList.subArgs[k] = v;
				}
				else
				{
					if(k in viewList.subArgs)
					{
						delete viewList.subArgs[k];
					}
				}
			});

			const debindB = viewList.args.bindTo((v,k,t,d,p)=>{
				if(k === '_id' || k === 'value' || String(k).substring(0,3) === '___')
				{
					return;
				}

				if(!d)
				{
					if(k in this.args)
					{
						this.args[k] = v;
					}
				}
				else
				{
					delete this.args[k];
				}
			});

			viewList.onRemove(debindA);
			viewList.onRemove(debindB);

			this.onRemove(debindA);
			this.onRemove(debindB);

			while(tag.firstChild)
			{
				tag.removeChild(tag.firstChild);
			}

			this.viewLists.set(tag, viewList);

			viewList.render(tag, null, this);

			if(tag.tagName === 'SELECT')
			{
				viewList.reRender();
			}
		});

		this.onRemove(debind);

		return tag;
	}

	mapIfTag(tag)
	{
		const sourceTag  = tag;
		let viewProperty = sourceTag.getAttribute('cv-view');
		let ifProperty   = sourceTag.getAttribute('cv-if');
		let isProperty   = sourceTag.getAttribute('cv-is');
		let inverted     = false;
		let defined      = false;

		sourceTag.removeAttribute('cv-view');
		sourceTag.removeAttribute('cv-if');
		sourceTag.removeAttribute('cv-is');

		const viewClass = viewProperty
			? this.stringToClass(viewProperty)
			: View;

		if(ifProperty.substr(0, 1) === '!')
		{
			ifProperty = ifProperty.substr(1);
			inverted   = true;
		}

		if(ifProperty.substr(0, 1) === '?')
		{
			ifProperty = ifProperty.substr(1);
			defined    = true;
		}

		const subTemplate = new DocumentFragment;

		[...sourceTag.childNodes].forEach(
			n => subTemplate.appendChild(n)
		);

		const bindingView = this;

		const ifDoc = new DocumentFragment;

		// let view = new viewClass(Object.assign({}, this.args), bindingView);
		let view = new viewClass(this.args, bindingView);

		view.tags.bindTo((v,k)=> this.tags[k]=v, {removeWith: this});

		view.template = subTemplate;

		let proxy    = bindingView.args;
		let property = ifProperty;

		if(ifProperty.match(/\./))
		{
			[proxy, property] = Bindable.resolve(
				bindingView.args
				, ifProperty
				, true
			);
		}

		view.render(ifDoc, null, this);

		const propertyDebind = proxy.bindTo(property, (v,k) => {

			const o = v;

			if(defined)
			{
				v = v !== null && v !== undefined;
			}

			if(v instanceof Bag)
			{
				v = v.list;
			}

			if(Array.isArray(v))
			{
				v = !!v.length;
			}

			if(isProperty !== null)
			{
				v = o == isProperty;
			}

			if(inverted)
			{
				v = !v;
			}

			if(v)
			{
				tag.appendChild(ifDoc);

				[...ifDoc.childNodes].forEach(node => Dom.mapTags(node, false, (tag, walker) => {

					if(!tag.matches)
					{
						return;
					}

					tag.dispatchEvent(new CustomEvent('cvDomAttached', {
						target: tag
						, detail: { view: view || this, mainView: this }
					}));
				}));
			}
			else
			{
				view.nodes.forEach(n=>ifDoc.appendChild(n));

				Dom.mapTags(ifDoc, false, (tag, walker) => {

					if(!tag.matches)
					{
						return;
					}

					new CustomEvent('cvDomDetached', {
						target: tag
						, detail: { view: view || this, mainView: this }
					});
				});
			}
		}, { children: Array.isArray(proxy[property]) });

		// const propertyDebind = this.args.bindChain(property, onUpdate);

		bindingView.onRemove(propertyDebind);

		// const debindA = this.args.bindTo((v,k,t,d) => {
		// 	if(k === '_id')
		// 	{
		// 		return;
		// 	}

		// 	if(!d)
		// 	{
		// 		view.args[k] = v;
		// 	}
		// 	else if(k in view.args)
		// 	{
		// 		delete view.args[k];
		// 	}

		// });

		// const debindB = view.args.bindTo((v,k,t,d,p) => {
		// 	if(k === '_id' || String(k).substring(0,3) === '___')
		// 	{
		// 		return;
		// 	}

		// 	if(k in this.args)
		// 	{
		// 		if(!d)
		// 		{
		// 			this.args[k] = v;
		// 		}
		// 		else
		// 		{
		// 			delete this.args[k];
		// 		}
		// 	}
		// });

		let viewDebind = ()=>{
			propertyDebind();
			// debindA();
			// debindB();
			bindingView._onRemove.remove(propertyDebind);
			// bindingView._onRemove.remove(bindableDebind);
		};

		bindingView.onRemove(viewDebind);

		this.onRemove(()=>{
			// debindA();
			// debindB();
			view.remove();
			if(bindingView !== this)
			{
				bindingView.remove();
			}
		});

		return tag;
	}

	// compileIfTag(sourceTag)
	// {
	// 	let ifProperty = sourceTag.getAttribute('cv-if');
	// 	let inverted   = false;

	// 	sourceTag.removeAttribute('cv-if');

	// 	if(ifProperty.substr(0, 1) === '!')
	// 	{
	// 		ifProperty = ifProperty.substr(1);
	// 		inverted   = true;
	// 	}

	// 	const subTemplate = new DocumentFragment;

	// 	[...sourceTag.childNodes].forEach(
	// 		n => subTemplate.appendChild(n.cloneNode(true))
	// 	);

	// 	return (bindingView) => {

	// 		const tag = sourceTag.cloneNode();

	// 		const ifDoc = new DocumentFragment;

	// 		let view = new View({}, bindingView);

	// 		view.template = subTemplate;
	// 		// view.parent   = bindingView;

	// 		bindingView.syncBind(view);

	// 		let proxy    = bindingView.args;
	// 		let property = ifProperty;

	// 		if(ifProperty.match(/\./))
	// 		{
	// 			[proxy, property] = Bindable.resolve(
	// 				bindingView.args
	// 				, ifProperty
	// 				, true
	// 			);
	// 		}

	// 		let hasRendered = false;

	// 		const propertyDebind = proxy.bindTo(property, (v,k) => {

	// 			if(!hasRendered)
	// 			{
	// 				const renderDoc = (bindingView.args[property] || inverted)
	// 					? tag : ifDoc;

	// 				view.render(renderDoc);

	// 				hasRendered = true;

	// 				return;
	// 			}

	// 			if(Array.isArray(v))
	// 			{
	// 				v = !!v.length;
	// 			}

	// 			if(inverted)
	// 			{
	// 				v = !v;
	// 			}

	// 			if(v)
	// 			{
	// 				tag.appendChild(ifDoc);
	// 			}
	// 			else
	// 			{
	// 				view.nodes.forEach(n=>ifDoc.appendChild(n));
	// 			}

	// 		});

	// 		// let cleaner = bindingView;

	// 		// while(cleaner.parent)
	// 		// {
	// 		// 	cleaner = cleaner.parent;
	// 		// }

	// 		bindingView.onRemove(propertyDebind);

	// 		let bindableDebind = () => {

	// 			if(!proxy.isBound())
	// 			{
	// 				Bindable.clearBindings(proxy);
	// 			}

	// 		};

	// 		let viewDebind = ()=>{
	// 			propertyDebind();
	// 			bindableDebind();
	// 			bindingView._onRemove.remove(propertyDebind);
	// 			bindingView._onRemove.remove(bindableDebind);
	// 		};

	// 		view.onRemove(viewDebind);

	// 		return tag;
	// 	};
	// }

	mapTemplateTag(tag)
	{
		// const templateName = tag.getAttribute('cv-template');

		// tag.removeAttribute('cv-template');

		// this.templates[ templateName ] = tag.tagName === 'TEMPLATE'
		// 	? tag.cloneNode(true).content
		// 	: new DocumentFragment(tag.innerHTML);


		const templateName = tag.getAttribute('cv-template');

		tag.removeAttribute('cv-template');

		const source = tag.innerHTML;

		if(!View.templates.has(source))
		{
			View.templates.set(source, document.createRange().createContextualFragment(tag.innerHTML));
		}

		this.templates[ templateName ] = View.templates.get(source);

		this.postMapping.add(() => tag.remove());

		return tag;
	}

	mapSlotTag(tag)
	{
		const templateName = tag.getAttribute('cv-slot');
		let template = this.templates[ templateName ];

		if(!template)
		{
			let parent = this;

			while(parent)
			{
				template = parent.templates[ templateName ];

				if(template)
				{
					break;
				}

				parent = parent.parent;
			}

			if(!template)
			{
				console.error(`Template ${templateName} not found.`);
				return;
			}
		}

		tag.removeAttribute('cv-slot');

		while(tag.firstChild)
		{
			tag.firstChild.remove();
		}

		if(typeof template === 'string')
		{
			if(!View.templates.has(template))
			{
				View.templates.set(template, document.createRange().createContextualFragment(template));
			}
			template = View.templates.get(template);
		}

		tag.appendChild(template.cloneNode(true));

		return tag;
	}

	// syncBind(subView)
	// {
	// 	let debindA = this.args.bindTo((v,k,t,d)=>{
	// 		if(k === '_id')
	// 		{
	// 			return;
	// 		}

	// 		if(subView.args[k] !== v)
	// 		{
	// 			subView.args[k] = v;
	// 		}
	// 	});

	// 	let debindB = subView.args.bindTo((v,k,t,d,p)=>{

	// 		if(k === '_id')
	// 		{
	// 			return;
	// 		}

	// 		let newRef = v;
	// 		let oldRef = p;

	// 		if(newRef instanceof View)
	// 		{
	// 			newRef = newRef.___ref___;
	// 		}

	// 		if(oldRef instanceof View)
	// 		{
	// 			oldRef = oldRef.___ref___;
	// 		}

	// 		if(newRef !== oldRef && oldRef instanceof View)
	// 		{
	// 			p.remove();
	// 		}

	// 		if(k in this.args)
	// 		{
	// 			this.args[k] = v;
	// 		}

	// 	});

	// 	this.onRemove(debindA);
	// 	this.onRemove(debindB);

	// 	subView.onRemove(()=>{
	// 		this._onRemove.remove(debindA);
	// 		this._onRemove.remove(debindB);
	// 	});
	// }

	postRender(parentNode)
	{}

	attached(parentNode)
	{}

	interpolatable(str)
	{
		return !!(String(str).match(this.interpolateRegex));
	}

	static uuid()
	{
		return new Uuid;
	}

	remove(now = false)
	{
		if(!this.dispatchEvent(new CustomEvent('remove', {detail: {view:this}, cancelable: true})))
		{
			return;
		}

		const remover = () => {

			for(let i in this.tags)
			{
				if(Array.isArray(this.tags[i]))
				{
					this.tags[i] && this.tags[i].forEach(t=>t.remove());

					this.tags[i].splice(0);
				}
				else
				{
					this.tags[i] && this.tags[i].remove();

					this.tags[i] = undefined;
				}

			}

			for(let i in this.nodes)
			{
				this.nodes[i] && this.nodes[i].dispatchEvent(new Event('cvDomDetached'));
				this.nodes[i] && this.nodes[i].remove();

				this.nodes[i] = undefined;
			}

			this.nodes.splice(0);

			this.firstNode = this.lastNode = undefined;
		};

		if(now)
		{
			remover();
		}
		else
		{
			requestAnimationFrame(remover);
		}

		const callbacks = this._onRemove.items();

		for(const callback of callbacks)
		{
			callback();

			this._onRemove.remove(callback);
		}

		for(const cleanup of this.cleanup)
		{
			cleanup && cleanup();
		}

		this.cleanup.length = 0;

		for(const [tag, viewList] of this.viewLists)
		{
			viewList.remove();
		}

		this.viewLists.clear();

		for(const [callback, timeout] of this.timeouts)
		{
			clearTimeout(timeout.timeout);
			this.timeouts.delete(timeout.timeout);
		}

		for(const interval of this.intervals)
		{
			clearInterval(interval);
		}

		this.intervals.length = 0;

		for(const frame of this.frames)
		{
			frame();
		}

		this.frames.length = 0;

		this.preRuleSet.purge();
		this.ruleSet.purge();

		this.removed = true;

		this.dispatchEvent(new CustomEvent('removed', {detail: {view:this}, cancelable: true}))
	}

	findTag(selector)
	{
		for(let i in this.nodes)
		{
			let result;

			if(!this.nodes[i].querySelector)
			{
				continue;
			}

			if(this.nodes[i].matches(selector))
			{
				return new Tag(this.nodes[i], this, undefined,  undefined, this);
			}

			if(result = this.nodes[i].querySelector(selector))
			{
				return new Tag(result, this, undefined,  undefined, this);
			}
		}
	}

	findTags(selector)
	{
		const topLevel = this.nodes.filter(n => n.matches && n.matches(selector));
		const subLevel = this.nodes
		.filter(n=>n.querySelectorAll)
		.map(n=> [...n.querySelectorAll(selector)])
		.flat()
		.map(n=> new Tag(n, this, undefined,  undefined, this)) || [];

		return topLevel.concat(subLevel);
	}

	onRemove(callback)
	{
		if(callback instanceof Event)
		{
			return;
		}

		this._onRemove.add(callback);
	}

	update()
	{
	}

	beforeUpdate(args)
	{
	}

	afterUpdate(args)
	{
	}

	stringTransformer(methods)
	{
		return (x) => {

			for(const m in methods)
			{
				let parent   = this;
				const method = methods[m];

				while(parent && !parent[ method ])
				{
					parent = parent.parent;
				}

				if(!parent)
				{
					return;
				}

				x = parent[ methods[m] ](x);
			}

			return x;
		};
	}

	stringToClass(refClassname)
	{
		if(View.refClasses.has(refClassname))
		{
			return View.refClasses.get(refClassname);
		}

		let refClassSplit = refClassname.split('/');
		let refShortClass = refClassSplit[ refClassSplit.length - 1 ];

		let refClass      = require(refClassname);

		View.refClasses.set(refClassname, refClass[refShortClass]);

		return refClass[refShortClass];
	}

	preventParsing(node)
	{
		node[dontParse] = true;
	}

	toString()
	{
		return this.nodes.map(n => n.outerHTML).join(' ');
	}

	listen(node, eventName, callback, options)
	{
		if(typeof node === 'string')
		{
			options   = callback;
			callback  = eventName;
			eventName = node;
			node      = this;
		}

		if(node instanceof View)
		{
			return this.listen(node.nodes, eventName, callback, options);
		}

		if(Array.isArray(node))
		{
			return node.map(n => this.listen(n, eventName, callback, options));
				// .forEach(r => r());
		}

		if(node instanceof Tag)
		{
			return this.listen(node.element, eventName, callback, options);
		}

		node.addEventListener(eventName, callback, options);

		let remove = () => node.removeEventListener(eventName, callback, options);

		const remover = () => { remove(); remove = () => {}; };

		this.onRemove(() => remover());

		return remover;
	}

	detach()
	{
		for(const n in this.nodes)
		{
			this.nodes[n].remove();
		}

		return this.nodes;
	}
}

Object.defineProperty(View, 'templates', {value: new Map()});
Object.defineProperty(View, 'refClasses', {value: new Map()});
