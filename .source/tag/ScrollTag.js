import { Tag      } from '../base/Tag';
import { Dom      } from '../base/Dom';
import { Bindable } from '../base/Bindable';

export class ScrollTag extends Tag
{
	constructor(element, parent, ref, index)
	{
		super(element, parent, ref, index);

		this.topEdge         = false;
		this.resizeListening = false;
		this.visible         = false;
		this.offsetTop       = false;
		this.offsetBottom    = false;

		this.threshold       = 0;

		this.subscribedTo    = [];

		this.scrollListener = (event) => {
			let tag = event.target;
			for(let i in tag.scrollSubTags)
			{
				tag.scrollSubTags[i].scrolled(tag);
			}
		};

		this.resizeListenr = (event)=>{
			for(let i in this.resizeTags)
			{
				this.resizeTags[i].scrolled(event.target);
			}
		};

		this.attachListener = (e) => {
			if(e.path[e.path.length-1]!==window)
			{
				return;
			}
			let current = e.target;
			while(current)
			{
				current = Bindable.makeBindable(current);

				this.addScrollListener(current);

				this.scrolled(current);

				current = current.parentNode;
			}
		};

		this.element.addEventListener('cvDomAttached', this.attachListener);

		this.cleanup.push(((element)=>()=>{
			element.removeEventListener('cvDomAttached', this.attachListener);
		})(this.element));

		ScrollTag.addResizeListener(this);

		this.bindTo('visible', (v)=>{
			let scrolledEvent;
			if(v)
			{
				scrolledEvent = new Event('cvScrolledIn');
			}
			else
			{
				scrolledEvent = new Event('cvScrolledOut');
			}

			Dom.mapTags(this.element, false, (node) => {
				node.dispatchEvent(scrolledEvent);
			});

			this.element.dispatchEvent(scrolledEvent);
		});

		this.bindTo('offsetTop', (v) => {
			let scrolledEvent = new CustomEvent('cvScrolled', {
				detail: {offset: v}
			});
			Dom.mapTags(this.element, false, (node) => {
				node.dispatchEvent(scrolledEvent);
			});

			this.element.dispatchEvent(scrolledEvent);
		});
	}
	scrolled(scroller)
	{
		let current = this.element;

		let offsetTop         = 0
			, subOffsetTop    = 0
			, offsetBottom    = 0
			, subOffsetBottom = 0;

		while(current)
		{
			if(offsetTop - current.scrollTop < subOffsetTop
			){
				subOffsetTop = offsetTop - current.scrollTop;
			}

			if(current.offsetTop)
			{
				offsetTop += current.offsetTop;
			}

			if(typeof current.scrollTop !== 'undefined')
			{
				offsetTop -= current.scrollTop;
				offsetBottom = offsetTop + this.element.clientHeight - current.clientHeight;
			}

			if(current.parentNode
				&& current.parentNode.offsetTop
				&& current.parentNode !== current.offsetParent
			){
				offsetTop -= current.parentNode.offsetTop;
			}

			if(offsetBottom > subOffsetBottom)
			{
				subOffsetBottom = offsetBottom;
			}

			current = current.parentNode;
		}

		if(offsetTop < -this.threshold || subOffsetTop < -this.threshold)
		{
			this.topEdge = false;
		}
		else
		{
			this.topEdge = true;

			if(offsetBottom - this.element.clientHeight > this.threshold)
			{
				this.topEdge = false;
			}
		}

		this.bottomEdge = false;

		if(offsetBottom <= this.threshold)
		{
			this.bottomEdge = true;

			if(offsetTop + this.element.clientHeight < -this.threshold)
			{
				this.bottomEdge = false;
			}
		}

		// this.offsetTop    = offsetTop;
		// this.offsetBottom = this.offsetBottom

		let visible = false;

		if(offsetBottom <=this.element.clientHeight && offsetTop > -this.element.clientHeight)
		{
			visible = true;
		}

		this.proxy.visible      = visible;
		this.proxy.offsetTop    = offsetTop;
		this.proxy.offsetBottom = offsetBottom;
	}
	addScrollListener(tag)
	{
		if(!tag.scrollListener)
		{
			Object.defineProperty(tag, 'scrollListener', {
				enumerable: false
				, writable: true
			});

			Object.defineProperty(tag, 'scrollSubTags', {
				enumerable: false
				, writable: true
			});

			tag.scrollListener = true;
			tag.scrollSubTags  = [];

			tag.addEventListener('scroll', this.scrollListener);

			this.cleanup.push(((element)=>()=>{
				element.removeEventListener('scroll', this.scrollListener);
				element.scrollSubTags = undefined;
			})(tag));
		}

		for(let i in this.subscribedTo)
		{
			if(this.subscribedTo[i] === tag)
			{
				return;
			}
		}

		if(tag.scrollSubTags)
		{
			tag.scrollSubTags.push(this);
		}
	}
	static addResizeListener(tag)
	{
		this.resizeTags = [];

		if(!this.resizeListener)
		{
			// window.addEventListener('resize', this.resizeListener);

			// this.cleanup.push(()=>{
			// 	window.removeEventListener('resize', this.resizeListener);
			// });
		}

		this.resizeListener = true;

		this.resizeTags.push(tag);
	}
}
