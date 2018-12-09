import { Bindable } from './Bindable';
import { View     } from './View';

export class ViewList
{
	constructor(template, subProperty, list, parent, keyProperty = null)
	{
		this.args         = Bindable.makeBindable({});
		this.args.value   = Bindable.makeBindable(list || {});
		this.args.subArgs = Bindable.makeBindable({});
		this.views        = [];
		this.cleanup      = [];
		this.template     = template;
		this.subProperty  = subProperty;
		this.keyProperty  = keyProperty;
		this.tag          = null;
		this.paused       = false;
		this.parent       = parent;

		this.args.value.___before___.push((t)=>{
			if(t.___executing___ == 'bindTo')
			{
				return;
			}
			this.paused = true;
		});

		this.args.value.___after___.push((t)=>{
			if(t.___executing___ == 'bindTo')
			{
				return;
			}

			this.paused = t.___stack___.length > 1;	

			this.reRender();
			
		});

		let debind = this.args.value.bindTo((v, k, t, d) => {

			if(this.paused)
			{
				return;
			}

			if(d)
			{
				if(this.views[k])
				{
					this.views[k].remove();
				}

				this.views.splice(k,1);

				for(let i in this.views)
				{
					this.views[i].args[ this.keyProperty ] = i;
				}

				return;
			}

			if(!this.views[k])
			{
				this.reRender();	
			}
		}, {wait: 0});

		this.cleanup.push(debind);
	}

	render(tag)
	{
		for(let i in this.views)
		{
			this.views[i].render(tag);
		}

		this.tag = tag;
	}

	reRender()
	{
		if(this.paused || !this.tag)
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
				if(views[j]
					&& this.args.value[i] === views[j].args[ this.subProperty ]
				){
					found = true;
					finalViews[i] = views[j];
					finalViews[i].args[ this.keyProperty ] = i;
					delete views[j];
					break;
				}
			}

			if(!found)
			{
				let viewArgs = {};
				let view = finalViews[i] = new View(viewArgs);

				finalViews[i].template = this.template;
				finalViews[i].parent   = this.parent;
				finalViews[i].viewList = this;

				finalViews[i].args[ this.keyProperty ] = i;
				finalViews[i].args[ this.subProperty ] = this.args.value[i];

				this.cleanup.push(
					this.args.value.bindTo(i, (v,k,t)=>{
						// viewArgs[ this.keyProperty ] = k;
						// viewArgs[ this.subProperty ] = v;
					})
				);

				this.cleanup.push(
					viewArgs.bindTo(this.subProperty, (v,k)=>{
						let index = viewArgs[ this.keyProperty ];
						this.args.value[index] = v;
					}
				));

				this.cleanup.push(
					this.args.subArgs.bindTo((v, k, t, d) => {
						viewArgs[k] = v;
					})
				);

				viewArgs[this.subProperty] = this.args.value[i];
			}
		}

		for(let i in views)
		{
			let found = false;

			for(let j in finalViews)
			{
				if(views[i] === finalViews[j])
				{
					found = true;
					break;
				}
			}

			if(!found)
			{
				views[i].remove();
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

		for(let i in finalViews)
		{
			if(finalViews[i] === this.views[i])
			{
				continue;
			}

			views.splice(i+1, 0, finalViews[i]);

			finalViews[i].render(this.tag);
		}

		for(let i in finalViews)
		{
			finalViews[i].args[ this.keyProperty ] = i;
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

		while(this.cleanup.length)
		{
			cleanup = this.cleanup.pop();
			cleanup();
		}

		this.views = [];

		while(this.tag && this.tag.firstChild)
		{
			this.tag.removeChild(this.tag.firstChild);
		}

		Bindable.clearBindings(this.args.subArgs);
		Bindable.clearBindings(this.args);

		if(!this.args.value.isBound())
		{
			Bindable.clearBindings(this.args.value);			
		}
	}
}
