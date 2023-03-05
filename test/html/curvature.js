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
    var val = aliases[name];
    return (val && name !== val) ? expandAlias(val) : name;
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

require.register("@babel/runtime/helpers/arrayLikeToArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
module.exports = _arrayLikeToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/arrayWithHoles.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
module.exports = _arrayWithHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/arrayWithoutHoles.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var arrayLikeToArray = require("./arrayLikeToArray.js");
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return arrayLikeToArray(arr);
}
module.exports = _arrayWithoutHoles, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/assertThisInitialized.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/classCallCheck.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/construct.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var setPrototypeOf = require("./setPrototypeOf.js");
var isNativeReflectConstruct = require("./isNativeReflectConstruct.js");
function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    module.exports = _construct = Reflect.construct.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) setPrototypeOf(instance, Class.prototype);
      return instance;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/createClass.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var toPropertyKey = require("./toPropertyKey.js");
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/defineProperty.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var toPropertyKey = require("./toPropertyKey.js");
function _defineProperty(obj, key, value) {
  key = toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/get.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var superPropBase = require("./superPropBase.js");
function _get() {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(arguments.length < 3 ? target : receiver);
      }
      return desc.value;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
  return _get.apply(this, arguments);
}
module.exports = _get, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/getPrototypeOf.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/inherits.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var setPrototypeOf = require("./setPrototypeOf.js");
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  Object.defineProperty(subClass, "prototype", {
    writable: false
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/interopRequireDefault.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    "default": obj
  };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/isNativeReflectConstruct.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;
  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/iterableToArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
module.exports = _iterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/iterableToArrayLimit.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}
module.exports = _iterableToArrayLimit, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/nonIterableRest.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableRest, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/nonIterableSpread.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
module.exports = _nonIterableSpread, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/possibleConstructorReturn.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var _typeof = require("./typeof.js")["default"];
var assertThisInitialized = require("./assertThisInitialized.js");
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  } else if (call !== void 0) {
    throw new TypeError("Derived constructors may only return object or undefined");
  }
  return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/readOnlyError.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _readOnlyError(name) {
  throw new TypeError("\"" + name + "\" is read-only");
}
module.exports = _readOnlyError, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/setPrototypeOf.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports;
  return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/slicedToArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var arrayWithHoles = require("./arrayWithHoles.js");
var iterableToArrayLimit = require("./iterableToArrayLimit.js");
var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");
var nonIterableRest = require("./nonIterableRest.js");
function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}
module.exports = _slicedToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/superPropBase.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var getPrototypeOf = require("./getPrototypeOf.js");
function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}
module.exports = _superPropBase, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/toConsumableArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var arrayWithoutHoles = require("./arrayWithoutHoles.js");
var iterableToArray = require("./iterableToArray.js");
var unsupportedIterableToArray = require("./unsupportedIterableToArray.js");
var nonIterableSpread = require("./nonIterableSpread.js");
function _toConsumableArray(arr) {
  return arrayWithoutHoles(arr) || iterableToArray(arr) || unsupportedIterableToArray(arr) || nonIterableSpread();
}
module.exports = _toConsumableArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/toPrimitive.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var _typeof = require("./typeof.js")["default"];
function _toPrimitive(input, hint) {
  if (_typeof(input) !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (_typeof(res) !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/toPropertyKey.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var _typeof = require("./typeof.js")["default"];
var toPrimitive = require("./toPrimitive.js");
function _toPropertyKey(arg) {
  var key = toPrimitive(arg, "string");
  return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/typeof.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    function _typeof(obj) {
  "@babel/helpers - typeof";

  return (module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, module.exports.__esModule = true, module.exports["default"] = module.exports), _typeof(obj);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});

require.register("@babel/runtime/helpers/unsupportedIterableToArray.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "@babel/runtime");
  (function() {
    var arrayLikeToArray = require("./arrayLikeToArray.js");
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}
module.exports = _unsupportedIterableToArray, module.exports.__esModule = true, module.exports["default"] = module.exports;
  })();
});
require.register("curvature/Config.js", function(exports, require, module) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var Config = {
  title: 'Curvature 0.0.66-r'
};
exports.Config = Config;
});

require.register("curvature/access/LoginView.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginView = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Config = require("../base/Config");
var _View2 = require("../base/View");
var _Router = require("../base/Router");
var _Repository = require("../base/Repository");
var _UserRepository = require("./UserRepository");
var _Toast = require("../toast/Toast");
var _ToastAlert = require("../toast/ToastAlert");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var LoginView = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(LoginView, _View);
  var _super = _createSuper(LoginView);
  function LoginView() {
    var _this;
    (0, _classCallCheck2.default)(this, LoginView);
    _this = _super.call(this);
    _this.template = "\n\t\t\t<a cv-link = \"user\">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = \"user/login\">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/register\">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/logout\">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Login via FaceBook\"\n\t\t\t \tcv-on = \"click:facebookLogin(event)\"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Log Out\"\n\t\t\t \tcv-on = \"click:logout(event)\"\n\t\t\t />\n\t\t";
    return _this;
  }
  (0, _createClass2.default)(LoginView, [{
    key: "facebookLogin",
    value: function facebookLogin(event) {
      var _this2 = this;
      console.log('fb!');
      event.preventDefault();
      var fbWindow = window.open(_Config.Config.get('backend') + '/facebookLogin');
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
    key: "logout",
    value: function logout(event) {
      var logoutWindow = window.open(_Config.Config.get('backend') + '/user/logout?page=app%3Fclose%3D1');
    }
  }]);
  return LoginView;
}(_View2.View);
exports.LoginView = LoginView;
});

;require.register("curvature/access/UserRepository.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRepository = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Config = require("../base/Config");
var _Bindable = require("../base/Bindable");
var _Repository2 = require("../base/Repository");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var UserRepository = /*#__PURE__*/function (_Repository) {
  (0, _inherits2.default)(UserRepository, _Repository);
  var _super = _createSuper(UserRepository);
  function UserRepository() {
    (0, _classCallCheck2.default)(this, UserRepository);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(UserRepository, null, [{
    key: "uri",
    get: function get() {
      return _Config.Config.get('backend') + '/user/';
    }
  }, {
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var _this = this;
      var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (window.prerenderer || navigator.userAgent.match(/prerender/i)) {
        window.prerenderer = window.prerenderer || true;
        return;
      }
      if (this.args.response && refresh === false) {
        return Promise.resolve(this.args.response);
      }
      return this.request(this.uri + 'current', false, false).then(function (response) {
        if (response.body && response.body.roles) {
          for (var i in response.body.roles) {
            if (response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator') {
              response.body.isAdmin = true;
            }
          }
        }
        if (response.body && response.body.id) {
          _this.args.response = response;
          _this.args.current = response.body;
        }
        return response;
      }).catch(function (error) {
        console.error(error);
      });
    }
  }, {
    key: "login",
    value: function login() {
      return this.request(this.uri + '/login');
    }
  }, {
    key: "logout",
    value: function logout() {
      var _this2 = this;
      var user = this.args.current;
      delete this.args.current;
      return this.request(this.uri + 'logout', false, {}, false).then(function () {
        _this2.args.current = null;
        return user;
      });
    }
  }, {
    key: "onChange",
    value: function onChange(callback) {
      return this.args.bindTo('current', callback);
    }
  }]);
  return UserRepository;
}(_Repository2.Repository);
exports.UserRepository = UserRepository;
Object.defineProperty(UserRepository, 'args', {
  configurable: false,
  writable: false,
  value: _Bindable.Bindable.makeBindable({})
});
_Repository2.Repository.onResponse(function (response) {
  if (response && response.meta && 'currentUser' in response.meta && (!UserRepository.args.current || response.meta.currentUser.id !== UserRepository.args.current.id)) {
    UserRepository.args.current = response.meta.currentUser;
  }
});
});

require.register("curvature/animate/Chain.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Chain = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var Chain = /*#__PURE__*/(0, _createClass2.default)(function Chain() {
  (0, _classCallCheck2.default)(this, Chain);
});
exports.Chain = Chain;
});

;require.register("curvature/animate/Ease.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ease = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Mixin = require("../base/Mixin");
var _PromiseMixin = require("../mixin/PromiseMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Ease = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Ease, _Mixin$with);
  var _super = _createSuper(Ease);
  function Ease(interval) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, Ease);
    _this = _super.call(this);
    _this.interval = interval;
    _this.terminal = false;
    _this.initial = false;
    _this.timeout = false;
    _this.final = false;
    _this.canceled = false;
    _this.done = false;
    _this.calculate = _this.calculate || 'calculate' in options ? options.calculate : false;
    _this.bounded = 'bounded' in options ? options.bounded : true;
    _this.repeat = 'repeat' in options ? options.repeat : 1;
    _this.reverse = 'reverse' in options ? options.reverse : false;
    return _this;
  }
  (0, _createClass2.default)(Ease, [{
    key: "start",
    value: function start() {
      var _this2 = this;
      this.done = false;
      requestAnimationFrame(function () {
        _this2.initial = Date.now();
        _this2.terminal = _this2.initial + _this2.interval;
        if (_this2.repeat >= 0) {
          _this2.terminal = _this2.initial + _this2.interval * _this2.repeat;
          _this2.timeout = setTimeout(function () {
            if (_this2.done) {
              return _this2.reverse ? 0 : 1;
            }
            _this2.done = true;
            _this2[_PromiseMixin.PromiseMixin.Accept](_this2.reverse ? 0 : 1);
          }, _this2.interval * _this2.repeat);
        }
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (this.done) {
        return this.final;
      }
      clearTimeout(this.timeout);
      this.final = this.current();
      this.canceled = this.done = true;
      this[_PromiseMixin.PromiseMixin.Reject](this.final);
      return this.final;
    }
  }, {
    key: "fraction",
    value: function fraction() {
      if (this.done) {
        return this.reverse ? 0 : 1;
      }
      if (this.initial === false) {
        return this.reverse ? 1 : 0;
      }
      var elapsed = Date.now() - this.initial;
      if (elapsed / this.interval >= this.repeat) {
        return this.reverse ? 0 : 1;
      }
      var fraction = elapsed % this.interval / this.interval;
      return this.reverse ? 1 - fraction : fraction;
    }
  }, {
    key: "current",
    value: function current() {
      var t = this.fraction();
      if (this.calculate) {
        return this.calculate(t);
      }
      return t;
    }
  }]);
  return Ease;
}(_Mixin.Mixin.with(_PromiseMixin.PromiseMixin));
exports.Ease = Ease;
});

;require.register("curvature/animate/ease/CubicIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CubicIn = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CubicIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(CubicIn, _Ease);
  var _super = _createSuper(CubicIn);
  function CubicIn() {
    var _this;
    (0, _classCallCheck2.default)(this, CubicIn);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(CubicIn);
}(_Ease2.Ease);
exports.CubicIn = CubicIn;
});

;require.register("curvature/animate/ease/CubicInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CubicInOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CubicInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(CubicInOut, _Ease);
  var _super = _createSuper(CubicInOut);
  function CubicInOut() {
    var _this;
    (0, _classCallCheck2.default)(this, CubicInOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    });
    return _this;
  }
  return (0, _createClass2.default)(CubicInOut);
}(_Ease2.Ease);
exports.CubicInOut = CubicInOut;
});

;require.register("curvature/animate/ease/CubicOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CubicOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CubicOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(CubicOut, _Ease);
  var _super = _createSuper(CubicOut);
  function CubicOut() {
    var _this;
    (0, _classCallCheck2.default)(this, CubicOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return --t * t * t + 1;
    });
    return _this;
  }
  return (0, _createClass2.default)(CubicOut);
}(_Ease2.Ease);
exports.CubicOut = CubicOut;
});

;require.register("curvature/animate/ease/ElasticOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElasticOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ElasticOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(ElasticOut, _Ease);
  var _super = _createSuper(ElasticOut);
  function ElasticOut(interval) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, ElasticOut);
    _this = _super.call(this, interval, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return Math.pow(2, -10 * t) * Math.sin((t - _this.friction / 4) * (2 * Math.PI) / _this.friction) + 1;
    });
    _this.friction = _this.friction || 'friction' in options ? options.friction : 0.3;
    return _this;
  }
  return (0, _createClass2.default)(ElasticOut);
}(_Ease2.Ease);
exports.ElasticOut = ElasticOut;
});

;require.register("curvature/animate/ease/GeoIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoIn = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var GeoIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(GeoIn, _Ease);
  var _super = _createSuper(GeoIn);
  function GeoIn(interval) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, GeoIn);
    return _super.call(this, interval, options); // this.calculate = t => Math.pow(t, this.power);
    // this.power = 1;
    // if('power' in options)
    // {
    // 	this.power = options.power
    // }
  }
  return (0, _createClass2.default)(GeoIn);
}(_Ease2.Ease);
exports.GeoIn = GeoIn;
});

;require.register("curvature/animate/ease/GeoInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoInOut = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
var _GeoIn = require("./GeoIn");
var _GeoOut = require("./GeoOut");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
console.log(_GeoIn.GeoIn);
var GeoInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(GeoInOut, _Ease);
  var _super = _createSuper(GeoInOut);
  function GeoInOut() {
    (0, _classCallCheck2.default)(this, GeoInOut);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(GeoInOut, [{
    key: "calculate",
    value: function calculate(t) {
      return t < .5 ? EaseIn(power)(t * 2) / 2 : EaseOut(power)(t * 2 - 1) / 2 + 0.5;
    }
  }]);
  return GeoInOut;
}(_Ease2.Ease);
exports.GeoInOut = GeoInOut;
(0, _defineProperty2.default)(GeoInOut, "power", 1);
});

;require.register("curvature/animate/ease/GeoOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GeoOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var GeoOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(GeoOut, _Ease);
  var _super = _createSuper(GeoOut);
  function GeoOut(interval) {
    var _this;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, GeoOut);
    _this = _super.call(this, interval, options);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return 1 - Math.abs(t - Math.pow(1, _this.power));
    });
    _this.power = _this.power || 'power' in options ? options.power : 1;
    return _this;
  }
  return (0, _createClass2.default)(GeoOut);
}(_Ease2.Ease);
exports.GeoOut = GeoOut;
});

;require.register("curvature/animate/ease/Linear.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Linear = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Linear = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(Linear, _Ease);
  var _super = _createSuper(Linear);
  function Linear() {
    (0, _classCallCheck2.default)(this, Linear);
    return _super.apply(this, arguments);
  }
  return (0, _createClass2.default)(Linear);
}(_Ease2.Ease);
exports.Linear = Linear;
});

;require.register("curvature/animate/ease/QuadIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuadIn = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuadIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuadIn, _Ease);
  var _super = _createSuper(QuadIn);
  function QuadIn() {
    (0, _classCallCheck2.default)(this, QuadIn);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(QuadIn, [{
    key: "current",
    value: function current() {
      var t = this.fraction();
      return t * t;
      return t * (2 - t);
    }
  }]);
  return QuadIn;
}(_Ease2.Ease);
exports.QuadIn = QuadIn;
});

;require.register("curvature/animate/ease/QuadInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuadInOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuadInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuadInOut, _Ease);
  var _super = _createSuper(QuadInOut);
  function QuadInOut() {
    var _this;
    (0, _classCallCheck2.default)(this, QuadInOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuadInOut);
}(_Ease2.Ease);
exports.QuadInOut = QuadInOut;
});

;require.register("curvature/animate/ease/QuadOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuadOut = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuadOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuadOut, _Ease);
  var _super = _createSuper(QuadOut);
  function QuadOut() {
    (0, _classCallCheck2.default)(this, QuadOut);
    return _super.apply(this, arguments);
  }
  (0, _createClass2.default)(QuadOut, [{
    key: "current",
    value: function current() {
      var t = this.fraction();
      return t * (2 - t);
    }
  }]);
  return QuadOut;
}(_Ease2.Ease);
exports.QuadOut = QuadOut;
});

;require.register("curvature/animate/ease/QuartIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuartIn = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuartIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuartIn, _Ease);
  var _super = _createSuper(QuartIn);
  function QuartIn() {
    var _this;
    (0, _classCallCheck2.default)(this, QuartIn);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuartIn);
}(_Ease2.Ease);
exports.QuartIn = QuartIn;
});

;require.register("curvature/animate/ease/QuartInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuartInOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuartInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuartInOut, _Ease);
  var _super = _createSuper(QuartInOut);
  function QuartInOut() {
    var _this;
    (0, _classCallCheck2.default)(this, QuartInOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t < .5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuartInOut);
}(_Ease2.Ease);
exports.QuartInOut = QuartInOut;
});

;require.register("curvature/animate/ease/QuartOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuartOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuartOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuartOut, _Ease);
  var _super = _createSuper(QuartOut);
  function QuartOut() {
    var _this;
    (0, _classCallCheck2.default)(this, QuartOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return 1 - --t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuartOut);
}(_Ease2.Ease);
exports.QuartOut = QuartOut;
});

;require.register("curvature/animate/ease/QuintIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuintIn = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuintIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuintIn, _Ease);
  var _super = _createSuper(QuintIn);
  function QuintIn() {
    var _this;
    (0, _classCallCheck2.default)(this, QuintIn);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t * t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuintIn);
}(_Ease2.Ease);
exports.QuintIn = QuintIn;
});

;require.register("curvature/animate/ease/QuintInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuintInOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuintInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuintInOut, _Ease);
  var _super = _createSuper(QuintInOut);
  function QuintInOut() {
    var _this;
    (0, _classCallCheck2.default)(this, QuintInOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuintInOut);
}(_Ease2.Ease);
exports.QuintInOut = QuintInOut;
});

;require.register("curvature/animate/ease/QuintOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuintOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var QuintOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(QuintOut, _Ease);
  var _super = _createSuper(QuintOut);
  function QuintOut() {
    var _this;
    (0, _classCallCheck2.default)(this, QuintOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return 1 + --t * t * t * t * t;
    });
    return _this;
  }
  return (0, _createClass2.default)(QuintOut);
}(_Ease2.Ease);
exports.QuintOut = QuintOut;
});

;require.register("curvature/animate/ease/SineIn.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SineIn = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SineIn = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(SineIn, _Ease);
  var _super = _createSuper(SineIn);
  function SineIn() {
    var _this;
    (0, _classCallCheck2.default)(this, SineIn);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2);
    });
    return _this;
  }
  return (0, _createClass2.default)(SineIn);
}(_Ease2.Ease);
exports.SineIn = SineIn;
});

;require.register("curvature/animate/ease/SineInOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SineInOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SineInOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(SineInOut, _Ease);
  var _super = _createSuper(SineInOut);
  function SineInOut() {
    var _this;
    (0, _classCallCheck2.default)(this, SineInOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2;
    });
    return _this;
  }
  return (0, _createClass2.default)(SineInOut);
}(_Ease2.Ease);
exports.SineInOut = SineInOut;
});

;require.register("curvature/animate/ease/SineOut.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SineOut = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Ease2 = require("../Ease");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SineOut = /*#__PURE__*/function (_Ease) {
  (0, _inherits2.default)(SineOut, _Ease);
  var _super = _createSuper(SineOut);
  function SineOut() {
    var _this;
    (0, _classCallCheck2.default)(this, SineOut);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _super.call.apply(_super, [this].concat(args));
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "calculate", function (t) {
      return Math.sin(Math.PI / 2 * t);
    });
    return _this;
  }
  return (0, _createClass2.default)(SineOut);
}(_Ease2.Ease);
exports.SineOut = SineOut;
});

;require.register("curvature/base/Bag.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bag = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Bindable = require("./Bindable");
var _Mixin = require("./Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var toId = function toId(int) {
  return Number(int);
};
var fromId = function fromId(id) {
  return parseInt(id);
};
var Mapped = Symbol('Mapped');
var Has = Symbol('Has');
var Add = Symbol('Add');
var Remove = Symbol('Remove');
var Delete = Symbol('Delete');
var Bag = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Bag, _Mixin$with);
  var _super = _createSuper(Bag);
  function Bag() {
    var _this;
    var changeCallback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
    (0, _classCallCheck2.default)(this, Bag);
    _this = _super.call(this);
    _this.changeCallback = changeCallback;
    _this.content = new Map();
    _this.current = 0;
    _this.length = 0;
    _this.list = _Bindable.Bindable.makeBindable([]);
    _this.meta = Symbol('meta');
    _this.type = undefined;
    return _this;
  }
  (0, _createClass2.default)(Bag, [{
    key: "has",
    value: function has(item) {
      if (this[Mapped]) {
        return this[Mapped].has(item);
      }
      return this[Has](item);
    }
  }, {
    key: Has,
    value: function value(item) {
      return this.content.has(item);
    }
  }, {
    key: "add",
    value: function add(item) {
      if (this[Mapped]) {
        return this[Mapped].add(item);
      }
      return this[Add](item);
    }
  }, {
    key: Add,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be added to Bags.');
      }
      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be added to this Bag."));
      }
      item = _Bindable.Bindable.make(item);
      if (this.content.has(item)) {
        return;
      }
      var adding = new CustomEvent('adding', {
        detail: {
          item: item
        }
      });
      if (!this.dispatchEvent(adding)) {
        return;
      }
      var id = toId(this.current++);
      this.content.set(item, id);
      this.list[id] = item;
      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_ADDED, id);
      }
      var add = new CustomEvent('added', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(add);
      this.length = this.size;
      return id;
    }
  }, {
    key: "remove",
    value: function remove(item) {
      if (this[Mapped]) {
        return this[Mapped].remove(item);
      }
      return this[Remove](item);
    }
  }, {
    key: Remove,
    value: function value(item) {
      if (item === undefined || !(item instanceof Object)) {
        throw new Error('Only objects may be removed from Bags.');
      }
      if (this.type && !(item instanceof this.type)) {
        console.error(this.type, item);
        throw new Error("Only objects of type ".concat(this.type, " may be removed from this Bag."));
      }
      item = _Bindable.Bindable.make(item);
      if (!this.content.has(item)) {
        if (this.changeCallback) {
          this.changeCallback(item, this.meta, 0, undefined);
        }
        return false;
      }
      var removing = new CustomEvent('removing', {
        detail: {
          item: item
        }
      });
      if (!this.dispatchEvent(removing)) {
        return;
      }
      var id = this.content.get(item);
      delete this.list[id];
      this.content.delete(item);
      if (this.changeCallback) {
        this.changeCallback(item, this.meta, Bag.ITEM_REMOVED, id);
      }
      var remove = new CustomEvent('removed', {
        detail: {
          item: item,
          id: id
        }
      });
      this.dispatchEvent(remove);
      this.length = this.size;
      return item;
    }
  }, {
    key: "delete",
    value: function _delete(item) {
      if (this[Mapped]) {
        return this[Mapped].delete(item);
      }
      this[Delete](item);
    }
  }, {
    key: Delete,
    value: function value(item) {
      this.remove(item);
    }
  }, {
    key: "map",
    value: function map() {
      var mapper = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function (x) {
        return x;
      };
      var filter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (x) {
        return x;
      };
      var mappedItems = new WeakMap();
      var mappedBag = new Bag();
      mappedBag[Mapped] = this;
      this.addEventListener('added', function (event) {
        var item = event.detail.item;
        if (!filter(item)) {
          return;
        }
        if (mappedItems.has(item)) {
          return;
        }
        var mapped = mapper(item);
        mappedItems.set(item, mapped);
        mappedBag[Add](mapped);
      });
      this.addEventListener('removed', function (event) {
        var item = event.detail.item;
        if (!mappedItems.has(item)) {
          return;
        }
        var mapped = mappedItems.get(item);
        mappedItems.delete(item);
        mappedBag[Remove](mapped);
      });
      return mappedBag;
    }
  }, {
    key: "size",
    get: function get() {
      return this.content.size;
    }
  }, {
    key: "items",
    value: function items() {
      return Array.from(this.content.entries()).map(function (entry) {
        return entry[0];
      });
    }
  }]);
  return Bag;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Bag = Bag;
Object.defineProperty(Bag, 'ITEM_ADDED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 1
});
Object.defineProperty(Bag, 'ITEM_REMOVED', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: -1
});
});

require.register("curvature/base/Bindable.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;
var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var Ref = Symbol('ref');
var Original = Symbol('original');
var Deck = Symbol('deck');
var Binding = Symbol('binding');
var SubBinding = Symbol('subBinding');
var BindingAll = Symbol('bindingAll');
var IsBindable = Symbol('isBindable');
var Wrapping = Symbol('wrapping');
var Names = Symbol('Names');
var Executing = Symbol('executing');
var Stack = Symbol('stack');
var ObjSymbol = Symbol('object');
var Wrapped = Symbol('wrapped');
var Unwrapped = Symbol('unwrapped');
var GetProto = Symbol('getProto');
var OnGet = Symbol('onGet');
var OnAllGet = Symbol('onAllGet');
var BindChain = Symbol('bindChain');
var Descriptors = Symbol('Descriptors');
var Before = Symbol('Before');
var After = Symbol('After');
var NoGetters = Symbol('NoGetters');
var TypedArray = Object.getPrototypeOf(Int8Array);
var SetIterator = Set.prototype[Symbol.iterator];
var MapIterator = Map.prototype[Symbol.iterator];
var win = (typeof globalThis === "undefined" ? "undefined" : (0, _typeof2.default)(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : (0, _typeof2.default)(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof2.default)(self)) === 'object' ? self : void 0;
var excludedClasses = [win.Node, win.File, win.Map, win.Set, win.WeakMap, win.WeakSet, win.ArrayBuffer, win.ResizeObserver, win.MutationObserver, win.PerformanceObserver, win.IntersectionObserver, win.IDBCursor, win.IDBCursorWithValue, win.IDBDatabase, win.IDBFactory, win.IDBIndex, win.IDBKeyRange, win.IDBObjectStore, win.IDBOpenDBRequest, win.IDBRequest, win.IDBTransaction, win.IDBVersionChangeEvent, win.Event, win.CustomEvent, win.FileSystemFileHandle].filter(function (x) {
  return typeof x === 'function';
});
var Bindable = /*#__PURE__*/function () {
  function Bindable() {
    (0, _classCallCheck2.default)(this, Bindable);
  }
  (0, _createClass2.default)(Bindable, null, [{
    key: "isBindable",
    value: function isBindable(object) {
      if (!object || !object[IsBindable]) {
        return false;
      }
      return object[IsBindable] === Bindable;
    }
  }, {
    key: "onDeck",
    value: function onDeck(object, key) {
      return object[Deck][key] || false;
    }
  }, {
    key: "ref",
    value: function ref(object) {
      return object[Ref] || object || false;
    }
  }, {
    key: "makeBindable",
    value: function makeBindable(object) {
      return this.make(object);
    }
  }, {
    key: "shuck",
    value: function shuck(original, seen) {
      seen = seen || new Map();
      var clone = {};
      if (original instanceof TypedArray || original instanceof ArrayBuffer) {
        var _clone = original.slice(0);
        seen.set(original, _clone);
        return _clone;
      }
      var properties = Object.keys(original);
      for (var i in properties) {
        var ii = properties[i];
        if (ii.substring(0, 3) === '___') {
          continue;
        }
        var alreadyCloned = seen.get(original[ii]);
        if (alreadyCloned) {
          clone[ii] = alreadyCloned;
          continue;
        }
        if (original[ii] === original) {
          seen.set(original[ii], clone);
          clone[ii] = clone;
          continue;
        }
        if (original[ii] && (0, _typeof2.default)(original[ii]) === 'object') {
          var originalProp = original[ii];
          if (Bindable.isBindable(original[ii])) {
            originalProp = original[ii][Original];
          }
          clone[ii] = this.shuck(originalProp, seen);
        } else {
          clone[ii] = original[ii];
        }
        seen.set(original[ii], clone[ii]);
      }
      if (Bindable.isBindable(original)) {
        delete clone.bindTo;
        delete clone.isBound;
      }
      return clone;
    }
  }, {
    key: "make",
    value: function make(object) {
      var _this = this;
      if (!object || !['function', 'object'].includes((0, _typeof2.default)(object))) {
        return object;
      }
      if (object[Ref]) {
        return object[Ref];
      }
      if (object[IsBindable]) {
        return object;
      }
      if (Object.isSealed(object) || Object.isFrozen(object) || !Object.isExtensible(object) || excludedClasses.filter(function (x) {
        return object instanceof x;
      }).length) {
        return object;
      }
      Object.defineProperty(object, IsBindable, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Bindable
      });
      Object.defineProperty(object, Ref, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: false
      });
      Object.defineProperty(object, Original, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: object
      });
      Object.defineProperty(object, Deck, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Binding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, SubBinding, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Map()
      });
      Object.defineProperty(object, BindingAll, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Executing, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Wrapping, {
        enumerable: false,
        writable: true
      });
      Object.defineProperty(object, Stack, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Before, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, After, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Wrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.preventExtensions(new Map())
      });
      Object.defineProperty(object, Unwrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
      });
      Object.defineProperty(object, Descriptors, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Object.preventExtensions(new Map())
      });
      var bindTo = function bindTo(property) {
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
        var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
        var bindToAll = false;
        if (Array.isArray(property)) {
          var debinders = property.map(function (p) {
            return bindTo(p, callback, options);
          });
          return function () {
            return debinders.forEach(function (d) {
              return d();
            });
          };
        }
        if (property instanceof Function) {
          options = callback || {};
          callback = property;
          bindToAll = true;
        }
        if (options.delay >= 0) {
          callback = _this.wrapDelayCallback(callback, options.delay);
        }
        if (options.throttle >= 0) {
          callback = _this.wrapThrottleCallback(callback, options.throttle);
        }
        if (options.wait >= 0) {
          callback = _this.wrapWaitCallback(callback, options.wait);
        }
        if (options.frame) {
          callback = _this.wrapFrameCallback(callback, options.frame);
        }
        if (options.idle) {
          callback = _this.wrapIdleCallback(callback);
        }
        if (bindToAll) {
          var bindIndex = object[BindingAll].length;
          object[BindingAll].push(callback);
          if (!('now' in options) || options.now) {
            for (var i in object) {
              callback(object[i], i, object, false);
            }
          }
          return function () {
            delete object[BindingAll][bindIndex];
          };
        }
        if (!object[Binding][property]) {
          object[Binding][property] = new Set();
        }

        // let bindIndex = object[Binding][property].length;

        if (options.children) {
          var original = callback;
          callback = function callback() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            var v = args[0];
            var subDebind = object[SubBinding].get(original);
            if (subDebind) {
              object[SubBinding].delete(original);
              subDebind();
            }
            if ((0, _typeof2.default)(v) !== 'object') {
              original.apply(void 0, args);
              return;
            }
            var vv = Bindable.make(v);
            if (Bindable.isBindable(vv)) {
              object[SubBinding].set(original, vv.bindTo(function () {
                for (var _len2 = arguments.length, subArgs = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  subArgs[_key2] = arguments[_key2];
                }
                return original.apply(void 0, args.concat(subArgs));
              }, Object.assign({}, options, {
                children: false
              })));
            }
            original.apply(void 0, args);
          };
        }
        object[Binding][property].add(callback);
        if (!('now' in options) || options.now) {
          callback(object[property], property, object, false);
        }
        var debinder = function debinder() {
          var subDebind = object[SubBinding].get(callback);
          if (subDebind) {
            object[SubBinding].delete(callback);
            subDebind();
          }
          if (!object[Binding][property]) {
            return;
          }
          if (!object[Binding][property].has(callback)) {
            return;
          }
          object[Binding][property].delete(callback);
        };
        if (options.removeWith && options.removeWith instanceof View) {
          options.removeWith.onRemove(function () {
            return debinder;
          });
        }
        return debinder;
      };
      Object.defineProperty(object, 'bindTo', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: bindTo
      });
      var ___before = function ___before(callback) {
        var beforeIndex = object[Before].length;
        object[Before].push(callback);
        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }
          cleaned = true;
          delete object[Before][beforeIndex];
        };
      };
      var ___after = function ___after(callback) {
        var afterIndex = object[After].length;
        object[After].push(callback);
        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }
          cleaned = true;
          delete object[After][afterIndex];
        };
      };
      Object.defineProperty(object, BindChain, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: function value(path, callback) {
          var parts = path.split('.');
          var node = parts.shift();
          var subParts = parts.slice(0);
          var debind = [];
          debind.push(object.bindTo(node, function (v, k, t, d) {
            var rest = subParts.join('.');
            if (subParts.length === 0) {
              callback(v, k, t, d);
              return;
            }
            if (v === undefined) {
              v = t[k] = _this.make({});
            }
            debind = debind.concat(v[BindChain](rest, callback));
          }));
          return function () {
            return debind.forEach(function (x) {
              return x();
            });
          };
        }
      });
      Object.defineProperty(object, '___before', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___before
      });
      Object.defineProperty(object, '___after', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: ___after
      });
      var isBound = function isBound() {
        for (var i in object[BindingAll]) {
          if (object[BindingAll][i]) {
            return true;
          }
        }
        for (var _i in object[Binding]) {
          var _iterator = _createForOfIteratorHelper(object[Binding][_i]),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var callback = _step.value;
              if (callback) {
                return true;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
        return false;
      };
      Object.defineProperty(object, 'isBound', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: isBound
      });
      var _loop = function _loop(i) {
        if (object[i] && object[i] instanceof Object && !object[i] instanceof Promise) {
          if (!excludedClasses.filter(function (excludeClass) {
            return object[i] instanceof excludeClass;
          }).length && Object.isExtensible(object[i]) && !Object.isSealed(object[i])) {
            object[i] = Bindable.make(object[i]);
          }
        }
      };
      for (var i in object) {
        _loop(i);
      }
      var set = function set(target, key, value) {
        if (wrapped.has(key)) {
          wrapped.delete(key);
        }
        if (key === Original) {
          return true;
        }
        var onDeck = object[Deck];

        // if(onDeck[key] !== undefined && onDeck[key] === value)
        if (key in onDeck && onDeck[key] === value) {
          return true;
        }
        if (key.slice && key.slice(-3) === '___') {
          return true;
        }
        if (target[key] === value || typeof value === 'number' && isNaN(onDeck[key]) && isNaN(value)) {
          return true;
        }
        if (value && value instanceof Object && Object.isExtensible(object) && !Object.isSealed(object) && !excludedClasses.filter(function (x) {
          return object instanceof x;
        }).length) {
          value = Bindable.make(value);
        }
        onDeck[key] = value;
        for (var _i2 in object[BindingAll]) {
          if (!object[BindingAll][_i2]) {
            continue;
          }
          object[BindingAll][_i2](value, key, target, false);
        }
        var stop = false;
        if (key in object[Binding]) {
          var _iterator2 = _createForOfIteratorHelper(object[Binding][key]),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var callback = _step2.value;
              if (callback(value, key, target, false, target[key]) === false) {
                stop = true;
              }
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
        delete onDeck[key];
        if (!stop) {
          var descriptor = Object.getOwnPropertyDescriptor(target, key);
          var excluded = target instanceof File && key == 'lastModifiedDate';
          if (!excluded && (!descriptor || descriptor.writable) && target[key] === value) {
            target[key] = value;
          }
        }
        var result = Reflect.set(target, key, value);
        if (Array.isArray(target) && object[Binding]['length']) {
          for (var _i3 in object[Binding]['length']) {
            var _callback = object[Binding]['length'][_i3];
            _callback(target.length, 'length', target, false, target.length);
          }
        }
        return result;
      };
      var deleteProperty = function deleteProperty(target, key) {
        var onDeck = object[Deck];
        if (onDeck[key] !== undefined) {
          return true;
        }
        if (!(key in target)) {
          return true;
        }
        if (descriptors.has(key)) {
          var descriptor = descriptors.get(key);
          if (descriptor && !descriptor.configurable) {
            return false;
          }
          descriptors.delete(key);
        }
        onDeck[key] = null;
        if (wrapped.has(key)) {
          wrapped.delete(key);
        }
        for (var _i4 in object[BindingAll]) {
          object[BindingAll][_i4](undefined, key, target, true, target[key]);
        }
        if (key in object[Binding]) {
          var _iterator3 = _createForOfIteratorHelper(object[Binding][key]),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var binding = _step3.value;
              binding(undefined, key, target, true, target[key]);
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
        delete onDeck[key];
        delete target[key];
        return true;
      };
      var construct = function construct(target, args) {
        var key = 'constructor';
        for (var _i5 in target[Before]) {
          target[Before][_i5](target, key, object[Stack], undefined, args);
        }
        var instance = Bindable.make((0, _construct2.default)(target[Original], (0, _toConsumableArray2.default)(args)));
        for (var _i6 in target[After]) {
          target[After][_i6](target, key, object[Stack], instance, args);
        }
        return instance;
      };
      var descriptors = object[Descriptors];
      var wrapped = object[Wrapped];
      var stack = object[Stack];
      var get = function get(target, key) {
        if (wrapped.has(key)) {
          return wrapped.get(key);
        }
        if (key === Ref || key === Original || key === 'apply' || key === 'isBound' || key === 'bindTo' || key === '__proto__' || key === 'constructor') {
          return object[key];
        }
        var descriptor;
        if (descriptors.has(key)) {
          descriptor = descriptors.get(key);
        } else {
          descriptor = Object.getOwnPropertyDescriptor(object, key);
          descriptors.set(key, descriptor);
        }
        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          return object[key];
        }
        if (OnAllGet in object) {
          return object[OnAllGet](key);
        }
        if (OnGet in object && !(key in object)) {
          return object[OnGet](key);
        }
        if (descriptor && !descriptor.configurable && !descriptor.writable) {
          wrapped.set(key, object[key]);
          return object[key];
        }
        if (typeof object[key] === 'function') {
          if (Names in object[key]) {
            return object[key];
          }
          Object.defineProperty(object[Unwrapped], key, {
            configurable: false,
            enumerable: false,
            writable: true,
            value: object[key]
          });
          var prototype = Object.getPrototypeOf(object);
          var isMethod = prototype[key] === object[key];
          var objRef = typeof Promise === 'function' && object instanceof Promise || typeof Map === 'function' && object instanceof Map || typeof Set === 'function' && object instanceof Set || typeof MapIterator === 'function' && object.prototype === MapIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof WeakMap === 'function' && object instanceof WeakMap || typeof WeakSet === 'function' && object instanceof WeakSet || typeof Date === 'function' && object instanceof Date || typeof TypedArray === 'function' && object instanceof TypedArray || typeof ArrayBuffer === 'function' && object instanceof ArrayBuffer || typeof EventTarget === 'function' && object instanceof EventTarget || typeof ResizeObserver === 'function' && object instanceof ResizeObserver || typeof MutationObserver === 'function' && object instanceof MutationObserver || typeof PerformanceObserver === 'function' && object instanceof PerformanceObserver || typeof IntersectionObserver === 'function' && object instanceof IntersectionObserver || typeof object[Symbol.iterator] === 'function' && key === 'next' ? object : object[Ref];
          var wrappedMethod = function _target() {
            object[Executing] = key;
            stack.unshift(key);
            for (var _len3 = arguments.length, providedArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              providedArgs[_key3] = arguments[_key3];
            }
            var _iterator4 = _createForOfIteratorHelper(object[Before]),
              _step4;
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var beforeCallback = _step4.value;
                beforeCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
            var ret;
            if (this instanceof _target ? this.constructor : void 0) {
              ret = (0, _construct2.default)(object[Unwrapped][key], providedArgs);
            } else {
              var func = object[Unwrapped][key];
              if (isMethod) {
                ret = func.apply(objRef || object, providedArgs);
              } else {
                ret = func.apply(void 0, providedArgs);
              }
            }
            var _iterator5 = _createForOfIteratorHelper(object[After]),
              _step5;
            try {
              for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
                var afterCallback = _step5.value;
                afterCallback(object, key, stack, object, providedArgs);
              }
            } catch (err) {
              _iterator5.e(err);
            } finally {
              _iterator5.f();
            }
            object[Executing] = null;
            stack.shift();
            return ret;
          };
          wrappedMethod[Names] = wrappedMethod[Names] || new WeakMap();
          wrappedMethod[Names].set(object, key);
          wrappedMethod[OnAllGet] = function (key) {
            var selfName = wrappedMethod[Names].get(object);
            return object[selfName][key];
          };
          var result = Bindable.make(wrappedMethod);
          wrapped.set(key, result);
          return result;
        }
        return object[key];
      };
      var getPrototypeOf = function getPrototypeOf(target) {
        if (GetProto in object) {
          return object[GetProto];
        }
        return Reflect.getPrototypeOf(target);
      };
      var handler = {
        get: get,
        set: set,
        construct: construct,
        getPrototypeOf: getPrototypeOf,
        deleteProperty: deleteProperty
      };
      if (object[NoGetters]) {
        delete handler.get;
      }
      Object.defineProperty(object, Ref, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Proxy(object, handler)
      });
      return object[Ref];
    }
  }, {
    key: "clearBindings",
    value: function clearBindings(object) {
      var clearObj = function clearObj(o) {
        return Object.keys(o).map(function (k) {
          return delete o[k];
        });
      };
      var maps = function maps(func) {
        return function () {
          for (var _len4 = arguments.length, os = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            os[_key4] = arguments[_key4];
          }
          return os.map(func);
        };
      };
      var clearObjs = maps(clearObj);
      clearObjs(object[Wrapped], object[Binding], object[BindingAll], object[After], object[Before]);
    }
  }, {
    key: "resolve",
    value: function resolve(object, path) {
      var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var node;
      var pathParts = path.split('.');
      var top = pathParts[0];
      while (pathParts.length) {
        if (owner && pathParts.length === 1) {
          var obj = this.make(object);
          return [obj, pathParts.shift(), top];
        }
        node = pathParts.shift();
        if (!node in object || !object[node] || !(object[node] instanceof Object)) {
          object[node] = {};
        }
        object = this.make(object[node]);
      }
      return [this.make(object), node, top];
    }
  }, {
    key: "wrapDelayCallback",
    value: function wrapDelayCallback(callback, delay) {
      return function () {
        for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          args[_key5] = arguments[_key5];
        }
        return setTimeout(function () {
          return callback.apply(void 0, args);
        }, delay);
      };
    }
  }, {
    key: "wrapThrottleCallback",
    value: function wrapThrottleCallback(callback, throttle) {
      var _this2 = this;
      this.throttles.set(callback, false);
      return function () {
        if (_this2.throttles.get(callback, true)) {
          return;
        }
        callback.apply(void 0, arguments);
        _this2.throttles.set(callback, true);
        setTimeout(function () {
          _this2.throttles.set(callback, false);
        }, throttle);
      };
    }
  }, {
    key: "wrapWaitCallback",
    value: function wrapWaitCallback(callback, wait) {
      var _this3 = this;
      return function () {
        for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          args[_key6] = arguments[_key6];
        }
        var waiter;
        if (waiter = _this3.waiters.get(callback)) {
          _this3.waiters.delete(callback);
          clearTimeout(waiter);
        }
        waiter = setTimeout(function () {
          return callback.apply(void 0, args);
        }, wait);
        _this3.waiters.set(callback, waiter);
      };
    }
  }, {
    key: "wrapFrameCallback",
    value: function wrapFrameCallback(callback, frames) {
      return function () {
        for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          args[_key7] = arguments[_key7];
        }
        requestAnimationFrame(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }, {
    key: "wrapIdleCallback",
    value: function wrapIdleCallback(callback) {
      return function () {
        for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          args[_key8] = arguments[_key8];
        }
        // Compatibility for Safari 08/2020
        var req = window.requestIdleCallback || requestAnimationFrame;
        req(function () {
          return callback.apply(void 0, args);
        });
      };
    }
  }]);
  return Bindable;
}();
exports.Bindable = Bindable;
(0, _defineProperty2.default)(Bindable, "waiters", new WeakMap());
(0, _defineProperty2.default)(Bindable, "throttles", new WeakMap());
Object.defineProperty(Bindable, 'OnGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnGet
});
Object.defineProperty(Bindable, 'NoGetters', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NoGetters
});
Object.defineProperty(Bindable, 'GetProto', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: GetProto
});
Object.defineProperty(Bindable, 'OnAllGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnAllGet
});
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var Cache = /*#__PURE__*/function () {
  function Cache() {
    (0, _classCallCheck2.default)(this, Cache);
  }
  (0, _createClass2.default)(Cache, null, [{
    key: "store",
    value: function store(key, value, expiry) {
      var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';
      var expiration = 0;
      if (expiry) {
        expiration = expiry * 1000 + new Date().getTime();
      }
      if (!this.buckets) {
        this.buckets = new Map();
      }
      if (!this.buckets.has(bucket)) {
        this.buckets.set(bucket, new Map());
      }
      var eventEnd = new CustomEvent('cvCacheStore', {
        cancelable: true,
        detail: {
          key: key,
          value: value,
          expiry: expiry,
          bucket: bucket
        }
      });
      if (document.dispatchEvent(eventEnd)) {
        this.buckets.get(bucket).set(key, {
          value: value,
          expiration: expiration
        });
      }
    }
  }, {
    key: "load",
    value: function load(key) {
      var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';
      var eventEnd = new CustomEvent('cvCacheLoad', {
        cancelable: true,
        detail: {
          key: key,
          defaultvalue: defaultvalue,
          bucket: bucket
        }
      });
      if (!document.dispatchEvent(eventEnd)) {
        return defaultvalue;
      }
      if (this.buckets && this.buckets.has(bucket) && this.buckets.get(bucket).has(key)) {
        var entry = this.buckets.get(bucket).get(key);
        // console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
        if (entry.expiration === 0 || entry.expiration > new Date().getTime()) {
          return this.buckets.get(bucket).get(key).value;
        }
      }
      return defaultvalue;
    }
  }]);
  return Cache;
}();
exports.Cache = Cache;
});

;require.register("curvature/base/Config.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Config = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var AppConfig = {};
var _require = require;
var win = (typeof globalThis === "undefined" ? "undefined" : (0, _typeof2.default)(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : (0, _typeof2.default)(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof2.default)(self)) === 'object' ? self : void 0;
try {
  AppConfig = _require('/Config').Config;
} catch (error) {
  win.devMode === true && console.error(error);
  AppConfig = {};
}
var Config = /*#__PURE__*/function () {
  function Config() {
    (0, _classCallCheck2.default)(this, Config);
  }
  (0, _createClass2.default)(Config, null, [{
    key: "get",
    value: function get(name) {
      return this.configs[name];
    }
  }, {
    key: "set",
    value: function set(name, value) {
      this.configs[name] = value;
      return this;
    }
  }, {
    key: "dump",
    value: function dump() {
      return this.configs;
    }
  }, {
    key: "init",
    value: function init() {
      for (var _len = arguments.length, configs = new Array(_len), _key = 0; _key < _len; _key++) {
        configs[_key] = arguments[_key];
      }
      for (var i in configs) {
        var config = configs[i];
        if (typeof config === 'string') {
          config = JSON.parse(config);
        }
        for (var name in config) {
          var value = config[name];
          return this.configs[name] = value;
        }
      }
      return this;
    }
  }]);
  return Config;
}();
exports.Config = Config;
Object.defineProperty(Config, 'configs', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppConfig
});
});

require.register("curvature/base/Cookie.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cookie = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Bindable = require("./Bindable");
var Cookie = /*#__PURE__*/function () {
  function Cookie() {
    (0, _classCallCheck2.default)(this, Cookie);
  }
  (0, _createClass2.default)(Cookie, null, [{
    key: "set",
    value: function set(name, value) {
      this.jar[name] = value;
    }
  }, {
    key: "get",
    value: function get(name) {
      return this.jar[name];
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      delete this.jar[name];
    }
  }]);
  return Cookie;
}();
exports.Cookie = Cookie;
(0, _defineProperty2.default)(Cookie, "jar", _Bindable.Bindable.make({}));
if (typeof document.cookie === 'string' && window.location.href.substr(0, 4) !== 'data') {
  document.cookie.split(';').map(function (c) {
    var _c$split = c.split('='),
      _c$split2 = (0, _slicedToArray2.default)(_c$split, 2),
      key = _c$split2[0],
      value = _c$split2[1];
    try {
      value = JSON.parse(value);
    } catch (error) {
      value = value;
    }
    key = key.trim();
    Cookie.jar[decodeURIComponent(key)] = value;
  });
  Cookie.jar.bindTo(function (v, k, t, d) {
    if (d) {
      document.cookie = "".concat(encodeURIComponent(k), "=;expires=").concat(new Date(0));
    } else {
      document.cookie = "".concat(encodeURIComponent(k), "=").concat(v);
    }
  });
}
});

;require.register("curvature/base/Dom.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Dom = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var traversals = 0;
var Dom = /*#__PURE__*/function () {
  function Dom() {
    (0, _classCallCheck2.default)(this, Dom);
  }
  (0, _createClass2.default)(Dom, null, [{
    key: "mapTags",
    value: function mapTags(doc, selector, callback, startNode, endNode) {
      var result = [];
      var started = true;
      if (startNode) {
        started = false;
      }
      var ended = false;
      var treeWalker = document.createTreeWalker(doc, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
        acceptNode: function acceptNode(node, walker) {
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
      var traversal = traversals++;
      while (treeWalker.nextNode()) {
        result.push(callback(treeWalker.currentNode, treeWalker));
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
exports.Dom = Dom;
});

;require.register("curvature/base/Import.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Import = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var Import = /*#__PURE__*/function () {
  function Import(uri) {
    (0, _classCallCheck2.default)(this, Import);
    console.log(this.__proto__.constructor);
    if (this.__proto__.constructor.instances[uri]) {
      return this.__proto__.constructor.instances[uri];
    }
    this.uri = uri;
    var tag = document.createElement('script');
    tag.setAttribute('src', this.uri);
    this.ready = new Promise(function (accept, reject) {
      tag.addEventListener('load', function (event) {
        return accept(tag);
      });
      tag.addEventListener('error', function (error) {
        console.error(error);
        reject(error);
      });
    });
    this.tag = tag;
    this.attached = false;
    this.__proto__.constructor.instances[uri] = this;
  }
  (0, _createClass2.default)(Import, [{
    key: "attach",
    value: function attach() {
      var parent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      if (this.attached) {
        return;
      }
      parent = parent || document.head;
      parent.append(this.tag);
      this.attached = true;
    }
  }]);
  return Import;
}();
exports.Import = Import;
Import.instances = {};
});

require.register("curvature/base/Mixin.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mixin = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Bindable = require("./Bindable");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Constructor = Symbol('constructor');
var MixinList = Symbol('mixinList');
var Mixin = /*#__PURE__*/function () {
  function Mixin() {
    (0, _classCallCheck2.default)(this, Mixin);
  }
  (0, _createClass2.default)(Mixin, null, [{
    key: "from",
    value: function from(baseClass) {
      for (var _len = arguments.length, mixins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        mixins[_key - 1] = arguments[_key];
      }
      var newClass = /*#__PURE__*/function (_baseClass) {
        (0, _inherits2.default)(newClass, _baseClass);
        var _super = _createSuper(newClass);
        function newClass() {
          var _this;
          (0, _classCallCheck2.default)(this, newClass);
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
          var instance = baseClass.constructor ? _this = _super.call.apply(_super, [this].concat(args)) : null;
          var _iterator = _createForOfIteratorHelper(mixins),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var mixin = _step.value;
              if (mixin[Mixin.Constructor]) {
                mixin[Mixin.Constructor].apply((0, _assertThisInitialized2.default)(_this));
              }
              switch ((0, _typeof2.default)(mixin)) {
                case 'function':
                  Mixin.mixClass(mixin, newClass);
                  break;
                case 'object':
                  Mixin.mixObject(mixin, (0, _assertThisInitialized2.default)(_this));
                  break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return (0, _possibleConstructorReturn2.default)(_this, instance);
        }
        return (0, _createClass2.default)(newClass);
      }(baseClass);
      return newClass;
    }
  }, {
    key: "make",
    value: function make() {
      for (var _len3 = arguments.length, classes = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        classes[_key3] = arguments[_key3];
      }
      var base = classes.pop();
      return Mixin.to.apply(Mixin, [base].concat(classes));
    }
  }, {
    key: "to",
    value: function to(base) {
      var descriptors = {};
      for (var _len4 = arguments.length, mixins = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        mixins[_key4 - 1] = arguments[_key4];
      }
      mixins.map(function (mixin) {
        switch ((0, _typeof2.default)(mixin)) {
          case 'object':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin));
            break;
          case 'function':
            Object.assign(descriptors, Object.getOwnPropertyDescriptors(mixin.prototype));
            break;
        }
        delete descriptors.constructor;
        Object.defineProperties(base.prototype, descriptors);
      });
    }
  }, {
    key: "with",
    value: function _with() {
      for (var _len5 = arguments.length, mixins = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        mixins[_key5] = arguments[_key5];
      }
      return this.from.apply(this, [/*#__PURE__*/function () {
        function _class() {
          (0, _classCallCheck2.default)(this, _class);
        }
        return (0, _createClass2.default)(_class);
      }()].concat(mixins));
    }
  }, {
    key: "mixObject",
    value: function mixObject(mixin, instance) {
      var _iterator2 = _createForOfIteratorHelper(Object.getOwnPropertyNames(mixin)),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var func = _step2.value;
          if (typeof mixin[func] === 'function') {
            instance[func] = mixin[func].bind(instance);
            continue;
          }
          instance[func] = mixin[func];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      var _iterator3 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(mixin)),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _func = _step3.value;
          if (typeof mixin[_func] === 'function') {
            instance[_func] = mixin[_func].bind(instance);
            continue;
          }
          instance[_func] = mixin[_func];
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "mixClass",
    value: function mixClass(cls, newClass) {
      var _iterator4 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls.prototype)),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var func = _step4.value;
          if (['name', 'prototype', 'length'].includes(func)) {
            continue;
          }
          var descriptor = Object.getOwnPropertyDescriptor(newClass, func);
          if (descriptor && !descriptor.writable) {
            continue;
          }
          if (typeof cls[func] !== 'function') {
            newClass.prototype[func] = cls.prototype[func];
            continue;
          }
          newClass.prototype[func] = cls.prototype[func].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
      var _iterator5 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls.prototype)),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _func2 = _step5.value;
          if (typeof cls[_func2] !== 'function') {
            newClass.prototype[_func2] = cls.prototype[_func2];
            continue;
          }
          newClass.prototype[_func2] = cls.prototype[_func2].bind(newClass.prototype);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      var _iterator6 = _createForOfIteratorHelper(Object.getOwnPropertyNames(cls)),
        _step6;
      try {
        var _loop = function _loop() {
          var func = _step6.value;
          if (['name', 'prototype', 'length'].includes(func)) {
            return "continue";
          }
          var descriptor = Object.getOwnPropertyDescriptor(newClass, func);
          if (descriptor && !descriptor.writable) {
            return "continue";
          }
          if (typeof cls[func] !== 'function') {
            newClass[func] = cls[func];
            return "continue";
          }
          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);
          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var _ret = _loop();
          if (_ret === "continue") continue;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      var _iterator7 = _createForOfIteratorHelper(Object.getOwnPropertySymbols(cls)),
        _step7;
      try {
        var _loop2 = function _loop2() {
          var func = _step7.value;
          if (typeof cls[func] !== 'function') {
            newClass.prototype[func] = cls[func];
            return "continue";
          }
          var prev = newClass[func] || false;
          var meth = cls[func].bind(newClass);
          newClass[func] = function () {
            prev && prev.apply(void 0, arguments);
            return meth.apply(void 0, arguments);
          };
        };
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var _ret2 = _loop2();
          if (_ret2 === "continue") continue;
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "mix",
    value: function mix(mixinTo) {
      var constructors = [];
      var allStatic = {};
      var allInstance = {};
      var mixable = _Bindable.Bindable.makeBindable(mixinTo);
      var _loop3 = function _loop3(base) {
        var instanceNames = Object.getOwnPropertyNames(base.prototype);
        var staticNames = Object.getOwnPropertyNames(base);
        var prefix = /^(before|after)__(.+)/;
        var _iterator8 = _createForOfIteratorHelper(staticNames),
          _step8;
        try {
          var _loop5 = function _loop5() {
            var methodName = _step8.value;
            var match = methodName.match(prefix);
            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }
                    var method = base[methodName].bind(o);
                    return method.apply(void 0, (0, _toConsumableArray2.default)(a));
                  });
                  break;
                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }
                    var method = base[methodName].bind(o);
                    return method.apply(void 0, (0, _toConsumableArray2.default)(a));
                  });
                  break;
              }
              return "continue";
            }
            if (allStatic[methodName]) {
              return "continue";
            }
            if (typeof base[methodName] !== 'function') {
              return "continue";
            }
            allStatic[methodName] = base[methodName];
          };
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _ret3 = _loop5();
            if (_ret3 === "continue") continue;
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
        var _iterator9 = _createForOfIteratorHelper(instanceNames),
          _step9;
        try {
          var _loop6 = function _loop6() {
            var methodName = _step9.value;
            var match = methodName.match(prefix);
            if (match) {
              switch (match[1]) {
                case 'before':
                  mixable.___before(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }
                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, (0, _toConsumableArray2.default)(a));
                  });
                  break;
                case 'after':
                  mixable.___after(function (t, e, s, o, a) {
                    if (e !== match[2]) {
                      return;
                    }
                    var method = base.prototype[methodName].bind(o);
                    return method.apply(void 0, (0, _toConsumableArray2.default)(a));
                  });
                  break;
              }
              return "continue";
            }
            if (allInstance[methodName]) {
              return "continue";
            }
            if (typeof base.prototype[methodName] !== 'function') {
              return "continue";
            }
            allInstance[methodName] = base.prototype[methodName];
          };
          for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
            var _ret4 = _loop6();
            if (_ret4 === "continue") continue;
          }
        } catch (err) {
          _iterator9.e(err);
        } finally {
          _iterator9.f();
        }
      };
      for (var base = this; base && base.prototype; base = Object.getPrototypeOf(base)) {
        _loop3(base);
      }
      for (var methodName in allStatic) {
        mixinTo[methodName] = allStatic[methodName].bind(mixinTo);
      }
      var _loop4 = function _loop4(_methodName) {
        mixinTo.prototype[_methodName] = function () {
          for (var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }
          return allInstance[_methodName].apply(this, args);
        };
      };
      for (var _methodName in allInstance) {
        _loop4(_methodName);
      }
      return mixable;
    }
  }]);
  return Mixin;
}();
exports.Mixin = Mixin;
Mixin.Constructor = Constructor;
});

require.register("curvature/base/Model.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Cache = require("./Cache");
var _Bindable = require("./Bindable");
var _Repository = require("./Repository");
var Model = /*#__PURE__*/function () {
  function Model(repository) {
    (0, _classCallCheck2.default)(this, Model);
    this.repository = repository;
  }
  (0, _createClass2.default)(Model, [{
    key: "consume",
    value: function consume(values) {
      for (var property in values) {
        var value = values[property];
        if (values[property] instanceof Object && values[property].class && values[property].publicId) {
          var cacheKey = "".concat(values[property].class, "::").concat(values[property].publidId);
          var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');
          value = _Bindable.Bindable.makeBindable(new Model(this.repository));
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
exports.Model = Model;
});

;require.register("curvature/base/Repository.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Repository = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Bindable = require("./Bindable");
var _Router = require("./Router");
var _Cache = require("./Cache");
var _Model = require("./Model");
var _Bag = require("./Bag");
var _Form = require("../form/Form");
var _FormWrapper = require("../form/multiField/FormWrapper");
var objects = {};
var Repository = /*#__PURE__*/function () {
  function Repository(uri) {
    (0, _classCallCheck2.default)(this, Repository);
    this.uri = uri;
  }
  (0, _createClass2.default)(Repository, [{
    key: "get",
    value: function get(id) {
      var _this = this;
      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var resourceUri = this.uri + '/' + id;
      var cached = _Cache.Cache.load(resourceUri + _Router.Router.queryToString(_Router.Router.queryOver(args), true), false, 'model-uri-repo');
      if (!refresh && cached) {
        return Promise.resolve(cached);
      }
      return Repository.request(resourceUri, args).then(function (response) {
        return _this.extractModel(response.body);
      });
    }
  }, {
    key: "page",
    value: function page() {
      var _this2 = this;
      var _page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var args = arguments.length > 1 ? arguments[1] : undefined;
      return Repository.request(this.uri, args).then(function (response) {
        var records = [];
        for (var i in response.body) {
          var record = response.body[i];
          records.push(_this2.extractModel(record));
        }
        response.body = records;
        return response;
      });
    }
  }, {
    key: "edit",
    value: function edit() {
      var publicId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var resourceUri = this.uri + '/create';
      if (publicId) {
        resourceUri = this.uri + '/' + publicId + '/edit';
      }

      // console.log(resourceUri);

      if (!data) {
        return Repository.request(resourceUri).then(function (response) {
          var form = new _Form.Form(response.meta.form, customFields);
          // let model = this.extractModel(response.body);

          return new _FormWrapper.FormWrapper(form, resourceUri, 'POST', customFields);
        });
      } else {
        return Repository.request(resourceUri, {
          api: 'json'
        }, data).then(function (response) {
          return response.body;
        });
      }
    }
  }, {
    key: "extractModel",
    value: function extractModel(rawData) {
      var model = _Bindable.Bindable.makeBindable(new _Model.Model(this));
      model.consume(rawData);
      var resourceUri = this.uri + '/' + model.publicId;

      // Cache.store(
      // 	resourceUri
      // 	, model
      // 	, 10
      // 	, 'model-uri-repo'
      // );

      if (model.class) {
        var cacheKey = "".concat(model.class, "::").concat(model.publidId);
        var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

        // if(cached)
        // {
        // 	cached.consume(rawData);
        // 	return cached;
        // }

        // Cache.store(
        // 	cacheKey
        // 	, model
        // 	, 10
        // 	, 'model-type-repo'
        // );
      }

      return model;
    }

    // static get xhrs(){
    // 	return this.xhrs = this.xhrs || [];
    // }
  }], [{
    key: "loadPage",
    value: function loadPage() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      return this.request(this.uri, args).then(function (response) {
        return response;
        // return response.map((skeleton) => new Model(skeleton));
      });
    }
  }, {
    key: "domCache",
    value: function domCache(uri, content) {
      // console.log(uri, content);
    }
  }, {
    key: "load",
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
    key: "form",
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
    key: "clearCache",
    value: function clearCache() {
      if (this.objects && this.objects[this.uri]) {
        this.objects[this.uri] = {};
      }
    }
  }, {
    key: "encode",
    value: function encode(obj) {
      var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      if (!formData) {
        formData = new FormData();
      }
      for (var i in obj) {
        var ns = i;
        if (namespace) {
          ns = "".concat(namespace, "[").concat(ns, "]");
        }
        if (obj[i] && (0, _typeof2.default)(obj[i]) !== 'object') {
          formData.append(ns, obj[i]);
        } else {
          this.encode(obj[i], ns, formData);
        }
      }
      return formData;
    }
  }, {
    key: "onResponse",
    value: function onResponse(callback) {
      if (!this._onResponse) {
        this._onResponse = new _Bag.Bag();
      }
      return this._onResponse.add(callback);
    }
  }, {
    key: "request",
    value: function request(uri) {
      var _this3 = this;
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
      var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
      var type = 'GET';
      var queryString = '';
      var formData = null;
      var queryArgs = {};
      if (args) {
        queryArgs = args;
      }
      if (!this._onResponse) {
        this._onResponse = new _Bag.Bag();
      }
      if (!this.runningRequests) {
        this.runningRequests = {};
      }
      queryArgs.api = queryArgs.api || 'json';
      queryString = Object.keys(queryArgs).map(function (arg) {
        return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
      }).join('&');
      var fullUri = uri;
      // let postString = '';
      fullUri = uri + '?' + queryString;
      if (!post && this.runningRequests[fullUri]) {
        return this.runningRequests[fullUri];
      }
      if (post) {
        cache = false;
        type = 'POST';
        if (post instanceof FormData) {
          formData = post;
        } else {
          formData = this.encode(post);
        }
        // postString = Object.keys(post).map((arg) => {
        // 	return encodeURIComponent(arg)
        // 	+ '='
        // 	+ encodeURIComponent(post[arg])
        // }).join('&');
      }

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
      xhr.withCredentials = 'withCredentials' in options ? options.withCredentials : true;
      var link = document.createElement("a");
      link.href = fullUri;
      if (!post) {
        xhr.timeout = options.timeout || 15000;
        this.xhrs[fullUri] = xhr;
      }
      var reqPromise = new Promise(function (resolve, reject) {
        if (post) {
          if ('progressUp' in options) {
            xhr.upload.onprogress = options.progressUp;
          }
        }
        if ('progressDown' in options) {
          xhr.onprogress = options.progressDown;
        }
        xhr.onreadystatechange = function () {
          var DONE = 4;
          var OK = 200;
          var response;
          if (xhr.readyState === DONE) {
            delete _this3.xhrs[fullUri];
            delete _this3.runningRequests[fullUri];
            if (!_this3.cache) {
              _this3.cache = {};
            }
            if (xhr.getResponseHeader("Content-Type") == 'application/json' || xhr.getResponseHeader("Content-Type") == 'application/json; charset=utf-8' || xhr.getResponseHeader("Content-Type") == 'text/json' || xhr.getResponseHeader("Content-Type") == 'text/json; charset=utf-8') {
              response = JSON.parse(xhr.responseText);
              if (response && response.code == 0) {
                // Repository.lastResponse = response;

                if (!post && cache) {
                  // this.cache[fullUri] = response;
                }
                var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');
                var prerendering = window.prerenderer || navigator.userAgent.match(/prerender/i);
                if (prerendering) {
                  window.prerenderer = window.prerenderer || true;
                  if (!_tagCache) {
                    _tagCache = document.createElement('script');
                    _tagCache.type = 'text/json';
                    _tagCache.setAttribute('data-hack', 'application/ld+json-NOT!');
                    _tagCache.setAttribute('data-uri', fullUri);
                    document.head.appendChild(_tagCache);
                  }

                  // console.log(JSON.stringify(response));

                  _tagCache.innerText = JSON.stringify(response);
                }
                var onResponse = _this3._onResponse.items();
                for (var i in onResponse) {
                  onResponse[i](response, true);
                }
                response._http = xhr.status;
                if (xhr.status === OK) {
                  resolve(response);
                } else {
                  reject(response);
                }
              } else {
                if (!post && cache) {
                  // this.cache[fullUri] = response;
                }
                var _onResponse = _this3._onResponse.items();
                for (var _i in _onResponse) {
                  _onResponse[_i](response, true);
                }
                reject(response);
              }
            } else {
              // Repository.lastResponse = xhr.responseText;

              if (!post && cache) {
                // this.cache[fullUri] = xhr.responseText;
              }
              var _onResponse2 = _this3._onResponse.items();
              for (var _i2 in _onResponse2) {
                _onResponse2[_i2](xhr, true);
              }
              if (xhr.status === OK) {
                resolve(xhr);
              } else {
                reject(xhr);
              }
            }
          }
        };
        xhr.open(type, fullUri, true);
        if (options.headers) {
          for (var header in options.headers) {
            xhr.setRequestHeader(header, options.headers[header]);
          }
        }
        xhr.send(formData);
      });
      if (!post) {
        this.runningRequests[fullUri] = reqPromise;
      }
      return reqPromise;
    }
  }, {
    key: "cancel",
    value: function cancel() {
      var regex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^.$/;
      for (var i in this.xhrs) {
        if (!this.xhrs[i]) {
          continue;
        }
        if (i.match(regex)) {
          this.xhrs[i].abort();
          delete this.xhrs[i];
        }
      }
      // this.xhrs = [];
    }
  }]);
  return Repository;
}();
exports.Repository = Repository;
Repository.xhrs = [];

// Repository.lastResponse = null;
});

require.register("curvature/base/Router.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _View = require("./View");
var _Cache = require("./Cache");
var _Config = require("./Config");
var _Routes = require("./Routes");
var _win$CustomEvent;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var NotFoundError = Symbol('NotFound');
var InternalError = Symbol('Internal');
var win = (typeof globalThis === "undefined" ? "undefined" : (0, _typeof2.default)(globalThis)) === 'object' ? globalThis : (typeof window === "undefined" ? "undefined" : (0, _typeof2.default)(window)) === 'object' ? window : (typeof self === "undefined" ? "undefined" : (0, _typeof2.default)(self)) === 'object' ? self : void 0;
win.CustomEvent = (_win$CustomEvent = win.CustomEvent) !== null && _win$CustomEvent !== void 0 ? _win$CustomEvent : win.Event;
var Router = /*#__PURE__*/function () {
  function Router() {
    (0, _classCallCheck2.default)(this, Router);
  }
  (0, _createClass2.default)(Router, null, [{
    key: "wait",
    value: function wait(view) {
      var _this = this;
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DOMContentLoaded';
      var node = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;
      node.addEventListener(event, function () {
        _this.listen(view);
      });
    }
  }, {
    key: "listen",
    value: function listen(listener) {
      var _this2 = this;
      var routes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      this.listener = listener || this.listener;
      this.routes = routes || listener.routes;
      Object.assign(this.query, this.queryOver({}));
      var listen = function listen(event) {
        event.preventDefault();
        if (event.state && 'routedId' in event.state) {
          if (event.state.routedId <= _this2.routeCount) {
            _this2.history.splice(event.state.routedId);
            _this2.routeCount = event.state.routedId;
          } else if (event.state.routedId > _this2.routeCount) {
            _this2.history.push(event.state.prev);
            _this2.routeCount = event.state.routedId;
          }
          _this2.state = event.state;
        } else {
          if (_this2.prevPath !== null && _this2.prevPath !== location.pathname) {
            _this2.history.push(_this2.prevPath);
          }
        }
        if (!_this2.isOriginLimited(location)) {
          _this2.match(location.pathname, listener);
        } else {
          _this2.match(_this2.nextPath, listener);
        }
      };
      window.addEventListener('cvUrlChanged', listen);
      window.addEventListener('popstate', listen);
      var route = !this.isOriginLimited(location) ? location.pathname + location.search : false;
      if (!this.isOriginLimited(location) && location.hash) {
        route += location.hash;
      }
      var state = {
        routedId: this.routeCount,
        url: location.pathname,
        prev: this.prevPath
      };
      if (!this.isOriginLimited(location)) {
        history.replaceState(state, null, location.pathname);
      }
      this.go(route !== false ? route : '/');
    }
  }, {
    key: "go",
    value: function go(path) {
      var silent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var configTitle = _Config.Config.get('title');
      if (configTitle) {
        document.title = configTitle;
      }
      var state = {
        routedId: this.routeCount,
        prev: this.prevPath,
        url: location.pathname
      };
      if (silent === -1) {
        this.match(path, this.listener, true);
      } else if (this.isOriginLimited(location)) {
        this.nextPath = path;
      } else if (silent === 2 && location.pathname !== path) {
        history.replaceState(state, null, path);
      } else if (location.pathname !== path) {
        history.pushState(state, null, path);
      }
      if (!silent || silent < 0) {
        if (silent === false) {
          this.path = null;
        }
        if (!silent) {
          if (path.substring(0, 1) === '#') {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else {
            window.dispatchEvent(new CustomEvent('cvUrlChanged'));
          }
        }
      }
      this.prevPath = path;
    }
  }, {
    key: "processRoute",
    value: function processRoute(routes, selected, args) {
      var result = false;
      if (typeof routes[selected] === 'function') {
        if (routes[selected].prototype instanceof _View.View) {
          result = new routes[selected](args);
        } else {
          result = routes[selected](args);
        }
      } else {
        result = routes[selected];
      }
      return result;
    }
  }, {
    key: "handleError",
    value: function handleError(error, routes, selected, args, listener, path, prev, forceRefresh) {
      if (typeof document !== 'undefined') {
        document.dispatchEvent(new CustomEvent('cvRouteError', {
          detail: {
            error: error,
            path: path,
            prev: prev,
            view: listener,
            routes: routes,
            selected: selected
          }
        }));
      }
      var result = win['devMode'] ? 'Unexpected error: ' + String(error) : 'Unexpected error.';
      if (routes[InternalError]) {
        args[InternalError] = error;
        result = this.processRoute(routes, InternalError, args);
      }
      this.update(listener, path, result, routes, selected, args, forceRefresh);
    }
  }, {
    key: "match",
    value: function match(path, listener) {
      var _this3 = this;
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var event = null,
        request = null,
        forceRefresh = false;
      if (options === true) {
        forceRefresh = options;
      }
      if (options && (0, _typeof2.default)(options) === 'object') {
        forceRefresh = options.forceRefresh;
        event = options.event;
      }
      if (typeof document !== 'undefined' && this.path === path && !forceRefresh) {
        return;
      }
      var origin = 'http://example.com';
      if (typeof document !== 'undefined') {
        origin = this.isOriginLimited(location) ? origin : location.origin;
        this.queryString = location.search;
      }
      var url = new URL(path, origin);
      path = this.path = url.pathname;
      if (typeof document === 'undefined') {
        this.queryString = url.search;
      }
      var prev = this.prevPath;
      var current = listener && listener.args ? listener.args.content : null;
      var routes = this.routes || listener && listener.routes || _Routes.Routes.dump();
      var query = new URLSearchParams(this.queryString);
      if (event && event.request) {
        this.request = event.request;
      }
      for (var key in Object.keys(this.query)) {
        delete this.query[key];
      }
      var _iterator = _createForOfIteratorHelper(query),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            _key = _step$value[0],
            value = _step$value[1];
          this.query[_key] = value;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var args = {},
        selected = false,
        result = '';
      if (path.substring(0, 1) === '/') {
        path = path.substring(1);
      }
      path = path.split('/');
      for (var i in this.query) {
        args[i] = this.query[i];
      }
      L1: for (var _i in routes) {
        var route = _i.split('/');
        if (route.length < path.length && route[route.length - 1] !== '*') {
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
              throw new Error("".concat(route[j], " is not a valid argument segment in route \"").concat(_i, "\""));
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
          } else if (route[j] !== '*' && path[j] !== route[j]) {
            continue L1;
          }
        }
        selected = _i;
        result = routes[_i];
        if (route[route.length - 1] === '*') {
          args.pathparts = path.slice(route.length - 1);
        }
        break;
      }
      var eventStart = new CustomEvent('cvRouteStart', {
        cancelable: true,
        detail: {
          path: path,
          prev: prev,
          root: listener,
          selected: selected,
          routes: routes
        }
      });
      if (typeof document !== 'undefined') {
        if (!document.dispatchEvent(eventStart)) {
          return;
        }
      }
      if (!forceRefresh && listener && current && result instanceof Object && current instanceof result && !(result instanceof Promise) && current.update(args)) {
        listener.args.content = current;
        return true;
      }
      if (!(selected in routes)) {
        routes[selected] = routes[NotFoundError];
      }
      try {
        result = this.processRoute(routes, selected, args);
        if (result === false) {
          result = this.processRoute(routes, NotFoundError, args);
        }
        if (!(result instanceof Promise)) {
          return this.update(listener, path, result, routes, selected, args, forceRefresh);
        }
        if (typeof document === 'undefined') {
          return result;
        }
        return result.then(function (realResult) {
          return _this3.update(listener, path, realResult, routes, selected, args, forceRefresh);
        }).catch(function (error) {
          _this3.handleError(error, routes, selected, args, listener, path, prev, forceRefresh);
        });
      } catch (error) {
        this.handleError(error, routes, selected, args, listener, path, prev, forceRefresh);
      }
    }
  }, {
    key: "update",
    value: function update(listener, path, result, routes, selected, args, forceRefresh) {
      if (!listener) {
        return;
      }
      var prev = this.prevPath;
      var event = new CustomEvent('cvRoute', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });
      if (result !== false) {
        if (listener.args.content instanceof _View.View) {
          listener.args.content.pause(true);
          listener.args.content.remove();
        }
        if (document.dispatchEvent(event)) {
          listener.args.content = result;
        }
        if (result instanceof _View.View) {
          result.pause(false);
          result.update(args, forceRefresh);
        }
      }
      var eventEnd = new CustomEvent('cvRouteEnd', {
        cancelable: true,
        detail: {
          result: result,
          path: path,
          prev: prev,
          view: listener,
          routes: routes,
          selected: selected
        }
      });
      document.dispatchEvent(eventEnd);
    }
  }, {
    key: "isOriginLimited",
    value: function isOriginLimited(_ref) {
      var origin = _ref.origin;
      return origin === 'null' || origin === 'file://';
    }
  }, {
    key: "queryOver",
    value: function queryOver() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var params = new URLSearchParams(location.search);
      var finalArgs = {};
      var query = {};
      var _iterator2 = _createForOfIteratorHelper(params),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var pair = _step2.value;
          query[pair[0]] = pair[1];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
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
  }, {
    key: "queryToString",
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
    key: "setQuery",
    value: function setQuery(name, value, silent) {
      var args = this.queryOver();
      args[name] = value;
      if (value === undefined) {
        delete args[name];
      }
      var queryString = this.queryToString(args, true);
      this.go(location.pathname + (queryString ? '?' + queryString : '?'), silent);
    }
  }]);
  return Router;
}();
exports.Router = Router;
Object.defineProperty(Router, 'query', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: {}
});
Object.defineProperty(Router, 'history', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: []
});
Object.defineProperty(Router, 'routeCount', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: 0
});
Object.defineProperty(Router, 'prevPath', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'queryString', {
  configurable: false,
  enumerable: false,
  writable: true,
  value: null
});
Object.defineProperty(Router, 'InternalError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: InternalError
});
Object.defineProperty(Router, 'NotFoundError', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: NotFoundError
});
});

require.register("curvature/base/Routes.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Routes = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var AppRoutes = {};
var _require = require;
var imported = false;
var runImport = function runImport() {
  if (imported) {
    return;
  }
  ;
  try {
    Object.assign(AppRoutes, _require('Routes').Routes || {});
  } catch (error) {
    globalThis.devMode === true && console.warn(error);
  }
  imported = true;
};
var Routes = /*#__PURE__*/function () {
  function Routes() {
    (0, _classCallCheck2.default)(this, Routes);
  }
  (0, _createClass2.default)(Routes, null, [{
    key: "get",
    value: function get(name) {
      runImport();
      return this.routes[name];
    }
  }, {
    key: "dump",
    value: function dump() {
      runImport();
      return this.routes;
    }
  }]);
  return Routes;
}();
exports.Routes = Routes;
Object.defineProperty(Routes, 'routes', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: AppRoutes
});
});

require.register("curvature/base/RuleSet.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RuleSet = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Dom = require("./Dom");
var _Tag = require("./Tag");
var _View = require("./View");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var RuleSet = /*#__PURE__*/function () {
  function RuleSet() {
    (0, _classCallCheck2.default)(this, RuleSet);
  }
  (0, _createClass2.default)(RuleSet, [{
    key: "add",
    value: function add(selector, callback) {
      this.rules = this.rules || {};
      this.rules[selector] = this.rules[selector] || [];
      this.rules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      RuleSet.apply(doc, view);
      for (var selector in this.rules) {
        for (var i in this.rules[selector]) {
          var callback = this.rules[selector][i];
          var wrapped = RuleSet.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          var _iterator = _createForOfIteratorHelper(nodes),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var node = _step.value;
              wrapped(node);
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
        }
      }
    }
  }, {
    key: "purge",
    value: function purge() {
      if (!this.rules) {
        return;
      }
      for (var _i = 0, _Object$entries = Object.entries(this.rules); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = (0, _slicedToArray2.default)(_Object$entries[_i], 2),
          k = _Object$entries$_i[0],
          v = _Object$entries$_i[1];
        if (!this.rules[k]) {
          continue;
        }
        for (var kk in this.rules[k]) {
          delete this.rules[k][kk];
        }
      }
    }
  }], [{
    key: "add",
    value: function add(selector, callback) {
      this.globalRules = this.globalRules || {};
      this.globalRules[selector] = this.globalRules[selector] || [];
      this.globalRules[selector].push(callback);
      return this;
    }
  }, {
    key: "apply",
    value: function apply() {
      var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      for (var selector in this.globalRules) {
        for (var i in this.globalRules[selector]) {
          var callback = this.globalRules[selector][i];
          var wrapped = this.wrap(doc, callback, view);
          var nodes = doc.querySelectorAll(selector);
          var _iterator2 = _createForOfIteratorHelper(nodes),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var node = _step2.value;
              wrapped(node);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      }
    }
  }, {
    key: "wait",
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
    key: "wrap",
    value: function wrap(doc, originalCallback) {
      var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var callback = originalCallback;
      if (originalCallback instanceof _View.View || originalCallback && originalCallback.prototype && originalCallback.prototype instanceof _View.View) {
        callback = function callback() {
          return originalCallback;
        };
      }
      return function (element) {
        if (typeof element.___cvApplied___ === 'undefined') {
          Object.defineProperty(element, '___cvApplied___', {
            enumerable: false,
            writable: false,
            value: new WeakSet()
          });
        }
        if (element.___cvApplied___.has(originalCallback)) {
          return;
        }
        var direct, parentView;
        if (view) {
          direct = parentView = view;
          if (view.viewList) {
            parentView = view.viewList.parent;
          }
        }
        var tag = new _Tag.Tag(element, parentView, null, undefined, direct);
        var parent = tag.element.parentNode;
        var sibling = tag.element.nextSibling;
        var result = callback(tag);
        if (result !== false) {
          element.___cvApplied___.add(originalCallback);
        }
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
          result = new result({}, view);
        }
        if (result instanceof _View.View) {
          if (view) {
            view.cleanup.push(function (r) {
              return function () {
                r.remove();
              };
            }(result));
            view.cleanup.push(view.args.bindTo(function (v, k, t) {
              t[k] = v;
              result.args[k] = v;
            }));
            view.cleanup.push(result.args.bindTo(function (v, k, t, d) {
              t[k] = v;
              view.args[k] = v;
            }));
          }
          tag.clear();
          result.render(tag.element);
        }
      };
    }
  }]);
  return RuleSet;
}();
exports.RuleSet = RuleSet;
});

;require.register("curvature/base/SetMap.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SetMap = void 0;
var _construct2 = _interopRequireDefault(require("@babel/runtime/helpers/construct"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var SetMap = /*#__PURE__*/function () {
  function SetMap() {
    (0, _classCallCheck2.default)(this, SetMap);
    (0, _defineProperty2.default)(this, "_map", new Map());
  }
  (0, _createClass2.default)(SetMap, [{
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "getOne",
    value: function getOne(key) {
      var set = this.get(key);
      var _iterator = _createForOfIteratorHelper(set),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          return entry;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "add",
    value: function add(key, value) {
      var set = this._map.get(key);
      if (!set) {
        this._map.set(key, set = new Set());
      }
      return set.add(value);
    }
  }, {
    key: "remove",
    value: function remove(key, value) {
      var set = this._map.get(key);
      if (!set) {
        return;
      }
      var res = set.delete(value);
      if (!set.size) {
        this._map.delete(key);
      }
      return res;
    }
  }, {
    key: "values",
    value: function values() {
      return (0, _construct2.default)(Set, (0, _toConsumableArray2.default)((0, _toConsumableArray2.default)(this._map.values()).map(function (set) {
        return (0, _toConsumableArray2.default)(set.values());
      })));
    }
  }]);
  return SetMap;
}();
exports.SetMap = SetMap;
});

;require.register("curvature/base/Tag.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Tag = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Bindable = require("./Bindable");
var CurrentStyle = Symbol('CurrentStyle');
var styler = function styler(styles) {
  if (!this.node) {
    return;
  }
  for (var property in styles) {
    var stringedProperty = String(styles[property]);
    if (this[CurrentStyle].has(property) && this[CurrentStyle].get(property) === styles[property]) {
      continue;
    }
    if (property[0] === '-') {
      this.node.style.setProperty(property, stringedProperty);
    } else {
      this.node.style[property] = stringedProperty;
    }
    if (styles[property] !== undefined) {
      this[CurrentStyle].set(property, styles[property]);
    } else {
      this[CurrentStyle].delete(property);
    }
  }
};
var getter = function getter(name) {
  var _this = this;
  if (typeof this[name] === 'function') {
    return this[name];
  }
  if (this.node && typeof this.node[name] === 'function') {
    return function () {
      var _this$node;
      return (_this$node = _this.node)[name].apply(_this$node, arguments);
    };
  }
  if (name === 'style') {
    return this.proxy.style;
  }
  if (this.node && name in this.node) {
    return this.node[name];
  }
  return this[name];
};
var Tag = /*#__PURE__*/function () {
  function Tag(element, parent, ref, index, direct) {
    var _this2 = this;
    (0, _classCallCheck2.default)(this, Tag);
    if (typeof element === 'string') {
      var subdoc = document.createRange().createContextualFragment(element);
      element = subdoc.firstChild;
    }
    this.element = _Bindable.Bindable.makeBindable(element);
    this.node = this.element;
    this.parent = parent;
    this.direct = direct;
    this.ref = ref;
    this.index = index;
    this.cleanup = [];
    this[_Bindable.Bindable.OnAllGet] = getter.bind(this);
    this[CurrentStyle] = new Map();
    var boundStyler = _Bindable.Bindable.make(styler.bind(this));
    Object.defineProperty(this, 'style', {
      value: boundStyler
    });
    this.proxy = _Bindable.Bindable.make(this);
    this.proxy.style.bindTo(function (v, k, t, d) {
      if (_this2[CurrentStyle].has(k) && _this2[CurrentStyle].get(k) === v) {
        return;
      }
      _this2.node.style[k] = v;
      if (!d && v !== undefined) {
        _this2[CurrentStyle].set(k, v);
      } else {
        _this2[CurrentStyle].delete(k);
      }
    });
    this.proxy.bindTo(function (v, k) {
      if (k === 'index') {
        return;
      }
      if (k in element && element[k] !== v) {
        element[k] = v;
      }
      return false;
    });
    return this.proxy;
  }
  (0, _createClass2.default)(Tag, [{
    key: "attr",
    value: function attr(attributes) {
      for (var attribute in attributes) {
        if (attributes[attribute] === undefined) {
          this.node.removeAttribute(attribute);
        } else if (attributes[attribute] === null) {
          this.node.setAttribute(attribute, '');
        } else {
          this.node.setAttribute(attribute, attributes[attribute]);
        }
      }
      return this;
    }
  }, {
    key: "remove",
    value: function remove() {
      if (this.node) {
        this.node.remove();
      }
      _Bindable.Bindable.clearBindings(this);
      var cleanup;
      while (cleanup = this.cleanup.shift()) {
        cleanup();
      }
      this.clear();
      if (!this.node) {
        return;
      }
      var detachEvent = new Event('cvDomDetached');
      this.node.dispatchEvent(detachEvent);
      this.node = this.element = this.ref = this.parent = undefined;
    }
  }, {
    key: "clear",
    value: function clear() {
      if (!this.node) {
        return;
      }
      var detachEvent = new Event('cvDomDetached');
      while (this.node.firstChild) {
        this.node.firstChild.dispatchEvent(detachEvent);
        this.node.removeChild(this.node.firstChild);
      }
    }
  }, {
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
    }
  }, {
    key: "listen",
    value: function listen(eventName, callback, options) {
      var node = this.node;
      node.addEventListener(eventName, callback, options);
      var remove = function remove() {
        node.removeEventListener(eventName, callback, options);
      };
      var remover = function remover() {
        remove();
        remove = function remove() {
          return console.warn('Already removed!');
        };
      };
      this.parent.onRemove(function () {
        return remover();
      });
      return remover;
    }
  }]);
  return Tag;
}();
exports.Tag = Tag;
});

;require.register("curvature/base/Theme.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Theme = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ThemeList = /*#__PURE__*/function () {
  function ThemeList(themes) {
    var _this$themes;
    (0, _classCallCheck2.default)(this, ThemeList);
    (0, _defineProperty2.default)(this, "themes", []);
    (_this$themes = this.themes).push.apply(_this$themes, (0, _toConsumableArray2.default)(themes));
  }
  (0, _createClass2.default)(ThemeList, [{
    key: "getTemplate",
    value: function getTemplate(object) {
      for (var i in this.themes) {
        var theme = this.themes[i].getTemplate(object);
        if (theme) {
          return theme;
        }
      }
    }
  }, {
    key: "getView",
    value: function getView(object) {
      for (var i in this.themes) {
        var theme = this.themes[i].getView(object);
        if (theme) {
          return theme;
        }
      }
    }
  }]);
  return ThemeList;
}();
var Theme = /*#__PURE__*/function () {
  function Theme(key) {
    (0, _classCallCheck2.default)(this, Theme);
    this.key = key;
    this.viewMap = new Map();
    this.templateMap = new Map();
    this.fallbacks = [];
  }
  (0, _createClass2.default)(Theme, [{
    key: "setFallback",
    value: function setFallback() {
      var _this$fallbacks;
      (_this$fallbacks = this.fallbacks).push.apply(_this$fallbacks, arguments);
      return this;
    }
  }, {
    key: "setView",
    value: function setView(type, viewType) {
      this.viewMap.set(type, viewType);
      return this;
    }
  }, {
    key: "getView",
    value: function getView(object) {
      var type = this.resolve(object, 'viewMap');
      if (!type) {
        return null;
      }
      var view = new type(object);
      return view;
    }
  }, {
    key: "setTemplate",
    value: function setTemplate(type, template) {
      this.templateMap.set(type, template);
      return this;
    }
  }, {
    key: "getTemplate",
    value: function getTemplate(object) {
      return this.resolve(object, 'templateMap');
    }
  }, {
    key: "resolve",
    value: function resolve(object, whichMap) {
      if (object.___object___ && object.isBound) {
        object = object.___object___;
      }
      var type = object.__proto__.constructor;
      var map = this[whichMap];
      if (map.has(type, object)) {
        return map.get(type);
      }
      var result = null;
      var _iterator = _createForOfIteratorHelper(map),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            key = _step$value[0],
            value = _step$value[1];
          if (object instanceof key) {
            result = value;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (!result) {
        var _iterator2 = _createForOfIteratorHelper(this.fallbacks),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var theme = _step2.value;
            if (result = theme.resolve(object, whichMap)) {
              return result;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      if (result) {
        map.set(type, result);
      }
      return result;
    }
  }], [{
    key: "get",
    value: function get() {
      for (var _len = arguments.length, keys = new Array(_len), _key = 0; _key < _len; _key++) {
        keys[_key] = arguments[_key];
      }
      if (keys.length <= 1) {
        var key = String(keys[0] || '');
        if (!this.instances[key]) {
          this.instances[key] = new this(key);
        }
        return this.instances[key];
      }
      var themes = [];
      for (var i in keys) {
        themes.push(this.get(keys[i]));
      }
      return new ThemeList(themes);
    }
  }]);
  return Theme;
}();
exports.Theme = Theme;
(0, _defineProperty2.default)(Theme, "instances", {});
});

;require.register("curvature/base/Uuid.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Uuid = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Symbol$toPrimitive;
_Symbol$toPrimitive = Symbol.toPrimitive;
var Uuid = /*#__PURE__*/function () {
  function Uuid() {
    var uuid = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;
    (0, _classCallCheck2.default)(this, Uuid);
    (0, _defineProperty2.default)(this, "uuid", null);
    (0, _defineProperty2.default)(this, "version", 4);
    if (uuid) {
      if (!uuid || typeof uuid !== 'string' && !(uuid instanceof Uuid) || !uuid.match(/[0-9A-Fa-f]{8}(-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}/)) {
        throw new Error("Invalid input for Uuid: \"".concat(uuid, "\""));
      }
      this.version = version;
      this.uuid = uuid;
    } else if (typeof crypto.randomUUID === 'function') {
      this.uuid = crypto.randomUUID();
    } else {
      this.uuid = ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
    }
    Object.freeze(this);
  }
  (0, _createClass2.default)(Uuid, [{
    key: _Symbol$toPrimitive,
    value: function value() {
      return this.toString();
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.uuid;
    }
  }, {
    key: "toJson",
    value: function toJson() {
      return {
        version: this.version,
        uuid: this.uuid
      };
    }
  }]);
  return Uuid;
}();
exports.Uuid = Uuid;
});

;require.register("curvature/base/View.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Bindable = require("./Bindable");
var _ViewList = require("./ViewList");
var _Router = require("./Router");
var _Uuid = require("./Uuid");
var _Dom = require("./Dom");
var _Tag = require("./Tag");
var _Bag = require("./Bag");
var _RuleSet = require("./RuleSet");
var _Mixin = require("./Mixin");
var _PromiseMixin = require("../mixin/PromiseMixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var dontParse = Symbol('dontParse');
var expandBind = Symbol('expandBind');
var uuid = Symbol('uuid');
var moveIndex = 0;
var View = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(View, _Mixin$with);
  var _super = _createSuper(View);
  function View() {
    var _this;
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var mainView = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _classCallCheck2.default)(this, View);
    _this = _super.call(this, args, mainView);
    _this[_EventTargetMixin.EventTargetMixin.EventTargetParent] = mainView;
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'args', {
      value: _Bindable.Bindable.make(args)
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), uuid, {
      value: _this.constructor.uuid()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'nodesAttached', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'nodesDetached', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), '_onRemove', {
      value: new _Bag.Bag(function (i, s, a) {})
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'cleanup', {
      value: []
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'parent', {
      value: mainView
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'views', {
      value: new Map()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'viewLists', {
      value: new Map()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'withViews', {
      value: new Map()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'tags', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'nodes', {
      value: _Bindable.Bindable.make([])
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'timeouts', {
      value: new Map()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'intervals', {
      value: []
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'frames', {
      value: []
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'ruleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'preRuleSet', {
      value: new _RuleSet.RuleSet()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'subBindings', {
      value: {}
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'templates', {
      value: {}
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'eventCleanup', {
      value: []
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'unpauseCallbacks', {
      value: new Map()
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'interpolateRegex', {
      value: /(\[\[((?:\$+)?[\w\.\|-]+)\]\])/g
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'rendered', {
      value: new Promise(function (accept, reject) {
        return Object.defineProperty((0, _assertThisInitialized2.default)(_this), 'renderComplete', {
          value: accept
        });
      })
    });
    _this.onRemove(function () {
      if (!_this[_EventTargetMixin.EventTargetMixin.Parent]) {
        return;
      }
      _this[_EventTargetMixin.EventTargetMixin.Parent] = null;
    });
    _this.controller = (0, _assertThisInitialized2.default)(_this);
    _this.template = "";
    _this.firstNode = null;
    _this.lastNode = null;
    _this.viewList = null;
    _this.mainView = null;
    _this.preserve = false;
    _this.removed = false;
    _this.loaded = Promise.resolve((0, _assertThisInitialized2.default)(_this));

    // return Bindable.make(this);
    return _this;
  }
  (0, _createClass2.default)(View, [{
    key: "_id",
    get: function get() {
      return this[uuid];
    }
  }, {
    key: "onFrame",
    value: function onFrame(callback) {
      var _this2 = this;
      var stopped = false;
      var cancel = function cancel() {
        stopped = true;
      };
      var c = function c(timestamp) {
        if (_this2.removed || stopped) {
          return;
        }
        if (!_this2.paused) {
          callback(Date.now());
        }
        requestAnimationFrame(c);
      };
      requestAnimationFrame(function () {
        return c(Date.now());
      });
      this.frames.push(cancel);
      return cancel;
    }
  }, {
    key: "onNextFrame",
    value: function onNextFrame(callback) {
      return requestAnimationFrame(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onIdle",
    value: function onIdle(callback) {
      return requestIdleCallback(function () {
        return callback(Date.now());
      });
    }
  }, {
    key: "onTimeout",
    value: function onTimeout(time, callback) {
      var _this3 = this;
      var timeoutInfo = {
        timeout: null,
        callback: null,
        time: time,
        fired: false,
        created: new Date().getTime(),
        paused: false
      };
      var wrappedCallback = function wrappedCallback() {
        callback();
        timeoutInfo.fired = true;
        _this3.timeouts.delete(timeoutInfo.timeout);
      };
      var timeout = setTimeout(wrappedCallback, time);
      timeoutInfo.callback = wrappedCallback;
      timeoutInfo.timeout = timeout;
      this.timeouts.set(timeoutInfo.timeout, timeoutInfo);
      return timeout;
    }
  }, {
    key: "clearTimeout",
    value: function (_clearTimeout) {
      function clearTimeout(_x) {
        return _clearTimeout.apply(this, arguments);
      }
      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };
      return clearTimeout;
    }(function (timeout) {
      var _iterator = _createForOfIteratorHelper(this.timeouts),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            callback = _step$value[0],
            timeoutInfo = _step$value[1];
          clearTimeout(timeoutInfo.timeout);
          this.timeouts.delete(timeoutInfo.timeout);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    })
  }, {
    key: "onInterval",
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
    key: "clearInterval",
    value: function (_clearInterval) {
      function clearInterval(_x2) {
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
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
      if (paused === undefined) {
        this.paused = !this.paused;
      }
      this.paused = paused;
      if (this.paused) {
        var _iterator2 = _createForOfIteratorHelper(this.timeouts),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
              callback = _step2$value[0],
              timeout = _step2$value[1];
            if (timeout.fired) {
              this.timeouts.delete(timeout.timeout);
              continue;
            }
            clearTimeout(timeout.timeout);
            timeout.paused = true;
            timeout.time = Math.max(0, timeout.time - (Date.now() - timeout.created));
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        for (var i in this.intervals) {
          clearInterval(this.intervals[i].timeout);
        }
      } else {
        var _iterator3 = _createForOfIteratorHelper(this.timeouts),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _step3$value = (0, _slicedToArray2.default)(_step3.value, 2),
              _callback = _step3$value[0],
              _timeout = _step3$value[1];
            if (!_timeout.paused) {
              continue;
            }
            if (_timeout.fired) {
              this.timeouts.delete(_timeout.timeout);
              continue;
            }
            _timeout.timeout = setTimeout(_timeout.callback, _timeout.time);
            _timeout.paused = false;
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
        for (var _i in this.intervals) {
          if (!this.intervals[_i].timeout.paused) {
            continue;
          }
          this.intervals[_i].timeout.paused = false;
          this.intervals[_i].timeout = setInterval(this.intervals[_i].callback, this.intervals[_i].time);
        }
        var _iterator4 = _createForOfIteratorHelper(this.unpauseCallbacks),
          _step4;
        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var _step4$value = (0, _slicedToArray2.default)(_step4.value, 2),
              _callback2 = _step4$value[1];
            _callback2();
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
        this.unpauseCallbacks.clear();
      }
      var _iterator5 = _createForOfIteratorHelper(this.viewLists),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var _step5$value = (0, _slicedToArray2.default)(_step5.value, 2),
            tag = _step5$value[0],
            viewList = _step5$value[1];
          viewList.pause(!!paused);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      for (var _i2 in this.tags) {
        if (Array.isArray(this.tags[_i2])) {
          for (var j in this.tags[_i2]) {
            this.tags[_i2][j].pause(!!paused);
          }
          continue;
        }
        this.tags[_i2].pause(!!paused);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this$nodes,
        _this4 = this;
      var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (parentNode instanceof View) {
        parentNode = parentNode.firstNode.parentNode;
      }
      if (insertPoint instanceof View) {
        insertPoint = insertPoint.firstNode;
      }
      if (this.firstNode) {
        return this.reRender(parentNode, insertPoint);
      }
      this.dispatchEvent(new CustomEvent('render'));
      var templateParsed = this.template instanceof DocumentFragment ? this.template.cloneNode(true) : View.templates.has(this.template);
      var subDoc = templateParsed ? this.template instanceof DocumentFragment ? templateParsed : View.templates.get(this.template).cloneNode(true) : document.createRange().createContextualFragment(this.template);
      if (!templateParsed && !(this.template instanceof DocumentFragment)) {
        View.templates.set(this.template, subDoc.cloneNode(true));
      }
      this.mainView || this.preRuleSet.apply(subDoc, this);
      this.mapTags(subDoc);
      this.mainView || this.ruleSet.apply(subDoc, this);
      if (window.devMode === true) {
        this.firstNode = document.createComment("Template ".concat(this._id, " Start"));
        this.lastNode = document.createComment("Template ".concat(this._id, " End"));
      } else {
        this.firstNode = document.createTextNode('');
        this.lastNode = document.createTextNode('');
      }
      (_this$nodes = this.nodes).push.apply(_this$nodes, [this.firstNode].concat((0, _toConsumableArray2.default)(Array.from(subDoc.childNodes)), [this.lastNode]));
      this.postRender(parentNode);
      this.dispatchEvent(new CustomEvent('rendered'));
      if (!this.dispatchAttach()) {
        return;
      }
      if (parentNode) {
        var rootNode = parentNode.getRootNode();
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }
        parentNode.insertBefore(subDoc, this.lastNode);
        moveIndex++;
        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode);
        } else {
          var firstDomAttach = function firstDomAttach(event) {
            if (!event.target.isConnected) {
              return;
            }
            _this4.attached(rootNode, parentNode);
            _this4.dispatchAttached(rootNode, parentNode);
            parentNode.removeEventListener('cvDomAttached', firstDomAttach);
          };
          parentNode.addEventListener('cvDomAttached', firstDomAttach);
        }
      }
      this.renderComplete(this.nodes);
      return this.nodes;
    }
  }, {
    key: "dispatchAttach",
    value: function dispatchAttach() {
      return this.dispatchEvent(new CustomEvent('attach', {
        cancelable: true,
        target: this
      }));
    }
  }, {
    key: "dispatchAttached",
    value: function dispatchAttached(rootNode, parentNode) {
      var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      this.dispatchEvent(new CustomEvent('attached', {
        detail: {
          view: view || this,
          node: parentNode,
          root: rootNode,
          mainView: this
        }
      }));
      this.dispatchDomAttached(view);
      var _iterator6 = _createForOfIteratorHelper(this.nodesAttached.items()),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var callback = _step6.value;
          callback(rootNode, parentNode);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "dispatchDomAttached",
    value: function dispatchDomAttached(view) {
      var _this5 = this;
      this.nodes.filter(function (n) {
        return n.nodeType !== Node.COMMENT_NODE;
      }).forEach(function (child) {
        if (!child.matches) {
          return;
        }
        _Dom.Dom.mapTags(child, false, function (tag, walker) {
          if (!tag.matches) {
            return;
          }
          tag.dispatchEvent(new CustomEvent('cvDomAttached', {
            target: tag,
            detail: {
              view: view || _this5,
              mainView: _this5
            }
          }));
        });
        child.dispatchEvent(new CustomEvent('cvDomAttached', {
          target: child,
          detail: {
            view: view || _this5,
            mainView: _this5
          }
        }));
      });
    }
  }, {
    key: "reRender",
    value: function reRender(parentNode, insertPoint) {
      var willReRender = this.dispatchEvent(new CustomEvent('reRender'), {
        cancelable: true,
        target: this
      });
      if (!willReRender) {
        return;
      }
      var subDoc = new DocumentFragment();
      if (this.firstNode.isConnected) {
        var detach = this.nodesDetached.items();
        for (var i in detach) {
          detach[i]();
        }
      }
      subDoc.append.apply(subDoc, (0, _toConsumableArray2.default)(this.nodes));
      if (parentNode) {
        if (insertPoint) {
          parentNode.insertBefore(this.firstNode, insertPoint);
          parentNode.insertBefore(this.lastNode, insertPoint);
        } else {
          parentNode.appendChild(this.firstNode);
          parentNode.appendChild(this.lastNode);
        }
        parentNode.insertBefore(subDoc, this.lastNode);
        this.dispatchEvent(new CustomEvent('reRendered'), {
          cancelable: true,
          target: this
        });
        var rootNode = parentNode.getRootNode();
        if (rootNode.isConnected) {
          this.attached(rootNode, parentNode);
          this.dispatchAttached(rootNode, parentNode);
        }
      }
      return this.nodes;
    }
  }, {
    key: "mapTags",
    value: function mapTags(subDoc) {
      var _this6 = this;
      _Dom.Dom.mapTags(subDoc, false, function (tag, walker) {
        if (tag[dontParse]) {
          return;
        }
        if (tag.matches) {
          tag = _this6.mapInterpolatableTag(tag);
          tag = tag.matches('[cv-template]') && _this6.mapTemplateTag(tag) || tag;
          tag = tag.matches('[cv-slot]') && _this6.mapSlotTag(tag) || tag;
          tag = tag.matches('[cv-prerender]') && _this6.mapPrendererTag(tag) || tag;
          tag = tag.matches('[cv-link]') && _this6.mapLinkTag(tag) || tag;
          tag = tag.matches('[cv-attr]') && _this6.mapAttrTag(tag) || tag;
          tag = tag.matches('[cv-expand]') && _this6.mapExpandableTag(tag) || tag;
          tag = tag.matches('[cv-ref]') && _this6.mapRefTag(tag) || tag;
          tag = tag.matches('[cv-on]') && _this6.mapOnTag(tag) || tag;
          tag = tag.matches('[cv-each]') && _this6.mapEachTag(tag) || tag;
          tag = tag.matches('[cv-bind]') && _this6.mapBindTag(tag) || tag;
          tag = tag.matches('[cv-with]') && _this6.mapWithTag(tag) || tag;
          tag = tag.matches('[cv-if]') && _this6.mapIfTag(tag) || tag;
          tag = tag.matches('[cv-view]') && _this6.mapViewTag(tag) || tag;
        } else {
          tag = _this6.mapInterpolatableTag(tag);
        }
        if (tag !== walker.currentNode) {
          walker.currentNode = tag;
        }
      });
    }
  }, {
    key: "mapExpandableTag",
    value: function mapExpandableTag(tag) {
      /*/
      const tagCompiler = this.compileExpandableTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/

      var existing = tag[expandBind];
      if (existing) {
        existing();
        tag[expandBind] = false;
      }
      var _Bindable$resolve = _Bindable.Bindable.resolve(this.args, tag.getAttribute('cv-expand'), true),
        _Bindable$resolve2 = (0, _slicedToArray2.default)(_Bindable$resolve, 2),
        proxy = _Bindable$resolve2[0],
        expandProperty = _Bindable$resolve2[1];
      tag.removeAttribute('cv-expand');
      if (!proxy[expandProperty]) {
        proxy[expandProperty] = {};
      }
      proxy[expandProperty] = _Bindable.Bindable.make(proxy[expandProperty]);
      this.onRemove(tag[expandBind] = proxy[expandProperty].bindTo(function (v, k, t, d, p) {
        if (d || v === undefined) {
          tag.removeAttribute(k, v);
          return;
        }
        if (v === null) {
          tag.setAttribute(k, '');
          return;
        }
        tag.setAttribute(k, v);
      }));

      // let expandProperty = tag.getAttribute('cv-expand');
      // let expandArg = Bindable.makeBindable(
      // 	this.args[expandProperty] || {}
      // );

      // tag.removeAttribute('cv-expand');

      // for(let i in expandArg)
      // {
      // 	if(i === 'name' || i === 'type')
      // 	{
      // 		continue;
      // 	}

      // 	let debind = expandArg.bindTo(i, ((tag,i)=>(v)=>{
      // 		tag.setAttribute(i, v);
      // 	})(tag,i));

      // 	this.onRemove(()=>{
      // 		debind();
      // 		if(expandArg.isBound())
      // 		{
      // 			Bindable.clearBindings(expandArg);
      // 		}
      // 	});
      // }

      return tag;
      //*/
    }
  }, {
    key: "compileExpandableTag",
    value: function compileExpandableTag(sourceTag) {
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        var expandProperty = tag.getAttribute('cv-expand');
        var expandArg = _Bindable.Bindable.make(bindingView.args[expandProperty] || {});
        tag.removeAttribute('cv-expand');
        var _loop = function _loop() {
          if (i === 'name' || i === 'type') {
            return "continue";
          }
          var debind = expandArg.bindTo(i, function (tag, i) {
            return function (v) {
              tag.setAttribute(i, v);
            };
          }(tag, i));
          bindingView.onRemove(function () {
            debind();
            if (expandArg.isBound()) {
              _Bindable.Bindable.clearBindings(expandArg);
            }
          });
        };
        for (var i in expandArg) {
          var _ret = _loop();
          if (_ret === "continue") continue;
        }
        return tag;
      };
    }
  }, {
    key: "mapAttrTag",
    value: function mapAttrTag(tag) {
      //*/
      var tagCompiler = this.compileAttrTag(tag);
      var newTag = tagCompiler(this);
      tag.replaceWith(newTag);
      return newTag;

      /*/
      	let attrProperty = tag.getAttribute('cv-attr');
      	tag.removeAttribute('cv-attr');
      	let pairs = attrProperty.split(',');
      let attrs = pairs.map((p) => p.split(':'));
      	for (let i in attrs)
      {
      	let proxy        = this.args;
      	let bindProperty = attrs[i][1];
      	let property     = bindProperty;
      		if(bindProperty.match(/\./))
      	{
      		[proxy, property] = Bindable.resolve(
      			this.args
      			, bindProperty
      			, true
      		);
      	}
      		let attrib = attrs[i][0];
      		this.onRemove(proxy.bindTo(
      		property
      		, (v)=>{
      			if(v == null)
      			{
      				tag.setAttribute(attrib, '');
      				return;
      			}
      			tag.setAttribute(attrib, v);
      		}
      	));
      }
      	return tag;
      	//*/
    }
  }, {
    key: "compileAttrTag",
    value: function compileAttrTag(sourceTag) {
      var attrProperty = sourceTag.getAttribute('cv-attr');
      var pairs = attrProperty.split(/[,;]/);
      var attrs = pairs.map(function (p) {
        return p.split(':');
      });
      sourceTag.removeAttribute('cv-attr');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        var _loop2 = function _loop2() {
          var bindProperty = attrs[i][1] || attrs[i][0];
          var _Bindable$resolve3 = _Bindable.Bindable.resolve(bindingView.args, bindProperty, true),
            _Bindable$resolve4 = (0, _slicedToArray2.default)(_Bindable$resolve3, 2),
            proxy = _Bindable$resolve4[0],
            property = _Bindable$resolve4[1];
          var attrib = attrs[i][0];
          bindingView.onRemove(proxy.bindTo(property, function (v, k, t, d) {
            if (d || v === undefined) {
              tag.removeAttribute(attrib, v);
              return;
            }
            if (v === null) {
              tag.setAttribute(attrib, '');
              return;
            }
            tag.setAttribute(attrib, v);
          }));
        };
        for (var i in attrs) {
          _loop2();
        }
        return tag;
      };
    }
  }, {
    key: "mapInterpolatableTag",
    value: function mapInterpolatableTag(tag) {
      var _this7 = this;
      var regex = this.interpolateRegex;
      if (tag.nodeType === Node.TEXT_NODE) {
        var original = tag.nodeValue;
        if (!this.interpolatable(original)) {
          return tag;
        }
        var header = 0;
        var match;
        var _loop3 = function _loop3() {
          var bindProperty = match[2];
          var unsafeHtml = false;
          var unsafeView = false;
          var propertySplit = bindProperty.split('|');
          var transformer = false;
          if (propertySplit.length > 1) {
            transformer = _this7.stringTransformer(propertySplit.slice(1));
            bindProperty = propertySplit[0];
          }
          if (bindProperty.substr(0, 2) === '$$') {
            unsafeHtml = true;
            unsafeView = true;
            bindProperty = bindProperty.substr(2);
          }
          if (bindProperty.substr(0, 1) === '$') {
            unsafeHtml = true;
            bindProperty = bindProperty.substr(1);
          }
          if (bindProperty.substr(0, 3) === '000') {
            expand = true;
            bindProperty = bindProperty.substr(3);
            return "continue";
          }
          var staticPrefix = original.substring(header, match.index);
          header = match.index + match[1].length;
          var staticNode = document.createTextNode(staticPrefix);
          staticNode[dontParse] = true;
          tag.parentNode.insertBefore(staticNode, tag);
          var dynamicNode;
          if (unsafeHtml) {
            dynamicNode = document.createElement('div');
          } else {
            dynamicNode = document.createTextNode('');
          }
          dynamicNode[dontParse] = true;
          var proxy = _this7.args;
          var property = bindProperty;
          if (bindProperty.match(/\./)) {
            var _Bindable$resolve5 = _Bindable.Bindable.resolve(_this7.args, bindProperty, true);
            var _Bindable$resolve6 = (0, _slicedToArray2.default)(_Bindable$resolve5, 2);
            proxy = _Bindable$resolve6[0];
            property = _Bindable$resolve6[1];
          }
          tag.parentNode.insertBefore(dynamicNode, tag);
          if ((0, _typeof2.default)(proxy) !== 'object') {
            return "break";
          }
          proxy = _Bindable.Bindable.make(proxy);
          var debind = proxy.bindTo(property, function (v, k, t) {
            if (t[k] !== v && (t[k] instanceof View || t[k] instanceof Node || t[k] instanceof _Tag.Tag)) {
              if (!t[k].preserve) {
                t[k].remove();
              }
            }
            dynamicNode.nodeValue = '';
            if (unsafeView && !(v instanceof View)) {
              var _v;
              var unsafeTemplate = (_v = v) !== null && _v !== void 0 ? _v : '';
              v = new View(_this7.args, _this7);
              v.template = unsafeTemplate;
            }
            if (transformer) {
              v = transformer(v);
            }
            if (v instanceof View) {
              v[_EventTargetMixin.EventTargetMixin.EventTargetParent] = _this7;
              var onAttach = function onAttach(rootNode, parentNode) {
                v.dispatchAttached(rootNode, parentNode, _this7);
              };
              _this7.nodesAttached.add(onAttach);
              v.render(tag.parentNode, dynamicNode);
              var cleanup = function cleanup() {
                if (!v.preserve) {
                  v.remove();
                }
              };
              _this7.onRemove(cleanup);
              v.onRemove(function () {
                _this7.nodesAttached.remove(onAttach);
                _this7._onRemove.remove(cleanup);
              });
            } else if (v instanceof Node) {
              tag.parentNode.insertBefore(v, dynamicNode);
              _this7.onRemove(function () {
                return v.remove();
              });
            } else if (v instanceof _Tag.Tag) {
              if (v.node) {
                tag.parentNode.insertBefore(v.node, dynamicNode);
                _this7.onRemove(function () {
                  return v.remove();
                });
              } else {
                v.remove();
              }
            } else {
              if (v instanceof Object && v.__toString instanceof Function) {
                v = v.__toString();
              }
              if (unsafeHtml) {
                dynamicNode.innerHTML = v;
              } else {
                dynamicNode.nodeValue = v;
              }
            }
            dynamicNode[dontParse] = true;
          });
          _this7.onRemove(debind);
        };
        while (match = regex.exec(original)) {
          var _ret2 = _loop3();
          if (_ret2 === "continue") continue;
          if (_ret2 === "break") break;
        }
        var staticSuffix = original.substring(header);
        var staticNode = document.createTextNode(staticSuffix);
        staticNode[dontParse] = true;
        tag.parentNode.insertBefore(staticNode, tag);
        tag.nodeValue = '';
      } else if (tag.nodeType === Node.ELEMENT_NODE) {
        var _loop4 = function _loop4() {
          if (!_this7.interpolatable(tag.attributes[i].value)) {
            return "continue";
          }
          var header = 0;
          var match;
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
          var _loop5 = function _loop5() {
            var proxy = _this7.args;
            var property = j;
            var propertySplit = j.split('|');
            var transformer = false;
            var longProperty = j;
            if (propertySplit.length > 1) {
              transformer = _this7.stringTransformer(propertySplit.slice(1));
              property = propertySplit[0];
            }
            if (property.match(/\./)) {
              var _Bindable$resolve7 = _Bindable.Bindable.resolve(_this7.args, property, true);
              var _Bindable$resolve8 = (0, _slicedToArray2.default)(_Bindable$resolve7, 2);
              proxy = _Bindable$resolve8[0];
              property = _Bindable$resolve8[1];
            }
            var matching = [];
            var bindProperty = j;
            var matchingSegments = bindProperties[longProperty];

            // const changeAttribute = (v, k, t, d) => {
            // 	tag.setAttribute(attribute.name, segments.join(''));
            // };

            _this7.onRemove(proxy.bindTo(property, function (v, k, t, d) {
              if (transformer) {
                v = transformer(v);
              }
              for (var _i3 in bindProperties) {
                for (var _j in bindProperties[longProperty]) {
                  segments[bindProperties[longProperty][_j]] = t[_i3];
                  if (k === property) {
                    segments[bindProperties[longProperty][_j]] = v;
                  }
                }
              }
              if (!_this7.paused) {
                // changeAttribute(v,k,t,d);
                tag.setAttribute(attribute.name, segments.join(''));
              } else {
                // this.unpauseCallbacks.set(attribute, () => changeAttribute(v,k,t,d));
                _this7.unpauseCallbacks.set(attribute, function () {
                  return tag.setAttribute(attribute.name, segments.join(''));
                });
              }
            }));
            _this7.onRemove(function () {
              if (!proxy.isBound()) {
                _Bindable.Bindable.clearBindings(proxy);
              }
            });
          };
          for (var j in bindProperties) {
            _loop5();
          }
        };
        for (var i = 0; i < tag.attributes.length; i++) {
          var _ret3 = _loop4();
          if (_ret3 === "continue") continue;
        }
      }
      return tag;
    }
  }, {
    key: "mapRefTag",
    value: function mapRefTag(tag) {
      var refAttr = tag.getAttribute('cv-ref');
      var _refAttr$split = refAttr.split(':'),
        _refAttr$split2 = (0, _slicedToArray2.default)(_refAttr$split, 3),
        refProp = _refAttr$split2[0],
        _refAttr$split2$ = _refAttr$split2[1],
        refClassname = _refAttr$split2$ === void 0 ? null : _refAttr$split2$,
        _refAttr$split2$2 = _refAttr$split2[2],
        refKey = _refAttr$split2$2 === void 0 ? null : _refAttr$split2$2;
      var refClass = _Tag.Tag;
      if (refClassname) {
        refClass = this.stringToClass(refClassname);
      }
      tag.removeAttribute('cv-ref');
      Object.defineProperty(tag, '___tag___', {
        enumerable: false,
        writable: true
      });
      this.onRemove(function () {
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
      this.tags[refProp] = tagObject;
      while (parent) {
        var refKeyVal = this.args[refKey];
        if (refKeyVal !== undefined) {
          if (!parent.tags[refProp]) {
            parent.tags[refProp] = [];
          }
          parent.tags[refProp][refKeyVal] = tagObject;
        } else {
          parent.tags[refProp] = tagObject;
        }
        if (!parent.parent) {
          break;
        }
        parent = parent.parent;
      }
      return tag;
    }
  }, {
    key: "mapBindTag",
    value: function mapBindTag(tag) {
      var _this8 = this;
      var bindArg = tag.getAttribute('cv-bind');
      var proxy = this.args;
      var property = bindArg;
      var top = null;
      if (bindArg.match(/\./)) {
        var _Bindable$resolve9 = _Bindable.Bindable.resolve(this.args, bindArg, true);
        var _Bindable$resolve10 = (0, _slicedToArray2.default)(_Bindable$resolve9, 3);
        proxy = _Bindable$resolve10[0];
        property = _Bindable$resolve10[1];
        top = _Bindable$resolve10[2];
      }
      if (proxy !== this.args) {
        this.subBindings[bindArg] = this.subBindings[bindArg] || [];
        this.onRemove(this.args.bindTo(top, function () {
          while (_this8.subBindings.length) {
            _this8.subBindings.shift()();
          }
        }));
      }
      var unsafeHtml = false;
      if (property.substr(0, 1) === '$') {
        property = property.substr(1);
        unsafeHtml = true;
      }
      var debind = proxy.bindTo(property, function (v, k, t, d, p) {
        if ((p instanceof View || p instanceof Node || p instanceof _Tag.Tag) && p !== v) {
          p.remove();
        }
        var autoChangedEvent = new CustomEvent('cvAutoChanged', {
          bubbles: true
        });
        if (['INPUT', 'SELECT', 'TEXTAREA'].includes(tag.tagName)) {
          var _type = tag.getAttribute('type');
          if (_type && _type.toLowerCase() === 'checkbox') {
            tag.checked = !!v;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type && _type.toLowerCase() === 'radio') {
            tag.checked = v == tag.value;
            tag.dispatchEvent(autoChangedEvent);
          } else if (_type !== 'file') {
            if (tag.tagName === 'SELECT') {
              var selectOption = function selectOption() {
                for (var i = 0; i < tag.options.length; i++) {
                  var option = tag.options[i];
                  if (option.value == v) {
                    tag.selectedIndex = i;
                  }
                }
              };
              selectOption();
              _this8.nodesAttached.add(selectOption);
            } else {
              tag.value = v == null ? '' : v;
            }
            tag.dispatchEvent(autoChangedEvent);
          }
        } else {
          if (v instanceof View) {
            var _iterator7 = _createForOfIteratorHelper(tag.childNodes),
              _step7;
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                var node = _step7.value;
                node.remove();
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
            var onAttach = function onAttach(parentNode) {
              v.dispatchDomAttached(_this8);

              // if(v.nodes.length && v.dispatchAttach())
              // {
              // 	v.attached(parentNode.getRootNode(), parentNode, this);
              // 	v.dispatchAttached(parentNode.getRootNode(), parentNode, this);
              // }
            };

            _this8.nodesAttached.add(onAttach);
            v[_EventTargetMixin.EventTargetMixin.EventTargetParent] = _this8;
            v.render(tag);
            v.onRemove(function () {
              return _this8.nodesAttached.remove(onAttach);
            });
          } else if (v instanceof Node) {
            tag.insert(v);
          } else if (v instanceof _Tag.Tag) {
            tag.append(v.node);
          } else if (unsafeHtml) {
            if (tag.innerHTML !== v) {
              v = String(v);
              if (tag.innerHTML === v.substring(0, tag.innerHTML.length)) {
                tag.innerHTML += v.substring(tag.innerHTML.length);
              } else {
                var _iterator8 = _createForOfIteratorHelper(tag.childNodes),
                  _step8;
                try {
                  for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                    var _node = _step8.value;
                    _node.remove();
                  }
                } catch (err) {
                  _iterator8.e(err);
                } finally {
                  _iterator8.f();
                }
                tag.innerHTML = v;
              }
              _Dom.Dom.mapTags(tag, false, function (t) {
                return t[dontParse] = true;
              });
            }
          } else {
            if (tag.textContent !== v) {
              var _iterator9 = _createForOfIteratorHelper(tag.childNodes),
                _step9;
              try {
                for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
                  var _node2 = _step9.value;
                  _node2.remove();
                }
              } catch (err) {
                _iterator9.e(err);
              } finally {
                _iterator9.f();
              }
              tag.textContent = v;
            }
          }
        }
      });
      if (proxy !== this.args) {
        this.subBindings[bindArg].push(debind);
      }
      this.onRemove(debind);
      var type = tag.getAttribute('type');
      var multi = tag.getAttribute('multiple');
      var inputListener = function inputListener(event) {
        if (event.target !== tag) {
          return;
        }
        if (type && type.toLowerCase() === 'checkbox') {
          if (tag.checked) {
            proxy[property] = event.target.getAttribute('value');
          } else {
            proxy[property] = false;
          }
        } else if (event.target.matches('[contenteditable=true]')) {
          proxy[property] = event.target.innerHTML;
        } else if (type === 'file' && multi) {
          var files = Array.from(event.target.files);
          var current = proxy[property] || _Bindable.Bindable.onDeck(proxy, property);
          if (!current || !files.length) {
            proxy[property] = files;
          } else {
            var _loop6 = function _loop6(i) {
              if (files[i] !== current[i]) {
                files[i].toJSON = function () {
                  return {
                    name: file[i].name,
                    size: file[i].size,
                    type: file[i].type,
                    date: file[i].lastModified
                  };
                };
                current[i] = files[i];
                return "break";
              }
            };
            for (var i in files) {
              var _ret4 = _loop6(i);
              if (_ret4 === "break") break;
            }
          }
        } else if (type === 'file' && !multi && event.target.files.length) {
          var _file = event.target.files.item(0);
          _file.toJSON = function () {
            return {
              name: _file.name,
              size: _file.size,
              type: _file.type,
              date: _file.lastModified
            };
          };
          proxy[property] = _file;
        } else {
          proxy[property] = event.target.value;
        }
      };
      if (type === 'file' || type === 'radio') {
        tag.addEventListener('change', inputListener);
      } else {
        tag.addEventListener('input', inputListener);
        tag.addEventListener('change', inputListener);
        tag.addEventListener('value-changed', inputListener);
      }
      this.onRemove(function () {
        if (type === 'file' || type === 'radio') {
          tag.removeEventListener('change', inputListener);
        } else {
          tag.removeEventListener('input', inputListener);
          tag.removeEventListener('change', inputListener);
          tag.removeEventListener('value-changed', inputListener);
        }
      });
      tag.removeAttribute('cv-bind');
      return tag;
    }
  }, {
    key: "mapOnTag",
    value: function mapOnTag(tag) {
      var _this9 = this;
      var referents = String(tag.getAttribute('cv-on'));
      referents.split(';').map(function (a) {
        return a.split(':');
      }).forEach(function (a) {
        a = a.map(function (a) {
          return a.trim();
        });
        var argLen = a.length;
        var eventName = String(a.shift()).trim();
        var callbackName = String(a.shift() || eventName).trim();
        var eventFlags = String(a.shift() || '').trim();
        var argList = [];
        var groups = /(\w+)(?:\(([$\w\s-'",]+)\))?/.exec(callbackName);
        if (groups) {
          callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
          if (groups[2]) {
            argList = groups[2].split(',').map(function (s) {
              return s.trim();
            });
          }
        }
        if (!argList.length) {
          argList.push('$event');
        }
        if (!eventName || argLen === 1) {
          eventName = callbackName;
        }
        var eventMethod;
        var parent = _this9;
        var _loop7 = function _loop7() {
          var controller = parent.controller;
          if (typeof controller[callbackName] === 'function') {
            eventMethod = function eventMethod() {
              controller[callbackName].apply(controller, arguments);
            };
            return "break";
          } else if (typeof parent[callbackName] === 'function') {
            eventMethod = function eventMethod() {
              var _parent;
              (_parent = parent)[callbackName].apply(_parent, arguments);
            };
            return "break";
          }
          if (parent.parent) {
            parent = parent.parent;
          } else {
            return "break";
          }
        };
        while (parent) {
          var _ret5 = _loop7();
          if (_ret5 === "break") break;
        }
        var eventListener = function eventListener(event) {
          var argRefs = argList.map(function (arg) {
            var match;
            if (Number(arg) == arg) {
              return arg;
            } else if (arg === 'event' || arg === '$event') {
              return event;
            } else if (arg === '$view') {
              return parent;
            } else if (arg === '$controller') {
              return controller;
            } else if (arg === '$tag') {
              return tag;
            } else if (arg === '$parent') {
              return _this9.parent;
            } else if (arg === '$subview') {
              return _this9;
            } else if (arg in _this9.args) {
              return _this9.args[arg];
            } else if (match = /^['"]([\w-]+?)["']$/.exec(arg)) {
              return match[1];
            }
          });
          if (!(typeof eventMethod === 'function')) {
            throw new Error("".concat(callbackName, " is not defined on View object.") + "\n" + "Tag:" + "\n" + "".concat(tag.outerHTML));
          }
          eventMethod.apply(void 0, (0, _toConsumableArray2.default)(argRefs));
        };
        var eventOptions = {};
        if (eventFlags.includes('p')) {
          eventOptions.passive = true;
        } else if (eventFlags.includes('P')) {
          eventOptions.passive = false;
        }
        if (eventFlags.includes('c')) {
          eventOptions.capture = true;
        } else if (eventFlags.includes('C')) {
          eventOptions.capture = false;
        }
        if (eventFlags.includes('o')) {
          eventOptions.once = true;
        } else if (eventFlags.includes('O')) {
          eventOptions.once = false;
        }
        switch (eventName) {
          case '_init':
            eventListener();
            break;
          case '_attach':
            _this9.nodesAttached.add(eventListener);
            break;
          case '_detach':
            _this9.nodesDetached.add(eventListener);
            break;
          default:
            tag.addEventListener(eventName, eventListener, eventOptions);
            _this9.onRemove(function () {
              tag.removeEventListener(eventName, eventListener, eventOptions);
            });
            break;
        }
        return [eventName, callbackName, argList];
      });
      tag.removeAttribute('cv-on');
      return tag;
    }
  }, {
    key: "mapLinkTag",
    value: function mapLinkTag(tag) {
      /*/
      const tagCompiler = this.compileLinkTag(tag);
      	const newTag = tagCompiler(this);
      	tag.replaceWith(newTag);
      	return newTag;
      /*/

      var linkAttr = tag.getAttribute('cv-link');
      tag.setAttribute('href', linkAttr);
      var linkClick = function linkClick(event) {
        event.preventDefault();
        if (linkAttr.substring(0, 4) === 'http' || linkAttr.substring(0, 2) === '//') {
          window.open(tag.getAttribute('href', linkAttr));
          return;
        }
        _Router.Router.go(tag.getAttribute('href'));
      };
      tag.addEventListener('click', linkClick);
      this.onRemove(function (tag, eventListener) {
        return function () {
          tag.removeEventListener('click', eventListener);
          tag = undefined;
          eventListener = undefined;
        };
      }(tag, linkClick));
      tag.removeAttribute('cv-link');
      return tag;
      //*/
    }
  }, {
    key: "compileLinkTag",
    value: function compileLinkTag(sourceTag) {
      var linkAttr = sourceTag.getAttribute('cv-link');
      sourceTag.removeAttribute('cv-link');
      return function (bindingView) {
        var tag = sourceTag.cloneNode(true);
        tag.setAttribute('href', linkAttr);
        return tag;
      };
    }
  }, {
    key: "mapPrendererTag",
    value: function mapPrendererTag(tag) {
      var prerenderAttr = tag.getAttribute('cv-prerender');
      var prerendering = window.prerenderer || navigator.userAgent.match(/prerender/i);
      if (prerendering) {
        window.prerenderer = window.prerenderer || true;
      }
      if (prerenderAttr === 'never' && prerendering || prerenderAttr === 'only' && !prerendering) {
        tag.parentNode.removeChild(tag);
      }
      return tag;
    }
  }, {
    key: "mapWithTag",
    value: function mapWithTag(tag) {
      var _this10 = this;
      var withAttr = tag.getAttribute('cv-with');
      var carryAttr = tag.getAttribute('cv-carry');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-with');
      tag.removeAttribute('cv-carry');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();
      (0, _toConsumableArray2.default)(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });
      var carryProps = [];
      if (carryAttr) {
        carryProps = carryAttr.split(',').map(function (s) {
          return s.trim();
        });
      }
      var debind = this.args.bindTo(withAttr, function (v, k, t, d) {
        if (_this10.withViews.has(tag)) {
          _this10.withViews.delete(tag);
        }
        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }
        var view = new viewClass({}, _this10);
        _this10.onRemove(function (view) {
          return function () {
            view.remove();
          };
        }(view));
        view.template = subTemplate;
        var _loop8 = function _loop8() {
          var debind = _this10.args.bindTo(carryProps[i], function (v, k) {
            view.args[k] = v;
          });
          view.onRemove(debind);
          _this10.onRemove(function () {
            debind();
            view.remove();
          });
        };
        for (var i in carryProps) {
          _loop8();
        }
        var _loop9 = function _loop9() {
          if ((0, _typeof2.default)(v) !== 'object') {
            return "continue";
          }
          v = _Bindable.Bindable.make(v);
          var debind = v.bindTo(_i4, function (vv, kk, tt, dd) {
            if (!dd) {
              view.args[kk] = vv;
            } else if (kk in view.args) {
              delete view.args[kk];
            }
          });
          var debindUp = view.args.bindTo(_i4, function (vv, kk, tt, dd) {
            if (!dd) {
              v[kk] = vv;
            } else if (kk in v) {
              delete v[kk];
            }
          });
          _this10.onRemove(function () {
            debind();
            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
            view.remove();
          });
          view.onRemove(function () {
            debind();
            if (!v.isBound()) {
              _Bindable.Bindable.clearBindings(v);
            }
          });
        };
        for (var _i4 in v) {
          var _ret6 = _loop9();
          if (_ret6 === "continue") continue;
        }
        view.render(tag);
        _this10.withViews.set(tag, view);
      });
      this.onRemove(function () {
        _this10.withViews.delete(tag);
        debind();
      });
      return tag;
    }
  }, {
    key: "mapViewTag",
    value: function mapViewTag(tag) {
      var _this11 = this;
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-view');
      var subTemplate = new DocumentFragment();
      (0, _toConsumableArray2.default)(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });
      var parts = viewAttr.split(':');
      var viewClass = parts.pop() ? this.stringToClass(viewAttr) : View;
      var viewName = parts.shift();
      var view = new viewClass(this.args, this);
      this.views.set(tag, view);
      if (viewName) {
        this.views.set(viewName, view);
      }
      this.onRemove(function (view) {
        return function () {
          view.remove();
          _this11.views.delete(tag);
          _this11.views.delete(viewName);
        };
      }(view));
      view.template = subTemplate;
      view.render(tag);
      return tag;
    }
  }, {
    key: "mapEachTag",
    value: function mapEachTag(tag) {
      var _this12 = this;
      var eachAttr = tag.getAttribute('cv-each');
      var viewAttr = tag.getAttribute('cv-view');
      tag.removeAttribute('cv-each');
      tag.removeAttribute('cv-view');
      var viewClass = viewAttr ? this.stringToClass(viewAttr) : View;
      var subTemplate = new DocumentFragment();
      (0, _toConsumableArray2.default)(tag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });
      var _eachAttr$split = eachAttr.split(':'),
        _eachAttr$split2 = (0, _slicedToArray2.default)(_eachAttr$split, 3),
        eachProp = _eachAttr$split2[0],
        asProp = _eachAttr$split2[1],
        keyProp = _eachAttr$split2[2];
      var proxy = this.args;
      var property = eachProp;
      if (eachProp.match(/\./)) {
        var _Bindable$resolve11 = _Bindable.Bindable.resolve(this.args, eachProp, true);
        var _Bindable$resolve12 = (0, _slicedToArray2.default)(_Bindable$resolve11, 2);
        proxy = _Bindable$resolve12[0];
        property = _Bindable$resolve12[1];
      }
      var debind = proxy.bindTo(property, function (v, k, t, d, p) {
        if (v instanceof _Bag.Bag) {
          v = v.list;
        }
        if (_this12.viewLists.has(tag)) {
          _this12.viewLists.get(tag).remove();
        }
        var viewList = new _ViewList.ViewList(subTemplate, asProp, v, _this12, keyProp, viewClass);
        var viewListRemover = function viewListRemover() {
          return viewList.remove();
        };
        _this12.onRemove(viewListRemover);
        viewList.onRemove(function () {
          return _this12._onRemove.remove(viewListRemover);
        });
        var debindA = _this12.args.bindTo(function (v, k, t, d) {
          if (k === '_id') {
            return;
          }
          if (!d) {
            viewList.subArgs[k] = v;
          } else {
            if (k in viewList.subArgs) {
              delete viewList.subArgs[k];
            }
          }
        });
        var debindB = viewList.args.bindTo(function (v, k, t, d, p) {
          if (k === '_id' || k === 'value' || String(k).substring(0, 3) === '___') {
            return;
          }
          if (!d) {
            if (k in _this12.args) {
              _this12.args[k] = v;
            }
          } else {
            delete _this12.args[k];
          }
        });
        viewList.onRemove(debindA);
        viewList.onRemove(debindB);
        _this12.onRemove(debindA);
        _this12.onRemove(debindB);
        while (tag.firstChild) {
          tag.removeChild(tag.firstChild);
        }
        _this12.viewLists.set(tag, viewList);
        viewList.render(tag);
      });
      this.onRemove(debind);
      return tag;
    }
  }, {
    key: "mapIfTag",
    value: function mapIfTag(tag) {
      var _this13 = this;
      var sourceTag = tag;
      var viewProperty = sourceTag.getAttribute('cv-view');
      var ifProperty = sourceTag.getAttribute('cv-if');
      var isProperty = sourceTag.getAttribute('cv-is');
      var inverted = false;
      var defined = false;
      sourceTag.removeAttribute('cv-view');
      sourceTag.removeAttribute('cv-if');
      sourceTag.removeAttribute('cv-is');
      var viewClass = viewProperty ? this.stringToClass(viewProperty) : View;
      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }
      if (ifProperty.substr(0, 1) === '?') {
        ifProperty = ifProperty.substr(1);
        defined = true;
      }
      var subTemplate = new DocumentFragment();
      (0, _toConsumableArray2.default)(sourceTag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n);
      });
      var bindingView = this;
      var ifDoc = new DocumentFragment();
      var view = new viewClass(Object.assign({}, this.args), bindingView);
      view.tags.bindTo(function (v, k) {
        return _this13.tags[k] = v;
      }, {
        removeWith: this
      });
      view.template = subTemplate;
      var proxy = bindingView.args;
      var property = ifProperty;
      if (ifProperty.match(/\./)) {
        var _Bindable$resolve13 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);
        var _Bindable$resolve14 = (0, _slicedToArray2.default)(_Bindable$resolve13, 2);
        proxy = _Bindable$resolve14[0];
        property = _Bindable$resolve14[1];
      }
      view.render(ifDoc);
      var propertyDebind = proxy.bindTo(property, function (v, k) {
        var o = v;
        if (defined) {
          v = v !== null && v !== undefined;
        }
        if (v instanceof _Bag.Bag) {
          v = v.list;
        }
        if (Array.isArray(v)) {
          v = !!v.length;
        }
        if (isProperty !== null) {
          v = o == isProperty;
        }
        if (inverted) {
          v = !v;
        }
        if (v) {
          tag.appendChild(ifDoc);
          (0, _toConsumableArray2.default)(ifDoc.childNodes).forEach(function (node) {
            return _Dom.Dom.mapTags(node, false, function (tag, walker) {
              if (!tag.matches) {
                return;
              }
              tag.dispatchEvent(new CustomEvent('cvDomAttached', {
                target: tag,
                detail: {
                  view: view || _this13,
                  mainView: _this13
                }
              }));
            });
          });
        } else {
          view.nodes.forEach(function (n) {
            return ifDoc.appendChild(n);
          });
          _Dom.Dom.mapTags(ifDoc, false, function (tag, walker) {
            if (!tag.matches) {
              return;
            }
            new CustomEvent('cvDomDetached', {
              target: tag,
              detail: {
                view: view || _this13,
                mainView: _this13
              }
            });
          });
        }
      }, {
        children: Array.isArray(proxy[property])
      });

      // const propertyDebind = this.args.bindChain(property, onUpdate);

      bindingView.onRemove(propertyDebind);
      var debindA = this.args.bindTo(function (v, k, t, d) {
        if (k === '_id') {
          return;
        }
        if (!d) {
          view.args[k] = v;
        } else if (k in view.args) {
          delete view.args[k];
        }
      });
      var debindB = view.args.bindTo(function (v, k, t, d, p) {
        if (k === '_id' || String(k).substring(0, 3) === '___') {
          return;
        }
        if (k in _this13.args) {
          if (!d) {
            _this13.args[k] = v;
          } else {
            delete _this13.args[k];
          }
        }
      });
      var viewDebind = function viewDebind() {
        propertyDebind();
        debindA();
        debindB();
        bindingView._onRemove.remove(propertyDebind);
        // bindingView._onRemove.remove(bindableDebind);
      };

      bindingView.onRemove(viewDebind);
      this.onRemove(function () {
        debindA();
        debindB();
        view.remove();
        if (bindingView !== _this13) {
          bindingView.remove();
        }
      });
      return tag;
    }
  }, {
    key: "compileIfTag",
    value: function compileIfTag(sourceTag) {
      var ifProperty = sourceTag.getAttribute('cv-if');
      var inverted = false;
      sourceTag.removeAttribute('cv-if');
      if (ifProperty.substr(0, 1) === '!') {
        ifProperty = ifProperty.substr(1);
        inverted = true;
      }
      var subTemplate = new DocumentFragment();
      (0, _toConsumableArray2.default)(sourceTag.childNodes).forEach(function (n) {
        return subTemplate.appendChild(n.cloneNode(true));
      });
      return function (bindingView) {
        var tag = sourceTag.cloneNode();
        var ifDoc = new DocumentFragment();
        var view = new View({}, bindingView);
        view.template = subTemplate;
        // view.parent   = bindingView;

        bindingView.syncBind(view);
        var proxy = bindingView.args;
        var property = ifProperty;
        if (ifProperty.match(/\./)) {
          var _Bindable$resolve15 = _Bindable.Bindable.resolve(bindingView.args, ifProperty, true);
          var _Bindable$resolve16 = (0, _slicedToArray2.default)(_Bindable$resolve15, 2);
          proxy = _Bindable$resolve16[0];
          property = _Bindable$resolve16[1];
        }
        var hasRendered = false;
        var propertyDebind = proxy.bindTo(property, function (v, k) {
          if (!hasRendered) {
            var renderDoc = bindingView.args[property] || inverted ? tag : ifDoc;
            view.render(renderDoc);
            hasRendered = true;
            return;
          }
          if (Array.isArray(v)) {
            v = !!v.length;
          }
          if (inverted) {
            v = !v;
          }
          if (v) {
            tag.appendChild(ifDoc);
          } else {
            view.nodes.forEach(function (n) {
              return ifDoc.appendChild(n);
            });
          }
        });

        // let cleaner = bindingView;

        // while(cleaner.parent)
        // {
        // 	cleaner = cleaner.parent;
        // }

        bindingView.onRemove(propertyDebind);
        var bindableDebind = function bindableDebind() {
          if (!proxy.isBound()) {
            _Bindable.Bindable.clearBindings(proxy);
          }
        };
        var viewDebind = function viewDebind() {
          propertyDebind();
          bindableDebind();
          bindingView._onRemove.remove(propertyDebind);
          bindingView._onRemove.remove(bindableDebind);
        };
        view.onRemove(viewDebind);
        return tag;
      };
    }
  }, {
    key: "mapTemplateTag",
    value: function mapTemplateTag(tag) {
      var templateName = tag.getAttribute('cv-template');
      tag.removeAttribute('cv-template');
      this.templates[templateName] = function () {
        return tag.tagName === 'TEMPLATE' ? tag.content.cloneNode(true) : new DocumentFragment(tag.innerHTML);
      };
      this.rendered.then(function () {
        return tag.remove();
      });
      return tag;
    }
  }, {
    key: "mapSlotTag",
    value: function mapSlotTag(tag) {
      var templateName = tag.getAttribute('cv-slot');
      var getTemplate = this.templates[templateName];
      if (!getTemplate) {
        var parent = this;
        while (parent) {
          getTemplate = parent.templates[templateName];
          if (getTemplate) {
            break;
          }
          parent = this.parent;
        }
        if (!getTemplate) {
          console.error("Template ".concat(templateName, " not found."));
          return;
        }
      }
      var template = getTemplate();
      tag.removeAttribute('cv-slot');
      while (tag.firstChild) {
        tag.firstChild.remove();
      }
      tag.appendChild(template);
      return tag;
    }
  }, {
    key: "syncBind",
    value: function syncBind(subView) {
      var _this14 = this;
      var debindA = this.args.bindTo(function (v, k, t, d) {
        if (k === '_id') {
          return;
        }
        if (subView.args[k] !== v) {
          subView.args[k] = v;
        }
      });
      var debindB = subView.args.bindTo(function (v, k, t, d, p) {
        if (k === '_id') {
          return;
        }
        var newRef = v;
        var oldRef = p;
        if (newRef instanceof View) {
          newRef = newRef.___ref___;
        }
        if (oldRef instanceof View) {
          oldRef = oldRef.___ref___;
        }
        if (newRef !== oldRef && oldRef instanceof View) {
          p.remove();
        }
        if (k in _this14.args) {
          _this14.args[k] = v;
        }
      });
      this.onRemove(debindA);
      this.onRemove(debindB);
      subView.onRemove(function () {
        _this14._onRemove.remove(debindA);
        _this14._onRemove.remove(debindB);
      });
    }
  }, {
    key: "postRender",
    value: function postRender(parentNode) {}
  }, {
    key: "attached",
    value: function attached(parentNode) {}
  }, {
    key: "interpolatable",
    value: function interpolatable(str) {
      return !!String(str).match(this.interpolateRegex);
    }
  }, {
    key: "remove",
    value: function remove() {
      var _this15 = this;
      var now = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      if (!this.dispatchEvent(new CustomEvent('remove', {
        detail: {
          view: this
        },
        cancelable: true
      }))) {
        return;
      }
      var remover = function remover() {
        for (var i in _this15.tags) {
          if (Array.isArray(_this15.tags[i])) {
            _this15.tags[i] && _this15.tags[i].forEach(function (t) {
              return t.remove();
            });
            _this15.tags[i].splice(0);
          } else {
            _this15.tags[i] && _this15.tags[i].remove();
            _this15.tags[i] = undefined;
          }
        }
        for (var _i5 in _this15.nodes) {
          _this15.nodes[_i5] && _this15.nodes[_i5].dispatchEvent(new Event('cvDomDetached'));
          _this15.nodes[_i5] && _this15.nodes[_i5].remove();
          _this15.nodes[_i5] = undefined;
        }
        _this15.nodes.splice(0);
        _this15.firstNode = _this15.lastNode = undefined;
      };
      if (now) {
        remover();
      } else {
        requestAnimationFrame(remover);
      }
      var callbacks = this._onRemove.items();
      var _iterator10 = _createForOfIteratorHelper(callbacks),
        _step10;
      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var callback = _step10.value;
          callback();
          this._onRemove.remove(callback);
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }
      var _iterator11 = _createForOfIteratorHelper(this.cleanup),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var cleanup = _step11.value;
          cleanup && cleanup();
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
      this.cleanup.length = 0;
      var _iterator12 = _createForOfIteratorHelper(this.viewLists),
        _step12;
      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var _step12$value = (0, _slicedToArray2.default)(_step12.value, 2),
            tag = _step12$value[0],
            viewList = _step12$value[1];
          viewList.remove();
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
      this.viewLists.clear();
      var _iterator13 = _createForOfIteratorHelper(this.timeouts),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var _step13$value = (0, _slicedToArray2.default)(_step13.value, 2),
            _callback3 = _step13$value[0],
            timeout = _step13$value[1];
          clearTimeout(timeout.timeout);
          this.timeouts.delete(timeout.timeout);
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
      var _iterator14 = _createForOfIteratorHelper(this.intervals),
        _step14;
      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var interval = _step14.value;
          clearInterval(interval);
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }
      this.intervals.length = 0;
      var _iterator15 = _createForOfIteratorHelper(this.frames),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var frame = _step15.value;
          frame();
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
      this.frames.length = 0;
      this.preRuleSet.purge();
      this.ruleSet.purge();
      this.removed = true;
      this.dispatchEvent(new CustomEvent('removed', {
        detail: {
          view: this
        },
        cancelable: true
      }));
    }
  }, {
    key: "findTag",
    value: function findTag(selector) {
      for (var i in this.nodes) {
        var result = void 0;
        if (!this.nodes[i].querySelector) {
          continue;
        }
        if (this.nodes[i].matches(selector)) {
          return new _Tag.Tag(this.nodes[i], this, undefined, undefined, this);
        }
        if (result = this.nodes[i].querySelector(selector)) {
          return new _Tag.Tag(result, this, undefined, undefined, this);
        }
      }
    }
  }, {
    key: "findTags",
    value: function findTags(selector) {
      var _this16 = this;
      return this.nodes.filter(function (n) {
        return n.querySelectorAll;
      }).map(function (n) {
        return (0, _toConsumableArray2.default)(n.querySelectorAll(selector));
      }).flat().map(function (n) {
        return new _Tag.Tag(n, _this16, undefined, undefined, _this16);
      }) || [];
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      if (callback instanceof Event) {
        return;
      }
      this._onRemove.add(callback);
    }
  }, {
    key: "update",
    value: function update() {}
  }, {
    key: "beforeUpdate",
    value: function beforeUpdate(args) {}
  }, {
    key: "afterUpdate",
    value: function afterUpdate(args) {}
  }, {
    key: "stringTransformer",
    value: function stringTransformer(methods) {
      var _this17 = this;
      return function (x) {
        for (var m in methods) {
          var parent = _this17;
          var method = methods[m];
          while (parent && !parent[method]) {
            parent = parent.parent;
          }
          if (!parent) {
            return;
          }
          x = parent[methods[m]](x);
        }
        return x;
      };
    }
  }, {
    key: "stringToClass",
    value: function stringToClass(refClassname) {
      if (View.refClasses.has(refClassname)) {
        return View.refClasses.get(refClassname);
      }
      var refClassSplit = refClassname.split('/');
      var refShortClass = refClassSplit[refClassSplit.length - 1];
      var refClass = require(refClassname);
      View.refClasses.set(refClassname, refClass[refShortClass]);
      return refClass[refShortClass];
    }
  }, {
    key: "preventParsing",
    value: function preventParsing(node) {
      node[dontParse] = true;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.nodes.map(function (n) {
        return n.outerHTML;
      }).join(' ');
    }
  }, {
    key: "listen",
    value: function listen(node, eventName, callback, options) {
      var _this18 = this;
      if (typeof node === 'string') {
        options = callback;
        callback = eventName;
        eventName = node;
        node = this;
      }
      if (node instanceof View) {
        return this.listen(node.nodes, eventName, callback, options);
      }
      if (Array.isArray(node)) {
        return node.map(function (n) {
          return _this18.listen(n, eventName, callback, options);
        }).forEach(function (r) {
          return r();
        });
      }
      if (node instanceof _Tag.Tag) {
        return this.listen(node.element, eventName, callback, options);
      }
      node.addEventListener(eventName, callback, options);
      var remove = function remove() {
        return node.removeEventListener(eventName, callback, options);
      };
      var remover = function remover() {
        remove();
        remove = function remove() {};
      };
      this.onRemove(function () {
        return remover();
      });
      return remover;
    }
  }, {
    key: "detach",
    value: function detach() {
      for (var n in this.nodes) {
        this.nodes[n].remove();
      }
      return this.nodes;
    }
  }], [{
    key: "from",
    value: function from(template) {
      var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var mainView = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var view = new this(args, mainView);
      view.template = template;
      return view;
    }
  }, {
    key: "isView",
    value: function isView() {
      return View;
    }
  }, {
    key: "uuid",
    value: function uuid() {
      return new _Uuid.Uuid();
    }
  }]);
  return View;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.View = View;
Object.defineProperty(View, 'templates', {
  value: new Map()
});
Object.defineProperty(View, 'refClasses', {
  value: new Map()
});
});

require.register("curvature/base/ViewList.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ViewList = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Bindable = require("./Bindable");
var _SetMap = require("./SetMap");
var _Bag = require("./Bag");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var ViewList = /*#__PURE__*/function () {
  function ViewList(template, subProperty, list, parent) {
    var _this = this;
    var keyProperty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var viewClass = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    (0, _classCallCheck2.default)(this, ViewList);
    this.removed = false;
    this.args = _Bindable.Bindable.makeBindable({});
    this.args.value = _Bindable.Bindable.makeBindable(list || {});
    this.subArgs = _Bindable.Bindable.makeBindable({});
    this.views = [];
    this.cleanup = [];
    this.viewClass = viewClass;
    this._onRemove = new _Bag.Bag();
    this.template = template;
    this.subProperty = subProperty;
    this.keyProperty = keyProperty;
    this.tag = null;
    this.downDebind = [];
    this.upDebind = [];
    this.paused = false;
    this.parent = parent;
    this.rendered = new Promise(function (accept, reject) {
      Object.defineProperty(_this, 'renderComplete', {
        configurable: false,
        writable: true,
        value: accept
      });
    });
    this.willReRender = false;
    this.args.___before(function (t, e, s, o, a) {
      if (e == 'bindTo') {
        return;
      }
      _this.paused = true;
    });
    this.args.___after(function (t, e, s, o, a) {
      if (e == 'bindTo') {
        return;
      }
      _this.paused = s.length > 1;
      _this.reRender();
    });
    var debind = this.args.value.bindTo(function (v, k, t, d) {
      if (_this.paused) {
        return;
      }
      var kk = k;
      if ((0, _typeof2.default)(k) === 'symbol') {
        return;
      }
      if (isNaN(k)) {
        kk = '_' + k;
      }
      if (d) {
        if (_this.views[kk]) {
          _this.views[kk].remove();
        }
        delete _this.views[kk];
        for (var i in _this.views) {
          if (isNaN(i)) {
            _this.views[i].args[_this.keyProperty] = i.substr(1);
            continue;
          }
          _this.views[i].args[_this.keyProperty] = i;
        }
      } else if (!_this.views[kk]) {
        cancelAnimationFrame(_this.willReRender);
        _this.willReRender = requestAnimationFrame(function () {
          _this.reRender();
        });
      } else if (_this.views[kk] && _this.views[kk].args) {
        _this.views[kk].args[_this.keyProperty] = k;
        _this.views[kk].args[_this.subProperty] = v;
      }
    });
    this._onRemove.add(debind);
    Object.preventExtensions(this);
  }
  (0, _createClass2.default)(ViewList, [{
    key: "render",
    value: function render(tag) {
      var _this2 = this;
      var renders = [];
      var _iterator = _createForOfIteratorHelper(this.views),
        _step;
      try {
        var _loop = function _loop() {
          var view = _step.value;
          view.render(tag);
          renders.push(view.rendered.then(function () {
            return view;
          }));
        };
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _loop();
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      this.tag = tag;
      Promise.all(renders).then(function (views) {
        return _this2.renderComplete(views);
      });
      this.parent.dispatchEvent(new CustomEvent('listRendered', {
        detail: {
          detail: {
            key: this.subProperty,
            value: this.args.value
          }
        }
      }));
    }
  }, {
    key: "reRender",
    value: function reRender() {
      var _this3 = this;
      if (this.paused || !this.tag) {
        return;
      }
      var views = [];
      var existingViews = new _SetMap.SetMap();
      for (var i in this.views) {
        var view = this.views[i];
        var rawValue = view.args[this.subProperty];
        existingViews.add(rawValue, view);
        views[i] = view;
      }
      var finalViews = [];
      var finalViewSet = new Set();
      this.downDebind.length && this.downDebind.forEach(function (d) {
        return d && d();
      });
      this.upDebind.length && this.upDebind.forEach(function (d) {
        return d && d();
      });
      this.upDebind.length = 0;
      this.downDebind.length = 0;
      var minKey = Infinity;
      var anteMinKey = Infinity;
      var _loop2 = function _loop2() {
        var found = false;
        var k = _i;
        if (isNaN(k)) {
          k = '_' + _i;
        } else if (String(k).length) {
          k = Number(k);
        }
        if (_this3.args.value[_i] !== undefined && existingViews.has(_this3.args.value[_i])) {
          var existingView = existingViews.getOne(_this3.args.value[_i]);
          if (existingView) {
            existingView.args[_this3.keyProperty] = _i;
            finalViews[k] = existingView;
            finalViewSet.add(existingView);
            found = true;
            if (!isNaN(k)) {
              minKey = Math.min(minKey, k);
              k > 0 && (anteMinKey = Math.min(anteMinKey, k));
            }
            existingViews.remove(_this3.args.value[_i], existingView);
          }
        }
        if (!found) {
          var viewArgs = {};
          var _view = finalViews[k] = new _this3.viewClass(viewArgs, _this3.parent);
          if (!isNaN(k)) {
            minKey = Math.min(minKey, k);
            k > 0 && (anteMinKey = Math.min(anteMinKey, k));
          }
          finalViews[k].template = _this3.template;
          finalViews[k].viewList = _this3;
          finalViews[k].args[_this3.keyProperty] = _i;
          finalViews[k].args[_this3.subProperty] = _this3.args.value[_i];
          _this3.upDebind[k] = viewArgs.bindTo(_this3.subProperty, function (v, k, t, d) {
            var index = viewArgs[_this3.keyProperty];
            if (d) {
              delete _this3.args.value[index];
              return;
            }
            _this3.args.value[index] = v;
          });
          _this3.downDebind[k] = _this3.subArgs.bindTo(function (v, k, t, d) {
            if (d) {
              delete viewArgs[k];
              return;
            }
            viewArgs[k] = v;
          });
          var upDebind = function upDebind() {
            _this3.upDebind.filter(function (x) {
              return x;
            }).forEach(function (d) {
              return d();
            });
            _this3.upDebind.length = 0;
          };
          var downDebind = function downDebind() {
            _this3.downDebind.filter(function (x) {
              return x;
            }).forEach(function (d) {
              return d();
            });
            _this3.downDebind.length = 0;
          };
          _view.onRemove(function () {
            _this3._onRemove.remove(upDebind);
            _this3._onRemove.remove(downDebind);
            _this3.upDebind[k] && _this3.upDebind[k]();
            _this3.downDebind[k] && _this3.downDebind[k]();
            delete _this3.upDebind[k];
            delete _this3.downDebind[k];
          });
          _this3._onRemove.add(upDebind);
          _this3._onRemove.add(downDebind);
          viewArgs[_this3.subProperty] = _this3.args.value[_i];
        }
      };
      for (var _i in this.args.value) {
        _loop2();
      }
      for (var _i2 in views) {
        if (!finalViewSet.has(views[_i2])) {
          views[_i2].remove();
        }
      }
      if (Array.isArray(this.args.value)) {
        var localMin = minKey === 0 && finalViews[1] !== undefined && finalViews.length > 1 || anteMinKey === Infinity ? minKey : anteMinKey;
        var renderRecurse = function renderRecurse() {
          var i = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
          var ii = finalViews.length - i - 1;
          while (ii > localMin && finalViews[ii] === undefined) {
            ii--;
          }
          if (ii < localMin) {
            return Promise.resolve();
          }
          if (finalViews[ii] === _this3.views[ii]) {
            if (finalViews[ii] && !finalViews[ii].firstNode) {
              finalViews[ii].render(_this3.tag, finalViews[ii + 1]);
              return finalViews[ii].rendered.then(function () {
                return renderRecurse(Number(i) + 1);
              });
            } else {
              var split = 500;
              if (i === 0 || i % split) {
                return renderRecurse(Number(i) + 1);
              } else {
                return new Promise(function (accept) {
                  return requestAnimationFrame(function () {
                    return accept(renderRecurse(Number(i) + 1));
                  });
                });
              }
            }
          }
          finalViews[ii].render(_this3.tag, finalViews[ii + 1]);
          _this3.views.splice(ii, 0, finalViews[ii]);
          return finalViews[ii].rendered.then(function () {
            return renderRecurse(i + 1);
          });
        };
        this.rendered = renderRecurse();
      } else {
        var renders = [];
        var leftovers = Object.assign({}, finalViews);
        var isInt = function isInt(x) {
          return parseInt(x) === x - 0;
        };
        var keys = Object.keys(finalViews).sort(function (a, b) {
          if (isInt(a) && isInt(b)) {
            return Math.sign(a - b);
          }
          if (!isInt(a) && !isInt(b)) {
            return 0;
          }
          if (!isInt(a) && isInt(b)) {
            return -1;
          }
          if (isInt(a) && !isInt(b)) {
            return 1;
          }
        });
        var _iterator2 = _createForOfIteratorHelper(keys),
          _step2;
        try {
          var _loop3 = function _loop3() {
            var i = _step2.value;
            delete leftovers[i];
            if (finalViews[i].firstNode && finalViews[i] === _this3.views[i]) {
              return "continue";
            }
            finalViews[i].render(_this3.tag);
            renders.push(finalViews[i].rendered.then(function () {
              return finalViews[i];
            }));
          };
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _ret = _loop3();
            if (_ret === "continue") continue;
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
        for (var _i3 in leftovers) {
          delete this.args.views[_i3];
          leftovers.remove();
        }
        this.rendered = Promise.all(renders);
      }
      for (var _i4 in finalViews) {
        if (isNaN(_i4)) {
          finalViews[_i4].args[this.keyProperty] = _i4.substr(1);
          continue;
        }
        finalViews[_i4].args[this.keyProperty] = _i4;
      }
      this.views = Array.isArray(this.args.value) ? [].concat(finalViews) : finalViews;
      finalViewSet.clear();
      this.willReRender = false;
      this.rendered.then(function () {
        _this3.parent.dispatchEvent(new CustomEvent('listRendered', {
          detail: {
            detail: {
              key: _this3.subProperty,
              value: _this3.args.value,
              tag: _this3.tag
            }
          }
        }));
        _this3.tag.dispatchEvent(new CustomEvent('listRendered', {
          detail: {
            detail: {
              key: _this3.subProperty,
              value: _this3.args.value,
              tag: _this3.tag
            }
          }
        }));
      });
    }
  }, {
    key: "pause",
    value: function pause() {
      var _pause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      for (var i in this.views) {
        this.views[i].pause(_pause);
      }
    }
  }, {
    key: "onRemove",
    value: function onRemove(callback) {
      this._onRemove.add(callback);
    }
  }, {
    key: "remove",
    value: function remove() {
      for (var i in this.views) {
        this.views[i].remove();
      }
      var onRemove = this._onRemove.items();
      for (var _i5 in onRemove) {
        this._onRemove.remove(onRemove[_i5]);
        onRemove[_i5]();
      }
      var cleanup;
      while (this.cleanup.length) {
        cleanup = this.cleanup.pop();
        cleanup();
      }
      this.views = [];
      while (this.tag && this.tag.firstChild) {
        this.tag.removeChild(this.tag.firstChild);
      }
      if (this.subArgs) {
        _Bindable.Bindable.clearBindings(this.subArgs);
      }
      _Bindable.Bindable.clearBindings(this.args);
      if (this.args.value && !this.args.value.isBound()) {
        _Bindable.Bindable.clearBindings(this.args.value);
      }
      this.removed = true;
    }
  }]);
  return ViewList;
}();
exports.ViewList = ViewList;
});

;require.register("curvature/form/ButtonField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonField = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ButtonField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(ButtonField, _Field);
  var _super = _createSuper(ButtonField);
  function ButtonField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, ButtonField);
    _this = _super.call(this, values, form, parent, key);
    _this.args.title = _this.args.title || _this.args.value;
    _this._onClick = [];
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || _this.args.type;
    _this.args.name = attrs.name = _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type, "\"\n\t\t\t\t\tvalue     = \"[[value]]\"\n\t\t\t\t\tcv-on     = \"click:clicked(event)\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(ButtonField, [{
    key: "clicked",
    value: function clicked(event) {
      var cancels = this._onClick.map(function (callback) {
        return callback(event) === false;
      }).filter(function (r) {
        return r;
      });
      if (cancels.length) {
        if (this.args.attrs.type == 'submit') {
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }
      if (this.args.attrs.type == 'submit') {
        event.preventDefault();
        event.stopPropagation();
        this.form.tags.formTag.element.dispatchEvent(new Event('submit', {
          'cancelable': true,
          'bubbles': true
        }));
      }
    }
  }, {
    key: "onClick",
    value: function onClick(callback) {
      this._onClick.push(callback);
    }
  }]);
  return ButtonField;
}(_Field2.Field);
exports.ButtonField = ButtonField;
});

;require.register("curvature/form/Field.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _View2 = require("../base/View");
var _Bindable = require("../base/Bindable");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Field = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(Field, _View);
  var _super = _createSuper(Field);
  function Field(values, form, parent, key) {
    var _this$args$title, _this$args$value, _this$args$value2;
    var _this;
    (0, _classCallCheck2.default)(this, Field);
    var skeleton = Object.assign({}, values);
    _this = _super.call(this, skeleton, parent);
    _this.args.title = (_this$args$title = _this.args.title) !== null && _this$args$title !== void 0 ? _this$args$title : key;
    _this.args.value = (_this$args$value = _this.args.value) !== null && _this$args$value !== void 0 ? _this$args$value : '';
    _this.value = (_this$args$value2 = _this.args.value) !== null && _this$args$value2 !== void 0 ? _this$args$value2 : '';
    _this.skeleton = skeleton;
    _this.disabled = null;
    _this.args.valueString = '';
    _this.form = form;
    // this.parent = parent;
    _this.key = key;
    _this.ignore = _this.args.attrs ? _this.args.attrs['data-cv-ignore'] || false : false;
    var extra = '';
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || skeleton.type || null;
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    if (attrs.type == 'checkbox') {
      extra = 'value = "1"';
    }
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor           = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type     = \"").concat(attrs.type || 'text', "\"\n\t\t\t\tcv-ref        = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type || 'text', "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t").concat(extra, "\n\t\t\t\t/>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    //type    = "${this.args.attrs.type||'text'}"

    // let key     = this.key;
    var setting = null;
    _this.args.bindTo('value', function (v, k) {
      if (!isNaN(v) && v !== null && v.length && v == Number(v) && v.length === String(Number(v)).length) {
        v = Number(v);
      }
      _this.value = v;
      if (setting == k) {
        return;
      }
      setting = key;
      _this.args.valueString = JSON.stringify(v || '', null, 4);
      _this.valueString = _this.args.valueString;
      if (attrs.type == 'file' && _this.tags.input && _this.tags.input.element.files && _this.tags.input.element.length) {
        _this.tags.input.node.removeAttribute('title');
        if (!attrs.multiple) {
          _this.parent.args.value[key] = _this.tags.input.element.files[0];
        } else {
          var files = Array.from(_this.tags.input.element.files);
          if (!_this.parent.args.value[k] || !files.length) {
            _this.parent.args.value[key] = files;
          } else {
            for (var i in files) {
              if (files[i] !== _this.parent.args.value[key][i]) {
                _this.parent.args.value[key] = files;
              }
            }
            _this.parent.args.value.splice(files.length);
          }
        }
      } else if (attrs.type == 'file' && _this.tags.input) {
        if (!v && _this.tags.input) {
          _this.tags.input.node.value = null;
          if (attrs.placeholder) {
            _this.tags.input.node.setAttribute('title', attrs.placeholder);
          } else {
            _this.tags.input.node.removeAttribute('title');
          }
        } else if (v instanceof File) {
          _this.tags.input.node.setAttribute('title', v.name);
        }
      } else {
        if (!_this.parent.args.value) {
          _this.parent.args.value = {};
        }
        _this.parent.args.value[key] = v;
      }
      _this.args.errors = [];
      setting = null;
    });

    // this.parent.args.value = Bindable.makeBindable(this.parent.args.value);

    _this.parent.args.value[_this.key] = _this.args.value;
    _this.parent.args.value.bindTo(key, function (v, k) {
      if (setting == k) {
        return;
      }
      setting = k;
      if (attrs.type == 'file') {
        if (_this.tags.input && _this.tags.input.element.files && _this.tags.input.element.files.length) {
          if (!attrs.multiple) {
            _this.parent.args.value[key] = _this.tags.input.element.files[0];
          } else {
            var files = Array.from(_this.tags.input.element.files);
            if (!_this.parent.args.value[key] || !files.length) {
              _this.parent.args.value[key] = files;
            } else {
              for (var i in files) {
                if (files[i] !== _this.parent.args.value[key][i]) {
                  _this.parent.args.value[key] = files;
                }
              }
              _this.parent.args.value[key].splice(files.length);
            }
          }
        } else {
          _this.args.value = v;
        }
      } else {
        _this.args.value = v;
      }
      setting = null;
    });
    return _this;
  }
  (0, _createClass2.default)(Field, [{
    key: "disable",
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
    key: "enable",
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
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "getName",
    value: function getName() {
      var cascadeIfPossible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (this.tags.input) {
        return this.tags.input.element.getAttribute('name');
      }
      var name = this.key;
      if (cascadeIfPossible) {
        var parent = this.parent;
        var names = [name];
        while (parent && parent.array && typeof parent.key !== 'undefined') {
          names.unshift(parent.key);
          parent = parent.parent;
        }
        name = names.shift();
        if (names.length) {
          name += "[".concat(names.join(']['), "]");
        }
      }
      return name;
    }
  }]);
  return Field;
}(_View2.View);
exports.Field = Field;
});

;require.register("curvature/form/FieldSet.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldSet = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
var _Form = require("./Form");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FieldSet = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(FieldSet, _Field);
  var _super = _createSuper(FieldSet);
  function FieldSet(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, FieldSet);
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'fieldset';
    _this.array = false;
    if (values.array || attrs['data-array'] || attrs['data-multi']) {
      _this.array = attrs['data-array'] = true;
    }
    _this.args.value = {};
    _this.args.fields = _Form.Form.renderFields(values.children, (0, _assertThisInitialized2.default)(_this));
    _this.fields = _this.args.fields;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type  = \"").concat(attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t\tcv-ref     = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-ref = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand=\"attrs\"\n\t\t\t\t\tcv-each = \"fields:field\"\n\t\t\t\t>\n\t\t\t\t\t[[field]]\n\t\t\t\t</fieldset>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(FieldSet, [{
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return field;
    }
  }]);
  return FieldSet;
}(_Field2.Field);
exports.FieldSet = FieldSet;
});

;require.register("curvature/form/FileField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileField = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FileField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(FileField, _Field);
  var _super = _createSuper(FileField);
  function FileField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, FileField);
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || _this.args.type || 'file';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t>\n\t\t\t\t<input\n\t\t\t\t\tname    = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype    = \"").concat(attrs.type, "\"\n\t\t\t\t\tcv-bind = \"value\"\n\t\t\t\t\tcv-ref  = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t<span style = \"display:none\" cv-if = \"value\">[[[value]]]</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  return (0, _createClass2.default)(FileField);
}(_Field2.Field);
exports.FileField = FileField;
});

;require.register("curvature/form/Form.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _View2 = require("../base/View");
var _Field = require("./Field");
var _FieldSet = require("./FieldSet");
var _SelectField = require("./SelectField");
var _RadioField = require("./RadioField");
var _HtmlField = require("./HtmlField");
var _HiddenField = require("./HiddenField");
var _ButtonField = require("./ButtonField");
var _TextareaField = require("./TextareaField");
var _View3 = require("./multiField/View");
var _Bindable = require("../base/Bindable");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
// import { Router           } from 'Router';
// import { Repository       } from '../Repository';
// import { FieldSet         } from './FieldSet';
// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';
var Form = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(Form, _View);
  var _super = _createSuper(Form);
  function Form(skeleton) {
    var _this2;
    var customFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, Form);
    _this2 = _super.call(this, {});
    _this2.args.flatValue = _this2.args.flatValue || {};
    _this2.args.value = _this2.args.value || {};
    _this2.args.method = skeleton._method || 'GET';
    _this2.args.classes = _this2.args.classes || [];
    _this2.skeleton = skeleton;
    _this2.args.bindTo('classes', function (v) {
      _this2.args._classes = v.join(' ');
    });

    // this._onSubmit   = [];
    // this._onRender   = [];
    _this2.action = '';
    _this2.template = "\n\t\t\t<form\n\t\t\t\tclass     = \"[[_classes]]\"\n\t\t\t\tmethod    = \"[[method]]\"\n\t\t\t\tenctype   = \"multipart/form-data\"\n\t\t\t\tcv-on     = \"submit:submit(event)\"\n\t\t\t\tcv-ref    = \"formTag:curvature/base/Tag\"\n\t\t\t\tcv-each   = \"fields:field\"\n\t\t\t\tcv-expand = \"attrs\"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t";
    _this2.args.fields = Form.renderFields(skeleton, (0, _assertThisInitialized2.default)(_this2), customFields);
    _this2.fields = _this2.args.fields;
    var _this = _Bindable.Bindable.makeBindable((0, _assertThisInitialized2.default)(_this2));
    _this2.args.bindTo('value', function (v) {
      _this.value = v;
    });
    _this2.args.bindTo('valueString', function (v) {
      _this.json = v;
    });
    return (0, _possibleConstructorReturn2.default)(_this2, _this);
  }
  (0, _createClass2.default)(Form, [{
    key: "submit",
    value: function submit(event) {
      this.args.valueString = JSON.stringify(this.args.value, null, 4);
      if (!this.dispatchEvent(new CustomEvent('submit', {
        details: {
          view: this
        }
      }))) {
        event.preventDefault();
        event.stopPropagation();
      }

      // for(let i in this._onSubmit)
      // {
      // 	this._onSubmit[i](this, event);
      // }
    }
  }, {
    key: "buttonClick",
    value: function buttonClick(event) {
      // console.log(event);
    }
  }, {
    key: "formData",
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
          if (field.args.fields[i].args.type == 'file' && field.args.fields[i].tags.input.element.files && field.args.fields[i].tags.input.element.files.length) {
            if (field.args.fields[i].args.attrs.multiple) {
              var files = field.args.fields[i].tags.input.element.files;
              for (var _i = 0; _i < files.length; _i++) {
                if (!files[_i]) {
                  continue;
                }
                append.append(fieldName + '[]', files[_i]);
              }
            } else if (field.args.fields[i].tags.input.element.files[0]) {
              append.append(fieldName, field.args.fields[i].tags.input.element.files[0]);
            }
          } else if (field.args.fields[i].args.type !== 'file' || field.args.fields[i].args.value) {
            append.append(fieldName, field.args.fields[i].args.value === undefined ? '' : field.args.fields[i].args.value);
          }
        }
      }
      return append;
    }
  }, {
    key: "queryString",
    value: function queryString() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var parts = [];
      for (var i in this.args.flatValue) {
        args[i] = args[i] || this.args.flatValue[i];
      }
      for (var _i2 in args) {
        parts.push(_i2 + '=' + encodeURIComponent(args[_i2]));
      }
      return parts.join('&');
    }
  }, {
    key: "populate",
    value: function populate(values) {
      // console.log(values);

      for (var i in values) {
        this.args.value[i] = values[i];
      }
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }], [{
    key: "renderFields",
    value: function renderFields(skeleton) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fields = {};
      var _loop = function _loop() {
        if (fields[i]) {
          return "continue";
        }
        if (i.substr(0, 1) == '_') {
          return "continue";
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
        if (customFields && skeleton[i].name in customFields) {
          field = new customFields[skeleton[i].name](skeleton[i], form, parent, i);
        } else {
          switch (skeleton[i].type) {
            case 'fieldset':
              if (skeleton[i].attrs && skeleton[i].attrs['data-multi']) {
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
            case 'textarea':
              field = new _TextareaField.TextareaField(skeleton[i], form, parent, i);
              break;
            default:
              field = new _Field.Field(skeleton[i], form, parent, i);
              break;
          }
        }
        fields[i] = _Bindable.Bindable.make(field);
        var fieldName = field.key; //field.getName();

        field.args.bindTo('value', function (v, k, t, d) {
          if (!isNaN(v) && v !== null && v.length && v == Number(v) && v.length === String(Number(v)).length) {
            v = Number(v);
          }
          if (t.type == 'html' && !t.contentEditable || t.type == 'fieldset') {
            return;
          }
          if (t.disabled) {
            delete form.args.flatValue[fieldName];
            return;
          }
          t.attrs = t.attrs || {};
          var multiple = t.attrs.multiple;
          var newArray = Array.isArray(v);
          var oldArray = parent.args.value[fieldName];
          var exists = t.attrs.multiple && newArray && Array.isArray(oldArray);
          if (exists) {
            for (var _i3 in v) {
              if (v[_i3] !== parent.args.value[fieldName][_i3]) {
                parent.args.value[fieldName][_i3] = v[_i3];
              }
              parent.args.value[fieldName].splice(v.length);
            }
          } else {
            parent.args.value[fieldName] = v;
          }
          form.args.flatValue[fieldName] = v;
          form.args.valueString = JSON.stringify(form.args.value, null, 4);
        });
        field.render();
      };
      for (var i in skeleton) {
        var _ret = _loop();
        if (_ret === "continue") continue;
      }
      return fields;
    }
  }, {
    key: "_updateFields",
    value: function _updateFields(parent, skeleton) {
      for (var i in parent.args.fields) {
        var field = parent.args.fields[i];
        if (skeleton[i]) {
          if (skeleton[i].value) {
            field.args.value = skeleton[i].value;
          }
          if (skeleton[i].errors) {
            field.args.errors = skeleton[i].errors;
          }
          if (skeleton[i].title) {
            field.args.title = skeleton[i].title;
          }
          if (skeleton[i].options) {
            field.args.options = skeleton[i].options;
          }
          if (skeleton[i].attrs) {
            field.args.attrs = skeleton[i].attrs;
          }
          if (field.children && skeleton[i].children) {
            this._updateFields(field, skeleton[i].children);
          }
        }
      }
    }
  }]);
  return Form;
}(_View2.View);
exports.Form = Form;
});

;require.register("curvature/form/HiddenField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HiddenField = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var HiddenField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(HiddenField, _Field);
  var _super = _createSuper(HiddenField);
  function HiddenField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, HiddenField);
    values.type = 'hidden';
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.args.type = attrs.type = 'hidden';
    // this.args.type = attrs.type = attrs.type || this.args.type || 'hidden';
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tstyle     = \"display:none\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\ttype      = \"hidden\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  return (0, _createClass2.default)(HiddenField);
}(_Field2.Field);
exports.HiddenField = HiddenField;
});

;require.register("curvature/form/HtmlField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlField = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var HtmlField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(HtmlField, _Field);
  var _super = _createSuper(HtmlField);
  function HtmlField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, HtmlField);
    _this = _super.call(this, values, form, parent, key);
    _this.key = key;
    _this.args.tagName = _this.args.tagName || 'div';
    _this.args.displayValue = _this.args.value;
    _this.args.attrs = _this.args.attrs || {};
    _this.ignore = _this.args.attrs['data-cv-ignore'] || false;
    _this.args.contentEditable = _this.args.attrs.contenteditable || false;
    _this.args.bindTo('value', function (v) {
      if (!_this.tags.input) {
        return;
      }
      if (_this.tags.input.element === document.activeElement) {
        return;
      }
      _this.args.displayValue = v;
    });
    _this.template = "<".concat(_this.args.tagName, "\n\t\t\tname            = \"").concat(_this.getName(), "\"\n\t\t\tcv-ref          = \"input:curvature/base/Tag\"\n\t\t\tcontenteditable = \"[[contentEditable]]\"\n\t\t\tcv-expand       = \"attrs\"\n\t\t\tcv-bind         = \"$displayValue\"\n\t\t\tcv-on           = \"input:inputProvided(event);\"\n\t\t></").concat(_this.args.tagName, ">");
    return _this;
  }
  (0, _createClass2.default)(HtmlField, [{
    key: "inputProvided",
    value: function inputProvided(event) {
      this.args.value = event.target.innerHTML;
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.key;
    }
  }]);
  return HtmlField;
}(_Field2.Field);
exports.HtmlField = HtmlField;
});

;require.register("curvature/form/RadioField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioField = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var RadioField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(RadioField, _Field);
  var _super = _createSuper(RadioField);
  function RadioField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, RadioField);
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.args.value = _this.args.value || '';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each  = \"options:option:optionText\"/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname      = \"").concat(_this.args.name, "\"\n\t\t\t\t\t\t\ttype      = \"radio\"\n\t\t\t\t\t\t\tvalue     = \"[[option]]\"\n\t\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t\t\tcv-on     = \"change:changed(event)\"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(RadioField, [{
    key: "getLabel",
    value: function getLabel() {
      for (var i in this.args.options) {
        if (this.args.options[i] == this.args.value) {
          return i;
        }
      }
    }
  }, {
    key: "changed",
    value: function changed(event) {
      this.args.value = event.target.value;
    }
  }, {
    key: "postRender",
    value: function postRender() {
      var _this2 = this;
      this.args.bindTo('value', function (v) {
        return _this2.selectOptionByValue(v);
      });
      this.args.options.bindTo(function (v) {
        return _this2.selectOptionByValue(_this2.args.value);
      }, {
        frame: 1
      });
    }
  }, {
    key: "selectOptionByValue",
    value: function selectOptionByValue(value) {
      this.findTags('input').forEach(function (option) {
        if (option.value == value) {
          option.checked = true;
        }
      });
    }
  }]);
  return RadioField;
}(_Field2.Field);
exports.RadioField = RadioField;
});

;require.register("curvature/form/SelectField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectField = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var SelectField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(SelectField, _Field);
  var _super = _createSuper(SelectField);
  function SelectField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, SelectField);
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type || 'select', "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-each   = \"options:option:optionText\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t\t<option value = \"[[option]]\">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(SelectField, [{
    key: "postRender",
    value: function postRender() {
      var _this2 = this;
      this.args.bindTo('value', function (v) {
        return _this2.selectOptionByValue(v);
      });
      this.args.options.bindTo(function (v) {
        return _this2.selectOptionByValue(_this2.args.value);
      }, {
        frame: 1
      });
    }
  }, {
    key: "selectOptionByValue",
    value: function selectOptionByValue(value) {
      var tag = this.tags.input.element;
      var _iterator = _createForOfIteratorHelper(tag.options),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;
          if (option.value == value) {
            tag.selectedIndex = option.index;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "getLabel",
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
exports.SelectField = SelectField;
});

;require.register("curvature/form/TextareaField.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextareaField = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Field2 = require("./Field");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var TextareaField = /*#__PURE__*/function (_Field) {
  (0, _inherits2.default)(TextareaField, _Field);
  var _super = _createSuper(TextareaField);
  function TextareaField(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, TextareaField);
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'textarea';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<textarea\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t></textarea>\n\t\t\t\t<cv-template cv-if = \"attrs.data-caption\">\n\t\t\t\t\t<p>[[attrs.data-caption]]</p>\n\t\t\t\t</cv-template>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }
  return (0, _createClass2.default)(TextareaField);
}(_Field2.Field);
exports.TextareaField = TextareaField;
});

;require.register("curvature/form/multiField/CreateForm.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateForm = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _FormWrapper2 = require("./FormWrapper");
var _HiddenField = require("../../form/HiddenField");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var CreateForm = /*#__PURE__*/function (_FormWrapper) {
  (0, _inherits2.default)(CreateForm, _FormWrapper);
  var _super = _createSuper(CreateForm);
  function CreateForm(args, path) {
    var _this;
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck2.default)(this, CreateForm);
    _this = _super.call(this, args, path, 'POST', customFields || {
      // title: HiddenField
    });
    _this.creating = !!args.publicId;
    return _this;
  }
  (0, _createClass2.default)(CreateForm, [{
    key: "onLoad",
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
      (0, _get2.default)((0, _getPrototypeOf2.default)(CreateForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      this.args.view.args.loading = true;
      this.args.view.args.classes += ' loading';
      return (0, _get2.default)((0, _getPrototypeOf2.default)(CreateForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      this.args.view.args.loading = false;
      this.args.view.args.classes = '';
      if (!response.body) {
        (0, _get2.default)((0, _getPrototypeOf2.default)(CreateForm.prototype), "onResponse", this).call(this, response);
        return;
      }
      if (!this.args.wrapper) {
        this.args.view.addRecord(response.body);
      } else {
        this.args.wrapper.refresh(response.body);
      }
      this.args.view.args.creating = '';
      (0, _get2.default)((0, _getPrototypeOf2.default)(CreateForm.prototype), "onResponse", this).call(this, response);
    }
  }]);
  return CreateForm;
}(_FormWrapper2.FormWrapper);
exports.CreateForm = CreateForm;
});

;require.register("curvature/form/multiField/Form.js", function(exports, require, module) {
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

;require.register("curvature/form/multiField/FormWrapper.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormWrapper = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Repository = require("../../base/Repository");
var _Form = require("../../form/Form");
var _Toast = require("../../toast/Toast");
var _ToastAlert = require("../../toast/ToastAlert");
var _View2 = require("../../base/View");
var _Router = require("../../base/Router");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var FormWrapper = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(FormWrapper, _View);
  var _super = _createSuper(FormWrapper);
  function FormWrapper(args, path) {
    var _this;
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck2.default)(this, FormWrapper);
    _this = _super.call(this, args);
    _this.path = path;
    _this.args.method = method;
    _this.args.action = _this.args.action || null;
    _this.args.form = null;
    _this.args.title = null;
    _this.args.class = '';
    _this.template = "\n\t\t\t<div class = \"form constrict [[class]]\">\n\t\t\t\t<div cv-if = \"title\"><label>[[title]]</label></div>\n\t\t\t\t[[form]]\n\t\t\t</div>\n\t\t";
    _this._onLoad = [];
    _this._onSubmit = [];
    _this._onRender = [];
    _this._onRequest = [];
    _this._onError = [];
    _this._onResponse = [];
    if (path instanceof _Form.Form) {
      _this.loadForm(form, customFields);
    } else {
      _Repository.Repository.request(path).then(function (resp) {
        if (!resp || !resp.meta || !resp.meta.form || !(resp.meta.form instanceof Object)) {
          console.warn('Cannot render form with ', resp);
          // Router.go('/');
          return;
        }
        _this.loadForm(new _Form.Form(resp.meta.form, customFields));
        _this.onLoad(_this.args.form, resp.body);
      });
    }
    return _this;
  }
  (0, _createClass2.default)(FormWrapper, [{
    key: "loadForm",
    value: function loadForm(form) {
      var _this2 = this;
      this.args.form = form;
      this.args.form.addEventListener('submit', function (event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        var formElement = form.tags.formTag.element;
        var uri = formElement.getAttribute('action') || _this2.args.action || _this2.path;
        var method = formElement.getAttribute('method') || _this2.args.method;
        var query = form.args.flatValue;
        method = method.toUpperCase();

        // console.log(method, uri);

        if (method == 'GET') {
          var _query = {};
          if (_this2.args.content && _this2.args.content.args) {
            _this2.args.content.args.page = 0;
          }
          _query.page = 0;
          for (var i in query) {
            if (i === 'api') {
              continue;
            }
            _query[i] = query[i];
          }
          var promises = _this2.onRequest(_query);
          promises.then(function () {
            _this2.onResponse({});
            _Router.Router.go(uri + '?' + _Router.Router.queryToString(_query));
            _this2.update(_query);
          }).catch(function (error) {
            _this2.onRequestError(error);
          });
        } else if (method == 'POST') {
          var formData = form.formData();
          var _iterator = _createForOfIteratorHelper(formData.entries()),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var pair = _step.value;
            } // console.log(pair[0]+ ', ' + pair[1]);
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          var _promises = _this2.onRequest(formData);
          if (_promises) {
            _promises.then(function () {
              _Repository.Repository.request(uri, {
                api: 'json'
              }, formData, false, {
                progressDown: function progressDown(event) {
                  _this2.progressDown(event);
                },
                progressUp: function progressUp(event) {
                  _this2.progressUp(event);
                }
              }).then(function (response) {
                _this2.onResponse(response);
              }).catch(function (error) {
                _this2.onRequestError(error);
              });
            });
          }
        }
      });
    }
  }, {
    key: "onRequest",
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
    key: "onRequestError",
    value: function onRequestError(error) {
      for (var i in this._onError) {
        this._onError[i](error, this);
      }
      if (error.messages) {
        for (var _i in error.messages) {
          _Toast.Toast.instance().alert(error.body && error.body.id ? 'Success!' : 'Error!', error.messages[_i], 3500);
        }
      }
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      for (var i in this._onResponse) {
        this._onResponse[i](response, this);
      }
      if (response.messages) {
        for (var _i2 in response.messages) {
          _Toast.Toast.instance().alert(response.body && response.body.id ? 'Success!' : 'Error!', response.messages[_i2], 3500);
        }
      }
    }
  }, {
    key: "onLoad",
    value: function onLoad(form, model) {
      for (var i in this._onLoad) {
        this._onLoad[i](this, form, model);
      }
    }

    // onSubmit(form, event)
    // {
    // 	for(let i in this._onSubmit)
    // 	{
    // 		this._onSubmit[i](this, event);
    // 	}
    // }

    // postRender()
    // {
    // 	for(let i in this._onRender)
    // 	{
    // 		this._onRender[i](this.args.form);
    // 	}
    // }
  }, {
    key: "customFields",
    value: function customFields() {
      return {};
    }
  }, {
    key: "submit",
    value: function submit() {
      // console.log(this);
    }
  }, {
    key: "progressUp",
    value: function progressUp(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }, {
    key: "progressDown",
    value: function progressDown(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }]);
  return FormWrapper;
}(_View2.View);
exports.FormWrapper = FormWrapper;
});

;require.register("curvature/form/multiField/SearchForm.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchForm = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Config = require("../../base/Config");
var _FormWrapper2 = require("./FormWrapper");
var _HiddenField = require("../../form/HiddenField");
var _Repository = require("../../base/Repository");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var backend = _Config.Config.get('backend') || '//';
var SearchForm = /*#__PURE__*/function (_FormWrapper) {
  (0, _inherits2.default)(SearchForm, _FormWrapper);
  var _super = _createSuper(SearchForm);
  function SearchForm(args, path) {
    var _this;
    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    (0, _classCallCheck2.default)(this, SearchForm);
    _this = _super.call(this, args, path, 'POST', {
      search: _HiddenField.HiddenField
    });
    _this.superTemplate = _this.template;
    _this.args.records = [];
    _this.selected = null;
    _this.template = "\n\t\t\t".concat(_this.superTemplate, "\n\t\t\t<div cv-each = \"records:record:r\" class = \"dropdown-results\">\n\t\t\t\t<div\n\t\t\t\t\tcv-on         = \"click:select(event)\"\n\t\t\t\t\tdata-index    = \"[[r]]\"\n\t\t\t\t\tdata-publicId = \"[[record.publicId]]\"\n\t\t\t\t\tclass         = \"[[record.classes]]\"\n\t\t\t\t>\n\t\t\t\t\t[[record.title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(SearchForm, [{
    key: "onLoad",
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
        _Repository.Repository.request(backend + _this2.path, {
          keyword: v
        }).then(function (response) {
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
      (0, _get2.default)((0, _getPrototypeOf2.default)(SearchForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      // this.args.view.args.loading = true;
      // this.args.view.args.classes += ' loading';

      return (0, _get2.default)((0, _getPrototypeOf2.default)(SearchForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
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

      (0, _get2.default)((0, _getPrototypeOf2.default)(SearchForm.prototype), "onResponse", this).call(this, response);
    }
  }, {
    key: "select",
    value: function select(event) {
      var _this3 = this;
      var index = event.target.getAttribute('data-index');
      var publicId = event.target.getAttribute('data-publicId');
      var record = this.args.records[index];
      console.log(record);
      this.args.view.addRecord(record);
      this.args.view.addButtonClicked();
      return;
      _Repository.Repository.request(backend + this.path + '/' + publicId).then(function (response) {
        console.log(response.body);
        if (!response.body) {
          return;
        }
        _this3.args.view.addRecord(response.body);
        _this3.args.view.addButtonClicked();
      });
    }
  }, {
    key: "onSubmit",
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
exports.SearchForm = SearchForm;
});

;require.register("curvature/form/multiField/View.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Config = require("../../base/Config");
var _Form = require("../../form/Form");
var _FieldSet2 = require("../../form/FieldSet");
var _CreateForm = require("./CreateForm");
var _SearchForm = require("./SearchForm");
var _FormWrapper = require("./FormWrapper");
var _Wrapper = require("./Wrapper");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
// import { Loader     } from '../Ui/ZZ';
var View = /*#__PURE__*/function (_FieldSet) {
  (0, _inherits2.default)(View, _FieldSet);
  var _super = _createSuper(View);
  function View(values, form, parent, key) {
    var _this;
    (0, _classCallCheck2.default)(this, View);
    _this = _super.call(this, values, form, parent, key);
    _this.args._fields = [];
    _this.dragging = false;
    _this.dropping = false;
    for (var i in _this.args.fields) {
      _this.args._fields[Number(i) + 1] = _this.wrapSubfield(_this.args.fields[i]);
    }
    _this.args.fields[-1].disable();
    _this.args._fields[0].addEventListener('attach', function (event) {
      return event.preventDefault();
    });
    _this.args.creating = '';
    _this.args.fieldType = '';
    _this.args.createForm = _this.args.createForm || '';
    _this.args.searchForm = _this.args.searchForm || '';
    _this.args.createFormReady = false;
    _this.setCreateForm({
      view: (0, _assertThisInitialized2.default)(_this)
    });
    _this.args.loader = '...';
    _this.args.addIcon = '&#215;';
    _this.args.addIcon = 'a';
    _this.args.addIcon = '+';
    _this.args.draggable = 'true';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.args.name, "\"\n\t\t\t\tdata-type  = \"").concat(_this.args.attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(_this.args.attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\n\t\t\t\t<fieldset\n\t\t\t\t\tname  = \"").concat(_this.args.name, "\"\n\t\t\t\t\tclass = \"multi-field [[creating]] [[fieldType]]\"\n\t\t\t\t>\n\n\t\t\t\t\t<div class = \"record-list\" cv-each = \"_fields:field:f\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass     = \"single-record\"\n\t\t\t\t\t\t\tdata-for  = \"[[f]]\"\n\t\t\t\t\t\t>[[field]]</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay create\">\n\t\t\t\t\t\t<div class = \"form constrict\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\t\tclass = \"bubble bottom left-margin close\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t&#215;\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t[[createForm]]\n\t\t\t\t\t\t[[searchForm]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay loading\">\n\t\t\t\t\t\t[[loader]]\n\t\t\t\t\t</div>\n\t\t\t\t\t<div cv-if = \"createFormReady\" class=\"add-button-holder\">\n\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\tclass = \"bubble bottom left-margin add\"\n\t\t\t\t\t\t\ttab-index = \"0\"\n\t\t\t\t\t\t>[[addIcon]]</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</fieldset>\n\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\n\t\t\t</label>\n\t\t");
    return _this;
  }
  (0, _createClass2.default)(View, [{
    key: "setCreateForm",
    value: function setCreateForm(args) {
      var _this2 = this;
      var origin = '';
      if (_Config.Config.get('backend')) {
        origin = _Config.Config.get('backend');
      }
      if (this.args.attrs['data-create-endpoint'] !== false && this.args.attrs['data-create-endpoint'] !== undefined) {
        this.args.createForm = new _CreateForm.CreateForm(Object.assign({}, args), this.args.attrs['data-create-endpoint'] ? origin + this.args.attrs['data-create-endpoint'] : args.publicId ? origin + "".concat(this.args.attrs['data-endpoint'], "/").concat(args.publicId, "/edit") : origin + "".concat(this.args.attrs['data-endpoint'], "/create"));
        this.args.createForm._onLoad.push(function (wrap, form) {
          _this2.args.createFormReady = true;
        });
      } else {
        this.args.createFormReady = true;
      }
      if (this.args.attrs['data-endpoint']) {
        this.args.searchForm = new _SearchForm.SearchForm(Object.assign({}, args), origin + this.args.attrs['data-endpoint']);
      }
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return new _Wrapper.Wrapper({
        field: field,
        parent: this
      });
    }
  }, {
    key: "addButtonClicked",
    value: function addButtonClicked() {
      if (!this.args.creating) {
        this.args.creating = 'creating';
      }
    }
  }, {
    key: "addRecord",
    value: function addRecord(record) {
      this.args.creating = '';
      if (!Array.isArray(record)) {
        record = [record];
      }
      for (var i in record) {
        var _skeleton$attrs;
        var fieldClass = this.args.fields[-1].constructor;
        var skeleton = Object.assign({}, this.args.fields[-1].skeleton);
        var name = Object.values(this.args.fields).length - 1;
        skeleton = this.cloneSkeleton(skeleton);
        skeleton = this.correctNames(skeleton, name);
        skeleton.attrs = (_skeleton$attrs = skeleton.attrs) !== null && _skeleton$attrs !== void 0 ? _skeleton$attrs : {};
        skeleton.attrs['data-array'] = true;
        var superSkeleton = {};
        superSkeleton[name] = skeleton;
        var newField = _Form.Form.renderFields(superSkeleton, this)[name];
        this.args.fields[name] = newField;
        var newWrap = this.wrapSubfield(newField);
        newField.args.value.id = record[i].id || '';
        newField.args.value.class = record[i].class || '';
        newField.args.value.title = record[i].title || '';
        newField.args.value.key = this.args._fields.length;
        console.log(this.args._fields);
        this.args._fields.push(newWrap);
        newWrap.refresh(record[i]);
      }
    }
  }, {
    key: "editRecord",
    value: function editRecord(record, wrapper) {
      this.setCreateForm({
        view: this,
        publicId: record.publicId,
        wrapper: wrapper
      });
      this.args.creating = this.args.creating ? '' : 'creating';
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(index) {
      console.log(index, this.args.fields);
      this.args.fields[index].disable();
      this.args._fields[index].args.classes = 'deleted';
    }
  }, {
    key: "undeleteImage",
    value: function undeleteImage(index) {
      this.args.fields[index].enable();
      // console.log(this.args.fields[index]);
      // console.log(this.args._fields[index]);
      // console.log('===============');

      this.args._fields[index].args.classes = '';
    }
  }, {
    key: "cloneSkeleton",
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
        if (!object[i] || (0, _typeof2.default)(object[i]) !== 'object') {
          _object[i] = object[i];
          continue;
        }
        _object[i] = Object.assign({}, this.cloneSkeleton(object[i], level + 1));
      }
      return _object;
    }
  }, {
    key: "correctNames",
    value: function correctNames(skeleton, id) {
      skeleton.name = skeleton.name.replace(/\[-1\]/, "[".concat(id, "]"));
      skeleton.attrs.name = skeleton.name;
      if ('children' in skeleton) {
        for (var i in skeleton.children) {
          skeleton.children[i] = this.correctNames(skeleton.children[i], id);
        }
      }
      return skeleton;
    }
  }, {
    key: "drag",
    value: function drag(event) {
      this.dragging = event.target;
    }
  }, {
    key: "dragOver",
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
    key: "drop",
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
      var dragField, dropField;
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
    key: "dragStop",
    value: function dragStop() {
      this.dragging = false;
      this.dropping = false;
    }
  }, {
    key: "changeAttributePrefix",
    value: function changeAttributePrefix(node, attribute, oldPrefix, newPrefix) {
      var oldName = node.getAttribute(attribute);
      var newName = newPrefix + node.getAttribute(attribute).substring(oldPrefix.length);
      node.setAttribute(attribute, newName);
    }
  }, {
    key: "extractIndex",
    value: function extractIndex(name) {
      var groups;
      if (groups = /\[(-?\d+)\]$/.exec(name)) {
        return parseInt(groups[1]);
      }
      return false;
    }
  }, {
    key: "changeIndex",
    value: function changeIndex(name, index) {
      var newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');
      return newName;
    }
  }, {
    key: "cancel",
    value: function cancel(event) {
      event.stopPropagation();
    }
  }]);
  return View;
}(_FieldSet2.FieldSet);
exports.View = View;
});

;require.register("curvature/form/multiField/Wrapper.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Config = require("../../base/Config");
var _View2 = require("../../base/View");
var _Repository = require("../../base/Repository");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Wrapper = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(Wrapper, _View);
  var _super = _createSuper(Wrapper);
  function Wrapper(args) {
    var _this;
    (0, _classCallCheck2.default)(this, Wrapper);
    _this = _super.call(this, args);
    _this.template = "\n\t\t\t<div\n\t\t\t\tclass = \"wrapped-field [[classes]]\"\n\t\t\t\tcv-on = \"click:editRecord(event, key)\"\n\t\t\t\ttitle = \"[[fieldName]]: [[id]]\"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\tcv-on = \"click:deleteImage(event, key)\"\n\t\t\t\t\tstyle = \"display: inline; cursor:pointer;\"\n\t\t\t\t>\n\t\t\t\t\t[[icon]]\n\t\t\t\t</div>\n\t\t\t\t<div class = \"field-content\">\n\t\t\t\t\t[[title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style = \"display:none\">[[field]]</div>\n\t\t";

    // console.log(this.args.field);

    _this.args.field = _this.args.field || '!';
    _this.args.keyword = '';
    _this.args.title = '';
    _this.args.record = {};
    _this.args.key = _this.args.field.key;
    _this.args.classes = '';
    _this.args.icon = "\xD7";
    _this.deleted = false;
    _this.args.field.args.bindTo('fieldName', function (v) {
      _this.args.fieldName = v;
    });
    _this.args.fieldName = _this.args.field.args.name;
    _this.args.id = _this.args.field.args.value.id;
    _this.args.bindTo('id', function (v) {
      _this.args.field.args.value.id = v;
    });
    _this.args.field.args.value.bindTo('id', function (v, k) {
      if (!v) {
        return;
      }
      _Repository.Repository.request(_this.backendPath(), {
        id: v
      }).then(function (response) {
        _this.args.id = v;
        var record = response.body[0];
        if (!record) {
          _this.args.publicId = null;
          _this.args.title = null;
          return;
        }
        _this.refresh(record);
      });
    }, {
      wait: 0
    });
    _this.args.field.args.value.bindTo('keyword', function (v) {
      _this.args.keyword = v;
    });
    return _this;
  }
  (0, _createClass2.default)(Wrapper, [{
    key: "editRecord",
    value: function editRecord() {
      this.args.parent.editRecord(this.args.record, this);
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(event, index) {
      event.stopPropagation();
      if (!this.deleted) {
        this.args.icon = "\u21BA";
        this.args.parent.deleteImage(index);
        this.deleted = true;
      } else {
        this.args.icon = "\xD7";
        this.args.parent.undeleteImage(index);
        this.deleted = false;
      }
    }
  }, {
    key: "backendPath",
    value: function backendPath() {
      var backend = _Config.Config.get('backend') || '//';
      return backend + this.args.parent.args.attrs['data-endpoint'];
    }
  }, {
    key: "getRecordTitle",
    value: function getRecordTitle(record) {
      if (record._titleField) {
        return record[record._titleField];
      }
      return record.title || record.publicId || record.id;
    }
  }, {
    key: "refresh",
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
exports.Wrapper = Wrapper;
});

;require.register("curvature/input/Axis.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Axis = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Bindable = require("../base/Bindable");
var _Bindable$NoGetters;
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Axis = /*#__PURE__*/function () {
  function Axis(_ref) {
    var _ref$deadZone = _ref.deadZone,
      deadZone = _ref$deadZone === void 0 ? 0 : _ref$deadZone,
      _ref$proportional = _ref.proportional,
      proportional = _ref$proportional === void 0 ? true : _ref$proportional;
    (0, _classCallCheck2.default)(this, Axis);
    (0, _defineProperty2.default)(this, _Bindable$NoGetters, true);
    (0, _defineProperty2.default)(this, "magnitude", 0);
    (0, _defineProperty2.default)(this, "delta", 0);
    this.proportional = proportional;
    this.deadZone = deadZone;
  }
  (0, _createClass2.default)(Axis, [{
    key: "tilt",
    value: function tilt(magnitude) {
      if (this.deadZone && Math.abs(magnitude) >= this.deadZone) {
        magnitude = (Math.abs(magnitude) - this.deadZone) / (1 - this.deadZone) * Math.sign(magnitude);
      } else if (this.deadZone && Math.abs(magnitude) < this.deadZone) {
        magnitude = 0;
      }
      this.delta = Number(magnitude - this.magnitude).toFixed(3) - 0;
      this.magnitude = Number(magnitude).toFixed(3) - 0;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.magnitude = this.delta = 0;
    }
  }]);
  return Axis;
}();
exports.Axis = Axis;
});

;require.register("curvature/input/Button.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Button = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Bindable = require("../base/Bindable");
var _Bindable$NoGetters;
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Button = /*#__PURE__*/function () {
  function Button() {
    (0, _classCallCheck2.default)(this, Button);
    (0, _defineProperty2.default)(this, _Bindable$NoGetters, true);
    (0, _defineProperty2.default)(this, "active", false);
    (0, _defineProperty2.default)(this, "pressure", 0);
    (0, _defineProperty2.default)(this, "delta", 0);
    (0, _defineProperty2.default)(this, "time", 0);
  }
  (0, _createClass2.default)(Button, [{
    key: "update",
    value: function update() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      if (this.pressure) {
        this.time++;
      } else if (!this.pressure && this.time > 0) {
        this.time = -1;
      } else if (!this.pressure && this.time < 0) {
        this.time--;
      }
      if (this.time < -1 && this.delta === -1) {
        this.delta = 0;
      }
    }
  }, {
    key: "press",
    value: function press(pressure) {
      this.delta = Number(pressure - this.pressure).toFixed(3) - 0;
      this.pressure = Number(pressure).toFixed(3) - 0;
      this.active = true;
      this.time = this.time > 0 ? this.time : 0;
    }
  }, {
    key: "release",
    value: function release() {
      if (!this.active) {
        return;
      }
      this.delta = Number(-this.pressure).toFixed(3) - 0;
      this.pressure = 0;
      this.active = false;
    }
  }, {
    key: "zero",
    value: function zero() {
      this.pressure = this.delta = 0;
      this.active = false;
    }
  }]);
  return Button;
}();
exports.Button = Button;
});

;require.register("curvature/input/Gamepad.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Gamepad = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _Bindable = require("../base/Bindable");
var _Mixin = require("../base/Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
var _Axis = require("./Axis");
var _Button = require("./Button");
var _Bindable$NoGetters;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var keys = {
  'Space': 0,
  'Enter': 0,
  'NumpadEnter': 0,
  'ControlLeft': 1,
  'ControlRight': 1,
  'ShiftLeft': 2,
  'ShiftRight': 2,
  'KeyZ': 3,
  'KeyQ': 4,
  'KeyE': 5,
  'Digit1': 6,
  'Digit3': 7,
  'KeyW': 12,
  'KeyA': 14,
  'KeyS': 13,
  'KeyD': 15,
  'KeyH': 112,
  'KeyJ': 113,
  'KeyK': 114,
  'KeyL': 115,
  'KeyP': 9,
  'Pause': 9,
  'Tab': 11,
  'ArrowUp': 12,
  'ArrowDown': 13,
  'ArrowLeft': 14,
  'ArrowRight': 15,
  'Numpad4': 112,
  'Numpad2': 113,
  'Numpad8': 114,
  'Numpad6': 115,
  'Backquote': 1010,
  'NumpadAdd': 1011,
  'NumpadSubtract': 1012,
  'NumpadMultiply': 1013,
  'NumpadDivide': 1014,
  'Escape': 1020
};
(0, _toConsumableArray2.default)(Array(12)).map(function (x, fn) {
  return keys["F".concat(fn)] = 2000 + fn;
});
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Gamepad = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Gamepad, _Mixin$with);
  var _super = _createSuper(Gamepad);
  function Gamepad() {
    var _this;
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$keys = _ref.keys,
      keys = _ref$keys === void 0 ? {} : _ref$keys,
      _ref$deadZone = _ref.deadZone,
      deadZone = _ref$deadZone === void 0 ? 0 : _ref$deadZone,
      _ref$gamepad = _ref.gamepad,
      gamepad = _ref$gamepad === void 0 ? null : _ref$gamepad,
      _ref$keyboard = _ref.keyboard,
      keyboard = _ref$keyboard === void 0 ? null : _ref$keyboard,
      _ref$axisMap = _ref.axisMap,
      axisMap = _ref$axisMap === void 0 ? null : _ref$axisMap;
    (0, _classCallCheck2.default)(this, Gamepad);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), _Bindable$NoGetters, true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "axisMap", {
      12: -1,
      13: +1,
      14: -0,
      15: +0,
      112: -2,
      113: +3,
      114: -3,
      115: +2
    });
    _this.deadZone = deadZone;
    _this.gamepad = gamepad;
    _this.index = gamepad.index;
    _this.id = gamepad.id;
    _this.axisMap = axisMap || _this.axisMap;
    Object.defineProperties((0, _assertThisInitialized2.default)(_this), {
      buttons: {
        value: {}
      },
      pressure: {
        value: {}
      },
      axes: {
        value: {}
      },
      keys: {
        value: {}
      }
    });
    return _this;
  }
  (0, _createClass2.default)(Gamepad, [{
    key: "update",
    value: function update() {
      for (var i in this.buttons) {
        var button = this.buttons[i];
        button.update();
      }
    }
  }, {
    key: "rumbleEffect",
    value: function rumbleEffect(options) {
      return this.gamepad.vibrationActuator.playEffect("dual-rumble", options);
    }
  }, {
    key: "rumble",
    value: function rumble() {
      if (this.gamepad.vibrationActuator.pulse) {
        var _this$gamepad$vibrati;
        return (_this$gamepad$vibrati = this.gamepad.vibrationActuator).pulse.apply(_this$gamepad$vibrati, arguments);
      } else {
        this.rumbleEffect({
          duration: 1000,
          strongMagnitude: 1.0,
          weakMagnitude: 1.0
        });
      }
    }
  }, {
    key: "readInput",
    value: function readInput() {
      if (!this.gamepad) {
        return;
      }
      var index = String(this.gamepad.index);
      var stat = this.constructor;
      if (!stat.padsRead.has(index)) {
        stat.padsRead = new Map(Object.entries(navigator.getGamepads()));
      }
      var gamepad = this.gamepad = stat.padsRead.get(index);
      stat.padsRead.delete(index);
      var pressed = {};
      var released = {};
      if (gamepad) {
        for (var i in gamepad.buttons) {
          var button = gamepad.buttons[i];
          if (button.pressed) {
            this.press(i, button.value);
            pressed[i] = true;
          }
        }
      }
      if (this.keyboard) {
        for (var _i in (0, _toConsumableArray2.default)(Array(10))) {
          if (pressed[_i]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_i) > 0) {
            this.press(_i, 1);
            pressed[_i] = true;
          }
        }
        for (var keycode in keys) {
          if (pressed[keycode]) {
            continue;
          }
          var buttonId = keys[keycode];
          if (this.keyboard.getKeyCode(keycode) > 0) {
            this.press(buttonId, 1);
            pressed[buttonId] = true;
          }
        }
      }
      if (gamepad) {
        for (var _i2 in gamepad.buttons) {
          if (pressed[_i2]) {
            continue;
          }
          var _button = gamepad.buttons[_i2];
          if (!_button.pressed) {
            this.release(_i2);
            released[_i2] = true;
          }
        }
      }
      if (this.keyboard) {
        for (var _i3 in (0, _toConsumableArray2.default)(Array(10))) {
          if (released[_i3]) {
            continue;
          }
          if (pressed[_i3]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_i3) < 0) {
            this.release(_i3);
            released[_i3] = true;
          }
        }
        for (var _keycode in keys) {
          var _buttonId = keys[_keycode];
          if (released[_buttonId]) {
            continue;
          }
          if (pressed[_buttonId]) {
            continue;
          }
          if (this.keyboard.getKeyCode(_keycode) < 0) {
            this.release(_buttonId);
            released[_keycode] = true;
          }
        }
      }
      var tilted = {};
      if (gamepad) {
        for (var _i4 in gamepad.axes) {
          var axis = gamepad.axes[_i4];
          tilted[_i4] = true;
          this.tilt(_i4, axis);
        }
      }
      for (var inputId in this.axisMap) {
        if (!this.buttons[inputId]) {
          this.buttons[inputId] = new _Button.Button();
        }
        var _axis = this.axisMap[inputId];
        var value = Math.sign(1 / _axis);
        var axisId = Math.abs(_axis);
        if (this.buttons[inputId].active) {
          tilted[axisId] = true;
          this.tilt(axisId, value);
        } else if (!tilted[axisId]) {
          this.tilt(axisId, 0);
        }
      }
    }
  }, {
    key: "tilt",
    value: function tilt(axisId, magnitude) {
      if (!this.axes[axisId]) {
        this.axes[axisId] = new _Axis.Axis({
          deadZone: this.deadZone
        });
      }
      this.axes[axisId].tilt(magnitude);
    }
  }, {
    key: "press",
    value: function press(buttonId) {
      var pressure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }
      this.buttons[buttonId].press(pressure);
    }
  }, {
    key: "release",
    value: function release(buttonId) {
      if (!this.buttons[buttonId]) {
        this.buttons[buttonId] = new _Button.Button();
      }
      this.buttons[buttonId].release();
    }
  }, {
    key: "serialize",
    value: function serialize() {
      var buttons = {};
      for (var i in this.buttons) {
        buttons[i] = this.buttons[i].pressure;
      }
      var axes = {};
      for (var _i5 in this.axes) {
        axes[_i5] = this.axes[_i5].magnitude;
      }
      return {
        axes: axes,
        buttons: buttons
      };
    }
  }, {
    key: "replay",
    value: function replay(input) {
      if (input.buttons) {
        for (var i in input.buttons) {
          if (input.buttons[i] > 0) {
            this.press(i, input.buttons[i]);
          } else {
            this.release(i);
          }
        }
      }
      if (input.axes) {
        for (var _i6 in input.axes) {
          if (input.axes[_i6].magnitude !== input.axes[_i6]) {
            this.tilt(_i6, input.axes[_i6]);
          }
        }
      }
    }
  }, {
    key: "zero",
    value: function zero() {
      for (var i in this.axes) {
        this.axes[i].zero();
      }
      for (var _i7 in this.buttons) {
        this.buttons[_i7].zero();
      }
    }
  }], [{
    key: "getPad",
    value: function getPad(_ref2) {
      var _this2 = this;
      var _ref2$index = _ref2.index,
        index = _ref2$index === void 0 ? undefined : _ref2$index,
        _ref2$deadZone = _ref2.deadZone,
        deadZone = _ref2$deadZone === void 0 ? 0 : _ref2$deadZone,
        _ref2$keys = _ref2.keys,
        keys = _ref2$keys === void 0 ? {} : _ref2$keys,
        _ref2$keyboard = _ref2.keyboard,
        keyboard = _ref2$keyboard === void 0 ? null : _ref2$keyboard,
        _ref2$axisMap = _ref2.axisMap,
        axisMap = _ref2$axisMap === void 0 ? null : _ref2$axisMap;
      if (this.padsConnected.has(index)) {
        return this.padsConnected.get(index);
      }
      var waitForPad = new Promise(function (accept) {
        var registerPad = function registerPad(event) {
          event.stopImmediatePropagation();
          var pad = new _this2({
            gamepad: event.gamepad,
            deadZone: deadZone,
            keys: keys,
            keyboard: keyboard,
            axisMap: axisMap
          });
          _this2.padsConnected.set(event.gamepad.index, waitForPad);
          accept(pad);
        };
        addEventListener('gamepadconnected', registerPad, {
          once: true
        });
      });
      return waitForPad;
    }
  }]);
  return Gamepad;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Gamepad = Gamepad;
(0, _defineProperty2.default)(Gamepad, "padsConnected", new Map());
(0, _defineProperty2.default)(Gamepad, "padsRead", new Map());
});

;require.register("curvature/input/Keyboard.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keyboard = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Bindable = require("../base/Bindable");
var Keyboard = /*#__PURE__*/function () {
  function Keyboard() {
    var _this = this;
    (0, _classCallCheck2.default)(this, Keyboard);
    this.maxDecay = 120;
    this.comboTime = 500;
    this.listening = false;
    this.focusElement = document.body;
    this[_Bindable.Bindable.NoGetters] = true;
    Object.defineProperty(this, 'combo', {
      value: _Bindable.Bindable.make([])
    });
    Object.defineProperty(this, 'whichs', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'codes', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'keys', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedWhich', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedCode', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'pressedKey', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedWhich', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedCode', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'releasedKey', {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, 'keyRefs', {
      value: _Bindable.Bindable.make({})
    });
    document.addEventListener('keyup', function (event) {
      if (!_this.listening) {
        return;
      }
      if (!(_this.keys[event.key] > 0) && _this.focusElement && document.activeElement !== _this.focusElement && (!_this.focusElement.contains(document.activeElement) || document.activeElement.matches('input,textarea'))) {
        return;
      }
      event.preventDefault();
      _this.releasedWhich[event.which] = Date.now();
      _this.releasedCode[event.code] = Date.now();
      _this.releasedKey[event.key] = Date.now();
      _this.whichs[event.which] = -1;
      _this.codes[event.code] = -1;
      _this.keys[event.key] = -1;
    });
    document.addEventListener('keydown', function (event) {
      if (!_this.listening) {
        return;
      }
      if (_this.focusElement && document.activeElement !== _this.focusElement && (!_this.focusElement.contains(document.activeElement) || document.activeElement.matches('input,textarea'))) {
        return;
      }
      event.preventDefault();
      if (event.repeat) {
        return;
      }
      _this.combo.push(event.code);
      clearTimeout(_this.comboTimer);
      _this.comboTimer = setTimeout(function () {
        return _this.combo.splice(0);
      }, _this.comboTime);
      _this.pressedWhich[event.which] = Date.now();
      _this.pressedCode[event.code] = Date.now();
      _this.pressedKey[event.key] = Date.now();
      if (_this.keys[event.key] > 0) {
        return;
      }
      _this.whichs[event.which] = 1;
      _this.codes[event.code] = 1;
      _this.keys[event.key] = 1;
    });
    var windowBlur = function windowBlur(event) {
      for (var i in _this.keys) {
        if (_this.keys[i] < 0) {
          continue;
        }
        _this.releasedKey[i] = Date.now();
        _this.keys[i] = -1;
      }
      for (var _i in _this.codes) {
        if (_this.codes[_i] < 0) {
          continue;
        }
        _this.releasedCode[_i] = Date.now();
        _this.codes[_i] = -1;
      }
      for (var _i2 in _this.whichs) {
        if (_this.whichs[_i2] < 0) {
          continue;
        }
        _this.releasedWhich[_i2] = Date.now();
        _this.whichs[_i2] = -1;
      }
    };
    window.addEventListener('blur', windowBlur);
    window.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'visible') {
        return;
      }
      windowBlur();
    });
  }
  (0, _createClass2.default)(Keyboard, [{
    key: "getKeyRef",
    value: function getKeyRef(keyCode) {
      var keyRef = this.keyRefs[keyCode] = this.keyRefs[keyCode] || _Bindable.Bindable.make({});
      return keyRef;
    }
  }, {
    key: "getKeyTime",
    value: function getKeyTime(key) {
      var released = this.releasedKey[key];
      var pressed = this.pressedKey[key];
      if (!pressed) {
        return 0;
      }
      if (!released || released < pressed) {
        return Date.now() - pressed;
      }
      return (Date.now() - released) * -1;
    }
  }, {
    key: "getCodeTime",
    value: function getCodeTime(code) {
      var released = this.releasedCode[code];
      var pressed = this.pressedCode[code];
      if (!pressed) {
        return 0;
      }
      if (!released || released < pressed) {
        return Date.now() - pressed;
      }
      return (Date.now() - released) * -1;
    }
  }, {
    key: "getWhichTime",
    value: function getWhichTime(code) {
      var released = this.releasedWhich[code];
      var pressed = this.pressedWhich[code];
      if (!pressed) {
        return 0;
      }
      if (!released || released < pressed) {
        return Date.now() - pressed;
      }
      return (Date.now() - released) * -1;
    }
  }, {
    key: "getKey",
    value: function getKey(key) {
      if (!this.keys[key]) {
        return 0;
      }
      return this.keys[key];
    }
  }, {
    key: "getKeyCode",
    value: function getKeyCode(code) {
      if (!this.codes[code]) {
        return 0;
      }
      return this.codes[code];
    }
  }, {
    key: "reset",
    value: function reset() {
      for (var i in this.keys) {
        delete this.keys[i];
      }
      for (var i in this.codes) {
        delete this.codes[i];
      }
      for (var i in this.whichs) {
        delete this.whichs[i];
      }
    }
  }, {
    key: "update",
    value: function update() {
      for (var i in this.keys) {
        if (this.keys[i] > 0) {
          this.keys[i]++;
        } else if (this.keys[i] > -this.maxDecay) {
          this.keys[i]--;
        } else {
          delete this.keys[i];
        }
      }
      for (var i in this.codes) {
        var released = this.releasedCode[i];
        var pressed = this.pressedCode[i];
        var keyRef = this.getKeyRef(i);
        if (this.codes[i] > 0) {
          keyRef.frames = this.codes[i]++;
          keyRef.time = pressed ? Date.now() - pressed : 0;
          keyRef.down = true;
          if (!released || released < pressed) {
            return;
          }
          return (Date.now() - released) * -1;
        } else if (this.codes[i] > -this.maxDecay) {
          keyRef.frames = this.codes[i]--;
          keyRef.time = released - Date.now();
          keyRef.down = false;
        } else {
          keyRef.frames = 0;
          keyRef.time = 0;
          keyRef.down = false;
          delete this.codes[i];
        }
      }
      for (var i in this.whichs) {
        if (this.whichs[i] > 0) {
          this.whichs[i]++;
        } else if (this.whichs[i] > -this.maxDecay) {
          this.whichs[i]--;
        } else {
          delete this.whichs[i];
        }
      }
    }
  }], [{
    key: "get",
    value: function get() {
      return this.instance = this.instance || _Bindable.Bindable.make(new this());
    }
  }]);
  return Keyboard;
}();
exports.Keyboard = Keyboard;
});

;require.register("curvature/input/Mouse.js", function(exports, require, module) {
"use strict";
});

;require.register("curvature/input/Sequence.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Sequence = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Bindable = require("../base/Bindable");
var _Mixin = require("../base/Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
var _Bindable$NoGetters;
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
_Bindable$NoGetters = _Bindable.Bindable.NoGetters;
var Sequence = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Sequence, _Mixin$with);
  var _super = _createSuper(Sequence);
  function Sequence(_ref) {
    var _this;
    var callback = _ref.callback,
      keys = _ref.keys,
      timing = _ref.timing,
      gamepad = _ref.gamepad;
    (0, _classCallCheck2.default)(this, Sequence);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), _Bindable$NoGetters, true);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "lastTap", false);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "recent", []);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "callback", function () {});
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "timing", 500);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "keys", '');
    var _ref2 = [callback, timing, keys, gamepad];
    _this.callback = _ref2[0];
    _this.timing = _ref2[1];
    _this.keys = _ref2[2];
    _this.gamepad = _ref2[3];
    return _this;
  }
  (0, _createClass2.default)(Sequence, [{
    key: "check",
    value: function check(k) {
      var recent = this.recent;
      var now = Date.now();
      if (now + -this.lastTap > this.timing) {
        recent.splice(0);
      }
      recent.push({
        code: k,
        time: Date.now()
      });
      var current = recent.map(function (r) {
        return r.code;
      }).join(',');
      var konami = this.keys.join(',');
      this.lastTap = now;
      var matched = [];
      for (var i in recent) {
        var r = recent[i];
        var matchable = recent.slice(i);
        var chunk = matchable.map(function (r) {
          return r.code;
        }).join(',');
        if (chunk === konami.substr(0, chunk.length)) {
          matched.push.apply(matched, (0, _toConsumableArray2.default)(matchable));
          this.dispatchEvent(new CustomEvent('advance', {
            detail: {
              matched: matched,
              recent: recent,
              keys: this.keys,
              length: matchable.length
            }
          }));
          break;
        }
      }
      if (!matched.length) {
        this.dispatchEvent(new CustomEvent('cancel', {
          detail: {
            matched: matched,
            recent: recent,
            keys: this.keys,
            length: matched.length
          }
        }));
        return;
      }
      if (konami === current.substr(-konami.length)) {
        this.dispatchEvent(new CustomEvent('complete', {
          detail: {
            matched: matched,
            recent: recent,
            keys: this.keys,
            length: matched.length
          }
        }));
      }
    }
  }]);
  return Sequence;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Sequence = Sequence;
});

;require.register("curvature/mixin/EventTargetMixin.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventTargetMixin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _Mixin = require("../base/Mixin");
var _EventTargetMixin;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var EventTargetParent = Symbol('EventTargetParent');
var CallHandler = Symbol('CallHandler');
var Capture = Symbol('Capture');
var Bubble = Symbol('Bubble');
var Target = Symbol('Target');
var HandlersBubble = Symbol('HandlersBubble');
var HandlersCapture = Symbol('HandlersCapture');
var EventTargetMixin = (_EventTargetMixin = {}, (0, _defineProperty2.default)(_EventTargetMixin, _Mixin.Mixin.Constructor, function () {
  this[HandlersCapture] = new Map();
  this[HandlersBubble] = new Map();
}), (0, _defineProperty2.default)(_EventTargetMixin, "dispatchEvent", function dispatchEvent() {
  var _this = this;
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  var event = args[0];
  if (typeof event === 'string') {
    event = new CustomEvent(event);
    args[0] = event;
  }
  event.cvPath = event.cvPath || [];
  event.cvTarget = event.cvCurrentTarget = this;
  var result = this[Capture].apply(this, args);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return result;
  }
  var handlers = [];
  if (this[HandlersCapture].has(event.type)) {
    var handlerMap = this[HandlersCapture].get(event.type);
    var newHandlers = (0, _toConsumableArray2.default)(handlerMap);
    newHandlers.forEach(function (h) {
      return h.push(handlerMap);
    });
    handlers.push.apply(handlers, (0, _toConsumableArray2.default)(newHandlers));
  }
  if (this[HandlersBubble].has(event.type)) {
    var _handlerMap = this[HandlersBubble].get(event.type);
    var _newHandlers = (0, _toConsumableArray2.default)(_handlerMap);
    _newHandlers.forEach(function (h) {
      return h.push(_handlerMap);
    });
    handlers.push.apply(handlers, (0, _toConsumableArray2.default)(_newHandlers));
  }
  handlers.push([function () {
    return _this[CallHandler].apply(_this, args);
  }, {}, null]);
  for (var _i = 0, _handlers = handlers; _i < _handlers.length; _i++) {
    var _handlers$_i = (0, _slicedToArray2.default)(_handlers[_i], 3),
      handler = _handlers$_i[0],
      options = _handlers$_i[1],
      map = _handlers$_i[2];
    if (options.once) {
      map.delete(handler);
    }
    result = handler(event);
    if (event.cancelable && result === false) {
      break;
    }
  }
  if (!event.cancelable || !event.cancelBubble && result !== false) {
    this[Bubble].apply(this, args);
  }
  if (!this[EventTargetParent]) {
    Object.freeze(event.cvPath);
  }
  return event.returnValue;
}), (0, _defineProperty2.default)(_EventTargetMixin, "addEventListener", function addEventListener(type, callback) {
  var _this2 = this;
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (options === true) {
    options = {
      useCapture: true
    };
  }
  var handlers = HandlersBubble;
  if (options.useCapture) {
    handlers = HandlersCapture;
  }
  if (!this[handlers].has(type)) {
    this[handlers].set(type, new Map());
  }
  this[handlers].get(type).set(callback, options);
  if (options.signal) {
    options.signal.addEventListener('abort', function (event) {
      return _this2.removeEventListener(type, callback, options);
    }, {
      once: true
    });
  }
}), (0, _defineProperty2.default)(_EventTargetMixin, "removeEventListener", function removeEventListener(type, callback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (options === true) {
    options = {
      useCapture: true
    };
  }
  var handlers = HandlersBubble;
  if (options.useCapture) {
    handlers = HandlersCapture;
  }
  if (!this[handlers].has(type)) {
    return;
  }
  this[handlers].get(type).delete(callback);
}), (0, _defineProperty2.default)(_EventTargetMixin, Capture, function () {
  var _this$EventTargetPare;
  var event = arguments.length <= 0 ? undefined : arguments[0];
  event.cvPath.push(this);
  if (!this[EventTargetParent]) {
    return;
  }
  var result = (_this$EventTargetPare = this[EventTargetParent])[Capture].apply(_this$EventTargetPare, arguments);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return;
  }
  if (!this[EventTargetParent][HandlersCapture].has(event.type)) {
    return;
  }
  event.cvCurrentTarget = this[EventTargetParent];
  var type = event.type;
  var handlers = this[EventTargetParent][HandlersCapture].get(type);
  var _iterator = _createForOfIteratorHelper(handlers),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
        handler = _step$value[0],
        options = _step$value[1];
      if (options.once) {
        handlers.delete(handler);
      }
      result = handler(event);
      if (event.cancelable && (result === false || event.cancelBubble)) {
        break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return result;
}), (0, _defineProperty2.default)(_EventTargetMixin, Bubble, function () {
  var _this$EventTargetPare3, _this$EventTargetPare4;
  var event = arguments.length <= 0 ? undefined : arguments[0];
  if (!event.bubbles || !this[EventTargetParent] || event.cancelBubble) {
    return;
  }
  if (!this[EventTargetParent][HandlersBubble].has(event.type)) {
    var _this$EventTargetPare2;
    return (_this$EventTargetPare2 = this[EventTargetParent])[Bubble].apply(_this$EventTargetPare2, arguments);
  }
  var result;
  event.cvCurrentTarget = this[EventTargetParent];
  var type = event.type;
  var handlers = this[EventTargetParent][HandlersBubble].get(event.type);
  var _iterator2 = _createForOfIteratorHelper(handlers),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _step2$value = (0, _slicedToArray2.default)(_step2.value, 2),
        handler = _step2$value[0],
        options = _step2$value[1];
      if (options.once) {
        handlers.delete(handler);
      }
      result = handler(event);
      if (event.cancelable && result === false) {
        return result;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  result = (_this$EventTargetPare3 = this[EventTargetParent])[CallHandler].apply(_this$EventTargetPare3, arguments);
  if (event.cancelable && (result === false || event.cancelBubble)) {
    return result;
  }
  return (_this$EventTargetPare4 = this[EventTargetParent])[Bubble].apply(_this$EventTargetPare4, arguments);
}), (0, _defineProperty2.default)(_EventTargetMixin, CallHandler, function () {
  var event = arguments.length <= 0 ? undefined : arguments[0];
  if (event.defaultPrevented) {
    return;
  }
  var defaultHandler = "on".concat(event.type[0].toUpperCase() + event.type.slice(1));
  if (typeof this[defaultHandler] === 'function') {
    return this[defaultHandler](event);
  }
}), _EventTargetMixin);
exports.EventTargetMixin = EventTargetMixin;
Object.defineProperty(EventTargetMixin, 'Parent', {
  value: EventTargetParent
});
});

require.register("curvature/mixin/PromiseMixin.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PromiseMixin = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Mixin = require("../base/Mixin");
var _PromiseMixin;
var _Promise = Symbol('Promise');
var Accept = Symbol('Accept');
var Reject = Symbol('Reject');
var PromiseMixin = (_PromiseMixin = {}, (0, _defineProperty2.default)(_PromiseMixin, _Mixin.Mixin.Constructor, function () {
  var _this = this;
  this[_Promise] = new Promise(function (accept, reject) {
    _this[Accept] = accept;
    _this[Reject] = reject;
  });
}), (0, _defineProperty2.default)(_PromiseMixin, "then", function then() {
  var _this$_Promise;
  return (_this$_Promise = this[_Promise]).then.apply(_this$_Promise, arguments);
}), (0, _defineProperty2.default)(_PromiseMixin, "catch", function _catch() {
  var _this$_Promise2;
  return (_this$_Promise2 = this[_Promise]).catch.apply(_this$_Promise2, arguments);
}), (0, _defineProperty2.default)(_PromiseMixin, "finally", function _finally() {
  var _this$_Promise3;
  return (_this$_Promise3 = this[_Promise]).finally.apply(_this$_Promise3, arguments);
}), _PromiseMixin);
exports.PromiseMixin = PromiseMixin;
Object.defineProperty(PromiseMixin, 'Reject', {
  value: Reject
});
Object.defineProperty(PromiseMixin, 'Accept', {
  value: Accept
});
});

require.register("curvature/model/Database.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Database = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Bindable = require("../base/Bindable");
var _Mixin = require("../base/Mixin");
var _EventTargetMixin = require("../mixin/EventTargetMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var BeforeWrite = Symbol('BeforeWrite');
var AfterWrite = Symbol('AfterWrite');
var BeforeDelete = Symbol('BeforeDelete');
var AfterDelete = Symbol('AfterDelete');
var BeforeInsert = Symbol('BeforeInsert');
var AfterInsert = Symbol('AfterInsert');
var BeforeUpdate = Symbol('BeforeUpdate');
var AfterUpdate = Symbol('AfterUpdate');
var BeforeRead = Symbol('BeforeRead');
var AfterRead = Symbol('AfterRead');
var PrimaryKey = Symbol('PrimaryKey');
var Connection = Symbol('Connection');
var Instances = Symbol('Instances');
var HighWater = Symbol('HighWater');
var Metadata = Symbol('Metadata');
var Timers = Symbol('Timers');
var Target = Symbol('Target');
var Store = Symbol('Store');
var Fetch = Symbol('Each');
var Name = Symbol('Name');
var Bank = Symbol('Bank');
var Database = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Database, _Mixin$with);
  var _super = _createSuper(Database);
  function Database(connection) {
    var _this;
    (0, _classCallCheck2.default)(this, Database);
    _this = _super.call(this);
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), Connection, {
      value: connection
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), Name, {
      value: connection.name
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), Timers, {
      value: {}
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), Metadata, {
      value: {}
    });
    Object.defineProperty((0, _assertThisInitialized2.default)(_this), Bank, {
      value: {}
    });
    return _this;
  }
  (0, _createClass2.default)(Database, [{
    key: "select",
    value: function select(_ref) {
      var _this2 = this;
      var store = _ref.store,
        index = _ref.index,
        _ref$range = _ref.range,
        range = _ref$range === void 0 ? null : _ref$range,
        _ref$ranges = _ref.ranges,
        ranges = _ref$ranges === void 0 ? [] : _ref$ranges,
        _ref$direction = _ref.direction,
        direction = _ref$direction === void 0 ? 'next' : _ref$direction,
        _ref$limit = _ref.limit,
        limit = _ref$limit === void 0 ? 0 : _ref$limit,
        _ref$offset = _ref.offset,
        offset = _ref$offset === void 0 ? 0 : _ref$offset,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? false : _ref$type,
        _ref$origin = _ref.origin,
        origin = _ref$origin === void 0 ? undefined : _ref$origin,
        _ref$map = _ref.map,
        map = _ref$map === void 0 ? undefined : _ref$map;
      var t = this[Connection].transaction(store, "readonly");
      var s = t.objectStore(store);
      var i = index ? s.index(index) : s;
      if (!ranges || !ranges.length) {
        ranges = [range];
      }
      return {
        each: this[Fetch](type, i, direction, ranges, limit, offset, origin, map),
        one: this[Fetch](type, i, direction, ranges, 1, offset, origin, map),
        then: function then(c) {
          return _this2[Fetch](type, i, direction, ranges, limit, offset, origin, map)(function (e) {
            return e;
          }).then(c);
        }
      };
    }
  }, {
    key: "insert",
    value: function insert(storeName, records) {
      var _this3 = this;
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this[Bank][storeName] = this[Bank][storeName] || {};
      var trans = this[Connection].transaction([storeName], 'readwrite');
      var store = trans.objectStore(storeName);
      var bank = this[Bank][storeName];
      var list = true;
      if (!Array.isArray(records)) {
        records = [records];
        list = false;
      }
      var results = records.map(function (record) {
        return new Promise(function (accept, reject) {
          record = _Bindable.Bindable.make(record);
          var detail = {
            database: _this3[Name],
            record: record,
            store: storeName,
            type: 'write',
            subType: 'insert',
            origin: origin
          };
          var beforeWriteResult = record[Database.BeforeWrite] ? record[Database.BeforeWrite](detail) : null;
          var beforeInsertResult = record[Database.BeforeInsert] ? record[Database.BeforeInsert](detail) : null;
          var request = store.add(Object.assign({}, _Bindable.Bindable.shuck(record)));
          if (beforeWriteResult === false || beforeInsertResult === false) {
            return;
          }
          request.onerror = function (error) {
            _this3.dispatchEvent(new CustomEvent('writeError', {
              detail: detail
            }));
            reject(error);
          };
          request.onsuccess = function (event) {
            var pk = event.target.result;
            bank[pk] = record;
            var cancelable = true;
            detail.key = Database.getPrimaryKey(record);
            var eventResult = _this3.dispatchEvent(new CustomEvent('write', {
              cancelable: cancelable,
              detail: detail
            }));
            if (eventResult) {
              record[PrimaryKey] = Symbol.for(pk);
              if (!_this3[Metadata][storeName]) {
                _this3[Metadata][storeName] = _this3.getStoreMeta(storeName, 'store', {});
              }
              if (_this3[Metadata][storeName]) {
                var currentHighMark = _this3.checkHighWaterMark(storeName, record);
                var currentLowMark = _this3.checkLowWaterMark(storeName, record);
                var metadata = _this3[Metadata][storeName];
                var recordMark = record[metadata.highWater];
                if (origin.setHighWater && currentHighMark < recordMark) {
                  _this3.setHighWaterMark(storeName, record, origin, 'insert');
                }
                if (origin.setLowWater && currentLowMark > recordMark) {
                  _this3.setLowWaterMark(storeName, record, origin, 'insert');
                }
              }
              record[Database.AfterInsert] && record[Database.AfterInsert](detail);
              record[Database.AfterWrite] && record[Database.AfterWrite](detail);
            } else {
              trans.abort();
            }
            accept(record);
          };
        });
      });
      var finalResult;
      if (list) {
        finalResult = Promise.allSettled(results);
      } else {
        finalResult = results[0];
      }
      Promise.all(results).then(function () {
        return trans.commit && trans.commit();
      });
      return finalResult;
    }
  }, {
    key: "update",
    value: function update(storeName, record) {
      var _this4 = this;
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      if (!record[PrimaryKey]) {
        throw Error('Value provided is not a DB record!');
      }
      return new Promise(function (accept, reject) {
        var trans = _this4[Connection].transaction([storeName], 'readwrite');
        var store = trans.objectStore(storeName);
        var detail = {
          database: _this4[Name],
          key: Database.getPrimaryKey(record),
          record: record,
          store: storeName,
          type: 'write',
          subType: 'update',
          origin: origin
        };
        record[Database.AfterInsert] && record[Database.AfterInsert](detail);
        record[Database.AfterWrite] && record[Database.AfterWrite](detail);
        var beforeWriteResult = record[Database.BeforeWrite] ? record[Database.BeforeWrite](detail) : null;
        var beforeUpdateResult = record[Database.BeforeUpdate] ? record[Database.BeforeUpdate](detail) : null;
        if (beforeWriteResult === false || beforeUpdateResult === false) {
          return;
        }
        var request = store.put(Object.assign({}, _Bindable.Bindable.shuck(record)));
        request.onerror = function (error) {
          _this4.dispatchEvent(new CustomEvent('writeError', {
            detail: detail
          }));
          reject(error);
        };
        request.onsuccess = function (event) {
          var cancelable = true;
          var eventResult = _this4.dispatchEvent(new CustomEvent('write', {
            cancelable: cancelable,
            detail: detail
          }));
          if (eventResult) {
            if (!_this4[Metadata][storeName]) {
              _this4[Metadata][storeName] = _this4.getStoreMeta(storeName, 'store', {});
            }
            if (_this4[Metadata][storeName]) {
              var currentHighMark = _this4.checkHighWaterMark(storeName, record);
              var currentLowMark = _this4.checkLowWaterMark(storeName, record);
              var metadata = _this4[Metadata][storeName];
              var recordMark = record[metadata.highWater];
              if (origin.setHighWater && currentHighMark < recordMark) {
                _this4.setHighWaterMark(storeName, record, origin, 'insert');
              }
              if (origin.setLowWater && currentLowMark > recordMark) {
                _this4.setLowWaterMark(storeName, record, origin, 'insert');
              }
            }
            trans.commit && trans.commit();
          } else {
            trans.abort();
          }
          accept(event);
        };
      });
    }
  }, {
    key: "delete",
    value: function _delete(storeName, record) {
      var _this5 = this;
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      if (!record[PrimaryKey]) {
        throw Error('Value provided is not a DB record!');
      }
      return new Promise(function (accept, reject) {
        var trans = _this5[Connection].transaction([storeName], 'readwrite');
        var store = trans.objectStore(storeName);
        var detail = {
          database: _this5[Name],
          record: record,
          key: Database.getPrimaryKey(record),
          store: storeName,
          type: 'write',
          subType: 'delete',
          origin: origin
        };
        var beforeDeleteResult = record[Database.BeforeDelete] ? record[Database.BeforeDelete](detail) : null;
        if (beforeDeleteResult === false) {
          return;
        }
        var request = store.delete(record.id);
        record[PrimaryKey] = undefined;
        record[Database.AfterDelete] && record[Database.AfterDelete](detail);
        request.onerror = function (error) {
          detail.original = error;
          var deleteEvent = new CustomEvent('writeError', {
            detail: detail
          });
          _this5.dispatchEvent(deleteEvent);
          reject(error);
        };
        request.onsuccess = function (event) {
          detail.original = event;
          var writeEvent = new CustomEvent('write', {
            detail: detail
          });
          _this5.dispatchEvent(writeEvent);
          trans.commit && trans.commit();
          accept(writeEvent);
        };
      });
    }
  }, {
    key: "clear",
    value: function clear(storeName) {
      var _this6 = this;
      return new Promise(function (accept, reject) {
        var trans = _this6[Connection].transaction([storeName], 'readwrite');
        var store = trans.objectStore(storeName);
        var request = store.clear();
        var detail = {
          database: _this6[Name],
          store: storeName,
          type: 'write',
          subType: 'clear',
          origin: origin
        };
        request.onerror = function (error) {
          detail.original = error;
          var deleteEvent = new CustomEvent('writeError', {
            detail: detail
          });
          _this6.dispatchEvent(deleteEvent);
          reject(error);
        };
        request.onsuccess = function (event) {
          detail.original = event;
          var writeEvent = new CustomEvent('write', {
            detail: detail
          });
          _this6.dispatchEvent(writeEvent);
          trans.commit && trans.commit();
          accept(writeEvent);
        };
      });
    }
  }, {
    key: "listStores",
    value: function listStores() {
      return (0, _toConsumableArray2.default)(this[Connection].objectStoreNames);
    }
  }, {
    key: "listIndexes",
    value: function listIndexes(storeName) {
      var trans = this[Connection].transaction([storeName]);
      var store = trans.objectStore(storeName);
      return (0, _toConsumableArray2.default)(store.indexNames);
    }
  }, {
    key: Fetch,
    value: function value(type, index, direction, ranges, limit, offset, origin, map) {
      var _this7 = this;
      return function (callback) {
        return Promise.all(ranges.map(function (range) {
          return new Promise(function (accept, reject) {
            var request = index.openCursor(range, direction);
            var i = 0;
            var resultHandler = function resultHandler(event) {
              var cursor = event.target.result;
              if (!cursor) {
                return accept({
                  record: null,
                  result: null,
                  index: i
                });
              }
              var source = cursor.source;
              var storeName = source.objectStore ? source.objectStore.name : index.name;
              _this7[Bank][storeName] = _this7[Bank][storeName] || {};
              var bank = _this7[Bank][storeName];
              var pk = cursor.primaryKey;
              var value = type ? type.from(cursor.value) : cursor.value;
              var bindableValue = _Bindable.Bindable.makeBindable(value);
              var detail = {
                database: _this7[Name],
                key: Database.getPrimaryKey(bindableValue),
                record: value,
                store: index.name,
                type: 'read',
                subType: 'select',
                origin: origin
              };
              var beforeReadResult = value[Database.BeforeRead] ? value[Database.BeforeRead](detail) : null;
              if (offset > i++ || beforeReadResult === false) {
                return cursor.continue();
              }
              if (bank[pk]) {
                Object.assign(bank[pk], value);
              } else {
                value[PrimaryKey] = Symbol.for(pk);
                bank[pk] = value;
              }
              detail.record = value;
              bank[pk][Database.AfterRead] && bank[pk][Database.AfterRead](detail);
              var cancelable = true;
              var eventResult = _this7.dispatchEvent(new CustomEvent('read', {
                detail: detail,
                cancelable: cancelable
              }));
              if (eventResult) {
                var record = type ? type.from(bank[pk]) : bank[pk];
                record[PrimaryKey] = Symbol.for(pk);
                var mapped = map ? map(record) : record;
                var result = callback ? callback(mapped, i) : mapped;
                if (limit && i - offset >= limit) {
                  offset += limit;
                  return accept({
                    mapped: mapped,
                    result: result,
                    index: i
                  });
                }
              }
              cursor.continue();
            };
            request.addEventListener('success', resultHandler);
          });
        })).then(function (results) {
          if (results.length === 1) {
            return results[0];
          }
          return results;
        });
      };
    }
  }, {
    key: "setStoreMeta",
    value: function setStoreMeta(storeName, key, value) {
      localStorage.setItem("::::cvdb::".concat(storeName, "::").concat(key), JSON.stringify(value));
    }
  }, {
    key: "getStoreMeta",
    value: function getStoreMeta(storeName, key) {
      var notFound = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var source = localStorage.getItem("::::cvdb::".concat(storeName, "::").concat(key));
      var value = source !== null ? JSON.parse(source) : notFound;
      if (value === null) {
        return notFound;
      }
      return value;
    }
  }, {
    key: "createObjectStore",
    value: function createObjectStore(storeName, options) {
      var eventLog = this[Connection].createObjectStore(storeName, options);
      this.setStoreMeta(storeName, 'store', options);
      return eventLog;
    }
  }, {
    key: "deleteObjectStore",
    value: function deleteObjectStore(storeName) {
      return this[Connection].deleteObjectStore(storeName);
    }
  }, {
    key: "checkHighWaterMark",
    value: function checkHighWaterMark(storeName, record) {
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var currentMark = this.getStoreMeta(storeName, 'highWater', 0);
      return currentMark;
    }
  }, {
    key: "setHighWaterMark",
    value: function setHighWaterMark(storeName, record) {
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var subType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      var metadata = this[Metadata][storeName];
      var recordMark = record[metadata.highWater];
      var currentMark = this.getStoreMeta(storeName, 'highWater', 0);
      this.setStoreMeta(storeName, 'highWater', recordMark);
      this.dispatchEvent(new CustomEvent('highWaterMoved', {
        detail: {
          database: this[Name],
          record: record,
          store: storeName,
          type: 'highWaterMoved',
          subType: subType,
          origin: origin,
          oldValue: currentMark,
          value: recordMark
        }
      }));
    }
  }, {
    key: "checkLowWaterMark",
    value: function checkLowWaterMark(storeName, record) {
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var currentMark = this.getStoreMeta(storeName, 'lowWater', Infinity);
      return currentMark;
    }
  }, {
    key: "setLowWaterMark",
    value: function setLowWaterMark(storeName, record) {
      var origin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
      var subType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
      var metadata = this[Metadata][storeName];
      var recordMark = record[metadata.highWater];
      var currentMark = this.getStoreMeta(storeName, 'lowWater', null);
      this.setStoreMeta(storeName, 'lowWater', recordMark);
      this.dispatchEvent(new CustomEvent('lowWaterMoved', {
        detail: {
          database: this[Name],
          record: record,
          store: storeName,
          type: 'lowWaterMoved',
          subType: subType,
          origin: origin,
          oldValue: currentMark,
          value: recordMark
        }
      }));
    }
  }], [{
    key: "open",
    value: function open(dbName) {
      var _this8 = this;
      var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      if (this[Instances][dbName]) {
        return this[Instances][dbName];
      }
      return this[Instances][dbName] = new Promise(function (accept, reject) {
        var request = indexedDB.open(dbName, version);
        request.onerror = function (error) {
          Database.dispatchEvent(new CustomEvent('error', {
            detail: {
              database: _this8[Name],
              error: error,
              store: undefined,
              type: 'read',
              subType: 'select'
            }
          }));
          reject(error);
        };
        request.onsuccess = function (event) {
          var instance = new _this8(event.target.result);
          accept(instance);
        };
        request.onupgradeneeded = function (event) {
          var connection = event.target.result;
          connection.addEventListener('error', function (error) {
            return console.error(error);
          });
          var instance = new _this8(connection);
          for (var v = event.oldVersion + 1; v <= version; v += 1) {
            instance['_version_' + v](connection);
          }
        };
      });
    }
  }, {
    key: "getPrimaryKey",
    value: function getPrimaryKey(record) {
      return record[PrimaryKey] ? record[PrimaryKey] : null;
    }
  }, {
    key: "destroyDatabase",
    value: function destroyDatabase() {
      var _this9 = this;
      return new Promise(function (accept, reject) {
        var request = indexedDB.delete(dbName);
        request.onerror = function (error) {
          Database.dispatchEvent(new CustomEvent('error', {
            detail: {
              database: dbName,
              error: error,
              type: 'destroy'
            }
          }));
          reject(error);
        };
        request.onsuccess = function (event) {
          delete _this9[Instances][dbName];
          accept(dbName);
        };
      });
    }
  }]);
  return Database;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.Database = Database;
Object.defineProperty(Database, Instances, {
  value: []
});
Object.defineProperty(Database, 'BeforeDelete', {
  value: BeforeDelete
});
Object.defineProperty(Database, 'AfterDelete', {
  value: AfterDelete
});
Object.defineProperty(Database, 'BeforeWrite', {
  value: BeforeWrite
});
Object.defineProperty(Database, 'AfterWrite', {
  value: AfterWrite
});
Object.defineProperty(Database, 'BeforeInsert', {
  value: BeforeInsert
});
Object.defineProperty(Database, 'AfterInsert', {
  value: AfterInsert
});
Object.defineProperty(Database, 'BeforeUpdate', {
  value: BeforeUpdate
});
Object.defineProperty(Database, 'AfterUpdate', {
  value: AfterUpdate
});
Object.defineProperty(Database, 'BeforeRead', {
  value: BeforeRead
});
Object.defineProperty(Database, 'AfterRead', {
  value: AfterRead
});
Object.defineProperty(Database, 'PKSymbol', {
  value: PrimaryKey
});
try {
  Object.defineProperty(Database, Target, {
    value: new EventTarget()
  });
} catch (error) {
  Object.defineProperty(Database, Target, {
    value: document.createDocumentFragment()
  });
}
var _loop = function _loop() {
  var method = _arr[_i];
  Object.defineProperty(Database, method, {
    value: function value() {
      var _Database$Target;
      return (_Database$Target = Database[Target])[method].apply(_Database$Target, arguments);
    }
  });
};
for (var _i = 0, _arr = ['addEventListener', 'removeEventListener', 'dispatchEvent']; _i < _arr.length; _i++) {
  _loop();
}
});

;require.register("curvature/model/Model.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Cache = require("../base/Cache");
var _Bindable = require("../base/Bindable");
var _Database = require("./Database");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var Changed = Symbol('Changed');
var Deleted = Symbol('Deleted');
var Saved = Symbol('Saved');
var Keys = Symbol('Keys');
var Model = /*#__PURE__*/function () {
  function Model() {
    (0, _classCallCheck2.default)(this, Model);
    (0, _defineProperty2.default)(this, "id", void 0);
    (0, _defineProperty2.default)(this, "class", void 0);
    Object.defineProperty(this, Changed, {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, Deleted, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, Saved, {
      writable: true,
      value: false
    });
    Object.defineProperty(this, Keys, {
      writable: true,
      value: new Set()
    });
    return _Bindable.Bindable.make(this);
  }
  (0, _createClass2.default)(Model, [{
    key: "consume",
    value: function consume(skeleton) {
      var _this = this;
      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var keyProps = Model.keyProps;
      var setProp = function setProp(property, value) {
        if (value && (0, _typeof2.default)(value) === 'object' && value.constructor.keyProps) {
          var subKeyProps = value.constructor.keyProps;
          var propCacheKey = subKeyProps.map(function (prop) {
            return value[prop];
          }).join('::');
          var bucket = 'models-by-type-and-publicId';
          var propCached = _Cache.Cache.load(propCacheKey, false, bucket);
          if (propCached) {
            propCached.consume(value);
            value = propCached;
          }
        }
        if (!override && _this[Changed][property]) {
          return;
        }
        _this[property] = value;
      };
      if (_Database.Database.PKSymbol in skeleton) {
        setProp(_Database.Database.PKSymbol, skeleton[_Database.Database.PKSymbol]);
      }
      this[Keys] = new Set([].concat((0, _toConsumableArray2.default)(this[Keys]), (0, _toConsumableArray2.default)(Object.keys(this)), (0, _toConsumableArray2.default)(Object.keys(skeleton))));
      var _iterator = _createForOfIteratorHelper(this[Keys]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var property = _step.value;
          if (!override && this[Changed][property]) {
            continue;
          }
          if (keyProps.includes(property)) {
            continue;
          }
          if (property in skeleton) {
            setProp(property, skeleton[property]);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "changed",
    value: function changed() {
      this[Saved] = false;
    }
  }, {
    key: "markDeleted",
    value: function markDeleted() {
      for (var property in this[Changed]) {
        this[Changed][property] = false;
      }
      this[Deleted] = true;
      this[Saved] = false;
    }
  }, {
    key: "markStored",
    value: function markStored() {
      for (var property in this) {
        this[Changed][property] = false;
      }
      this[Deleted] = false;
      this[Saved] = true;
    }
  }, {
    key: "isSaved",
    value: function isSaved() {
      return this[Saved];
    }
  }], [{
    key: "keyProps",
    get: function get() {
      return ['id', 'class'];
    }
  }, {
    key: "from",
    value: function from(skeleton) {
      var isSaved = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var keyProps = this.keyProps;
      var cacheProps = keyProps.map(function (prop) {
        return skeleton[prop];
      });
      cacheProps.unshift(this.name);
      var cacheKey = cacheProps.join('::');
      var bucket = 'models-by-type-and-publicId';
      var cached = _Cache.Cache.load(cacheKey, false, bucket);
      var instance = cached ? cached : new this();
      var _iterator2 = _createForOfIteratorHelper(keyProps),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _ref, _instance$keyProp;
          var keyProp = _step2.value;
          instance[keyProp] = (_ref = (_instance$keyProp = instance[keyProp]) !== null && _instance$keyProp !== void 0 ? _instance$keyProp : skeleton[keyProp]) !== null && _ref !== void 0 ? _ref : null;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      instance.consume(skeleton);
      if (!cached) {
        _Cache.Cache.store(cacheKey, instance, 0, bucket);
        var changed = false;
        instance.bindTo(function (v, k, t, d) {
          if ((0, _typeof2.default)(k) === 'symbol') {
            return;
          }
          if (v === t[k]) {
            return;
          }
          instance[Changed][k] = changed;
          instance[Saved] = !!(changed ? false : instance[Saved]);
        });
        if (Object.keys(instance[Changed]).length === 0) {
          instance[Saved] = isSaved;
        }
        changed = true;
      }
      return instance;
    }
  }]);
  return Model;
}();
exports.Model = Model;
Object.defineProperty(Model, 'Changed', {
  value: Changed
});
Object.defineProperty(Model, 'Deleted', {
  value: Deleted
});
Object.defineProperty(Model, 'Saved', {
  value: Saved
});
});

require.register("curvature/model/SourceWorker.js", function(exports, require, module) {
// function Node(){};
// function IntersectionObserver(){};
// window = {};

// importScripts('/app.js');

// const Database = require('Database').Database;

// Database.addEventListener('write', event => postMessage(event.detail));
// Database.addEventListener('read',  event => postMessage(event.detail));

// Database.open('event-log', 1).then(database =>  {
// 	const eventSource = new EventSource('/events');

// 	eventSource.addEventListener('ServerEvent', event => {
// 		return database.insert('event-log', JSON.parse(event.data));
// 	});

// 	eventSource.addEventListener('error', error => {
// 		console.error(error);
// 	});
// });
"use strict";
});

require.register("curvature/model/Store.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Store = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var Store = /*#__PURE__*/function () {
  function Store() {
    (0, _classCallCheck2.default)(this, Store);
    (0, _defineProperty2.default)(this, "storeName", 'test-store');
  }
  (0, _createClass2.default)(Store, [{
    key: "select",
    value: function select(_ref) {
      var index = _ref.index,
        _ref$range = _ref.range,
        range = _ref$range === void 0 ? null : _ref$range,
        _ref$ranges = _ref.ranges,
        ranges = _ref$ranges === void 0 ? [] : _ref$ranges,
        _ref$direction = _ref.direction,
        direction = _ref$direction === void 0 ? 'next' : _ref$direction,
        _ref$limit = _ref.limit,
        limit = _ref$limit === void 0 ? 0 : _ref$limit,
        _ref$offset = _ref.offset,
        offset = _ref$offset === void 0 ? 0 : _ref$offset,
        _ref$type = _ref.type,
        type = _ref$type === void 0 ? false : _ref$type,
        _ref$origin = _ref.origin,
        origin = _ref$origin === void 0 ? undefined : _ref$origin,
        _ref$map = _ref.map,
        map = _ref$map === void 0 ? undefined : _ref$map;
    }
  }, {
    key: "insert",
    value: function insert(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    }
  }, {
    key: "update",
    value: function update(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    }
  }, {
    key: "delete",
    value: function _delete(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    }
  }, {
    key: "getMeta",
    value: function getMeta(key) {
      var notFound = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    }
  }, {
    key: "setMeta",
    value: function setMeta(key, value) {}
  }, {
    key: "listIndexes",
    value: function listIndexes() {}
  }, {
    key: "clear",
    value: function clear() {}
  }], [{
    key: "setHighWaterMark",
    value: function setHighWaterMark(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var subType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    }
  }, {
    key: "setLowWaterMark",
    value: function setLowWaterMark(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var subType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    }
  }, {
    key: "checkHighWaterMark",
    value: function checkHighWaterMark(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    }
  }, {
    key: "checkLowWaterMark",
    value: function checkLowWaterMark(record) {
      var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
    }
  }, {
    key: "create",
    value: function create(storeName, options) {}
  }, {
    key: "delete",
    value: function _delete(storeName) {}
  }]);
  return Store;
}();
exports.Store = Store;
});

;require.register("curvature/net/Elicit.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Elicit = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Mixin = require("curvature/base/Mixin");
var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");
var _PromiseMixin = require("curvature/mixin/PromiseMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var IterateDownload = Symbol('IterateDownload');
var Retry = Symbol('Retry');
var HandleFirstByte = Symbol('HandleFirstByte');
var HandleProgress = Symbol('HandleProgress');
var HandleComplete = Symbol('HandleComplete');
var HandleHeaders = Symbol('HandleHeaders');
var HandleClose = Symbol('HandleClose');
var HandleError = Symbol('HandleError');
var HandleOpen = Symbol('HandleOpen');
var HandleFail = Symbol('HandleFail');
var LastChunkSize = Symbol('LastChunkSize');
var LastChunkTime = Symbol('LastChunkTime');
var Options = Symbol('Options');
var Fetch = Symbol('Fetch');
var Type = Symbol('Type');
var Url = Symbol('Url');
var RetriesLeft = Symbol('RetriesLeft');
var TimeoutLeft = Symbol('TimeoutLeft');
var Timeout = Symbol('Timeout');
var Timer = Symbol('Timer');
var Canceller = Symbol('Canecller');
var Cancelled = Symbol('Caneclled');
var Paused = Symbol('Paused');
var Received = Symbol('Received');
var Length = Symbol('Length');
var Opened = Symbol('Opened');
var Closed = Symbol('Closed');
var Start = Symbol('Start');
var First = Symbol('First');
var End = Symbol('End');
var Elicit = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(Elicit, _Mixin$with);
  var _super = _createSuper(Elicit);
  function Elicit(url) {
    var _this2;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, Elicit);
    _this2 = _super.call(this);
    _this2[RetriesLeft] = options.retries || 5;
    _this2[Timeout] = options.timeout || 4500;
    _this2[TimeoutLeft] = options.maxTimeout || _this2[Timeout] * _this2[RetriesLeft];
    _this2[LastChunkTime] = 0;
    _this2[LastChunkSize] = 0;
    _this2[Cancelled] = false;
    _this2[Received] = 0;
    _this2[Paused] = false;
    _this2[Closed] = 0;
    _this2[Options] = Object.assign({}, options);
    _this2[Url] = url;
    if (!options.defer) {
      _this2.open();
    }
    return _this2;
  }
  (0, _createClass2.default)(Elicit, [{
    key: "open",
    value: function open() {
      var _this3 = this;
      if (this[Opened] && !this[Closed]) {
        return;
      }
      if (!this[Start]) {
        this[Start] = Date.now();
      }
      this[Canceller] = new AbortController();
      this[Options].signal = this[Canceller].signal;
      this[Opened] = Date.now();
      this[Closed] = 0;
      this[First] = 0;
      this[Fetch] = fetch(this[Url], this[Options]).then(function (response) {
        return _this3[HandleOpen](response);
      }).catch(function (error) {
        return _this3[HandleError](error);
      });
      var onTimeout = function onTimeout() {
        if (!_this3[First]) {
          _this3[Canceller].abort();
          _this3[HandleClose]();
          _this3[TimeoutLeft] = Math.max(0, _this3[TimeoutLeft] - _this3[Timeout]);
          if (!_this3[TimeoutLeft]) {
            return;
          }
          _this3[HandleFail](new Error('Timed out.'));
        }
      };
      this[Timer] = setTimeout(onTimeout, this[Timeout]);
    }
  }, {
    key: "headers",
    value: function headers() {
      return this[Fetch].then(function (_ref) {
        var response = _ref.response,
          stream = _ref.stream;
        return response.headers;
      });
    }
  }, {
    key: "json",
    value: function json() {
      var _this4 = this;
      return this[Fetch].then(function (_ref2) {
        var response = _ref2.response,
          stream = _ref2.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this4.type
          }
        });
        return wrapped.json();
      });
    }
  }, {
    key: "text",
    value: function text() {
      var _this5 = this;
      return this[Fetch].then(function (_ref3) {
        var response = _ref3.response,
          stream = _ref3.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this5.type
          }
        });
        return wrapped.text();
      });
    }
  }, {
    key: "css",
    value: function css() {
      return this.text().then(function (css) {
        var sheet = new CSSStyleSheet();
        sheet.replace(css);
        return sheet;
      });
    }
  }, {
    key: "blob",
    value: function blob() {
      var _this6 = this;
      return this[Fetch].then(function (_ref4) {
        var response = _ref4.response,
          stream = _ref4.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this6.type
          }
        });
        return wrapped.blob();
      });
    }
  }, {
    key: "objectUrl",
    value: function objectUrl() {
      return this.blob().then(function (blob) {
        return URL.createObjectURL(blob);
      });
    }
  }, {
    key: "dataUri",
    value: function dataUri() {
      return this.blob().then(function (blob) {
        return new Promise(function (accept, reject) {
          var reader = new FileReader();
          reader.onload = function (event) {
            return accept(reader.result);
          };
          reader.onerror = function (event) {
            return reject(reader.error);
          };
          reader.onabort = function (event) {
            return reject(new Error("Read aborted"));
          };
          reader.readAsDataURL(blob);
        });
      });
    }
  }, {
    key: "buffer",
    value: function buffer() {
      return this.blob().then(function (blob) {
        return blob.arrayBuffer();
      });
    }
  }, {
    key: "bytes",
    value: function bytes() {
      return this.buffer().then(function (buffer) {
        return new Uint8Array(buffer);
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (!this.emitCancelEvent()) {
        return;
      }
      this[Canceller].abort();
      this[Cancelled] = true;
      this.emitCancelledEvent();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this[End] || this[Paused] || this[Closed]) {
        return;
      }
      if (!this.emitPauseEvent()) {
        return;
      }
      this[Paused] = true;
      this.emitPausedEvent();
    }
  }, {
    key: "unpause",
    value: function unpause() {
      if (this[End] || !this[Paused]) {
        return;
      }
      if (!this.emitUnpauseEvent()) {
        return;
      }
      this[Paused] = false;
      this.emitUnpausedEvent();
    }
  }, {
    key: "done",
    get: function get() {
      return !!this[End];
    }
  }, {
    key: "type",
    get: function get() {
      return this[Type];
    }
  }, {
    key: "totalTime",
    get: function get() {
      if (!this[End]) {
        return Date.now() - this[Start];
      }
      return this[End] - this[Start];
    }
  }, {
    key: "waitTime",
    get: function get() {
      if (!this[First]) {
        return Date.now() - this[Opened];
      }
      return this[First] - this[Opened];
    }
  }, {
    key: "loadTime",
    get: function get() {
      if (!this[Opened]) {
        return 0;
      }
      if (!this[Closed]) {
        return Date.now() - this[First];
      }
      return this[Closed] - this[First];
    }
  }, {
    key: "speed",
    get: function get() {
      if (!this[Opened]) {
        return 0;
      }
      var time;
      if (this[End]) {
        time = this[End] - this[LastChunkTime];
      } else {
        time = Date.now() - this[LastChunkTime];
      }
      if (!time) {
        time = 0.01;
      }
      return this[LastChunkSize] / time;
    }
  }, {
    key: "received",
    get: function get() {
      return this[Received];
    }
  }, {
    key: "length",
    get: function get() {
      return this[Length];
    }
  }, {
    key: "isPaused",
    get: function get() {
      return this[Paused];
    }
  }, {
    key: IterateDownload,
    value: function value(reader, controller, length) {
      var _this7 = this;
      this[HandleProgress](length, 0, null);
      var lastTime = Date.now();
      var lastSize = 1;
      var handleChunk = function handleChunk(_ref5) {
        var done = _ref5.done,
          value = _ref5.value;
        if (done) {
          controller.close();
          return _this7[HandleComplete]();
        }
        controller.enqueue(value);
        _this7[Received] += value.length;
        if (!_this7[First]) {
          _this7[HandleFirstByte](value);
        }
        _this7[HandleProgress](length, _this7[Received]);
        _this7[LastChunkTime] = lastTime;
        _this7[LastChunkSize] = lastSize;
        lastTime = Date.now();
        lastSize = value.length;
        return iterate();
      };
      var iterate = function iterate() {
        if (_this7[Cancelled]) {
          return reader.cancel();
        }
        if (_this7[Paused]) {
          return new Promise(function (accept) {
            setTimeout(function () {
              return accept(iterate());
            }, 100);
          });
        }
        return reader.read().then(function (chunk) {
          return handleChunk(chunk);
        }).catch(function (error) {
          return _this7[HandleError](error);
        });
      };
      return iterate();
    }
  }, {
    key: Retry,
    value: function value() {
      if (!this.emitRetryEvent()) {
        return;
      }
      if (this[RetriesLeft] <= 0) {
        return;
      }
      this[Canceller].abort();
      this[HandleClose]();
      this[Received] = 0;
      this[RetriesLeft]--;
      return this.open();
    }
  }, {
    key: HandleOpen,
    value: function value(response) {
      var reader = response.body.getReader();
      var length = this[Length] || Number(response.headers.get('Content-Length'));
      var type = this[type] || response.headers.get('Content-Type');
      this[Length] = length;
      this[Type] = type;
      this[HandleHeaders](response.headers);
      var _this = this;
      var stream = new ReadableStream({
        start: function start(controller) {
          _this[IterateDownload](reader, controller, length);
        }
      });
      return {
        response: response,
        stream: stream
      };
    }
  }, {
    key: HandleClose,
    value: function value() {
      this[Closed] = Date.now();
      this.emitCloseEvent();
    }
  }, {
    key: HandleHeaders,
    value: function value(headers) {
      this.emitHeadersEvent(headers);
    }
  }, {
    key: HandleProgress,
    value: function value(length, received, _value) {
      this.emitProgressEvent(length, received, _value);
    }
  }, {
    key: HandleComplete,
    value: function value() {
      this[End] = Date.now();
      this[HandleClose]();
      this.emitCompleteEvent();
      this[_PromiseMixin.PromiseMixin.Accept]();
    }
  }, {
    key: HandleError,
    value: function value(error) {
      console.warn(error);
      if (!this.emitErrorEvent(error)) {
        return this[Retry]();
      }
      return this[HandleFail](error);
    }
  }, {
    key: HandleFail,
    value: function value(error) {
      this[End] = Date.now();
      this[HandleClose]();
      this.emitFailEvent(error);
      return this[_PromiseMixin.PromiseMixin.Reject](error);
    }
  }, {
    key: HandleFirstByte,
    value: function value(received) {
      clearInterval(this[Timer]);
      this[First] = Date.now();
      this.emitFirstByteEvent(received);
    }
  }, {
    key: "emitProgressEvent",
    value: function emitProgressEvent(length, received, value) {
      var done = length ? received / length : 0;
      var totalTime = this.totalTime;
      var loadTime = this.loadTime;
      var waitTime = this.waitTime;
      var speed = this.speed;
      return this.dispatchEvent(new CustomEvent('progress', {
        detail: {
          length: length,
          received: received,
          done: done,
          speed: speed,
          loadTime: loadTime,
          waitTime: waitTime,
          totalTime: totalTime,
          value: value
        }
      }));
    }
  }, {
    key: "emitOpenEvent",
    value: function emitOpenEvent() {
      return this.dispatchEvent(new CustomEvent('open'));
    }
  }, {
    key: "emitCloseEvent",
    value: function emitCloseEvent() {
      return this.dispatchEvent(new CustomEvent('close'));
    }
  }, {
    key: "emitFirstByteEvent",
    value: function emitFirstByteEvent(received) {
      return this.dispatchEvent(new CustomEvent('firstByte', {
        detail: {
          received: received
        }
      }));
    }
  }, {
    key: "emitHeadersEvent",
    value: function emitHeadersEvent(headers) {
      return this.dispatchEvent(new CustomEvent('headers', {
        detail: {
          headers: headers
        }
      }));
    }
  }, {
    key: "emitCompleteEvent",
    value: function emitCompleteEvent() {
      return this.dispatchEvent(new CustomEvent('complete'));
    }
  }, {
    key: "emitErrorEvent",
    value: function emitErrorEvent() {
      return this.dispatchEvent(new CustomEvent('error', {
        cancelable: this[RetriesLeft] > 0
      }));
    }
  }, {
    key: "emitRetryEvent",
    value: function emitRetryEvent() {
      return this.dispatchEvent(new CustomEvent('retry', {
        cancelable: true
      }));
    }
  }, {
    key: "emitFailEvent",
    value: function emitFailEvent() {
      return this.dispatchEvent(new CustomEvent('fail'));
    }
  }, {
    key: "emitPauseEvent",
    value: function emitPauseEvent() {
      return this.dispatchEvent(new CustomEvent('pause', {
        cancelable: true
      }));
    }
  }, {
    key: "emitPausedEvent",
    value: function emitPausedEvent() {
      this.dispatchEvent(new CustomEvent('paused'));
    }
  }, {
    key: "emitUnpauseEvent",
    value: function emitUnpauseEvent() {
      return this.dispatchEvent(new CustomEvent('unpause', {
        cancelable: true
      }));
    }
  }, {
    key: "emitUnpausedEvent",
    value: function emitUnpausedEvent() {
      this.dispatchEvent(new CustomEvent('unpaused'));
    }
  }, {
    key: "emitCancelEvent",
    value: function emitCancelEvent() {
      return this.dispatchEvent(new CustomEvent('cancel', {
        cancelable: true
      }));
    }
  }, {
    key: "emitCancelledEvent",
    value: function emitCancelledEvent() {
      return this.dispatchEvent(new CustomEvent('cancelled'));
    }
  }]);
  return Elicit;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin, _PromiseMixin.PromiseMixin)); // elicit.addEventListener('open', event => console.log(event));
// elicit.addEventListener('close', event => console.log(event));
// elicit.addEventListener('firstByte', event => console.log(event));
// elicit.addEventListener('headers', event => console.log(event));
// elicit.addEventListener('complete', event => console.log(event));
// elicit.addEventListener('error', event => console.log(event));
// elicit.addEventListener('fail', event => console.log(event));
// elicit.addEventListener('pause', event => console.log(event));
// elicit.addEventListener('paused', event => console.log(event));
// elicit.addEventListener('unpause', event => console.log(event));
// elicit.addEventListener('unpaused', event => console.log(event));
// elicit.addEventListener('cancelled', event => console.log(event));
// elicit.addEventListener('cancel', event => console.log(event));
exports.Elicit = Elicit;
});

require.register("curvature/net/RtcClient.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RtcClient = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Mixin = require("curvature/base/Mixin");
var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var RtcClient = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(RtcClient, _Mixin$with);
  var _super = _createSuper(RtcClient);
  function RtcClient(rtcConfig) {
    var _this;
    (0, _classCallCheck2.default)(this, RtcClient);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "candidateTimeout", 500);
    _this.peerClient = new RTCPeerConnection(rtcConfig);
    _this.peerClientChannel = _this.peerClient.createDataChannel("chat");
    _this.peerClientChannel.addEventListener('open', function (event) {
      var openEvent = new CustomEvent('open', {
        detail: event.data
      });
      openEvent.originalEvent = event;
      _this.dispatchEvent(openEvent);
      _this.connected = true;
    });
    _this.peerClientChannel.addEventListener('close', function (event) {
      var closeEvent = new CustomEvent('close', {
        detail: event.data
      });
      closeEvent.originalEvent = event;
      _this.dispatchEvent(closeEvent);
      _this.connected = false;
    });
    _this.peerClientChannel.addEventListener('message', function (event) {
      var messageEvent = new CustomEvent('message', {
        detail: event.data
      });
      messageEvent.originalEvent = event;
      _this.dispatchEvent(messageEvent);
    });
    return _this;
  }
  (0, _createClass2.default)(RtcClient, [{
    key: "send",
    value: function send(input) {
      this.peerClientChannel && this.peerClientChannel.send(input);
    }
  }, {
    key: "close",
    value: function close() {
      this.peerClientChannel && this.peerClientChannel.close();
    }
  }, {
    key: "offer",
    value: function offer() {
      var _this2 = this;
      this.peerClient.createOffer().then(function (offer) {
        _this2.peerClient.setLocalDescription(offer);
      });
      var candidates = new Set();
      return new Promise(function (accept) {
        var timeout = null;
        _this2.peerClient.addEventListener('icecandidate', function (event) {
          if (!event.candidate) {
            return;
          } else {
            candidates.add(event.candidate);
          }
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(function () {
            return accept(_this2.peerClient.localDescription);
          }, _this2.candidateTimeout);
        });
      });
    }
  }, {
    key: "accept",
    value: function accept(answer) {
      var session = new RTCSessionDescription(answer);
      this.peerClient.setRemoteDescription(session);
    }
  }]);
  return RtcClient;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.RtcClient = RtcClient;
});

;require.register("curvature/net/RtcServer.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RtcServer = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _Mixin = require("curvature/base/Mixin");
var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var RtcServer = /*#__PURE__*/function (_Mixin$with) {
  (0, _inherits2.default)(RtcServer, _Mixin$with);
  var _super = _createSuper(RtcServer);
  function RtcServer(rtcConfig) {
    var _this;
    (0, _classCallCheck2.default)(this, RtcServer);
    _this = _super.call(this);
    (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this), "candidateTimeout", 500);
    _this.peerServer = new RTCPeerConnection(rtcConfig);
    _this.peerServer.addEventListener('datachannel', function (event) {
      _this.peerServerChannel = event.channel;
      _this.peerServerChannel.addEventListener('open', function (event) {
        var openEvent = new CustomEvent('open', {
          detail: event.data
        });
        openEvent.originalEvent = event;
        _this.dispatchEvent(openEvent);
        _this.connected = true;
      });
      _this.peerServerChannel.addEventListener('close', function (event) {
        var closeEvent = new CustomEvent('close', {
          detail: event.data
        });
        closeEvent.originalEvent = event;
        _this.dispatchEvent(closeEvent);
        _this.connected = false;
      });
      _this.peerServerChannel.addEventListener('message', function (event) {
        var messageEvent = new CustomEvent('message', {
          detail: event.data
        });
        messageEvent.originalEvent = event;
        _this.dispatchEvent(messageEvent);
      });
    });
    return _this;
  }
  (0, _createClass2.default)(RtcServer, [{
    key: "send",
    value: function send(input) {
      this.peerServerChannel && this.peerServerChannel.send(input);
    }
  }, {
    key: "close",
    value: function close() {
      this.peerServerChannel && this.peerServerChannel.close();
    }
  }, {
    key: "answer",
    value: function answer(offer) {
      var _this2 = this;
      return new Promise(function (accept) {
        _this2.peerServer.setRemoteDescription(offer);
        _this2.peerServer.createAnswer(function (answer) {
          return _this2.peerServer.setLocalDescription(answer);
        }, function (error) {
          return console.error(error);
        });
        var candidates = new Set();
        var timeout = null;
        _this2.peerServer.addEventListener('icecandidate', function (event) {
          if (!event.candidate) {
            return;
          } else {
            candidates.add(event.candidate);
          }
          if (timeout) {
            clearTimeout(timeout);
          }
          timeout = setTimeout(function () {
            return accept(_this2.peerServer.localDescription);
          }, _this2.candidateTimeout);
        });
      });
    }
  }]);
  return RtcServer;
}(_Mixin.Mixin.with(_EventTargetMixin.EventTargetMixin));
exports.RtcServer = RtcServer;
});

;require.register("curvature/service/CloudService.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CloudService = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Router = require("curvature/base/Router");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var CloudService = /*#__PURE__*/function () {
  function CloudService() {
    (0, _classCallCheck2.default)(this, CloudService);
  }
  (0, _createClass2.default)(CloudService, null, [{
    key: "handleFetch",
    value: function handleFetch(event) {
      var url = new URL(event.request.url);
      var path = url.pathname + url.search;
      var results = [];
      var _iterator = _createForOfIteratorHelper(this.routeHandlers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var routes = _step.value;
          return _Router.Router.match(path, {
            routes: routes
          }).then(function (result) {
            if ((0, _typeof2.default)(result) !== 'object' || !(result instanceof Response)) {
              result = new Response(result);
            }
            return result;
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }]);
  return CloudService;
}();
exports.CloudService = CloudService;
Object.defineProperty(CloudService, 'routeHandlers', {
  value: new Set()
});
globalThis.addEventListener('fetch', function (event) {
  event.respondWith(CloudService.handleFetch(event));
});
});

require.register("curvature/service/EventPipe.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPipe = void 0;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _readOnlyError2 = _interopRequireDefault(require("@babel/runtime/helpers/readOnlyError"));
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var EventPipe = function EventPipe(events) {
  var headers = new Headers();
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Connection', 'keep-alive');
  var _TransformStream = new TransformStream(),
    readable = _TransformStream.readable,
    writable = _TransformStream.writable;
  var writer = writable.getWriter();
  var encoder = new TextEncoder();
  var eventSenders = [];
  var _iterator = _createForOfIteratorHelper(events),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var getEvent = _step.value;
      if (!(getEvent instanceof Promise)) {
        Promise.resolve(getEvent), (0, _readOnlyError2.default)("getEvent");
      }
      getEvent.then(function (event) {
        var _event$type, _event$id;
        if (!event || (0, _typeof2.default)(event) !== 'object') {
          event = {
            data: event
          };
        }
        writer.write(encoder.encode("event:  ".concat((_event$type = event.type) !== null && _event$type !== void 0 ? _event$type : 'ServerEvent', "\n") + "data: ".concat(JSON.stringify(event.data), "\n") + "id:   ".concat((_event$id = event.id) !== null && _event$id !== void 0 ? _event$id : Date.now(), "\n\n")));
      });
      eventSenders.push(getEvent);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  Promise.all(eventSenders).then(function () {
    return writer.close();
  });
  return new Response(readable, {
    status: '200',
    statusText: 'OK',
    headers: headers
  });
};
exports.EventPipe = EventPipe;
});

require.register("curvature/service/Service.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _Router = require("../base/Router");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var Service = /*#__PURE__*/function () {
  function Service() {
    (0, _classCallCheck2.default)(this, Service);
  }
  (0, _createClass2.default)(Service, null, [{
    key: "register",
    value: function register(script) {
      var _this = this;
      var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
      if (!('serviceWorker' in navigator)) {
        return Promise.reject('Service Workers not supported.');
      }

      // navigator.serviceWorker.startMessages();

      var serviceWorker = navigator.serviceWorker;
      serviceWorker.register(script, {
        scope: scope
      });
      serviceWorker.ready.then(function (registration) {
        var worker = registration.active;
        if (!worker) {
          return;
        }
        _this.workers.set(worker.scriptURL, worker);
        serviceWorker.addEventListener('message', function (event) {
          return _this.handleResponse(event);
        });
      });
      return serviceWorker.ready;
    }
  }, {
    key: "request",
    value: function request(_ref) {
      var _this2 = this;
      var command = _ref.command,
        args = _ref.args,
        echo = _ref.echo,
        notify = _ref.notify,
        _ref$to = _ref.to,
        to = _ref$to === void 0 ? null : _ref$to,
        _ref$broadcast = _ref.broadcast,
        broadcast = _ref$broadcast === void 0 ? false : _ref$broadcast;
      var correlationId = Number(1 / Math.random()).toString(36);
      var getResponse = new Promise(function (accept) {
        _this2.incomplete.set(correlationId, accept);
      });
      var _iterator = _createForOfIteratorHelper(this.workers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = (0, _slicedToArray2.default)(_step.value, 2),
            scriptURL = _step$value[0],
            worker = _step$value[1];
          if (worker.state === 'redundant') {
            return Promise.reject('Worker has been updated, connection lost. Please refresh the page.');
          }
          worker.postMessage({
            correlationId: correlationId,
            broadcast: broadcast,
            command: command,
            notify: notify,
            args: args,
            echo: echo,
            to: to
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return getResponse;
    }
  }, {
    key: "broadcast",
    value: function broadcast(_ref2) {
      var command = _ref2.command,
        args = _ref2.args,
        echo = _ref2.echo,
        notify = _ref2.notify;
      this.request({
        command: command,
        args: args,
        echo: echo,
        notify: notify,
        broadcast: true
      });
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(event) {
      var _this3 = this;
      event.target.ready.then(function (registration) {
        var worker = registration.active;
        _this3.workers.set(worker.scriptURL, worker);
      });
      var packet = event.data;
      if (!packet.to && !packet.correlationId) {
        return;
      }
      if (!this.incomplete.has(packet.correlationId)) {
        if (packet.broadcast) {
          this.handleBroadcast(event);
        } else if (packet.to) {
          this.handleMessage(event);
        }
        return;
      }
      var getResponse = this.incomplete.get(packet.correlationId);
      this.incomplete.delete(packet.correlationId);
      getResponse(packet.result);
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(event) {
      var _this4 = this;
      if (event.origin !== globalThis.origin) {
        return;
      }
      var packet = event.data;
      var getResponse = Promise.resolve('Unexpected request.');
      if (packet.echo) {
        getResponse = Promise.resolve(packet.echo);
      } else if (packet.notify) {
        var args = packet.args || [];
        getResponse = globalThis.registration.getNotifications().then(function (notifyList) {
          var _globalThis$registrat;
          notifyList.forEach(function (notification) {
            return _this4.notifications.set(notification.tag, notification);
          });
          return (_globalThis$registrat = globalThis.registration).showNotification.apply(_globalThis$registrat, (0, _toConsumableArray2.default)(args));
        }).then(function () {
          return globalThis.registration.getNotifications();
        }).then(function (notifyList) {
          var tag = event.data.args && event.data.args[1] && event.data.args[1].tag;
          var notifyClient = new Promise(function (accept) {
            var notifiers;
            if (_this4.notifyClients.has(tag)) {
              notifiers = _this4.notifyClients.get(tag);
            } else {
              notifiers = new Map();
              _this4.notifyClients.set(tag, notifiers);
            }
            notifiers.set(event.source, accept);
          });
          return notifyClient;
        });
      } else if (packet.command) {
        var command = packet.command;
        var _args = packet.args || [];
        var _iterator2 = _createForOfIteratorHelper(this.serviceHandlers),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var handler = _step2.value;
            if (typeof handler[command] === 'function') {
              getResponse = handler[command].apply(handler, (0, _toConsumableArray2.default)(_args));
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      if ((0, _typeof2.default)(getResponse) !== Promise) {
        getResponse = Promise.resolve(getResponse);
      }
      if (packet.broadcast) {
        var options = {
          type: 'window',
          includeUncontrolled: true
        };
        var source = event.source.id;
        globalThis.clients.matchAll(options).then(function (clientList) {
          clientList.forEach(function (client) {
            getResponse.then(function (response) {
              return client.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
                result: response,
                source: source
              }));
            });
          });
        });
      } else if (packet.to) {
        var _source = event.source.id;
        globalThis.clients.get(packet.to).then(function (client) {
          getResponse.then(function (response) {
            client.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
              result: response,
              source: _source
            }));
          });
        });
      } else {
        getResponse.then(function (response) {
          return event.source.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
            result: response
          }));
        });
      }
    }
  }, {
    key: "handleInstall",
    value: function handleInstall(event) {
      globalThis.skipWaiting();
      var _iterator3 = _createForOfIteratorHelper(this.pageHandlers),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var handler = _step3.value;
          if (typeof handler.handleInstall === 'function') {
            handler.handleInstall(event);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "handleActivate",
    value: function handleActivate(event) {
      var _iterator4 = _createForOfIteratorHelper(this.pageHandlers),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var handler = _step4.value;
          if (typeof handler.handleActivate === 'function') {
            handler.handleActivate(event);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "handleError",
    value: function handleError(event) {
      console.error(event);
      var _iterator5 = _createForOfIteratorHelper(this.pageHandlers),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var handler = _step5.value;
          if (typeof handler.handleError === 'function') {
            handler.handleError(event);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "handlePush",
    value: function handlePush(event) {
      // console.log('push', event);
    }
  }, {
    key: "handleSync",
    value: function handleSync(event) {
      // console.log('sync', event);
    }
  }, {
    key: "handlePeriodicSync",
    value: function handlePeriodicSync(event) {
      // console.log('periodic sync', event);
    }
  }, {
    key: "handleFetch",
    value: function handleFetch(event) {
      var url = new URL(event.request.url);
      var path = url.pathname + url.search;
      var _iterator6 = _createForOfIteratorHelper(this.routeHandlers),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var routes = _step6.value;
          return _Router.Router.match(path, {
            routes: routes
          }, {
            event: event
          }).then(function (result) {
            if (result === undefined) {
              return;
            }
            if ((0, _typeof2.default)(result) !== 'object' || !(result instanceof Response)) {
              result = new Response(result);
            }
            return result;
          });
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "handleBroadcast",
    value: function handleBroadcast(event) {
      var _iterator7 = _createForOfIteratorHelper(this.pageHandlers),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var handler = _step7.value;
          if (typeof handler.handleBroadcast === 'function') {
            handler.handleBroadcast(event);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(event) {
      var _iterator8 = _createForOfIteratorHelper(this.pageHandlers),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var handler = _step8.value;
          if (typeof handler.handleMessage === 'function') {
            handler.handleMessage(event);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "notify",
    value: function notify(title) {
      var _this5 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      options.tag = options.tag || ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
      return new Promise(function (accept, reject) {
        Notification.requestPermission(function (result) {
          accept(result);
        });
      }).then(function (result) {
        return _this5.request({
          notify: true,
          args: [title, options],
          broadcast: broadcast
        });
      });
    }
  }, {
    key: "handleNotifyClicked",
    value: function handleNotifyClicked(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        var focusables = [];
        notifiers.forEach(function (notifier, client) {
          notifier({
            action: event.action,
            data: event.notification.data,
            click: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
          focusables.push(client);
        });
        while (focusables.length) {
          var client = focusables.pop();
          if (client.focus()) {
            break;
          }
        }
        this.notifyClients.delete(event.notification.tag);
      }
      var _iterator9 = _createForOfIteratorHelper(this.pageHandlers),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var handler = _step9.value;
          if (typeof handler.handleNotifyClicked === 'function') {
            handler.handleNotifyClicked(event);
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      event.notification.close();
    }
  }, {
    key: "handleNotifyClosed",
    value: function handleNotifyClosed(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        notifiers.forEach(function (notifier) {
          return notifier({
            action: undefined,
            data: event.notification.data,
            close: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
        });
      }
      if (this.notifyClients.delete(event.notification.tag)) {
        var _iterator10 = _createForOfIteratorHelper(this.pageHandlers),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var handler = _step10.value;
            if (typeof handler.handleNotifyDismissed === 'function') {
              handler.handleNotifyDismissed(event);
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
      var _iterator11 = _createForOfIteratorHelper(this.pageHandlers),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var _handler = _step11.value;
          if (typeof _handler.handleNotifyClosed === 'function') {
            _handler.handleNotifyClosed(event);
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    }
  }]);
  return Service;
}();
exports.Service = Service;
Object.defineProperty(Service, 'serviceHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'routeHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'pageHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'notifications', {
  value: new Map()
});
Object.defineProperty(Service, 'notifyClients', {
  value: new Map()
});
Object.defineProperty(Service, 'incomplete', {
  value: new Map()
});
Object.defineProperty(Service, 'workers', {
  value: new Map()
});
if (!globalThis.document) {
  globalThis.addEventListener('install', function (event) {
    return Service.handleInstall(event);
  });
  globalThis.addEventListener('activate', function (event) {
    return Service.handleActivate(event);
  });
  globalThis.addEventListener('error', function (event) {
    return Service.handleActivate(event);
  });
  globalThis.addEventListener('message', function (event) {
    return Service.handleRequest(event);
  });
  globalThis.addEventListener('fetch', function (event) {
    event.waitUntil(new Promise(function (accept) {
      Service.handleFetch(event).then(function (result) {
        if (result) {
          event.respondWith(result);
        }
        accept();
      });
    }));
  });
  globalThis.addEventListener('push', function (event) {
    return Service.handlePush(event);
  });
  globalThis.addEventListener('notificationclose', function (event) {
    return Service.handleNotifyClosed(event);
  });
  globalThis.addEventListener('notificationclick', function (event) {
    return Service.handleNotifyClicked(event);
  });
  globalThis.addEventListener('sync', function (event) {
    return Service.handleSync(event);
  });
  globalThis.addEventListener('periodicsync', function (event) {
    return Service.handlePeriodicSync(event);
  });
}
});

;require.register("curvature/strings/Parser.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
// EXTREMELY ALPHA (not the good kind)
var INSERT = 1;
var ENTER = 2;
var LEAVE = 3;
var HOME = 4;
var Chunk = /*#__PURE__*/(0, _createClass2.default)(function Chunk() {
  (0, _classCallCheck2.default)(this, Chunk);
  this.depth = 0;
  this.match = null;
  this.type = 'normal';
  this.list = [];
});
var Parser = /*#__PURE__*/function () {
  function Parser(tokens, modes) {
    (0, _classCallCheck2.default)(this, Parser);
    this.index = 0;
    this.mode = 'normal';
    this.stack = [];
    this.tokens = tokens || {};
    this.modes = modes || {};
  }
  (0, _createClass2.default)(Parser, [{
    key: "parse",
    value: function parse(source) {
      if (!(this.mode in this.modes)) {
        throw new Error("Mode ".concat(this.mode, " does not exist on parser."), this);
      }
      var chunk = new Chunk();
      var mode = this.modes[this.mode];
      chunk.type = this.mode;
      while (this.index < source.length) {
        var matched = false;
        for (var tokenName in mode) {
          var token = this.tokens[tokenName];
          var search = token.exec(source.substr(this.index));
          if (!search || search.index > 0) {
            continue;
          }
          if (!mode[tokenName]) {
            throw new Error("Invalid token type \"".concat(tokenName, "\" found in mode \"").concat(this.mode, "\"."));
            continue;
          }
          var value = search[0];
          var actions = (0, _typeof2.default)(mode[tokenName]) === 'object' ? mode[tokenName] : [mode[tokenName]];
          matched = true;
          console.log(chunk.type, chunk.depth, value);
          this.index += value.length;
          var type = 'normal';
          for (var i in actions) {
            var action = actions[i];
            if (typeof action === 'string') {
              if (!(action in this.modes)) {
                throw new Error("Mode \"".concat(action, "\" does not exist."));
              }
              this.mode = action;
              mode = this.modes[this.mode];
              type = action;
              continue;
            }
            switch (action) {
              case INSERT:
                chunk.list.push(value);
                break;
              case ENTER:
                var newChunk = new Chunk();
                newChunk.depth = chunk.depth + 1;
                newChunk.match = value;
                newChunk.type = type;
                chunk.list.push(newChunk);
                this.stack.push(chunk);
                chunk = newChunk;
                // this.mode = chunk.type;

                break;
              case LEAVE:
                if (!this.stack.length) {
                  console.log(this.mode, "\"".concat(value, "\""), chunk);
                  throw new Error("Already at the top of the stack.");
                }
                chunk = this.stack.pop();
                this.mode = chunk.type;
                mode = this.modes[this.mode];
                break;
            }
          }
          break;
        }
        if (!matched) {
          break;
        }
      }
      if (this.stack.length) {
        throw new Error('Did not return to top of stack!');
      }
      return this.stack.shift() || chunk;
    }
  }]);
  return Parser;
}();
});

;require.register("curvature/tag/LazyTag.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LazyTag = void 0;
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _ScrollTag2 = require("./ScrollTag");
var _Dom = require("../base/Dom");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var LazyTag = /*#__PURE__*/function (_ScrollTag) {
  (0, _inherits2.default)(LazyTag, _ScrollTag);
  var _super = _createSuper(LazyTag);
  function LazyTag(element, parent, ref, index, direct) {
    var _this;
    (0, _classCallCheck2.default)(this, LazyTag);
    _this = _super.call(this, element, parent, ref, index, direct);
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
  return (0, _createClass2.default)(LazyTag);
}(_ScrollTag2.ScrollTag);
exports.LazyTag = LazyTag;
});

;require.register("curvature/tag/PopOutTag.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PopOutTag = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Bindable = require("../base/Bindable");
var _Dom = require("../base/Dom");
var _Tag2 = require("../base/Tag");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var PopOutTag = /*#__PURE__*/function (_Tag) {
  (0, _inherits2.default)(PopOutTag, _Tag);
  var _super = _createSuper(PopOutTag);
  function PopOutTag(element, parent, ref, index, direct) {
    var _this;
    (0, _classCallCheck2.default)(this, PopOutTag);
    _this = _super.call(this, element, parent, ref, index, direct);
    _this.defaultStyle = element.getAttribute('style') || '';
    _this.poppedOut = false;
    _this.moving = false;
    _this.hostSelector = element.getAttribute('cv-pop-to');
    _this.popMargin = element.getAttribute('cv-pop-margin') || 0;
    _this.popSpeed = element.getAttribute('data-pop-speed') || 1750;
    element.removeAttribute('cv-pop-to');
    element.removeAttribute('cv-pop-margin');
    element.removeAttribute('data-pop-speed');
    _this.verticalDuration = 0.4;
    _this.horizontalDuration = 0.1;
    _this.unpoppedStyle = '';
    _this.previousScroll = 0;
    _this.bodyStyle = '';
    _this.bodyScroll = 0;
    _this.element.classList.add('unpopped');
    _this.scrollStyle = '';
    _this.existingStyle = '';
    _this.popTimeout = null;

    // this.element.addEventListener('cvDomDetached', this.detachListener);
    _this.rect = null;
    _this.transformRect = null;
    _this.clickListener = function (event) {
      _this.rect = _this.element.getBoundingClientRect();
      if (!_this.poppedOut) {
        _this.distance = Math.sqrt(Math.pow(_this.rect.top, 2) + Math.pow(_this.rect.left, 2));
        var cut = _this.popSpeed;
        var fromRight = window.innerWidth - _this.rect.right;
        var fromBottom = window.innerHeight - _this.rect.bottom;
        var horizontalAverage = (_this.rect.left + fromRight) / 2;
        var vericalAverage = (_this.rect.top + fromBottom) / 2;
        _this.horizontalDuration = horizontalAverage / cut;
        _this.verticalDuration = vericalAverage / cut;
        if (_this.horizontalDuration < 0.1) {
          _this.horizontalDuration = 0.1;
        }
        if (_this.verticalDuration < 0.1) {
          _this.verticalDuration = 0.1;
        }
        if (_this.horizontalDuration > 0.4) {
          _this.horizontalDuration = 0.4;
        }
        if (_this.verticalDuration > 0.4) {
          _this.verticalDuration = 0.4;
        }
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
    _this.escapeListener = function (event) {
      if (!_this.poppedOut) {
        return;
      }
      if (event.key !== 'Escape') {
        return;
      }
      _this.unpop();
    };
    _this.resizeListener = function (event) {
      if (!_this.poppedOut) {
        return;
      }
      var hostTag = _this.element;
      while (hostTag.parentNode && !hostTag.matches(_this.hostSelector)) {
        if (hostTag.parentNode == document) {
          break;
        }
        hostTag = hostTag.parentNode;
      }
      var hostRect = hostTag.getBoundingClientRect();
      var style = _this.existingStyle + _this.unpoppedStyle;
      var x = hostRect.x;
      var y = hostRect.y + document.documentElement.scrollTop;
      var w = hostRect.width;
      var h = hostRect.height;
      if (_this.transformRect) {
        x -= _this.transformRect.x;
        y -= _this.transformRect.y;
      }
      x + _this.popMargin;
      y + _this.popMargin;
      w + _this.popMargin * 2;
      h + _this.popMargin * 2;
      style += ";\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t\toverflow: hidden;\n\t\t\t\tposition:  fixed;\n\t\t\t\tleft:      ".concat(x, "px;\n\t\t\t\ttop:        ").concat(y, "px;\n\t\t\t\twidth:      ").concat(w, "px;\n\t\t\t\theight:     ").concat(h, "px;\n\t\t\t\toverflow-y: auto;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t");
      _this.element.setAttribute('style', style);
    };
    if (!_this.element.___clickListener___) {
      Object.defineProperty(_this.element, '___scrollListeners___', {
        enumerable: false,
        writable: true
      });
      element.___clickListener___ = _this.clickListener;
      element.___escapeListener___ = _this.escapeListener;
      element.___resizeListener___ = _this.resizeListener;
      _this.element.addEventListener('click', element.___clickListener___);
      window.addEventListener('keyup', element.___escapeListener___);
      window.addEventListener('resize', element.___resizeListener___);
      _this.cleanup.push(function (element) {
        return function () {
          element.removeEventListener('click', element.___clickListener___);
          window.removeEventListener('keyup', element.___escapeListener___);
          window.removeEventListener('resize', element.___resizeListener___);
        };
      }(element));
    }
    return _this;
  }
  (0, _createClass2.default)(PopOutTag, [{
    key: "pause",
    value: function pause() {
      var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      (0, _get2.default)((0, _getPrototypeOf2.default)(PopOutTag.prototype), "pause", this).call(this, paused);
      if (paused) {
        document.body.setAttribute('style', this.bodyStyle);
        document.body.setAttribute('style', '');
      }
    }
  }, {
    key: "pop",
    value: function pop() {
      var _this2 = this;
      PopOutTag.popLevel();
      this.previousScroll = window.scrollY;
      this.rect = this.element.getBoundingClientRect();
      this.existingStyle = this.element.getAttribute('style');
      var hostTag = this.element;
      this.transformRect = null;

      // console.log(hostTag);

      while (hostTag.parentNode && !hostTag.matches(this.hostSelector)) {
        if (hostTag.parentNode == document) {
          break;
        }
        hostTag = hostTag.parentNode;
        if (!this.transformRect && getComputedStyle(hostTag).transform !== 'none') {
          this.transformRect = hostTag.getBoundingClientRect();
        }
      }

      // console.log(this.transformRect);

      var hostRect = hostTag.getBoundingClientRect();
      this.element.classList.add('popping');
      var oX = this.rect.x;
      var oY = this.rect.y;
      var oW = this.rect.width;
      var oH = this.rect.height;
      if (this.transformRect) {
        oX -= this.transformRect.x;
        oY -= this.transformRect.y;
      }
      window.requestAnimationFrame(function () {
        _this2.unpoppedStyle = "\n\t\t\t\t;position:  fixed;\n\t\t\t\tleft:       ".concat(oX, "px;\n\t\t\t\ttop:        ").concat(oY, "px;\n\t\t\t\twidth:      ").concat(oW, "px;\n\t\t\t\theight:     ").concat(oH, "px;\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t\toverflow: hidden;\n\t\t\t");
        var x = hostRect.x;
        var y = hostRect.y + document.documentElement.scrollTop;
        var w = hostRect.width;
        var h = hostRect.height;

        // console.log(this.transformRect);

        if (_this2.transformRect) {
          x -= _this2.transformRect.x;
          y -= _this2.transformRect.y;
        }
        x + _this2.popMargin;
        y + _this2.popMargin;
        w + _this2.popMargin * 2;
        h + _this2.popMargin * 2;

        // transition: width ${this.horizontalDuration}s  ease-out
        // , top ${this.verticalDuration}s    ease-out
        // , left ${this.horizontalDuration}s ease-out
        // , height ${this.verticalDuration}s ease-out
        // , all ${this.horizontalDuration}s  ease-out;

        var style = _this2.existingStyle + _this2.unpoppedStyle;
        _this2.element.setAttribute('style', style);
        setTimeout(function () {
          style += "\n\t\t\t\t\t;left:      ".concat(x, "px;\n\t\t\t\t\ttop:        ").concat(y + document.documentElement.scrollTop, "px;\n\t\t\t\t\twidth:      ").concat(w, "px;\n\t\t\t\t\theight:     ").concat(h, "px;\n\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\ttransition: width ").concat(_this2.horizontalDuration, "s ease-out\n\t\t\t\t\t\t, top ").concat(_this2.verticalDuration, "s           ease-out\n\t\t\t\t\t\t, left ").concat(_this2.horizontalDuration, "s        ease-out\n\t\t\t\t\t\t, height ").concat(_this2.verticalDuration, "s        ease-out\n\t\t\t\t\t\t, all ").concat(_this2.horizontalDuration, "s         ease-out;\n\t\t\t\t");
          _this2.moving = true;
          _this2.element.setAttribute('style', style);
          _this2.element.classList.add('popped');
          _this2.element.classList.remove('unpopped');
          _this2.element.classList.remove('popping');
          _this2.popTimeout = setTimeout(function () {
            if (!_this2.element) {
              return;
            }
            _this2.bodyStyle = document.body.getAttribute('style');
            document.body.setAttribute('style', 'height:100%;overflow:hidden;');
            _this2.moving = false;
            var poppedEvent = new CustomEvent('cvPopped');
            _this2.element.dispatchEvent(poppedEvent);
            _this2.scrollStyle = _this2.element.getAttribute('style');
          }, _this2.horizontalDuration * 1000);
        }, 16.7 * 2);
        _this2.poppedOut = true;
      });
      var popEvent = new CustomEvent('cvPop', {
        bubbles: true,
        detail: {
          tag: this,
          view: this.parent,
          publicId: this.parent.args.publicId
        }
      });
      this.element.dispatchEvent(popEvent);
    }
  }, {
    key: "unpop",
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
      var style = this.existingStyle + this.unpoppedStyle + ";transition: width ".concat(this.horizontalDuration, "s ease-out\n\t\t\t\t\t, height ").concat(this.verticalDuration, "s        ease-out\n\t\t\t\t\t, all ").concat(this.horizontalDuration, "s         ease-out;");
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
        _this3.element.setAttribute('style', _this3.defaultStyle);
        _this3.moving = false;
        var unpoppedEvent = new CustomEvent('cvUnpopped');
        _this3.element.dispatchEvent(unpoppedEvent);
      }, this.horizontalDuration * 1000);
      var unpopEvent = new CustomEvent('cvUnpop', {
        bubbles: true,
        detail: {
          tag: this,
          view: this.parent,
          publicId: this.parent.args.publicId
        }
      });
      this.element.dispatchEvent(unpopEvent);
      this.poppedOut = false;
    }
  }, {
    key: "remove",
    value: function remove() {
      document.body.setAttribute('style', this.bodyStyle);
      (0, _get2.default)((0, _getPrototypeOf2.default)(PopOutTag.prototype), "remove", this).call(this);
    }
  }], [{
    key: "popLevel",
    value: function popLevel() {
      if (!this.level) {
        this.level = 0;
      }
      this.level++;
      return this.level;
    }
  }, {
    key: "unpopLevel",
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
exports.PopOutTag = PopOutTag;
});

;require.register("curvature/tag/ScrollTag.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ScrollTag = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _Tag2 = require("../base/Tag");
var _Dom = require("../base/Dom");
var _Bindable = require("../base/Bindable");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ScrollTag = /*#__PURE__*/function (_Tag) {
  (0, _inherits2.default)(ScrollTag, _Tag);
  var _super = _createSuper(ScrollTag);
  function ScrollTag(element, parent, ref, index, direct) {
    var _this;
    (0, _classCallCheck2.default)(this, ScrollTag);
    _this = _super.call(this, element, parent, ref, index, direct);
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
      var scrolledEvent;
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
        detail: {
          offset: v
        }
      });
      _Dom.Dom.mapTags(_this.element, false, function (node) {
        node.dispatchEvent(scrolledEvent);
      });
      _this.element.dispatchEvent(scrolledEvent);
    });
    return _this;
  }
  (0, _createClass2.default)(ScrollTag, [{
    key: "scrolled",
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
    key: "addScrollListener",
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
        var options = {
          passive: true,
          capture: true
        };
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
    key: "addResizeListener",
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
exports.ScrollTag = ScrollTag;
});

;require.register("curvature/toast/Toast.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Toast = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _View2 = require("../base/View");
var _Bindable = require("../base/Bindable");
var _ToastAlert = require("./ToastAlert");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var Toast = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(Toast, _View);
  var _super = _createSuper(Toast);
  function Toast() {
    var _this;
    (0, _classCallCheck2.default)(this, Toast);
    _this = _super.call(this);
    _this.template = "\n\t\t\t<div id = \"[[_id]]\" cv-each = \"alerts:alert\" class = \"toast\">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t";
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

    // this.args.alerts.bindTo((v) => { console.log(v) });
    return _this;
  }
  (0, _createClass2.default)(Toast, [{
    key: "pop",
    value: function pop(alert) {
      var _this2 = this;
      var index = this.args.alerts.length;
      this.args.alerts.push(alert);
      alert.decay(function (alert) {
        return function () {
          for (var i in _this2.args.alerts) {
            if (_Bindable.Bindable.ref(_this2.args.alerts[i]) === _Bindable.Bindable.ref(alert)) {
              alert.remove();
              delete _this2.args.alerts[i];
              return;
            }
          }
        };
      }(alert));
    }
  }, {
    key: "alert",
    value: function alert(title, body, time) {
      return this.pop(new _ToastAlert.ToastAlert({
        title: title,
        body: body,
        time: time
      }));
    }
  }], [{
    key: "instance",
    value: function instance() {
      if (!this.inst) {
        this.inst = new this();
      }
      return this.inst;
    }
  }]);
  return Toast;
}(_View2.View);
exports.Toast = Toast;
});

;require.register("curvature/toast/ToastAlert.js", function(exports, require, module) {
"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastAlert = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _View2 = require("../base/View");
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
var ToastAlert = /*#__PURE__*/function (_View) {
  (0, _inherits2.default)(ToastAlert, _View);
  var _super = _createSuper(ToastAlert);
  function ToastAlert(args) {
    var _this;
    (0, _classCallCheck2.default)(this, ToastAlert);
    _this = _super.call(this, args);
    _this.args.running = false;
    _this.args.time = _this.args.time || 16000;
    _this.init = _this.args.time;
    _this.args.title = _this.args.title || 'Standard alert';
    _this.args.status = 'new';
    _this.args.body = _this.args.body || 'This is a standard alert.';
    _this.template = "\n\t\t\t<div id = \"[[_id]]\" class = \"alert toast-[[status]]\">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t";
    return _this;
  }
  (0, _createClass2.default)(ToastAlert, [{
    key: "decay",
    value: function decay(complete) {
      var _this2 = this;
      this.args.running = true;
      this.onTimeout(50, function () {
        _this2.args.status = '';
      });
      this.onTimeout(300, function () {
        _this2.args.status = 'decaying';
      });
      this.onTimeout(2400, function () {
        _this2.args.status = 'imminent';
      });
      this.onTimeout(3500, function () {
        _this2.remove();
      });
    }
  }]);
  return ToastAlert;
}(_View2.View);
exports.ToastAlert = ToastAlert;
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');


//# sourceMappingURL=curvature.js.map