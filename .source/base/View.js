import { Bindable } from './Bindable';
import { ViewList } from './ViewList';
import { Router   } from './Router';
import { Dom      } from './Dom';
import { Tag      } from './Tag';
import { Bag      } from './Bag';
import { RuleSet  } from './RuleSet';

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

	constructor(args = {})
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

		Object.defineProperty(this.args, '_id', {
			configurable: false
			, get: function() { return _this._id }
		});

		this.template  = ``;
		this.document  = ``;

		this.firstNode = null;
		this.lastNode  = null;
		this.nodes     = null;

		this.cleanup   = [];

		this._onRemove = new Bag((i,s,a) => {

			// console.log('View _onRemove', i, s, a);

		});

		this.attach    = [];
		this.detach    = [];

		this.eventCleanup = [];

		this.parent    = null;
		this.viewList  = null;
		this.viewLists = {};

		this.withViews = {};

		this.tags      = {};

		this.intervals = [];
		this.timeouts  = [];
		this.frames    = [];

		this.ruleSet     = new RuleSet;
		this.preRuleSet  = new RuleSet;
		this.subBindings = {};

		this.removed   = false;
		this.preserve  = false;

		this.interpolateRegex = /(\[\[((?:\$)?[\w\.]+)\]\])/g;
	}

	static isView()
	{
		return View;
	}

	onFrame(callback) {
		let c = (timestamp) => {
			callback(timestamp);
			window.requestAnimationFrame(c);
		};

		c();
	}

	onTimeout(time, callback) {
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

	clearTimeout(timeout) {
		for(var i in this.timeouts) {
			if(timeout === this.timeouts[i].timeout) {
				clearTimeout(this.timeouts[i].timeout);

				delete this.timeouts[i];
			}
		}
	}

	onInterval(time, callback) {
		let timeout = setInterval(callback, time);

		this.intervals.push({
			timeout:    timeout
			, callback: callback
			, time:     time
			, paused:   false
		});

		return timeout;
	}

	clearInterval(timeout) {
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
		if(parentNode instanceof View)
		{
			parentNode = parentNode.firstNode;
		}

		if(insertPoint instanceof View)
		{
			insertPoint = insertPoint.firstNode;
		}

		if(this.nodes)
		{
			const templateParsed = new DocumentFragment();

			const subDoc = new DocumentFragment;

			if(this.firstNode.getRootNode() === document)
			{
				for(let i in this.detach)
				{
					this.detach[i]();
				}

				this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).map(child => {
					child.dispatchEvent(new Event('cvDomDetached', {
						bubbles: true, target: child
					}));
				});
			}

			subDoc.appendChild(this.firstNode);
			subDoc.appendChild(this.lastNode);

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

				if(parentNode.getRootNode() === document)
				{
					this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).map(child => {
						child.dispatchEvent(new Event('cvDomAttached', {
							bubbles: true, target: child
						}));
					});

					for(let i in this.attach)
					{
						this.attach[i]();
					}
				}

			}

			return this.nodes;
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

		this.preRuleSet.apply(subDoc, this);

		Dom.mapTags(subDoc, false, (tag)=>{
			if(tag.matches)
			{
				this.mapInterpolatableTag(tag)

				tag.matches('[cv-prerender]')
					&& this.mapPrendererTag(tag);

				tag.matches('[cv-link]')
					&& this.mapLinkTag(tag);

				tag.matches('[cv-attr]')
					&& this.mapAttrTag(tag);

				tag.matches('[cv-expand]')
					&& this.mapExpandableTag(tag);

				tag.matches('[cv-ref]')
					&& this.mapRefTag(tag);

				tag.matches('[cv-on]')
					&& this.mapOnTag(tag);

				if(tag.matches('[cv-if]'))
				{
					this.mapIfTag(tag);
					return;
				}

				if(tag.matches('[cv-with]'))
				{
					this.mapWithTag(tag);
					return;
				}

				if(tag.matches('[cv-bind]'))
				{
					this.mapBindTag(tag);
				}

				if(tag.matches('[cv-each]'))
				{
					this.mapEachTag(tag);
					return;
				}

			}
			else
			{
				this.mapInterpolatableTag(tag);
			}
		});

		this.ruleSet.apply(subDoc, this);

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

		this.nodes.push(this.firstNode, ...Array.from(subDoc.childNodes), this.lastNode);

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

			if(parentNode.getRootNode() === document)
			{
				for(let i in this.attach)
				{
					this.attach[i]();
				}

				this.nodes.filter(n => n.nodeType !== Node.COMMENT_NODE).map(child => {
					child.dispatchEvent(new Event('cvDomAttached', {
						bubbles: true, target: child
					}));
				});
			}

		}

		this.postRender(parentNode);

		return this.nodes;
	}

	mapExpandableTag(tag)
	{
		let expandProperty = tag.getAttribute('cv-expand');
		let expandArg = Bindable.makeBindable(
			this.args[expandProperty] || {}
		);

		tag.removeAttribute('cv-expand');

		for(let i in expandArg)
		{
			if(i == 'name' || i == 'type')
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
	}

	mapAttrTag(tag)
	{
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
	}

	mapInterpolatableTag(tag)
	{
		let regex = this.interpolateRegex;

		if(tag.nodeType == Node.TEXT_NODE)
		{
			let original = tag.nodeValue;

			if(!this.interpolatable(original))
			{
				return;
			}

			let header   = 0;
			let match;

			while(match = regex.exec(original))
			{
				let bindProperty = match[2];

				let unsafeHtml = false;

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

					if(v instanceof View)
					{
						v.render(tag.parentNode, dynamicNode);

						const cleanup = ()=>{
							if(!v.preserve)
							{
								v.remove();
							}
						};

						this.onRemove(cleanup);

						v.onRemove( ()=> this._onRemove.remove(cleanup) );
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
				});

				this.onRemove(()=>{
					debind();
					if(!proxy.isBound())
					{
						Bindable.clearBindings(proxy);
					}
				});
			}

			let staticSuffix = original.substring(header)

			let staticNode = document.createTextNode(staticSuffix);

			tag.parentNode.insertBefore(staticNode, tag);

			tag.nodeValue = '';

		}

		if(tag.nodeType == Node.ELEMENT_NODE)
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
					let property = j

					if(j.match(/\./))
					{
						[proxy, property] = Bindable.resolve(
							this.args
							, j
							, true
						);
					}

					let longProperty = j;

					this.onRemove(proxy.bindTo(property, (v, k, t, d) => {
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
	}

	mapRefTag(tag)
	{
		let refAttr = tag.getAttribute('cv-ref');
		let [refProp, refClassname, refKey] = refAttr.split(':');

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

		let debind = proxy.bindTo(property, (v,k,t,d,p) => {

			if(p instanceof View && p !== v)
			{
				p.remove();
			}

			const autoChangedEvent = new CustomEvent('cvAutoChanged', {bubbles: true});

			if(tag.tagName == 'INPUT'
				|| tag.tagName == 'SELECT'
				|| tag.tagName == 'TEXTAREA'
			) {
				let type = tag.getAttribute('type');
				if(type && type.toLowerCase() == 'checkbox') {
					tag.checked = !!v;
					tag.dispatchEvent(autoChangedEvent);
				}
				else if(type && type.toLowerCase() == 'radio') {
					tag.checked = (v == tag.value);
					tag.dispatchEvent(autoChangedEvent);
				}
				else if(type !== 'file') {
					if(tag.tagName == 'SELECT')
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
				else if(type === 'file') {
					// console.log(v);
				}
				return;
			}

			if(v instanceof View)
			{
				v.render(tag);
				// tag.dispatchEvent(autoChangedEvent);
			}
			else
			{
				tag.textContent = v;
				// tag.dispatchEvent(autoChangedEvent);
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

			if(event.target !== tag) {
				return;
			}

			if (type && type.toLowerCase() == 'checkbox')
			{
				if (tag.checked) {
					proxy[property] = event.target.value;
				}
				else {
					proxy[property] = false;
				}
			}
			else if(type == 'file' && multi)
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
							current[i] = files[i];
							break;
						}
					}
				}

			}
			else if(type == 'file' && !multi)
			{
				proxy[property] = event.target.files.item(0);
			}
			else
			{
				proxy[property] = event.target.value;
			}
		};

		if(type == 'file')
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
			if(type == 'file')
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
	}

	mapOnTag(tag)
	{
		const referent = String(tag.getAttribute('cv-on'));

		let action = referent.split(';').map(a=> a.split(':')).map((a)=>{
			a = a.map(a => a.trim());

			let eventName    = a[0].trim();

			if(!eventName)
			{
				return;
			}

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

			let eventMethod;
			let parent = this;

			while(parent)
			{
				if(typeof parent[callbackName] == 'function')
				{
					let _parent       = parent;
					let _callBackName = callbackName;
					eventMethod = (...args) => {
						_parent[ _callBackName ](...args);
					};
					break;
				}

				if(parent.viewList && parent.viewList.parent)
				{
					parent = parent.viewList.parent;
				}
				else if(parent.parent)
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


				if(!(typeof eventMethod == 'function'))
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
					this.attach.push(eventListener);
					break;

				case '_detach':
					this.detach.push(eventListener);
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
	}

	mapLinkTag(tag)
	{
		let linkAttr = tag.getAttribute('cv-link');

		tag.setAttribute('href', linkAttr);

		let linkClick = (event) => {
			event.preventDefault();

			if(linkAttr.substring(0, 4) == 'http'
				|| linkAttr.substring(0, 2) == '//'
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
	}

	mapPrendererTag(tag)
	{
		let prerenderAttr = tag.getAttribute('cv-prerender');
		let prerendering  = window.prerenderer;

		if(prerenderAttr == 'never' && prerendering
			|| prerenderAttr == 'only' && !prerendering
		){
			tag.parentNode.removeChild(tag);
		}
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

			let view = new View();

			this.onRemove(((view)=>()=>{
				view.remove();
			})(view));

			view.template = subTemplate;
			view.parent   = this;

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
	}

	mapEachTag(tag)
	{
		let eachAttr = tag.getAttribute('cv-each');
		tag.removeAttribute('cv-each');

		let subTemplate = new DocumentFragment();

		Array.from(tag.childNodes).map(n => subTemplate.appendChild(n));

		let [eachProp, asProp, keyProp] = eachAttr.split(':');

		let debind = this.args.bindTo(eachProp, (v,k,t,d,p)=>{
			if(this.viewLists[eachProp])
			{
				this.viewLists[eachProp].remove();
			}

			const viewList = new ViewList(subTemplate, asProp, v, this, keyProp);
			const viewListRemover = ()=>viewList.remove();

			this.onRemove(viewListRemover);

			viewList.onRemove(()=>this._onRemove.remove(viewListRemover));

			let debindA = this.args.bindTo((v,k,t,d)=>{

				if(k == '_id')
				{
					return;
				}

				if(viewList.args.subArgs[k] !== v)
				{
					viewList.args.subArgs[k] = v;
				}

			});

			for(let i in this.args)
			{
				if(i == '_id')
				{
					continue;
				}

				viewList.args.subArgs[k] = this.args[i];
			}

			let debindB = viewList.args.bindTo((v,k,t,d,p)=>{

				if(k == '_id' || k.substring(0,3) === '___')
				{
					return;
				}

				let newRef = v;
				let oldRef = p;

				if(v instanceof View)
				{
					newRef = v.___ref___;
				}

				if(p instanceof View)
				{
					oldRef = p.___ref___;
				}

				if(newRef !== oldRef && t[k] instanceof View)
				{
					t[k].remove();
				}

				if((k in this.args) && newRef !== oldRef)
				{
					this.args[k] = v;
				}

			}, {wait:0});

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
	}

	mapIfTag(tag)
	{
		let ifProperty = tag.getAttribute('cv-if');

		tag.removeAttribute('cv-if');

		const ifDoc = new DocumentFragment;
		const subTemplate = new DocumentFragment;

		let inverted = false;

		if(ifProperty.substr(0, 1) === '!')
		{
			inverted   = true;
			ifProperty = ifProperty.substr(1);
		}

		Array.from(tag.childNodes).map(n => subTemplate.appendChild(n));

		let view = new View;

		view.template = subTemplate;
		view.parent   = this;

		this.syncBind(view);

		let cleaner = this;

		while(cleaner.parent)
		{
			cleaner = cleaner.parent;
		}

		if(this.args[property] || (inverted && !this.args[property]))
		{
			view.render(tag);
		}
		else
		{
			view.render(ifDoc);
		}

		let proxy    = this.args;
		let property = ifProperty;

		if(ifProperty.match(/\./))
		{
			[proxy, property] = Bindable.resolve(
				this.args
				, ifProperty
				, true
			);
		}

		let propertyDebind = proxy.bindTo(property, (v,k) => {

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

		})

		this.onRemove(propertyDebind);

		let bindableDebind = () => {

			if(!proxy.isBound())
			{
				Bindable.clearBindings(proxy);
			}

		};

		let viewDebind = ()=>{
			syncDebind();
			propertyDebind();
			bindableDebind();
			this._onRemove.remove(syncDebind);
			this._onRemove.remove(propertyDebind);
			this._onRemove.remove(bindableDebind);
		};

		view.onRemove(viewDebind);
	}

	// mapTemplateTag(tag)
	// {
	// 	let subTemplate = tag.innerHTML;

	// 	view.template = subTemplate;
	// 	view.parent   = this;

	// 	let deBindSync = this.syncBind(view);

	// 	let cleaner = this;

	// 	while(cleaner.parent)
	// 	{
	// 		cleaner = cleaner.parent;
	// 	}

	// 	this.cleanup.push(()=>{
	// 		deBindSync();
	// 		// view.remove();
	// 	});

	// 	view.render(tag);
	// }

	syncBind(subView)
	{
		let debindA = this.args.bindTo((v,k,t,d)=>{
			if(k == '_id')
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

			if(k == '_id')
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

	interpolatable(str)
	{
		return !!(String(str).match(this.interpolateRegex));
	}

	uuid() {
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
