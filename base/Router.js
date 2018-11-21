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
		key: 'wait',
		value: function wait(view) {
			var _this = this;

			var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DOMContentLoaded';
			var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

			node.addEventListener(event, function () {
				_this.listen(view);
			});
		}
	}, {
		key: 'listen',
		value: function listen(mainView) {
			var _this2 = this;

			var routeHistory = [location.toString()];
			var prevHistoryLength = history.length;

			var route = location.pathname + location.search;

			if (location.hash) {
				route += location.hash;
			}

			window.addEventListener('popstate', function (event) {
				event.preventDefault();

				console.log(event);

				console.log(routeHistory.length);

				if (routeHistory.length && prevHistoryLength == history.length) {
					if (location.toString() == routeHistory[routeHistory.length - 2]) {
						routeHistory.pop();
						console.log('Back button!', location.toString());
					} else {
						routeHistory.push(location.toString());
						console.log('Forward button.', location.toString());
					}
				} else {
					routeHistory.push(location.toString());
					prevHistoryLength = history.length;
					console.log('Normal nav.', location.toString());
				}

				_this2.match(location.pathname, mainView);
			});

			this.go(route);
		}
	}, {
		key: 'go',
		value: function go(route, silent) {
			document.title = _Config.Config.title;
			setTimeout(function () {
				history.pushState(null, null, route);

				if (!silent) {
					window.dispatchEvent(new Event('popstate'));

					if (route.substring(0, 1) === '#') {
						window.dispatchEvent(new HashChangeEvent('hashchange'));
					}
				}
			}, 0);
		}
	}, {
		key: 'match',
		value: function match(path, view) {
			var _this3 = this;

			var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (this.path == path && !forceRefresh) {
				return;
			}

			var eventStart = new CustomEvent('cvRouteStart', {
				cancelable: true,
				detail: { result: result, path: path, view: view }
			});

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

				if (!forceRefresh && current && routes[_i] instanceof Object && current instanceof routes[_i] && !(routes[_i] instanceof Promise) && current.update(args)) {
					view.args.content = current;

					return true;
				}

				selected = _i;
				result = routes[_i];

				break;
			}

			document.dispatchEvent(eventStart);

			if (selected in routes && routes[selected] instanceof Object && routes[selected].isView && routes[selected].isView()) {
				result = new routes[selected](args);

				result.root = function () {
					return view;
				};
			} else if (routes[selected] instanceof Function) {
				result = '';

				var _result = routes[selected](args);

				if (_result instanceof Promise) {
					result = false;

					_result.then(function (x) {
						_this3.update(view, path, x);
					}).catch(function (x) {
						_this3.update(view, path, x);
					});
				} else {
					result = _result;
				}
			} else if (routes[selected] instanceof Promise) {
				result = false;

				routes[selected].then(function (x) {
					_this3.update(view, path, x);
				}).catch(function (x) {
					_this3.update(view, path, x);
				});
			} else if (routes[selected] instanceof Object) {
				result = new routes[selected](args);
			} else if (typeof routes[selected] == 'string') {
				result = routes[selected];
			}

			this.update(view, path, result);

			// if(view.args.content instanceof View)
			// {
			// 	// view.args.content.pause(true);
			// 	view.args.content.remove();
			// }

			// console.log(result);

			// if(result !== false)
			// {
			// 	if(document.dispatchEvent(event))
			// 	{
			// 		view.args.content = result;
			// 	}
			// }

			if (result instanceof _View.View) {
				result.pause(false);

				result.update(args, forceRefresh);
			}

			return selected !== false;
		}
	}, {
		key: 'update',
		value: function update(view, path, result) {
			var event = new CustomEvent('cvRoute', {
				cancelable: true,
				detail: { result: result, path: path, view: view }
			});

			var eventEnd = new CustomEvent('cvRouteEnd', {
				cancelable: true,
				detail: { result: result, path: path, view: view }
			});

			if (result !== false) {
				if (view.args.content instanceof _View.View) {
					// view.args.content.pause(true);
					view.args.content.remove();
				}

				if (document.dispatchEvent(event)) {
					view.args.content = result;
				}

				document.dispatchEvent(eventEnd);
			}
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

			var finalArgs = {};

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