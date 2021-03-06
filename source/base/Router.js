import { View  }  from './View';
import { Cache }  from './Cache';
import { Config } from './Config';
import { Routes } from './Routes';

const NotFoundError = Symbol('NotFound');
const InternalError = Symbol('Internal');

export class Router {

	static wait(view, event = 'DOMContentLoaded', node = document)
	{
		node.addEventListener(event, () => {
			this.listen(view);
		});
	}

	static listen(listener, routes = false)
	{
		this.routes = routes || listener.routes;

		Object.assign(this.query, this.queryOver({}));

		const listen = (event) => {

			event.preventDefault();

			if(event.state && 'routedId' in event.state)
			{
				if(event.state.routedId <= this.routeCount)
				{
					this.history.splice(event.state.routedId);

					this.routeCount = event.state.routedId;
				}
				else if(event.state.routedId > this.routeCount)
				{
					this.history.push(event.state.prev);

					this.routeCount = event.state.routedId;
				}
			}
			else
			{
				if(this.prevPath !== null && this.prevPath !== location.pathname)
				{
					this.history.push(this.prevPath);
				}
			}

			if(location.origin !== 'null')
			{
				this.match(location.pathname, listener);
			}
			else
			{
				this.match(this.nextPath, listener);
			}

			for(const i in this.query)
			{
				delete this.query[i];
			}

			Object.assign(this.query, this.queryOver({}));
		};

		window.addEventListener('popstate', listen);
		window.addEventListener('cvUrlChanged', listen);

		let route = location.origin !== 'null'
			? location.pathname + location.search
			: false;

		if(location.origin && location.hash)
		{
			route += location.hash;
		}

		this.go(route !== false ? route : '/');
	}

	static go(path, silent)
	{
		const configTitle = Config.get('title');

		if(configTitle)
		{
			document.title = configTitle;
		}

		if(location.origin === 'null')
		{
			this.nextPath = path;
		}
		else if(silent === 2 && location.pathname !== path)
		{
			history.replaceState(
				{
					routedId: this.routeCount
					, prev:   this.prevPath
					, url:    location.pathname
				}
				, null
				, path
			);
		}
		else if(location.pathname !== path)
		{
			history.pushState(
				{
					routedId: ++this.routeCount
					, prev:   this.prevPath
					, url:    location.pathname
				}
				, null
				, path
			);
		}

		if(!silent)
		{
			if(silent === false)
			{
				this.path = null;
			}

			if(path.substring(0,1) === '#')
			{
				window.dispatchEvent(new HashChangeEvent('hashchange'));
			}
			else
			{
				window.dispatchEvent(new CustomEvent('cvUrlChanged'));
			}
		}

		for(const i in this.query)
		{
			delete this.query[i];
		}

		Object.assign(this.query, this.queryOver({}));

		this.prevPath = path;
	}

	static match(path, listener, forceRefresh = false)
	{
		if(this.path === path && !forceRefresh)
		{
			return;
		}

		this.queryString = location.search;
		this.path        = path;

		const prev    = this.prevPath;
		const current = listener.args.content;
		const routes  = this.routes || listener.routes || Routes.dump();
		const query   = new URLSearchParams(location.search);

		for(const i in this.query)
		{
			delete this.query[i];
		}

		Object.assign(this.query, this.queryOver({}));

		let args = {}, selected = false, result = '';

		path = path.substr(1).split('/');

		for(let i in this.query)
		{
			args[i] = this.query[i];
		}

		L1: for(let i in routes)
		{
			let route = i.split('/');

			if(route.length < path.length && route[route.length-1] !== '*')
			{
				continue;
			}

			L2: for(let j in route)
			{
				if(route[j].substr(0, 1) == '%')
				{
					let argName = null;
					let groups  = /^%(\w+)\??/.exec(route[j]);
					if(groups && groups[1])
					{
						argName = groups[1];
					}

					if(!argName)
					{
						throw new Error(`${route[j]} is not a valid argument segment in route "${i}"`);
					}

					if(!path[j])
					{
						if(route[j].substr(route[j].length - 1, 1) == '?')
						{
							args[ argName ] = '';
						}
						else
						{
							continue L1;
						}
					}

					else
					{
						args[ argName ] = path[j];
					}
				}
				else if(route[j] !== '*' && path[j] !== route[j])
				{
					continue L1;
				}
			}

			selected = i;
			result   = routes[i];

			if(route[route.length-1] === '*')
			{
				args.pathparts = path.slice(route.length - 1);
			}

			break;
		}

		const eventStart = new CustomEvent('cvRouteStart', {
			cancelable: true
			, detail: {
				path
				, prev
				, root: listener
				, selected
				, routes
			}
		});

		if(!document.dispatchEvent(eventStart))
		{
			return;
		}

		if(!forceRefresh
			&& listener
			&& current
			&& (result instanceof Object)
			&& (current instanceof result)
			&& !(result instanceof Promise)
			&& current.update(args)
		) {
			listener.args.content = current;

			return true;
		}

		try
		{
			if(!(selected in routes))
			{
				routes[selected] = routes[NotFoundError];
			}

			const processRoute = (selected) => {

				let result = false;

				if(typeof routes[selected] === 'function')
				{
					if(routes[selected].prototype instanceof View)
					{
						result = new routes[selected](args);
					}
					else
					{
						result = routes[selected](args);
					}
				}
				else
				{
					result = routes[selected];
				}

				return result;
			};

			result = processRoute(selected);

			if(result === false)
			{
				result = processRoute(NotFoundError);
			}

			if(result instanceof Promise)
			{
				return result.then(realResult => {

					this.update(
						listener
						, path
						, realResult
						, routes
						, selected
						, args
						, forceRefresh
					);

				}).catch(error => {

					document.dispatchEvent(new CustomEvent('cvRouteError', {
						detail: {
							error
							, path
							, prev
							, view: listener
							, routes
							, selected
						}
					}));

					this.update(
						listener
						, path
						, window['devMode'] ? String(error) : 'Error: 500'
						, routes
						, selected
						, args
						, forceRefresh
					);

					throw error;

				});
			}
			else
			{
				return this.update(
					listener
					, path
					, result
					, routes
					, selected
					, args
					, forceRefresh
				);
			}
		}
		catch(error)
		{
			document.dispatchEvent(new CustomEvent('cvRouteError', {
				detail: {
					error
					, path
					, prev
					, view: listener
					, routes
					, selected
				}
			}));

			this.update(
				listener
				, path
				, window['devMode'] ? String(error) : 'Error: 500'
				, routes
				, selected
				, args
				, forceRefresh
			);

			throw error;
		}
	}

	static update(listener, path, result, routes, selected, args, forceRefresh)
	{
		if(!listener)
		{
			return;
		}

		const prev = this.prevPath;

		let event = new CustomEvent('cvRoute', {
			cancelable: true
			, detail:   {
				result
				, path
				, prev
				, view: listener
				, routes
				, selected
			}
		});

		if(result !== false)
		{
			if(listener.args.content instanceof View)
			{
				listener.args.content.pause(true);
				listener.args.content.remove();
			}

			if(document.dispatchEvent(event))
			{
				listener.args.content = result;
			}

			if(result instanceof View)
			{
				result.pause(false);
				result.update(args, forceRefresh);
			}
		}

		let eventEnd = new CustomEvent('cvRouteEnd', {
			cancelable: true
			, detail:   {
				result
				, path
				, prev
				, view: listener
				, routes
				, selected
			}
		});

		document.dispatchEvent(eventEnd);
	}

	static queryOver(args = {})
	{
		let params    = new URLSearchParams(location.search);
		let finalArgs = {};
		let query     = {};

		for(const pair of params)
		{
			query[ pair[0] ] = pair[1];
		}

		finalArgs = Object.assign(finalArgs, query, args);

		delete finalArgs['api'];

		return finalArgs;

		// for(let i in query)
		// {
		// 	finalArgs[i] = query[i];
		// }

		// for(let i in args)
		// {
		// 	finalArgs[i] = args[i];
		// }
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
		const args = this.queryOver();

		args[name] = value;

		if(value === undefined)
		{
			delete args[name];
		}

		const queryString = this.queryToString(args, true);

		this.go(
			location.pathname + (queryString ? '?' + queryString : '')
			, silent
		);
	}
}

Object.defineProperty(Router, 'query', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      {}
});

Object.defineProperty(Router, 'history', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      []
});

Object.defineProperty(Router, 'routeCount', {
	configurable: false
	, enumerable: false
	, writable:   true
	, value:      0
});

Object.defineProperty(Router, 'prevPath', {
	configurable: false
	, enumerable: false
	, writable:   true
	, value:      null
});

Object.defineProperty(Router, 'queryString', {
	configurable: false
	, enumerable: false
	, writable:   true
	, value:      null
});

Object.defineProperty(Router, 'InternalError', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      InternalError
});

Object.defineProperty(Router, 'NotFoundError', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      NotFoundError
});
