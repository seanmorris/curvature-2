const AppRoutes = {};

try { Object.assign(AppRoutes, require('Routes').Routes || {}); }
catch(error) { window.devmode && console.warn(error); }

export class Routes
{
	static get(name)
	{
		return this.routes[name]
	}

	static dump()
	{
		return this.routes;
	}
}

Object.defineProperty(Routes, 'routes', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      AppRoutes
});
