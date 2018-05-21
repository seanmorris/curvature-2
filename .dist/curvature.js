(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("Config.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Config = exports.Config = function (_View) {
  _inherits(Config, _View);

  function Config() {
    _classCallCheck(this, Config);

    return _possibleConstructorReturn(this, (Config.__proto__ || Object.getPrototypeOf(Config)).apply(this, arguments));
  }

  return Config;
}(View);
});

;require.register("access/LoginView.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LoginView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _View2 = require('../base/View');

var _Router = require('../base/Router');

var _Repository = require('../base/Repository');

var _UserRepository = require('./UserRepository');

var _Toast = require('../toast/Toast');

var _ToastAlert = require('../toast/ToastAlert');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginView = exports.LoginView = function (_View) {
	_inherits(LoginView, _View);

	function LoginView() {
		_classCallCheck(this, LoginView);

		var _this = _possibleConstructorReturn(this, (LoginView.__proto__ || Object.getPrototypeOf(LoginView)).call(this));

		_this.template = '\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = "user">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = "user/login">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/register">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/logout">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Login via FaceBook"\n\t\t\t \tcv-on = "click:facebookLogin(event)"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Log Out"\n\t\t\t \tcv-on = "click:logout(event)"\n\t\t\t />\n\t\t';
		return _this;
	}

	_createClass(LoginView, [{
		key: 'facebookLogin',
		value: function facebookLogin(event) {
			var _this2 = this;

			console.log('fb!');
			event.preventDefault();
			var fbWindow = window.open(_Config.Config.backend + '/facebookLogin');

			if (this.userCheck) {
				this.clearInterval(this.userCheck);
			}

			this.userCheck = this.onInterval(333, function () {
				_UserRepository.UserRepository.getCurrentUser(true).then(function (response) {
					var user = response.body;
					if (!user.id || !user) {
						return;
					}

					_this2.clearInterval(_this2.userCheck);

					_Router.Router.clearCache();
					_Repository.Repository.clearCache();

					_Toast.Toast.instance().pop(new _ToastAlert.ToastAlert({
						title: 'Logged in as ' + user.username,
						body: 'ID: ' + user.publicId,
						time: 2400
					}));

					// history.go(-1);

					// Router.instance().updateView(this, this.routes, true);
				});
			});
		}
	}, {
		key: 'logout',
		value: function logout(event) {
			var logoutWindow = window.open(_Config.Config.backend + '/user/logout?page=app%3Fclose%3D1');
		}
	}]);

	return LoginView;
}(_View2.View);
});

;require.register("access/UserRepository.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserRepository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository2 = require('../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserRepository = exports.UserRepository = function (_Repository) {
	_inherits(UserRepository, _Repository);

	function UserRepository() {
		_classCallCheck(this, UserRepository);

		return _possibleConstructorReturn(this, (UserRepository.__proto__ || Object.getPrototypeOf(UserRepository)).apply(this, arguments));
	}

	_createClass(UserRepository, null, [{
		key: 'getCurrentUser',
		value: function getCurrentUser(refresh) {
			return this.request(this.uri + 'current', false, false, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'logout',
		value: function logout() {
			return this.request(this.uri + 'logout', false, {}, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);
});

;require.register("base/Bindable.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bindable = exports.Bindable = function () {
	function Bindable() {
		_classCallCheck(this, Bindable);
	}

	_createClass(Bindable, null, [{
		key: 'isBindable',
		value: function isBindable(object) {
			if (!object.isBindable) {
				return false;
			}

			return object.isBindable === Bindable;
		}
	}, {
		key: 'makeBindable',
		value: function makeBindable(object) {

			if (!object || object.isBindable || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || object instanceof Node) {
				return object;
			}

			Object.defineProperty(object, 'ref', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'bindTo', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'binding', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'bindingAll', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'isBindable', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'executing', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'stack', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'stackTime', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'before', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'after', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'toString', {
				enumerable: false,
				writable: true
			});

			Object.defineProperty(object, 'setCount', {
				enumerable: false,
				writable: true
			});

			object.isBindable = Bindable;
			object.binding = {};
			object.bindingAll = [];
			object.bindTo = function (object) {
				return function (property) {
					var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

					if (callback == null) {
						callback = property;
						object.bindingAll.push(callback);
						for (var i in object) {
							callback(object[i], i, object, false);
						}
						return;
					}

					if (!object.binding[property]) {
						object.binding[property] = [];
					}

					object.binding[property].push(callback);

					callback(object[property], property, object, false);
				};
			}(object);

			object.stack = [];
			object.stackTime = [];
			object.before = [];
			object.after = [];
			object.setCount = {};

			object.toString = function (object) {
				return function () {
					if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object') {
						return JSON.stringify(object);
						return '[object]';
					}

					return object;
				};
			}(object);

			for (var i in object) {
				if (object[i] && _typeof(object[i]) == 'object' && !object[i] instanceof Node) {
					object[i] = Bindable.makeBindable(object[i]);
				}
			}

			var set = function (object) {
				return function (target, key, value) {
					if (target[key] === value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== object) {
						return true;
					}

					// console.log(`Setting ${key}`, value);

					if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !(value instanceof Node)) {
						if (value.isBindable !== Bindable) {
							value = Bindable.makeBindable(value);

							for (var _i in value) {
								if (value[_i] && _typeof(value[_i]) == 'object') {
									value[_i] = Bindable.makeBindable(value[_i]);
								}
							}
						}
					}

					for (var _i2 in object.bindingAll) {
						object.bindingAll[_i2](value, key, target, false);
					}

					var stop = false;

					if (key in object.binding) {
						for (var _i3 in object.binding[key]) {
							if (object.binding[key][_i3](value, key, target, false) === false) {
								stop = true;
							}
						}
					}

					if (!stop) {
						target[key] = value;
					}

					if (!target.setCount[key]) {
						target.setCount[key] = 0;
					}

					target.setCount[key]++;

					var warnOn = 10;

					if (target.setCount[key] > warnOn && value instanceof Object) {
						console.log('Warning: Resetting bindable reference "' + key + '" to object ' + target.setCount[key] + ' times.');
					}

					return true;
				};
			}(object);

			var del = function (object) {
				return function (target, key) {
					// console.log(key, 'DEL');

					if (!(key in target)) {
						return false;
					}

					for (var _i4 in object.bindingAll) {
						object.bindingAll[_i4](undefined, key, target, true);
					}

					if (key in object.binding) {
						for (var _i5 in object.binding[key]) {
							object.binding[key][_i5](undefined, key, target, true);
						}
					}

					if (Array.isArray(target)) {
						target.splice(key, 1);
					} else {
						delete target[key];
					}

					return true;
				};
			}(object);

			var get = function (object) {
				return function (target, key) {
					if (typeof target[key] == 'function') {
						var newFunc = function newFunc() {
							target.executing = key;

							target.stack.unshift(key);
							target.stackTime.unshift(new Date().getTime());

							// console.log(`Start ${key}()`);

							for (var _i6 in target.before) {
								target.before[_i6](target, key, object);
							}

							var ret = target[key].apply(target, arguments);

							for (var _i7 in target.after) {
								target.after[_i7](target, key, object);
							}

							target.executing = null;

							var execTime = new Date().getTime() - target.stackTime[0];

							if (execTime > 150) {
								// console.log(`End ${key}(), took ${execTime} ms`);
							}

							target.stack.shift();
							target.stackTime.shift();

							return ret;
						};

						return newFunc;
					}

					// console.log(`Getting ${key}`);

					return target[key];
				};
			}(object);

			object.ref = new Proxy(object, {
				deleteProperty: del,
				get: get,
				set: set
			});

			return object.ref;
		}
	}, {
		key: 'clearBindings',
		value: function clearBindings(object) {
			object.binding = {};
		}
	}]);

	return Bindable;
}();
});

;require.register("base/Cache.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = exports.Cache = function () {
	function Cache() {
		_classCallCheck(this, Cache);
	}

	_createClass(Cache, null, [{
		key: 'store',
		value: function store(key, value, expiry) {
			var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';

			var expiration = expiry * 1000 + new Date().getTime();

			// console.log(
			// 	`Caching ${key} until ${expiration} in ${bucket}.`
			// 	, value
			// 	, this.bucket
			// );

			if (!this.bucket) {
				this.bucket = {};
			}

			if (!this.bucket[bucket]) {
				this.bucket[bucket] = {};
			}

			this.bucket[bucket][key] = { expiration: expiration, value: value };
		}
	}, {
		key: 'load',
		value: function load(key) {
			var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';

			// console.log(
			// 	`Checking cache for ${key} in ${bucket}.`
			// 	, this.bucket
			// );

			if (this.bucket && this.bucket[bucket] && this.bucket[bucket][key]) {
				// console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
				if (this.bucket[bucket][key].expiration > new Date().getTime()) {
					return this.bucket[bucket][key].value;
				}
			}

			return defaultvalue;
		}
	}]);

	return Cache;
}();
});

;require.register("base/Cookie.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Cookie = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookie = exports.Cookie = function () {
	function Cookie() {
		_classCallCheck(this, Cookie);
	}

	_createClass(Cookie, null, [{
		key: 'set',
		value: function set(name, value) {
			Cookie.jar[name] = value;
		}
	}, {
		key: 'get',
		value: function get(name) {
			return Cookie.jar[name];
		}
	}, {
		key: 'delete',
		value: function _delete(name) {
			delete Cookie.jar[name];
		}
	}]);

	return Cookie;
}();

;

Cookie.jar = Cookie.jar || _Bindable.Bindable.makeBindable({});

if (window.location.href.substr(0, 4) !== 'data') {
	document.cookie.split(';').map(function (c) {
		var _c$split = c.split('='),
		    _c$split2 = _slicedToArray(_c$split, 2),
		    key = _c$split2[0],
		    value = _c$split2[1];

		try {
			value = JSON.parse(value);
		} catch (error) {
			value = value;
		}

		Cookie.jar[decodeURIComponent(key)] = value;
	});

	Cookie.jar.bindTo(function (v, k, t, d) {
		t[k] = v;

		if (d) {
			t[k] = null;
		}

		var cookieString = encodeURIComponent(k) + '=' + JSON.stringify(t[k]);
		document.cookie = cookieString;
	});
}
});

;require.register("base/Dom.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dom = exports.Dom = function () {
	function Dom() {
		_classCallCheck(this, Dom);
	}

	_createClass(Dom, null, [{
		key: "mapTags",
		value: function mapTags(doc, selector, callback, startNode, endNode) {
			var result = [];

			var started = true;

			if (startNode) {
				started = false;
			}

			var ended = false;

			var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ALL, {
				acceptNode: function acceptNode(node) {
					if (!started) {
						if (node === startNode) {
							started = true;
						} else {
							return NodeFilter.FILTER_SKIP;
						}
					}
					if (endNode && node === endNode) {
						ended = true;
					}
					if (ended) {
						return NodeFilter.FILTER_SKIP;
					}
					if (selector) {
						// console.log(selector, node, !!(node instanceof Element));
						if (node instanceof Element) {
							if (node.matches(selector)) {
								return NodeFilter.FILTER_ACCEPT;
							}
						}

						return NodeFilter.FILTER_SKIP;
					}

					return NodeFilter.FILTER_ACCEPT;
				}
			}, false);

			while (treeWalker.nextNode()) {
				result.push(callback(treeWalker.currentNode));
			}

			return result;
		}
	}, {
		key: "dispatchEvent",
		value: function dispatchEvent(doc, event) {
			doc.dispatchEvent(event);

			Dom.mapTags(doc, false, function (node) {
				node.dispatchEvent(event);
			});
		}
	}]);

	return Dom;
}();
});

;require.register("base/Repository.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cookie = require('./Cookie');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = {};

var Repository = exports.Repository = function () {
	function Repository() {
		_classCallCheck(this, Repository);
	}

	_createClass(Repository, null, [{
		key: 'loadPage',
		value: function loadPage() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			return this.request(this.uri, args).then(function (response) {
				return response;
				// return response.map((skeleton) => new Model(skeleton));
			});
		}
	}, {
		key: 'domCache',
		value: function domCache(uri, content) {
			console.log(uri, content);
		}
	}, {
		key: 'load',
		value: function load(id) {
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.objects = this.objects || {};
			this.objects[this.uri] = this.objects[this.uri] || {};

			if (this.objects[this.uri][id]) {
				return Promise.resolve(this.objects[this.uri][id]);
			}

			return this.request(this.uri + '/' + id).then(function (response) {
				// let model = new Model(response);
				// return this.objects[this.uri][id] = model;
			});
		}
	}, {
		key: 'form',
		value: function form() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var uri = this.uri + '/' + 'create';
			if (id) {
				uri = this.uri + '/' + id + '/edit';
			}
			return this.request(uri).then(function (skeleton) {
				return skeleton;
			});
		}
	}, {
		key: 'clearCache',
		value: function clearCache() {
			if (this.objects && this.objects[this.uri]) {
				this.objects[this.uri] = {};
			}
		}
	}, {
		key: 'request',
		value: function request(uri) {
			var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var _this = this;

			var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var type = 'GET';
			var queryString = '';
			var formData = null;
			var queryArgs = {};

			if (args) {
				queryArgs = args;
			}

			queryArgs.api = queryArgs.api || 'json';

			queryString = Object.keys(queryArgs).map(function (arg) {
				return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
			}).join('&');

			var fullUri = uri;
			var postString = '';

			if (post) {
				cache = false;
				type = 'POST';
				formData = new FormData();
				for (var i in post) {
					formData.append(i, post[i]);
				}
				postString = Object.keys(post).map(function (arg) {
					return encodeURIComponent(arg) + '=' + encodeURIComponent(post[arg]);
				}).join('&');
			}

			fullUri = uri + '?' + queryString;

			var xhr = new XMLHttpRequest();

			if (!post && cache && this.cache && this.cache[fullUri]) {
				return Promise.resolve(this.cache[fullUri]);
			}

			var tagCacheSelector = 'script[data-uri="' + fullUri + '"]';

			var tagCache = document.querySelector(tagCacheSelector);

			if (!post && cache && tagCache) {
				var tagCacheContent = JSON.parse(tagCache.innerText);

				return Promise.resolve(tagCacheContent);
			}

			xhr.withCredentials = true;
			xhr.timeout = 15000;

			var xhrId = this.xhrs.length;

			if (!post) {
				this.xhrs.push(xhr);
			}

			return new Promise(function (xhrId) {
				return function (resolve, reject) {
					xhr.onreadystatechange = function () {
						var DONE = 4;
						var OK = 200;

						var response = void 0;

						if (xhr.readyState === DONE) {

							if (!_this.cache) {
								_this.cache = {};
							}

							if (xhr.status === OK) {

								if (response = JSON.parse(xhr.responseText)) {
									if (response.code == 0) {
										// Repository.lastResponse = response;

										if (!post && cache) {
											_this.cache[fullUri] = response;
										}

										var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');

										var prerendering = _Cookie.Cookie.get('prerenderer');

										console.log(prerendering);

										if (prerendering) {
											if (!_tagCache) {
												_tagCache = document.createElement('script');
												document.querySelector('head').appendChild(_tagCache);
											}

											_tagCache.type = 'text/json';
											_tagCache.setAttribute('data-uri', fullUri);
											_tagCache.innerText = JSON.stringify(response);
										}

										resolve(response);
									} else {
										if (!post && cache) {
											_this.cache[fullUri] = response;
										}

										reject(response);
									}
								} else {
									// Repository.lastResponse = xhr.responseText;

									if (!post && cache) {
										_this.cache[fullUri] = xhr.responseText;
									}

									resolve(xhr.responseText);
								}
							} else {
								reject('HTTP' + xhr.status);
							}
							_this.xhrs[xhrId] = null;
						}
					};

					xhr.open(type, fullUri);

					if (post) {
						xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					}
					xhr.send(postString);
				};
			}(xhrId));
		}
	}, {
		key: 'cancel',
		value: function cancel() {
			for (var i in this.xhrs) {
				if (!this.xhrs[i]) {
					continue;
				}
				this.xhrs[i].abort();
			}
			this.xhrList = [];
		}
	}, {
		key: 'xhrs',
		get: function get() {
			return this.xhrList = this.xhrList || [];
		}
	}]);

	return Repository;
}();

// Repository.lastResponse = null;
});

require.register("base/Router.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Router = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('./View');

var _Cache = require('./Cache');

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

				var _result = routes[_i];

				if (routes[_i] instanceof Object) {
					_result = new routes[_i](args);
				}

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

				var _result2 = routes[false];

				if (routes[false] instanceof Object) {
					_result2 = new routes[false](args);
				}

				// result.update(args, forceRefresh);

				if (view.args.content instanceof _View.View) {
					view.args.content.pause(true);

					view.args.content = _result2;

					view.args.content.pause(false);
				}

				_Cache.Cache.store(this.path, _result2, 3600, 'page');
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
});

;require.register("base/Tag.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = exports.Tag = function () {
	function Tag(element, parent, ref, index) {
		_classCallCheck(this, Tag);

		this.element = _Bindable.Bindable.makeBindable(element);
		this.parent = parent;
		this.ref = ref;
		this.index = index;

		this.proxy = _Bindable.Bindable.makeBindable(this);
		this.cleanup = [];

		return this.proxy;
	}

	_createClass(Tag, [{
		key: 'remove',
		value: function remove() {
			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			_Bindable.Bindable.clearBindings(this);
		}
	}, {
		key: 'clear',
		value: function clear() {
			while (this.element.firstChild) {
				this.element.removeChild(this.element.firstChild);
			}
		}
	}]);

	return Tag;
}();
});

;require.register("base/Theme.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Theme = exports.Theme = function () {
	function Theme() {
		_classCallCheck(this, Theme);

		this.views = {
			'SeanMorris\\TheWhtRbt\\Location': {
				single: 'twr9/LocationPreview',
				list: 'twr9/LocationList'
			},
			'SeanMorris\\TheWhtRbt\\Image': {
				single: 'DetailView',
				list: 'DetailListView'
			}
		};
	}

	_createClass(Theme, [{
		key: 'resolve',
		value: function resolve(model) {
			var modelClass = void 0;

			if (Array.isArray(model)) {
				for (var i in model) {
					var _modelClass = model[i].class || model[i].content_type;

					if (modelClass && modelClass !== _modelClass) {
						throw new Error('Model list mismatch!');
					} else {
						modelClass = _modelClass;
					}
				}

				if (this.views[modelClass]) {
					if (this.views[modelClass].list) {
						return this.views[modelClass].list;
					}

					return this.views[modelClass];
				}

				return 'DetailListView';
			} else if (model) {
				modelClass = model.class || model.content_type;

				if (this.views[modelClass]) {
					if (this.views[modelClass].single) {
						return this.views[modelClass].single;
					}

					return this.views[modelClass];
				}

				return 'DetailView';
			}

			return false;
		}
	}]);

	return Theme;
}();
});

;require.register("base/View.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.View = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _ViewList = require('./ViewList');

var _Router = require('./Router');

var _Cookie = require('./Cookie');

var _Dom = require('./Dom');

var _Tag = require('./Tag');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = exports.View = function () {
	function View() {
		var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, View);

		this.args = _Bindable.Bindable.makeBindable(args);
		this._id = this.uuid();
		this.args._id = this._id;
		this.template = '';
		this.parent = null;

		this.firstNode = null;
		this.lastNode = null;
		this.nodes = null;

		this.frames = [];
		this.timeouts = [];
		this.intervals = [];

		this.cleanup = [];

		this.attach = [];
		this.detach = [];

		this.eventCleanup = [];

		this.parent = null;
		this.viewList = null;
		this.viewLists = {};

		this.tags = {};

		this.intervals = [];
		this.timeouts = [];
		this.frames = [];
	}

	_createClass(View, [{
		key: 'onFrame',
		value: function onFrame(callback) {
			var c = function c(timestamp) {
				callback(timestamp);
				window.requestAnimationFrame(c);
			};

			c();
		}
	}, {
		key: 'onTimeout',
		value: function onTimeout(time, callback) {
			var _this = this;

			var wrappedCallback = function wrappedCallback() {
				_this.timeouts[index].fired = true;
				callback();
			};
			var timeout = setTimeout(wrappedCallback, time);
			var index = this.timeouts.length;

			this.timeouts.push({
				timeout: timeout,
				callback: wrappedCallback,
				time: time,
				fired: false,
				created: new Date().getTime(),
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearTimeout',
		value: function clearTimeout(timeout) {
			for (var i in this.timeouts) {
				if (timeout === this.timeouts[i].timeout) {
					clearInterval(this.timeouts[i].timeout);

					delete this.timeouts[i];
				}
			}
		}
	}, {
		key: 'onInterval',
		value: function onInterval(time, callback) {
			var timeout = setInterval(callback, time);

			this.intervals.push({
				timeout: timeout,
				callback: callback,
				time: time,
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearInterval',
		value: function (_clearInterval) {
			function clearInterval(_x) {
				return _clearInterval.apply(this, arguments);
			}

			clearInterval.toString = function () {
				return _clearInterval.toString();
			};

			return clearInterval;
		}(function (timeout) {
			for (var i in this.intervals) {
				if (timeout === this.intervals[i].timeout) {
					clearInterval(this.intervals[i].timeout);

					delete this.intervals[i];
				}
			}
		})
	}, {
		key: 'pause',
		value: function pause() {
			var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

			if (paused === undefined) {
				this.paused = !this.paused;
			}

			this.paused = paused;

			if (this.paused) {
				for (var i in this.timeouts) {
					if (this.timeouts[i].fired) {
						delete this.timeouts[i];
						continue;
					}

					clearTimeout(this.timeouts[i].timeout);
				}

				for (var _i in this.intervals) {
					clearInterval(this.intervals[_i].timeout);
				}
			} else {
				for (var _i2 in this.timeouts) {
					if (!this.timeouts[_i2].timeout.paused) {
						continue;
					}

					if (this.timeouts[_i2].fired) {
						delete this.timeouts[_i2];
						continue;
					}

					this.timeouts[_i2].timeout = setTimeout(this.timeouts[_i2].callback, this.timeouts[_i2].time);
				}

				for (var _i3 in this.intervals) {
					if (!this.intervals[_i3].timeout.paused) {
						continue;
					}

					this.intervals[_i3].timeout.paused = false;

					this.intervals[_i3].timeout = setInterval(this.intervals[_i3].callback, this.intervals[_i3].time);
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (this.nodes) {
				for (var i in this.detach) {
					this.detach[i]();
				}

				var _loop = function _loop(_i4) {
					var detachEvent = new Event('cvDomDetached', { bubbles: true, target: _this2.nodes[_i4] });
					var attachEvent = new Event('cvDomAttached', { bubbles: true, target: _this2.nodes[_i4] });

					_this2.nodes[_i4].dispatchEvent(detachEvent);

					_Dom.Dom.mapTags(_this2.nodes[_i4], false, function (node) {
						node.dispatchEvent(detachEvent);
					});

					if (parentNode) {
						if (insertPoint) {
							parentNode.insertBefore(_this2.nodes[_i4], insertPoint);
						} else {
							parentNode.appendChild(_this2.nodes[_i4]);
						}
					}

					_Dom.Dom.mapTags(_this2.nodes[_i4], false, function (node) {
						node.dispatchEvent(attachEvent);
					});

					_this2.nodes[_i4].dispatchEvent(attachEvent);
				};

				for (var _i4 in this.nodes) {
					_loop(_i4);
				}

				for (var _i5 in this.attach) {
					this.attach[_i5]();
				}

				return;
			}

			var subDoc = void 0;

			if (this.template == document) {
				subDoc = this.template;
			} else {
				subDoc = document.createRange().createContextualFragment(this.template);
			}

			_Dom.Dom.mapTags(subDoc, '[cv-prerender]', function (tag) {
				var prerenderAttr = tag.getAttribute('cv-prerender');
				var prerendering = _Cookie.Cookie.get('prerenderer');

				if (prerenderAttr == 'never' && prerendering || prerenderAttr == 'only' && !prerendering) {
					tag.parentNode.removeChild(tag);
				}
			});

			_Dom.Dom.mapTags(subDoc, '[cv-each]', function (tag) {
				var eachAttr = tag.getAttribute('cv-each');
				var carryAttr = tag.getAttribute('cv-carry');
				tag.removeAttribute('cv-each');
				tag.removeAttribute('cv-carry');

				var subTemplate = tag.innerHTML;

				while (tag.firstChild) {
					tag.removeChild(tag.firstChild);
				}

				var carryProps = [];

				if (carryAttr) {
					carryProps = carryAttr.split(',');
				}

				var _eachAttr$split = eachAttr.split(':'),
				    _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
				    eachProp = _eachAttr$split2[0],
				    asProp = _eachAttr$split2[1],
				    keyProp = _eachAttr$split2[2];

				// console.log(this, eachProp);

				var viewList = void 0;

				_this2.args.bindTo(eachProp, function (v, k, t) {
					if (viewList) {
						viewList.remove();
					}

					viewList = new _ViewList.ViewList(subTemplate, asProp, v, keyProp);

					_this2.cleanup.push(function (viewList) {
						return function () {
							viewList.remove();
						};
					}(viewList));

					viewList.parent = _this2;

					viewList.render(tag);

					for (var _i6 in carryProps) {
						_this2.args.bindTo(carryProps[_i6], function (v, k) {
							viewList.args.subArgs[k] = v;
						});
					}
				});

				_this2.viewLists[eachProp] = viewList;
			});

			_Dom.Dom.mapTags(subDoc, '[cv-with]', function (tag) {
				var withAttr = tag.getAttribute('cv-with');
				var carryAttr = tag.getAttribute('cv-carry');
				tag.removeAttribute('cv-with');
				tag.removeAttribute('cv-carry');

				var subTemplate = tag.innerHTML;

				var carryProps = [];

				if (carryAttr) {
					carryProps = carryAttr.split(',');
				}

				while (tag.firstChild) {
					tag.removeChild(tag.firstChild);
				}

				var view = new View();

				_this2.cleanup.push(function (view) {
					return function () {
						// view.remove();
					};
				}(view));

				view.template = subTemplate;
				view.parent = _this2;

				// console.log(carryProps);

				for (var _i7 in carryProps) {
					_this2.args.bindTo(carryProps[_i7], function (v, k) {
						view.args[k] = v;
					});
				}

				for (var _i8 in _this2.args[withAttr]) {
					_this2.args[withAttr].bindTo(_i8, function (v, k) {
						view.args[k] = v;
					});
				}

				// console.log(view);

				view.render(tag);
			});

			_Dom.Dom.mapTags(subDoc, '[cv-link]', function (tag) {
				var LinkAttr = tag.getAttribute('cv-link');

				tag.setAttribute('href', LinkAttr);

				var linkClick = function linkClick(event) {
					event.preventDefault();

					_Router.Router.go(tag.getAttribute('href'));
				};

				tag.addEventListener('click', linkClick);

				_this2.cleanup.push(function (tag, eventListener) {
					return function () {
						tag.removeEventListener('click', eventListener);
						tag = undefined;
						eventListener = undefined;
					};
				}(tag, linkClick));

				tag.removeAttribute('cv-link');
			});

			_Dom.Dom.mapTags(subDoc, '[cv-on]', function (tag) {
				var action = String(tag.getAttribute('cv-on')).split(/;/).map(function (a) {
					return a.split(':');
				}).map(function (object, tag) {
					return function (a) {
						var eventName = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
						var callbackName = a[1];
						var argList = [];
						var groups = /(\w+)(?:\(([\w\s,]+)\))?/.exec(callbackName);
						if (groups.length) {
							callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
							if (groups[2]) {
								argList = groups[2].split(',').map(function (s) {
									return s.trim();
								});
							}
						}

						var eventMethod = void 0;
						var parent = _this2;

						while (parent) {
							if (parent[callbackName]) {
								eventMethod = function eventMethod() {
									var _parent;

									(_parent = parent)[callbackName].apply(_parent, arguments);
								};
							}

							if (parent.viewList && parent.viewList.parent) {
								parent = parent.viewList.parent;
							} else if (parent.parent) {
								parent = parent.parent;
							} else {
								break;
							}
						}

						var eventListener = function (object) {
							return function (event) {
								var argRefs = argList.map(function (arg) {
									if (arg === 'event') {
										return event;
									}
									if (arg in object.args) {
										return object.args[arg];
									}
								});
								// console.log(argList, argRefs);
								if (!(typeof eventMethod == 'function')) {
									// console.log(object);
									// console.trace();
									// console.log(this);
									throw new Error(callbackName + ' is not defined on View object.\n\nTag:\n\n' + tag.outerHTML);
								}
								eventMethod.apply(undefined, _toConsumableArray(argRefs));
							};
						}(object);

						switch (eventName) {
							case '_init':
								eventListener();
								break;

							case '_attach':
								_this2.attach.push(eventListener);
								break;

							case '_detach':
								_this2.detach.push(eventListener);
								break;

							default:
								tag.addEventListener(eventName, eventListener);

								_this2.cleanup.push(function (tag, eventName, eventListener) {
									return function () {
										tag.removeEventListener(eventName, eventListener);
										tag = undefined;
										eventListener = undefined;
									};
								}(tag, eventName, eventListener));
								break;
						}

						return [eventName, callbackName, argList];
					};
				}(_this2, tag));

				tag.removeAttribute('cv-on');
			});

			_Dom.Dom.mapTags(subDoc, '[cv-bind]', function (tag) {
				var bindArg = tag.getAttribute('cv-bind');
				_this2.args.bindTo(bindArg, function (v, k, t) {
					if (t[k] === v) {
						// return;
					}

					if (t[k] instanceof View) {
						t[k].remove();
					}

					if (tag.tagName == 'INPUT' || tag.tagName == 'SELECT') {
						var type = tag.getAttribute('type');
						if (type && type.toLowerCase() == 'checkbox') {
							if (v) {
								tag.checked = true;
							} else {
								tag.checked = false;
							}
						} else if (type !== 'file') {
							tag.value = v || '';
						}
						return;
					}

					if (v instanceof View) {
						v.render(tag);
					} else {
						tag.innerText = v;
					}
				});

				var inputListener = function inputListener(event) {
					if (event.target.getAttribute('type') !== 'password') {
						console.log(event.target.value);
					}

					if (event.target !== tag) {
						return;
					}

					// console.log(event.target.value);

					_this2.args[bindArg] = event.target.value;
				};

				tag.addEventListener('input', inputListener);
				tag.addEventListener('change', inputListener);
				tag.addEventListener('value-changed', inputListener);

				_this2.cleanup.push(function (tag, eventListener) {
					return function () {
						tag.removeEventListener('input', inputListener);
						tag.removeEventListener('change', inputListener);
						tag.removeEventListener('value-changed', inputListener);
						tag = undefined;
						eventListener = undefined;
					};
				}(tag, inputListener));

				tag.removeAttribute('cv-bind');
			});

			_Dom.Dom.mapTags(subDoc, false, function (tag) {
				var regex = /(\[\[(\$?\w+)\]\])/g;

				if (tag.nodeType == Node.TEXT_NODE) {
					var original = tag.nodeValue;

					if (!_this2.interpolatable(original)) {
						return;
					}

					var header = 0;
					var match = void 0;

					while (match = regex.exec(original)) {
						var bindProperty = match[2];

						var unsafeHtml = false;

						if (bindProperty.substr(0, 1) === '$') {
							unsafeHtml = true;
							bindProperty = bindProperty.substr(1);
						}

						var staticPrefix = original.substring(header, match.index);

						header = match.index + match[1].length;

						var _staticNode = document.createTextNode(staticPrefix);

						tag.parentNode.insertBefore(_staticNode, tag);

						var dynamicNode = void 0;

						if (unsafeHtml) {
							dynamicNode = document.createElement('div');
						} else {
							dynamicNode = document.createTextNode('');
						}

						tag.parentNode.insertBefore(dynamicNode, tag);

						_this2.args.bindTo(bindProperty, function (dynamicNode, unsafeHtml) {
							return function (v, k, t) {
								// console.log(`Setting ${k} to ${v}`, dynamicNode);
								if (t[k] instanceof View) {
									t[k].remove();
								}

								dynamicNode.nodeValue = '';

								if (v instanceof View) {

									v.render(tag.parentNode, dynamicNode);
								} else {
									// console.log(dynamicNode);
									if (unsafeHtml) {
										dynamicNode.innerHTML = v;
									} else {
										dynamicNode.nodeValue = v;
									}
								}
							};
						}(dynamicNode, unsafeHtml));
					}

					var staticSuffix = original.substring(header);

					var staticNode = document.createTextNode(staticSuffix);

					tag.parentNode.insertBefore(staticNode, tag);

					tag.nodeValue = '';
				}

				if (tag.nodeType == Node.ELEMENT_NODE) {
					var _loop2 = function _loop2(_i9) {
						if (!_this2.interpolatable(tag.attributes[_i9].value)) {
							return 'continue';
						}

						var header = 0;
						var match = void 0;
						var original = tag.attributes[_i9].value;
						var attribute = tag.attributes[_i9];

						var bindProperties = {};
						var segments = [];

						while (match = regex.exec(original)) {
							segments.push(original.substring(header, match.index));

							if (!bindProperties[match[2]]) {
								bindProperties[match[2]] = [];
							}

							bindProperties[match[2]].push(segments.length);

							segments.push(match[1]);

							header = match.index + match[1].length;
						}

						segments.push(original.substring(header));

						for (var j in bindProperties) {
							_this2.args.bindTo(j, function (v, k, t, d) {
								for (var _i10 in bindProperties) {
									for (var _j in bindProperties[_i10]) {
										segments[bindProperties[_i10][_j]] = t[_i10];

										if (k === _i10) {
											segments[bindProperties[_i10][_j]] = v;
										}
									}
								}
								tag.setAttribute(attribute.name, segments.join(''));
							});
						}

						// console.log(bindProperties, segments);

						// console.log(tag.attributes[i].name, tag.attributes[i].value);
					};

					for (var _i9 = 0; _i9 < tag.attributes.length; _i9++) {
						var _ret2 = _loop2(_i9);

						if (_ret2 === 'continue') continue;
					}
				}
			});

			_Dom.Dom.mapTags(subDoc, '[cv-ref]', function (tag) {
				var refAttr = tag.getAttribute('cv-ref');

				var _refAttr$split = refAttr.split(':'),
				    _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
				    refProp = _refAttr$split2[0],
				    refClassname = _refAttr$split2[1],
				    refKey = _refAttr$split2[2];

				var refClass = _this2.stringToClass(refClassname);

				tag.removeAttribute('cv-ref');

				if (_this2.viewList) {
					if (!_this2.viewList.parent.tags[refProp]) {
						_this2.viewList.parent.tags[refProp] = [];
					}

					var refKeyVal = _this2.args[refKey];

					_this2.viewList.parent.tags[refProp][refKeyVal] = new refClass(tag, _this2, refProp, refKeyVal);
				} else {
					_this2.tags[refProp] = new refClass(tag, _this2, refProp);
				}
			});

			_Dom.Dom.mapTags(subDoc, '[cv-if]', this.mapIfTags.bind(this));

			this.nodes = [];

			this.firstNode = document.createComment('Template ' + this._id + ' Start');

			this.nodes.push(this.firstNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.firstNode, insertPoint);
				} else {
					parentNode.appendChild(this.firstNode);
				}
			}

			while (subDoc.firstChild) {
				var newNode = subDoc.firstChild;
				var _attachEvent = new Event('cvDomAttached', { bubbles: true, target: newNode });

				this.nodes.push(subDoc.firstChild);

				if (parentNode) {
					if (insertPoint) {
						parentNode.insertBefore(subDoc.firstChild, insertPoint);
					} else {
						parentNode.appendChild(subDoc.firstChild);
					}
				}

				_Dom.Dom.mapTags(newNode, false, function (node) {
					// node.dispatchEvent(attachEvent);
				});

				newNode.dispatchEvent(_attachEvent);
			}

			this.lastNode = document.createComment('Template ' + this._id + ' End');

			this.nodes.push(this.lastNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.lastNode, insertPoint);
				} else {
					parentNode.appendChild(this.lastNode);
				}
			}

			for (var _i11 in this.attach) {
				this.attach[_i11]();
			}

			this.postRender(parentNode);

			// return this.nodes;
		}
	}, {
		key: 'mapIfTags',
		value: function mapIfTags(tag) {
			var _this3 = this;

			var ifProperty = tag.getAttribute('cv-if');

			var inverted = false;

			if (ifProperty.substr(0, 1) === '!') {
				inverted = true;
				ifProperty = ifProperty.substr(1);
			}

			var ifDoc = document.createRange().createContextualFragment('');

			this.args.bindTo(ifProperty, function (tag, ifDoc) {
				return function (v) {
					var detachEvent = new Event('cvDomDetached');
					var attachEvent = new Event('cvDomAttached');

					if (inverted) {
						v = !v;
					}

					_Dom.Dom.mapTags(tag, '[cv-if]', _this3.mapIfTags.bind(_this3));

					if (v) {
						while (ifDoc.firstChild) {
							var moveTag = ifDoc.firstChild;

							tag.prepend(moveTag);

							moveTag.dispatchEvent(detachEvent);

							_Dom.Dom.mapTags(moveTag, false, function (node) {
								node.dispatchEvent(detachEvent);
							});
						}
					} else {
						while (tag.firstChild) {
							var _moveTag = tag.firstChild;

							ifDoc.prepend(_moveTag);

							_moveTag.dispatchEvent(attachEvent);

							_Dom.Dom.mapTags(_moveTag, false, function (node) {
								node.dispatchEvent(attachEvent);
							});
						}
					}
				};
			}(tag, ifDoc));

			tag.removeAttribute('cv-if');
		}
	}, {
		key: 'postRender',
		value: function postRender(parentNode) {}
	}, {
		key: 'interpolatable',
		value: function interpolatable(str) {
			return !!String(str).match(/\[\[\$?\w+\??\]\]/);
		}
	}, {
		key: 'uuid',
		value: function uuid() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
				return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.nodes) {
				this.nodes[i].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			for (var _i12 in this.tags) {
				if (Array.isArray(this.tags[_i12])) {
					for (var j in this.tags[_i12]) {
						this.tags[_i12][j].remove();
					}
					continue;
				}
				this.tags[_i12].remove();
			}
		}
	}, {
		key: 'update',
		value: function update() {}
	}, {
		key: 'beforeUpdate',
		value: function beforeUpdate(args) {}
	}, {
		key: 'afterUpdate',
		value: function afterUpdate(args) {}
	}, {
		key: 'stringToClass',
		value: function stringToClass(refClassname) {
			var refClassSplit = refClassname.split('/');
			var refShortClassname = refClassSplit[refClassSplit.length - 1];
			var refClass = require(refClassname);

			return refClass[refShortClassname];
		}
	}]);

	return View;
}();
});

;require.register("base/ViewList.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ViewList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewList = exports.ViewList = function () {
	function ViewList(template, subProperty, list) {
		var _this = this;

		var keyProperty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, ViewList);

		this.args = _Bindable.Bindable.makeBindable({});
		this.args.value = _Bindable.Bindable.makeBindable(list || {});
		this.args.subArgs = _Bindable.Bindable.makeBindable({});
		this.views = {};
		this.template = template;
		this.subProperty = subProperty;
		this.keyProperty = keyProperty;
		this.tag = null;
		this.paused = false;

		this.args.value.before.push(function (t) {
			// console.log(t.executing);
			if (t.executing == 'bindTo') {
				return;
			}
			_this.paused = true;
		});

		this.args.value.after.push(function (t) {
			if (_this.paused) {
				// console.log(t.executing);
				_this.reRender();
			}
			_this.paused = false;
		});

		// console.log(this.args);

		this.args.value.bindTo(function (v, k, t, d) {

			if (_this.paused) {
				return;
			}

			if (d) {
				_this.views[k].remove();

				delete _this.views[k];
				// console.log(`Deleting ${k}`, v, this.views);

				return;
			}

			// console.log(`Setting ${k}`, v, this.views);

			if (!_this.views[k]) {
				var view = new _View.View();

				_this.views[k] = view;

				_this.views[k].template = _this.template;

				_this.views[k].parent = _this.parent;
				_this.views[k].viewList = _this;

				_this.args.subArgs.bindTo(function (v, k, t, d) {
					view.args[k] = v;
				});

				_this.views[k].args[_this.subProperty] = v;

				if (_this.keyProperty) {
					_this.views[k].args[_this.keyProperty] = k;
				}

				t[k] = v;

				_this.reRender();
			}

			_this.views[k].args[_this.subProperty] = v;
		});
	}

	_createClass(ViewList, [{
		key: 'render',
		value: function render(tag) {
			for (var i in this.views) {
				this.views[i].render(tag);
			}

			this.tag = tag;

			// console.log(tag);
		}
	}, {
		key: 'reRender',
		value: function reRender() {
			var _this2 = this;

			// console.log('rerender');
			if (!this.tag) {
				return;
			}

			var views = [];

			for (var i in this.views) {
				views[i] = this.views[i];
			}

			var finalViews = [];

			var _loop = function _loop(_i) {
				var found = false;
				for (var j in views) {
					if (views[j] && _this2.args.value[_i] === views[j].args[_this2.subProperty]) {
						found = true;
						finalViews[_i] = views[j];
						delete views[j];
						break;
					}
				}
				if (!found) {
					var viewArgs = {};
					viewArgs[_this2.subProperty] = _this2.args.value[_i];
					finalViews[_i] = new _View.View(viewArgs);

					finalViews[_i].template = _this2.template;
					finalViews[_i].parent = _this2.parent;
					finalViews[_i].viewList = _this2;

					finalViews[_i].args[_this2.keyProperty] = _i;

					_this2.args.subArgs.bindTo(function (v, k, t, d) {
						finalViews[_i].args[k] = v;
					});
				}
			};

			for (var _i in this.args.value) {
				_loop(_i);
			}

			var appendOnly = true;

			for (var _i2 in this.views) {
				if (this.views[_i2] !== finalViews[_i2]) {
					appendOnly = false;
				}
			}

			if (!appendOnly) {
				while (this.tag.firstChild) {
					this.tag.removeChild(this.tag.firstChild);
				}

				for (var _i3 in finalViews) {
					finalViews[_i3].render(this.tag);
				}
			} else {
				var _i4 = this.views.length || 0;

				while (finalViews[_i4]) {
					finalViews[_i4].render(this.tag);
					_i4++;
				}
			}

			this.views = finalViews;
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.views) {
				this.views[i].remove();
			}

			this.views = [];

			while (this.tag.firstChild) {
				this.tag.removeChild(this.tag.firstChild);
			}
		}
	}]);

	return ViewList;
}();
});

;require.register("form/ButtonField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ButtonField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonField = exports.ButtonField = function (_Field) {
	_inherits(ButtonField, _Field);

	function ButtonField(values, form, parent, key) {
		_classCallCheck(this, ButtonField);

		var _this = _possibleConstructorReturn(this, (ButtonField.__proto__ || Object.getPrototypeOf(ButtonField)).call(this, values, form, parent, key));

		_this.args.title = _this.args.title || _this.args.value;
		_this.template = '\n\t\t\t<label cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\tname  = "' + _this.args.name + '"\n\t\t\t\t\ttype  = "' + _this.args.attrs.type + '"\n\t\t\t\t\tvalue = "[[title]]"\n\t\t\t\t\ton    = "click:clicked(event)"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(ButtonField, [{
		key: 'clicked',
		value: function clicked(event) {
			this.form.buttonClick(this.args.name);
		}
	}]);

	return ButtonField;
}(_Field2.Field);
});

;require.register("form/Field.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Field = undefined;

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_View) {
	_inherits(Field, _View);

	function Field(values, form, parent, key) {
		_classCallCheck(this, Field);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, values));

		_this.args.title = _this.args.title || '';
		_this.args.value = _this.args.value || '';

		_this.args.valueString = '';

		_this.form = form;
		_this.parent = parent;
		_this.key = key;

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;

		var setting = null;

		_this.args.bindTo('value', function (v, k) {
			// console.trace();
			// console.log(this.args.name, v, k);

			if (setting == key) {
				return;
			}

			// console.log(this.args.name, v, k);

			_this.args.valueString = JSON.stringify(v || '', null, 4);

			setting = key;

			_this.parent.args.value[key] = v;
			setting = null;
		});

		_this.parent.args.value.bindTo(key, function (v, k) {
			if (setting == k) {
				return;
			}

			setting = k;

			_this.args.value = v;

			setting = null;
		});

		_this.template = '\n\t\t\t<label cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>\n\t\t\t\t<input\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\ttype    = "' + (_this.args.attrs.type || 'text') + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		//type    = "${this.args.attrs.type||'text'}"
		return _this;
	}

	return Field;
}(_View2.View);
});

;require.register("form/FieldSet.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FieldSet = undefined;

var _Field2 = require('./Field');

var _Form = require('./Form');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldSet = exports.FieldSet = function (_Field) {
	_inherits(FieldSet, _Field);

	function FieldSet(values, form, parent, key) {
		_classCallCheck(this, FieldSet);

		var _this = _possibleConstructorReturn(this, (FieldSet.__proto__ || Object.getPrototypeOf(FieldSet)).call(this, values, form, parent, key));

		_this.args.value = {};
		_this.args.fields = _Form.Form.renderFields(values.children, _this);
		_this.template = '\n\t\t\t<label>\n\t\t\t\t<span cv-if = "title">[[title]]:</span>\n\t\t\t\t<fieldset name = "' + _this.args.name + '">\n\t\t\t\t\t<div cv-each = "fields:field">\n\t\t\t\t\t\t<div cv-bind = "field"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</fieldset>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return FieldSet;
}(_Field2.Field);
});

;require.register("form/FileField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FileField = undefined;

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FileField = exports.FileField = function (_Field) {
	_inherits(FileField, _Field);

	function FileField(values, form, parent, key) {
		_classCallCheck(this, FileField);

		var _this = _possibleConstructorReturn(this, (FileField.__proto__ || Object.getPrototypeOf(FileField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label>\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t/>\n\t\t\t\t<span style = "display:none" cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return FileField;
}(_Field2.Field);
});

;require.register("form/Form.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _Field = require('./Field');

var _FieldSet = require('./FieldSet');

var _SelectField = require('./SelectField');

var _HtmlField = require('./HtmlField');

var _HiddenField = require('./HiddenField');

var _ButtonField = require('./ButtonField');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Router           } from 'Router';

// import { Repository       } from '../Repository';

// import { FieldSet         } from './FieldSet';

// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';

var Form = exports.Form = function (_View) {
	_inherits(Form, _View);

	function Form(skeleton) {
		_classCallCheck(this, Form);

		var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, {}));

		_this.args.flatValue = _this.args.flatValue || {};
		_this.args.value = _this.args.value || {};

		_this.args.method = skeleton._method || 'GET';

		_this.args.classes = _this.args.classes || [];

		_this.args.bindTo('classes', function (v) {
			_this.args._classes = v.join(' ');
		});

		_this._onSubmit = [];
		_this.action = '';
		_this.template = '\n\t\t\t<form\n\t\t\t\tclass   = "[[_classes]]"\n\t\t\t\tmethod  = "[[method]]"\n\t\t\t\tcv-each = "fields:field"\n\t\t\t\tcv-on   = "submit:submit(event)"\n\t\t\t\tcv-ref  = "formTag:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t';

		_this.args.fields = Form.renderFields(skeleton, _this);

		_this.args.bindTo('value', function (v) {
			_this.args.valueString = JSON.stringify(v, null, 4);
		});
		return _this;
	}

	_createClass(Form, [{
		key: 'submit',
		value: function submit(event) {
			event.preventDefault();

			this.args.valueString = JSON.stringify(this.args.value, null, 4);

			for (var i in this._onSubmit) {
				this._onSubmit[i](this, event);
			}
		}
	}, {
		key: 'buttonClick',
		value: function buttonClick(event) {
			// console.log(event);
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(callback) {
			this._onSubmit.push(callback);
		}
	}, {
		key: 'queryString',
		value: function queryString() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var parts = [];

			for (var i in this.args.flatValue) {
				args[i] = args[i] || this.args.flatValue[i];
			}

			for (var _i in args) {
				parts.push(_i + '=' + encodeURIComponent(args[_i]));
			}

			return parts.join('&');
		}
	}, {
		key: 'populate',
		value: function populate(values) {
			// console.log(values);

			for (var i in values) {
				this.args.value[i] = values[i];
			}
		}
	}], [{
		key: 'renderFields',
		value: function renderFields(skeleton) {
			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var fields = {};

			var _loop = function _loop(i) {
				if (fields[i]) {
					return 'continue';
				}
				if (i.substr(0, 1) == '_') {
					return 'continue';
				}

				var field = null;
				var form = null;
				if (parent instanceof Form) {
					form = parent;
				} else {
					form = parent.form;
				}

				switch (skeleton[i].type) {
					case 'fieldset':
						field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
						break;
					case 'select':
						field = new _SelectField.SelectField(skeleton[i], form, parent, i);
						break;
					case 'html':
						field = new _HtmlField.HtmlField(skeleton[i], form, parent, i);
						break;
					case 'submit':
					case 'button':
						field = new _ButtonField.ButtonField(skeleton[i], form, parent, i);
						break;
					case 'hidden':
						field = new _HiddenField.HiddenField(skeleton[i], form, parent, i);
						break;
					default:
						field = new _Field.Field(skeleton[i], form, parent, i);
						break;
				}

				fields[i] = field;

				field.args.bindTo('value', function (v, k, t, d) {
					// console.log(t,v);
					if (t.type == 'html' && !t.contentEditable) {
						return;
					}
					form.args.flatValue[field.args.name] = v;
				});
			};

			for (var i in skeleton) {
				var _ret = _loop(i);

				if (_ret === 'continue') continue;
			}
			return fields;
		}
	}]);

	return Form;
}(_View2.View);
});

;require.register("form/HiddenField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HiddenField = undefined;

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = exports.HiddenField = function (_Field) {
	_inherits(HiddenField, _Field);

	function HiddenField(values, form, parent, key) {
		_classCallCheck(this, HiddenField);

		var _this = _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label style = "display:none" cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t<span style = "display:none" cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return HiddenField;
}(_Field2.Field);
});

;require.register("form/HtmlField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HtmlField = undefined;

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlField = exports.HtmlField = function (_View) {
	_inherits(HtmlField, _View);

	function HtmlField(values, form, parent, key) {
		_classCallCheck(this, HtmlField);

		var _this = _possibleConstructorReturn(this, (HtmlField.__proto__ || Object.getPrototypeOf(HtmlField)).call(this, values, form, parent, key));

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;
		_this.args.contentEditable = _this.args.attrs.contenteditable || false;
		_this.template = '<div contenteditable = "[[contentEditable]]">[[$value]]</div>';
		return _this;
	}

	return HtmlField;
}(_View2.View);
});

;require.register("form/SelectField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SelectField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectField = exports.SelectField = function (_Field) {
	_inherits(SelectField, _Field);

	function SelectField(values, form, parent, key) {
		_classCallCheck(this, SelectField);

		var _this = _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>\n\t\t\t\t<select\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-each = "options:option:optionText"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<option value = "[[option]]">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(SelectField, [{
		key: 'getLabel',
		value: function getLabel(value) {
			for (var i in this.args.options) {
				if (this.args.options[i] == value) {
					return i;
				}
			}
		}
	}]);

	return SelectField;
}(_Field2.Field);
});

;require.register("tag/PopOutTag.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PopOutTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Dom = require('../base/Dom');

var _Tag2 = require('../base/Tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopOutTag = exports.PopOutTag = function (_Tag) {
	_inherits(PopOutTag, _Tag);

	function PopOutTag(element, parent, ref, index) {
		_classCallCheck(this, PopOutTag);

		var _this = _possibleConstructorReturn(this, (PopOutTag.__proto__ || Object.getPrototypeOf(PopOutTag)).call(this, element, parent, ref, index));

		_this.poppedOut = false;
		_this.style = element.getAttribute('style');
		_this.moving = false;

		_this.leftDuration = 0;
		_this.unpoppedStyle = '';
		_this.previousScroll = 0;

		element.classList.add('unpopped');

		_this.scrollStyle;

		//this.ps = new PerfectScrollbar(element, {wheelPropagation: true});
		_this.rect;
		_this.clickListener = function (event) {
			if (!_this.poppedOut || !_this.rect) {
				_this.rect = element.getBoundingClientRect();
			}

			if (!_this.element.contains(event.target)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			var leftDuration = 0.333;

			if (_this.moving) {
				return;
			}

			if (!_this.poppedOut) {
				_this.previousScroll = window.scrollY;

				if (leftDuration) {
					_this.leftDuration = leftDuration;
				}

				_this.unpoppedStyle = '\n\t\t\t\t\t;position:  fixed;\n\t\t\t\t\tleft:       ' + _this.rect.x + 'px;\n\t\t\t\t\ttop:        ' + _this.rect.y + 'px;\n\t\t\t\t\twidth:      ' + _this.rect.width + 'px;\n\t\t\t\t\theight:     ' + _this.rect.height + 'px;\n\t\t\t\t\tz-index:    99999;\n\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t';

				var style = _this.style + _this.unpoppedStyle;

				element.setAttribute('style', style);

				document.body.style.overflow = 'hidden';
				document.body.style.overflowY = 'hidden';

				setTimeout(function () {
					style += '\n\t\t\t\t\t\t;top:   0px;\n\t\t\t\t\t\tleft:   0px;\n\t\t\t\t\t\twidth:  100%;\n\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\t';

					_this.moving = true;

					element.classList.add('unpopped');

					setTimeout(function () {
						element.classList.add('popped');
						element.classList.remove('unpopped');
					}, _this.leftDuration * 333);

					// element.setAttribute('style', style + ';position:absolute');
					setTimeout(function () {
						element.setAttribute('style', style + (';transition: ' + _this.leftDuration + 's;'));
					}, 10);
					setTimeout(function () {
						PopOutTag.popLevel();
						document.body.setAttribute('style', 'height:0px;overflow:hidden;');
						window.scrollTo(0, 0);
						_this.moving = false;
						_Dom.Dom.mapTags(element, false, function (tag) {
							var event = new Event('cvPopped');

							tag.dispatchEvent(event);

							_this.scrollStyle = element.getAttribute('style');
						});
					}, _this.leftDuration * 1000);
				}, 1);

				_this.poppedOut = !_this.poppedOut;
			} else if (event.target.matches('.closeButton') && _this.poppedOut) {
				window.scrollTo(0, _this.previousScroll);
				setTimeout(function () {}, 1);

				var _style = _this.style + _this.unpoppedStyle + (';transition: ' + _this.leftDuration + 's;');

				if (0 === PopOutTag.unpopLevel()) {
					document.body.setAttribute('style', '');
				}

				element.classList.add('unpopped');

				element.setAttribute('style', _style);

				_this.moving = true;

				setTimeout(function () {
					element.setAttribute('style', _this.style);
					element.classList.remove('popped');
				}, _this.leftDuration * 500);
				setTimeout(function () {
					element.setAttribute('style', _this.style);
					_this.moving = false;
					_Dom.Dom.mapTags(element, false, function (tag) {
						var event = new Event('cvUnpopped');

						tag.dispatchEvent(event);
					});
				}, _this.leftDuration * 1000);

				_this.poppedOut = !_this.poppedOut;
			}
		};

		element.addEventListener('click', _this.clickListener);

		_this.cleanup.push(function (element) {
			return function () {
				element.removeEventListener('click', _this.clickListener);
			};
		}(element));
		return _this;
	}

	_createClass(PopOutTag, [{
		key: 'pause',
		value: function pause() {
			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'pause', this).call(this);
			document.body.setAttribute('style', '');

			console.log('!!!');
		}
	}], [{
		key: 'popLevel',
		value: function popLevel() {
			if (!this.level) {
				this.level = 0;
			}

			this.level++;

			return this.level;
		}
	}, {
		key: 'unpopLevel',
		value: function unpopLevel() {
			if (!this.level) {
				this.level = 0;
			}

			this.level--;

			return this.level;
		}
	}]);

	return PopOutTag;
}(_Tag2.Tag);
});

;require.register("tag/ScrollTag.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ScrollTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tag2 = require('../base/Tag');

var _Dom = require('../base/Dom');

var _Bindable = require('../base/Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollTag = exports.ScrollTag = function (_Tag) {
	_inherits(ScrollTag, _Tag);

	function ScrollTag(element, parent, ref, index) {
		_classCallCheck(this, ScrollTag);

		var _this = _possibleConstructorReturn(this, (ScrollTag.__proto__ || Object.getPrototypeOf(ScrollTag)).call(this, element, parent, ref, index));

		_this.topEdge = false;
		_this.resizeListening = false;
		_this.visible = false;
		_this.offsetTop = false;
		_this.offsetBottom = false;

		_this.threshold = 0;

		_this.subscribedTo = [];

		_this.scrollListener = function (event) {
			var tag = event.target;
			for (var i in tag.scrollSubTags) {
				tag.scrollSubTags[i].scrolled(tag);
			}
		};

		_this.resizeListenr = function (event) {
			for (var i in _this.resizeTags) {
				_this.resizeTags[i].scrolled(event.target);
			}
		};

		_this.attachListener = function (e) {
			if (e.path[e.path.length - 1] !== window) {
				return;
			}
			var current = e.target;
			while (current) {
				current = _Bindable.Bindable.makeBindable(current);

				_this.addScrollListener(current);

				_this.scrolled(current);

				current = current.parentNode;
			}
		};

		_this.element.addEventListener('cvDomAttached', _this.attachListener);

		_this.cleanup.push(function (element) {
			return function () {
				element.removeEventListener('cvDomAttached', _this.attachListener);
			};
		}(_this.element));

		ScrollTag.addResizeListener(_this);

		_this.bindTo('visible', function (v) {
			var scrolledEvent = void 0;
			if (v) {
				scrolledEvent = new Event('cvScrolledIn');
			} else {
				scrolledEvent = new Event('cvScrolledOut');
			}

			_Dom.Dom.mapTags(_this.element, false, function (node) {
				node.dispatchEvent(scrolledEvent);
			});

			_this.element.dispatchEvent(scrolledEvent);
		});

		_this.bindTo('offsetTop', function (v) {
			var scrolledEvent = new CustomEvent('cvScrolled', {
				detail: { offset: v }
			});
			_Dom.Dom.mapTags(_this.element, false, function (node) {
				node.dispatchEvent(scrolledEvent);
			});

			_this.element.dispatchEvent(scrolledEvent);
		});
		return _this;
	}

	_createClass(ScrollTag, [{
		key: 'scrolled',
		value: function scrolled(scroller) {
			var current = this.element;

			var offsetTop = 0,
			    subOffsetTop = 0,
			    offsetBottom = 0,
			    subOffsetBottom = 0;

			while (current) {
				if (offsetTop - current.scrollTop < subOffsetTop) {
					subOffsetTop = offsetTop - current.scrollTop;
				}

				if (current.offsetTop) {
					offsetTop += current.offsetTop;
				}

				if (typeof current.scrollTop !== 'undefined') {
					offsetTop -= current.scrollTop;
					offsetBottom = offsetTop + this.element.clientHeight - current.clientHeight;
				}

				if (current.parentNode && current.parentNode.offsetTop && current.parentNode !== current.offsetParent) {
					offsetTop -= current.parentNode.offsetTop;
				}

				if (offsetBottom > subOffsetBottom) {
					subOffsetBottom = offsetBottom;
				}

				current = current.parentNode;
			}

			if (offsetTop < -this.threshold || subOffsetTop < -this.threshold) {
				this.topEdge = false;
			} else {
				this.topEdge = true;

				if (offsetBottom - this.element.clientHeight > this.threshold) {
					this.topEdge = false;
				}
			}

			this.bottomEdge = false;

			if (offsetBottom <= this.threshold) {
				this.bottomEdge = true;

				if (offsetTop + this.element.clientHeight < -this.threshold) {
					this.bottomEdge = false;
				}
			}

			// this.offsetTop    = offsetTop;
			// this.offsetBottom = this.offsetBottom

			var visible = false;

			if (offsetBottom <= this.element.clientHeight && offsetTop > -this.element.clientHeight) {
				visible = true;
			}

			this.proxy.visible = visible;
			this.proxy.offsetTop = offsetTop;
			this.proxy.offsetBottom = offsetBottom;
		}
	}, {
		key: 'addScrollListener',
		value: function addScrollListener(tag) {
			var _this2 = this;

			if (!tag.scrollListener) {
				Object.defineProperty(tag, 'scrollListener', {
					enumerable: false,
					writable: true
				});

				Object.defineProperty(tag, 'scrollSubTags', {
					enumerable: false,
					writable: true
				});

				tag.scrollListener = true;
				tag.scrollSubTags = [];

				tag.addEventListener('scroll', this.scrollListener);

				this.cleanup.push(function (element) {
					return function () {
						element.removeEventListener('scroll', _this2.scrollListener);
						element.scrollSubTags = undefined;
					};
				}(tag));
			}

			for (var i in this.subscribedTo) {
				if (this.subscribedTo[i] === tag) {
					return;
				}
			}

			if (tag.scrollSubTags) {
				tag.scrollSubTags.push(this);
			}
		}
	}], [{
		key: 'addResizeListener',
		value: function addResizeListener(tag) {
			this.resizeTags = [];

			if (!this.resizeListener) {
				// window.addEventListener('resize', this.resizeListener);

				// this.cleanup.push(()=>{
				// 	window.removeEventListener('resize', this.resizeListener);
				// });
			}

			this.resizeListener = true;

			this.resizeTags.push(tag);
		}
	}]);

	return ScrollTag;
}(_Tag2.Tag);
});

;require.register("toast/Toast.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Toast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _ToastAlert = require('./ToastAlert');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toast = exports.Toast = function (_View) {
	_inherits(Toast, _View);

	_createClass(Toast, null, [{
		key: 'instance',
		value: function instance() {
			if (!this.inst) {
				this.inst = new this();
			}
			return this.inst;
		}
	}]);

	function Toast() {
		_classCallCheck(this, Toast);

		var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this));

		_this.template = '\n\t\t\t<div id = "[[_id]]" cv-each = "alerts:alert" class = "toast">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t';
		// this.style = {
		// 	'': {
		// 		position:   'fixed'
		// 		, top:      '0px'
		// 		, right:    '0px'
		// 		, padding:  '8px'
		// 		, 'z-index':'999999'
		// 		, display:  'flex'
		// 		, 'flex-direction': 'column-reverse'
		// 	}
		// };

		_this.args.alerts = [];

		_this.args.alerts.bindTo(function (v) {
			console.log(v);
		});
		return _this;
	}

	_createClass(Toast, [{
		key: 'pop',
		value: function pop(alert) {
			var _this2 = this;

			var index = this.args.alerts.length;

			this.args.alerts.push(alert);

			alert.decay(function (alert) {
				return function () {
					for (var i in _this2.args.alerts) {
						if (_this2.args.alerts) {
							_this2.args.alerts[i] === alert;

							_this2.args.alerts.splice(i, 1);
							return;
						}
					}
				};
			}(alert));
		}
	}]);

	return Toast;
}(_View2.View);
});

;require.register("toast/ToastAlert.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ToastAlert = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToastAlert = exports.ToastAlert = function (_View) {
	_inherits(ToastAlert, _View);

	function ToastAlert(args) {
		_classCallCheck(this, ToastAlert);

		var _this = _possibleConstructorReturn(this, (ToastAlert.__proto__ || Object.getPrototypeOf(ToastAlert)).call(this, args));

		_this.args.time = _this.args.time || 10000;
		_this.init = _this.args.time;
		_this.args.opacity = 1;
		_this.args.title = _this.args.title || 'Standard alert';
		_this.args.body = _this.args.body || 'This is a standard alert.';
		_this.template = '\n\t\t\t<div id = "[[_id]]" style = "opacity:[[opacity]]" class = "alert">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t';
		return _this;
	}

	_createClass(ToastAlert, [{
		key: 'decay',
		value: function decay(complete) {
			var _this2 = this;

			var decayInterval = 16;
			var decay = setInterval(function () {
				if (_this2.args.time > 0) {
					_this2.args.time -= decayInterval;
					_this2.args.opacity = _this2.args.time / _this2.init;

					if (_this2.args.time <= 0) {
						if (complete) {
							complete();
						}
						clearInterval(decay);
					}
				}
			}, decayInterval);
		}
	}]);

	return ToastAlert;
}(_View2.View);
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=curvature.js.map