import { Bindable } from './Bindable';
import { ViewList } from './ViewList';
import { Router   } from './Router';
import { Cookie   } from './Cookie';
import { Dom      } from './Dom';
import { Tag      } from './Tag';

export class View
{
	constructor(args = {})
	{
		this.args      = Bindable.makeBindable(args);
		this._id       = this.uuid();
		this.args._id  = this._id;
		this.template  = ``;
		this.parent    = null;

		this.firstNode = null;
		this.lastNode  = null;
		this.nodes     = null;

		this.frames    = [];
		this.timeouts  = [];
		this.intervals = [];

		this.cleanup   = [];

		this.attach    = [];
		this.detach    = [];

		this.eventCleanup = [];

		this.parent    = null;
		this.viewList  = null;
		this.viewLists = {};

		this.tags      = {};

		this.intervals = [];
		this.timeouts  = [];
		this.frames    = [];
		this.interpolateRegex = /(\[\[((?:\$)?\w+)\]\])/g
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
		else
		{
			subDoc = document.createRange().createContextualFragment(this.template);
		}

		// Dom.mapTags(subDoc, '[cv-ref]', (tag)=>{
		// 	this.mapRefTags(tag)
		// });

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

		this.nodes = [];

		this.firstNode = document.createComment(`Template ${this._id} Start`);

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

			this.nodes.push(subDoc.firstChild);

			if(parentNode)
			{
				if(insertPoint)
				{
					parentNode.insertBefore(subDoc.firstChild, insertPoint);
				}
				else
				{
					parentNode.appendChild(subDoc.firstChild);
				}
			}

			Dom.mapTags(newNode, false, (node) => {
				node.dispatchEvent(attachEvent);
			});

			newNode.dispatchEvent(attachEvent);
		}

		this.lastNode = document.createComment(`Template ${this._id} End`);

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

			expandArg.bindTo(i, ((tag,i)=>(v)=>{
				tag.setAttribute(i, v);
			})(tag,i));
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

				tag.parentNode.insertBefore(dynamicNode, tag);

				this.args.bindTo(bindProperty, ((dynamicNode,unsafeHtml) => (v,k,t) => {
					// console.log(`Setting ${k} to ${v}`, dynamicNode);
					if(t[k] instanceof View)
					{
						t[k].remove();
					}

					dynamicNode.nodeValue = '';

					if(v instanceof View)
					{

						v.render(tag.parentNode, dynamicNode);
					}
					else
					{
						// console.log(dynamicNode);
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
					this.args.bindTo(j, (v, k, t, d) => {
						for(let i in bindProperties)
						{
							for(let j in bindProperties[i])
							{
								segments[ bindProperties[i][j] ] = t[i];

								if(k === i)
								{
									segments[ bindProperties[i][j] ] = v;
								}
							}
						}
						tag.setAttribute(attribute.name, segments.join(''));
					});
				}

				// console.log(bindProperties, segments);

				// console.log(tag.attributes[i].name, tag.attributes[i].value);
			}
		}
	}

	mapRefTags(tag)
	{
		let refAttr                         = tag.getAttribute('cv-ref');
		let [refProp, refClassname, refKey] = refAttr.split(':');

		let refClass = this.stringToClass(refClassname);

		tag.removeAttribute('cv-ref');

		let parent = this;

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

		while(parent)
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

					parent.tags[refProp][refKeyVal] = new refClass(
						tag, this, refProp
					);
				}
				else
				{
					parent.tags[refProp] = new refClass(
						tag, this, refProp
					);
				}
			}
			parent = parent.parent;
		}
	}

	mapBindTags(tag)
	{
		let bindArg = tag.getAttribute('cv-bind');
		this.args.bindTo(bindArg, (v,k,t) => {
			if(t[k] === v)
			{
				// return;
			}

			if(t[k] instanceof View)
			{
				t[k].remove();
			}


			if(tag.tagName == 'INPUT' || tag.tagName == 'SELECT') {
				let type = tag.getAttribute('type');
				if(type && type.toLowerCase() == 'checkbox') {
					if(v) {
						tag.checked = true;
					}
					else {
						tag.checked = false;
					}
				}
				else if(type !== 'file') {
					tag.value = v || '';
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
		});

		let inputListener = (event) => {
			if(event.target.getAttribute('type') !== 'password')
			{
				// console.log(event.target.value);
			}

			if(event.target !== tag) {
				return;
			}

			// console.log(event.target.value);

			this.args[bindArg] = event.target.value;
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
				var eventName    = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
				var callbackName = a[1];
				var argList      = [];
				var groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);
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
						eventMethod = (...args) => {
							parent[ callbackName ](...args);
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

				let eventListener = ((object, parent, eventMethod) => (event) => {
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
						else if(arg === '$parent') {
							return object.parent;
						}
						else if(arg === '$subview') {
							return object;
						}
						else if(arg in object.args) {
							return object.args[arg];
						}
						else if(match = /^['"](\w+?)["']$/.exec(arg))
						{
							return match[1];
						}
					});
					// console.log(argList, argRefs);
					if(!(typeof eventMethod == 'function')) {
						// console.log(object);
						// console.trace();
						console.log(this, parent);
						throw new Error(
							`${callbackName} is not defined on View object.

Tag:

${tag.outerHTML}`
						);
					}
					eventMethod(...argRefs);
				})(object, parent, eventMethod);


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

						this.cleanup.push(
							((tag, eventName, eventListener) => ()=>{
								tag.removeEventListener(eventName, eventListener);
								tag           = undefined;
								eventListener = undefined;
							}
						)(tag, eventName, eventListener));
						break;
				}

				return [eventName, callbackName, argList];
			})(this, tag));

		tag.removeAttribute('cv-on');
	}

	mapLinkTags(tag)
	{
		let LinkAttr = tag.getAttribute('cv-link');

		tag.setAttribute('href', LinkAttr);

		let linkClick = (event) => {
			event.preventDefault();

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
		let prerendering  = Cookie.get('prerenderer');

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

		// console.log(carryProps);

		for(let i in carryProps)
		{
			this.args.bindTo(carryProps[i], ((view) => (v, k) => {
				view.args[k] = v;
			})(view));
		}

		for(let i in this.args[withAttr])
		{
			this.args[withAttr].bindTo(i, ((view) => (v, k) => {
				view.args[k] = v;
			})(view));
		}

		view.render(tag);
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

		// console.log(this, eachProp);

		let viewList;

		this.args.bindTo(eachProp, ((viewList) => (v, k, t)=>{
			if(viewList)
			{
				viewList.remove();
			}

			viewList = new ViewList(subTemplate, asProp, v, keyProp);

			viewList.parent = this;

			viewList.render(tag);

			for(let i in carryProps)
			{
				this.args.bindTo(carryProps[i], (v, k) => {
					viewList.args.subArgs[k] = v;
				});
			}
		})(viewList));

		this.viewLists[eachProp] = viewList;
	}
	
	mapIfTags(tag)
	{
		let ifProperty = tag.getAttribute('cv-if');

		let inverted = false;

		if(ifProperty.substr(0, 1) === '!')
		{
			inverted   = true;
			ifProperty = ifProperty.substr(1);
		}

		let subTemplate = tag.innerHTML;

		while(tag.firstChild)
		{
			tag.removeChild(tag.firstChild);
		}

		let ifDoc = document.createRange().createContextualFragment('');

		let view = new View();

		view.args = this.args;

		this.cleanup.push(((view)=>()=>{
			view.remove();
		})(view));

		view.template = subTemplate;
		view.parent   = this;

		view.render(tag);

		this.args.bindTo(
			ifProperty
			, ((tag, ifDoc) => (v) => {
				let detachEvent = new Event('cvDomDetached');
				let attachEvent = new Event('cvDomAttached');

				if(inverted)
				{
					v = !v;
				}

				if(v)
				{
					while(ifDoc.firstChild)
					{
						let moveTag = ifDoc.firstChild;

						tag.prepend(moveTag);

						moveTag.dispatchEvent(attachEvent);

						Dom.mapTags(moveTag, false, (node) => {
							node.dispatchEvent(attachEvent);
						});
					}
				}
				else
				{
					while(tag.firstChild)
					{
						let moveTag = tag.firstChild;

						ifDoc.prepend(moveTag);

						moveTag.dispatchEvent(detachEvent);

						Dom.mapTags(moveTag, false, (node) => {
							node.dispatchEvent(detachEvent);
						});
					}
				}
			})(tag, ifDoc)
		);

		tag.removeAttribute('cv-if');
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

		for(let i in this.viewLists)
		{
			if(!this.viewLists[i])
			{
				continue;
			}
			this.viewLists[i].remove();
		}

		this.viewLists = [];

		Bindable.clearBindings(this);
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
