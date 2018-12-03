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
			if(this.paused)
			{
				this.reRender();
			}
			this.paused = false;
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
				let view = new View();

				this.views[k] = view;

				this.views[k].template = this.template;

				this.views[k].parent   = this.parent;
				this.views[k].viewList = this;

				// this.views[k].cleanup.push();
				this.cleanup.push(
					this.args.subArgs.bindTo((v, k, t, d) => {
						view.args[k] = v;
					})
				);

				this.views[k].args[ this.subProperty ] = v;

				if(this.keyProperty)
				{
					this.views[k].args[ this.keyProperty ] = k;
				}

				this.cleanup.push(
					view.args.bindTo(this.subProperty, (v)=>{
						this.args.value[k] = v;
					})
				);

				t[k] = v;

				this.reRender();
			}

			// this.views[k].args[ this.subProperty ] = v;

			// this.views[k].args.bindTo(this.subProperty, (v,k,t,d)=>{
			// 	console.log(k,v);
			// });
		});

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
				if(views[j]
					&& this.args.value[i] === views[j].args[ this.subProperty ]
					// && !(this.args.value[i] instanceof Object)
				){
					// console.log(i, views[j].args._id);
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

				// console.log(i, view.args._id);

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

		// console.log('==============');

		// console.log(finalViews, this.views);

		for(let i in finalViews)
		{
			// console.log(
			// 	i
			// 	, finalViews[i]
			// 		? finalViews[i].args[ this.keyProperty ]
			// 		: null
			// 	, this.views[i]
			// 		? this.views[i].args[ this.keyProperty ]
			// 		: null
			// 	, finalViews[i] === this.views[i]
			// );

			if(finalViews[i] === this.views[i])
			{
				continue;
			}

			if(i == 0)
			{
				this.views.unshift(finalViews[i]);
				let subDoc = document.createRange().createContextualFragment('');
				finalViews[i].render(subDoc);
				this.tag.prepend(subDoc);
				continue;
			}

			if(this.views[i])
			{
				this.views.splice(this.views[i].args[ this.keyProperty ], 1);
			}

			this.views.splice(i+1, 0, finalViews[i]);

			finalViews[i].render(this.tag, this.views[i+1] || null);
		}

		for(let i in this.views)
		{
			this.views[i].args[ this.keyProperty ] = i;
		}


		// if(1||!appendOnly)
		// {
		// 	while(this.tag.firstChild)
		// 	{
		// 		this.tag.removeChild(this.tag.firstChild);
		// 	}

		// 	for(let i in finalViews)
		// 	{
		// 		finalViews[i].render(subDoc);
		// 	}
		// }
		// else
		// {
		// 	let i = this.views.length || 0

		// 	while(finalViews[i])
		// 	{
		// 		finalViews[i].render(subDoc);
		// 		i++;
		// 	}
		// }

		// this.tag.appendChild(subDoc);
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
