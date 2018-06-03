import { Bindable } from '../base/Bindable';
import { Dom      } from '../base/Dom';
import { Tag      } from '../base/Tag';

export class PopOutTag extends Tag
{
	constructor(element, parent, ref, index)
	{
		super(element, parent, ref, index);

		this.poppedOut = false;
		this.style     = element.getAttribute('style');
		this.moving    = false;

		this.leftDuration   = 0;
		this.unpoppedStyle  = '';
		this.previousScroll = 0;

		this.bodyStyle  = '';
		this.bodyScroll = 0;

		element = Bindable.makeBindable(element);

		element.classList.add('unpopped');

		this.scrollStyle;

		this.rect;
		this.clickListener  = (event) => {
			let leftDuration = 0.333;
			
			if(!this.poppedOut || ! this.rect)
			{
				this.rect = element.getBoundingClientRect();

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
					this.leftDuration = (1 - (1 / this.distance)) / 4;

					console.log(this.distance);
				}
			}

			if(!this.element.contains(event.target))
			{
				return;
			}

			event.preventDefault();
			event.stopPropagation();


			if(this.moving)
			{
				return;
			}

			if(!this.poppedOut)
			{
				this.previousScroll = window.scrollY;

				this.unpoppedStyle = `
					;position:  fixed;
					left:       ${this.rect.x}px;
					top:        ${this.rect.y}px;
					width:      ${this.rect.width}px;
					height:     ${this.rect.height}px;
					z-index:    99999;

					overflow: hidden;
				`;

				let style = this.style + this.unpoppedStyle;

				element.setAttribute('style', style);

				document.body.style.overflow = 'hidden';
				document.body.style.overflowY = 'hidden';

				setTimeout(()=>{
					style += `
						;top:   0px;
						left:   0px;
						width:  100%;
						height: 100%;
						overflow-y: auto;
						transition: ${this.leftDuration}s ease-out;
					`;

					this.moving = true;

					element.classList.add('unpopped');

					element.classList.add('popped');
					element.classList.remove('unpopped');
					element.setAttribute('style', style);

					console.log(this.leftDuration);
					setTimeout(()=>{
						PopOutTag.popLevel();
						this.bodyStyle = document.body.getAttribute('style');
						this.bodyScroll = window.scrollY;
						console.log(this.bodyScroll);
						document.body.setAttribute('style', 'height:0px;overflow:hidden;');
						window.scrollTo(0,0);
						this.moving = false;
						Dom.mapTags(element, false, (tag)=>{
							let event = new Event('cvPopped');

							tag.dispatchEvent(event);

							this.scrollStyle = element.getAttribute('style');
						});
					}, this.leftDuration*1000);
				}, 1);

				this.poppedOut = !this.poppedOut;
			}
			else if(event.target.matches('.closeButton') && this.poppedOut)
			{
				window.scrollTo(0,this.previousScroll);
				setTimeout(()=>{

				}, 1);

				let style = this.style
					+ this.unpoppedStyle
					+ `;transition: ${this.leftDuration}s; ease-in`;

				console.log(this.leftDuration);

				if(0 === PopOutTag.unpopLevel())
				{
					document.body.setAttribute('style', this.bodyStyle);
					document.body.setAttribute('style', '');

					window.scrollTo(0, this.bodyScroll);
				}

				element.setAttribute('style', style);

				this.moving = true;

				setTimeout(()=>{
					element.classList.add('unpopped');
					element.classList.remove('popped');
					// element.setAttribute('style', this.style);
				}, this.leftDuration*500);
				setTimeout(()=>{
					element.setAttribute('style', this.style);
					this.moving = false;
					Dom.mapTags(element, false, (tag)=>{
						let event = new Event('cvUnpopped');

						tag.dispatchEvent(event);
					});
				}, this.leftDuration*1000);

				this.poppedOut = !this.poppedOut;
			}
		};

		element.___clickListener___ = this.clickListener;

		element.addEventListener('click',  element.___clickListener___);

		this.cleanup.push(((element)=>()=>{
			element.removeEventListener('click',  element.___clickListener___);
		})(element));
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

		return this.level;
	}

	pause()
	{
		super.pause();
		document.body.setAttribute('style', this.bodyStyle);
		document.body.setAttribute('style', '');
		window.scrollTo(0, this.bodyScroll);

		console.log('!!!');
	}
}
