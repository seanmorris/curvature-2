import { Bindable } from '../base/Bindable';
import { Dom      } from '../base/Dom';
import { Tag      } from '../base/Tag';

export class PopOutTag extends Tag
{
	constructor(element, parent, ref, index, direct)
	{
		super(element, parent, ref, index, direct);

		this.poppedOut = false;
		this.style     = element.getAttribute('style') || '';
		this.moving    = false;

		this.hostSelector = element.getAttribute('cv-pop-to');
		this.popMargin = element.getAttribute('cv-pop-margin') || 0;
		this.popSpeed = element.getAttribute('data-pop-speed') || 1750;

		element.removeAttribute('cv-pop-to');
		element.removeAttribute('cv-pop-margin');
		element.removeAttribute('data-pop-speed');

		this.verticalDuration   = 0.4;
		this.horizontalDuration = 0.1;

		this.unpoppedStyle  = '';
		this.previousScroll = 0;

		this.bodyStyle  = '';
		this.bodyScroll = 0;

		this.element.classList.add('unpopped');

		this.scrollStyle = '';

		this.style = '';

		this.popTimeout = null;

		// this.element.addEventListener('cvDomDetached', this.detachListener);
		this.rect = null;
		this.transformRect = null;

		this.clickListener = (event) => {
			this.rect = this.element.getBoundingClientRect();

			if(!this.poppedOut)
			{
				this.distance = Math.sqrt(
					this.rect.top ** 2
					+ this.rect.left ** 2
				);

				const cut = this.popSpeed;

				let fromRight  = window.innerWidth  - this.rect.right;
				let fromBottom = window.innerHeight - this.rect.bottom;

				let horizontalAverage = (this.rect.left + fromRight)  / 2;
				let vericalAverage    = (this.rect.top  + fromBottom) / 2;

				this.horizontalDuration = horizontalAverage / cut;
				this.verticalDuration   = vericalAverage / cut;

				if(this.horizontalDuration < 0.1)
				{
					this.horizontalDuration = 0.1;
				}
				if(this.verticalDuration < 0.1)
				{
					this.verticalDuration = 0.1;
				}

				if(this.horizontalDuration > 0.4)
				{
					this.horizontalDuration = 0.4;
				}
				if(this.verticalDuration > 0.4)
				{
					this.verticalDuration = 0.4;
				}

				// console.log(this.horizontalDuration, this.verticalDuration);
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


		this.escapeListener = (event) => {
			if(!this.poppedOut)
			{
				return;
			}

			if(event.key !== 'Escape')
			{
				return;
			}
			this.unpop();
		};

		this.resizeListener = (event) => {
			if(!this.poppedOut)
			{
				return;
			}

			let hostTag  = this.element;

			while(hostTag.parentNode && !hostTag.matches(this.hostSelector))
			{
				if(hostTag.parentNode == document)
				{
					break;
				}

				hostTag = hostTag.parentNode;
			}

			let hostRect = hostTag.getBoundingClientRect();

			let style = this.style + this.unpoppedStyle;

			let x = hostRect.x;
			let y = hostRect.y  + document.documentElement.scrollTop;
			let w = hostRect.width;
			let h = hostRect.height;

			if(this.transformRect)
			{
				x -= this.transformRect.x;
				y -= this.transformRect.y;
			}

			x + this.popMargin;
			y + this.popMargin;
			w + this.popMargin * 2;
			h + this.popMargin * 2;

			style += `;
				z-index:    99999;
				transition-duration: 0s;
				overflow: hidden;
				position:  fixed;
				left:      ${x}px;
				top:        ${y}px;
				width:      ${w}px;
				height:     ${h}px;
				overflow-y: auto;
				transition-duration: 0s;
			`;

			this.element.setAttribute('style', style);
		};

		if(!this.element.___clickListener___)
		{
			Object.defineProperty(this.element, '___scrollListeners___', {
				enumerable: false
				, writable: true
			});

			element.___clickListener___ = this.clickListener;
			element.___escapeListener___ = this.escapeListener;
			element.___resizeListener___ = this.resizeListener;

			this.element.addEventListener('click',  element.___clickListener___);

			window.addEventListener('keyup',  element.___escapeListener___);
			window.addEventListener('resize', element.___resizeListener___);

			this.cleanup.push(((element)=>()=>{
				element.removeEventListener('click', element.___clickListener___);
				window.removeEventListener('keyup',  element.___escapeListener___);
				window.removeEventListener('resize', element.___resizeListener___);
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

		this.rect  = this.element.getBoundingClientRect();
		this.style = this.element.getAttribute('style');

		let hostTag = this.element;

		this.transformRect = null;

		// console.log(hostTag);

		while(hostTag.parentNode && !hostTag.matches(this.hostSelector))
		{
			if(hostTag.parentNode == document)
			{
				break;
			}

			hostTag = hostTag.parentNode;

			if(!this.transformRect && getComputedStyle(hostTag).transform !== 'none')
			{
				this.transformRect = hostTag.getBoundingClientRect();
			}
		}

		console.log(this.transformRect);

		let hostRect = hostTag.getBoundingClientRect();

		this.element.classList.add('popping');

		let oX = this.rect.x;
		let oY = this.rect.y;
		let oW = this.rect.width;
		let oH = this.rect.height;

		if(this.transformRect)
		{
			oX -= this.transformRect.x;
			oY -= this.transformRect.y;
		}

		window.requestAnimationFrame(()=>{
			this.unpoppedStyle = `
				;position:  fixed;
				left:       ${oX}px;
				top:        ${oY}px;
				width:      ${oW}px;
				height:     ${oH}px;
				z-index:    99999;
				transition-duration: 0s;
				overflow: hidden;
			`;

			let x = hostRect.x;
			let y = hostRect.y  + document.documentElement.scrollTop;
			let w = hostRect.width;
			let h = hostRect.height;

			console.log(this.transformRect);

			if(this.transformRect)
			{
				x -= this.transformRect.x;
				y -= this.transformRect.y;
			}

			x + this.popMargin;
			y + this.popMargin;
			w + this.popMargin * 2;
			h + this.popMargin * 2;

			// transition: width ${this.horizontalDuration}s  ease-out
			// , top ${this.verticalDuration}s    ease-out
			// , left ${this.horizontalDuration}s ease-out
			// , height ${this.verticalDuration}s ease-out
			// , all ${this.horizontalDuration}s  ease-out;

			let style = this.style + this.unpoppedStyle;

			this.element.setAttribute('style', style);

			setTimeout( ()=>{
				style += `
					;left:      ${x}px;
					top:        ${y + document.documentElement.scrollTop}px;
					width:      ${w}px;
					height:     ${h}px;
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
				this.element.classList.remove('popping');

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
			}, 16.7*2);

			this.poppedOut = true;
		});
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
