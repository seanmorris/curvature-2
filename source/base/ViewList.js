import { Bindable } from './Bindable';
import { SetMap   } from './SetMap';
import { View     } from './View';
import { Bag      } from './Bag';

export class ViewList
{
	constructor(template, subProperty, list, parent, keyProperty = null, viewClass = null)
	{
		this.removed      = false;
		this.args         = Bindable.makeBindable({});
		this.args.value   = Bindable.makeBindable(list || {});
		this.subArgs      = Bindable.makeBindable({});
		this.views        = [];
		this.cleanup      = [];
		this.viewClass    = viewClass || View;
		this._onRemove    = new Bag();
		this.template     = template;
		this.subProperty  = subProperty;
		this.keyProperty  = keyProperty;
		this.tag          = null;
		this.downDebind   = [];
		this.upDebind     = [];
		this.paused       = false;
		this.parent       = parent;
		this.rendered     = new Promise((accept, reject) => {
			Object.defineProperty(this, 'renderComplete', {
				configurable: false
				, writable:   true
				, value:      accept
			});
		});

		this.willReRender = false;

		this.args.___before((t,e,s,o,a)=>{
			if(e == 'bindTo')
			{
				return;
			}

			this.paused = true;
		});

		this.args.___after((t,e,s,o,a) => {
			if(e == 'bindTo')
			{
				return;
			}

			this.paused = s.length > 1;

			this.reRender();
		});

		let debind = this.args.value.bindTo((v, k, t, d) => {

			if(this.paused)
			{
				return;
			}

			let kk = k;

			if(typeof k === 'symbol')
			{
				return;
			}

			if(isNaN(k))
			{
				kk = '_' + k;
			}

			if(d)
			{
				if(this.views[kk])
				{
					this.views[kk].remove();
				}

				delete this.views[kk];

				for(let i in this.views)
				{
					if(isNaN(i))
					{
						this.views[i].args[ this.keyProperty ] = i.substr(1);
						continue;
					}

					this.views[i].args[ this.keyProperty ] = i;
				}
			}
			else if(!this.views[kk])
			{
				cancelAnimationFrame(this.willReRender);

				this.willReRender = requestAnimationFrame(()=>{
					this.reRender();
				});
			}
			else if(this.views[kk] && this.views[kk].args)
			{
				this.views[kk].args[ this.keyProperty ] = k;
				this.views[kk].args[ this.subProperty ] = v;
			}
		});

		this._onRemove.add(debind);

		Object.preventExtensions(this);
	}

	render(tag)
	{
		const renders = [];

		for(const view of this.views)
		{
			view.render(tag);

			renders.push(view.rendered.then(()=>view));
		}

		this.tag = tag;

		Promise.all(renders).then(views => this.renderComplete(views));

		this.parent.dispatchEvent(new CustomEvent('listRendered', {detail: {
			detail: {key: this.subProperty, value: this.args.value}
		}}));
	}

	reRender()
	{
		if(this.paused || !this.tag)
		{
			return;
		}

		let views = [];
		let existingViews = new SetMap;

		for(let i in this.views)
		{
			const view     = this.views[i]
			const rawValue = view.args[ this.subProperty ];

			existingViews.add(rawValue, view);

			views[i] = view;
		}

		let finalViews = [];
		let finalViewSet = new Set;

		this.downDebind.length && this.downDebind.forEach(d=>d&&d());
		this.upDebind.length   && this.upDebind.forEach(d=>d&&d());

		this.upDebind.length = 0;
		this.downDebind.length = 0;

		let minKey = Infinity;
		let anteMinKey = Infinity;

		for(let i in this.args.value)
		{
			let found = false;
			let k = i;

			if(isNaN(k))
			{
				k = '_' + i;
			}
			else if(String(k).length)
			{
				k = Number(k);
			}

			if(this.args.value[i] !== undefined && existingViews.has(this.args.value[i]))
			{
				const existingView = existingViews.getOne(this.args.value[i]);

				if(existingView)
				{
					existingView.args[ this.keyProperty ] = i;

					finalViews[k] = existingView;

					finalViewSet.add(existingView);

					found = true;

					if(!isNaN(k))
					{
						minKey = Math.min(minKey, k);
						k > 0 && (anteMinKey = Math.min(anteMinKey, k));
					}

					existingViews.remove(this.args.value[i], existingView);
				}
			}

			if(!found)
			{
				let viewArgs = {};
				let view = finalViews[k] = new (this.viewClass)(viewArgs, this.parent);

				if(!isNaN(k))
				{
					minKey = Math.min(minKey, k);
					k > 0 && (anteMinKey = Math.min(anteMinKey, k));
				}

				finalViews[k].template = this.template;
				finalViews[k].viewList = this;

				finalViews[k].args[ this.keyProperty ] = i;
				finalViews[k].args[ this.subProperty ] = this.args.value[i];

				this.upDebind[k] = viewArgs.bindTo(this.subProperty, (v,k,t,d)=>{

					let index = viewArgs[ this.keyProperty ];

					if(d)
					{
						delete this.args.value[index];
						return;
					}

					this.args.value[index] = v;
				});

				this.downDebind[k] = this.subArgs.bindTo((v, k, t, d) => {
					if(d)
					{
						delete viewArgs[k];
						return;
					}
					viewArgs[k] = v;
				});

				const upDebind = () => {
					this.upDebind.filter(x=>x).forEach(d=>d());
					this.upDebind.length = 0;
				};

				const downDebind = () => {
					this.downDebind.filter(x=>x).forEach(d=>d());
					this.downDebind.length = 0;
				};

				view.onRemove(()=>{
					this._onRemove.remove(upDebind);
					this._onRemove.remove(downDebind);

					this.upDebind[k]   && this.upDebind[k]();
					this.downDebind[k] && this.downDebind[k]();

					delete this.upDebind[k];
					delete this.downDebind[k]
				});

				this._onRemove.add(upDebind);
				this._onRemove.add(downDebind);

				viewArgs[this.subProperty] = this.args.value[i];
			}
		}

		for(let i in views)
		{
			if(!finalViewSet.has(views[i]))
			{
				views[i].remove();
			}
		}

		if(Array.isArray(this.args.value))
		{
			const localMin = (minKey === 0)
				 && (finalViews[1] !== undefined && finalViews.length > 1)
				 || (anteMinKey === Infinity)
				? minKey
				: anteMinKey;

			const renderRecurse = (i = 0) => {

				let ii = (finalViews.length - i) - 1;

				while(ii > localMin && finalViews[ii] === undefined)
				{
					ii--;
				}

				if(ii < localMin)
				{
					return Promise.resolve();
				}

				if(finalViews[ii] === this.views[ii])
				{
					if(finalViews[ii] && !finalViews[ii].firstNode)
					{
						finalViews[ii].render(this.tag, finalViews[ii + 1]);

						return finalViews[ii].rendered.then(() => renderRecurse(Number(i) + 1));
					}
					else
					{
						if(i % 500)
						{
							return renderRecurse(Number(i) + 1);
						}
						else
						{
							return new Promise(
								accept => requestAnimationFrame(
									() => accept(renderRecurse(Number(i) + 1))
								)
							);
						}
					}
				}

				finalViews[ii].render(this.tag, finalViews[ii + 1]);

				this.views.splice(ii, 0, finalViews[ii]);

				return finalViews[ii].rendered.then(() => renderRecurse(i + 1));
			}

			this.rendered = renderRecurse();

		}
		else
		{
			const renders = [];
			const leftovers = Object.assign({}, finalViews);

			const isInt = (x) => parseInt(x) === x - 0;

			const keys = Object.keys(finalViews).sort((a, b) => {

					if(isInt(a) && isInt(b))
					{
						return Math.sign(a - b);
					}

					if(!isInt(a) && !isInt(b))
					{
						return 0;
					}

					if(!isInt(a) && isInt(b))
					{
						return -1;
					}

					if(isInt(a) && !isInt(b))
					{
						return 1;
					}
				}
			);

			for(const i of keys)
			{
				delete leftovers[i];

				if(finalViews[i].firstNode && finalViews[i] === this.views[i])
				{
					continue;
				}

				finalViews[i].render(this.tag);

				renders.push( finalViews[i].rendered.then(()=>finalViews[i]) );
			}

			for(const i in leftovers)
			{
				delete this.args.views[i];

				leftovers.remove();
			}

			this.rendered = Promise.all(renders);
		}

		for(let i in finalViews)
		{
			if(isNaN(i))
			{
				finalViews[i].args[ this.keyProperty ] = i.substr(1);
				continue;
			}

			finalViews[i].args[ this.keyProperty ] = i;
		}

		this.views = Array.isArray(this.args.value)
			? [...finalViews]
			: finalViews;

		finalViewSet.clear();

		this.willReRender = false;

		this.rendered.then(() => {
			this.parent.dispatchEvent(new CustomEvent('listRendered', {detail: {
				detail: {key: this.subProperty, value: this.args.value, tag: this.tag}
			}}));

			this.tag.dispatchEvent(new CustomEvent('listRendered', {detail: {
				detail: {key: this.subProperty, value: this.args.value, tag: this.tag}
			}}));
		});
	}

	pause(pause=true)
	{
		for(let i in this.views)
		{
			this.views[i].pause(pause);
		}
	}

	onRemove(callback)
	{
		this._onRemove.add(callback);
	}

	remove()
	{
		for(let i in this.views)
		{
			this.views[i].remove();
		}

		let onRemove = this._onRemove.items();

		for(const i in onRemove)
		{
			this._onRemove.remove(onRemove[i]);

			onRemove[i]();
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

		if(this.subArgs)
		{
			Bindable.clearBindings(this.subArgs);
		}

		Bindable.clearBindings(this.args);

		if(this.args.value && !this.args.value.isBound())
		{
			Bindable.clearBindings(this.args.value);
		}

		this.removed = true;
	}
}
