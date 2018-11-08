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
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = exports.Config = function Config() {
  _classCallCheck(this, Config);
};

Config.backend = 'http://dev.sean.letsvue.com/';
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

		_this.template = '\n\t\t\t<a cv-link = "user">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = "user/login">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/register">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/logout">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Login via FaceBook"\n\t\t\t \tcv-on = "click:facebookLogin(event)"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Log Out"\n\t\t\t \tcv-on = "click:logout(event)"\n\t\t\t />\n\t\t';
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

var _Bindable = require('../base/Bindable');

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
			var _this2 = this;

			this.args = this.args || _Bindable.Bindable.makeBindable({});
			if (window.prerenderer) {
				return;
			}
			return this.request(this.uri + 'current', false, false, false).then(function (response) {
				if (response.body.roles) {
					for (var i in response.body.roles) {
						if (response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator') {
							response.body.isAdmin = true;
						}
					}
				}
				_this2.args.current = response.body;
				return response;
			});
		}
	}, {
		key: 'login',
		value: function login() {
			return this.request(_Config.Config.backend + '/user/login');
		}
	}, {
		key: 'logout',
		value: function logout() {
			this.args = this.args || _Bindable.Bindable.makeBindable({});
			this.args.current = null;
			return this.request(this.uri + 'logout', false, {}, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'onChange',
		value: function onChange(callback) {
			this.args = this.args || _Bindable.Bindable.makeBindable({});
			this.args.bindTo('current', callback);
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);

// setInterval(() => {
// 	UserRepository.getCurrentUser();
// 	console.log('!!!');
// }, 5000);
});

require.register("base/Bindable.js", function(exports, require, module) {
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
            if (!object.___binding___) {
                return false;
            }

            return object.___binding___ === Bindable;
        }
    }, {
        key: 'makeBindable',
        value: function makeBindable(object) {

            if (!object || object.___binding___ || (typeof object === 'undefined' ? 'undefined' : _typeof(object)) !== 'object' || object instanceof Node) {
                return object;
            }

            Object.defineProperty(object, '___ref___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, 'bindTo', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___binding___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___bindingAll___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___isBindable___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___executing___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___stack___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___stackTime___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___before___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___after___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, 'toString', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___setCount___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___wrapped___', {
                enumerable: false,
                writable: true
            });

            Object.defineProperty(object, '___object___', {
                enumerable: false,
                writable: true
            });
            object.___object___ = object;
            object.___isBindable___ = Bindable;
            object.___wrapped___ = {};
            object.___binding___ = {};
            object.___bindingAll___ = [];
            object.bindTo = function (object) {
                return function (property) {
                    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                    if (callback == null) {
                        callback = property;
                        object.___bindingAll___.push(callback);
                        for (var i in object) {
                            callback(object[i], i, object, false);
                        }
                        return;
                    }

                    if (!object.___binding___[property]) {
                        object.___binding___[property] = [];
                    }

                    object.___binding___[property].push(callback);

                    callback(object[property], property, object, false);
                };
            }(object);

            object.___stack___ = [];
            object.___stackTime___ = [];
            object.___before___ = [];
            object.___after___ = [];
            object.___setCount___ = {};

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
                        if (value.___isBindable___ !== Bindable) {
                            value = Bindable.makeBindable(value);

                            for (var _i in value) {
                                if (value[_i] && _typeof(value[_i]) == 'object') {
                                    value[_i] = Bindable.makeBindable(value[_i]);
                                }
                            }
                        }
                    }

                    for (var _i2 in object.___bindingAll___) {
                        object.___bindingAll___[_i2](value, key, target, false);
                    }

                    var stop = false;

                    if (key in object.___binding___) {
                        for (var _i3 in object.___binding___[key]) {
                            if (object.___binding___[key][_i3](value, key, target, false) === false) {
                                stop = true;
                            }
                        }
                    }

                    if (!stop) {
                        var descriptor = Object.getOwnPropertyDescriptor(target, key);

                        var excluded = target instanceof File && key == 'lastModifiedDate';

                        if (!excluded && (!descriptor || descriptor.writable)) {
                            target[key] = value;
                        }
                    }

                    if (!target.___setCount___[key]) {
                        target.___setCount___[key] = 0;
                    }

                    target.___setCount___[key]++;

                    var warnOn = 10;

                    if (target.___setCount___[key] > warnOn && value instanceof Object) {
                        // console.log(
                        //     'Warning: Resetting bindable reference "' +
                        //     key +
                        //     '" to object ' +
                        //     target.___setCount___[key] +
                        //     ' times.'
                        // );
                    }

                    return true;
                };
            }(object);

            var del = function (object) {
                return function (target, key) {
                    if (!(key in target)) {
                        return true;
                    }

                    for (var _i4 in object.___bindingAll___) {
                        object.___bindingAll___[_i4](undefined, key, target, true);
                    }

                    if (key in object.___binding___) {
                        for (var _i5 in object.___binding___[key]) {
                            object.___binding___[key][_i5](undefined, key, target, true);
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
                    if (target[key] instanceof Function) {

                        if (target.___wrapped___[key]) {
                            return target.___wrapped___[key];
                        }

                        target.___wrapped___[key] = function () {
                            target.___executing___ = key;

                            target.___stack___.unshift(key);
                            // target.___stackTime___.unshift((new Date).getTime());

                            // console.log(`Start ${key}()`);

                            for (var _i6 in target.___before___) {
                                target.___before___[_i6](target, key, object);
                            }

                            var ret = target[key].apply(target, arguments);

                            for (var _i7 in target.___after___) {
                                target.___after___[_i7](target, key, object);
                            }

                            target.___executing___ = null;

                            // let execTime = (new Date).getTime() - target.___stackTime___[0];

                            // if (execTime > 150) {
                            //     // console.log(`End ${key}(), took ${execTime} ms`);
                            // }

                            target.___stack___.shift();
                            // target.___stackTime___.shift();

                            return ret;
                        };

                        return target.___wrapped___[key];
                    }

                    // console.log(`Getting ${key}`);

                    return target[key];
                };
            }(object);

            object.___ref___ = new Proxy(object, {
                deleteProperty: del,
                get: get,
                set: set
            });

            return object.___ref___;
        }
    }, {
        key: 'clearBindings',
        value: function clearBindings(object) {
            object.___wrapped___ = {};
            object.___bindingAll___ = {};
            object.___binding___ = {};
            object.___before___ = {};
            object.___after___ = {};
            object.___ref___ = {};
            object.toString = function () {
                return '{}';
            };
        }
    }, {
        key: 'resolve',
        value: function resolve(object, path) {
            var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            var node = void 0;
            var pathParts = path.split('.');

            while (pathParts.length) {
                if (owner && pathParts.length === 1) {
                    return [this.makeBindable(object), pathParts.shift()];
                }

                if (!node in object || !object[node] || !(object[node] instanceof Object)) {
                    object[node] = {};
                }

                node = pathParts.shift();
                object = this.makeBindable(object[node]);
            }

            return this.makeBindable(object);
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
				if (this.bucket[bucket][key].expiration == 0 || this.bucket[bucket][key].expiration > new Date().getTime()) {
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

		key = key.trim();

		Cookie.jar[decodeURIComponent(key)] = value;
		// console.log(Cookie.jar);
	});

	Cookie.jar.bindTo(function (v, k, t, d) {
		t[k] = v;

		if (d) {
			t[k] = null;
		}

		var cookieString = encodeURIComponent(k) + '=' + t[k];
		// console.log(cookieString);
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

;require.register("base/Model.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Model = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cache = require('./Cache');

var _Repository = require('./Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = exports.Model = function () {
	function Model(repository) {
		_classCallCheck(this, Model);

		this.repository = repository;
	}

	_createClass(Model, [{
		key: 'consume',
		value: function consume(values) {
			for (var property in values) {
				var value = values[property];

				if (values[property] instanceof Object && values[property].class && values[property].publicId) {
					var cacheKey = values[property].class + '::' + values[property].publidId;

					var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

					value = new Model();

					if (cached) {
						value = cached;
					}

					value.consume(values[property]);

					_Cache.Cache.store(cacheKey, value, 0, 'model-type-repo');
				}

				this[property] = value;
			}
		}
	}]);

	return Model;
}();
});

;require.register("base/Repository.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cache = require('./Cache');

var _Model = require('./Model');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = {};

var Repository = exports.Repository = function () {
	function Repository(uri) {
		_classCallCheck(this, Repository);

		this.uri = uri;
	}

	_createClass(Repository, [{
		key: 'get',
		value: function get(id) {
			var resourceUri = this.uri + '/' + id;

			var cached = _Cache.Cache.load(resourceUri, false, 'model-uri-repo');

			if (cached) {
				return Promise.resolve(cached);
			}

			return Repository.request(resourceUri).then(function (response) {
				var model = new _Model.Model();

				model.consume(response.body);

				_Cache.Cache.store(resourceUri, model, 60 * 60, 'model-uri-repo');

				if (model.class) {
					var cacheKey = model.class + '::' + model.publidId;

					var _cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

					if (_cached) {
						_cached.consume(response.body);
						return _cached;
					}

					_Cache.Cache.store(cacheKey, model, 0, 'model-type-repo');
				}

				return model;
			});
		}
	}], [{
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
			// console.log(uri, content);
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
			var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var _this = this;

			var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
			var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

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
				if (post instanceof FormData) {
					formData = post;
				} else {
					formData = new FormData();
					for (var i in post) {
						formData.append(i, post[i]);
					}
				}
				postString = Object.keys(post).map(function (arg) {
					return encodeURIComponent(arg) + '=' + encodeURIComponent(post[arg]);
				}).join('&');
			}

			fullUri = uri + '?' + queryString;

			var xhr = new XMLHttpRequest();

			if ('responseType' in options) {
				xhr.responseType = options.responseType;
			}

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

								if (xhr.getResponseHeader("Content-Type") == 'application/json' || xhr.getResponseHeader("Content-Type") == 'application/json; charset=utf-8' || xhr.getResponseHeader("Content-Type") == 'text/json' || xhr.getResponseHeader("Content-Type") == 'text/json; charset=utf-8') {
									response = JSON.parse(xhr.responseText);
									if (response.code == 0) {
										// Repository.lastResponse = response;

										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');

										var prerendering = window.prerenderer;

										if (prerendering) {
											if (!_tagCache) {
												_tagCache = document.createElement('script');
												_tagCache.type = 'text/json';
												_tagCache.setAttribute('data-uri', fullUri);
												document.head.appendChild(_tagCache);
											}

											// console.log(JSON.stringify(response));

											_tagCache.innerText = JSON.stringify(response);
										}

										resolve(response);
									} else {
										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										reject(response);
									}
								} else {
									// Repository.lastResponse = xhr.responseText;

									if (!post && cache) {
										// this.cache[fullUri] = xhr.responseText;
									}

									resolve(xhr);
								}
							} else {
								reject('HTTP' + xhr.status);
							}
							_this.xhrs[xhrId] = null;
						}
					};

					xhr.open(type, fullUri, true);

					// if(post)
					// {
					// 	xhr.setRequestHeader("Content-type", "multipart/form-data");
					// }
					xhr.send(formData);
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

			var route = location.pathname + location.search;

			if (location.hash) {
				route += location.hash;
			}

			window.addEventListener('popstate', function (event) {
				event.preventDefault();

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
				}
			}, 0);
		}
	}, {
		key: 'match',
		value: function match(path, view) {
			var forceRefresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			if (this.path == path && !forceRefresh) {
				return;
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

			if (selected in routes && routes[selected] instanceof Object && routes[selected].isView && routes[selected].isView()) {
				result = new routes[selected](args);

				result.root = function () {
					return view;
				};
			} else if (routes[selected] instanceof Function) {
				result = '';

				var _result = routes[selected](args);

				if (_result instanceof Promise) {
					_result.then(function (x) {
						view.args.content = x;
					}).catch(function (x) {
						view.args.content = x;
					});
				} else {
					result = _result;
				}
			} else if (routes[selected] instanceof Promise) {
				routes[selected].then(function (x) {
					view.args.content = x;
				}).catch(function (x) {
					view.args.content = x;
				});

				result = '';
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
});

;require.register("base/RuleSet.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RuleSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dom = require('./Dom');

var _Tag = require('./Tag');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RuleSet = exports.RuleSet = function () {
	function RuleSet() {
		_classCallCheck(this, RuleSet);
	}

	_createClass(RuleSet, [{
		key: 'add',
		value: function add(selector, callback) {
			this.rules = this.rules || {};
			this.rules[selector] = this.rules[selector] || [];

			this.rules[selector].push(callback);

			return this;
		}
	}, {
		key: 'apply',
		value: function apply() {
			var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
			var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			RuleSet.apply(doc);

			for (var selector in this.rules) {
				for (var i in this.rules[selector]) {
					var callback = this.rules[selector][i];
					var wrapped = RuleSet.wrap(doc, callback, view);
					var nodes = doc.querySelectorAll(selector);

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var node = _step.value;

							wrapped(node);
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
				}
			}
		}
	}], [{
		key: 'add',
		value: function add(selector, callback) {
			this.globalRules = this.globalRules || {};
			this.globalRules[selector] = this.globalRules[selector] || [];

			this.globalRules[selector].push(callback);

			return this;
		}
	}, {
		key: 'apply',
		value: function apply() {
			var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
			var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			for (var selector in this.globalRules) {
				for (var i in this.globalRules[selector]) {
					var callback = this.globalRules[selector][i];
					var wrapped = this.wrap(doc, callback, view);
					var nodes = doc.querySelectorAll(selector);

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var node = _step2.value;

							wrapped(node);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			}
		}
	}, {
		key: 'wait',
		value: function wait() {
			var _this = this;

			var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DOMContentLoaded';
			var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

			var listener = function (event, node) {
				return function () {
					node.removeEventListener(event, listener);
					return _this.apply();
				};
			}(event, node);

			node.addEventListener(event, listener);
		}
	}, {
		key: 'wrap',
		value: function wrap(doc, callback) {
			var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (callback instanceof _View.View || callback && callback.prototype && callback.prototype instanceof _View.View) {
				callback = function (callback) {
					return function () {
						return callback;
					};
				}(callback);
			}

			return function (element) {
				if (!element.___cvApplied___) {
					Object.defineProperty(element, '___cvApplied___', {
						enumerable: false,
						writable: true
					});

					element.___cvApplied___ = [];
				}

				for (var i in element.___cvApplied___) {
					if (callback == element.___cvApplied___[i]) {
						return;
					}
				}

				element.___cvApplied___.push(callback);

				var tag = new _Tag.Tag(element);
				var parent = tag.element.parentNode;
				var sibling = tag.element.nextSibling;

				var result = callback(tag);

				if (result instanceof HTMLElement) {
					result = new _Tag.Tag(result);
				}

				if (result instanceof _Tag.Tag) {
					if (!result.element.contains(tag.element)) {
						while (tag.element.firstChild) {
							result.element.appendChild(tag.element.firstChild);
						}

						tag.remove();
					}

					if (sibling) {
						parent.insertBefore(result.element, sibling);
					} else {
						parent.appendChild(result.element);
					}
				}

				if (result && result.prototype && result.prototype instanceof _View.View) {
					result = new result();
				}

				if (result instanceof _View.View) {
					if (view) {
						view.cleanup.push(function (r) {
							return function () {
								r.remove();
							};
						}(result));
					}

					tag.clear();
					result.render(tag.element);
				}
			};
		}
	}]);

	return RuleSet;
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
		function Tag(element, parent, ref, index, direct) {
				_classCallCheck(this, Tag);

				this.element = _Bindable.Bindable.makeBindable(element);
				this.parent = parent;
				this.direct = direct;
				this.ref = ref;
				this.index = index;

				this.proxy = _Bindable.Bindable.makeBindable(this);
				this.cleanup = [];

				// this.detachListener = (event) => {
				// 	return;

				// 	if(event.target != this.element)
				// 	{
				// 		return;
				// 	}
				// 	if(event.path[event.path.length -1] !== window)
				// 	{
				// 		return;
				// 	}

				// 	this.element.removeEventListener('cvDomDetached', this.detachListener);

				// 	this.remove();
				// };

				// this.element.addEventListener('cvDomDetached', this.detachListener);

				return this.proxy;
		}

		_createClass(Tag, [{
				key: 'remove',
				value: function remove() {
						_Bindable.Bindable.clearBindings(this);

						var cleanup = void 0;

						while (cleanup = this.cleanup.shift()) {
								cleanup();
						}

						this.clear();

						var detachEvent = new Event('cvDomDetached');

						this.element.dispatchEvent(detachEvent);
						this.element.remove();

						this.element = this.ref = this.parent = null;
				}
		}, {
				key: 'clear',
				value: function clear() {
						if (!this.element) {
								return;
						}

						var detachEvent = new Event('cvDomDetached');

						while (this.element.firstChild) {
								this.element.firstChild.dispatchEvent(detachEvent);
								this.element.removeChild(this.element.firstChild);
						}
				}
		}, {
				key: 'pause',
				value: function pause() {
						var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
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

var _RuleSet = require('./RuleSet');

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
		this.document = '';
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
		this.interpolateRegex = /(\[\[((?:\$)?[\w\.]+)\]\])/g;
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
				_this.timeouts[index].callback = null;
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

			for (var _i4 in this.viewLists) {
				if (!this.viewLists[_i4]) {
					return;
				}

				this.viewLists[_i4].pause(!!paused);
			}

			for (var _i5 in this.tags) {
				if (Array.isArray(this.tags[_i5])) {
					for (var j in this.tags[_i5]) {
						this.tags[_i5][j].pause(!!paused);
					}
					continue;
				}
				this.tags[_i5].pause(!!paused);
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

				var _loop = function _loop(_i6) {
					var detachEvent = new Event('cvDomDetached', { bubbles: true, target: _this2.nodes[_i6] });
					var attachEvent = new Event('cvDomAttached', { bubbles: true, target: _this2.nodes[_i6] });

					_this2.nodes[_i6].dispatchEvent(detachEvent);

					_Dom.Dom.mapTags(_this2.nodes[_i6], false, function (node) {
						node.dispatchEvent(detachEvent);
					});

					if (parentNode) {
						if (insertPoint) {
							parentNode.insertBefore(_this2.nodes[_i6], insertPoint);
						} else {
							parentNode.appendChild(_this2.nodes[_i6]);
						}
					}

					_Dom.Dom.mapTags(_this2.nodes[_i6], false, function (node) {
						node.dispatchEvent(attachEvent);
					});

					_this2.nodes[_i6].dispatchEvent(attachEvent);
				};

				for (var _i6 in this.nodes) {
					_loop(_i6);
				}

				for (var _i7 in this.attach) {
					this.attach[_i7]();
				}

				return;
			}

			var subDoc = void 0;

			if (this.template == document) {
				subDoc = this.template;
			} else if (this.document) {
				subDoc = this.document;
			}
			{
				subDoc = document.createRange().createContextualFragment(this.template);

				this.document = subDoc;
			}

			// Dom.mapTags(subDoc, '[cv-ref]', (tag)=>{
			// 	this.mapRefTags(tag)
			// });

			_Dom.Dom.mapTags(subDoc, false, function (tag) {
				if (tag.matches) {
					tag.matches('[cv-each]') && _this2.mapEachTags(tag);

					tag.matches('[cv-with]') && _this2.mapWithTags(tag);

					tag.matches('[cv-prerender]') && _this2.mapPrendererTags(tag);

					tag.matches('[cv-link]') && _this2.mapLinkTags(tag);

					tag.matches('[cv-bind]') && _this2.mapBindTags(tag);

					_this2.mapInterpolatableTags(tag);

					tag.matches('[cv-expand]') && _this2.mapExpandableTags(tag);

					tag.matches('[cv-ref]') && _this2.mapRefTags(tag);

					tag.matches('[cv-if]') && _this2.mapIfTags(tag);

					tag.matches('[cv-on]') && _this2.mapOnTags(tag);
				} else {
					_this2.mapInterpolatableTags(tag);
				}
			});

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

			_RuleSet.RuleSet.apply(subDoc);

			var _loop2 = function _loop2() {
				var newNode = subDoc.firstChild;
				var attachEvent = new Event('cvDomAttached', { bubbles: true, target: newNode });

				_this2.nodes.push(subDoc.firstChild);

				if (parentNode) {
					if (insertPoint) {
						parentNode.insertBefore(subDoc.firstChild, insertPoint);
					} else {
						parentNode.appendChild(subDoc.firstChild);
					}
				}

				_Dom.Dom.mapTags(newNode, false, function (node) {
					node.dispatchEvent(attachEvent);
				});

				newNode.dispatchEvent(attachEvent);
			};

			while (subDoc.firstChild) {
				_loop2();
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

			for (var _i8 in this.attach) {
				this.attach[_i8]();
			}

			this.postRender(parentNode);

			// return this.nodes;
		}
	}, {
		key: 'mapExpandableTags',
		value: function mapExpandableTags(tag) {
			var expandProperty = tag.getAttribute('cv-expand');
			var expandArg = _Bindable.Bindable.makeBindable(this.args[expandProperty] || {});

			tag.removeAttribute('cv-expand');

			for (var i in expandArg) {
				if (i == 'name' || i == 'type') {
					continue;
				}

				expandArg.bindTo(i, function (tag, i) {
					return function (v) {
						tag.setAttribute(i, v);
					};
				}(tag, i));
			}
		}
	}, {
		key: 'mapInterpolatableTags',
		value: function mapInterpolatableTags(tag) {
			var _this3 = this;

			var regex = this.interpolateRegex;

			if (tag.nodeType == Node.TEXT_NODE) {
				var original = tag.nodeValue;

				if (!this.interpolatable(original)) {
					return;
				}

				var header = 0;
				var match = void 0;

				while (match = regex.exec(original)) {
					var bindProperty = match[2];

					if (1 || bindProperty.match(/\./)) {
						// console.log(bindProperty);
					}

					var unsafeHtml = false;

					if (bindProperty.substr(0, 1) === '$') {
						unsafeHtml = true;
						bindProperty = bindProperty.substr(1);
					}

					if (bindProperty.substr(0, 3) === '000') {
						expand = true;
						bindProperty = bindProperty.substr(3);

						continue;
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

					var proxy = this.args;
					var property = bindProperty;

					if (bindProperty.match(/\./)) {
						var _Bindable$resolve = _Bindable.Bindable.resolve(this.args, bindProperty, true);

						var _Bindable$resolve2 = _slicedToArray(_Bindable$resolve, 2);

						proxy = _Bindable$resolve2[0];
						property = _Bindable$resolve2[1];
					}

					tag.parentNode.insertBefore(dynamicNode, tag);

					proxy.bindTo(property, function (dynamicNode, unsafeHtml) {
						return function (v, k, t) {
							// console.log(`Setting ${k} to ${v}`, dynamicNode);
							if (t[k] instanceof View) {
								t[k].remove();
							}

							dynamicNode.nodeValue = '';

							if (v instanceof View) {
								v.render(tag.parentNode, dynamicNode);

								_this3.cleanup.push(function (view) {
									return function () {
										if (view) {
											view.remove();
										}
									};
								}(v));
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
				var _loop3 = function _loop3(i) {
					if (!_this3.interpolatable(tag.attributes[i].value)) {
						return 'continue';
					}

					var header = 0;
					var match = void 0;
					var original = tag.attributes[i].value;
					var attribute = tag.attributes[i];

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
						var _proxy = _this3.args;
						var _property = j;

						if (j.match(/\./)) {
							var _Bindable$resolve3 = _Bindable.Bindable.resolve(_this3.args, j, true);

							var _Bindable$resolve4 = _slicedToArray(_Bindable$resolve3, 2);

							_proxy = _Bindable$resolve4[0];
							_property = _Bindable$resolve4[1];
						}

						if (!_proxy.bindTo) {
							console.log(_property);
							console.log(_proxy);
						}

						_proxy.bindTo(_property, function (property, longProperty) {
							return function (v, k, t, d) {
								for (var _i9 in bindProperties) {
									for (var _j in bindProperties[longProperty]) {
										segments[bindProperties[longProperty][_j]] = t[_i9];

										if (k === property) {
											segments[bindProperties[longProperty][_j]] = v;
										}
									}
								}
								tag.setAttribute(attribute.name, segments.join(''));
							};
						}(_property, j));
					}

					// console.log(bindProperties, segments);

					// console.log(tag.attributes[i].name, tag.attributes[i].value);
				};

				for (var i = 0; i < tag.attributes.length; i++) {
					var _ret3 = _loop3(i);

					if (_ret3 === 'continue') continue;
				}
			}
		}
	}, {
		key: 'mapRefTags',
		value: function mapRefTags(tag) {
			var refAttr = tag.getAttribute('cv-ref');

			var _refAttr$split = refAttr.split(':'),
			    _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
			    refProp = _refAttr$split2[0],
			    refClassname = _refAttr$split2[1],
			    refKey = _refAttr$split2[2];

			var refClass = this.stringToClass(refClassname);

			tag.removeAttribute('cv-ref');

			Object.defineProperty(tag, '___tag___', {
				enumerable: false,
				writable: true
			});

			this.cleanup.push(function () {
				tag.___tag___ = null;
				tag.remove();
			});

			var parent = this;
			var direct = this;

			if (this.viewList) {
				parent = this.viewList.parent;
				// if(!this.viewList.parent.tags[refProp])
				// {
				// 	this.viewList.parent.tags[refProp] = [];
				// }

				// let refKeyVal = this.args[refKey];

				// this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
				// 	tag, this, refProp, refKeyVal
				// );
			} else {
					// this.tags[refProp] = new refClass(
					// 	tag, this, refProp
					// );
				}

			var tagObject = new refClass(tag, this, refProp, undefined, direct);

			tag.___tag___ = tagObject;

			if (parent) {
				if (1 || !parent.parent) {
					var refKeyVal = this.args[refKey];

					if (refKeyVal !== undefined) {
						if (!parent.tags[refProp]) {
							parent.tags[refProp] = [];
						}

						parent.tags[refProp][refKeyVal] = tagObject;
					} else {
						parent.tags[refProp] = tagObject;
					}
				}
				parent = parent.parent;
			}
		}
	}, {
		key: 'mapBindTags',
		value: function mapBindTags(tag) {
			var _this4 = this;

			var bindArg = tag.getAttribute('cv-bind');
			this.args.bindTo(bindArg, function (v, k, t) {
				if (t[k] === v) {
					// return;
				}

				if (t[k] instanceof View) {
					t[k].remove();
				}

				if (tag.tagName == 'INPUT' || tag.tagName == 'SELECT' || tag.tagName == 'TEXTAREA') {
					var type = tag.getAttribute('type');
					if (type && type.toLowerCase() == 'checkbox') {
						if (v) {
							tag.checked = true;
						} else {
							tag.checked = false;
						}
					} else if (type && type.toLowerCase() == 'radio') {
						console.log(tag, v, tag.value, k);
						if (v == tag.value) {
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
					// console.log(event.target.value);
				}

				if (event.target !== tag) {
					return;
				}

				// console.log(event.target.value);

				_this4.args[bindArg] = event.target.value;
			};

			tag.addEventListener('input', inputListener);
			tag.addEventListener('change', inputListener);
			tag.addEventListener('value-changed', inputListener);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('input', inputListener);
					tag.removeEventListener('change', inputListener);
					tag.removeEventListener('value-changed', inputListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, inputListener));

			tag.removeAttribute('cv-bind');
		}
	}, {
		key: 'mapOnTags',
		value: function mapOnTags(tag) {
			var _this5 = this;

			var action = String(tag.getAttribute('cv-on')).split(/;/).map(function (a) {
				return a.split(':');
			}).map(function (object, tag) {
				return function (a) {
					var eventName = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
					var callbackName = a[1];
					var argList = [];
					var groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);
					if (groups.length) {
						callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
						if (groups[2]) {
							argList = groups[2].split(',').map(function (s) {
								return s.trim();
							});
						}
					}

					var eventMethod = void 0;
					var parent = _this5;

					while (parent) {
						if (typeof parent[callbackName] == 'function') {
							eventMethod = function eventMethod() {
								var _parent;

								(_parent = parent)[callbackName].apply(_parent, arguments);
							};
							break;
						}

						if (parent.viewList && parent.viewList.parent) {
							parent = parent.viewList.parent;
						} else if (parent.parent) {
							parent = parent.parent;
						} else {
							break;
						}
					}

					var eventListener = function (object, parent, eventMethod, tag) {
						return function (event) {
							var argRefs = argList.map(function (arg) {
								var match = void 0;
								if (parseInt(arg) == arg) {
									return arg;
								} else if (arg === 'event' || arg === '$event') {
									return event;
								} else if (arg === '$view') {
									return parent;
								} else if (arg === '$tag') {
									return tag;
								} else if (arg === '$parent') {
									return object.parent;
								} else if (arg === '$subview') {
									return object;
								} else if (arg in object.args) {
									return object.args[arg];
								} else if (match = /^['"](\w+?)["']$/.exec(arg)) {
									return match[1];
								}
							});
							// console.log(argList, argRefs);
							if (!(typeof eventMethod == 'function')) {
								// console.log(object);
								// console.trace();
								// console.log(this, parent);
								throw new Error(callbackName + ' is not defined on View object.\n\nTag:\n\n' + tag.outerHTML);
							}
							eventMethod.apply(undefined, _toConsumableArray(argRefs));
						};
					}(object, parent, eventMethod, tag);

					switch (eventName) {
						case '_init':
							eventListener();
							break;

						case '_attach':
							_this5.attach.push(eventListener);
							break;

						case '_detach':
							_this5.detach.push(eventListener);
							break;

						default:
							tag.addEventListener(eventName, eventListener);

							_this5.cleanup.push(function (tag, eventName, eventListener) {
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
			}(this, tag));

			tag.removeAttribute('cv-on');
		}
	}, {
		key: 'mapLinkTags',
		value: function mapLinkTags(tag) {
			var linkAttr = tag.getAttribute('cv-link');

			tag.setAttribute('href', linkAttr);

			var linkClick = function linkClick(event) {
				event.preventDefault();

				if (linkAttr.substring(0, 4) == 'http' || linkAttr.substring(0, 2) == '//') {
					window.open(tag.getAttribute('href', linkAttr));

					return;
				}

				_Router.Router.go(tag.getAttribute('href'));
			};

			tag.addEventListener('click', linkClick);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('click', eventListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, linkClick));

			tag.removeAttribute('cv-link');
		}
	}, {
		key: 'mapPrendererTags',
		value: function mapPrendererTags(tag) {
			var prerenderAttr = tag.getAttribute('cv-prerender');
			var prerendering = window.prerenderer;

			if (prerenderAttr == 'never' && prerendering || prerenderAttr == 'only' && !prerendering) {
				tag.parentNode.removeChild(tag);
			}
		}
	}, {
		key: 'mapWithTags',
		value: function mapWithTags(tag) {
			var withAttr = tag.getAttribute('cv-with');
			var carryAttr = tag.getAttribute('cv-carry');
			tag.removeAttribute('cv-with');
			tag.removeAttribute('cv-carry');

			var subTemplate = tag.innerHTML;

			var carryProps = [];

			if (carryAttr) {
				carryProps = carryAttr.split(',').map(function (s) {
					return s.trim();
				});
			}

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var view = new View();

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			// console.log(carryProps);

			for (var i in carryProps) {
				this.args.bindTo(carryProps[i], function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			for (var _i10 in this.args[withAttr]) {
				this.args[withAttr].bindTo(_i10, function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			view.render(tag);
		}
	}, {
		key: 'mapEachTags',
		value: function mapEachTags(tag) {
			var _this6 = this;

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

			this.args.bindTo(eachProp, function (eachProp, carryProps) {
				return function (v, k, t) {
					if (_this6.viewLists[eachProp]) {
						_this6.viewLists[eachProp].remove();
					}

					var viewList = new _ViewList.ViewList(subTemplate, asProp, v, keyProp);

					viewList.parent = _this6;

					viewList.render(tag);

					for (var i in carryProps) {
						_this6.args.bindTo(carryProps[i], function (v, k) {
							viewList.args.subArgs[k] = v;
						});
					}

					_this6.viewLists[eachProp] = viewList;
				};
			}(eachProp, carryProps));
		}
	}, {
		key: 'mapIfTags',
		value: function mapIfTags(tag) {
			var ifProperty = tag.getAttribute('cv-if');

			var inverted = false;

			if (ifProperty.substr(0, 1) === '!') {
				inverted = true;
				ifProperty = ifProperty.substr(1);
			}

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var ifDoc = document.createRange().createContextualFragment('');

			var view = new View();

			view.args = this.args;

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			view.render(tag);

			var proxy = this.args;
			var property = ifProperty;

			if (ifProperty.match(/\./)) {
				var _Bindable$resolve5 = _Bindable.Bindable.resolve(this.args, ifProperty, true);

				var _Bindable$resolve6 = _slicedToArray(_Bindable$resolve5, 2);

				proxy = _Bindable$resolve6[0];
				property = _Bindable$resolve6[1];
			}

			proxy.bindTo(property, function (tag, ifDoc) {
				return function (v, k) {
					var detachEvent = new Event('cvDomDetached');
					var attachEvent = new Event('cvDomAttached');

					if (Array.isArray(v)) {
						v = !!v.length;
					}

					if (inverted) {
						v = !v;
					}

					if (v) {
						while (ifDoc.firstChild) {
							var moveTag = ifDoc.firstChild;

							tag.prepend(moveTag);

							moveTag.dispatchEvent(attachEvent);

							_Dom.Dom.mapTags(moveTag, false, function (node) {
								node.dispatchEvent(attachEvent);
							});
						}
					} else {
						while (tag.firstChild) {
							var _moveTag = tag.firstChild;

							ifDoc.prepend(_moveTag);

							_moveTag.dispatchEvent(detachEvent);

							_Dom.Dom.mapTags(_moveTag, false, function (node) {
								node.dispatchEvent(detachEvent);
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
			return !!String(str).match(this.interpolateRegex);
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
			var detachEvent = new Event('cvDomDetached');

			// console.log(this);

			for (var i in this.tags) {
				if (Array.isArray(this.tags[i])) {
					for (var j in this.tags[i]) {
						this.tags[i][j].remove();
					}
					continue;
				}
				this.tags[i].remove();
			}

			for (var _i11 in this.nodes) {
				this.nodes[_i11].dispatchEvent(detachEvent);
				this.nodes[_i11].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			for (var _i12 in this.viewLists) {
				if (!this.viewLists[_i12]) {
					continue;
				}
				this.viewLists[_i12].remove();
			}

			this.viewLists = [];

			_Bindable.Bindable.clearBindings(this);
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
	}], [{
		key: 'isView',
		value: function isView() {
			return View;
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

var ViewList = function () {
	function ViewList(template, subProperty, list) {
		var _this = this;

		var keyProperty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, ViewList);

		this.args = _Bindable.Bindable.makeBindable({});
		this.args.value = _Bindable.Bindable.makeBindable(list || {});
		this.args.subArgs = _Bindable.Bindable.makeBindable({});
		this.views = {};
		this.cleanup = [];
		this.template = template;
		this.subProperty = subProperty;
		this.keyProperty = keyProperty;
		this.tag = null;
		this.paused = false;

		this.args.value.___before___.push(function (t) {
			// console.log(t.___executing___);
			if (t.___executing___ == 'bindTo') {
				return;
			}
			_this.paused = true;
		});

		this.args.value.___after___.push(function (t) {
			if (_this.paused) {
				// console.log(t.___executing___);
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
				for (var _j in views) {
					if (views[_j] && _this2.args.value[_i] === views[_j].args[_this2.subProperty]) {
						found = true;
						finalViews[_i] = views[_j];
						delete views[_j];
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

			for (var _i2 in this.views) {
				var _found = false;

				for (var j in finalViews) {
					if (this.views[_i2] === finalViews[j]) {
						_found = true;
						break;
					}
				}

				if (!_found) {
					this.views[_i2].remove();
				}
			}

			var appendOnly = true;

			for (var _i3 in this.views) {
				if (this.views[_i3] !== finalViews[_i3]) {
					appendOnly = false;
				}
			}

			if (!appendOnly) {
				for (var _i4 in this.views) {
					this.views[_i4].remove();
				}

				while (this.tag.firstChild) {
					this.tag.removeChild(this.tag.firstChild);
				}

				for (var _i5 in finalViews) {
					finalViews[_i5].render(this.tag);
				}
			} else {
				var _i6 = this.views.length || 0;

				while (finalViews[_i6]) {
					finalViews[_i6].render(this.tag);
					_i6++;
				}
			}

			this.views = finalViews;
		}
	}, {
		key: 'pause',
		value: function pause() {
			var _pause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			for (var i in this.views) {
				this.views[i].pause(_pause);
			}
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.views) {
				this.views[i].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.pop()) {
				cleanup();
			}

			this.views = [];

			while (this.tag && this.tag.firstChild) {
				this.tag.removeChild(this.tag.firstChild);
			}
		}
	}]);

	return ViewList;
}();

exports.ViewList = ViewList;
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
		_this.template = '\n\t\t\t<label\n\t\t\t\tfor = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\tname   = "' + _this.args.name + '"\n\t\t\t\t\ttype   = "' + _this.args.attrs.type + '"\n\t\t\t\t\tvalue  = "[[title]]"\n\t\t\t\t\tcv-on  = "click:clicked(event)"\n\t\t\t\t\tcv-ref = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(ButtonField, [{
		key: 'clicked',
		value: function clicked(event) {
			if (this.args.attrs.type == 'submit') {
				event.preventDefault();
				event.stopPropagation();
				this.form.tags.formTag.element.dispatchEvent(new Event('submit', {
					'cancelable': true,
					'bubbles': true
				}));
			}
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _Bindable = require('../base/Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_View) {
	_inherits(Field, _View);

	function Field(values, form, parent, key) {
		_classCallCheck(this, Field);

		var skeleton = Object.assign(values);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, values));

		_this.args.title = _this.args.title || '';
		_this.args.value = _this.args.value || '';
		_this.skeleton = skeleton;
		_this.disabled = null;

		_this.args.valueString = '';

		_this.form = form;
		_this.parent = parent;
		_this.key = key;

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;

		var setting = null;

		_this.args.bindTo('value', function (v, k) {
			if (setting == key) {
				return;
			}

			_this.args.valueString = JSON.stringify(v || '', null, 4);

			setting = key;

			if (_this.args.attrs.type == 'file') {
				if (_this.tags.input && _this.tags.input.element.files) {
					console.log(_this.tags.input.element.files[0]);

					_this.parent.args.value[key] = _this.tags.input.element.files[0];
				}
			} else {
				if (!_this.parent.args.value) {
					_this.parent.args.value = {};
				}

				_this.parent.args.value[key] = v;
			}
			setting = null;
		});

		// this.parent.args.value = Bindable.makeBindable(this.parent.args.value);

		_this.parent.args.value.bindTo(key, function (v, k) {
			if (setting == k) {
				return;
			}

			setting = k;

			if (_this.args.attrs.type == 'file') {
				if (_this.tags.input && _this.tags.input.element.files) {
					_this.args.value = _this.tags.input.element.files[0];
				}
			} else {
				_this.args.value = v;
			}

			setting = null;
		});

		var extra = '';

		if (_this.args.attrs.type == 'checkbox') {
			extra = 'value = "1"';
		}

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor           = "' + _this.args.name + '"\n\t\t\t\tdata-type     = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref        = "label:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<input\n\t\t\t\t\tname      = "' + _this.args.name + '"\n\t\t\t\t\ttype      = "' + (_this.args.attrs.type || 'text') + '"\n\t\t\t\t\tcv-bind   = "value"\n\t\t\t\t\tcv-ref    = "input:curvature/base/Tag"\n\t\t\t\t\tcv-expand = "attrs"\n\t\t\t\t\t' + extra + '\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		//type    = "${this.args.attrs.type||'text'}"
		return _this;
	}

	_createClass(Field, [{
		key: 'disable',
		value: function disable() {
			if (this.hasChildren()) {
				// for(let i in this.args.fields)
				// {
				// 	this.args.fields[i].disable();
				// }
			}

			this.disabled = 'disabled';
		}
	}, {
		key: 'enable',
		value: function enable() {
			if (this.hasChildren()) {
				// for(let i in this.args.fields)
				// {
				// 	this.args.fields[i].disable();
				// }
			}

			this.disabled = false;
		}
	}, {
		key: 'hasChildren',
		value: function hasChildren() {
			return false;
		}
	}, {
		key: 'getName',
		value: function getName() {
			if (this.tags.input) {
				return this.tags.input.element.getAttribute('name');
			}

			return this.args.name;
		}
	}]);

	return Field;
}(_View2.View);
});

;require.register("form/FieldSet.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FieldSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
		_this.template = '\n\t\t\t<label\n\t\t\t\tfor        = "' + _this.args.name + '"\n\t\t\t\tdata-type  = "' + _this.args.attrs.type + '"\n\t\t\t\tdata-multi = "' + (_this.args.attrs['data-multi'] ? 'true' : 'false') + '"\n\t\t\t\tcv-ref     = "label:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = "' + _this.args.name + '"\n\t\t\t\t\tcv-ref = "input:curvature/base/Tag"\n\t\t\t\t\tcv-expand="attrs"\n\t\t\t\t\tcv-each = "fields:field"\n\t\t\t\t>\n\t\t\t\t\t[[field]]\n\t\t\t\t</fieldset>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(FieldSet, [{
		key: 'hasChildren',
		value: function hasChildren() {
			return !!Object.keys(this.args.fields).length;
		}
	}, {
		key: 'wrapSubfield',
		value: function wrapSubfield(field) {
			return field;
		}
	}]);

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

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t>\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t<span style = "display:none" cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
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

var _RadioField = require('./RadioField');

var _HtmlField = require('./HtmlField');

var _HiddenField = require('./HiddenField');

var _ButtonField = require('./ButtonField');

var _View3 = require('./multiField/View');

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
		var customFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

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
		_this.template = '\n\t\t\t<form\n\t\t\t\tclass   = "[[_classes]]"\n\t\t\t\tmethod  = "[[method]]"\n\t\t\t\tenctype = "multipart/form-data"\n\t\t\t\tcv-on   = "submit:submit(event)"\n\t\t\t\tcv-ref  = "formTag:curvature/base/Tag"\n\t\t\t\tcv-each = "fields:field"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t';

		_this.args.fields = Form.renderFields(skeleton, _this, customFields);

		_this.args.bindTo('value', function (v) {
			_this.args.valueString = JSON.stringify(v, null, 4);
		});
		return _this;
	}

	_createClass(Form, [{
		key: 'submitHandler',
		value: function submitHandler(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		key: 'submit',
		value: function submit(event) {
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
		key: 'formData',
		value: function formData() {
			var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var field = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var chain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

			if (!append) {
				append = new FormData();
			}

			if (!field) {
				field = this;
			}

			var parts = [];

			for (var i in field.args.fields) {

				if (field.args.fields[i] && field.args.fields[i].disabled) {
					continue;
				}

				var subchain = chain.slice(0);

				subchain.push(i);

				if (field.args.fields[i] && field.args.fields[i].hasChildren()) {
					this.formData(append, field.args.fields[i], subchain);
				} else if (field.args.fields[i]) {
					// let fieldName = field.args.fields[i].args.name;

					var fieldName = field.args.fields[i].getName();

					if (field.args.fields[i].args.type == 'file') {
						append.append(fieldName, field.args.fields[i].tags.input.element.files[0]);
					} else {
						append.append(fieldName, field.args.fields[i].args.value);
					}
				}
			}

			return append;
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
	}, {
		key: 'hasChildren',
		value: function hasChildren() {
			return !!Object.keys(this.args.fields).length;
		}
	}], [{
		key: 'renderFields',
		value: function renderFields(skeleton) {
			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

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

				if (parent) {
					if (parent instanceof Form) {
						form = parent;
					} else {
						form = parent.form;
					}
				}

				if (skeleton[i].name in customFields) {
					field = new customFields[skeleton[i].name](skeleton[i], form, parent, i);
				} else {
					switch (skeleton[i].type) {
						case 'fieldset':
							if (skeleton[i].attrs['data-multi']) {
								field = new _View3.View(skeleton[i], form, parent, i);
							} else {
								field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
							}
							break;
						case 'select':
							field = new _SelectField.SelectField(skeleton[i], form, parent, i);
							break;
						case 'radios':
							field = new _RadioField.RadioField(skeleton[i], form, parent, i);
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
				}

				fields[i] = field;

				field.args.bindTo('value', function (v, k, t, d) {
					// console.log(t,v);
					if (t.type == 'html' && !t.contentEditable || t.type == 'fieldset') {
						return;
					}

					// let fieldName = field.args.name;
					var fieldName = field.getName();

					if (t.disabled) {
						delete form.args.flatValue[fieldName];

						return;
					}
					form.args.flatValue[fieldName] = v;
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

		_this.args.attrs.type = _this.args.attrs.type || 'hidden';
		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tstyle     = "display:none"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t<span cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
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

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
		_this.template = '<div\n\t\t\tname            = "' + _this.args.name + '"\n\t\t\tcv-ref          = "input:curvature/base/Tag"\n\t\t\tcontenteditable = "[[contentEditable]]"\n\t\t>[[$value]]</div>';
		return _this;
	}

	_createClass(HtmlField, [{
		key: 'hasChildren',
		value: function hasChildren() {
			return false;
		}
	}, {
		key: 'disable',
		value: function disable() {
			this.args.disabled = 'disabled';
		}
	}, {
		key: 'getName',
		value: function getName() {
			if (this.tags.input) {
				return this.tags.input.element.getAttribute('name');
			}

			return this.args.name;
		}
	}]);

	return HtmlField;
}(_View2.View);
});

;require.register("form/RadioField.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RadioField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadioField = exports.RadioField = function (_Field) {
	_inherits(RadioField, _Field);

	function RadioField(values, form, parent, key) {
		_classCallCheck(this, RadioField);

		var _this = _possibleConstructorReturn(this, (RadioField.__proto__ || Object.getPrototypeOf(RadioField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span\n\t\t\t\t\tcv-each  = "options:option:optionText"\n\t\t\t\t\tcv-carry = "value"\n\t\t\t\t\t--cv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\t\ttype    = "radio"\n\t\t\t\t\t\t\tvalue   = "[[option]]"\n\t\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(RadioField, [{
		key: 'getLabel',
		value: function getLabel() {
			for (var i in this.args.options) {
				if (this.args.options[i] == this.args.value) {
					return i;
				}
			}
		}
	}]);

	return RadioField;
}(_Field2.Field);
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

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-each = "options:option:optionText"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<option value = "[[option]]">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(SelectField, [{
		key: 'getLabel',
		value: function getLabel() {
			for (var i in this.args.options) {
				if (this.args.options[i] == this.args.value) {
					return i;
				}
			}
		}
	}]);

	return SelectField;
}(_Field2.Field);
});

;require.register("form/multiField/CreateForm.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CreateForm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _FormWrapper2 = require('./FormWrapper');

var _HiddenField = require('../../form/HiddenField');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CreateForm = exports.CreateForm = function (_FormWrapper) {
	_inherits(CreateForm, _FormWrapper);

	function CreateForm(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, CreateForm);

		var _this = _possibleConstructorReturn(this, (CreateForm.__proto__ || Object.getPrototypeOf(CreateForm)).call(this, args, path, 'POST', customFields || {
			// title: HiddenField
		}));

		_this.creating = !!args.publicId;
		return _this;
	}

	_createClass(CreateForm, [{
		key: 'onLoad',
		value: function onLoad(form) {
			for (var i in form.args.fields) {
				if (!form.args.fields[i].tags.input) {
					continue;
				}

				if (form.args.fields[i].args.attrs.type == 'hidden') {
					continue;
				}

				var element = form.args.fields[i].tags.input.element;

				element.focus();

				break;
			}

			_get(CreateForm.prototype.__proto__ || Object.getPrototypeOf(CreateForm.prototype), 'onLoad', this).call(this, form);
		}
	}, {
		key: 'onRequest',
		value: function onRequest() {
			this.args.view.args.loading = true;
			this.args.view.args.classes += ' loading';

			return _get(CreateForm.prototype.__proto__ || Object.getPrototypeOf(CreateForm.prototype), 'onRequest', this).call(this);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(response) {
			this.args.view.args.loading = false;
			this.args.view.args.classes = '';

			if (!this.args.wrapper) {
				this.args.view.addRecord(response.body);
			} else {
				this.args.wrapper.refresh(response.body);
			}

			this.args.view.addButtonClicked();

			_get(CreateForm.prototype.__proto__ || Object.getPrototypeOf(CreateForm.prototype), 'onResponse', this).call(this, response);
		}
	}]);

	return CreateForm;
}(_FormWrapper2.FormWrapper);
});

;require.register("form/multiField/Form.js", function(exports, require, module) {
// import { BaseForm } from '../Ui/BaseForm';
// import { HiddenField } from 'curvature/form/HiddenField';

// export class Form extends BaseForm
// {
// 	constructor(args, path, method = 'GET', customFields = {})
// 	{
// 		super(args, path, 'POST', customFields);

// 		this.creating = !!args.publicId;
// 	}

// 	onLoad(form)
// 	{
// 		for(let i in form.args.fields)
// 		{
// 			if(!form.args.fields[i].tags.input)
// 			{
// 				continue;
// 			}

// 			if(form.args.fields[i].args.attrs.type == 'hidden')
// 			{
// 				continue;
// 			}

// 			let element = form.args.fields[i].tags.input.element;

// 			element.focus();

// 			break;
// 		}

// 		super.onLoad(form);
// 	}

// 	onRequest()
// 	{
// 		this.args.view.args.loading = true;
// 		this.args.view.args.classes += ' loading';

// 		return super.onRequest();
// 	}

// 	onResponse(response)
// 	{
// 		this.args.view.args.loading = false;
// 		this.args.view.args.classes = '';

// 		if(!this.args.wrapper)
// 		{
// 			this.args.view.addRecord(response.body);
// 		}
// 		else
// 		{
// 			this.args.wrapper.refresh(response.body);
// 		}

// 		this.args.view.addButtonClicked();

// 		super.onResponse(response);
// 	}
// }
"use strict";
});

;require.register("form/multiField/FormWrapper.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FormWrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository = require('../../base/Repository');

var _Form = require('../../form/Form');

var _Toast = require('../../toast/Toast');

var _ToastAlert = require('../../toast/ToastAlert');

var _View2 = require('../../base/View');

var _Router = require('../../base/Router');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FormWrapper = exports.FormWrapper = function (_View) {
	_inherits(FormWrapper, _View);

	function FormWrapper(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, FormWrapper);

		var _this = _possibleConstructorReturn(this, (FormWrapper.__proto__ || Object.getPrototypeOf(FormWrapper)).call(this, args));

		_this.path = path;
		_this.args.method = method;
		_this.args.action = _this.args.action || null;
		_this.args.form = null;
		_this.args.title = null;
		_this.args.class = '';
		_this.template = '\n\t\t\t<div class = "form constrict [[class]]">\n\t\t\t\t<div cv-if = "title"><label>[[title]]</label></div>\n\t\t\t\t[[form]]\n\t\t\t</div>\n\t\t';

		_this._onLoad = [];
		_this._onSubmit = [];
		_this._onRequest = [];
		_this._onResponse = [];

		_Repository.Repository.request(_Config.Config.backend + path).then(function (resp) {
			if (!resp || !resp.meta || !resp.meta.form || !(resp.meta.form instanceof Object)) {
				console.log('Cannot render form with ', resp);
				// Router.go('/');
				return;
			}

			_this.args.form = new _Form.Form(resp.meta.form, customFields);

			_this.onLoad(_this.args.form, resp.body);

			_this.args.form.onSubmit(function (form, event) {
				if (_this.onSubmit(form, event) === false) {
					return;
				}

				event.preventDefault();
				event.stopPropagation();

				var formElement = form.tags.formTag.element;
				var uri = formElement.getAttribute('action') || _this.args.action || path;
				var method = formElement.getAttribute('method') || _this.args.method;
				var query = form.args.flatValue;

				method = method.toUpperCase();

				// console.log(method, uri);

				if (method == 'GET') {
					var _query = {};

					if (_this.args.content && _this.args.content.args) {
						_this.args.content.args.page = 0;
					}

					_query.page = 0;

					for (var i in query) {
						if (i === 'api') {
							continue;
						}
						_query[i] = query[i];
					}

					var promises = _this.onRequest(_query);

					promises.then(function () {
						_this.onResponse({});

						_Router.Router.go(uri + '?' + _Router.Router.queryToString(_query));

						_this.update(_query);
					}).catch(function (error) {
						_this.onRequestError(error);
					});
				} else if (method == 'POST') {
					var formData = form.formData();

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							// console.log(pair[0]+ ', ' + pair[1]);

							var pair = _step.value;
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

					var _promises = _this.onRequest(formData);

					if (_promises) {
						_promises.then(function () {
							_Repository.Repository.request(_Config.Config.backend + uri, { api: 'json' }, formData).then(function (response) {
								_this.onResponse(response);
							}).catch(function (error) {
								_this.onRequestError(error);
							});
						});
					}
				}
			});
		});
		return _this;
	}

	_createClass(FormWrapper, [{
		key: 'onRequest',
		value: function onRequest(requestData) {
			var promises = [];

			for (var i in this._onRequest) {
				var onReq = this._onRequest[i](requestData, this);

				if (onReq) {
					promises.push(onReq);
				}
			}

			if (promises.length == 0) {
				return Promise.resolve();
			}

			return Promise.all(promises);
		}
	}, {
		key: 'onRequestError',
		value: function onRequestError(error) {}
	}, {
		key: 'onResponse',
		value: function onResponse(response) {
			for (var i in this._onResponse) {
				this._onResponse[i](response, this);
			}

			if (response.messages) {
				for (var _i in response.messages) {
					_Toast.Toast.instance().alert(response.body && response.body.id ? 'Success!' : 'Error!', response.messages[_i], 3500);
				}
			}
		}
	}, {
		key: 'onLoad',
		value: function onLoad(form, model) {
			for (var i in this._onLoad) {
				this._onLoad[i](this);
			}
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(form, event) {
			for (var i in this._onSubmit) {
				this._onSubmit[i](this);
			}
		}
	}, {
		key: 'customFields',
		value: function customFields() {
			return {};
		}
	}]);

	return FormWrapper;
}(_View2.View);
});

;require.register("form/multiField/SearchForm.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SearchForm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Config = require('Config');

var _FormWrapper2 = require('./FormWrapper');

var _HiddenField = require('../../form/HiddenField');

var _Repository = require('../../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchForm = exports.SearchForm = function (_FormWrapper) {
	_inherits(SearchForm, _FormWrapper);

	function SearchForm(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, SearchForm);

		var _this = _possibleConstructorReturn(this, (SearchForm.__proto__ || Object.getPrototypeOf(SearchForm)).call(this, args, path, 'POST', { search: _HiddenField.HiddenField }));

		_this.superTemplate = _this.template;

		_this.args.records = [];
		_this.selected = null;

		_this.template = '\n\t\t\t' + _this.superTemplate + '\n\t\t\t<div cv-each = "records:record:r" class = "dropdown-results">\n\t\t\t\t<div\n\t\t\t\t\tcv-on         = "click:select(event)"\n\t\t\t\t\tdata-index    = "[[r]]"\n\t\t\t\t\tdata-publicId = "[[record.publicId]]"\n\t\t\t\t\tclass         = "[[record.classes]]"\n\t\t\t\t>\n\t\t\t\t\t[[record.title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';
		return _this;
	}

	_createClass(SearchForm, [{
		key: 'onLoad',
		value: function onLoad(form) {
			var _this2 = this;

			for (var i in form.args.fields) {
				if (!form.args.fields[i].tags.input) {
					continue;
				}

				if (form.args.fields[i].args.attrs.type == 'hidden') {
					continue;
				}

				var element = form.args.fields[i].tags.input.element;

				element.focus();

				break;
			}

			form.args.flatValue.bindTo('keyword', function (v) {
				_this2.args.records = [];
				_this2.selected = null;

				if (!v) {
					return;
				}

				console.log(_this2.path, v);

				_Repository.Repository.request(_Config.Config.backend + _this2.path, { keyword: v }).then(function (response) {
					console.log(response.body);
					if (!response.body) {
						return;
					}

					_this2.args.records = response.body.map(function (r) {
						r.classes = '';
						if (r.title == v) {
							r.classes = 'selected';
							_this2.selected = r;
						}
						return r;
					});
				});
			});

			_get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onLoad', this).call(this, form);
		}
	}, {
		key: 'onRequest',
		value: function onRequest() {
			// this.args.view.args.loading = true;
			// this.args.view.args.classes += ' loading';

			return _get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onRequest', this).call(this);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(response) {
			// this.args.view.args.loading = false;
			// this.args.view.args.classes = '';

			// if(!this.args.wrapper)
			// {
			// 	this.args.view.addRecord(response.body);
			// }
			// else
			// {
			// 	this.args.wrapper.refresh(response.body);
			// }

			// this.args.view.addButtonClicked();

			_get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onResponse', this).call(this, response);
		}
	}, {
		key: 'select',
		value: function select(event) {
			var _this3 = this;

			var index = event.target.getAttribute('data-index');
			var publicId = event.target.getAttribute('data-publicId');

			var record = this.args.records[index];

			console.log(record);

			this.args.view.addRecord(record);
			this.args.view.addButtonClicked();

			return;

			_Repository.Repository.request(_Config.Config.backend + this.path + '/' + publicId).then(function (response) {
				console.log(response.body);
				if (!response.body) {
					return;
				}

				_this3.args.view.addRecord(response.body);
				_this3.args.view.addButtonClicked();
			});
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(form, event) {
			event.preventDefault();
			event.stopPropagation();
			if (this.selected) {
				this.args.view.addRecord(this.selected);
				this.args.view.addButtonClicked();
			}
			return false;
		}
	}]);

	return SearchForm;
}(_FormWrapper2.FormWrapper);
});

;require.register("form/multiField/View.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.View = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Form = require('../../form/Form');

var _FieldSet2 = require('../../form/FieldSet');

var _CreateForm = require('./CreateForm');

var _SearchForm = require('./SearchForm');

var _FormWrapper = require('./FormWrapper');

var _Wrapper = require('./Wrapper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Loader     } from '../Ui/Loader';

var View = exports.View = function (_FieldSet) {
	_inherits(View, _FieldSet);

	function View(values, form, parent, key) {
		_classCallCheck(this, View);

		var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, values, form, parent, key));

		_this.args._fields = [];

		_this.dragging = false;
		_this.dropping = false;

		for (var i in _this.args.fields) {
			_this.args._fields[i] = _this.wrapSubfield(_this.args.fields[i]);
		}

		_this.args.fields[-1].disable();

		_this.args.creating = '';
		_this.args.fieldType = '';

		// this.args.loader = new Loader;
		// this.args.loader = 'LOADING!!!';
		_this.args.loader = null;

		_this.args.createForm = _this.args.createForm || '';
		_this.args.searchForm = _this.args.searchForm || '';

		_this.setCreateForm({ view: _this });

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor        = "' + _this.args.name + '"\n\t\t\t\tdata-type  = "' + _this.args.attrs.type + '"\n\t\t\t\tdata-multi = "' + (_this.args.attrs['data-multi'] ? 'true' : 'false') + '"\n\t\t\t>\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\n\t\t\t\t<fieldset\n\t\t\t\t\tname  = "' + _this.args.name + '"\n\t\t\t\t\tclass = "multi-field [[creating]] [[fieldType]]"\n\t\t\t\t>\n\n\t\t\t\t\t<div class = "record-list" cv-each = "_fields:field:f">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass     = "single-record"\n\t\t\t\t\t\t\tdata-for  = "[[f]]"\n\t\t\t\t\t\t\tdraggable = "true"\n\t\t\t\t\t\t\tcv-on     = "\n\t\t\t\t\t\t\t\tdrop:drop(event);\n\t\t\t\t\t\t\t\tdragstart:drag(event);\n\t\t\t\t\t\t\t\tdragend:dragStop(event);\n\t\t\t\t\t\t\t\tdragover:dragOver(event);\n\t\t\t\t\t\t\t"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t[[field]]\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div\n\t\t\t\t\t\tclass = "overlay create"\n\t\t\t\t\t\tcv-on = "wheel:cancel(event)"\n\t\t\t\t\t>\n\t\t\t\t\t\t<div class = "form constrict">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tcv-on = "click:addButtonClicked(event)"\n\t\t\t\t\t\t\t\tclass = "bubble bottom left-margin close"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t&#215;\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t[[createForm]]\n\t\t\t\t\t\t[[searchForm]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = "overlay loading">\n\t\t\t\t\t\t[[loader]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div\n\t\t\t\t\t\tcv-on = "click:addButtonClicked(event)"\n\t\t\t\t\t\tclass = "bubble bottom left-margin add"\n\t\t\t\t\t>+</div>\n\n\t\t\t\t</fieldset>\n\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(View, [{
		key: 'setCreateForm',
		value: function setCreateForm(args) {
			this.args.createForm = new _CreateForm.CreateForm(Object.assign({}, args), args.publicId ? this.args.attrs['data-endpoint'] + '/' + args.publicId + '/edit' : this.args.attrs['data-endpoint'] + '/create');

			this.args.searchForm = new _SearchForm.SearchForm(Object.assign({}, args), this.args.attrs['data-endpoint']);
		}
	}, {
		key: 'wrapSubfield',
		value: function wrapSubfield(field) {
			return new _Wrapper.Wrapper({ field: field, parent: this });
		}
	}, {
		key: 'addButtonClicked',
		value: function addButtonClicked() {
			this.setCreateForm({ view: this });

			this.args.creating = this.args.creating ? '' : 'creating';
		}
	}, {
		key: 'addRecord',
		value: function addRecord(record) {
			var fieldClass = this.args.fields[-1].constructor;

			var skeleton = Object.assign({}, this.args.fields[-1].skeleton);
			var name = Object.values(this.args.fields).length - 1;

			skeleton = this.cloneSkeleton(skeleton);

			skeleton = this.correctNames(skeleton, name);

			var superSkeleton = {};

			superSkeleton[name + 1] = skeleton;

			var newField = _Form.Form.renderFields(superSkeleton, this)[name + 1];

			this.args.fields[name] = newField;

			console.log(record, newField);

			newField.args.value.id = record.id || '';
			newField.args.value.class = record.class || '';
			newField.args.value.title = record.title || '';

			var newWrap = this.wrapSubfield(newField);

			this.args._fields.push(newWrap);

			newWrap.refresh(record);
		}
	}, {
		key: 'editRecord',
		value: function editRecord(record, wrapper) {
			this.setCreateForm({
				view: this,
				publicId: record.publicId,
				wrapper: wrapper
			});

			this.args.creating = this.args.creating ? '' : 'creating';

			console.log(wrapper);
		}
	}, {
		key: 'deleteImage',
		value: function deleteImage(index) {
			this.args.fields[index].disable();
			this.args._fields[index].args.classes = 'deleted';
		}
	}, {
		key: 'undeleteImage',
		value: function undeleteImage(index) {
			this.args.fields[index].enable();
			console.log(this.args.fields[index]);
			console.log(this.args._fields[index]);
			console.log('===============');

			this.args._fields[index].args.classes = '';
		}
	}, {
		key: 'cloneSkeleton',
		value: function cloneSkeleton(object) {
			var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var _object = {};

			if (Array.isArray(object)) {
				_object = [];
			}

			for (var i in object) {
				if (i == 'fields') {
					continue;
				}

				if (_typeof(object[i]) !== 'object') {
					_object[i] = object[i];

					continue;
				}

				_object[i] = Object.assign({}, this.cloneSkeleton(object[i], level + 1));
			}

			return _object;
		}
	}, {
		key: 'correctNames',
		value: function correctNames(skeleton, id) {
			skeleton.name = skeleton.name.replace(/\[-1\]/, '[' + id + ']');

			skeleton.attrs.name = skeleton.name;

			if ('children' in skeleton) {
				for (var i in skeleton.children) {
					skeleton.children[i] = this.correctNames(skeleton.children[i], id);
				}
			}

			return skeleton;
		}
	}, {
		key: 'drag',
		value: function drag(event) {
			this.dragging = event.target;
		}
	}, {
		key: 'dragOver',
		value: function dragOver(event) {
			if (!this.dragging) {
				return false;
			}

			var dropping = event.target;

			while (dropping && !dropping.matches('[draggable="true"]')) {
				dropping = dropping.parentNode;
			}

			if (dropping) {
				this.dropping = dropping;
				event.preventDefault();
			}
		}
	}, {
		key: 'drop',
		value: function drop(event) {
			event.stopPropagation();

			var dragLabel = this.dragging.querySelector('label');
			var dropLabel = this.dropping.querySelector('label');

			var dragName = dragLabel.getAttribute('for');
			var dropName = dropLabel.getAttribute('for');

			var dragIndex = this.extractIndex(dragName);
			var dropIndex = this.extractIndex(dropName);

			if (dragIndex == dropIndex || dragIndex == dropIndex - 1) {
				this.dragging = false;
				this.dropping = false;
				return;
			}

			var dragFields = dragLabel.querySelectorAll('[name^="' + dragName + '"]');
			var dragLabels = dragLabel.querySelectorAll('[for^="' + dragName + '"]');

			var dropFields = dropLabel.querySelectorAll('[name^="' + dropName + '"]');
			var dropLabels = dropLabel.querySelectorAll('[for^="' + dropName + '"]');

			var dropBefore = this.dropping;

			var offset = 0;

			var dragField = void 0,
			    dropField = void 0;

			for (var i in this.args.fields) {
				var currentFieldSet = this.args.fields[i].tags.input.element;
				var currentLabel = this.args.fields[i].tags.label.element;
				var currentName = currentFieldSet.getAttribute('name');

				if (dragLabel == currentLabel) {
					dragField = this.args.fields[i];
				}

				if (dropLabel == currentLabel) {
					dropField = this.args.fields[i];
				}

				var currentIndex = this.extractIndex(currentName);
				var newName = false;

				if (currentIndex < 0) {
					continue;
				}

				if (dragIndex > dropIndex && currentIndex >= dropIndex && currentIndex <= dragIndex) {
					newName = this.changeIndex(currentName, currentIndex + 1);
					offset = -1;
				} else if (dragIndex < dropIndex && currentIndex <= dropIndex && currentIndex >= dragIndex) {
					newName = this.changeIndex(currentName, currentIndex - 1);
					offset = 0;
				}

				if (newName !== false) {
					this.changeAttributePrefix(currentLabel, 'for', currentName, newName);

					this.args.fields[i].args.fieldName = newName;

					this.changeAttributePrefix(currentFieldSet, 'name', currentName, newName);

					var currentFields = currentFieldSet.parentNode.querySelectorAll('[name^="' + currentName + '"]');

					for (var _i = 0; _i < currentFields.length; _i++) {
						this.changeAttributePrefix(currentFields[_i], 'name', currentName, newName);
					}

					var currentLabels = currentFieldSet.parentNode.querySelectorAll('[for^="' + currentName + '"]');

					for (var _i2 = 0; _i2 < currentLabels.length; _i2++) {
						this.changeAttributePrefix(currentLabels[_i2], 'for', currentName, newName);
					}
				}
			}

			dragName = dragLabel.getAttribute('for');
			dropName = dropLabel.getAttribute('for');

			dragIndex = this.extractIndex(dragName);
			dropIndex = this.extractIndex(dropName);

			this.changeAttributePrefix(dragLabel, 'for', dragName, this.changeIndex(dragName, dropIndex + offset));

			for (var _i3 = 0; _i3 < dragFields.length; _i3++) {
				this.changeAttributePrefix(dragFields[_i3], 'name', dragName, this.changeIndex(dragName, dropIndex + offset));
			}

			for (var _i4 = 0; _i4 < dragLabels.length; _i4++) {
				this.changeAttributePrefix(dragLabels[_i4], 'for', dragName, this.changeIndex(dragName, dropIndex + offset));
			}

			dragField.args.fieldName = dragLabel.getAttribute('for');

			this.changeAttributePrefix(dropLabel, 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));

			for (var _i5 = 0; _i5 < dropFields.length; _i5++) {
				this.changeAttributePrefix(dropFields[_i5], 'name', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
			}

			for (var _i6 = 0; _i6 < dropLabels.length; _i6++) {
				this.changeAttributePrefix(dropLabels[_i6], 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
			}

			dropField.args.fieldName = dropLabel.getAttribute('for');

			this.dragging.parentNode.insertBefore(this.dragging, dropBefore);

			this.dragging = false;
			this.dropping = false;
		}
	}, {
		key: 'dragStop',
		value: function dragStop() {
			this.dragging = false;
			this.dropping = false;
		}
	}, {
		key: 'changeAttributePrefix',
		value: function changeAttributePrefix(node, attribute, oldPrefix, newPrefix) {
			var oldName = node.getAttribute(attribute);

			var newName = newPrefix + node.getAttribute(attribute).substring(oldPrefix.length);

			node.setAttribute(attribute, newName);
		}
	}, {
		key: 'extractIndex',
		value: function extractIndex(name) {
			var groups = void 0;

			if (groups = /\[(-?\d+)\]$/.exec(name)) {
				return parseInt(groups[1]);
			}

			return false;
		}
	}, {
		key: 'changeIndex',
		value: function changeIndex(name, index) {
			var newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');

			return newName;
		}
	}, {
		key: 'cancel',
		value: function cancel(event) {
			event.stopPropagation();
		}
	}]);

	return View;
}(_FieldSet2.FieldSet);
});

;require.register("form/multiField/Wrapper.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Wrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _View2 = require('../../base/View');

var _Repository = require('../../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wrapper = exports.Wrapper = function (_View) {
	_inherits(Wrapper, _View);

	function Wrapper(args) {
		_classCallCheck(this, Wrapper);

		var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, args));

		_this.template = '\n\t\t\t<div\n\t\t\t\tclass = "wrapped-field [[classes]]"\n\t\t\t\tcv-on = "click:editRecord(event, key)"\n\t\t\t\ttitle = "[[fieldName]]: [[id]]"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\tcv-on = "click:deleteImage(event, key)"\n\t\t\t\t\tstyle = "display: inline; cursor:pointer;"\n\t\t\t\t>\n\t\t\t\t\t[[icon]]\n\t\t\t\t</div>\n\t\t\t\t<div class = "field-content">\n\t\t\t\t\t[[title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style = "display:none">[[field]]</div>\n\t\t';

		_this.args.field = _this.args.field || '!';
		_this.args.keyword = '';
		_this.args.title = '';
		_this.args.record = {};
		_this.args.key = _this.args.field.key;
		_this.args.classes = '';
		_this.args.icon = '×';
		_this.deleted = false;

		_this.args.field.args.bindTo('fieldName', function (v) {
			_this.args.fieldName = v;
		});

		_this.args.fieldName = _this.args.field.args.name;

		_this.args.id = _this.args.field.args.value.id;

		_this.args.bindTo('id', function (v) {
			_this.args.field.args.value.id = v;
		});

		_this.args.field.args.value.bindTo('id', function (v) {
			if (!v) {
				return;
			}

			_Repository.Repository.request(_this.backendPath(), { id: v }).then(function (response) {
				_this.args.id = v;

				console.log(response);

				var record = response.body[0];

				if (!record) {
					_this.args.publicId = null;
					_this.args.title = null;

					return;
				}

				console.log(record);

				_this.refresh(record);
			});
		});

		_this.args.field.args.value.bindTo('keyword', function (v) {
			_this.args.keyword = v;
		});
		return _this;
	}

	_createClass(Wrapper, [{
		key: 'editRecord',
		value: function editRecord() {
			this.args.parent.editRecord(this.args.record, this);
		}
	}, {
		key: 'deleteImage',
		value: function deleteImage(event, index) {
			event.stopPropagation();

			if (!this.deleted) {
				this.args.icon = '↺';
				this.args.parent.deleteImage(index);
				this.deleted = true;
			} else {
				this.args.icon = '×';
				this.args.parent.undeleteImage(index);
				this.deleted = false;
			}
		}
	}, {
		key: 'backendPath',
		value: function backendPath() {
			return _Config.Config.backend + this.args.parent.args.attrs['data-endpoint'];
		}
	}, {
		key: 'getRecordTitle',
		value: function getRecordTitle(record) {
			console.log(record);

			if (record._titleField) {
				return record[record._titleField];
			}

			return record.title || record.publicId || record.id;
		}
	}, {
		key: 'refresh',
		value: function refresh(model) {
			for (var i in model) {
				this.args[i] = model[i];
			}

			this.args.record = model;

			this.args.title = this.getRecordTitle(model);
		}
	}]);

	return Wrapper;
}(_View2.View);
});

;require.register("index.js", function(exports, require, module) {
"use strict";
});

;require.register("input/Keyboard.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Keyboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('../base/Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keyboard = exports.Keyboard = function () {
	function Keyboard() {
		var _this = this;

		_classCallCheck(this, Keyboard);

		this.maxDecay = 120;

		this.listening = true;

		this.keys = _Bindable.Bindable.makeBindable({});
		this.codes = _Bindable.Bindable.makeBindable({});

		document.addEventListener('keyup', function (event) {
			_this.keys[event.key] = -1;
			_this.codes[event.code] = -1;
		});

		document.addEventListener('keydown', function (event) {
			if (_this.keys[event.key] > 0) {
				return;
			}
			_this.keys[event.key] = 1;
			_this.codes[event.code] = 1;
		});

		window.addEventListener('blur', function (event) {
			for (var i in _this.keys) {
				_this.keys[i] = -1;
			}
			for (var _i in _this.codes) {
				_this.codes[_i] = -1;
			}
		});
	}

	_createClass(Keyboard, [{
		key: 'getKey',
		value: function getKey(key) {
			if (!this.keys[key]) {
				return 0;
			}

			return this.keys[key];
		}
	}, {
		key: 'getKeyCode',
		value: function getKeyCode(code) {
			if (!this.codes[code]) {
				return 0;
			}

			return this.codes[code];
		}
	}, {
		key: 'update',
		value: function update() {
			for (var i in this.keys) {
				if (this.keys[i] > 0) {
					this.keys[i]++;
				} else {
					this.keys[i]--;

					if (this.keys[i] < -this.maxDecay) {
						delete this.keys[i];
					}
				}
			}
			for (var i in this.codes) {
				if (this.codes[i] > 0) {
					this.codes[i]++;
				} else {
					this.codes[i]--;

					if (this.codes[i] < -this.maxDecay) {
						delete this.keys[i];
					}
				}
			}
		}
	}]);

	return Keyboard;
}();
});

;require.register("tag/LazyTag.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LazyTag = undefined;

var _ScrollTag2 = require('./ScrollTag');

var _Dom = require('../base/Dom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyTag = exports.LazyTag = function (_ScrollTag) {
	_inherits(LazyTag, _ScrollTag);

	function LazyTag(element, parent, ref, index, direct) {
		_classCallCheck(this, LazyTag);

		var _this = _possibleConstructorReturn(this, (LazyTag.__proto__ || Object.getPrototypeOf(LazyTag)).call(this, element, parent, ref, index, direct));

		_this.element.classList.remove('cv-visible');
		_this.element.classList.add('cv-not-visible');

		_this.bindTo('visible', function (v) {
			if (v) {
				if (_this.afterScroll) {
					clearTimeout(_this.afterScroll);
				}
				_this.afterScroll = setTimeout(function () {
					if (!_this.element) {
						return;
					}

					_this.element.classList.add('cv-visible');
					_this.element.classList.remove('cv-not-visible');

					_Dom.Dom.mapTags(_this.element, '[cv-lazy-style]', function (tag) {
						var lazyStyle = tag.getAttribute('cv-lazy-style');
						var style = tag.getAttribute('style');

						tag.setAttribute('style', style + ';' + lazyStyle);

						tag.removeAttribute('cv-lazy-style');
					});
				}, (_this.offsetTop || _this.element.offsetTop) * 0.5 + _this.element.offsetLeft * 0.5);
			}
		});
		return _this;
	}

	return LazyTag;
}(_ScrollTag2.ScrollTag);
});

;require.register("tag/PopOutTag.js", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PopOutTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Bindable = require('../base/Bindable');

var _Dom = require('../base/Dom');

var _Tag2 = require('../base/Tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopOutTag = exports.PopOutTag = function (_Tag) {
	_inherits(PopOutTag, _Tag);

	function PopOutTag(element, parent, ref, index, direct) {
		_classCallCheck(this, PopOutTag);

		var _this = _possibleConstructorReturn(this, (PopOutTag.__proto__ || Object.getPrototypeOf(PopOutTag)).call(this, element, parent, ref, index, direct));

		_this.poppedOut = false;
		_this.style = element.getAttribute('style');
		_this.moving = false;

		_this.leftDuration = 0;
		_this.topDuration = 0;
		_this.rightDuration = 0;
		_this.bottomDuration = 0;

		_this.verticalDuration = 0;
		_this.horizontalDuration = 0;

		_this.unpoppedStyle = '';
		_this.previousScroll = 0;

		_this.bodyStyle = '';
		_this.bodyScroll = 0;

		_this.element.classList.add('unpopped');

		_this.scrollStyle;

		_this.popTimeout = null;

		// this.element.addEventListener('cvDomDetached', this.detachListener);
		_this.rect;

		_this.clickListener = function (event) {
			_this.rect = _this.element.getBoundingClientRect();

			if (!_this.poppedOut) {
				_this.distance = Math.sqrt(Math.pow(_this.rect.top, 2) + Math.pow(_this.rect.left, 2));

				var cut = 1750;

				var fromRight = window.innerWidth - _this.rect.right;
				var fromBottom = window.innerHeight - _this.rect.bottom;

				var horizontalAverage = (_this.rect.left + fromRight) / 2;
				var vericalAverage = (_this.rect.top + fromBottom) / 2;

				_this.horizontalDuration = horizontalAverage / cut;
				_this.verticalDuration = vericalAverage / cut;

				if (_this.horizontalDuration < 0.1) {
					_this.horizontalDuration = 0.2;
				}
				if (_this.verticalDuration < 0.1) {
					_this.verticalDuration = 0.2;
				}

				if (_this.horizontalDuration > 0.4) {
					_this.horizontalDuration = 0.4;
				}
				if (_this.verticalDuration > 0.4) {
					_this.verticalDuration = 0.4;
				}

				console.log(_this.horizontalDuration, _this.verticalDuration);
			}

			if (!_this.element.contains(event.target)) {
				return;
			}

			event.stopPropagation();
			event.preventDefault();

			if (_this.moving) {
				return;
			}

			if (!_this.poppedOut) {
				_this.pop();
			} else if (event.target.matches('.closeButton') && _this.poppedOut) {
				_this.unpop();
			}
		};

		if (!_this.element.___clickListener___) {
			Object.defineProperty(_this.element, '___scrollListeners___', {
				enumerable: false,
				writable: true
			});

			_this.element.___clickListener___ = _this.clickListener;

			_this.element.addEventListener('click', element.___clickListener___);

			_this.cleanup.push(function (element) {
				return function () {
					element.removeEventListener('click', element.___clickListener___);
				};
			}(element));
		}
		return _this;
	}

	_createClass(PopOutTag, [{
		key: 'pause',
		value: function pause() {
			var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'pause', this).call(this, paused);

			if (paused) {
				document.body.setAttribute('style', this.bodyStyle);
				document.body.setAttribute('style', '');
			}
		}
	}, {
		key: 'pop',
		value: function pop() {
			var _this2 = this;

			PopOutTag.popLevel();

			this.previousScroll = window.scrollY;

			this.rect = this.element.getBoundingClientRect();
			this.style = this.element.getAttribute('style');

			window.requestAnimationFrame(function () {

				_this2.unpoppedStyle = '\n\t\t\t\t;position:  fixed;\n\t\t\t\tleft:       ' + _this2.rect.x + 'px;\n\t\t\t\ttop:        ' + _this2.rect.y + 'px;\n\t\t\t\twidth:      ' + _this2.rect.width + 'px;\n\t\t\t\theight:     ' + _this2.rect.height + 'px;\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition: width ' + _this2.horizontalDuration + 's  ease-out\n\t\t\t\t\t\t\t, top ' + _this2.verticalDuration + 's    ease-out\n\t\t\t\t\t\t\t, left ' + _this2.horizontalDuration + 's ease-out\n\t\t\t\t\t\t\t, height ' + _this2.verticalDuration + 's ease-out\n\t\t\t\t\t\t\t, all ' + _this2.horizontalDuration + 's  ease-out;\n\t\t\t\toverflow: hidden;\n\t\t\t';

				var style = _this2.style + _this2.unpoppedStyle;

				_this2.element.setAttribute('style', style);

				window.requestAnimationFrame(function () {
					style += '\n\t\t\t\t\t;top:   0px;\n\t\t\t\t\tleft:   0px;\n\t\t\t\t\twidth:  100%;\n\t\t\t\t\theight: 100%;\n\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\ttransition: width ' + _this2.horizontalDuration + 's ease-out\n\t\t\t\t\t\t, top ' + _this2.verticalDuration + 's           ease-out\n\t\t\t\t\t\t, left ' + _this2.horizontalDuration + 's        ease-out\n\t\t\t\t\t\t, height ' + _this2.verticalDuration + 's        ease-out\n\t\t\t\t\t\t, all ' + _this2.horizontalDuration + 's         ease-out;\n\t\t\t\t';

					_this2.moving = true;

					_this2.element.setAttribute('style', style);
					_this2.element.classList.add('popped');
					_this2.element.classList.remove('unpopped');

					_this2.popTimeout = setTimeout(function () {
						if (!_this2.element) {
							return;
						}
						_this2.bodyStyle = document.body.getAttribute('style');

						document.body.setAttribute('style', 'height:100%;overflow:hidden;');

						_this2.moving = false;
						_Dom.Dom.mapTags(_this2.element, false, function (tag) {
							var event = new CustomEvent('cvPopped');

							tag.dispatchEvent(event);

							_this2.scrollStyle = _this2.element.getAttribute('style');
						});
						var event = new CustomEvent('cvPop', {
							bubbles: true,
							detail: {
								tag: _this2,
								view: _this2.parent,
								publicId: _this2.parent.args.publicId
							}
						});
						_this2.element.dispatchEvent(event);
					}, _this2.horizontalDuration * 1000);
				});

				_this2.poppedOut = true;
			});
		}
	}, {
		key: 'unpop',
		value: function unpop() {
			var _this3 = this;

			this.element.classList.add('unpopping');

			if (this.popTimeout) {
				clearTimeout(this.popTimeout);
			}

			if (PopOutTag.level == 0) {
				document.body.setAttribute('style', '');
			} else {
				document.body.setAttribute('style', this.bodyStyle || '');
			}

			PopOutTag.unpopLevel();

			if (!this.rect) {
				this.rect = this.element.getBoundingClientRect();
			}

			window.scrollTo(0, this.previousScroll);

			var style = this.style + this.unpoppedStyle + (';transition: width ' + this.horizontalDuration + 's ease-in\n\t\t\t\t\t, height ' + this.verticalDuration + 's        ease-in\n\t\t\t\t\t, all ' + this.horizontalDuration + 's         ease-in;');

			this.element.setAttribute('style', style);

			this.moving = true;

			setTimeout(function () {
				if (!_this3.element) {
					return;
				}
				_this3.element.classList.remove('popped');
			}, this.horizontalDuration * 1000);
			setTimeout(function () {
				_this3.element.classList.add('unpopped');
				_this3.element.classList.remove('unpopping');
				if (!_this3.element) {
					return;
				}
				_this3.element.setAttribute('style', _this3.style);
				_this3.moving = false;
				_Dom.Dom.mapTags(_this3.element, false, function (tag) {
					var event = new CustomEvent('cvUnpopped');

					tag.dispatchEvent(event);
				});
				var event = new CustomEvent('cvUnpop', {
					bubbles: true,
					detail: {
						tag: _this3,
						view: _this3.parent,
						publicId: _this3.parent.args.publicId
					}
				});
				_this3.element.dispatchEvent(event);
			}, this.horizontalDuration * 1000);

			this.poppedOut = false;
		}
	}, {
		key: 'remove',
		value: function remove() {
			document.body.setAttribute('style', this.bodyStyle);
			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'remove', this).call(this);
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

			if (this.level < 0) {
				this.level = 0;
			}

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

	function ScrollTag(element, parent, ref, index, direct) {
		_classCallCheck(this, ScrollTag);

		var _this = _possibleConstructorReturn(this, (ScrollTag.__proto__ || Object.getPrototypeOf(ScrollTag)).call(this, element, parent, ref, index, direct));
		// parent.cleanup.push(x=>{console.log('Parent cleanup');});
		// direct.cleanup.push(x=>{console.log('Direct cleanup');});

		_this.visible = false;
		_this.offsetTop = false;
		_this.offsetBottom = false;

		_this.attachListener = function (e) {
			var rootNode = e.target;

			while (rootNode.parentNode) {
				rootNode = rootNode.parentNode;
			}

			if (rootNode !== window && rootNode !== document) {
				return;
			}

			if (e.target !== element) {
				return;
			}

			_this.addScrollListener(e.target);
			_this.addResizeListener(e.target);

			_this.scrolled(e.target);

			e.target.removeEventListener('cvDomAttached', _this.attachListener);
		};

		_this.element.addEventListener('cvDomAttached', _this.attachListener);

		_this.cleanup.push(function (element) {
			return function () {
				element.removeEventListener('cvDomAttached', _this.attachListener);
			};
		}(_this.element));

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

			if (!current) {
				return;
			}

			var offsetTop = 0,
			    offsetBottom = 0;

			var visible = false;

			var rect = current.getBoundingClientRect();

			if (rect.bottom > 0 && rect.top < window.innerHeight) {
				visible = true;
			}

			this.proxy.visible = visible;
			this.proxy.offsetTop = rect.top || 0;
			this.proxy.offsetBottom = rect.bottom || 0;
		}
	}, {
		key: 'addScrollListener',
		value: function addScrollListener(tag) {
			var _this2 = this;

			if (!tag.___scrollListener___) {
				Object.defineProperty(tag, '___scrollListener___', {
					enumerable: false,
					writable: true
				});

				tag.___scrollListener___ = function (event) {
					_this2.scrolled(event.target);
				};

				var node = tag;
				var options = { passive: true, capture: true };

				while (node.parentNode) {
					node = node.parentNode;

					node.addEventListener('scroll', tag.___scrollListener___, options);

					this.direct.cleanup.push(function (node, tag, options) {
						return function () {
							node.removeEventListener('scroll', tag.___scrollListener___, options);
							tag = node = null;
						};
					}(node, tag, options));
				}
			}
		}
	}, {
		key: 'addResizeListener',
		value: function addResizeListener(tag) {
			var _this3 = this;

			if (!tag.___resizeListener___) {
				Object.defineProperty(tag, '___resizeListener___', {
					enumerable: false,
					writable: true
				});

				tag.___resizeListener___ = function (event) {
					_this3.scrolled(event.target);
				};

				window.addEventListener('resize', this.resizeListener);

				this.direct.cleanup.push(function (element) {
					return function () {
						window.removeEventListener('resize', element.___resizeListener___);
						tag.___resizeListener___ = null;
						tag = null;
					};
				}(tag));
			}
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
	}, {
		key: 'alert',
		value: function alert(title, body, time) {
			return this.pop(new _ToastAlert.ToastAlert({
				title: title,
				body: body,
				time: time
			}));
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