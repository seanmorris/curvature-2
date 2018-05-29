import { Tag      } from '../base/Tag';
import { Dom      } from '../base/Dom';
import { Bindable } from '../base/Bindable';

export class ScrollTag extends Tag
{
	constructor(element, parent, ref, index)
	{
		super(element, parent, ref, index);

		this.visible         = false;
		this.offsetTop       = false;
		this.offsetBottom    = false;

		this.scrollListener = (event) => {
			this.scrolled(event.target);
		};

		this.resizeListener = (event)=>{
			this.scrolled(event.target);
		};

		this.attachListener = (e) => {
			if(e.path[e.path.length-1]!==window)
			{
				return;
			}

			if(e.target !== element)
			{
				return;
			}

			// let current = Bindable.makeBindable(e.target);

			this.addScrollListener(e.target);
			this.addResizeListener(e.target);

			this.scrolled(e.target);

			e.target.removeEventListener('cvDomAttached', this.attachListener);
		};

		this.element.addEventListener('cvDomAttached', this.attachListener);

		this.cleanup.push(((element) => () => {
			element.removeEventListener('cvDomAttached', this.attachListener);
		})(this.element));

		this.bindTo('visible', (v) => {
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
		if(!tag.___scrollListener___)
		{
			Object.defineProperty(tag, '___scrollListener___', {
				enumerable: false
				, writable: true
			});

			tag.___scrollListener___ = this.scrollListener;

			window.addEventListener('scroll', this.scrollListener);

			this.cleanup.push(((element)=>()=>{
				console.log('Cleaning!');
				window.removeEventListener('scroll', element.___scrollListener___);
			})(tag));
		}
	}

	addResizeListener(tag)
	{
		if(!tag.___resizeListener___)
		{
			Object.defineProperty(tag, '___resizeListener___', {
				enumerable: false
				, writable: true
			});

			window.addEventListener('resize', this.resizeListener);

			this.cleanup.push(((element)=>()=>{
				window.removeEventListener('resize', element.___resizeListener___);
			})(tag));

			tag.___resizeListener___ = this.resizeListener;
		}
	}
}
