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

			this.scrolled(tag);
		};

		this.resizeListener = (event)=>{
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
			
			console.log(e.target);

			let current = Bindable.makeBindable(e.target);

			this.addScrollListener(current);

			this.scrolled(current);

			this.element.removeEventListener('cvDomAttached', this.attachListener);
		};

		this.element.addEventListener('cvDomAttached', this.attachListener);

		this.cleanup.push(((element)=>()=>{
			
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
			, offsetBottom    = 0;

		let visible = false;

		let rect = this.element.getBoundingClientRect();

		if(rect.bottom > 0 && rect.top < window.innerHeight)
		{
			visible = true;
		}

		this.proxy.visible      = visible;
		this.proxy.offsetTop    = rect.top    || 0;
		this.proxy.offsetBottom = rect.bottom || 0;
	}
	addScrollListener(tag)
	{
		if(!tag.scrollListener)
		{
			Object.defineProperty(tag, 'scrollListener', {
				enumerable: false
				, writable: true
			});

			tag.scrollListener = true;

			window.addEventListener('scroll', this.scrollListener);

			this.cleanup.push(((element)=>()=>{
				window.removeEventListener('scroll', this.scrollListener);
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
