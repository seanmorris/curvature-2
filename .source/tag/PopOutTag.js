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
		this.topDuration   = 0;
		this.unpoppedStyle  = '';
		this.previousScroll = 0;

		this.bodyStyle  = '';
		this.bodyScroll = 0;

		this.element.classList.add('unpopped');

		this.scrollStyle;

		this.popTimeout = null;

		// this.element.addEventListener('cvDomDetached', this.detachListener);

		this.rect;
		this.clickListener  = (event) => {
			let leftDuration = 0.333;
			let topDuration  = 0.333;

			if(!this.rect)
			{
				this.rect = this.element.getBoundingClientRect();
			}
			
			if(!this.poppedOut)
			{
				this.distance = Math.sqrt(
					this.rect.top ** 2
					+ this.rect.left ** 2
				);

				if(!this.distance)
				{
					this.distance = 200;
				}

				if(!this.leftDuration)
				{
					this.leftDuration = (1 - (1 / this.rect.left)) / 4;
					this.topDuration = (1 - (1 / this.rect.top)) / 4;

					this.leftDuration = Math.round(this.leftDuration * 1000) / 1000;
					this.topDuration = Math.round(this.topDuration * 1000) / 1000;
				}
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
			// window.scrollTo(0, this.bodyScroll);
		}
	}

	pop()
	{
		PopOutTag.popLevel();

		if(!this.rect)
		{
			this.rect = this.element.getBoundingClientRect();
		}

		this.previousScroll = window.scrollY;

		this.unpoppedStyle = `
			;position:  fixed;
			left:       ${this.rect.x}px;
			top:        ${this.rect.y}px;
			width:      ${this.rect.width}px;
			height:     ${this.rect.height}px;
			z-index:    99999;
			transition: width ${this.leftDuration}s ease-out
						, height ${this.topDuration}s ease-out
						, all ${this.leftDuration}s ease-out;
			overflow: hidden;
		`;

		this.style = this.element.getAttribute('style');

		let style = this.style + this.unpoppedStyle;

		this.element.setAttribute('style', style);

		// document.body.style.overflow = 'hidden';
		// document.body.style.overflowY = 'hidden';

		this.popTimeout = setTimeout(()=>{
			style += `
				;top:   0px;
				left:   0px;
				width:  100%;
				height: 100%;
				overflow-y: auto;
				transition: width ${this.leftDuration}s ease-out
					, height ${this.topDuration}s ease-out
					, all ${this.leftDuration}s ease-out;
			`;

			this.moving = true;

			this.element.classList.add('popped');
			this.element.classList.remove('unpopped');
			this.element.setAttribute('style', style);

			this.popTimeout = setTimeout(()=>{
				if(!this.element)
				{
					return;
				}
				this.bodyStyle = document.body.getAttribute('style');
				// this.bodyScroll = window.scrollY;
				document.body.setAttribute('style', 'height:100%;overflow:hidden;');
				// window.scrollTo(0,0);
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

			}, this.leftDuration*1000);
		}, 1);

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
			+ `;transition: width ${this.leftDuration}s ease-out
					, height ${this.topDuration}s ease-out
					, all ${this.leftDuration}s ease-out;`;


		// window.scrollTo(0, this.bodyScroll);

		this.element.setAttribute('style', style);

		this.moving = true;

		setTimeout(()=>{
			if(!this.element)
			{
				return;
			}
			this.element.classList.remove('popped');
			// element.setAttribute('style', this.style);
		}, this.leftDuration*500);
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
		}, this.leftDuration*1000);

		this.poppedOut = false;
	}

	remove()
	{
		document.body.setAttribute('style', this.bodyStyle);
		super.remove();
	}
}
