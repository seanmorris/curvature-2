import { Router  } from 'curvature/base/Router';

export class CloudService
{
	static handleFetch(event)
	{
		const url  = new URL(event.request.url);
		const path = url.pathname + url.search;

		const results = [];

		for(const routes of this.routeHandlers)
		{
			return Router.match(path, {routes}).then(result => {

				if(typeof result !== 'object' || !(result instanceof Response))
				{
					result = new Response(result);
				}

				return result;
			});
		}
	}
}

Object.defineProperty(CloudService, 'routeHandlers', {value: new Set()});

globalThis.addEventListener('fetch', event => {
	event.respondWith(CloudService.handleFetch(event));
});
