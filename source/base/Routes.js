const AppRoutes = {};
const _require = require;

let imported = false;

const runImport = () => {
	if(imported) { return };
	try { Object.assign(AppRoutes, _require('Routes').Routes || {}); }
	catch(error) { globalThis.devMode === true && console.warn(error); }
	imported = true;
};

export class Routes
{
	static get(name)
	{
		runImport();

		return this.routes[name]
	}

	static dump()
	{
		runImport();

		return this.routes;
	}
}

Object.defineProperty(Routes, 'routes', {
	configurable: false
	, enumerable: false
	, writable:   false
	, value:      AppRoutes
});
