import { Bindable } from '../base/Bindable';
import { Dom      } from '../base/Dom';
import { Tag      } from '../base/Tag';

export class PopOutTag extends Tag
{
	constructor(element, parent, ref, index, direct)
	{
		super(element, parent, ref, index, direct);

		this.poppedOut = false;
		this.style     = element.getAttribute('style');
		this.moving    = false;

		this.leftDuration   = 0;
		this.topDuration    = 0;
		this.rightDuration  = 0;
		this.bottomDuration = 0;

		this.verticalDuration   = 0;
		this.horizontalDuration = 0;

		this.unpoppedStyle  = '';
		this.previousScroll = 0;

		this.bodyStyle  = '';
		this.bodyScroll = 0;

		this.element.classList.add('unpopped');

		this.scrollStyle;

		this.popTimeout = null;

		// this.element.addEventListener('cvDomDetached', this.detachListener);
		this.rect;

		this.clickListener = (event) => {
			this.rect = this.element.getBoundingClientRect();
			
			if(!this.poppedOut)
			{
				this.distance = Math.sqrt(
					this.rect.top ** 2
					+ this.rect.left ** 2
				);

				const cut = 1750;

				let fromRight  = window.innerWidth  - this.rect.right;
				let fromBottom = window.innerHeight - this.rect.bottom;

				let horizontalAverage = (this.rect.left + fromRight)  / 2;
				let vericalAverage    = (this.rect.top  + fromBottom) / 2;

				this.horizontalDuration = horizontalAverage / cut;
				this.verticalDuration   = vericalAverage / cut;

				if(this.horizontalDuration < 0.1)
				{
					this.horizontalDuration = 0.2;
				}
				if(this.verticalDuration < 0.1)
				{
					this.verticalDuration = 0.2;
				}

				if(this.horizontalDuration > 0.4)
				{
					this.horizontalDuration = 0.4;
				}
				if(this.verticalDuration > 0.4)
				{
					this.verticalDuration = 0.4;
				}

				console.log(this.horizontalDuration, this.verticalDuration);
			}

			if(!this.element.contains(event.target))
			{
				return;
			}

			event.stopPropagation();
			event.preventDefault();

			if(this.moving)
			{
				return;
			}

			if(!this.poppedOut)
			{
				this.pop();
			}
			else if(event.target.matches('.closeButton') && this.poppedOut)
			{
				this.unpop();
			}
		};

		if(!this.element.___clickListener___)
		{
			Object.defineProperty(this.element, '___scrollListeners___', {
				enumerable: false
				, writable: true
			});

			this.element.___clickListener___ = this.clickListener;

			this.element.addEventListener('click',  element.___clickListener___);

			this.cleanup.push(((element)=>()=>{
				element.removeEventListener('click',  element.___clickListener___);
			})(element));
		}
	}

	static popLevel()
	{
		if(!this.level)
		{
			this.level = 0;
		}

		this.level++;

		return this.level;
	}

	static unpopLevel()
	{
		if(!this.level)
		{
			this.level = 0;
		}

		this.level--;

		if(this.level < 0)
		{
			this.level = 0;
		}

		return this.level;
	}

	pause(paused = true)
	{
		super.pause(paused);

		if(paused)
		{
			document.body.setAttribute('style', this.bodyStyle);
			document.body.setAttribute('style', '');
		}
	}

	pop()
	{
		PopOutTag.popLevel();

		this.previousScroll = window.scrollY;

		this.rect = this.element.getBoundingClientRect();

		this.unpoppedStyle = `
			;position:  fixed;
			left:       ${this.rect.x}px;
			top:        ${this.rect.y}px;
			width:      ${this.rect.width}px;
			height:     ${this.rect.height}px;
			z-index:    99999;
			transition: width ${this.horizontalDuration}s  ease-out
						, top ${this.verticalDuration}s    ease-out
						, left ${this.horizontalDuration}s ease-out
						, height ${this.verticalDuration}s ease-out
						, all ${this.horizontalDuration}s  ease-out;
			overflow: hidden;
		`;

		let style = this.style + this.unpoppedStyle;

		this.element.setAttribute('style', style);

		this.popTimeout = setTimeout(()=>{
			style += `
				;top:   0px;
				left:   0px;
				width:  100%;
				height: 100%;
				overflow-y: auto;
				transition: width ${this.horizontalDuration}s ease-out
					, top ${this.verticalDuration}s           ease-out
					, left ${this.horizontalDuration}s        ease-out
					, height ${this.verticalDuration}s        ease-out
					, all ${this.horizontalDuration}s         ease-out;
			`;

			this.moving = true;

			this.element.setAttribute('style', style);
			this.element.classList.add('popped');
			this.element.classList.remove('unpopped');
			
			this.popTimeout = setTimeout(()=>{
				if(!this.element)
				{
					return;
				}
				this.bodyStyle = document.body.getAttribute('style');
				
				document.body.setAttribute('style', 'height:100%;overflow:hidden;');
				
				this.moving = false;
				Dom.mapTags(this.element, false, (tag)=>{
					let event = new CustomEvent('cvPopped');

					tag.dispatchEvent(event);

					this.scrollStyle = this.element.getAttribute('style');
				});
				let event = new CustomEvent('cvPop', {
					bubbles: true
					, detail: {
						tag: this
						, view: this.parent
						, publicId: this.parent.args.publicId
					}
				});
				this.element.dispatchEvent(event);

			}, this.horizontalDuration*1000);
		}, 5);

		this.poppedOut = true;
	}

	unpop()
	{
		this.element.classList.add('unpopping');

		if(this.popTimeout)
		{
			clearTimeout(this.popTimeout);
		}

		if(PopOutTag.level == 0)
		{
			document.body.setAttribute('style', '');
		}
		else
		{
			document.body.setAttribute('style', this.bodyStyle || '');
		}

		PopOutTag.unpopLevel();

		if(!this.rect)
		{
			this.rect = this.element.getBoundingClientRect();
		}

		window.scrollTo(0,this.previousScroll);

		let style = this.style
			+ this.unpoppedStyle
			+ `;transition: width ${this.horizontalDuration}s ease-in
					, height ${this.verticalDuration}s        ease-in
					, all ${this.horizontalDuration}s         ease-in;`;

		this.element.setAttribute('style', style);

		this.moving = true;

		setTimeout(()=>{
			if(!this.element)
			{
				return;
			}
			this.element.classList.remove('popped');

		}, this.horizontalDuration*1000);
		setTimeout(()=>{
			this.element.classList.add('unpopped');
			this.element.classList.remove('unpopping');
			if(!this.element)
			{
				return;
			}
			this.element.setAttribute('style', this.style);
			this.moving = false;
			Dom.mapTags(this.element, false, (tag)=>{
				let event = new CustomEvent('cvUnpopped');

				tag.dispatchEvent(event);
			});
			let event = new CustomEvent('cvUnpop', {
				bubbles: true
				, detail: {
					tag: this
					, view: this.parent
					, publicId: this.parent.args.publicId
				}
			});
			this.element.dispatchEvent(event);
		}, this.horizontalDuration*1000);

		this.poppedOut = false;
	}

	remove()
	{
		document.body.setAttribute('style', this.bodyStyle);
		super.remove();
	}
}
