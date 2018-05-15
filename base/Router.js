'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('curvature/base/View');

var _Cache = require('curvature/base/Cache');

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
				//this.route(location.pathname);
				// console.log(location.pathname);

				_this.match(location.pathname, mainView);
			});

			this.go(location.pathname);
		}
	}, {
		key: 'go',
		value: function go(route, silent) {
			if (location.pathname !== route) {
				history.pushState(null, null, route);
			}
			if (!silent) {
				window.dispatchEvent(new Event('popstate'));
			}
		}
	}, {
		key: 'match',
		value: function match(path, view) {
			var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var current = view.args.content;
			var routes = view.routes;

			this.path = path;
			this.query = {};

			var query = new URLSearchParams(window.location.search);

			this.queryString = window.location.search;

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

			forceRefresh = true;

			var result = void 0;

			if (!forceRefresh && (result = _Cache.Cache.load(this.path, false, 'page'))) {
				// console.log('Using cache!');

				view.args.content.pause(true);

				view.args.content = result;

				result.pause(false);

				result.update(this.query);

				return;
			}

			path = path.substr(1).split('/');

			// console.log(path, routes);

			var args = {};
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
				}

				var _result = new routes[_i](args);

				if (_result instanceof _View.View) {
					_result.pause(false);
				}

				_result.update(args, forceRefresh);

				if (view.args.content instanceof _View.View) {
					view.args.content.pause(true);
				}

				_Cache.Cache.store(this.path, _result, 3600, 'page');

				view.args.content = _result;
				return true;
			}

			if (routes && routes[false]) {
				if (!forceRefresh && current && current instanceof routes[false]
				// && current.update(args)
				) {
						view.args.content = current;
					}

				if (typeof routes[false] !== 'function') {
					view.args.content = routes[false];
				}

				var _result2 = new routes[false](args);

				// result.update(args, forceRefresh);

				if (view.args.content instanceof _View.View) {
					view.args.content.pause(true);
				}

				_Cache.Cache.store(this.path, _result2, 3600, 'page');

				view.args.content = _result2;

				view.args.content.pause(false);
			}

			return false;
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