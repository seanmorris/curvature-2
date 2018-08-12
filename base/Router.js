'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('./View');

var _Cache = require('./Cache');

var _Config = require('Config');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Router = exports.Router = function () {
	function Router() {
		_classCallCheck(this, Router);
	}

	_createClass(Router, null, [{
		key: 'listen',
		value: function listen(mainView) {
			var _this = this;

			window.addEventListener('popstate', function (event) {
				event.preventDefault();

				_this.match(location.pathname, mainView);
			});

			this.go(location.pathname + location.search);
		}
	}, {
		key: 'go',
		value: function go(route, silent) {
			var currentRoute = void 0;

			if (currentRoute !== route) {
				document.title = _Config.Config.title;
				setTimeout(function () {
					history.pushState(null, null, route);
					if (!silent) {
						window.dispatchEvent(new Event('popstate'));
					}
				}, 0);

				currentRoute = location.pathname + location.search;
			}
		}
	}, {
		key: 'match',
		value: function match(path, view) {
			var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (this.path == path && !forceRefresh) {
				// return;
			}

			var current = view.args.content;
			var routes = view.routes;

			this.path = path;
			this.query = {};

			var query = new URLSearchParams(location.search);

			this.queryString = location.search;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = query[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var pair = _step.value;

					this.query[pair[0]] = pair[1];
				}

				// forceRefresh = true;
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}

			var args = {},
			    selected = false,
			    result = '';

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

			for (var i in this.query) {
				args[i] = this.query[i];
			}

			L1: for (var _i in routes) {
				var route = _i.split('/');
				if (route.length < path.length) {
					continue;
				}

				L2: for (var j in route) {
					if (route[j].substr(0, 1) == '%') {
						var argName = null;
						var groups = /^%(\w+)\??/.exec(route[j]);
						if (groups && groups[1]) {
							argName = groups[1];
						}
						if (!argName) {
							throw new Error(route[j] + ' is not a valid argument segment in route "' + _i + '"');
						}
						if (!path[j]) {
							if (route[j].substr(route[j].length - 1, 1) == '?') {
								args[argName] = '';
							} else {
								continue L1;
							}
						} else {
							args[argName] = path[j];
						}
					} else if (path[j] !== route[j]) {
						continue L1;
					}
				}

				if (typeof routes[_i] !== 'function') {
					return routes[_i];
				}

				if (!forceRefresh && current && current instanceof routes[_i] && current.update(args)) {
					view.args.content = current;

					return true;
				}

				selected = _i;
				result = routes[_i];

				break;
			}

			if (selected in routes && routes[selected] instanceof Object && routes[selected].isView && routes[selected].isView()) {
				result = new routes[selected](args);

				result.root = function () {
					return view;
				};
			} else if (routes[selected] instanceof Function) {
				result = '';

				console.log(routes[selected]);

				var _result = routes[selected](args);

				if (_result instanceof Promise) {
					_result.then(function (x) {
						view.args.content = x;
					});
				} else {
					result = _result;
				}
			} else if (routes[selected] instanceof Promise) {
				// result = Promise;
			} else if (routes[selected] instanceof Object) {
				result = new routes[selected](args);
			} else if (typeof routes[selected] == 'string') {
				result = routes[selected];
			}

			if (view.args.content instanceof _View.View) {
				// view.args.content.pause(true);
				view.args.content.remove();
			}

			var event = new CustomEvent('cvRoute', {
				cancelable: true,
				detail: { result: result, path: path, view: view }
			});

			if (document.dispatchEvent(event)) {
				view.args.content = result;
			}

			if (result instanceof _View.View) {
				result.pause(false);

				result.update(args, forceRefresh);
			}

			return selected !== false;
		}
	}, {
		key: 'clearCache',
		value: function clearCache() {
			// this.cache = {};
		}
	}, {
		key: 'queryOver',
		value: function queryOver() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var parts = [],
			    finalArgs = {};

			for (var i in this.query) {
				finalArgs[i] = this.query[i];
			}

			for (var _i2 in args) {
				finalArgs[_i2] = args[_i2];
			}

			delete finalArgs['api'];

			return finalArgs;
		}
	}, {
		key: 'queryToString',
		value: function queryToString() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var fresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var parts = [],
			    finalArgs = args;

			if (!fresh) {
				finalArgs = this.queryOver(args);
			}

			for (var i in finalArgs) {
				if (finalArgs[i] === '') {
					continue;
				}
				parts.push(i + '=' + encodeURIComponent(finalArgs[i]));
			}

			return parts.join('&');
		}
	}, {
		key: 'setQuery',
		value: function setQuery(name, value, silent) {
			var args = {};

			args[name] = value;

			this.go(this.path + '?' + this.queryToString(args), silent);
		}
	}]);

	return Router;
}();