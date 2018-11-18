import { View  }   from './View';
import { Cache }   from './Cache';
import { Config }   from 'Config';

export class Router {
	static wait(view, event = 'DOMContentLoaded', node = document)
	{
		node.addEventListener(event, () => {
			this.listen(view);
		});
	}
	static listen(mainView)
	{
		let route = location.pathname + location.search;

		if(location.hash)
		{
			route += location.hash;
		}

		window.addEventListener(
			'popstate'
			, (event) => {
				event.preventDefault();

				this.match(location.pathname, mainView);
			}
		);

		this.go(route);
	}
	static go(route, silent)
	{
		document.title = Config.title;
		setTimeout(
			() => {
				history.pushState(null, null, route);

				if(!silent)
				{
					window.dispatchEvent(new Event('popstate'))

					if(route.substring(0,1) === '#')
					{
						window.dispatchEvent(new HashChangeEvent(
							'hashchange'
						));
					}

				}
			}
			, 0
		);
	}
	static match(path, view, forceRefresh = false)
	{
		if(this.path == path && !forceRefresh)
		{
			return;
		}

		let current = view.args.content;
		let routes  = view.routes;

		this.path   = path;
		this.query  = {};

		let query   = new URLSearchParams(location.search);

		this.queryString = location.search;

		for(let pair of query) {
			this.query[ pair[0] ] = pair[1];
		}

		let args = {}, selected = false, result = '';

		path = path.substr(1).split('/');

		for(let i in this.query)
		{
			args[i] = this.query[i];
		}

		L1: for(let i in routes)
		{
			let route = i.split('/');
			if(route.length < path.length)
			{
				continue;
			}

			L2: for(let j in route)
			{
				if(route[j].substr(0, 1) == '%') {
					let argName = null;
					let groups  = /^%(\w+)\??/.exec(route[j]);
					if(groups && groups[1]) {
						argName = groups[1];
					}
					if(!argName) {
						throw new Error(`${route[j]} is not a valid argument segment in route "${i}"`);
					}
					if(!path[j]) {
						if(route[j].substr(route[j].length - 1, 1) == '?') {
							args[ argName ] = '';
						}
						else {
							continue L1;
						}
					}
					else {
						args[ argName ] = path[j];
					}
				}
				else if(path[j] !== route[j]) {
					continue L1;
				}
			}

			if(!forceRefresh
				&& current
				&& (routes[i] instanceof Object)
				&& (current instanceof routes[i])
				&& !(routes[i] instanceof Promise)
				&& current.update(args)
			) {
				view.args.content = current;

				return true;
			}

			selected = i;
			result   = routes[i];

			break;
		}

		if(selected in routes
			&& routes[selected] instanceof Object
			&& routes[selected].isView
			&& routes[selected].isView()
		){
			result = new routes[selected](args);

			result.root = ()=>view;
		}
		else if(routes[selected] instanceof Function)
		{
			result = '';

			const _result = routes[selected](args);

			if(_result instanceof Promise)
			{
				_result.then(x=>{
					view.args.content = x;
				}).catch(x=>{
					view.args.content = x;
				});
			}
			else
			{
				result = _result;
			}
		}
		else if(routes[selected] instanceof Promise)
		{
			routes[selected].then(x => {
				view.args.content = x;
			}).catch(x=>{
				view.args.content = x;
			});

			result = '';
		}
		else if(routes[selected] instanceof Object)
		{
			result = new routes[selected](args);
		}
		else if(typeof routes[selected] == 'string')
		{
			result = routes[selected];
		}

		if(view.args.content instanceof View)
		{
			// view.args.content.pause(true);
			view.args.content.remove();
		}

		let event = new CustomEvent('cvRoute', {
			cancelable: true
			, detail:   {result, path, view}
		});

		if(document.dispatchEvent(event))
		{
			view.args.content = result;
		}

		if(result instanceof View)
		{
			result.pause(false);

			result.update(args, forceRefresh);
		}

		return selected !== false;
	}
	static clearCache() {
		// this.cache = {};
	}
	static queryOver(args = {})
	{
		let finalArgs = {};

		for(let i in this.query)
		{
			finalArgs[i] = this.query[i];
		}

		for(let i in args)
		{
			finalArgs[i] = args[i];
		}

		delete finalArgs['api'];

		return finalArgs;
	}
	static queryToString(args = {}, fresh = false)
	{
		let parts = [], finalArgs = args;

		if(!fresh)
		{
			finalArgs = this.queryOver(args);
		}

		for(let i in finalArgs)
		{
			if(finalArgs[i] === '')
			{
				continue;
			}
			parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
		}

		return parts.join('&');
	}
	static setQuery(name, value, silent)
	{
		let args = {};

		args[name] = value;

		this.go(
			this.path
				+ '?'
				+ this.queryToString(args)
			, silent
		);
	}
}
