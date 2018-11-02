import { ScrollTag } from './ScrollTag';
import { Dom       } from 'curvature/base/Dom';

export class LazyTag extends ScrollTag
{
	constructor(element, parent, ref, index, direct)
	{
		super(element, parent, ref, index, direct);

		this.element.classList.remove('cv-visible');
		this.element.classList.add('cv-not-visible');

		this.bindTo('visible', (v)=>{
			if(v)
			{
				if(this.afterScroll)
				{
					clearTimeout(this.afterScroll);
				}
				this.afterScroll = setTimeout(
					()=>{
						if(!this.element)
						{
							return;
						}

						this.element.classList.add('cv-visible');
						this.element.classList.remove('cv-not-visible');

						Dom.mapTags(this.element, '[cv-lazy-style]', (tag) => {
							let lazyStyle = tag.getAttribute('cv-lazy-style');
							let style     = tag.getAttribute('style');

							tag.setAttribute('style', style + ';' + lazyStyle);

							tag.removeAttribute('cv-lazy-style');
						});
					}
					, (
						((this.offsetTop || this.element.offsetTop) * 0.5)
						+ ((this.element.offsetLeft) * 0.5)
					)
				);
			}
		});
	}
}
