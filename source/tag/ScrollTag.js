import { Tag      } from '../base/Tag';
import { Dom      } from '../base/Dom';
import { Bindable } from '../base/Bindable';

export class ScrollTag extends Tag
{
	constructor(element, parent, ref, index, direct)
	{
		super(element, parent, ref, index, direct);

		this.visible         = false;
		this.offsetTop       = false;
		this.offsetBottom    = false;

		this.attachListener = (e) => {
			let rootNode = e.target;

			while(rootNode.parentNode)
			{
				rootNode = rootNode.parentNode;
			}

			if(rootNode !== window && rootNode !== document)
			{
				return;
			}

			if(e.target !== element)
			{
				return;
			}

			this.addScrollListener(e.target);
			this.addResizeListener(e.target);

			this.scrolled(e.target);

			e.target.removeEventListener(
				'cvDomAttached'
				, this.attachListener
			);
		};

		this.element.addEventListener(
			'cvDomAttached'
			, this.attachListener
		);

		this.cleanup.push(((element) => () => {
			element.removeEventListener(
				'cvDomAttached'
				, this.attachListener
			);
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

		if(!current)
		{
			return;
		}

		let offsetTop         = 0
			, offsetBottom    = 0;

		let visible = false;

		let rect = current.getBoundingClientRect();

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

			tag.___scrollListener___ = (event) => {
				this.scrolled(event.target);
			};

			let node = tag;
			let options = {passive: true, capture: true};

			while(node.parentNode)
			{
				node = node.parentNode;

				node.addEventListener(
					'scroll'
					, tag.___scrollListener___
					, options
				);

				this.direct.cleanup.push(((node, tag, options)=>()=>{
					node.removeEventListener(
						'scroll'
						, tag.___scrollListener___
						, options
					);
					tag = node = null;
				})(node, tag, options));
			}
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

			tag.___resizeListener___ = (event)=>{
				this.scrolled(event.target);
			};

			window.addEventListener('resize', this.resizeListener);

			this.direct.cleanup.push(((element)=>()=>{
				window.removeEventListener('resize', element.___resizeListener___);
				tag.___resizeListener___ = null;
				tag = null;
			})(tag));
		}
	}
}
