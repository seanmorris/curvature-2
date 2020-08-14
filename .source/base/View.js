import { Bindable } from './Bindable';
import { ViewList } from './ViewList';
import { Router   } from './Router';
import { Dom      } from './Dom';
import { Tag      } from './Tag';
import { Bag      } from './Bag';
import { RuleSet  } from './RuleSet';

const dontParse = Symbol('dontParse');

let moveIndex = 0;

export class View
{
	get _id()
	{
		if (!this.__id)
		{
			Object.defineProperty(this, '__id', {
				configurable: false
				, writable:   false
				, value:      this.uuid()
			});
		}

		return this.__id;
	}

	constructor(args = {}, mainView = null)
	{
		Object.defineProperty(this, '___VIEW___', {
			enumerable: false,
			writable:    true
		});

		this.___VIEW___ = View;

		Object.defineProperty(this, 'args', {
			configurable: false
			, writable:   false
			, value:      Bindable.makeBindable(args)
		});

		const _this = this;

		if(!this.args._id)
		{
			Object.defineProperty(this.args, '_id', {
				configurable: false
				, get: function() { return _this._id }
			});
		}

		this.template  = ``;
		this.document  = ``;

		this.firstNode = null;
		this.lastNode  = null;
		this.nodes     = null;

		this.cleanup   = [];

		this._onRemove = new Bag((i,s,a) => {
			// console.log('View _onRemove', i, s, a);
		});

		this.attach    = new Bag((i,s,a) => {});
		this.detach    = new Bag((i,s,a) => {});

		this.eventCleanup = [];

		this.mainView  = null;
		this.parent    = mainView;
		this.viewList  = null;
		this.viewLists = {};

		this.withViews = {};

		this.tags      = Bindable.makeBindable({});

		this.intervals = [];
		this.timeouts  = [];
		this.frames    = [];

		this.ruleSet     = new RuleSet;
		this.preRuleSet  = new RuleSet;
		this.subBindings = {};

		this.subTemplates = {};

		this.removed   = false;
		this.preserve  = false;

		this.interpolateRegex = /(\[\[((?:\$+)?[\w\.\|]+)\]\])/g;

		this.rendered = new Promise((accept, reject) => {

			Object.defineProperty(this, 'renderComplete', {
				configurable: false
				, writable:   false
				, value:      accept
			});

		});

		return Bindable.make(this);
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

			callback(Date.now());

			requestAnimationFrame(c);
		};

		requestAnimationFrame(() => c(Date.now()));

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
		let wrappedCallback = () => {
			this.timeouts[index].fired    = true;
			this.timeouts[index].callback = null;
			callback();
		};
		let timeout = setTimeout(wrappedCallback, time)
		let index   = this.timeouts.length;

		this.timeouts.push({
			timeout:    timeout
			, callback: wrappedCallback
			, time:     time
			, fired:    false
			, created:  (new Date).getTime()
			, paused:   false
		});

		return timeout;
	}

	clearTimeout(timeout)
	{
		for(var i in this.timeouts) {
			if(timeout === this.timeouts[i].timeout) {
				clearTimeout(this.timeouts[i].timeout);

				delete this.timeouts[i];
			}
		}
	}

	onInterval(time, callback)
	{
		let timeout = setInterval(callback, time);

		this.intervals.push({
			timeout:    timeout
			, callback: callback
			, time:     time
			, paused:   false
		});

		return timeout;
	}

	clearInterval(timeout)
	{
		for(var i in this.intervals) {
			if(timeout === this.intervals[i].timeout) {
				clearInterval(this.intervals[i].timeout);

				delete this.intervals[i];
			}
		}
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
			for(let i in this.timeouts)
			{
				if(this.timeouts[i].fired)
				{
					delete this.timeouts[i];
					continue;
				}

				clearTimeout(this.timeouts[i].timeout);
			}

			for(let i in this.intervals)
			{
				clearInterval(this.intervals[i].timeout);
			}
		}
		else
		{
			for(let i in this.timeouts)
			{
				if(!this.timeouts[i].timeout.paused)
				{
					continue;
				}

				if(this.timeouts[i].fired)
				{
					delete this.timeouts[i];
					continue;
				}

				this.timeouts[i].timeout = setTimeout(
					this.timeouts[i].callback
					, this.timeouts[i].time
				);
			}

			for(let i in this.intervals)
			{
				if(!this.intervals[i].timeout.paused)
				{
					continue;
				}

				this.intervals[i].timeout.paused = false;

				this.intervals[i].timeout = setInterval(
					this.intervals[i].callback
					, this.intervals[i].time
				);
			}
		}

		for(let i in this.viewLists)
		{
			if(!this.viewLists[i])
			{
				return;
			}

			this.viewLists[i].pause(!!paused);
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

	render(parentNode = null, insertPoint = null)
	{
		const ref = Bindable.make(this);

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
			return this.reRender(parentNode, insertPoint);
		}

		const templateParsed = (this.template instanceof DocumentFragment)
			? this.template.cloneNode(true)
			: View.templates.has(this.template);

		const subDoc = templateParsed
			? ((this.template instanceof DocumentFragment)
				? templateParsed
				: View.templates.get(this.template).cloneNode(true)
			)
			: document.createRange().createContextualFragment(this.template);

		if(!templateParsed && !(this.template instanceof DocumentFragment))
		{
			View.templates.set(this.template, subDoc.cloneNode(true));
		}

		this.mainView || this.preRuleSet.apply(subDoc, this);

		this.mapTags(subDoc);

		this.mainView || this.ruleSet.apply(subDoc, this);

		this.nodes = [];

		if(window['devmode'] === true)
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

		if(parentNode)
		{
			const rootNode = parentNode.getRootNode();
			let toRoot     = false;
			let moveType   = 'internal';

			if(rootNode === document)
			{
				toRoot = true;
				moveType = 'external';
			}

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

			moveIndex++;

			if(toRoot)
			{
				ref.attached(rootNode, parentNode);

				const attach = this.attach.items();

				for(let i in attach)
				{
					attach[i](rootNode, parentNode);
				}

				this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).map(child => {
					child.dispatchEvent(new Event('cvDomAttached', {
						bubbles: true, target: child
					}));
				});
			}
		}

		this.renderComplete(this.nodes);

		this.postRender(parentNode);

		return this.nodes;
	}

	reRender(parentNode, insertPoint)
	{
		const subDoc = new DocumentFragment;

		if(this.firstNode.getRootNode() === document)
		{
			const detach = this.detach.items();

			for(let i in detach)
			{
				detach[i]();
			}

			this.nodes.filter(n => n.nodeType === Node.ELEMENT_NODE).map(child => {
				child.dispatchEvent(new Event('cvDomDetached', {
					bubbles: true, target: child
				}));
			});
		}

		subDoc.append(...this.nodes);
		// subDoc.appendChild(this.firstNode);
		// subDoc.appendChild(this.lastNode);

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

			if(rootNode === document)
			{
				this.nodes.filter(n => n.nodeType === Node.ELEMENT_NODE).map(child => {
					child.dispatchEvent(new Event('cvDomAttached', {
						bubbles: true, target: child
					}));
				});

				const attach = this.attach.items();

				for(let i in attach)
				{
					attach[i](rootNode, parentNode);
				}
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

				tag = tag.matches('[cv-if]')
					&& this.mapIfTag(tag)
					|| tag;

				tag = tag.matches('[cv-with]')
					&& this.mapWithTag(tag)
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
	}

	mapExpandableTag(tag)
	{
		/*/
		const tagCompiler = this.compileExpandableTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;
		/*/
		let expandProperty = tag.getAttribute('cv-expand');
		let expandArg = Bindable.makeBindable(
			this.args[expandProperty] || {}
		);

		tag.removeAttribute('cv-expand');

		for(let i in expandArg)
		{
			if(i === 'name' || i === 'type')
			{
				continue;
			}

			let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
				tag.setAttribute(i, v);
			})(tag,i));

			this.onRemove(()=>{
				debind();
				if(expandArg.isBound())
				{
					Bindable.clearBindings(expandArg);
				}
			});
		}

		return tag;
		//*/
	}

	compileExpandableTag(sourceTag)
	{
		return (bindingView) => {

			const tag = sourceTag.cloneNode(true);

			let expandProperty = tag.getAttribute('cv-expand');
			let expandArg = Bindable.makeBindable(
				bindingView.args[expandProperty] || {}
			);

			tag.removeAttribute('cv-expand');

			for(let i in expandArg)
			{
				if(i === 'name' || i === 'type')
				{
					continue;
				}

				let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
					tag.setAttribute(i, v);
				})(tag,i));

				bindingView.onRemove(()=>{
					debind();
					if(expandArg.isBound())
					{
						Bindable.clearBindings(expandArg);
					}
				});
			}

			return tag;
		};
	}

	mapAttrTag(tag)
	{
		//*/
		const tagCompiler = this.compileAttrTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;

		/*/

		let attrProperty = tag.getAttribute('cv-attr');

		tag.removeAttribute('cv-attr');

		let pairs = attrProperty.split(',');
		let attrs = pairs.map((p) => p.split(':'));

		for (let i in attrs)
		{
			let proxy        = this.args;
			let bindProperty = attrs[i][1];
			let property     = bindProperty;

			if(bindProperty.match(/\./))
			{
				[proxy, property] = Bindable.resolve(
					this.args
					, bindProperty
					, true
				);
			}

			let attrib = attrs[i][0];

			this.onRemove(proxy.bindTo(
				property
				, (v)=>{
					if(v == null)
					{
						tag.setAttribute(attrib, '');
						return;
					}
					tag.setAttribute(attrib, v);
				}
			));
		}

		return tag;

		//*/
	}

	compileAttrTag(sourceTag)
	{
		const attrProperty = sourceTag.getAttribute('cv-attr');

		const pairs = attrProperty.split(',');
		const attrs = pairs.map((p) => p.split(':'));

		sourceTag.removeAttribute('cv-attr');

		return (bindingView) => {

			const tag = sourceTag.cloneNode(true);

			for (let i in attrs)
			{
				const bindProperty = attrs[i][1];

				const [proxy, property] = Bindable.resolve(
					bindingView.args
					, bindProperty
					, true
				);

				const attrib = attrs[i][0];

				bindingView.onRemove(proxy.bindTo( property , (v) => {

					if(v == null)
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

		if(tag.nodeType === Node.TEXT_NODE)
		{
			let original = tag.nodeValue;

			if(!this.interpolatable(original))
			{
				return tag;
			}

			let header   = 0;
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

				let debind = proxy.bindTo(property, (v,k,t) => {
					if(t[k] instanceof View && t[k] !== v)
					{
						if(!t[k].preserve)
						{
							t[k].remove();
						}
					}

					dynamicNode.nodeValue = '';

					if(unsafeView && !(v instanceof View))
					{
						const unsafeTemplate = v;

						console.log(unsafeTemplate);

						v = new View(this.args, this);

						v.template = unsafeTemplate;
					}

					if(v instanceof View)
					{
						const onAttach = (parentNode) => {
							v.attached(parentNode);
						};

						this.attach.add(onAttach);

						v.render(tag.parentNode, dynamicNode);

						const cleanup = ()=>{
							if(!v.preserve)
							{
								v.remove();
							}
						};

						this.onRemove(cleanup);

						v.onRemove(() => {
							this.attach.remove(onAttach);
							this._onRemove.remove(cleanup);
						});
					}
					else
					{
						if(transformer)
						{
							v = transformer(v);
						}

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

						dynamicNode[dontParse] = true;
					}
				});

				this.onRemove(()=>{
					debind();
					if(!proxy.isBound())
					{
						Bindable.clearBindings(proxy);
					}
				});
			}

			let staticSuffix = original.substring(header);

			let staticNode = document.createTextNode(staticSuffix);

			staticNode[dontParse] = true;

			tag.parentNode.insertBefore(staticNode, tag);

			tag.nodeValue = '';

		}

		if(tag.nodeType === Node.ELEMENT_NODE)
		{
			for (let i = 0; i < tag.attributes.length; i++)
			{
				if(!this.interpolatable(tag.attributes[i].value))
				{
					// console.log('!!', tag.attributes[i].value);
					continue;
				}

				// console.log(tag.attributes[i].value);

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
					// if(property.match(/\./))
					// {
					// 	[proxy, property] = Bindable.resolve(
					// 		this.args
					// 		, property
					// 		, true
					// 	);
					// }

					// console.log(this.args, property);

					const matching = [];
					const bindProperty = j;

					const matchingSegments = bindProperties[longProperty];


					this.onRemove(proxy.bindTo(property, (v, k, t, d) => {
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

						tag.setAttribute(attribute.name, segments.join(''));
					}));

					this.onRemove(()=>{
						if(!proxy.isBound())
						{
							Bindable.clearBindings(proxy);
						}
					});
				}
			}
		}

		return tag;
	}

	mapRefTag(tag)
	{
		let refAttr = tag.getAttribute('cv-ref');
		let [refProp, refClassname, refKey] = refAttr.split(':');

		if(!refClassname)
		{
			refClassname = 'curvature/base/Tag';
		}

		let refClass = this.stringToClass(refClassname);

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
		else
		{
			// this.tags[refProp] = new refClass(
			// 	tag, this, refProp
			// );
		}

		let tagObject = new refClass(
			tag, this, refProp, undefined, direct
		);

		tag.___tag___ = tagObject;

		this.tags[refProp] = tag;

		while(parent)
		{
			if(!parent.parent)
			{
			}

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

		let debind = proxy.bindTo(property, (v,k,t,d,p) => {

			if(p instanceof View && p !== v)
			{
				p.remove();
			}

			const autoChangedEvent = new CustomEvent('cvAutoChanged', {bubbles: true});

			if(tag.tagName === 'INPUT' || tag.tagName === 'SELECT' || tag.tagName === 'TEXTAREA')
			{
				let type = tag.getAttribute('type');
				if(type && type.toLowerCase() === 'checkbox') {
					tag.checked = !!v;
					tag.dispatchEvent(autoChangedEvent);
				}
				else if(type && type.toLowerCase() === 'radio') {
					tag.checked = (v == tag.value);
					tag.dispatchEvent(autoChangedEvent);
				}
				else if(type !== 'file') {
					if(tag.tagName === 'SELECT')
					{
						// console.log(k, v, tag.outerHTML, tag.options.length);
						for(let i in tag.options)
						{
							let option = tag.options[i];

							if(option.value == v)
							{
								tag.selectedIndex = i;
							}
						}
					}
					tag.value = v == null ? '' : v;
					tag.dispatchEvent(autoChangedEvent);
				}
			}
			else
			{
				for(const node of tag.childNodes)
				{
					node.remove();
				}

				if(v instanceof View)
				{
					const onAttach = (parentNode) => {
						v.attached(parentNode);
					};

					this.attach.add(onAttach);

					v.render(tag);

					v.onRemove(()=>this.attach.remove(onAttach));
				}
				else if(unsafeHtml)
				{
					tag.innerHTML = v;
				}
				else
				{
					tag.textContent = v;
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
			// console.log(event, proxy, property, event.target.value);

			if(event.target !== tag)
			{
				return;
			}

			if (type && type.toLowerCase() === 'checkbox')
			{
				if (tag.checked) {
					proxy[property] = event.target.getAttribute('value');
				}
				else {
					proxy[property] = false;
				}
			}
			else if(type === 'file' && multi)
			{
				const files   = Array.from(event.target.files);
				const current = proxy[property] || proxy.___deck___[property];

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
			else if(type === 'file' && !multi)
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

		this.onRemove( ((tag, eventListener) => ()=>{
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

			tag           = undefined;
			eventListener = undefined;
		})(tag, inputListener));

		tag.removeAttribute('cv-bind');

		return tag;
	}

	mapOnTag(tag)
	{
		const referent = String(tag.getAttribute('cv-on'));

		let action = referent.split(';').map(a=> a.split(':')).map((a)=>{
			a = a.map(a => a.trim());

			let eventName    = a[0].trim();

			let callbackName = a[1];
			let eventFlags   = String(a[2] || '');
			let argList      = [];
			let groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);

			if(!groups)
			{
				throw new Error(
					'Invalid event method referent: '
					+ tag.getAttribute('cv-on')
				);
			}

			if(groups.length)
			{
				callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');

				if(groups[2])
				{
					argList = groups[2].split(',').map(s => s.trim());
				}
			}

			if(!eventName)
			{
				eventName = callbackName;
			}

			let eventMethod;
			let parent = this;

			while(parent)
			{
				if(typeof parent[callbackName] === 'function')
				{
					let _parent       = parent;
					let _callBackName = callbackName;
					eventMethod = (...args) => {
						_parent[ _callBackName ](...args);
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

			let eventListener = ((event) => {

				let argRefs = argList.map((arg) => {
					let match;
					if(parseInt(arg) == arg)
					{
						return arg;
					}
					else if(arg === 'event' || arg === '$event') {
						return event;
					}
					else if(arg === '$view') {
						return parent;
					}
					else if(arg === '$tag') {
						return tag;
					}
					else if(arg === '$parent') {
						return this.parent;
					}
					else if(arg === '$subview') {
						return this;
					}
					else if(arg in this.args) {
						return this.args[arg];
					}
					else if(match = /^['"](\w+?)["']$/.exec(arg))
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
					this.attach.add(eventListener);
					break;

				case '_detach':
					this.detach.add(eventListener);
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
		/*/
		const tagCompiler = this.compileLinkTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;
		/*/
		let linkAttr = tag.getAttribute('cv-link');

		tag.setAttribute('href', linkAttr);

		let linkClick = (event) => {
			event.preventDefault();

			if(linkAttr.substring(0, 4) === 'http'
				|| linkAttr.substring(0, 2) === '//'
			){
				window.open(tag.getAttribute('href', linkAttr));

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
		//*/
	}

	compileLinkTag(sourceTag)
	{
		const linkAttr = sourceTag.getAttribute('cv-link');

		sourceTag.removeAttribute('cv-link');

		return (bindingView) => {

			const tag = sourceTag.cloneNode(true);

			tag.setAttribute('href', linkAttr);

			tag.addEventListener('click', View.linkClicked);

			bindingView.onRemove(
				() => tag.removeEventListener(View.linkClicked)
			);

			return tag;
		};
	}

	mapPrendererTag(tag)
	{
		let prerenderAttr = tag.getAttribute('cv-prerender');
		let prerendering  = window.prerenderer || navigator.userAgent.match(/prerender/i);

		if(prerendering)
		{
			window.prerenderer = window.prerenderer || true;
		}

		if(prerenderAttr === 'never' && prerendering
			|| prerenderAttr === 'only' && !prerendering
		){
			tag.parentNode.removeChild(tag);
		}

		return tag;
	}

	mapWithTag(tag)
	{
		let withAttr = tag.getAttribute('cv-with');
		let carryAttr = tag.getAttribute('cv-carry');
		tag.removeAttribute('cv-with');
		tag.removeAttribute('cv-carry');

		let subTemplate = new DocumentFragment;

		Array.from(tag.childNodes).map(n => subTemplate.appendChild(n));

		let carryProps = [];

		if(carryAttr)
		{
			carryProps = carryAttr.split(',').map(s=>s.trim());
		}

		let debind = this.args.bindTo(withAttr, (v,k,t,d) => {
			if(this.withViews[k])
			{
				this.withViews[k].remove();
			}

			while(tag.firstChild)
			{
				tag.removeChild(tag.firstChild);
			}

			let view = new View({}, this);

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
				let debind = v.bindTo(i, (v, k) => {
					view.args[k] = v;
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

			view.render(tag);

			this.withViews[k] = view;
		});

		this.onRemove(debind);

		return tag;
	}

	mapEachTag(tag)
	{
		const eachAttr = tag.getAttribute('cv-each');
		tag.removeAttribute('cv-each');

		const subTemplate = new DocumentFragment();

		Array.from(tag.childNodes).map(n => subTemplate.appendChild(n));

		const [eachProp, asProp, keyProp] = eachAttr.split(':');

		const debind = this.args.bindTo(eachProp, (v,k,t,d,p)=>{
			if(this.viewLists[eachProp])
			{
				this.viewLists[eachProp].remove();
			}

			const viewList = new ViewList(subTemplate, asProp, v, this, keyProp);
			const viewListRemover = () => viewList.remove();

			this.onRemove(viewListRemover);

			viewList.onRemove(()=>this._onRemove.remove(viewListRemover));

			const debindA = this.args.bindTo((v,k,t,d)=>{

				if(k === '_id')
				{
					return;
				}

				viewList.args.subArgs[k] = v;
			});

			const debindB = viewList.args.bindTo((v,k,t,d,p)=>{

				if(k === '_id' || k === 'value' || k.substring(0,3) === '___')
				{
					return;
				}

				if(k in this.args)
				{
					this.args[k] = v;
				}

			});

			this.onRemove(debindA);
			this.onRemove(debindB);

			while(tag.firstChild)
			{
				tag.removeChild(tag.firstChild);
			}

			this.viewLists[eachProp] = viewList;

			viewList.render(tag);
		});

		this.onRemove(debind);

		return tag;
	}

	mapIfTag(tag)
	{
		/*/
		const tagCompiler = this.compileIfTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;

		/*/

		const sourceTag = tag;

		let ifProperty = sourceTag.getAttribute('cv-if');
		let inverted   = false;

		sourceTag.removeAttribute('cv-if');

		if(ifProperty.substr(0, 1) === '!')
		{
			ifProperty = ifProperty.substr(1);
			inverted   = true;
		}

		const subTemplate = new DocumentFragment;

		Array.from(sourceTag.childNodes).map(
			n => subTemplate.appendChild(n)
			// n => subTemplate.appendChild(n.cloneNode(true))
		);

		const bindingView = this;

		const ifDoc = new DocumentFragment;

		let view = new View(this.args, bindingView);

		view.template = subTemplate;
		// view.parent   = bindingView;

		// bindingView.syncBind(view);

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

		let hasRendered = false;

		const propertyDebind = proxy.bindTo(property, (v,k) => {

			if(!hasRendered)
			{
				let initValue = proxy[property];

				const renderDoc  = (!!initValue ^ !!inverted)
					? tag
					: ifDoc;

				view.render(renderDoc);

				hasRendered = true;

				return;
			}

			if(Array.isArray(v))
			{
				v = !!v.length;
			}

			if(inverted)
			{
				v = !v;
			}

			if(v)
			{
				tag.appendChild(ifDoc);
			}
			else
			{
				view.nodes.map(n=>ifDoc.appendChild(n));
			}

		});

		// const propertyDebind = this.args.bindChain(property, onUpdate);

		bindingView.onRemove(propertyDebind);

		let bindableDebind = () => {

			if(!proxy.isBound())
			{
				Bindable.clearBindings(proxy);
			}

		};

		let viewDebind = ()=>{
			propertyDebind();
			bindableDebind();
			bindingView._onRemove.remove(propertyDebind);
			bindingView._onRemove.remove(bindableDebind);
		};

		bindingView.onRemove(viewDebind);

		return tag;

		//*/
	}

	compileIfTag(sourceTag)
	{
		let ifProperty = sourceTag.getAttribute('cv-if');
		let inverted   = false;

		sourceTag.removeAttribute('cv-if');

		if(ifProperty.substr(0, 1) === '!')
		{
			ifProperty = ifProperty.substr(1);
			inverted   = true;
		}

		const subTemplate = new DocumentFragment;

		Array.from(sourceTag.childNodes).map(
			n => subTemplate.appendChild(n.cloneNode(true))
		);

		return (bindingView) => {

			const tag = sourceTag.cloneNode();

			const ifDoc = new DocumentFragment;

			let view = new View({}, bindingView);

			view.template = subTemplate;
			// view.parent   = bindingView;

			bindingView.syncBind(view);

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

			let hasRendered = false;

			const propertyDebind = proxy.bindTo(property, (v,k) => {

				if(!hasRendered)
				{
					const renderDoc = (bindingView.args[property] || inverted)
						? tag : ifDoc;

					view.render(renderDoc);

					hasRendered = true;

					return;
				}

				if(Array.isArray(v))
				{
					v = !!v.length;
				}

				if(inverted)
				{
					v = !v;
				}

				if(v)
				{
					tag.appendChild(ifDoc);
				}
				else
				{
					view.nodes.map(n=>ifDoc.appendChild(n));
				}

			});

			// let cleaner = bindingView;

			// while(cleaner.parent)
			// {
			// 	cleaner = cleaner.parent;
			// }

			bindingView.onRemove(propertyDebind);

			let bindableDebind = () => {

				if(!proxy.isBound())
				{
					Bindable.clearBindings(proxy);
				}

			};

			let viewDebind = ()=>{
				propertyDebind();
				bindableDebind();
				bindingView._onRemove.remove(propertyDebind);
				bindingView._onRemove.remove(bindableDebind);
			};

			view.onRemove(viewDebind);

			return tag;
		};
	}

	mapTemplateTag(tag)
	{
		const templateName = tag.getAttribute('cv-template');

		tag.removeAttribute('cv-template');

		this.subTemplates[ templateName ] = () => {
			return tag.tagName === 'TEMPLATE'
				? tag.content.cloneNode(true)
				: new DocumentFragment(tag.innerHTML);
		};

		return tag;
	}

	mapSlotTag(tag)
	{
		const templateName = tag.getAttribute('cv-slot');
		const getTemplate  = this.subTemplates[ templateName ];

		if(!getTemplate)
		{
			return;
		}

		const template = getTemplate();

		tag.removeAttribute('cv-slot');

		while(tag.firstChild)
		{
			tag.firstChild.remove();
		}

		tag.appendChild(template);

		return tag;
	}

	// compileTag(sourceTag)
	// {
	// 	return (bindingView) => {

	// 		const tag = sourceTag.cloneNode(true);

	// 		return tag;

	// 	};
	// }

	syncBind(subView)
	{
		let debindA = this.args.bindTo((v,k,t,d)=>{
			if(k === '_id')
			{
				return;
			}

			if(subView.args[k] !== v)
			{
				subView.args[k] = v;
			}
		});

		// for(let i in this.args)
		// {
		// 	if(i == '_id')
		// 	{
		// 		continue;
		// 	}

		// 	subView.args[i] = this.args[i];
		// }

		let debindB = subView.args.bindTo((v,k,t,d,p)=>{

			if(k === '_id')
			{
				return;
			}

			let newRef = v;
			let oldRef = p;

			if(newRef instanceof View)
			{
				newRef = newRef.___ref___;
			}

			if(oldRef instanceof View)
			{
				oldRef = oldRef.___ref___;
			}

			if(newRef !== oldRef && oldRef instanceof View)
			{
				p.remove();
			}

			if(k in this.args)
			{
				this.args[k] = v;
			}

		});

		this.onRemove(debindA);
		this.onRemove(debindB);

		subView.onRemove(()=>{
			this._onRemove.remove(debindA);
			this._onRemove.remove(debindB);
		});
	}

	postRender(parentNode)
	{

	}

	attached(parentNode)
	{

	}

	interpolatable(str)
	{
		return !!(String(str).match(this.interpolateRegex));
	}

	uuid()
	{
		return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(
			/[018]/g
			, c => (
				c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4
			).toString(16)
		);
	}

	remove(now = false)
	{
		const remover = () => {

			this.firstNode = this.lastNode = undefined;

			for(let i in this.nodes)
			{
				this.nodes[i].dispatchEvent(new Event('cvDomDetached'));
				this.nodes[i].remove();
			}

			// Bindable.clearBindings(this.args);

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

		for(let callback of callbacks)
		{
			this._onRemove.remove(callback);

			callback();
		}

		let cleanup;

		while(cleanup = this.cleanup.shift())
		{
			cleanup && cleanup();
		}

		for(let i in this.viewLists)
		{
			if(!this.viewLists[i])
			{
				continue;
			}
			this.viewLists[i].remove();
		}

		this.viewLists = [];

		for(let i in this.timeouts)
		{
			clearInterval(this.timeouts[i].timeout);
			delete this.timeouts[i];
		}

		for(var i in this.intervals)
		{
			clearInterval(this.intervals[i].timeout);
			delete this.intervals[i];
		}

		this.removed = true;

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
				return this.nodes[i];
			}

			if(result = this.nodes[i].querySelector(selector))
			{
				return result;
			}
		}
	}

	findTags(selector)
	{
		return this.nodes,map(n=> n.querySelectorAll(selector)).flat();
	}

	onRemove(callback)
	{
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

		let refClassSplit           = refClassname.split('/');
		let refShortClassname       = refClassSplit[ refClassSplit.length - 1 ];

		let refClass                = require(refClassname);

		View.refClasses.set(refClassname, refClass[refShortClassname]);

		return refClass[refShortClassname];
	}

	preventParsing(node)
	{
		node[dontParse] = true;
	}

	toString()
	{
		return this.nodes.map(n => n.outerHTML).join(' ');
	}
}

Object.defineProperty(View, 'templates', {
	enumerable: false,
	writable: false,
	value: new Map()
});

Object.defineProperty(View, 'refClasses', {
	enumerable: false,
	writable: false,
	value: new Map()
});

Object.defineProperty(View, 'linkClicked', (event) => {

	event.preventDefault();

	const href = event.target.getAttribute('href');

	if(href.substring(0, 4) === 'http'|| href.substring(0, 2) === '//')
	{
		window.open(href);

		return;
	}

	Router.go(href);

});
