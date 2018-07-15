import { View  }   from './View';
import { Cache }   from './Cache';

export class Router {
	static listen(mainView)
	{
		window.addEventListener(
			'popstate'
			, (event) => {
				event.preventDefault();

				this.match(location.pathname, mainView);
			}
		);

		this.go(location.pathname);
	}
	static go(route, silent)
	{
		if(location.pathname !== route) {
			history.pushState(null, null, route);
		}
		if(!silent)
		{
			window.dispatchEvent(new Event('popstate'));			
		}
	}
	static match(path, view, forceRefresh = false)
	{
		let current = view.args.content;
		let routes  = view.routes;

		this.path   = path;
		this.query  = {};

		let query   = new URLSearchParams(window.location.search);

		this.queryString = window.location.search;

		for(let pair of query) { 
			this.query[ pair[0] ] = pair[1]; 
		}

		// forceRefresh = true;

		let result;

		// if(!forceRefresh && (result = Cache.load(this.path, false, 'page')))
		// {
		// 	// console.log('Using cache!');

		// 	view.args.content.pause(true);

		// 	view.args.content = result;

		// 	result.pause(false);

		// 	result.update(this.query);

		// 	return;
		// }

		path = path.substr(1).split('/');

		let args = {};
		for(let i in this.query)
		{
			args[i] = this.query[i];
		}

		L1: for(let i in routes) {
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

			if(typeof routes[i] !== 'function') {
				return routes[i];
			}

			if(!forceRefresh
				&& current
				&& current instanceof routes[i]
				&& current.update(args)
			) {
				view.args.content = current;

				return true;
			}

			let result = routes[i];

			if(routes[i] instanceof Object
				&& routes[i].isView
				&& routes[i].isView()
			){
				result = new routes[i](args);
			}
			else if(routes[i] instanceof Function)
			{
				result = '';

				let _result = routes[i](args);

				if(_result instanceof Promise)
				{
					_result.then(x=>{
						view.args.content = x;
					});
				}
				else
				{
					result = _result;
				}
			}
			else if(routes[i] instanceof Object)
			{
				result = new routes[i](args);
			}
			else if(typeof routes[i] == 'string')
			{
				result = routes[i];
			}

			if(result instanceof View)
			{
				result.pause(false);

				result.update(args, forceRefresh);

				if(view.args.content instanceof View)
				{
					view.args.content.pause(true);
				}			

				// Cache.store(this.path, result, 3600, 'page');
			}

			view.args.content = result;

			return true;
		}

		if(routes && routes[false])
		{
			if(!forceRefresh
				&& current
				&& current instanceof routes[false]
				&& current.update(args)
			) {
				view.args.content = current;

				return false;
			}

			if(typeof routes[false] !== 'function') {
				view.args.content = routes[false];
			}

			let result = routes[false];

			if(result instanceof View)
			{
				result.pause(false);
			}

			if(routes[false] instanceof Object)
			{
				result = new routes[false](args);
			}

			result.update(args, forceRefresh);

			if(view.args.content instanceof View)
			{
				view.args.content.pause(true);
			}

			view.args.content = result;

			Cache.store(this.path, result, 3600, 'page');
		}

		return false;
	}
	static clearCache() {
		// this.cache = {};
	}
	static queryOver(args = {})
	{
		let parts = [], finalArgs = {};

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
