import { Bindable } from './Bindable';
import { ViewList } from './ViewList';
import { Router   } from './Router';
import { Cookie   } from './Cookie';
import { Dom      } from './Dom';
import { Tag      } from './Tag';
import { RuleSet  } from './RuleSet';

export class View
{
	constructor(args = {})
	{
		Object.defineProperty(this, '___VIEW___', {
			enumerable: false,
			writable:    true
		});

		this.___VIEW___ = View;

		this.args      = Bindable.makeBindable(args);
		this._id       = this.uuid();
		this.args._id  = this._id;
		this.template  = ``;
		this.document  = ``;		

		this.firstNode = null;
		this.lastNode  = null;
		this.nodes     = null;

		this.cleanup   = [];

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
				clearInterval(this.timeouts[i].timeout);

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
		if(insertPoint instanceof View)
		{
			insertPoint = insertPoint.firstNode;
		}

		if(this.nodes)
		{
			for(let i in this.detach)
			{
				this.detach[i]();
			}

			for(let i in this.nodes)
			{
				let detachEvent = new Event('cvDomDetached', {bubbles: true, target: this.nodes[i]});
				let attachEvent = new Event('cvDomAttached', {bubbles: true, target: this.nodes[i]});

				this.nodes[i].dispatchEvent(detachEvent);

				Dom.mapTags(this.nodes[i], false, (node) => {
					node.dispatchEvent(detachEvent);
				});

				if(parentNode)
				{
					if(insertPoint)
					{
						parentNode.insertBefore(this.nodes[i], insertPoint);
					}
					else
					{
						parentNode.appendChild(this.nodes[i]);
					}
				}

				Dom.mapTags(this.nodes[i], false, (node) => {
					node.dispatchEvent(attachEvent);
				});

				this.nodes[i].dispatchEvent(attachEvent);
			}

			for(let i in this.attach)
			{
				this.attach[i]();
			}

			return;
		}

		let subDoc;

		if(this.template == document)
		{
			subDoc = this.template;
		}
		else if(this.document)
		{
			subDoc = this.document;
		}
		else
		{
			subDoc = document.createRange().createContextualFragment(this.template);

			this.document = subDoc;
		}

		this.preRuleSet.apply(subDoc, this);

		Dom.mapTags(subDoc, false, (tag)=>{
			if(tag.matches)
			{
				tag.matches('[cv-each]')
					&& this.mapEachTags(tag);

				tag.matches('[cv-with]')
					&& this.mapWithTags(tag);

				tag.matches('[cv-prerender]')
					&& this.mapPrendererTags(tag);

				tag.matches('[cv-link]')
					&& this.mapLinkTags(tag);

				tag.matches('[cv-bind]')
					&& this.mapBindTags(tag);

				tag.matches('[cv-attr]')
					&& this.mapAttrTags(tag);

				this.mapInterpolatableTags(tag);

				tag.matches('[cv-expand]')
					&& this.mapExpandableTags(tag);

				tag.matches('[cv-ref]')
					&& this.mapRefTags(tag);

				tag.matches('[cv-if]')
					&& this.mapIfTags(tag);

				tag.matches('[cv-on]')
					&& this.mapOnTags(tag);
			}
			else
			{
				this.mapInterpolatableTags(tag);
			}
		});

		this.ruleSet.apply(subDoc, this);

		this.nodes = [];

		this.firstNode = document.createComment(`Template ${this._id} Start`);
		// this.firstNode = document.createTextNode('');

		this.nodes.push(this.firstNode);

		if(parentNode)
		{
			if(insertPoint)
			{
				parentNode.insertBefore(this.firstNode, insertPoint);
			}
			else
			{
				parentNode.appendChild(this.firstNode);
			}
		}

		while(subDoc.firstChild)
		{
			let newNode = subDoc.firstChild;
			let attachEvent = new Event('cvDomAttached', {bubbles: true, target: newNode});

			this.nodes.push(newNode);

			if(parentNode)
			{
				if(insertPoint)
				{
					parentNode.insertBefore(newNode, insertPoint);
				}
				else
				{
					parentNode.appendChild(newNode);
				}
			}

			Dom.mapTags(newNode, false, (node) => {
				node.dispatchEvent(attachEvent);
			});

			newNode.dispatchEvent(attachEvent);
		}

		this.lastNode = document.createComment(`Template ${this._id} End`);
		// this.lastNode = document.createTextNode('');

		this.nodes.push(this.lastNode);

		if(parentNode)
		{
			if(insertPoint)
			{
				parentNode.insertBefore(this.lastNode, insertPoint);
			}
			else
			{
				parentNode.appendChild(this.lastNode);
			}
		}

		for(let i in this.attach)
		{
			this.attach[i]();
		}

		this.postRender(parentNode);

		// return this.nodes;
	}

	mapExpandableTags(tag)
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

			this.cleanup.push(()=>{
				debind();
				if(expandArg.isBound())
				{
					Bindable.clearBindings(expandArg);
				}
			});
		}
	}

	mapAttrTags(tag)
	{
		let attrProperty = tag.getAttribute('cv-attr');

		tag.removeAttribute('cv-attr');

		let pairs = attrProperty.split(',');
		let attrs = pairs.map((p) => p.split(':'));

		for (let i in attrs)
		{
			if(this.args[ attrs[i][1] ])
			{
				tag.setAttribute(
					attrs[i][0]
					, this.args[ attrs[i][1] ]
				);
			}

			this.cleanup.push(this.args.bindTo(
				attrs[i][1]
				, ((attr) => (v)=>{
					if(v == null)
					{
						tag.setAttribute(attr[0], '');
						return;
					}
					tag.setAttribute(attr[0], v);
				})(attrs[i])
			));
		}
	}

	mapInterpolatableTags(tag)
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

				let debind = proxy.bindTo(property, ((dynamicNode,unsafeHtml) => (v,k,t) => {
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

						this.cleanup.push(()=>{
							if(!v.preserve)
							{
								v.remove();
							}
						});
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
				})(dynamicNode,unsafeHtml));

				this.cleanup.push(()=>{
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

					let debind = proxy.bindTo(property, (v, k, t, d) => {
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
					});

					this.cleanup.push(()=>{
						debind();
						if(!proxy.isBound())
						{
							Bindable.clearBindings(proxy);
						}
					});
				}
			}
		}
	}

	mapRefTags(tag)
	{
		let refAttr                         = tag.getAttribute('cv-ref');
		let [refProp, refClassname, refKey] = refAttr.split(':');

		let refClass = this.stringToClass(refClassname);

		tag.removeAttribute('cv-ref');

		Object.defineProperty(tag, '___tag___', {
            enumerable: false,
            writable: true
        });

        this.cleanup.push(()=>{
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

		if(parent)
		{
			if(1 || !parent.parent)
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
			}
			parent = parent.parent;
		}
	}

	mapBindTags(tag)
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

			this.cleanup.push(
				this.args.bindTo(top, ()=>{
					while(this.subBindings.length)
					{
						console.log('HERE!');
						this.subBindings.shift()();
					}
				})
			);
		}

		let debind = proxy.bindTo(property, (v,k,t,d,p) => {

			if(p instanceof View && p !== v)
			{
				p.remove();
			}

			if(tag.tagName == 'INPUT'
				|| tag.tagName == 'SELECT'
				|| tag.tagName == 'TEXTAREA'
			) {
				let type = tag.getAttribute('type');
				if(type && type.toLowerCase() == 'checkbox') {
					tag.checked = !!v;
				}
				else if(type && type.toLowerCase() == 'radio') {
					tag.checked = (v == tag.value);
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
				}
				return;
			}

			if(v instanceof View)
			{
				v.render(tag);
			}
			else
			{
				tag.innerText = v;
			}
		}, {wait: 0});

		if(proxy !== this.args)
		{
			this.subBindings[bindArg].push(debind);
		}

		this.cleanup.push(debind);

		let inputListener = (event) => {
			if(event.target !== tag) {
				return;
			}

			let type = tag.getAttribute('type');
			if (type && type.toLowerCase() == 'checkbox') {
				if (tag.checked) {
					proxy[property] = event.target.value;
				}
				else {
					proxy[property] = false;
				}
			}
			else {
				proxy[property] = event.target.value;
			}
		};

		tag.addEventListener('input',         inputListener);
		tag.addEventListener('change',        inputListener);
		tag.addEventListener('value-changed', inputListener);

		this.cleanup.push( ((tag, eventListener) => ()=>{
			tag.removeEventListener('input',         inputListener);
			tag.removeEventListener('change',        inputListener);
			tag.removeEventListener('value-changed', inputListener);
			tag           = undefined;
			eventListener = undefined;
		})(tag, inputListener));

		tag.removeAttribute('cv-bind');
	}

	mapOnTags(tag)
	{
		let action = String(tag.getAttribute('cv-on'))
			.split(/;/)
			.map((a) => a.split(':'))
			.map(((object, tag) => (a) => {
				let eventName    = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
				let callbackName = a[1];
				let argList      = [];
				let groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);
				if(groups.length) {
					callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
					if(groups[2]) {
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

				let eventListener = ((object, parent, eventMethod, tag) => (event) => {
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
					if(!(typeof eventMethod == 'function')) {
						throw new Error(
							`${callbackName} is not defined on View object.

Tag:

${tag.outerHTML}`
						);
					}
					eventMethod(...argRefs);
				})(object, parent, eventMethod, tag);


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
						tag.addEventListener(eventName, eventListener);

						this.cleanup.push(()=>{
							tag.removeEventListener(eventName, eventListener);
						});
						break;
				}

				return [eventName, callbackName, argList];
			})(this, tag));

		tag.removeAttribute('cv-on');
	}

	mapLinkTags(tag)
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

		this.cleanup.push( ((tag, eventListener) => ()=>{
			tag.removeEventListener('click', eventListener);
			tag           = undefined;
			eventListener = undefined;
		})(tag, linkClick));

		tag.removeAttribute('cv-link');
	}

	mapPrendererTags(tag)
	{
		let prerenderAttr = tag.getAttribute('cv-prerender');
		let prerendering  = window.prerenderer;

		if(prerenderAttr == 'never' && prerendering
			|| prerenderAttr == 'only' && !prerendering
		){
			tag.parentNode.removeChild(tag);
		}
	}

	mapWithTags(tag)
	{
		let withAttr = tag.getAttribute('cv-with');
		let carryAttr = tag.getAttribute('cv-carry');
		tag.removeAttribute('cv-with');
		tag.removeAttribute('cv-carry');

		let subTemplate = tag.innerHTML;

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

			this.cleanup.push(((view)=>()=>{
				view.remove();
			})(view));

			view.template = subTemplate;
			view.parent   = this;

			for(let i in carryProps)
			{
				let debind = this.args.bindTo(carryProps[i], (v, k) => {
					view.args[k] = v;
				});

				view.cleanup.push(debind);
				this.cleanup.push(()=>{
					debind();
					view.remove();
				});
			}

			for(let i in v)
			{
				let debind = v.bindTo(i, (v, k) => {
					view.args[k] = v;
				});

				this.cleanup.push(()=>{
					debind();
					if(!v.isBound())
					{
						Bindable.clearBindings(v);
					}
					view.remove();
				});

				view.cleanup.push(()=>{
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

		this.cleanup.push(debind);
	}

	mapEachTags(tag)
	{
		let eachAttr = tag.getAttribute('cv-each');
		let carryAttr = tag.getAttribute('cv-carry');
		tag.removeAttribute('cv-each');
		tag.removeAttribute('cv-carry');

		let subTemplate = tag.innerHTML;

		while(tag.firstChild)
		{
			tag.removeChild(tag.firstChild);
		}

		let carryProps = [];

		if(carryAttr)
		{
			carryProps = carryAttr.split(',');
		}

		let [eachProp, asProp, keyProp] = eachAttr.split(':');

		let debind = this.args.bindTo(eachProp, (v,k,t,d,p)=>{
			if(this.viewLists[eachProp])
			{
				this.viewLists[eachProp].remove();
			}

			let viewList = new ViewList(subTemplate, asProp, v, this, keyProp);

			this.cleanup.push(()=>{
				viewList.remove();
			});

			for(let i in carryProps)
			{
				let _debind = this.args.bindTo(carryProps[i], (v, k) => {
					viewList.args.subArgs[k] = v;
				});

				viewList.cleanup.push(_debind);

				this.cleanup.push(()=>{
					_debind();

					if(v && !v.isBound())
					{
						Bindable.clearBindings(v);
					}
				});
			}

			while(tag.firstChild)
			{
				tag.removeChild(tag.firstChild);
			}

			this.viewLists[eachProp] = viewList;

			viewList.render(tag);
		},{wait :0});

		this.cleanup.push(()=>{
			debind();
		});
	}

	mapIfTags(tag)
	{
		let ifProperty = tag.getAttribute('cv-if');
		
		tag.removeAttribute('cv-if');

		let subTemplate = tag.innerHTML;
		
		let inverted = false;

		if(ifProperty.substr(0, 1) === '!')
		{
			inverted   = true;
			ifProperty = ifProperty.substr(1);
		}

		while(tag.firstChild)
		{
			tag.removeChild(tag.firstChild);
		}

		let ifDoc = document.createRange().createContextualFragment('');

		let view = new View();

		view.template = subTemplate;
		view.parent   = this;

		view.render(tag);

		let debindA = this.args.bindTo((v,k,t,d)=>{
			if(k == '_id')
			{
				return;
			}

			if(view.args[k] !== v)
			{
				view.args[k] = v;
			}
		});

		for(let i in this.args)
		{
			if(i == '_id')
			{
				continue;
			}

			view.args[i] = this.args[i];
		}

		let debindB = view.args.bindTo((v,k,t,d)=>{
			if(k == '_id')
			{
				return;
			}

			let newRef = v;
			let oldRef = t[k];

			if(v instanceof View)
			{
				newRef = v.___ref___;
			}

			if(t[k] instanceof View)
			{
				oldRef = t[k].___ref___;
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

		let cleaner = this;

		while(cleaner.parent)
		{
			cleaner = cleaner.parent;
		}

		this.cleanup.push(()=>{
			debindA();
			debindB();
			// view.remove();
		});

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

		let debind = proxy.bindTo(
			property
			, (v,k) => {
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
					view.render(tag);
				}
				else
				{
					while(tag.firstChild)
					{
						tag.firstChild.remove();
					}
					view.render(ifDoc);
				}
			}
		);

		this.cleanup.push(()=>{
			debind();
			if(!proxy.isBound())
			{
				Bindable.clearBindings(proxy);
			}
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
	remove()
	{
		let detachEvent = new Event('cvDomDetached');

		for(let i in this.tags)
		{
			if(Array.isArray(this.tags[i]))
			{
				for(var j in this.tags[i])
				{
					this.tags[i][j].remove();
				}
				continue;
			}
			this.tags[i].remove();
		}

		for(let i in this.nodes)
		{
			this.nodes[i].dispatchEvent(detachEvent);
			this.nodes[i].remove();
		}

		let cleanup;

		while(cleanup = this.cleanup.shift())
		{
			cleanup();
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

		// Bindable.clearBindings(this.args);
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
		let refClassSplit           = refClassname.split('/');
		let refShortClassname       = refClassSplit[ refClassSplit.length - 1 ];
		let refClass                = require(refClassname);

		return refClass[refShortClassname];
	}
}
