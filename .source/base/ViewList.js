import { Bindable } from './Bindable';
import { View     } from './View';

export class ViewList
{
	constructor(template, subProperty, list, keyProperty = null)
	{
		this.args         = Bindable.makeBindable({});
		this.args.value   = Bindable.makeBindable(list || {});
		this.args.subArgs = Bindable.makeBindable({});
		this.views        = {};
		this.cleanup      = [];
		this.template     = template;
		this.subProperty  = subProperty;
		this.keyProperty  = keyProperty;
		this.tag          = null;
		this.paused       = false;

		this.args.value.___before___.push((t)=>{
			// console.log(t.___executing___);
			if(t.___executing___ == 'bindTo')
			{
				return;
			}
			this.paused = true;
		});

		this.args.value.___after___.push((t)=>{
			if(this.paused)
			{
				// console.log(t.___executing___);
				this.reRender();
			}
			this.paused = false;
		});

		// console.log(this.args);

		this.args.value.bindTo((v, k, t, d) => {

			if(this.paused)
			{
				return;
			}

			if(d)
			{
				this.views[k].remove();

				delete this.views[k];
				// console.log(`Deleting ${k}`, v, this.views);

				return;
			}

			// console.log(`Setting ${k}`, v, this.views);

			if(!this.views[k])
			{
				let view = new View();

				this.views[k] = view;

				this.views[k].template = this.template;

				this.views[k].parent   = this.parent;
				this.views[k].viewList = this;

				this.args.subArgs.bindTo((v, k, t, d) => {
					view.args[k] = v;
				});

				this.views[k].args[ this.subProperty ] = v;

				if(this.keyProperty)
				{
					this.views[k].args[ this.keyProperty ] = k;
				}

				t[k] = v;

				this.reRender();
			}

			this.views[k].args[ this.subProperty ] = v;
		});
	}

	render(tag)
	{
		for(let i in this.views)
		{
			this.views[i].render(tag);
		}

		this.tag = tag;

		// console.log(tag);
	}

	reRender()
	{
		// console.log('rerender');
		if(!this.tag)
		{
			return;
		}

		let views = [];

		for(let i in this.views)
		{
			views[i] = this.views[i];
		}

		let finalViews = [];

		for(let i in this.args.value)
		{
			let found = false;
			for(let j in views)
			{
				if(views[j] && this.args.value[i] === views[j].args[ this.subProperty ])
				{
					found = true;
					finalViews[i] = views[j];
					delete views[j];
					break;
				}
			}
			if(!found)
			{
				let viewArgs = {};
				viewArgs[this.subProperty] = this.args.value[i];
				finalViews[i] = new View(viewArgs);

				finalViews[i].template = this.template;
				finalViews[i].parent   = this.parent;
				finalViews[i].viewList = this;

				finalViews[i].args[ this.keyProperty ] = i;

				this.args.subArgs.bindTo((v, k, t, d) => {
					finalViews[i].args[k] = v;
				});
			}
		}

		for(let i in this.views)
		{
			let found = false;

			for(let j in finalViews)
			{
				if(this.views[i] === finalViews[j])
				{
					found = true;
					break;
				}
			}

			if(!found)
			{
				this.views[i].remove();
			}
		}

		let appendOnly = true;

		for(let i in this.views)
		{
			if(this.views[i] !== finalViews[i])
			{
				appendOnly = false;
			}
		}

		if(!appendOnly)
		{
			for(let i in this.views)
			{
				this.views[i].remove();
			}

			while(this.tag.firstChild)
			{
				this.tag.removeChild(this.tag.firstChild);
			}

			for(let i in finalViews)
			{
				finalViews[i].render(this.tag);
			}
		}
		else
		{
			let i = this.views.length || 0

			while(finalViews[i])
			{
				finalViews[i].render(this.tag);
				i++;
			}
		}

		this.views = finalViews;
	}
	pause(pause=true)
	{
		for(let i in this.views)
		{
			this.views[i].pause(pause);
		}
	}
	remove()
	{
		for(let i in this.views)
		{
			this.views[i].remove();
		}

		let cleanup;

		while(cleanup = this.cleanup.pop())
		{
			cleanup();
		}

		this.views = [];

		while(this.tag && this.tag.firstChild)
		{
			this.tag.removeChild(this.tag.firstChild);
		}

	}
}
