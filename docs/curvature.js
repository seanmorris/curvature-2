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

require.register("curvature/base/Bindable.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bindable = void 0;

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Ref = Symbol('ref');
var Original = Symbol('original');
var Deck = Symbol('deck');
var Binding = Symbol('binding');
var SubBinding = Symbol('subBinding');
var BindingAll = Symbol('bindingAll');
var IsBindable = Symbol('isBindable');
var Wrapping = Symbol('wrapping');
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
var TypedArray = Object.getPrototypeOf(Int8Array);
var win = window || {};
var excludedClasses = [win.Node, win.File, win.Map, win.Set, win.WeakMap, win.WeakSet, win.ArrayBuffer, win.ResizeObserver, win.MutationObserver, win.PerformanceObserver, win.IntersectionObserver].filter(function (x) {
  return typeof x === 'function';
});

var Bindable = /*#__PURE__*/function () {
  function Bindable() {
    _classCallCheck(this, Bindable);
  }

  _createClass(Bindable, null, [{
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
      return object[Ref] || false;
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

        if (original[ii] && _typeof(original[ii]) === 'object') {
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

      if (!object || !['function', 'object'].includes(_typeof(object))) {
        return object;
      }

      if (excludedClasses.filter(function (x) {
        return object instanceof x;
      }).length || Object.isSealed(object) || !Object.isExtensible(object)) {
        return object;
      }

      if (object[Ref]) {
        return object[Ref];
      }

      if (object[Binding]) {
        return object;
      }

      Object.defineProperty(object, Ref, {
        configurable: true,
        enumerable: false,
        writable: true,
        value: object
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
      Object.defineProperty(object, IsBindable, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: Bindable
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
      Object.defineProperty(object, '___before___', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, '___after___', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: []
      });
      Object.defineProperty(object, Wrapped, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {}
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
        value: new Map()
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
            return debinders.map(function (d) {
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
          var _bindIndex = object[BindingAll].length;
          object[BindingAll].push(callback);

          if (!('now' in options) || options.now) {
            for (var i in object) {
              callback(object[i], i, object, false);
            }
          }

          return function () {
            delete object[BindingAll][_bindIndex];
          };
        }

        if (!object[Binding][property]) {
          object[Binding][property] = [];
        }

        var bindIndex = object[Binding][property].length;

        if (options.children) {
          var original = callback;

          callback = function callback() {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            var v = args[0];
            var subDebind = object[SubBinding].get(original);

            if (subDebind) {
              object[SubBinding]["delete"](original);
              subDebind();
            }

            if (_typeof(v) !== 'object') {
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

        object[Binding][property].push(callback);

        if (!('now' in options) || options.now) {
          callback(object[property], property, object, false);
        }

        var cleaned = false;

        var debinder = function debinder() {
          var subDebind = object[SubBinding].get(callback);

          if (subDebind) {
            object[SubBinding]["delete"](callback);
            subDebind();
          }

          if (cleaned) {
            return;
          }

          cleaned = true;

          if (!object[Binding][property]) {
            return;
          }

          delete object[Binding][property][bindIndex];
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
        var beforeIndex = object.___before___.length;

        object.___before___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___before___[beforeIndex];
        };
      };

      var ___after = function ___after(callback) {
        var afterIndex = object.___after___.length;

        object.___after___.push(callback);

        var cleaned = false;
        return function () {
          if (cleaned) {
            return;
          }

          cleaned = true;
          delete object.___after___[afterIndex];
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
              v = t[k] = _this.makeBindable({});
            }

            debind = debind.concat(v[BindChain](rest, callback));
          }));
          return function () {
            return debind.map(function (x) {
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
          for (var j in object[Binding][_i]) {
            if (object[Binding][_i][j]) {
              return true;
            }
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
        if (key === Original) {
          return true;
        }

        if (object[Deck][key] !== undefined && object[Deck][key] === value) {
          return true;
        }

        if (typeof key === 'string' && key.substring(0, 3) === '___' && key.slice(-3) === '___') {
          return true;
        }

        if (target[key] === value) {
          return true;
        }

        if (value && value instanceof Object) {
          if (!excludedClasses.filter(function (x) {
            return object instanceof x;
          }).length && Object.isExtensible(object) && !Object.isSealed(object)) {
            value = Bindable.makeBindable(value);
          }
        }

        object[Deck][key] = value;

        for (var _i2 in object[BindingAll]) {
          if (!object[BindingAll][_i2]) {
            continue;
          }

          object[BindingAll][_i2](value, key, target, false);
        }

        var stop = false;

        if (key in object[Binding]) {
          for (var _i3 in object[Binding][key]) {
            if (!object[Binding][key]) {
              continue;
            }

            if (!object[Binding][key][_i3]) {
              continue;
            }

            if (object[Binding][key][_i3](value, key, target, false, target[key]) === false) {
              stop = true;
            }
          }
        }

        delete object[Deck][key];

        if (!stop) {
          var descriptor = Object.getOwnPropertyDescriptor(target, key);
          var excluded = target instanceof File && key == 'lastModifiedDate';

          if (!excluded && (!descriptor || descriptor.writable) && target[key] === value) {
            target[key] = value;
          }
        }

        var result = Reflect.set(target, key, value);

        if (Array.isArray(target) && object[Binding]['length']) {
          for (var _i4 in object[Binding]['length']) {
            var callback = object[Binding]['length'][_i4];
            callback(target.length, 'length', target, false, target.length);
          }
        }

        return result;
      };

      var deleteProperty = function deleteProperty(target, key) {
        if (!(key in target)) {
          return true;
        }

        for (var _i5 in object[BindingAll]) {
          object[BindingAll][_i5](undefined, key, target, true, target[key]);
        }

        if (key in object[Binding]) {
          for (var _i6 in object[Binding][key]) {
            if (!object[Binding][key][_i6]) {
              continue;
            }

            object[Binding][key][_i6](undefined, key, target, true, target[key]);
          }
        }

        delete target[key];
        return true;
      };

      var construct = function construct(target, args) {
        var key = 'constructor';

        for (var _i7 in target.___before___) {
          target.___before___[_i7](target, key, object[Stack], undefined, args);
        }

        var instance = Bindable.make(_construct(target[Original], _toConsumableArray(args)));

        for (var _i8 in target.___after___) {
          target.___after___[_i8](target, key, object[Stack], instance, args);
        }

        return instance;
      };

      var descriptors = object[Descriptors];
      var wrapped = object[Wrapped];
      var stack = object[Stack];

      var get = function get(target, key) {
        if (wrapped[key]) {
          return wrapped[key];
        }

        if (key === Ref || key === Original || key === 'apply' || key === 'isBound' || key === 'bindTo' || key === '__proto__') {
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
          wrapped[key] = object[key];
          return wrapped[key];
        }

        if (typeof object[key] === 'function') {
          Object.defineProperty(object[Unwrapped], key, {
            configurable: false,
            enumerable: false,
            writable: false,
            value: object[key]
          });
          wrapped[key] = Bindable.make(function () {
            var SetIterator = Set.prototype[Symbol.iterator];
            var MapIterator = Map.prototype[Symbol.iterator];
            var objRef = typeof Promise === 'function' && object instanceof Promise || typeof Map === 'function' && object instanceof Map || typeof Set === 'function' && object instanceof Set || typeof MapIterator === 'function' && object.prototype === MapIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof SetIterator === 'function' && object.prototype === SetIterator || typeof WeakMap === 'function' && object instanceof WeakMap || typeof WeakSet === 'function' && object instanceof WeakSet || typeof Date === 'function' && object instanceof Date || typeof TypedArray === 'function' && object instanceof TypedArray || typeof ArrayBuffer === 'function' && object instanceof ArrayBuffer || typeof EventTarget === 'function' && object instanceof EventTarget || typeof ResizeObserver === 'function' && object instanceof ResizeObserver || typeof MutationObserver === 'function' && object instanceof MutationObserver || typeof PerformanceObserver === 'function' && object instanceof PerformanceObserver || typeof IntersectionObserver === 'function' && object instanceof IntersectionObserver || typeof object[Symbol.iterator] === 'function' && key === 'next' // Map.prototype[@@iterator]
            ? object : object[Ref];
            object[Executing] = key;
            stack.unshift(key);

            for (var _len3 = arguments.length, providedArgs = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
              providedArgs[_key3] = arguments[_key3];
            }

            for (var _i9 in object.___before___) {
              object.___before___[_i9](object, key, stack, object, providedArgs);
            }

            var ret;

            if (new.target) {
              ret = _construct(object[Unwrapped][key], providedArgs);
            } else {
              var prototype = Object.getPrototypeOf(object);
              var isMethod = prototype[key] === object[key];

              if (isMethod) {
                ret = object[key].apply(objRef || object, providedArgs);
              } else {
                ret = object[key].apply(object, providedArgs);
              }
            }

            for (var _i10 in object.___after___) {
              object.___after___[_i10](object, key, stack, object, providedArgs);
            }

            object[Executing] = null;
            stack.shift();
            return ret;
          });
          return wrapped[key];
        }

        return object[key];
      };

      var getPrototypeOf = function getPrototypeOf(target) {
        if (GetProto in object) {
          return object[GetProto];
        }

        return Reflect.getPrototypeOf(target);
      };

      Object.defineProperty(object, Ref, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: new Proxy(object, {
          get: get,
          set: set,
          construct: construct,
          getPrototypeOf: getPrototypeOf,
          deleteProperty: deleteProperty
        })
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
      clearObjs(object[Wrapped], object[Binding], object[BindingAll], object.___after___, object.___before___);
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
          var obj = this.makeBindable(object);
          return [obj, pathParts.shift(), top];
        }

        node = pathParts.shift();

        if (!node in object || !object[node] || !(object[node] instanceof Object)) {
          object[node] = {};
        }

        object = this.makeBindable(object[node]);
      }

      return [this.makeBindable(object), node, top];
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
          _this3.waiters["delete"](callback);

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

_defineProperty(Bindable, "waiters", new WeakMap());

_defineProperty(Bindable, "throttles", new WeakMap());

Object.defineProperty(Bindable, 'OnGet', {
  configurable: false,
  enumerable: false,
  writable: false,
  value: OnGet
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
  })();
});

require.register("curvature/base/Cache.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cache = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cache = /*#__PURE__*/function () {
  function Cache() {
    _classCallCheck(this, Cache);
  }

  _createClass(Cache, null, [{
    key: "store",
    value: function store(key, value, expiry) {
      var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';
      var expiration = 0;

      if (expiry) {
        expiration = expiry * 1000 + new Date().getTime();
      } // console.log(
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

      this.bucket[bucket][key] = {
        expiration: expiration,
        value: value
      };
    }
  }, {
    key: "load",
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

exports.Cache = Cache;
  })();
});

require.register("curvature/model/Model.js", function(exports, require, module) {
  require = __makeRelativeRequire(require, {}, "curvature");
  (function() {
    "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Model = void 0;

var _Cache = require("../base/Cache");

var _Bindable = require("../base/Bindable");

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Saved = Symbol('Saved');
var Changed = Symbol('Changed');

var Model = /*#__PURE__*/function () {
  _createClass(Model, null, [{
    key: "keyProps",
    value: function keyProps() {
      return ['id', 'class'];
    }
  }]);

  function Model() {
    _classCallCheck(this, Model);

    Object.defineProperty(this, Changed, {
      value: _Bindable.Bindable.make({})
    });
    Object.defineProperty(this, Saved, {
      writable: true,
      value: false
    }); // return Bindable.makeBindable(this);
  }

  _createClass(Model, [{
    key: "consume",
    value: function consume(skeleton) {
      var _this = this;

      var override = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var keyProps = this.__proto__.constructor.keyProps();

      var setProp = function setProp(property, value) {
        if (value && _typeof(value) === 'object' && value.__proto__.constructor.keyProps) {
          var subKeyProps = value.__proto__.constructor.keyProps();

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

        _this[property] = value;
      };

      for (var property in skeleton) {
        if (!override && this[Changed][property]) {
          continue;
        }

        if (keyProps.includes(property)) {
          continue;
        }

        setProp(property, skeleton[property]);
      }
    }
  }, {
    key: "changed",
    value: function changed() {
      this[Saved] = false;
    }
  }, {
    key: "stored",
    value: function stored() {
      for (var property in this[Changed]) {
        this[Changed][property] = false;
      }

      this[Saved] = true;
    }
  }, {
    key: "isSaved",
    value: function isSaved() {
      return this[Saved];
    }
  }], [{
    key: "from",
    value: function from(skeleton) {
      var _this2 = this;

      var keyProps = this.keyProps();
      var cacheKey = keyProps.map(function (prop) {
        return skeleton[prop];
      }).join('::');
      var bucket = 'models-by-type-and-publicId';

      var cached = _Cache.Cache.load(cacheKey, false, bucket);

      var instance = cached ? cached : _Bindable.Bindable.makeBindable(new this());

      var _iterator = _createForOfIteratorHelper(keyProps),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _ref, _instance$keyProp;

          var keyProp = _step.value;
          instance[keyProp] = (_ref = (_instance$keyProp = instance[keyProp]) !== null && _instance$keyProp !== void 0 ? _instance$keyProp : skeleton[keyProp]) !== null && _ref !== void 0 ? _ref : null;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      instance.consume(skeleton);

      _Cache.Cache.store(cacheKey, instance, 0, bucket);

      if (!cached) {
        var changed = false;
        instance.bindTo(function (v, k, t) {
          if (_typeof(k) === 'symbol') {
            return;
          }

          if (v === t[k]) {
            return;
          }

          instance[Changed][k] = changed;
          instance[Saved] = !!(changed ? false : _this2[Saved]);
        });
        changed = true;
      }

      return instance;
    }
  }]);

  return Model;
}();

exports.Model = Model;
Object.defineProperty(Model, 'Saved', {
  value: Saved
});
Object.defineProperty(Model, 'Changed', {
  value: Changed
});
  })();
});
require.register("Config.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Config=void 0;var Config={title:"Curvature 0.0.61"};exports.Config=Config;
});

require.register("access/LoginView.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LoginView=void 0;var _Config=require("Config"),_View2=require("../base/View"),_Router=require("../base/Router"),_Repository=require("../base/Repository"),_UserRepository=require("./UserRepository"),_Toast=require("../toast/Toast"),_ToastAlert=require("../toast/ToastAlert");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var LoginView=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template="\n\t\t\t<a cv-link = \"user\">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = \"user/login\">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/register\">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/logout\">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Login via FaceBook\"\n\t\t\t \tcv-on = \"click:facebookLogin(event)\"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Log Out\"\n\t\t\t \tcv-on = \"click:logout(event)\"\n\t\t\t />\n\t\t",a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"facebookLogin",value:function facebookLogin(a){var b=this;console.log("fb!"),a.preventDefault();window.open(_Config.Config.backend+"/facebookLogin");this.userCheck&&this.clearInterval(this.userCheck),this.userCheck=this.onInterval(333,function(){_UserRepository.UserRepository.getCurrentUser(!0).then(function(a){var c=a.body;c.id&&c&&(b.clearInterval(b.userCheck),_Router.Router.clearCache(),_Repository.Repository.clearCache(),_Toast.Toast.instance().pop(new _ToastAlert.ToastAlert({title:"Logged in as "+c.username,body:"ID: "+c.publicId,time:2400})))})})}},{key:"logout",value:function logout(){window.open(_Config.Config.backend+"/user/logout?page=app%3Fclose%3D1")}}]),b}(_View2.View);exports.LoginView=LoginView;
});

;require.register("access/UserRepository.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.UserRepository=void 0;var _Config=require("../base/Config"),_Bindable=require("../base/Bindable"),_Repository2=require("../base/Repository");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var UserRepository=/*#__PURE__*/function(a){function b(){return _classCallCheck(this,b),c.apply(this,arguments)}_inherits(b,a);var c=_createSuper(b);return _createClass(b,null,[{key:"getCurrentUser",value:function getCurrentUser(){var a=this,b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;return window.prerenderer||navigator.userAgent.match(/prerender/i)?void(window.prerenderer=window.prerenderer||!0):this.args.response&&!1===b?Promise.resolve(this.args.response):this.request(this.uri+"current",!1,!1).then(function(b){if(b.body&&b.body.roles)for(var c in b.body.roles)"SeanMorris\\Access\\Role\\Administrator"==b.body.roles[c]["class"]&&(b.body.isAdmin=!0);return b.body&&b.body.id&&(a.args.response=b,a.args.current=b.body),b})["catch"](function(a){console.error(a)})}},{key:"login",value:function login(){return this.request(this.uri+"/login")}},{key:"logout",value:function logout(){var a=this,b=this.args.current;return delete this.args.current,this.request(this.uri+"logout",!1,{},!1).then(function(){return a.args.current=null,b})}},{key:"onChange",value:function onChange(a){return this.args.bindTo("current",a)}},{key:"uri",get:function get(){return _Config.Config.get("backend")+"/user/"}}]),b}(_Repository2.Repository);exports.UserRepository=UserRepository,Object.defineProperty(UserRepository,"args",{configurable:!1,writable:!1,value:_Bindable.Bindable.makeBindable({})}),_Repository2.Repository.onResponse(function(a){a&&a.meta&&"currentUser"in a.meta&&(!UserRepository.args.current||a.meta.currentUser.id!==UserRepository.args.current.id)&&(UserRepository.args.current=a.meta.currentUser)});
});

require.register("animate/Chain.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Chain=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}var Chain=function a(){_classCallCheck(this,a)};exports.Chain=Chain;
});

;require.register("animate/Ease.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Ease=void 0;var _Mixin=require("../base/Mixin"),_PromiseMixin=require("../mixin/PromiseMixin");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Ease=/*#__PURE__*/function(a){function b(a){var d,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};return _classCallCheck(this,b),d=c.call(this),d.interval=a,d.terminal=!1,d.initial=!1,d.timeout=!1,d.final=!1,d.canceled=!1,d.done=!1,d.calculate=!!(d.calculate||"calculate"in e)&&e.calculate,d.bounded=!("bounded"in e)||e.bounded,d.repeat="repeat"in e?e.repeat:1,d.reverse=!!("reverse"in e)&&e.reverse,d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"start",value:function start(){var a=this;requestAnimationFrame(function(){a.initial=Date.now(),a.terminal=a.initial+a.interval,0<=a.repeat&&(a.terminal=a.initial+a.interval*a.repeat,a.timeout=setTimeout(function(){return a.done?a.final:void(a.done=!0,a.final=a.reverse?0:1,a[_PromiseMixin.PromiseMixin.Accept](a.final))},a.interval*a.repeat))})}},{key:"cancel",value:function cancel(){return this.done?this.final:(clearTimeout(this.timeout),this.final=this.current(),this.canceled=this.done=!0,this[_PromiseMixin.PromiseMixin.Reject](this.final),this.final)}},{key:"fraction",value:function(){if(this.done)return this.final;if(!1===this.initial)return this.reverse?1:0;var a=Date.now(),b=a-this.initial,c=b%this.interval/this.interval;return this.initial&&0===c?this.reverse?0:1:this.reverse?1-c:c}},{key:"current",value:function current(){var a=this.fraction();return this.calculate?this.calculate(a):a}}]),b}(_Mixin.Mixin["with"](_PromiseMixin.PromiseMixin));exports.Ease=Ease;
});

;require.register("animate/ease/CubicIn.js", function(exports, require, module) {
"use strict";var _Ease2=require("../Ease");Object.defineProperty(exports,"__esModule",{value:!0}),exports.CubicIn=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var CubicIn=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"calculate",function(a){return a*a*a}),a}_inherits(b,a);var c=_createSuper(b);return b}(_Ease2.Ease);exports.CubicIn=CubicIn;
});

;require.register("animate/ease/CubicInOut.js", function(exports, require, module) {
"use strict";var _Ease2=require("../Ease");Object.defineProperty(exports,"__esModule",{value:!0}),exports.CubicInOut=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var CubicInOut=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"calculate",function(a){return .5>a?4*a*a*a:(a-1)*(2*a-2)*(2*a-2)+1}),a}_inherits(b,a);var c=_createSuper(b);return b}(_Ease2.Ease);exports.CubicInOut=CubicInOut;
});

;require.register("animate/ease/CubicOut.js", function(exports, require, module) {
"use strict";var _Ease2=require("../Ease");Object.defineProperty(exports,"__esModule",{value:!0}),exports.CubicOut=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var CubicOut=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"calculate",function(a){return--a*a*a+1}),a}_inherits(b,a);var c=_createSuper(b);return b}(_Ease2.Ease);exports.CubicOut=CubicOut;
});

;require.register("base/Bag.js", function(exports, require, module) {
"use strict";var _Bindable=require("./Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Bag=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var toId=function(a){return+a},fromId=function(a){return parseInt(a)},Bag=/*#__PURE__*/function(){function a(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:void 0;_classCallCheck(this,a),this.meta=Symbol("meta"),this.content=new Map,this.list=_Bindable.Bindable.makeBindable([]),this.current=0,this.type=void 0,this.changeCallback=b}return _createClass(a,[{key:"has",value:function has(a){return this.content.has(a)}},{key:"add",value:function add(b){if(void 0===b||!(b instanceof Object))throw new Error("Only objects may be added to Bags.");if(this.type&&!(b instanceof this.type))throw console.error(this.type,b),new Error("Only objects of type ".concat(this.type," may be added to this Bag."));if(!this.content.has(b)){var c=toId(this.current++);this.content.set(b,c),this.list[c]=b,this.changeCallback&&this.changeCallback(b,this.meta,a.ITEM_ADDED,c)}}},{key:"remove",value:function remove(b){if(void 0===b||!(b instanceof Object))throw new Error("Only objects may be removed from Bags.");if(this.type&&!(b instanceof this.type))throw console.error(this.type,b),new Error("Only objects of type ".concat(this.type," may be removed from this Bag."));if(!this.content.has(b))return this.changeCallback&&this.changeCallback(b,this.meta,0,void 0),!1;var c=this.content.get(b);return delete this.list[c],this.content["delete"](b),this.changeCallback&&this.changeCallback(b,this.meta,a.ITEM_REMOVED,c),b}},{key:"items",value:function items(){return Array.from(this.content.entries()).map(function(a){return a[0]})}}]),a}();exports.Bag=Bag,Object.defineProperty(Bag,"ITEM_ADDED",{configurable:!1,enumerable:!1,writable:!0,value:1}),Object.defineProperty(Bag,"ITEM_REMOVED",{configurable:!1,enumerable:!1,writable:!0,value:-1});
});

require.register("base/Bindable.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Bindable=void 0;function _construct(){return _construct=_isNativeReflectConstruct()?Reflect.construct:function(b,c,d){var e=[null];e.push.apply(e,c);var a=Function.bind.apply(b,e),f=new a;return d&&_setPrototypeOf(f,d.prototype),f},_construct.apply(null,arguments)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Ref=Symbol("ref"),Original=Symbol("original"),Deck=Symbol("deck"),Binding=Symbol("binding"),SubBinding=Symbol("subBinding"),BindingAll=Symbol("bindingAll"),IsBindable=Symbol("isBindable"),Wrapping=Symbol("wrapping"),Executing=Symbol("executing"),Stack=Symbol("stack"),ObjSymbol=Symbol("object"),Wrapped=Symbol("wrapped"),Unwrapped=Symbol("unwrapped"),GetProto=Symbol("getProto"),OnGet=Symbol("onGet"),OnAllGet=Symbol("onAllGet"),BindChain=Symbol("bindChain"),Descriptors=Symbol("Descriptors"),TypedArray=Object.getPrototypeOf(Int8Array),win=window||{},excludedClasses=[win.Node,win.File,win.Map,win.Set,win.WeakMap,win.WeakSet,win.ArrayBuffer,win.ResizeObserver,win.MutationObserver,win.PerformanceObserver,win.IntersectionObserver].filter(function(a){return"function"==typeof a}),Bindable=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"isBindable",value:function isBindable(b){return!!(b&&b[IsBindable])&&b[IsBindable]===a}},{key:"onDeck",value:function onDeck(a,b){return a[Deck][b]||!1}},{key:"ref",value:function ref(a){return a[Ref]||!1}},{key:"makeBindable",value:function makeBindable(a){return this.make(a)}},{key:"shuck",value:function shuck(b,c){c=c||new Map;var d={};if(b instanceof TypedArray||b instanceof ArrayBuffer){var g=b.slice(0);return c.set(b,g),g}var e=Object.keys(b);for(var h in e){var i=e[h];if("___"!==i.substring(0,3)){var f=c.get(b[i]);if(f){d[i]=f;continue}if(b[i]===b){c.set(b[i],d),d[i]=d;continue}if(b[i]&&"object"===_typeof(b[i])){var j=b[i];a.isBindable(b[i])&&(j=b[i][Original]),d[i]=this.shuck(j,c)}else d[i]=b[i];c.set(b[i],d[i])}}return a.isBindable(b)&&(delete d.bindTo,delete d.isBound),d}},{key:"make",value:function make(b){var c=this;if(!b||!["function","object"].includes(_typeof(b)))return b;if(excludedClasses.filter(function(a){return b instanceof a}).length||Object.isSealed(b)||!Object.isExtensible(b))return b;if(b[Ref])return b[Ref];if(b[Binding])return b;Object.defineProperty(b,Ref,{configurable:!0,enumerable:!1,writable:!0,value:b}),Object.defineProperty(b,Original,{configurable:!1,enumerable:!1,writable:!1,value:b}),Object.defineProperty(b,Deck,{configurable:!1,enumerable:!1,writable:!1,value:{}}),Object.defineProperty(b,Binding,{configurable:!1,enumerable:!1,writable:!1,value:{}}),Object.defineProperty(b,SubBinding,{configurable:!1,enumerable:!1,writable:!1,value:new Map}),Object.defineProperty(b,BindingAll,{configurable:!1,enumerable:!1,writable:!1,value:[]}),Object.defineProperty(b,IsBindable,{configurable:!1,enumerable:!1,writable:!1,value:a}),Object.defineProperty(b,Executing,{enumerable:!1,writable:!0}),Object.defineProperty(b,Wrapping,{enumerable:!1,writable:!0}),Object.defineProperty(b,Stack,{configurable:!1,enumerable:!1,writable:!1,value:[]}),Object.defineProperty(b,"___before___",{configurable:!1,enumerable:!1,writable:!1,value:[]}),Object.defineProperty(b,"___after___",{configurable:!1,enumerable:!1,writable:!1,value:[]}),Object.defineProperty(b,Wrapped,{configurable:!1,enumerable:!1,writable:!1,value:{}}),Object.defineProperty(b,Unwrapped,{configurable:!1,enumerable:!1,writable:!1,value:{}}),Object.defineProperty(b,Descriptors,{configurable:!1,enumerable:!1,writable:!1,value:new Map});var d=function(e){var f=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,g=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},h=!1;if(Array.isArray(e)){var m=e.map(function(a){return d(a,f,g)});return function(){return m.map(function(a){return a()})}}if(e instanceof Function&&(g=f||{},f=e,h=!0),0<=g.delay&&(f=c.wrapDelayCallback(f,g.delay)),0<=g.throttle&&(f=c.wrapThrottleCallback(f,g.throttle)),0<=g.wait&&(f=c.wrapWaitCallback(f,g.wait)),g.frame&&(f=c.wrapFrameCallback(f,g.frame)),g.idle&&(f=c.wrapIdleCallback(f)),h){var n=b[BindingAll].length;if(b[BindingAll].push(f),!("now"in g)||g.now)for(var o in b)f(b[o],o,b,!1);return function(){delete b[BindingAll][n]}}b[Binding][e]||(b[Binding][e]=[]);var j=b[Binding][e].length;if(g.children){var i=f;f=function(){for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];var f=d[0],h=b[SubBinding].get(i);if(h&&(b[SubBinding]["delete"](i),h()),"object"!==_typeof(f))return void i.apply(void 0,d);var j=a.make(f);a.isBindable(j)&&b[SubBinding].set(i,j.bindTo(function(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return i.apply(void 0,d.concat(b))},Object.assign({},g,{children:!1}))),i.apply(void 0,d)}}b[Binding][e].push(f),(!("now"in g)||g.now)&&f(b[e],e,b,!1);var k=!1,l=function(){var a=b[SubBinding].get(f);(a&&(b[SubBinding]["delete"](f),a()),!k)&&(k=!0,b[Binding][e]&&delete b[Binding][e][j])};return g.removeWith&&g.removeWith instanceof View&&g.removeWith.onRemove(function(){return l}),l};Object.defineProperty(b,"bindTo",{configurable:!1,enumerable:!1,writable:!1,value:d});Object.defineProperty(b,BindChain,{configurable:!1,enumerable:!1,writable:!1,value:function value(a,e){var f=a.split("."),g=f.shift(),h=f.slice(0),i=[];return i.push(b.bindTo(g,function(a,b,f,g){var d=h.join(".");return 0===h.length?void e(a,b,f,g):void(void 0===a&&(a=f[b]=c.makeBindable({})),i=i.concat(a[BindChain](d,e)))})),function(){return i.map(function(a){return a()})}}}),Object.defineProperty(b,"___before",{configurable:!1,enumerable:!1,writable:!1,value:function ___before(a){var c=b.___before___.length;b.___before___.push(a);var d=!1;return function(){d||(d=!0,delete b.___before___[c])}}}),Object.defineProperty(b,"___after",{configurable:!1,enumerable:!1,writable:!1,value:function ___after(a){var c=b.___after___.length;b.___after___.push(a);var d=!1;return function(){d||(d=!0,delete b.___after___[c])}}});Object.defineProperty(b,"isBound",{configurable:!1,enumerable:!1,writable:!1,value:function isBound(){for(var a in b[BindingAll])if(b[BindingAll][a])return!0;for(var c in b[Binding])for(var d in b[Binding][c])if(b[Binding][c][d])return!0;return!1}});var e=function(c){b[c]&&b[c]instanceof Object&&!b[c]instanceof Promise&&!excludedClasses.filter(function(a){return b[c]instanceof a}).length&&Object.isExtensible(b[c])&&!Object.isSealed(b[c])&&(b[c]=a.make(b[c]))};for(var o in b)e(o);var f=function(c,d,e){if(d===Original)return!0;if(void 0!==b[Deck][d]&&b[Deck][d]===e)return!0;if("string"==typeof d&&"___"===d.substring(0,3)&&"___"===d.slice(-3))return!0;if(c[d]===e)return!0;for(var j in e&&e instanceof Object&&!excludedClasses.filter(function(a){return b instanceof a}).length&&Object.isExtensible(b)&&!Object.isSealed(b)&&(e=a.makeBindable(e)),b[Deck][d]=e,b[BindingAll])b[BindingAll][j]&&b[BindingAll][j](e,d,c,!1);var f=!1;if(d in b[Binding])for(var k in b[Binding][d])b[Binding][d]&&b[Binding][d][k]&&!1===b[Binding][d][k](e,d,c,!1,c[d])&&(f=!0);if(delete b[Deck][d],!f){var g=Object.getOwnPropertyDescriptor(c,d),h=c instanceof File&&"lastModifiedDate"==d;h||g&&!g.writable||c[d]!==e||(c[d]=e)}var i=Reflect.set(c,d,e);if(Array.isArray(c)&&b[Binding].length)for(var l in b[Binding].length){var m=b[Binding].length[l];m(c.length,"length",c,!1,c.length)}return i},g=function(a,c){if(!(c in a))return!0;for(var d in b[BindingAll])b[BindingAll][d](void 0,c,a,!0,a[c]);if(c in b[Binding])for(var e in b[Binding][c])b[Binding][c][e]&&b[Binding][c][e](void 0,c,a,!0,a[c]);return delete a[c],!0},h=function(c,d){for(var f in c.___before___)c.___before___[f](c,"constructor",b[Stack],void 0,d);var e=a.make(_construct(c[Original],_toConsumableArray(d)));for(var g in c.___after___)c.___after___[g](c,"constructor",b[Stack],e,d);return e},j=b[Descriptors],k=b[Wrapped],l=b[Stack],m=function(c,d){if(k[d])return k[d];if(d===Ref||d===Original||"apply"===d||"isBound"===d||"bindTo"===d||"__proto__"===d)return b[d];var e;return j.has(d)?e=j.get(d):(e=Object.getOwnPropertyDescriptor(b,d),j.set(d,e)),!e||e.configurable||e.writable?OnAllGet in b?b[OnAllGet](d):OnGet in b&&!(d in b)?b[OnGet](d):!e||e.configurable||e.writable?"function"==typeof b[d]?(Object.defineProperty(b[Unwrapped],d,{configurable:!1,enumerable:!1,writable:!1,value:b[d]}),k[d]=a.make(function(){var a=Set.prototype[Symbol.iterator],c=Map.prototype[Symbol.iterator],e="function"==typeof Promise&&b instanceof Promise||"function"==typeof Map&&b instanceof Map||"function"==typeof Set&&b instanceof Set||"function"==typeof c&&b.prototype===c||"function"==typeof a&&b.prototype===a||"function"==typeof a&&b.prototype===a||"function"==typeof WeakMap&&b instanceof WeakMap||"function"==typeof WeakSet&&b instanceof WeakSet||"function"==typeof Date&&b instanceof Date||"function"==typeof TypedArray&&b instanceof TypedArray||"function"==typeof ArrayBuffer&&b instanceof ArrayBuffer||"function"==typeof EventTarget&&b instanceof EventTarget||"function"==typeof ResizeObserver&&b instanceof ResizeObserver||"function"==typeof MutationObserver&&b instanceof MutationObserver||"function"==typeof PerformanceObserver&&b instanceof PerformanceObserver||"function"==typeof IntersectionObserver&&b instanceof IntersectionObserver||"function"==typeof b[Symbol.iterator]&&"next"===d// Map.prototype[@@iterator]
?b:b[Ref];b[Executing]=d,l.unshift(d);for(var f=arguments.length,g=Array(f),h=0;h<f;h++)g[h]=arguments[h];for(var m in b.___before___)b.___before___[m](b,d,l,b,g);var i;if(new.target)i=_construct(b[Unwrapped][d],g);else{var j=Object.getPrototypeOf(b),k=j[d]===b[d];i=k?b[d].apply(e||b,g):b[d].apply(b,g)}for(var n in b.___after___)b.___after___[n](b,d,l,b,g);return b[Executing]=null,l.shift(),i}),k[d]):b[d]:(k[d]=b[d],k[d]):b[d]},n=function(a){return GetProto in b?b[GetProto]:Reflect.getPrototypeOf(a)};return Object.defineProperty(b,Ref,{configurable:!1,enumerable:!1,writable:!1,value:new Proxy(b,{get:m,set:f,construct:h,getPrototypeOf:n,deleteProperty:g})}),b[Ref]}},{key:"clearBindings",value:function clearBindings(a){var b=function maps(a){return function(){for(var b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];return c.map(a)}}(function clearObj(a){return Object.keys(a).map(function(b){return delete a[b]})});b(a[Wrapped],a[Binding],a[BindingAll],a.___after___,a.___before___)}},{key:"resolve",value:function resolve(a,b){for(var c,d=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2],e=b.split("."),f=e[0];e.length;){if(d&&1===e.length){var g=this.makeBindable(a);return[g,e.shift(),f]}c=e.shift(),!(!c in a)&&a[c]&&a[c]instanceof Object||(a[c]={}),a=this.makeBindable(a[c])}return[this.makeBindable(a),c,f]}},{key:"wrapDelayCallback",value:function wrapDelayCallback(a,b){return function(){for(var c=arguments.length,d=Array(c),e=0;e<c;e++)d[e]=arguments[e];return setTimeout(function(){return a.apply(void 0,d)},b)}}},{key:"wrapThrottleCallback",value:function wrapThrottleCallback(a,b){var c=this;return this.throttles.set(a,!1),function(){c.throttles.get(a,!0)||(a.apply(void 0,arguments),c.throttles.set(a,!0),setTimeout(function(){c.throttles.set(a,!1)},b))}}},{key:"wrapWaitCallback",value:function wrapWaitCallback(a,b){var c=this;return function(){for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];var g;(g=c.waiters.get(a))&&(c.waiters["delete"](a),clearTimeout(g)),g=setTimeout(function(){return a.apply(void 0,e)},b),c.waiters.set(a,g)}}},{key:"wrapFrameCallback",value:function wrapFrameCallback(a){return function(){for(var b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];requestAnimationFrame(function(){return a.apply(void 0,c)})}}},{key:"wrapIdleCallback",value:function wrapIdleCallback(a){return function(){for(var b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];// Compatibility for Safari 08/2020
var e=window.requestIdleCallback||requestAnimationFrame;e(function(){return a.apply(void 0,c)})}}}]),a}();exports.Bindable=Bindable,_defineProperty(Bindable,"waiters",new WeakMap),_defineProperty(Bindable,"throttles",new WeakMap),Object.defineProperty(Bindable,"OnGet",{configurable:!1,enumerable:!1,writable:!1,value:OnGet}),Object.defineProperty(Bindable,"GetProto",{configurable:!1,enumerable:!1,writable:!1,value:GetProto}),Object.defineProperty(Bindable,"OnAllGet",{configurable:!1,enumerable:!1,writable:!1,value:OnAllGet});
});

require.register("base/Cache.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Cache=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Cache=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"store",value:function store(a,b,c){var d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:"standard",e=0;c&&(e=1e3*c+new Date().getTime()),this.bucket||(this.bucket={}),this.bucket[d]||(this.bucket[d]={}),this.bucket[d][a]={expiration:e,value:b}}},{key:"load",value:function load(a){var b=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:"standard";// console.log(
// 	`Checking cache for ${key} in ${bucket}.`
// 	, this.bucket
// );
return this.bucket&&this.bucket[c]&&this.bucket[c][a]&&(0==this.bucket[c][a].expiration||this.bucket[c][a].expiration>new Date().getTime())?this.bucket[c][a].value:b}}]),a}();exports.Cache=Cache;
});

;require.register("base/Cookie.js", function(exports, require, module) {
"use strict";var _Bindable=require("./Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Cookie=void 0;function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Cookie=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"set",value:function set(b,c){a.jar[b]=c}},{key:"get",value:function get(b){return a.jar[b]}},{key:"delete",value:function _delete(b){delete a.jar[b]}}]),a}();exports.Cookie=Cookie;Cookie.jar=Cookie.jar||_Bindable.Bindable.make({}),document.cookie&&"data"!==window.location.href.substr(0,4)&&(document.cookie.split(";").map(function(a){var b=a.split("="),c=_slicedToArray(b,2),d=c[0],e=c[1];try{e=JSON.parse(e)}catch(a){e=e}d=d.trim(),Cookie.jar[decodeURIComponent(d)]=e}),Cookie.jar.bindTo(function(a,b,c,e){document.cookie=e?"".concat(encodeURIComponent(b),"=;expires=").concat(new Date(0)):"".concat(encodeURIComponent(b),"=").concat(a)}));
});

;require.register("base/Dom.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Dom=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var traversals=0,Dom=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"mapTags",value:function mapTags(a,b,c,d,e){var f=[],g=!0;d&&(g=!1);for(var h=!1,i=document.createTreeWalker(a,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,{acceptNode:function acceptNode(a){if(!g)if(a===d)g=!0;else return NodeFilter.FILTER_SKIP;return e&&a===e&&(h=!0),h?NodeFilter.FILTER_SKIP:b?a instanceof Element&&a.matches(b)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP:NodeFilter.FILTER_ACCEPT}},!1),j=traversals++;i.nextNode();)f.push(c(i.currentNode,i));return f}},{key:"dispatchEvent",value:function dispatchEvent(b,c){b.dispatchEvent(c),a.mapTags(b,!1,function(a){a.dispatchEvent(c)})}}]),a}();exports.Dom=Dom;
});

;require.register("base/Import.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Import=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Import=/*#__PURE__*/function(){function a(b){if(_classCallCheck(this,a),console.log(this.__proto__.constructor),this.__proto__.constructor.instances[b])return this.__proto__.constructor.instances[b];this.uri=b;var c=document.createElement("script");c.setAttribute("src",this.uri),this.ready=new Promise(function(a,b){c.addEventListener("load",function(){return a(c)}),c.addEventListener("error",function(a){console.error(a),b(a)})}),this.tag=c,this.attached=!1,this.__proto__.constructor.instances[b]=this}return _createClass(a,[{key:"attach",value:function attach(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null;this.attached||(a=a||document.head,a.append(this.tag),this.attached=!0)}}]),a}();exports.Import=Import,Import.instances={};
});

require.register("base/Mixin.js", function(exports, require, module) {
"use strict";var _Bindable=require("./Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Mixin=void 0;function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Constructor=Symbol("constructor"),MixinList=Symbol("mixinList"),Mixin=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"from",value:function from(b){for(var c=arguments.length,d=Array(1<c?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e];var f=/*#__PURE__*/function(b){function c(){var b;_classCallCheck(this,c);for(var f=arguments.length,g=Array(f),h=0;h<f;h++)g[h]=arguments[h];var i,j=b=e.call.apply(e,[this].concat(g)),k=_createForOfIteratorHelper(d);try{for(k.s();!(i=k.n()).done;){var l=i.value;switch(l[a.Constructor]&&l[a.Constructor].apply(_assertThisInitialized(b)),_typeof(l)){// case 'function':
// 	this.mixClass(mixin, newClass);
// 	break;
case"object":a.mixObject(l,_assertThisInitialized(b));}}}catch(a){k.e(a)}finally{k.f()}return _possibleConstructorReturn(b,j)}_inherits(c,b);var e=_createSuper(c);return c}(b);return f}},{key:"to",value:function to(a){for(var b={},c=arguments.length,d=Array(1<c?c-1:0),e=1;e<c;e++)d[e-1]=arguments[e];d.map(function(c){switch(_typeof(c)){case"object":Object.assign(b,Object.getOwnPropertyDescriptors(c));break;case"function":Object.assign(b,Object.getOwnPropertyDescriptors(c.prototype));}delete b.constructor,Object.defineProperties(a.prototype,b)})}},{key:"with",value:function _with(){for(var a=arguments.length,b=Array(a),c=0;c<a;c++)b[c]=arguments[c];return this.from.apply(this,[Object].concat(b))}},{key:"mixObject",value:function mixObject(a,b){var c,d=_createForOfIteratorHelper(Object.getOwnPropertyNames(a));try{for(d.s();!(c=d.n()).done;){var g=c.value;if("function"==typeof a[g]){b[g]=a[g].bind(b);continue}b[g]=a[g]}}catch(a){d.e(a)}finally{d.f()}var e,f=_createForOfIteratorHelper(Object.getOwnPropertySymbols(a));try{for(f.s();!(e=f.n()).done;){var h=e.value;if("function"==typeof a[h]){b[h]=a[h].bind(b);continue}b[h]=a[h]}}catch(a){f.e(a)}finally{f.f()}}},{key:"mixClass",value:function mixClass(a,b){var c,d=_createForOfIteratorHelper(Object.getOwnPropertyNames(a.prototype));try{for(d.s();!(c=d.n()).done;){var o=c.value;b.prototype[o]=a.prototype[o].bind(b.prototype)}}catch(a){d.e(a)}finally{d.f()}var e,f=_createForOfIteratorHelper(Object.getOwnPropertySymbols(a.prototype));try{for(f.s();!(e=f.n()).done;){var p=e.value;b.prototype[p]=a.prototype[p].bind(b.prototype)}}catch(a){f.e(a)}finally{f.f()}var g,h=_createForOfIteratorHelper(Object.getOwnPropertyNames(a));try{var i=function(){var c=g.value;if("function"!=typeof a[c])return"continue";var d=b[c]||!1,e=a[c].bind(b);b[c]=function(){return d&&d.apply(void 0,arguments),e.apply(void 0,arguments)}};for(h.s();!(g=h.n()).done;){var j=i()}}catch(a){h.e(a)}finally{h.f()}var k,l=_createForOfIteratorHelper(Object.getOwnPropertySymbols(a));try{var m=function(){var c=k.value;if("function"!=typeof a[c])return"continue";var d=b[c]||!1,e=a[c].bind(b);b[c]=function(){return d&&d.apply(void 0,arguments),e.apply(void 0,arguments)}};for(l.s();!(k=l.n()).done;){var n=m()}}catch(a){l.e(a)}finally{l.f()}}},{key:"mix",value:function mix(a){for(var b={},c={},d=_Bindable.Bindable.makeBindable(a),e=function(e){var f,g=Object.getOwnPropertyNames(e.prototype),h=Object.getOwnPropertyNames(e),i=/^(before|after)__(.+)/,j=_createForOfIteratorHelper(h);try{var k=function(){var c=f.value,g=c.match(i);if(g){switch(g[1]){case"before":d.___before(function(b,d,f,h,i){if(d===g[2]){var a=e[c].bind(h);return a.apply(void 0,_toConsumableArray(i))}});break;case"after":d.___after(function(b,d,f,h,i){if(d===g[2]){var a=e[c].bind(h);return a.apply(void 0,_toConsumableArray(i))}});}return"continue"}return b[c]?"continue":"function"==typeof e[c]?void(b[c]=e[c]):"continue"};for(j.s();!(f=j.n()).done;){var l=k()}}catch(a){j.e(a)}finally{j.f()}var m,n=_createForOfIteratorHelper(g);try{var o=function(){var b=m.value,f=b.match(i);if(f){switch(f[1]){case"before":d.___before(function(c,d,g,h,i){if(d===f[2]){var a=e.prototype[b].bind(h);return a.apply(void 0,_toConsumableArray(i))}});break;case"after":d.___after(function(c,d,g,h,i){if(d===f[2]){var a=e.prototype[b].bind(h);return a.apply(void 0,_toConsumableArray(i))}});}return"continue"}return c[b]?"continue":"function"==typeof e.prototype[b]?void(c[b]=e.prototype[b]):"continue"};for(n.s();!(m=n.n()).done;){var p=o()}}catch(a){n.e(a)}finally{n.f()}},f=this;f&&f.prototype;f=Object.getPrototypeOf(f))e(f);for(var h in b)a[h]=b[h].bind(a);var g=function(b){a.prototype[b]=function(){for(var a=arguments.length,d=Array(a),e=0;e<a;e++)d[e]=arguments[e];return c[b].apply(this,d)}};for(var i in c)g(i);return d}}]),a}();exports.Mixin=Mixin,Mixin.Constructor=Constructor;
});

require.register("base/Model.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Model=void 0;var _Cache=require("./Cache"),_Bindable=require("./Bindable"),_Repository=require("./Repository");function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Model=/*#__PURE__*/function(){function a(b){_classCallCheck(this,a),this.repository=b}return _createClass(a,[{key:"consume",value:function consume(b){for(var e in b){var f=b[e];if(b[e]instanceof Object&&b[e]["class"]&&b[e].publicId){var c="".concat(b[e]["class"],"::").concat(b[e].publidId),d=_Cache.Cache.load(c,!1,"model-type-repo");f=_Bindable.Bindable.makeBindable(new a(this.repository)),d&&(f=d),f.consume(b[e]),_Cache.Cache.store(c,f,0,"model-type-repo")}this[e]=f}}}]),a}();exports.Model=Model;
});

;require.register("base/Repository.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Repository=void 0;var _Bindable=require("./Bindable"),_Router=require("./Router"),_Cache=require("./Cache"),_Model=require("./Model"),_Bag=require("./Bag"),_Form=require("../form/Form"),_FormWrapper=require("../form/multiField/FormWrapper");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var objects={},Repository=/*#__PURE__*/function(){function a(b){_classCallCheck(this,a),this.uri=b}return _createClass(a,[{key:"get",value:function get(b){var c=this,d=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},f=this.uri+"/"+b,g=_Cache.Cache.load(f+_Router.Router.queryToString(_Router.Router.queryOver(e),!0),!1,"model-uri-repo");return!d&&g?Promise.resolve(g):a.request(f,e).then(function(a){return c.extractModel(a.body)})}},{key:"page",value:function page(){var b=this,c=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,d=1<arguments.length?arguments[1]:void 0;return a.request(this.uri,d).then(function(a){var c=[];for(var d in a.body){var e=a.body[d];c.push(b.extractModel(e))}return a.body=c,a})}},{key:"edit",value:function edit(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},e=this.uri+"/create";// console.log(resourceUri);
return b&&(e=this.uri+"/"+b+"/edit"),c?a.request(e,{api:"json"},c).then(function(a){return a.body}):a.request(e).then(function(a){var b=new _Form.Form(a.meta.form,d);// let model = this.extractModel(response.body);
return new _FormWrapper.FormWrapper(b,e,"POST",d)})}},{key:"extractModel",value:function extractModel(a){var b=_Bindable.Bindable.makeBindable(new _Model.Model(this));b.consume(a);this.uri+"/"+b.publicId;// Cache.store(
// 	resourceUri
// 	, model
// 	, 10
// 	, 'model-uri-repo'
// );
if(b["class"])var c="".concat(b["class"],"::").concat(b.publidId),d=_Cache.Cache.load(c,!1,"model-type-repo");// if(cached)
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
return b}// static get xhrs(){
// 	return this.xhrs = this.xhrs || [];
// }
}],[{key:"loadPage",value:function loadPage(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},b=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];return this.request(this.uri,a).then(function(a){return a;// return response.map((skeleton) => new Model(skeleton));
})}},{key:"domCache",value:function domCache(){// console.log(uri, content);
}},{key:"load",value:function load(a){!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];return this.objects=this.objects||{},this.objects[this.uri]=this.objects[this.uri]||{},this.objects[this.uri][a]?Promise.resolve(this.objects[this.uri][a]):this.request(this.uri+"/"+a).then(function(){// let model = new Model(response);
// return this.objects[this.uri][id] = model;
})}},{key:"form",value:function form(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,b=this.uri+"/create";return a&&(b=this.uri+"/"+a+"/edit"),this.request(b).then(function(a){return a})}},{key:"clearCache",value:function clearCache(){this.objects&&this.objects[this.uri]&&(this.objects[this.uri]={})}},{key:"encode",value:function encode(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;for(var d in c||(c=new FormData),a){var e=d;b&&(e="".concat(b,"[").concat(e,"]")),a[d]&&"object"!==_typeof(a[d])?c.append(e,a[d]):this.encode(a[d],e,c)}return c}},{key:"onResponse",value:function onResponse(a){return this._onResponse||(this._onResponse=new _Bag.Bag),this._onResponse.add(a)}},{key:"request",value:function request(a){var b=this,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,e=!(3<arguments.length&&void 0!==arguments[3])||arguments[3],f=4<arguments.length&&void 0!==arguments[4]?arguments[4]:{},g="GET",h="",i=null,j={};c&&(j=c),this._onResponse||(this._onResponse=new _Bag.Bag),this.runningRequests||(this.runningRequests={}),j.api=j.api||"json",h=Object.keys(j).map(function(a){return encodeURIComponent(a)+"="+encodeURIComponent(j[a])}).join("&");var k=a;// let postString = '';
if(k=a+"?"+h,!d&&this.runningRequests[k])return this.runningRequests[k];d&&(e=!1,g="POST",i=d instanceof FormData?d:this.encode(d));var l=new XMLHttpRequest;if("responseType"in f&&(l.responseType=f.responseType),!d&&e&&this.cache&&this.cache[k])return Promise.resolve(this.cache[k]);var m="script[data-uri=\""+k+"\"]",n=document.querySelector(m);if(!d&&e&&n){var q=JSON.parse(n.innerText);return Promise.resolve(q)}l.withCredentials=!("withCredentials"in f)||f.withCredentials;var o=document.createElement("a");o.href=k,d||(l.timeout=f.timeout||15e3,this.xhrs[k]=l);var p=new Promise(function(a,c){if(d&&"progressUp"in f&&(l.upload.onprogress=f.progressUp),"progressDown"in f&&(l.onprogress=f.progressDown),l.onreadystatechange=function(){var d,e=200;if(4===l.readyState)if(delete b.xhrs[k],delete b.runningRequests[k],b.cache||(b.cache={}),"application/json"!=l.getResponseHeader("Content-Type")&&"application/json; charset=utf-8"!=l.getResponseHeader("Content-Type")&&"text/json"!=l.getResponseHeader("Content-Type")&&"text/json; charset=utf-8"!=l.getResponseHeader("Content-Type")){var h=b._onResponse.items();for(var j in h)h[j](l,!0);l.status===e?a(l):c(l)}else if(d=JSON.parse(l.responseText),d&&0==d.code){var f=document.querySelector("script[data-uri=\""+k+"\"]"),g=window.prerenderer||navigator.userAgent.match(/prerender/i);g&&(window.prerenderer=window.prerenderer||!0,!f&&(f=document.createElement("script"),f.type="text/json",f.setAttribute("data-hack","application/ld+json-NOT!"),f.setAttribute("data-uri",k),document.head.appendChild(f)),f.innerText=JSON.stringify(d));var m=b._onResponse.items();for(var n in m)m[n](d,!0);d._http=l.status,l.status===e?a(d):c(d)}else{var i=b._onResponse.items();for(var o in i)i[o](d,!0);c(d)}},l.open(g,k,!0),f.headers)for(var e in f.headers)l.setRequestHeader(e,f.headers[e]);l.send(i)});return d||(this.runningRequests[k]=p),p}},{key:"cancel",value:function cancel(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:/^.$/;for(var b in this.xhrs)this.xhrs[b]&&b.match(a)&&(this.xhrs[b].abort(),delete this.xhrs[b]);// this.xhrs = [];
}}]),a}();exports.Repository=Repository,Repository.xhrs=[];
});

require.register("base/Router.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Router=void 0;var _View=require("./View"),_Cache=require("./Cache"),_Config=require("./Config"),_Routes=require("./Routes");function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var NotFoundError=Symbol("NotFound"),InternalError=Symbol("Internal"),Router=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,null,[{key:"wait",value:function wait(a){var b=this,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"DOMContentLoaded",d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:document;d.addEventListener(c,function(){b.listen(a)})}},{key:"listen",value:function(a){var b=this,c=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1];this.routes=c,Object.assign(this.query,this.queryOver({}));var d=function(c){for(var d in c.preventDefault(),c.state&&"routedId"in c.state?c.state.routedId<=b.routeCount?(b.history.splice(c.state.routedId),b.routeCount=c.state.routedId):c.state.routedId>b.routeCount&&(b.history.push(c.state.prev),b.routeCount=c.state.routedId):null!==b.prevPath&&b.prevPath!==location.pathname&&b.history.push(b.prevPath),"null"===location.origin?b.match(b.nextPath,a):b.match(location.pathname,a),b.query)delete b.query[d];Object.assign(b.query,b.queryOver({}))};window.addEventListener("popstate",d),window.addEventListener("cvUrlChanged",d);var e="null"!==location.origin&&location.pathname+location.search;location.origin&&location.hash&&(e+=location.hash),this.go(!1===e?"/":e)}},{key:"go",value:function go(a,b){var c=_Config.Config.get("title");for(var d in c&&(document.title=c),"null"===location.origin?this.nextPath=a:2===b&&location.pathname!==a?history.replaceState({routedId:this.routeCount,prev:this.prevPath,url:location.pathname},null,a):location.pathname!==a&&history.pushState({routedId:++this.routeCount,prev:this.prevPath,url:location.pathname},null,a),b||(!1===b&&(this.path=null),"#"===a.substring(0,1)?window.dispatchEvent(new HashChangeEvent("hashchange")):window.dispatchEvent(new CustomEvent("cvUrlChanged"))),this.query)delete this.query[d];Object.assign(this.query,this.queryOver({})),this.prevPath=a}},{key:"match",value:function match(a,b){var c=this,d=!!(2<arguments.length&&void 0!==arguments[2])&&arguments[2];if(this.path!==a||d){this.queryString=location.search,this.path=a;var e=this.prevPath,f=b.args.content,g=this.routes||b.routes||_Routes.Routes.dump(),h=new URLSearchParams(location.search);for(var q in this.query)delete this.query[q];Object.assign(this.query,this.queryOver({}));var k={},l=!1,m="";for(var i in a=a.substr(1).split("/"),this.query)k[i]=this.query[i];L1:for(var r in g){var s=r.split("/");if(!(s.length<a.length&&"*"!==s[s.length-1])){L2:for(var t in s)if("%"==s[t].substr(0,1)){var n=null,o=/^%(\w+)\??/.exec(s[t]);if(o&&o[1]&&(n=o[1]),!n)throw new Error("".concat(s[t]," is not a valid argument segment in route \"").concat(r,"\""));if(!!a[t])k[n]=a[t];else if("?"==s[t].substr(s[t].length-1,1))k[n]="";else continue L1}else if("*"!==s[t]&&a[t]!==s[t])continue L1;l=r,m=g[r],"*"===s[s.length-1]&&(k.pathparts=a.slice(s.length-1));break}}var p=new CustomEvent("cvRouteStart",{cancelable:!0,detail:{path:a,prev:e,root:b,selected:l,routes:g}});if(document.dispatchEvent(p)){if(!d&&b&&f&&m instanceof Object&&f instanceof m&&!(m instanceof Promise)&&f.update(k))return b.args.content=f,!0;try{l in g||(g[l]=g[NotFoundError]);var j=function(a){var b=!1;return b="function"==typeof g[a]?g[a].prototype instanceof _View.View?new g[a](k):g[a](k):g[a],b};return m=j(l),!1===m&&(m=j(NotFoundError)),m instanceof Promise?m.then(function(e){c.update(b,a,e,g,l,k,d)})["catch"](function(f){throw document.dispatchEvent(new CustomEvent("cvRouteError",{detail:{error:f,path:a,prev:e,view:b,routes:g,selected:l}})),c.update(b,a,window.devMode?f+"":"Error: 500",g,l,k,d),f}):this.update(b,a,m,g,l,k,d)}catch(c){throw document.dispatchEvent(new CustomEvent("cvRouteError",{detail:{error:c,path:a,prev:e,view:b,routes:g,selected:l}})),this.update(b,a,window.devMode?c+"":"Error: 500",g,l,k,d),c}}}}},{key:"update",value:function update(a,b,c,d,e,f,g){if(a){var h=this.prevPath,i=new CustomEvent("cvRoute",{cancelable:!0,detail:{result:c,path:b,prev:h,view:a,routes:d,selected:e}});!1!==c&&(a.args.content instanceof _View.View&&(a.args.content.pause(!0),a.args.content.remove()),document.dispatchEvent(i)&&(a.args.content=c),c instanceof _View.View&&(c.pause(!1),c.update(f,g)));var j=new CustomEvent("cvRouteEnd",{cancelable:!0,detail:{result:c,path:b,prev:h,view:a,routes:d,selected:e}});document.dispatchEvent(j)}}},{key:"queryOver",value:function queryOver(){var a,b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},c=new URLSearchParams(location.search),d={},e={},f=_createForOfIteratorHelper(c);try{for(f.s();!(a=f.n()).done;){var g=a.value;e[g[0]]=g[1]}}catch(a){f.e(a)}finally{f.f()}return d=Object.assign(d,e,b),delete d.api,d;// for(let i in query)
// {
// 	finalArgs[i] = query[i];
// }
// for(let i in args)
// {
// 	finalArgs[i] = args[i];
// }
}},{key:"queryToString",value:function queryToString(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},b=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],c=[],d=a;for(var e in b||(d=this.queryOver(a)),d)""!==d[e]&&c.push(e+"="+encodeURIComponent(d[e]));return c.join("&")}},{key:"setQuery",value:function setQuery(a,b,c){var d=this.queryOver();d[a]=b,void 0===b&&delete d[a];var e=this.queryToString(d,!0);this.go(location.pathname+(e?"?"+e:""),c)}}]),a}();exports.Router=Router,Object.defineProperty(Router,"query",{configurable:!1,enumerable:!1,writable:!1,value:{}}),Object.defineProperty(Router,"history",{configurable:!1,enumerable:!1,writable:!1,value:[]}),Object.defineProperty(Router,"routeCount",{configurable:!1,enumerable:!1,writable:!0,value:0}),Object.defineProperty(Router,"prevPath",{configurable:!1,enumerable:!1,writable:!0,value:null}),Object.defineProperty(Router,"queryString",{configurable:!1,enumerable:!1,writable:!0,value:null}),Object.defineProperty(Router,"InternalError",{configurable:!1,enumerable:!1,writable:!1,value:InternalError}),Object.defineProperty(Router,"NotFoundError",{configurable:!1,enumerable:!1,writable:!1,value:NotFoundError});
});

require.register("base/RuleSet.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.RuleSet=void 0;var _Dom=require("./Dom"),_Tag=require("./Tag"),_View=require("./View");function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var RuleSet=/*#__PURE__*/function(){function a(){_classCallCheck(this,a)}return _createClass(a,[{key:"add",value:function add(a,b){return this.rules=this.rules||{},this.rules[a]=this.rules[a]||[],this.rules[a].push(b),this}},{key:"apply",value:function apply(){var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:document,c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;for(var j in a.apply(b,c),this.rules)for(var k in this.rules[j]){var d,e=this.rules[j][k],f=a.wrap(b,e,c),g=b.querySelectorAll(j),h=_createForOfIteratorHelper(g);try{for(h.s();!(d=h.n()).done;){var i=d.value;f(i)}}catch(a){h.e(a)}finally{h.f()}}}}],[{key:"add",value:function add(a,b){return this.globalRules=this.globalRules||{},this.globalRules[a]=this.globalRules[a]||[],this.globalRules[a].push(b),this}},{key:"apply",value:function apply(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:document,b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;for(var h in this.globalRules)for(var j in this.globalRules[h]){var c,d=this.globalRules[h][j],e=this.wrap(a,d,b),f=a.querySelectorAll(h),g=_createForOfIteratorHelper(f);try{for(g.s();!(c=g.n()).done;){var i=c.value;e(i)}}catch(a){g.e(a)}finally{g.f()}}}},{key:"wait",value:function wait(){var a=this,b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"DOMContentLoaded",c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:document,d=function(b,c){return function(){return c.removeEventListener(b,d),a.apply()}}(b,c);c.addEventListener(b,d)}},{key:"wrap",value:function wrap(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null;return(b instanceof _View.View||b&&b.prototype&&b.prototype instanceof _View.View)&&(b=function(a){return function(){return a}}(b)),function(a){for(var k in"undefined"==typeof a.___cvApplied___&&Object.defineProperty(a,"___cvApplied___",{enumerable:!1,writable:!1,value:[]}),a.___cvApplied___)if(b==a.___cvApplied___[k])return;var d,e;c&&(d=e=c,c.viewList&&(e=c.viewList.parent)),e&&e.onRemove(function(){return a.___cvApplied___.splice(0)});var f=new _Tag.Tag(a,e,null,void 0,d),g=f.element.parentNode,h=f.element.nextSibling,j=b(f);if(!1!==j&&a.___cvApplied___.push(b),j instanceof HTMLElement&&(j=new _Tag.Tag(j)),j instanceof _Tag.Tag){if(!j.element.contains(f.element)){for(;f.element.firstChild;)j.element.appendChild(f.element.firstChild);f.remove()}h?g.insertBefore(j.element,h):g.appendChild(j.element)}j&&j.prototype&&j.prototype instanceof _View.View&&(j=new j({},c)),j instanceof _View.View&&(c&&(c.cleanup.push(function(a){return function(){a.remove()}}(j)),c.cleanup.push(c.args.bindTo(function(a,b,c){c[b]=a,j.args[b]=a})),c.cleanup.push(j.args.bindTo(function(a,b,d){d[b]=a,c.args[b]=a}))),f.clear(),j.render(f.element))}}}]),a}();exports.RuleSet=RuleSet;
});

;require.register("base/SetMap.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.SetMap=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var SetMap=/*#__PURE__*/function(){function a(){_classCallCheck(this,a),_defineProperty(this,"_set",new Set),_defineProperty(this,"_map",new Map)}return _createClass(a,[{key:"has",value:function has(a){return this._map.has(a)}},{key:"get",value:function get(a){return this._map.get(a)}},{key:"add",value:function add(a,b){var c=this._map.get(a);return c||this._map.set(a,c=new Set),this._set.add(b),c.add(b)}},{key:"remove",value:function remove(a,b){var c=this._map.get(a);if(c){var d=c.remove(b);return c.size||this._map["delete"](a),this._set.remove(b),d}}},{key:"values",value:function values(){return this._set.values()}}]),a}();exports.SetMap=SetMap;
});

;require.register("base/Tag.js", function(exports, require, module) {
"use strict";var _Bindable=require("./Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Tag=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Tag=/*#__PURE__*/function(){function a(b,c,d,e,f){var g=this;if(_classCallCheck(this,a),"string"==typeof b){var h=document.createRange().createContextualFragment(b);b=h.firstChild}return this.element=_Bindable.Bindable.makeBindable(b),this.node=this.element,this.parent=c,this.direct=f,this.ref=d,this.index=e,this.cleanup=[],this[_Bindable.Bindable.OnAllGet]=function(a){return"function"==typeof g[a]?g[a]:g.node&&"function"==typeof g.node[a]?function(){var b;return(b=g.node)[a].apply(b,arguments)}:g.node&&a in g.node?g.node[a]:g[a]},this.style=function(a){return _Bindable.Bindable.make(function(b){if(a.node){var c=new CustomEvent("cvStyle",{detail:{styles:b}});if(a.node.dispatchEvent(c))for(var d in b)"-"===d[0]&&a.node.style.setProperty(d,b[d]),a.node.style[d]=b[d]}})}(this),this.proxy=_Bindable.Bindable.make(this),this.proxy.style.bindTo(function(a,b){g.element.style[b]=a}),this.proxy.bindTo(function(a,c){return c in b&&(b[c]=a),!1}),this.proxy}return _createClass(a,[{key:"attr",value:function attr(a){for(var b in a)void 0===a[b]?this.node.removeAttribute(b):null===a[b]?this.node.setAttribute(b,""):this.node.setAttribute(b,a[b])}},{key:"remove",value:function remove(){this.node&&this.node.remove(),_Bindable.Bindable.clearBindings(this);for(var b;b=this.cleanup.shift();)b();if(this.clear(),!!this.node){var a=new Event("cvDomDetached");this.node.dispatchEvent(a),this.node=this.element=this.ref=this.parent=void 0}}},{key:"clear",value:function clear(){if(this.node)for(var a=new Event("cvDomDetached");this.node.firstChild;)this.node.firstChild.dispatchEvent(a),this.node.removeChild(this.node.firstChild)}},{key:"pause",value:function pause(){!(0<arguments.length&&void 0!==arguments[0])||arguments[0]}},{key:"listen",value:function listen(a,b,c){var d=this.node;d.addEventListener(a,b,c);var e=function(){d.removeEventListener(a,b,c)},f=function(){e(),e=function(){return console.warn("Already removed!")}};return this.parent.onRemove(function(){return f()}),f}}]),a}();exports.Tag=Tag;
});

;require.register("base/Theme.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Theme=void 0;function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Theme=/*#__PURE__*/function(){function a(b){_classCallCheck(this,a),this.key=b,this.viewMap=new Map,this.templateMap=new Map,this.fallbacks=[]}return _createClass(a,null,[{key:"get",value:function get(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:"";return this.instances||(this.instances={}),this.instances[a]||(this.instances[a]=new this(a)),this.instances[a]}}]),_createClass(a,[{key:"setFallback",value:function setFallback(){var a;return(a=this.fallbacks).push.apply(a,arguments),this}},{key:"setView",value:function setView(a,b){return this.viewMap.set(a,b),this}},{key:"getView",value:function getView(a){return this.resolve(a,"viewMap")}},{key:"setTemplate",value:function setTemplate(a,b){return this.viewMap.set(a,b),this}},{key:"getTemplate",value:function getTemplate(a){return this.resolve(a,"templateMap")}},{key:"resolve",value:function resolve(a,b){var c=a.constructor,d=this[b];if(d.has(c))return d.get(c);var e,f=!1,g=_createForOfIteratorHelper(d);try{for(g.s();!(e=g.n()).done;){var h=_slicedToArray(e.value,2),i=h[0],j=h[1];c.prototype instanceof i&&(f=j)}}catch(a){g.e(a)}finally{g.f()}if(!f){var k,l=_createForOfIteratorHelper(this.fallbacks);try{for(l.s();!(k=l.n()).done;){var m=k.value;if(f=m.resolve(a,b))return f}}catch(a){l.e(a)}finally{l.f()}}return f&&d.set(c,f),f}}]),a}();exports.Theme=Theme;
});

;require.register("base/View.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.View=void 0;var _Bindable=require("./Bindable"),_ViewList=require("./ViewList"),_Router=require("./Router"),_Dom=require("./Dom"),_Tag=require("./Tag"),_Bag=require("./Bag"),_RuleSet=require("./RuleSet"),_Mixin=require("./Mixin"),_PromiseMixin=require("../mixin/PromiseMixin"),_EventTargetMixin=require("../mixin/EventTargetMixin");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _slicedToArray(a,b){return _arrayWithHoles(a)||_iterableToArrayLimit(a,b)||_unsupportedIterableToArray(a,b)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _iterableToArrayLimit(a,b){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a)){var c=[],d=!0,e=!1,f=void 0;try{for(var g,h=a[Symbol.iterator]();!(d=(g=h.next()).done)&&(c.push(g.value),!(b&&c.length===b));d=!0);}catch(a){e=!0,f=a}finally{try{d||null==h["return"]||h["return"]()}finally{if(e)throw f}}return c}}function _arrayWithHoles(a){if(Array.isArray(a))return a}function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var dontParse=Symbol("dontParse"),expandBind=Symbol("expandBind"),uuid=Symbol("uuid"),moveIndex=0,View=/*#__PURE__*/function(a){function b(){var a,d=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;return _classCallCheck(this,b),a=c.call(this,d,e),Object.defineProperty(_assertThisInitialized(a),"args",{value:_Bindable.Bindable.make(d)}),Object.defineProperty(_assertThisInitialized(a),uuid,{value:a.uuid()}),Object.defineProperty(_assertThisInitialized(a),"attach",{value:new _Bag.Bag(function(){})}),Object.defineProperty(_assertThisInitialized(a),"detach",{value:new _Bag.Bag(function(){})}),Object.defineProperty(_assertThisInitialized(a),"_onRemove",{value:new _Bag.Bag(function(){})}),Object.defineProperty(_assertThisInitialized(a),"cleanup",{value:[]}),Object.defineProperty(_assertThisInitialized(a),"parent",{value:e}),Object.defineProperty(_assertThisInitialized(a),"views",{value:new Map}),Object.defineProperty(_assertThisInitialized(a),"viewLists",{value:new Map}),Object.defineProperty(_assertThisInitialized(a),"withViews",{value:new Map}),Object.defineProperty(_assertThisInitialized(a),"tags",{value:_Bindable.Bindable.make({})}),Object.defineProperty(_assertThisInitialized(a),"nodes",{value:_Bindable.Bindable.make([])}),Object.defineProperty(_assertThisInitialized(a),"intervals",{value:[]}),Object.defineProperty(_assertThisInitialized(a),"timeouts",{value:[]}),Object.defineProperty(_assertThisInitialized(a),"frames",{value:[]}),Object.defineProperty(_assertThisInitialized(a),"ruleSet",{value:new _RuleSet.RuleSet}),Object.defineProperty(_assertThisInitialized(a),"preRuleSet",{value:new _RuleSet.RuleSet}),Object.defineProperty(_assertThisInitialized(a),"subBindings",{value:{}}),Object.defineProperty(_assertThisInitialized(a),"templates",{value:{}}),Object.defineProperty(_assertThisInitialized(a),"eventCleanup",{value:[]}),Object.defineProperty(_assertThisInitialized(a),"interpolateRegex",{value:/(\[\[((?:\$+)?[\w\.\|-]+)\]\])/g}),Object.defineProperty(_assertThisInitialized(a),"rendered",{value:new Promise(function(b){return Object.defineProperty(_assertThisInitialized(a),"renderComplete",{value:b})})}),a.template="",a.firstNode=null,a.lastNode=null,a.viewList=null,a.mainView=null,a.preserve=!1,a.removed=!1,_possibleConstructorReturn(a,_Bindable.Bindable.make(_assertThisInitialized(a)))}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"_id",get:function get(){return this[uuid]}}],[{key:"from",value:function from(a){var b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{},c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,d=new this(b,c);return d.template=a,d}}]),_createClass(b,[{key:"onFrame",value:function onFrame(a){var b=this,d=!1,e=function(){d=!0},f=function(){b.removed||d||(!b.paused&&a(Date.now()),requestAnimationFrame(f))};return requestAnimationFrame(function(){return f(Date.now())}),this.frames.push(e),e}},{key:"onNextFrame",value:function onNextFrame(a){return requestAnimationFrame(function(){return a(Date.now())})}},{key:"onIdle",value:function onIdle(a){return requestIdleCallback(function(){return a(Date.now())})}},{key:"onTimeout",value:function onTimeout(a,b){var c=this,d=function(){c.timeouts[f].fired=!0,c.timeouts[f].callback=null,b()},e=setTimeout(d,a),f=this.timeouts.length;return this.timeouts.push({timeout:e,callback:d,time:a,fired:!1,created:new Date().getTime(),paused:!1}),e}},{key:"clearTimeout",value:function(a){function b(){return a.apply(this,arguments)}return b.toString=function(){return a.toString()},b}(function(a){for(var b in this.timeouts)a===this.timeouts[b].timeout&&(clearTimeout(this.timeouts[b].timeout),delete this.timeouts[b])})},{key:"onInterval",value:function onInterval(a,b){var c=setInterval(b,a);return this.intervals.push({timeout:c,callback:b,time:a,paused:!1}),c}},{key:"clearInterval",value:function(a){function b(){return a.apply(this,arguments)}return b.toString=function(){return a.toString()},b}(function(a){for(var b in this.intervals)a===this.intervals[b].timeout&&(clearInterval(this.intervals[b].timeout),delete this.intervals[b])})},{key:"pause",value:function pause(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:void 0;if(void 0===a&&(this.paused=!this.paused),this.paused=a,this.paused){for(var h in this.timeouts){if(this.timeouts[h].fired){delete this.timeouts[h];continue}clearTimeout(this.timeouts[h].timeout)}for(var i in this.intervals)clearInterval(this.intervals[i].timeout)}else{for(var j in this.timeouts)if(this.timeouts[j].timeout.paused){if(this.timeouts[j].fired){delete this.timeouts[j];continue}this.timeouts[j].timeout=setTimeout(this.timeouts[j].callback,this.timeouts[j].time)}for(var k in this.intervals)this.intervals[k].timeout.paused&&(this.intervals[k].timeout.paused=!1,this.intervals[k].timeout=setInterval(this.intervals[k].callback,this.intervals[k].time))}var b,c=_createForOfIteratorHelper(this.viewLists);try{for(c.s();!(b=c.n()).done;){var d=_slicedToArray(b.value,2),e=d[0],f=d[1];f.pause(!!a)}}catch(a){c.e(a)}finally{c.f()}for(var l in this.tags){if(Array.isArray(this.tags[l])){for(var g in this.tags[l])this.tags[l][g].pause(!!a);continue}this.tags[l].pause(!!a)}}},{key:"render",value:function render(){var a,c=this,d=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null;if(d instanceof b&&(d=d.firstNode.parentNode),e instanceof b&&(e=e.firstNode),this.firstNode)return this.reRender(d,e);this.dispatchEvent(new CustomEvent("render"));var f=this.template instanceof DocumentFragment?this.template.cloneNode(!0):b.templates.has(this.template),g=f?this.template instanceof DocumentFragment?f:b.templates.get(this.template).cloneNode(!0):document.createRange().createContextualFragment(this.template);if(f||this.template instanceof DocumentFragment||b.templates.set(this.template,g.cloneNode(!0)),this.mainView||this.preRuleSet.apply(g,this),this.mapTags(g),this.mainView||this.ruleSet.apply(g,this),!0===window.devMode?(this.firstNode=document.createComment("Template ".concat(this._id," Start")),this.lastNode=document.createComment("Template ".concat(this._id," End"))):(this.firstNode=document.createTextNode(""),this.lastNode=document.createTextNode("")),(a=this.nodes).push.apply(a,[this.firstNode].concat(_toConsumableArray(Array.from(g.childNodes)),[this.lastNode])),this.postRender(d),this.dispatchEvent(new CustomEvent("rendered")),!!this.dispatchAttach()){if(d){var h=d.getRootNode(),i="internal",j=!1;h.isConnected&&(j=!0,i="external"),e?(d.insertBefore(this.firstNode,e),d.insertBefore(this.lastNode,e)):(d.appendChild(this.firstNode),d.appendChild(this.lastNode)),d.insertBefore(g,this.lastNode),moveIndex++,j?(this.attached(h,d),this.dispatchAttached(h,d)):d.addEventListener("cvDomAttached",function(){c.attached(h,d),c.dispatchAttached(h,d)},{once:!0})}return this.renderComplete(this.nodes),this.nodes}}},{key:"dispatchAttach",value:function dispatchAttach(){return this.dispatchEvent(new CustomEvent("attach",{cancelable:!0,target:this}))}},{key:"dispatchAttached",value:function dispatchAttached(a,b){this.dispatchEvent(new CustomEvent("attached",{target:this}));var c=this.attach.items();for(var d in c)c[d](a,b);this.nodes.filter(function(a){return a.nodeType!==Node.COMMENT_NODE}).map(function(a){a.matches&&(_Dom.Dom.mapTags(a,!1,function(a){a.matches&&a.dispatchEvent(new Event("cvDomAttached",{target:a}))}),a.dispatchEvent(new Event("cvDomAttached",{target:a})))})}},{key:"reRender",value:function reRender(a,b){var c=this.dispatchEvent(new CustomEvent("reRender"),{cancelable:!0,target:this});if(c){var d=new DocumentFragment;if(this.firstNode.isConnected){var e=this.detach.items();for(var f in e)e[f]()}if(d.append.apply(d,_toConsumableArray(this.nodes)),a){b?(a.insertBefore(this.firstNode,b),a.insertBefore(this.lastNode,b)):(a.appendChild(this.firstNode),a.appendChild(this.lastNode)),a.insertBefore(d,this.lastNode),this.dispatchEvent(new CustomEvent("reRendered"),{cancelable:!0,target:this});var g=a.getRootNode();g.isConnected&&(this.attached(g,a),this.dispatchAttached(g,a))}return this.nodes}}},{key:"mapTags",value:function mapTags(a){var b=this;_Dom.Dom.mapTags(a,!1,function(a,c){a[dontParse]||(a.matches?(a=b.mapInterpolatableTag(a),a=a.matches("[cv-template]")&&b.mapTemplateTag(a)||a,a=a.matches("[cv-slot]")&&b.mapSlotTag(a)||a,a=a.matches("[cv-prerender]")&&b.mapPrendererTag(a)||a,a=a.matches("[cv-link]")&&b.mapLinkTag(a)||a,a=a.matches("[cv-attr]")&&b.mapAttrTag(a)||a,a=a.matches("[cv-expand]")&&b.mapExpandableTag(a)||a,a=a.matches("[cv-ref]")&&b.mapRefTag(a)||a,a=a.matches("[cv-on]")&&b.mapOnTag(a)||a,a=a.matches("[cv-each]")&&b.mapEachTag(a)||a,a=a.matches("[cv-bind]")&&b.mapBindTag(a)||a,a=a.matches("[cv-with]")&&b.mapWithTag(a)||a,a=a.matches("[cv-if]")&&b.mapIfTag(a)||a,a=a.matches("[cv-view]")&&b.mapViewTag(a)||a):a=b.mapInterpolatableTag(a),a!==c.currentNode&&(c.currentNode=a))})}},{key:"mapExpandableTag",value:function mapExpandableTag(a){/*/
		const tagCompiler = this.compileExpandableTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;
		/*/var b=a[expandBind];b&&(b(),a[expandBind]=!1);var c=_Bindable.Bindable.resolve(this.args,a.getAttribute("cv-expand"),!0),d=_slicedToArray(c,2),e=d[0],f=d[1];// let expandProperty = tag.getAttribute('cv-expand');
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
return a.removeAttribute("cv-expand"),e[f]||(e[f]={}),e[f]=_Bindable.Bindable.make(e[f]),this.onRemove(a[expandBind]=e[f].bindTo(function(b,c,e,f){return f||void 0===b?void a.removeAttribute(c,b):null===b?void a.setAttribute(c,""):void a.setAttribute(c,b)})),a;//*/
}},{key:"compileExpandableTag",value:function compileExpandableTag(a){return function(b){var c=a.cloneNode(!0),d=c.getAttribute("cv-expand"),e=_Bindable.Bindable.make(b.args[d]||{});c.removeAttribute("cv-expand");var f=function(a){if("name"===a||"type"===a)return"continue";var d=e.bindTo(a,function(a,b){return function(c){a.setAttribute(b,c)}}(c,a));b.onRemove(function(){d(),e.isBound()&&_Bindable.Bindable.clearBindings(e)})};for(var h in e){var g=f(h)}return c}}},{key:"mapAttrTag",value:function mapAttrTag(a){//*/
var b=this.compileAttrTag(a),c=b(this);return a.replaceWith(c),c;/*/

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

		//*/}},{key:"compileAttrTag",value:function compileAttrTag(a){var b=a.getAttribute("cv-attr"),c=b.split(","),d=c.map(function(a){return a.split(":")});return a.removeAttribute("cv-attr"),function(b){var c=a.cloneNode(!0),e=function(a){var e=d[a][1]||d[a][0],f=_Bindable.Bindable.resolve(b.args,e,!0),g=_slicedToArray(f,2),h=g[0],i=g[1],j=d[a][0];b.onRemove(h.bindTo(i,function(a,b,e,f){return f||void 0===a?void c.removeAttribute(j,a):null===a?void c.setAttribute(j,""):void c.setAttribute(j,a)}))};for(var f in d)e(f);return c}}},{key:"mapInterpolatableTag",value:function mapInterpolatableTag(a){var c=this,d=this.interpolateRegex;if(a.nodeType===Node.TEXT_NODE){var o=a.nodeValue;if(!this.interpolatable(o))return a;for(var e,f,g=0,h=function(){var d=e[2],f=!1,h=!1,i=d.split("|"),j=!1;if(1<i.length&&(j=c.stringTransformer(i.slice(1)),d=i[0]),"$$"===d.substr(0,2)&&(f=!0,h=!0,d=d.substr(2)),"$"===d.substr(0,1)&&(f=!0,d=d.substr(1)),"000"===d.substr(0,3))return expand=!0,d=d.substr(3),"continue";var k=o.substring(g,e.index);g=e.index+e[1].length;var l=document.createTextNode(k);l[dontParse]=!0,a.parentNode.insertBefore(l,a);var m;m=f?document.createElement("div"):document.createTextNode(""),m[dontParse]=!0;var n=c.args,p=d;if(d.match(/\./)){var q=_Bindable.Bindable.resolve(c.args,d,!0),r=_slicedToArray(q,2);n=r[0],p=r[1]}a.parentNode.insertBefore(m,a);var s=n.bindTo(p,function(d,e,g){if(g[e]!==d&&(g[e]instanceof b||g[e]instanceof Node||g[e]instanceof _Tag.Tag)&&!g[e].preserve&&g[e].remove(),m.nodeValue="",h&&!(d instanceof b)){var i=d;d=new b(c.args,c),d.template=i}if(j&&(d=j(d)),d instanceof b){var k=function(a){d.dispatchAttach()&&(d.attached(a),d.dispatchAttached())};c.attach.add(k),d.render(a.parentNode,m);var l=function(){d.preserve||d.remove()};c.onRemove(l),d.onRemove(function(){c.attach.remove(k),c._onRemove.remove(l)})}else d instanceof Node?(a.parentNode.insertBefore(d,m),c.onRemove(function(){return d.remove()})):d instanceof _Tag.Tag?(a.parentNode.insertBefore(d.node,m),c.onRemove(function(){return d.remove()})):(d instanceof Object&&d.__toString instanceof Function&&(d=d.__toString()),f?m.innerHTML=d:m.nodeValue=d);m[dontParse]=!0});c.onRemove(s)};e=d.exec(o);)f=h(),"continue"===f;var j=o.substring(g),k=document.createTextNode(j);k[dontParse]=!0,a.parentNode.insertBefore(k,a),a.nodeValue=""}if(a.nodeType===Node.ELEMENT_NODE)for(var l,m=function(b){if(!c.interpolatable(a.attributes[b].value))return"continue";for(var e=0,f=void 0,g=a.attributes[b].value,h=a.attributes[b],i={},l=[];f=d.exec(g);)l.push(g.substring(e,f.index)),i[f[2]]||(i[f[2]]=[]),i[f[2]].push(l.length),l.push(f[1]),e=f.index+f[1].length;l.push(g.substring(e));var m=function(b){var d=c.args,e=b,f=b.split("|"),g=!1,j=b;if(1<f.length&&(g=c.stringTransformer(f.slice(1)),e=f[0]),e.match(/\./)){var k=_Bindable.Bindable.resolve(c.args,e,!0),m=_slicedToArray(k,2);d=m[0],e=m[1]}// if(property.match(/\./))
// {
// 	[proxy, property] = Bindable.resolve(
// 		this.args
// 		, property
// 		, true
// 	);
// }
// console.log(this.args, property);
i[j];c.onRemove(d.bindTo(e,function(b,c,d){for(var f in g&&(b=g(b)),i)for(var k in i[j])l[i[j][k]]=d[f],c===e&&(l[i[j][k]]=b);a.setAttribute(h.name,l.join(""))})),c.onRemove(function(){d.isBound()||_Bindable.Bindable.clearBindings(d)})};for(var n in i)m(n)},n=0;n<a.attributes.length;n++)l=m(n),"continue"===l;return a}},{key:"mapRefTag",value:function mapRefTag(a){var b=a.getAttribute("cv-ref"),c=b.split(":"),d=_slicedToArray(c,3),e=d[0],f=d[1],g=void 0===f?null:f,h=d[2],i=void 0===h?null:h,j=_Tag.Tag;g&&(j=this.stringToClass(g)),a.removeAttribute("cv-ref"),Object.defineProperty(a,"___tag___",{enumerable:!1,writable:!0}),this.onRemove(function(){a.___tag___=null,a.remove()});var k=this,l=this;this.viewList&&(k=this.viewList.parent);var m=new j(a,this,e,void 0,l);for(a.___tag___=m,this.tags[e]=m;k;){!k.parent;var n=this.args[i];void 0===n?k.tags[e]=m:(!k.tags[e]&&(k.tags[e]=[]),k.tags[e][n]=m),k=k.parent}return a}},{key:"mapBindTag",value:function mapBindTag(a){var c=this,d=a.getAttribute("cv-bind"),e=this.args,f=d,g=null;if(d.match(/\./)){var h=_Bindable.Bindable.resolve(this.args,d,!0),i=_slicedToArray(h,3);e=i[0],f=i[1],g=i[2]}e!==this.args&&(this.subBindings[d]=this.subBindings[d]||[],this.onRemove(this.args.bindTo(g,function(){for(;c.subBindings.length;)c.subBindings.shift()()})));var j=!1;"$"===f.substr(0,1)&&(f=f.substr(1),j=!0);var k=e.bindTo(f,function(e,f,g,h,d){(d instanceof b||d instanceof Node||d instanceof _Tag.Tag)&&d!==e&&d.remove();var i=new CustomEvent("cvAutoChanged",{bubbles:!0});if(["INPUT","SELECT","TEXTAREA"].includes(a.tagName)){var q=a.getAttribute("type");if(q&&"checkbox"===q.toLowerCase())a.checked=!!e,a.dispatchEvent(i);else if(q&&"radio"===q.toLowerCase())a.checked=e==a.value,a.dispatchEvent(i);else if("file"!==q){if("SELECT"===a.tagName){var r=function(){for(var b,c=0;c<a.options.length;c++)b=a.options[c],b.value==e&&(a.selectedIndex=c)};r(),c.attach.add(r)}else a.value=null==e?"":e;a.dispatchEvent(i)}}else if(e instanceof b){var k,l=_createForOfIteratorHelper(a.childNodes);try{for(l.s();!(k=l.n()).done;){var s=k.value;s.remove()}}catch(a){l.e(a)}finally{l.f()}var t=function(a){e.dispatchAttach()&&(e.attached(a),e.dispatchAttached())};c.attach.add(t),e.render(a),e.onRemove(function(){return c.attach.remove(t)})}else if(e instanceof Node)a.insert(e);else if(e instanceof _Tag.Tag)a.append(e.node);else if(j){if(a.innerHTML!==e){if(e+="",a.innerHTML===e.substring(0,a.innerHTML.length))a.innerHTML+=e.substring(a.innerHTML.length);else{var m,n=_createForOfIteratorHelper(a.childNodes);try{for(n.s();!(m=n.n()).done;){var u=m.value;u.remove()}}catch(a){n.e(a)}finally{n.f()}a.innerHTML=e}_Dom.Dom.mapTags(a,!1,function(a){return a[dontParse]=!0})}}else if(a.textContent!==e){var o,p=_createForOfIteratorHelper(a.childNodes);try{for(p.s();!(o=p.n()).done;){var w=o.value;w.remove()}}catch(a){p.e(a)}finally{p.f()}a.textContent=e}});e!==this.args&&this.subBindings[d].push(k),this.onRemove(k);var l=a.getAttribute("type"),m=a.getAttribute("multiple"),n=function(b){if(b.target===a)if(l&&"checkbox"===l.toLowerCase())e[f]=!!a.checked&&b.target.getAttribute("value");else if(b.target.matches("[contenteditable=true]"))e[f]=b.target.innerHTML;else if("file"===l&&m){var c=Array.from(b.target.files),d=e[f]||_Bindable.Bindable.onDeck(e,f);if(!d||!c.length)e[f]=c;else{var g=function(a){if(c[a]!==d[a])return c[a].toJSON=function(){return{name:file[a].name,size:file[a].size,type:file[a].type,date:file[a].lastModified}},d[a]=c[a],"break"};for(var j in c){var h=g(j);if("break"===h)break}}}else if("file"===l&&!m){var i=b.target.files.item(0);i.toJSON=function(){return{name:i.name,size:i.size,type:i.type,date:i.lastModified}},e[f]=i}else e[f]=b.target.value};return"file"===l||"radio"===l?a.addEventListener("change",n):(a.addEventListener("input",n),a.addEventListener("change",n),a.addEventListener("value-changed",n)),this.onRemove(function(){"file"===l||"radio"===l?a.removeEventListener("change",n):(a.removeEventListener("input",n),a.removeEventListener("change",n),a.removeEventListener("value-changed",n))}),a.removeAttribute("cv-bind"),a}},{key:"mapOnTag",value:function mapOnTag(a){var b=this,c=a.getAttribute("cv-on")+"";return c.split(";").map(function(b){return b.split(":")}).map(function(c){c=c.map(function(b){return b.trim()});var d=c.length,e=(c.shift()+"").trim(),f=((c.shift()||e)+"").trim(),g=((c.shift()||"")+"").trim(),h=[],i=/(\w+)(?:\(([$\w\s-'",]+)\))?/.exec(f);i?(f=i[1].replace(/(^[\s\n]+|[\s\n]+$)/,""),i[2]&&(h=i[2].split(",").map(function(a){return a.trim()})),i.length):h.push("$event"),e&&1!==d||(e=f);for(var j,k=b;k;){if("function"==typeof k[f]){var l=function(){var a=k,b=f;return j=function(){a[b].apply(a,arguments)},"break"}();if("break"===l)break}if(k.parent)k=k.parent;else break}var m=function(c){var d=h.map(function(d){var e;return parseInt(d)==d?d:"event"===d||"$event"===d?c:"$view"===d?k:"$tag"===d?a:"$parent"===d?b.parent:"$subview"===d?b:d in b.args?b.args[d]:(e=/^['"]([\w-]+?)["']$/.exec(d))?e[1]:void 0});if("function"!=typeof j)throw new Error("".concat(f," is not defined on View object.")+"\nTag:\n"+"".concat(a.outerHTML));j.apply(void 0,_toConsumableArray(d))},n={};switch(g.includes("p")?n.passive=!0:g.includes("P")&&(n.passive=!1),g.includes("c")?n.capture=!0:g.includes("C")&&(n.capture=!1),g.includes("o")?n.once=!0:g.includes("O")&&(n.once=!1),e){case"_init":m();break;case"_attach":b.attach.add(m);break;case"_detach":b.detach.add(m);break;default:a.addEventListener(e,m,n),b.onRemove(function(){a.removeEventListener(e,m,n)});}return[e,f,h]}),a.removeAttribute("cv-on"),a}},{key:"mapLinkTag",value:function mapLinkTag(a){/*/
		const tagCompiler = this.compileLinkTag(tag);

		const newTag = tagCompiler(this);

		tag.replaceWith(newTag);

		return newTag;
		/*/var b=a.getAttribute("cv-link");a.setAttribute("href",b);var c=function(c){return c.preventDefault(),"http"===b.substring(0,4)||"//"===b.substring(0,2)?void window.open(a.getAttribute("href",b)):void _Router.Router.go(a.getAttribute("href"))};return a.addEventListener("click",c),this.onRemove(function(a,b){return function(){a.removeEventListener("click",b),a=void 0,b=void 0}}(a,c)),a.removeAttribute("cv-link"),a;//*/
}},{key:"compileLinkTag",value:function compileLinkTag(a){var b=a.getAttribute("cv-link");return a.removeAttribute("cv-link"),function(){var c=a.cloneNode(!0);return c.setAttribute("href",b),c}}},{key:"mapPrendererTag",value:function mapPrendererTag(a){var b=a.getAttribute("cv-prerender"),c=window.prerenderer||navigator.userAgent.match(/prerender/i);return c&&(window.prerenderer=window.prerenderer||!0),("never"===b&&c||"only"===b&&!c)&&a.parentNode.removeChild(a),a}},{key:"mapWithTag",value:function mapWithTag(a){var c=this,d=a.getAttribute("cv-with"),e=a.getAttribute("cv-carry"),f=a.getAttribute("cv-view");a.removeAttribute("cv-with"),a.removeAttribute("cv-carry"),a.removeAttribute("cv-view");var g=f?this.stringToClass(f):b,h=new DocumentFragment;_toConsumableArray(a.childNodes).map(function(a){return h.appendChild(a)});var j=[];e&&(j=e.split(",").map(function(a){return a.trim()}));var k=this.args.bindTo(d,function(b){for(c.withViews.has(a)&&c.withViews["delete"](a);a.firstChild;)a.removeChild(a.firstChild);var d=new g({},c);c.onRemove(function(a){return function(){a.remove()}}(d)),d.template=h;var e=function(a){var b=c.args.bindTo(j[a],function(a,b){d.args[b]=a});d.onRemove(b),c.onRemove(function(){b(),d.remove()})};for(var k in j)e(k);var f=function(a){var e=b.bindTo(a,function(a,b){d.args[b]=a}),f=d.args.bindTo(a,function(a,c){b[c]=a});c.onRemove(function(){e(),b.isBound()||_Bindable.Bindable.clearBindings(b),d.remove()}),d.onRemove(function(){e(),b.isBound()||_Bindable.Bindable.clearBindings(b)})};for(var i in b)f(i);d.render(a),c.withViews.set(a,d)});return this.onRemove(function(){c.withViews["delete"](a),k()}),a}},{key:"mapViewTag",value:function mapViewTag(a){var c=this,d=a.getAttribute("cv-view");a.removeAttribute("cv-view");var e=new DocumentFragment;_toConsumableArray(a.childNodes).map(function(a){return e.appendChild(a)});var f=d.split(":"),g=f.pop()?this.stringToClass(d):b,h=f.shift(),i=new g(this.args,this);return this.views.set(a,i),h&&this.views.set(h,i),this.onRemove(function(b){return function(){b.remove(),c.views["delete"](a),c.views["delete"](h)}}(i)),i.template=e,i.render(a),a}},{key:"mapEachTag",value:function mapEachTag(a){var c=this,d=a.getAttribute("cv-each"),e=a.getAttribute("cv-view");a.removeAttribute("cv-each"),a.removeAttribute("cv-view");var f=e?this.stringToClass(e):b,g=new DocumentFragment;Array.from(a.childNodes).map(function(a){return g.appendChild(a)});var h=d.split(":"),i=_slicedToArray(h,3),j=i[0],k=i[1],l=i[2],m=this.args.bindTo(j,function(b){c.viewLists.has(a)&&c.viewLists.get(a).remove();var e=new _ViewList.ViewList(g,k,b,c,l,f),h=function(){return e.remove()};c.onRemove(h),e.onRemove(function(){return c._onRemove.remove(h)});var i=c.args.bindTo(function(a,b,c,f){"_id"===b||(f&&delete e.subArgs[b],e.subArgs[b]=a)}),j=e.args.bindTo(function(a,b,e,f){"_id"===b||"value"===b||"___"===b.substring(0,3)||(f&&delete c.args[b],b in c.args&&(c.args[b]=a))});for(e.onRemove(i),e.onRemove(j),c.onRemove(i),c.onRemove(j);a.firstChild;)a.removeChild(a.firstChild);c.viewLists.set(a,e),e.render(a)});return this.onRemove(m),a}},{key:"mapIfTag",value:function mapIfTag(a){var c=this,d=a,e=a.getAttribute("cv-view"),f=d.getAttribute("cv-if"),g=!1,h=!1;d.removeAttribute("cv-view"),d.removeAttribute("cv-if");var i=e?this.stringToClass(e):b;"!"===f.substr(0,1)&&(f=f.substr(1),g=!0),"?"===f.substr(0,1)&&(f=f.substr(1),h=!0);var j=new DocumentFragment;Array.from(d.childNodes).map(function(a){return j.appendChild(a)}// n => subTemplate.appendChild(n.cloneNode(true))
);var k=this,l=new DocumentFragment,m=new i(this.args,k);this.onRemove(m.tags.bindTo(function(a,b){c.tags[b]=a})),m.template=j;var n=k.args,o=f;if(f.match(/\./)){var p=_Bindable.Bindable.resolve(k.args,f,!0),q=_slicedToArray(p,2);n=q[0],o=q[1]}m.render(l);var r=n.bindTo(o,function(b){h&&(b=null!==b&&void 0!==b),Array.isArray(b)&&(b=!!b.length),g&&(b=!b),b?a.appendChild(l):m.nodes.map(function(a){return l.appendChild(a)})},{wait:0,children:Array.isArray(n[o])});// const propertyDebind = this.args.bindChain(property, onUpdate);
k.onRemove(r);var s=function(){n.isBound()||_Bindable.Bindable.clearBindings(n)};return k.onRemove(function viewDebind(){r(),s(),k._onRemove.remove(r),k._onRemove.remove(s)}),this.onRemove(function(){m.remove(),k!==c&&k.remove()}),a;//*/
}},{key:"compileIfTag",value:function compileIfTag(a){var c=a.getAttribute("cv-if"),d=!1;a.removeAttribute("cv-if"),"!"===c.substr(0,1)&&(c=c.substr(1),d=!0);var e=new DocumentFragment;return Array.from(a.childNodes).map(function(a){return e.appendChild(a.cloneNode(!0))}),function(f){var g=a.cloneNode(),h=new DocumentFragment,i=new b({},f);i.template=e,f.syncBind(i);var j=f.args,k=c;if(c.match(/\./)){var l=_Bindable.Bindable.resolve(f.args,c,!0),m=_slicedToArray(l,2);j=m[0],k=m[1]}var n=!1,o=j.bindTo(k,function(a){if(!n){var b=f.args[k]||d?g:h;return i.render(b),void(n=!0)}Array.isArray(a)&&(a=!!a.length),d&&(a=!a),a?g.appendChild(h):i.nodes.map(function(a){return h.appendChild(a)})});f.onRemove(o);var p=function(){j.isBound()||_Bindable.Bindable.clearBindings(j)};return i.onRemove(function viewDebind(){o(),p(),f._onRemove.remove(o),f._onRemove.remove(p)}),g}}},{key:"mapTemplateTag",value:function mapTemplateTag(a){var b=a.getAttribute("cv-template");return a.removeAttribute("cv-template"),this.templates[b]=function(){return"TEMPLATE"===a.tagName?a.content.cloneNode(!0):new DocumentFragment(a.innerHTML)},this.rendered.then(function(){return a.remove()}),a}},{key:"mapSlotTag",value:function mapSlotTag(a){var b=a.getAttribute("cv-slot"),c=this.templates[b];if(!c){for(var e=this;e&&(c=e.templates[b],!c);)e=this.parent;if(!c)return void console.error("Template ".concat(b," not found."))}var d=c();for(a.removeAttribute("cv-slot");a.firstChild;)a.firstChild.remove();return a.appendChild(d),a}},{key:"syncBind",value:function syncBind(a){var c=this,d=this.args.bindTo(function(b,c){"_id"===c||a.args[c]!==b&&(a.args[c]=b)}),e=a.args.bindTo(function(a,e,f,g,d){if("_id"!==e){var h=a,i=d;h instanceof b&&(h=h.___ref___),i instanceof b&&(i=i.___ref___),h!==i&&i instanceof b&&d.remove(),e in c.args&&(c.args[e]=a)}});this.onRemove(d),this.onRemove(e),a.onRemove(function(){c._onRemove.remove(d),c._onRemove.remove(e)})}},{key:"postRender",value:function postRender(){}},{key:"attached",value:function attached(){}},{key:"interpolatable",value:function interpolatable(a){return!!(a+"").match(this.interpolateRegex)}},{key:"uuid",value:function(){return"10000000-1000-4000-8000-100000000000".replace(/[018]/g,function(a){return(a^crypto.getRandomValues(new Uint8Array(1))[0]&15>>a/4).toString(16)})}},{key:"remove",value:function remove(){var a=this,b=!!(0<arguments.length&&void 0!==arguments[0])&&arguments[0],c=function(){for(var b in a.tags)Array.isArray(a.tags[b])?(a.tags[b]&&a.tags[b].map(function(a){return a.remove()}),a.tags[b].splice(0)):(a.tags[b]&&a.tags[b].remove(),a.tags[b]=void 0);for(var c in a.nodes)a.nodes[c]&&a.nodes[c].dispatchEvent(new Event("cvDomDetached")),a.nodes[c]&&a.nodes[c].remove(),a.nodes[c]=void 0;a.nodes.splice(0),a.firstNode=a.lastNode=void 0};b?c():requestAnimationFrame(c);var d,e=this._onRemove.items(),f=_createForOfIteratorHelper(e);try{for(f.s();!(d=f.n()).done;){var n=d.value;this._onRemove.remove(n),n()}}catch(a){f.e(a)}finally{f.f()}for(var o;o=this.cleanup.shift();)o&&o();var g,h=_createForOfIteratorHelper(this.viewLists);try{for(h.s();!(g=h.n()).done;){var j=_slicedToArray(g.value,2),k=j[0],l=j[1];l.remove()}}catch(a){h.e(a)}finally{h.f()}for(var p in this.viewLists.clear(),this.timeouts)clearTimeout(this.timeouts[p].timeout),delete this.timeouts[p];for(var m in this.intervals)clearInterval(this.intervals[m].timeout),delete this.intervals[m];for(var m in this.frames)this.frames[m](),delete this.frames[m];this.removed=!0}},{key:"findTag",value:function findTag(a){for(var b in this.nodes){var c=void 0;if(this.nodes[b].querySelector){if(this.nodes[b].matches(a))return new _Tag.Tag(this.nodes[b],this,void 0,void 0,this);if(c=this.nodes[b].querySelector(a))return new _Tag.Tag(c,this,void 0,void 0,this)}}}},{key:"findTags",value:function findTags(a){var b=this;return this.nodes.filter(function(a){return a.querySelectorAll}).map(function(b){return _toConsumableArray(b.querySelectorAll(a))}).flat().map(function(a){return new _Tag.Tag(a,b,void 0,void 0,b)})}},{key:"onRemove",value:function onRemove(a){this._onRemove.add(a)}},{key:"update",value:function update(){}},{key:"beforeUpdate",value:function beforeUpdate(){}},{key:"afterUpdate",value:function afterUpdate(){}},{key:"stringTransformer",value:function stringTransformer(a){var b=this;return function(c){for(var f in a){for(var d=b,e=a[f];d&&!d[e];)d=d.parent;if(!d)return;c=d[a[f]](c)}return c}}},{key:"stringToClass",value:function stringToClass(a){if(b.refClasses.has(a))return b.refClasses.get(a);var c=a.split("/"),d=c[c.length-1],e=require(a);return b.refClasses.set(a,e[d]),e[d]}},{key:"preventParsing",value:function preventParsing(a){a[dontParse]=!0}},{key:"toString",value:function toString(){return this.nodes.map(function(a){return a.outerHTML}).join(" ")}},{key:"listen",value:function listen(a,c,d,e){var f=this;if("string"==typeof a&&(e=d,d=c,c=a,a=this),a instanceof b)return this.listen(a.nodes,c,d,e);if(Array.isArray(a)){var i=a.map(function(a){return f.listen(a,c,d,e)});return function(){return i.map(function(a){return a()})}}if(a instanceof _Tag.Tag)return this.listen(a.element,c,d,e);a.addEventListener(c,d,e);var g=function(){a.removeEventListener(c,d,e)},h=function(){g(),g=function(){}};return this.onRemove(function(){return h()}),h}}],[{key:"isView",value:function isView(){return b}}]),b}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));exports.View=View,Object.defineProperty(View,"templates",{value:new Map}),Object.defineProperty(View,"refClasses",{value:new Map});
});

require.register("base/ViewList.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ViewList=void 0;var _Bindable=require("./Bindable"),_View=require("./View"),_Bag=require("./Bag"),_SetMap=require("./SetMap");function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var ViewList=/*#__PURE__*/function(){function a(b,c,d,e){var f=this,g=4<arguments.length&&void 0!==arguments[4]?arguments[4]:null,h=5<arguments.length&&void 0!==arguments[5]?arguments[5]:null;_classCallCheck(this,a),this.removed=!1,this.args=_Bindable.Bindable.makeBindable({}),this.args.value=_Bindable.Bindable.makeBindable(d||{}),this.subArgs=_Bindable.Bindable.makeBindable({}),this.views=[],this.cleanup=[],this.viewClass=h||_View.View,this._onRemove=new _Bag.Bag,this.template=b,this.subProperty=c,this.keyProperty=g,this.tag=null,this.paused=!1,this.parent=e,this.rendered=new Promise(function(a){Object.defineProperty(f,"renderComplete",{configurable:!1,writable:!0,value:a})}),this.willReRender=!1,this.args.___before(function(a,b){"bindTo"==b||(f.paused=!0)}),this.args.___after(function(a,b,c){"bindTo"==b||(f.paused=1<c.length,f.reRender())});var i=this.args.value.bindTo(function(a,b,c,e){if(!f.paused){var d=b;if("symbol"!==_typeof(b))if(isNaN(b)&&(d="_"+b),e)for(var g in f.views[d]&&f.views[d].remove(),delete f.views[d],f.views){if("string"==typeof g){f.views[g].args[f.keyProperty]=g.substr(1);continue}f.views[g].args[f.keyProperty]=g}else f.views[d]||f.willReRender?f.views[d]&&f.views[d].args&&(f.views[d].args[f.keyProperty]=b,f.views[d].args[f.subProperty]=a):(cancelAnimationFrame(f.willReRender),f.willReRender=requestAnimationFrame(function(){f.reRender()}))}});this._onRemove.add(i)}return _createClass(a,[{key:"render",value:function render(a){var b,c=this,d=[],e=_createForOfIteratorHelper(this.views);try{var f=function(){var c=b.value;c.render(a),d.push(c.rendered.then(function(){return c}))};for(e.s();!(b=e.n()).done;)f()}catch(a){e.e(a)}finally{e.f()}this.tag=a,Promise.all(d).then(function(a){return c.renderComplete(a)})}},{key:"reRender",value:function reRender(){var a=this;if(!this.paused&&this.tag){var b=[],c=new _SetMap.SetMap;for(var r in this.views)b[r]=this.views[r],c.add(this.views[r].args[this.subProperty],this.views[r]);var d=[],e=new Set;this.upDebind&&this.upDebind.map(function(a){return a&&a()}),this.downDebind&&this.downDebind.map(function(a){return a&&a()}),this.upDebind=[],this.downDebind=[];var f=1/0,g=1/0,h=function(b){var h=Math.min,i=!1,j=b;if(isNaN(j)?j="_"+b:(j+"").length&&(j=+j),void 0!==a.args.value[b]&&c.has(a.args.value[b])){var l=c.get(a.args.value[b]),m=l.values().next().value;i=!0,e.add(m),d[j]=m,isNaN(j)||(f=h(f,j),0<j&&(g=h(g,j))),d[j].args[a.keyProperty]=b,c.remove(d[j])}// for(let j = views.length - 1; j >= 0; j--)
// {
// 	if(views[j]
// 		&& this.args.value[i] !== undefined
// 		&& this.args.value[i] === views[j].args[ this.subProperty ]
// 	){
// 		found = true;
// 		finalViews[k] = views[j];
// 		if(!isNaN(k))
// 		{
// 			minKey = Math.min(minKey, k);
// 			k > 0 && (anteMinKey = Math.min(anteMinKey, k));
// 		}
// 		finalViews[k].args[ this.keyProperty ] = i;
// 		delete views[j];
// 		break;
// 	}
// }
if(!i){var n={},o=d[j]=new a.viewClass(n,a.parent);e.add(o),isNaN(j)||(f=h(f,j),0<j&&(g=h(g,j))),o.template=a.template instanceof Object?a.template:a.template,o.viewList=a,o.args[a.keyProperty]=b,o.args[a.subProperty]=a.args.value[b],a.upDebind[j]=n.bindTo(a.subProperty,function(b,c,e,f){var d=n[a.keyProperty];return f?void delete a.args.value[d]:void(a.args.value[d]=b)}),a.downDebind[j]=a.subArgs.bindTo(function(a,b,c,e){return e?void delete n[b]:void(n[b]=a)}),o.onRemove(function(){a.upDebind[j]&&a.upDebind[j](),a.downDebind[j]&&a.downDebind[j](),delete a.downDebind[j],delete a.upDebind[j]}),a._onRemove.add(function(){a.upDebind.filter(function(a){return a}).map(function(a){return a()}),a.upDebind.splice(0)}),a._onRemove.add(function(){a.downDebind.filter(function(a){return a}).map(function(a){return a()}),a.downDebind.splice(0)}),n[a.subProperty]=a.args.value[b]}};for(var i in this.args.value)h(i);var j,k=_createForOfIteratorHelper(c.values());try{for(k.s();!(j=k.n()).done;){var s=j.value;e.has(s)||s.remove()}// for(let i in views)
// {
// 	let found = false;
// 	for(let j in finalViews)
// 	{
// 		if(views[i] === finalViews[j])
// 		{
// 			found = true;
// 			break;
// 		}
// 	}
// 	if(!found)
// 	{
// 		views[i].remove();
// 	}
// }
}catch(a){k.e(a)}finally{k.f()}if(Array.isArray(this.args.value)){var l=0===f&&void 0!==d[1]&&1<d.length||g===1/0?f:g,m=function(){for(var b=0<arguments.length&&void 0!==arguments[0]?arguments[0]:0,c=d.length-b-1;c>l&&void 0===d[c];)c--;return c<l?Promise.resolve():d[c]===a.views[c]?d[c].firstNode?m(+b+1):(d[c].render(a.tag,d[c+1]),d[c].rendered.then(function(){return m(+b+1)})):(d[c].render(a.tag,d[c+1]),a.views.splice(c,0,d[c]),d[c].rendered.then(function(){return m(+b+1)}))};this.rendered=m()}else{var n=[],o=Object.assign({},d),p=function(b){return delete o[b],d[b].firstNode&&d[b]===a.views[b]?"continue":void(d[b].render(a.tag),n.push(d[b].rendered.then(function(){return d[b]})))};for(var t in d){var q=p(t)}for(var u in o)delete this.args.views[u],o.remove();this.rendered=Promise.all(n)}for(var v in this.views=d,d){if(isNaN(v)){d[v].args[this.keyProperty]=v.substr(1);continue}d[v].args[this.keyProperty]=v}this.willReRender=!1}}},{key:"pause",value:function pause(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];for(var b in this.views)this.views[b].pause(a)}},{key:"onRemove",value:function onRemove(a){this._onRemove.add(a)}},{key:"remove",value:function remove(){for(var b in this.views)this.views[b].remove();var a=this._onRemove.items();for(var c in a)this._onRemove.remove(a[c]),a[c]();for(var d;this.cleanup.length;)d=this.cleanup.pop(),d();for(this.views=[];this.tag&&this.tag.firstChild;)this.tag.removeChild(this.tag.firstChild);this.subArgs&&_Bindable.Bindable.clearBindings(this.subArgs),_Bindable.Bindable.clearBindings(this.args),this.args.value&&!this.args.value.isBound()&&_Bindable.Bindable.clearBindings(this.args.value),this.removed=!0}}]),a}();exports.ViewList=ViewList;
});

;require.register("form/ButtonField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.ButtonField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ButtonField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f),g.args.title=g.args.title||g.args.value,g._onClick=[];var h=g.args.attrs||{};return h.type=h.type||g.args.type,g.args.name=h.name=g.args.name||f,g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type,"\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(g.getName(),"\"\n\t\t\t\t\ttype      = \"").concat(h.type,"\"\n\t\t\t\t\tvalue     = \"[[value]]\"\n\t\t\t\t\tcv-on     = \"click:clicked(event)\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"clicked",value:function clicked(a){var b=this._onClick.map(function(b){return!1===b(a)}).filter(function(a){return a});return b.length?void("submit"==this.args.attrs.type&&(a.preventDefault(),a.stopPropagation())):void("submit"==this.args.attrs.type&&(a.preventDefault(),a.stopPropagation(),this.form.tags.formTag.element.dispatchEvent(new Event("submit",{cancelable:!0,bubbles:!0}))))}},{key:"onClick",value:function onClick(a){this._onClick.push(a)}}]),b}(_Field2.Field);exports.ButtonField=ButtonField;
});

;require.register("form/Field.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Field=void 0;var _View2=require("../base/View"),_Bindable=require("../base/Bindable");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Field=/*#__PURE__*/function(a){function b(a,d,e,f){var g,h,i,j;_classCallCheck(this,b);var k=Object.assign({},a);j=c.call(this,k,e),j.args.title=null!==(g=j.args.title)&&void 0!==g?g:f,j.args.value=null!==(h=j.args.value)&&void 0!==h?h:"",j.value=null!==(i=j.args.value)&&void 0!==i?i:"",j.skeleton=k,j.disabled=null,j.args.valueString="",j.form=d,j.key=f,j.ignore=!!j.args.attrs&&(j.args.attrs["data-cv-ignore"]||!1);var l="",m=j.args.attrs||{};m.type=m.type||k.type||null,j.args.name=m.name=m.name||j.args.name||f,"checkbox"==m.type&&(l="value = \"1\""),j.template="\n\t\t\t<label\n\t\t\t\tfor           = \"".concat(j.getName(),"\"\n\t\t\t\tdata-type     = \"").concat(m.type||"text","\"\n\t\t\t\tcv-ref        = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(j.getName(),"\"\n\t\t\t\t\ttype      = \"").concat(m.type||"text","\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t").concat(l,"\n\t\t\t\t/>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");//type    = "${this.args.attrs.type||'text'}"
// let key     = this.key;
var n=null;return j.args.bindTo("value",function(a,b){if(!isNaN(a)&&a.length&&a==+a&&a.length===(+a+"").length&&(a=+a),j.value=a,n!=b){if(n=f,j.args.valueString=JSON.stringify(a||"",null,4),j.valueString=j.args.valueString,!("file"==m.type&&j.tags.input&&j.tags.input.element.files&&j.tags.input.element.length))j.parent.args.value||(j.parent.args.value={}),j.parent.args.value[f]=a;else if(!m.multiple)j.parent.args.value[f]=j.tags.input.element.files[0];else{var c=Array.from(j.tags.input.element.files);if(!j.parent.args.value[b]||!c.length)j.parent.args.value[f]=c;else{for(var d in c)c[d]!==j.parent.args.value[f][d]&&(j.parent.args.value[f]=c);j.parent.args.value.splice(c.length)}}j.args.errors=[],n=null}}),j.parent.args.value[j.key]=j.args.value,j.parent.args.value.bindTo(f,function(a,b){if(n!=b){if(n=b,"file"!=m.type)j.args.value=a;else if(!(j.tags.input&&j.tags.input.element.files&&j.tags.input.element.files.length))j.args.value=a;else if(!m.multiple)j.parent.args.value[f]=j.tags.input.element.files[0];else{var c=Array.from(j.tags.input.element.files);if(!j.parent.args.value[f]||!c.length)j.parent.args.value[f]=c;else{for(var d in c)c[d]!==j.parent.args.value[f][d]&&(j.parent.args.value[f]=c);j.parent.args.value[f].splice(c.length)}}n=null}}),j}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"disable",value:function disable(){this.hasChildren(),this.disabled="disabled"}},{key:"enable",value:function enable(){this.hasChildren(),this.disabled=!1}},{key:"hasChildren",value:function hasChildren(){return!1}},{key:"getName",value:function getName(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];if(this.tags.input)return this.tags.input.element.getAttribute("name");var b=this.key;if(a){for(var c=this.parent,d=[b];c&&c.array&&"undefined"!=typeof c.key;)d.unshift(c.key),c=c.parent;b=d.shift(),d.length&&(b+="[".concat(d.join("]["),"]"))}return b}}]),b}(_View2.View);exports.Field=Field;
});

;require.register("form/FieldSet.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.FieldSet=void 0;var _Field2=require("./Field"),_Form=require("./Form");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var FieldSet=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return h.type=h.type||"fieldset",g.array=!1,(a.array||h["data-array"]||h["data-multi"])&&(g.array=h["data-array"]=!0),g.args.value={},g.args.fields=_Form.Form.renderFields(a.children,_assertThisInitialized(g)),g.fields=g.args.fields,g.template="\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type  = \"").concat(h.type,"\"\n\t\t\t\tdata-multi = \"").concat(h["data-multi"]?"true":"false","\"\n\t\t\t\tcv-ref     = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = \"").concat(g.getName(),"\"\n\t\t\t\t\tcv-ref = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand=\"attrs\"\n\t\t\t\t\tcv-each = \"fields:field\"\n\t\t\t\t>\n\t\t\t\t\t[[field]]\n\t\t\t\t</fieldset>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"hasChildren",value:function hasChildren(){return!!Object.keys(this.args.fields).length}},{key:"wrapSubfield",value:function wrapSubfield(a){return a}}]),b}(_Field2.Field);exports.FieldSet=FieldSet;
});

;require.register("form/FileField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.FileField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var FileField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return h.type=h.type||g.args.type||"file",g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type,"\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t>\n\t\t\t\t<input\n\t\t\t\t\tname    = \"").concat(g.getName(),"\"\n\t\t\t\t\ttype    = \"").concat(h.type,"\"\n\t\t\t\t\tcv-bind = \"value\"\n\t\t\t\t\tcv-ref  = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t<span style = \"display:none\" cv-if = \"value\">[[[value]]]</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return b}(_Field2.Field);exports.FileField=FileField;
});

;require.register("form/Form.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Form=void 0;var _View2=require("../base/View"),_Field=require("./Field"),_FieldSet=require("./FieldSet"),_SelectField=require("./SelectField"),_RadioField=require("./RadioField"),_HtmlField=require("./HtmlField"),_HiddenField=require("./HiddenField"),_ButtonField=require("./ButtonField"),_TextareaField=require("./TextareaField"),_View3=require("./multiField/View"),_Bindable=require("../base/Bindable");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}// import { Router           } from 'Router';
// import { Repository       } from '../Repository';
// import { FieldSet         } from './FieldSet';
// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';
var Form=/*#__PURE__*/function(a){function b(a){var d,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:{};_classCallCheck(this,b),d=c.call(this,{}),d.args.flatValue=d.args.flatValue||{},d.args.value=d.args.value||{},d.args.method=a._method||"GET",d.args.classes=d.args.classes||[],d.skeleton=a,d.args.bindTo("classes",function(a){d.args._classes=a.join(" ")}),d.action="",d.template="\n\t\t\t<form\n\t\t\t\tclass     = \"[[_classes]]\"\n\t\t\t\tmethod    = \"[[method]]\"\n\t\t\t\tenctype   = \"multipart/form-data\"\n\t\t\t\tcv-on     = \"submit:submit(event)\"\n\t\t\t\tcv-ref    = \"formTag:curvature/base/Tag\"\n\t\t\t\tcv-each   = \"fields:field\"\n\t\t\t\tcv-expand = \"attrs\"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t",d.args.fields=b.renderFields(a,_assertThisInitialized(d),e),d.fields=d.args.fields;var f=_Bindable.Bindable.makeBindable(_assertThisInitialized(d));return d.args.bindTo("value",function(a){f.value=a}),d.args.bindTo("valueString",function(a){f.json=a}),_possibleConstructorReturn(d,f)}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"submit",value:function submit(a){this.args.valueString=JSON.stringify(this.args.value,null,4),this.dispatchEvent(new CustomEvent("submit",{details:{view:this}}))||(a.preventDefault(),a.stopPropagation())}},{key:"buttonClick",value:function buttonClick(){// console.log(event);
}// onSubmit(callback)
// {
// 	this._onSubmit.push(callback);
// }
// onRender(callback)
// {
// 	if(this.nodes)
// 	{
// 		callback(this);
// 		return;
// 	}
// 	this._onRender.push(callback);
// }
},{key:"formData",value:function formData(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:null,b=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:[];a||(a=new FormData),b||(b=this);for(var g in b.args.fields)if(!(b.args.fields[g]&&b.args.fields[g].disabled)){var d=c.slice(0);if(d.push(g),b.args.fields[g]&&b.args.fields[g].hasChildren())this.formData(a,b.args.fields[g],d);else if(b.args.fields[g]){// let fieldName = field.args.fields[i].args.name;
var h=b.args.fields[g].getName();if(!("file"==b.args.fields[g].args.type&&b.args.fields[g].tags.input.element.files&&b.args.fields[g].tags.input.element.files.length))("file"!==b.args.fields[g].args.type||b.args.fields[g].args.value)&&a.append(h,void 0===b.args.fields[g].args.value?"":b.args.fields[g].args.value);else if(b.args.fields[g].args.attrs.multiple)for(var e=b.args.fields[g].tags.input.element.files,f=0;f<e.length;f++)e[f]&&a.append(h+"[]",e[f]);else b.args.fields[g].tags.input.element.files[0]&&a.append(h,b.args.fields[g].tags.input.element.files[0])}}return a}},{key:"queryString",value:function queryString(){var a=0<arguments.length&&void 0!==arguments[0]?arguments[0]:{},b=[];for(var c in this.args.flatValue)a[c]=a[c]||this.args.flatValue[c];for(var d in a)b.push(d+"="+encodeURIComponent(a[d]));return b.join("&")}},{key:"populate",value:function populate(a){// console.log(values);
for(var b in a)this.args.value[b]=a[b]}},{key:"hasChildren",value:function hasChildren(){return!!Object.keys(this.args.fields).length}// postRender()
// {
// 	for(let i in this._onRender)
// 	{
// 		this._onRender[i](this);
// 	}
// }
}],[{key:"renderFields",value:function renderFields(a){var c=1<arguments.length&&void 0!==arguments[1]?arguments[1]:null,d=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{},e={},f=function(f){if(e[f])return"continue";if("_"==f.substr(0,1))return"continue";var g=null,h=null;// console.log(customFields);
if(c&&(c instanceof b?h=c:h=c.form),d&&a[f].name in d)g=new d[a[f].name](a[f],h,c,f);else switch(a[f].type){case"fieldset":g=a[f].attrs&&a[f].attrs["data-multi"]?new _View3.View(a[f],h,c,f):new _FieldSet.FieldSet(a[f],h,c,f);break;case"select":g=new _SelectField.SelectField(a[f],h,c,f);break;case"radios":g=new _RadioField.RadioField(a[f],h,c,f);break;case"html":g=new _HtmlField.HtmlField(a[f],h,c,f);break;case"submit":case"button":g=new _ButtonField.ButtonField(a[f],h,c,f);break;case"hidden":g=new _HiddenField.HiddenField(a[f],h,c,f);break;case"textarea":g=new _TextareaField.TextareaField(a[f],h,c,f);break;default:g=new _Field.Field(a[f],h,c,f);}e[f]=g;var i=g.key;//field.getName();
g.args.bindTo("value",function(a,b,d){// console.log(t,v);
if(!isNaN(a)&&a.length&&a==+a&&a.length===(+a+"").length&&(a=+a),("html"!=d.type||d.contentEditable)&&"fieldset"!=d.type){// let fieldName = field.args.name;
if(d.disabled)return void delete h.args.flatValue[i];d.attrs=d.attrs||{};var e=d.attrs.multiple,f=Array.isArray(a),g=c.args.value[i],j=d.attrs.multiple&&f&&Array.isArray(g);if(j)for(var k in a)a[k]!==c.args.value[i][k]&&(c.args.value[i][k]=a[k]),c.args.value[i].splice(a.length);else c.args.value[i]=a;h.args.flatValue[i]=a,h.args.valueString=JSON.stringify(h.args.value,null,4),console.log()}})};for(var h in a){var g=f(h)}return e}},{key:"_updateFields",value:function _updateFields(a,b){for(var c in a.args.fields){var d=a.args.fields[c];// console.log(i, field, skeleton[i]);
b[c]&&(b[c].value&&(d.args.value=b[c].value),b[c].errors&&(d.args.errors=b[c].errors),b[c].title&&(d.args.title=b[c].title),b[c].options&&(d.args.options=b[c].options),b[c].attrs&&(d.args.attrs=b[c].attrs),d.children&&b[c].children&&this._updateFields(d,b[c].children))}}}]),b}(_View2.View);exports.Form=Form;
});

;require.register("form/HiddenField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.HiddenField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var HiddenField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),a.type="hidden",g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return g.args.type=h.type="hidden",g.args.name=h.name=h.name||g.args.name||f,g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type,"\"\n\t\t\t\tstyle     = \"display:none\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\t\tname      = \"").concat(g.getName(),"\"\n\t\t\t\t\t\ttype      = \"hidden\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return b}(_Field2.Field);exports.HiddenField=HiddenField;
});

;require.register("form/HtmlField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.HtmlField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var HtmlField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;return _classCallCheck(this,b),g=c.call(this,a,d,e,f),g.key=f,g.args.tagName=g.args.tagName||"div",g.args.displayValue=g.args.value,g.args.attrs=g.args.attrs||{},g.ignore=g.args.attrs["data-cv-ignore"]||!1,g.args.contentEditable=g.args.attrs.contenteditable||!1,g.args.bindTo("value",function(a){g.tags.input&&g.tags.input.element!==document.activeElement&&(g.args.displayValue=a)}),g.template="<".concat(g.args.tagName,"\n\t\t\tname            = \"").concat(g.getName(),"\"\n\t\t\tcv-ref          = \"input:curvature/base/Tag\"\n\t\t\tcontenteditable = \"[[contentEditable]]\"\n\t\t\tcv-expand       = \"attrs\"\n\t\t\tcv-bind         = \"$displayValue\"\n\t\t\tcv-on           = \"input:inputProvided(event);\"\n\t\t></").concat(g.args.tagName,">"),g}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"inputProvided",value:function inputProvided(a){this.args.value=a.target.innerHTML}},{key:"hasChildren",value:function hasChildren(){return!1}},{key:"getName",value:function getName(){return this.key}}]),b}(_Field2.Field);exports.HtmlField=HtmlField;
});

;require.register("form/RadioField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.RadioField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var RadioField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return g.args.name=h.name=h.name||g.args.name||f,g.args.value=g.args.value||"",g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type,"\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each  = \"options:option:optionText\"/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname      = \"").concat(g.args.name,"\"\n\t\t\t\t\t\t\ttype      = \"radio\"\n\t\t\t\t\t\t\tvalue     = \"[[option]]\"\n\t\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t\t\tcv-on     = \"change:changed(event)\"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"getLabel",value:function getLabel(){for(var a in this.args.options)if(this.args.options[a]==this.args.value)return a}},{key:"changed",value:function changed(a){this.args.value=a.target.value}}]),b}(_Field2.Field);exports.RadioField=RadioField;
});

;require.register("form/SelectField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.SelectField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var SelectField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type||"select","\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname      = \"").concat(g.getName(),"\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-each   = \"options:option:optionText\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t\t<option value = \"[[option]]\">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"postRender",value:function postRender(){var a=this;this.args.bindTo("value",function(b){return a.selectOptionByValue(b)}),this.args.options.bindTo(function(){return a.selectOptionByValue(a.args.value)},{frame:1})}},{key:"selectOptionByValue",value:function selectOptionByValue(a){var b,c=this.tags.input.element,d=_createForOfIteratorHelper(c.options);try{for(d.s();!(b=d.n()).done;){var e=b.value;e.value==a&&(c.selectedIndex=e.index)}}catch(a){d.e(a)}finally{d.f()}}},{key:"getLabel",value:function getLabel(){for(var a in this.args.options)if(this.args.options[a]==this.args.value)return a}}]),b}(_Field2.Field);exports.SelectField=SelectField;
});

;require.register("form/TextareaField.js", function(exports, require, module) {
"use strict";var _Field2=require("./Field");Object.defineProperty(exports,"__esModule",{value:!0}),exports.TextareaField=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var TextareaField=/*#__PURE__*/function(a){function b(a,d,e,f){var g;_classCallCheck(this,b),g=c.call(this,a,d,e,f);var h=g.args.attrs||{};return h.type=h.type||"textarea",g.template="\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(g.getName(),"\"\n\t\t\t\tdata-type = \"").concat(h.type,"\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<textarea\n\t\t\t\t\t\tname      = \"").concat(g.getName(),"\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t></textarea>\n\t\t\t\t<cv-template cv-if = \"attrs.data-caption\">\n\t\t\t\t\t<p>[[attrs.data-caption]]</p>\n\t\t\t\t</cv-template>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t"),g}_inherits(b,a);var c=_createSuper(b);return b}(_Field2.Field);exports.TextareaField=TextareaField;
});

;require.register("input/Gamepad.js", function(exports, require, module) {
"use strict";
});

;require.register("input/Keyboard.js", function(exports, require, module) {
"use strict";var _Bindable=require("../base/Bindable");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Keyboard=void 0;function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Keyboard=/*#__PURE__*/function(){function a(){var b=this;_classCallCheck(this,a),this.maxDecay=120,this.comboTime=500,this.listening=!1,this.focusElement=document.body,Object.defineProperty(this,"combo",{value:_Bindable.Bindable.make([])}),Object.defineProperty(this,"whichs",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"codes",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"keys",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"pressedWhich",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"pressedCode",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"pressedKey",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"releasedWhich",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"releasedCode",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"releasedKey",{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,"keyRefs",{value:_Bindable.Bindable.make({})}),document.addEventListener("keyup",function(a){!b.listening||b.focusElement&&document.activeElement!==b.focusElement||(a.preventDefault(),b.releasedWhich[a.which]=Date.now(),b.releasedCode[a.code]=Date.now(),b.releasedKey[a.key]=Date.now(),b.whichs[a.which]=-1,b.codes[a.code]=-1,b.keys[a.key]=-1)}),document.addEventListener("keydown",function(a){b.listening&&(b.focusElement&&document.activeElement!==b.focusElement||(a.preventDefault(),!a.repeat)&&(b.combo.push(a.code),clearTimeout(b.comboTimer),b.comboTimer=setTimeout(function(){return b.combo.splice(0)},b.comboTime),b.pressedWhich[a.which]=Date.now(),b.pressedCode[a.code]=Date.now(),b.pressedKey[a.key]=Date.now(),0<b.keys[a.key]||(b.whichs[a.which]=1,b.codes[a.code]=1,b.keys[a.key]=1)))});var c=function(){for(var a in b.keys)0>b.keys[a]||(b.releasedKey[a]=Date.now(),b.keys[a]=-1);for(var c in b.codes)0>b.codes[c]||(b.releasedCode[c]=Date.now(),b.codes[c]=-1);for(var d in b.whichs)0>b.whichs[d]||(b.releasedWhich[d]=Date.now(),b.whichs[d]=-1)};window.addEventListener("blur",c),window.addEventListener("visibilitychange",function(){"visible"===document.visibilityState||c()})}return _createClass(a,null,[{key:"get",value:function get(){return this.instance=this.instance||_Bindable.Bindable.make(new this)}}]),_createClass(a,[{key:"getKeyRef",value:function getKeyRef(a){var b=this.keyRefs[a]=this.keyRefs[a]||_Bindable.Bindable.make({});return b}},{key:"getKeyTime",value:function getKeyTime(a){var b=this.releasedKey[a],c=this.pressedKey[a];return c?!b||b<c?Date.now()-c:-1*(Date.now()-b):0}},{key:"getCodeTime",value:function getCodeTime(a){var b=this.releasedCode[a],c=this.pressedCode[a];return c?!b||b<c?Date.now()-c:-1*(Date.now()-b):0}},{key:"getWhichTime",value:function getWhichTime(a){var b=this.releasedWhich[a],c=this.pressedWhich[a];return c?!b||b<c?Date.now()-c:-1*(Date.now()-b):0}},{key:"getKey",value:function getKey(a){return this.keys[a]?this.keys[a]:0}},{key:"getKeyCode",value:function getKeyCode(a){return this.codes[a]?this.codes[a]:0}},{key:"update",value:function update(){for(var a in this.keys)0<this.keys[a]?this.keys[a]++:this.keys[a]>-this.maxDecay?this.keys[a]--:delete this.keys[a];for(var a in this.codes){var b=this.releasedCode[a],c=this.pressedCode[a],d=this.getKeyRef(a);if(0<this.codes[a])return d.frames=this.codes[a]++,d.time=c?Date.now()-c:0,d.down=!0,!b||b<c?void 0:-1*(Date.now()-b);this.codes[a]>-this.maxDecay?(d.frames=this.codes[a]--,d.time=b-Date.now(),d.down=!1):(d.frames=0,d.time=0,d.down=!1,delete this.codes[a])}for(var a in this.whichs)0<this.whichs[a]?this.whichs[a]++:this.whichs[a]>-this.maxDecay?this.whichs[a]--:delete this.whichs[a]}}]),a}();exports.Keyboard=Keyboard;
});

;require.register("input/Mouse.js", function(exports, require, module) {
"use strict";
});

;require.register("mixin/EventTargetMixin.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.EventTargetMixin=void 0;var _EventTargetMixin,_Mixin=require("../base/Mixin");function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var _EventTarget=Symbol("Target"),EventTargetMixin=(_EventTargetMixin={},_defineProperty(_EventTargetMixin,_Mixin.Mixin.Constructor,function(){try{this[_EventTarget]=new EventTarget}catch(a){this[_EventTarget]=document.createDocumentFragment()}}),_defineProperty(_EventTargetMixin,"dispatchEvent",function dispatchEvent(){for(var a,b=arguments.length,c=Array(b),d=0;d<b;d++)c[d]=arguments[d];var e=c[0];(a=this[_EventTarget]).dispatchEvent.apply(a,c);var f="on".concat(e.type[0].toUpperCase()+e.type.slice(1));return"function"==typeof this[f]&&this[f](e),e.returnValue}),_defineProperty(_EventTargetMixin,"addEventListener",function addEventListener(){var a;(a=this[_EventTarget]).addEventListener.apply(a,arguments)}),_defineProperty(_EventTargetMixin,"removeEventListener",function removeEventListener(){var a;(a=this[_EventTarget]).removeEventListener.apply(a,arguments)}),_EventTargetMixin);exports.EventTargetMixin=EventTargetMixin;
});

;require.register("mixin/PromiseMixin.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PromiseMixin=void 0;var _PromiseMixin,_Mixin=require("../base/Mixin");function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var _Promise=Symbol("Promise"),Accept=Symbol("Accept"),Reject=Symbol("Reject"),PromiseMixin=(_PromiseMixin={},_defineProperty(_PromiseMixin,_Mixin.Mixin.Constructor,function(){var a=this;this[_Promise]=new Promise(function(b,c){a[Accept]=b,a[Reject]=c})}),_defineProperty(_PromiseMixin,"then",function then(){var a;return(a=this[_Promise]).then.apply(a,arguments)}),_defineProperty(_PromiseMixin,"catch",function _catch(){var a;return(a=this[_Promise])["catch"].apply(a,arguments)}),_defineProperty(_PromiseMixin,"finally",function _finally(){var a;return(a=this[_Promise])["finally"].apply(a,arguments)}),_PromiseMixin);exports.PromiseMixin=PromiseMixin,Object.defineProperty(PromiseMixin,"Reject",{value:Reject}),Object.defineProperty(PromiseMixin,"Accept",{value:Accept});
});

require.register("model/Database.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Database=void 0;var _Bindable=require("../base/Bindable"),_Mixin=require("../base/Mixin"),_EventTargetMixin=require("../mixin/EventTargetMixin");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _toConsumableArray(a){return _arrayWithoutHoles(a)||_iterableToArray(a)||_unsupportedIterableToArray(a)||_nonIterableSpread()}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _iterableToArray(a){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(a))return Array.from(a)}function _arrayWithoutHoles(a){if(Array.isArray(a))return _arrayLikeToArray(a)}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var BeforeWrite=Symbol("BeforeWrite"),AfterWrite=Symbol("AfterWrite"),BeforeInsert=Symbol("BeforeInsert"),AfterInsert=Symbol("AfterInsert"),BeforeUpdate=Symbol("BeforeUpdate"),AfterUpdate=Symbol("AfterUpdate"),BeforeRead=Symbol("BeforeRead"),AfterRead=Symbol("AfterRead"),PrimaryKey=Symbol("PrimaryKey"),Connection=Symbol("Connection"),Instances=Symbol("Instances"),HighWater=Symbol("HighWater"),Metadata=Symbol("Metadata"),Timers=Symbol("Timers"),Target=Symbol("Target"),Store=Symbol("Store"),Fetch=Symbol("Each"),Name=Symbol("Name"),Bank=Symbol("Bank"),Database=/*#__PURE__*/function(a){function b(a){var d;return _classCallCheck(this,b),d=c.call(this),Object.defineProperty(_assertThisInitialized(d),Connection,{value:a}),Object.defineProperty(_assertThisInitialized(d),Name,{value:a.name}),Object.defineProperty(_assertThisInitialized(d),Timers,{value:{}}),Object.defineProperty(_assertThisInitialized(d),Metadata,{value:{}}),Object.defineProperty(_assertThisInitialized(d),Bank,{value:{}}),d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"select",value:function select(a){var b=this,c=a.store,d=a.index,e=a.range,f=void 0===e?null:e,g=a.direction,h=void 0===g?"next":g,j=a.limit,k=void 0===j?0:j,l=a.offset,m=void 0===l?0:l,n=a.type,o=void 0!==n&&n,p=a.origin,q=void 0===p?void 0:p,r=this[Connection].transaction(c,"readonly"),t=r.objectStore(c),s=d?t.index(d):t;return{each:this[Fetch](o,s,h,f,k,m,q),one:this[Fetch](o,s,h,f,1,m,q),then:function then(a){return b[Fetch](o,s,h,f,k,m,q)(function(a){return a}).then(a)}}}},{key:"insert",value:function insert(a,c){var d=this,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};return new Promise(function(f,g){d[Bank][a]=d[Bank][a]||{};var h=d[Connection].transaction([a],"readwrite"),i=h.objectStore(a),j=d[Bank][a];c=_Bindable.Bindable.make(c);var k={database:d[Name],record:c,store:a,type:"write",subType:"insert",origin:e},l=c[b.BeforeWrite]?c[b.BeforeWrite](k):null,m=c[b.BeforeInsert]?c[b.BeforeInsert](k):null,n=i.add(Object.assign({},_Bindable.Bindable.shuck(c)));!1===l||!1===m||(n.onerror=function(a){d.dispatchEvent(new CustomEvent("writeError",{detail:k})),g(a)},n.onsuccess=function(g){var i=g.target.result;j[i]=c;k.key=b.getPrimaryKey(c);var l=d.dispatchEvent(new CustomEvent("write",{cancelable:!0,detail:k}));if(l){if(c[PrimaryKey]=Symbol["for"](i),d[Metadata][a]||(d[Metadata][a]=d.getStoreMeta(a,"store",{})),d[Metadata][a]){var m=d.checkHighWaterMark(a,c),n=d.checkLowWaterMark(a,c),o=d[Metadata][a],p=c[o.highWater];e.setHighWater&&m<p&&d.setHighWaterMark(a,c,e,"insert"),e.setLowWater&&n>p&&d.setLowWaterMark(a,c,e,"insert")}h.commit&&h.commit(),c[b.AfterInsert]&&c[b.AfterInsert](k),c[b.AfterWrite]&&c[b.AfterWrite](k)}else h.abort();f(c)})})}},{key:"update",value:function update(a,c){var d=this,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:{};if(!c[PrimaryKey])throw Error("Value provided is not a DB record!");return new Promise(function(f,g){var h=d[Connection].transaction([a],"readwrite"),i=h.objectStore(a),j={database:d[Name],key:b.getPrimaryKey(c),record:c,store:a,type:"write",subType:"update",origin:e};c[b.AfterInsert]&&c[b.AfterInsert](j),c[b.AfterWrite]&&c[b.AfterWrite](j);var k=c[b.BeforeWrite]?c[b.BeforeWrite](j):null,l=c[b.BeforeUpdate]?c[b.BeforeUpdate](j):null;if(!1!==k&&!1!==l){var m=i.put(Object.assign({},_Bindable.Bindable.shuck(c)));m.onerror=function(a){d.dispatchEvent(new CustomEvent("writeError",{detail:j})),g(a)},m.onsuccess=function(b){var g=d.dispatchEvent(new CustomEvent("write",{cancelable:!0,detail:j}));if(g){if(d[Metadata][a]||(d[Metadata][a]=d.getStoreMeta(a,"store",{})),d[Metadata][a]){var i=d.checkHighWaterMark(a,c),k=d.checkLowWaterMark(a,c),l=d[Metadata][a],m=c[l.highWater];e.setHighWater&&i<m&&d.setHighWaterMark(a,c,e,"insert"),e.setLowWater&&k>m&&d.setLowWaterMark(a,c,e,"insert")}h.commit&&h.commit()}else h.abort();f(b)}}})}},{key:"delete",value:function _delete(a,c){var d=this,e=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0;if(!c[PrimaryKey])throw Error("Value provided is not a DB record!");return new Promise(function(f,g){var h=d[Connection].transaction([a],"readwrite"),i=h.objectStore(a),j={database:d[Name],record:c,key:b.getPrimaryKey(c),store:a,type:"write",subType:"delete",origin:e},k=c[b.beforeDelete]?c[b.beforeDelete](j):null;if(!1!==k){var l=i["delete"](+c[PrimaryKey].description);c[PrimaryKey]=void 0,c[b.AfterDelete]&&c[b.AfterDelete](j),l.onerror=function(a){j.original=a;var b=new CustomEvent("writeError",{detail:j});d.dispatchEvent(b),g(a)},l.onsuccess=function(a){j.original=a;var b=new CustomEvent("write",{detail:j});d.dispatchEvent(b),h.commit&&h.commit(),f(b)}}})}},{key:"clear",value:function clear(a){var b=this;return new Promise(function(c,d){var e=b[Connection].transaction([a],"readwrite"),f=e.objectStore(a),g=f.clear(),h={database:b[Name],store:a,type:"write",subType:"clear",origin:origin};g.onerror=function(a){h.original=a;var c=new CustomEvent("writeError",{detail:h});b.dispatchEvent(c),d(a)},g.onsuccess=function(a){h.original=a;var d=new CustomEvent("write",{detail:h});b.dispatchEvent(d),e.commit&&e.commit(),c(d)}})}},{key:"listStores",value:function listStores(){return _toConsumableArray(this[Connection].objectStoreNames)}},{key:"listIndexes",value:function listIndexes(a){var b=this[Connection].transaction([a]),c=b.objectStore(a);return _toConsumableArray(c.indexNames)}},{key:Fetch,value:function value(a,c,d,e,f,g,h){var j=this;return function(k){return new Promise(function(l){var m=0,n=c.openCursor(e,d);n.addEventListener("success",function(d){var e=d.target.result;if(!e)return l({record:null,result:null,index:m});j[Bank][void 0]=j[Bank][void 0]||{};var i=j[Bank][void 0],n=e.primaryKey,o=a?a.from(e.value):e.value,p=_Bindable.Bindable.makeBindable(o),q={database:j[Name],key:b.getPrimaryKey(p),record:o,store:c.name,type:"read",subType:"select",origin:h},r=o[b.BeforeRead]?o[b.BeforeRead](q):null;if(g>m++||!1===r)return e["continue"]();i[n]?Object.assign(i[n],o):(o[PrimaryKey]=Symbol["for"](n),i[n]=o);var s=e.source,t=s.objectStore?s.objectStore.name:c.name;i[n][b.AfterRead]&&i[n][b.AfterRead](q),q.record=o;var u=j.dispatchEvent(new CustomEvent("read",{detail:q,cancelable:!0}));if(u){var v=a?a.from(i[n]):i[n];v[PrimaryKey]=Symbol["for"](n);var w=k?k(v,m):v;if(f&&m-g>=f)return g+=f,l({record:v,result:w,index:m})}e["continue"]()})})}}},{key:"setStoreMeta",value:function setStoreMeta(a,b,c){localStorage.setItem("::::cvdb::".concat(a,"::").concat(b),JSON.stringify(c))}},{key:"getStoreMeta",value:function getStoreMeta(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:null,d=localStorage.getItem("::::cvdb::".concat(a,"::").concat(b)),e=null===d?c:JSON.parse(d);return null===e?c:e}},{key:"createObjectStore",value:function createObjectStore(a,b){var c=this[Connection].createObjectStore(a,b);return this.setStoreMeta(a,"store",b),c}},{key:"deleteObjectStore",value:function deleteObjectStore(a){return this[Connection].deleteObjectStore(a)}},{key:"checkHighWaterMark",value:function checkHighWaterMark(a){var b=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0,c=this.getStoreMeta(a,"highWater",0);return c}},{key:"setHighWaterMark",value:function setHighWaterMark(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0,d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:void 0,e=this[Metadata][a],f=b[e.highWater],g=this.getStoreMeta(a,"highWater",0);this.setStoreMeta(a,"highWater",f),this.dispatchEvent(new CustomEvent("highWaterMoved",{detail:{database:this[Name],record:b,store:a,type:"highWaterMoved",subType:d,origin:c,oldValue:g,value:f}}))}},{key:"checkLowWaterMark",value:function checkLowWaterMark(a){var b=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0,c=this.getStoreMeta(a,"lowWater",1/0);return c}},{key:"setLowWaterMark",value:function setLowWaterMark(a,b){var c=2<arguments.length&&void 0!==arguments[2]?arguments[2]:void 0,d=3<arguments.length&&void 0!==arguments[3]?arguments[3]:void 0,e=this[Metadata][a],f=b[e.highWater],g=this.getStoreMeta(a,"lowWater",null);this.setStoreMeta(a,"lowWater",f),this.dispatchEvent(new CustomEvent("lowWaterMoved",{detail:{database:this[Name],record:b,store:a,type:"lowWaterMoved",subType:d,origin:c,oldValue:g,value:f}}))}}],[{key:"open",value:function open(a){var c=this,d=1<arguments.length&&void 0!==arguments[1]?arguments[1]:0;return this[Instances][a]?Promise.resolve(this[Instances][a]):new Promise(function(e,f){var g=indexedDB.open(a,d);g.onerror=function(a){b.dispatchEvent(new CustomEvent("error",{detail:{database:c[Name],error:a,store:void 0,type:"read",subType:"select"}})),f(a)},g.onsuccess=function(b){var d=new c(b.target.result);c[Instances][a]=d,e(d)},g.onupgradeneeded=function(b){var e=b.target.result;e.addEventListener("error",function(a){return console.error(a)});for(var f=new c(e),g=b.oldVersion+1;g<=d;g+=1)f["_version_"+g](e);c[Instances][a]=f}})}},{key:"getPrimaryKey",value:function getPrimaryKey(a){return a[PrimaryKey]?a[PrimaryKey].description:null}},{key:"destroyDatabase",value:function destroyDatabase(){var a=this;return new Promise(function(c,d){var e=indexedDB["delete"](dbName);e.onerror=function(a){b.dispatchEvent(new CustomEvent("error",{detail:{database:dbName,error:a,type:"destroy"}})),d(a)},e.onsuccess=function(){delete a[Instances][dbName],c(dbName)}})}}]),b}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));exports.Database=Database,Object.defineProperty(Database,Instances,{value:[]}),Object.defineProperty(Database,Target,{value:document.createDocumentFragment()}),Object.defineProperty(Database,"BeforeWrite",{value:BeforeWrite}),Object.defineProperty(Database,"AfterWrite",{value:AfterWrite}),Object.defineProperty(Database,"BeforeInsert",{value:BeforeInsert}),Object.defineProperty(Database,"AfterInsert",{value:AfterInsert}),Object.defineProperty(Database,"BeforeUpdate",{value:BeforeUpdate}),Object.defineProperty(Database,"AfterUpdate",{value:AfterUpdate}),Object.defineProperty(Database,"BeforeRead",{value:BeforeRead}),Object.defineProperty(Database,"AfterRead",{value:AfterRead});var _loop=function(a){Object.defineProperty(Database,a,{value:function value(){var b;return(b=Database[Target])[a].apply(b,arguments)}})};for(var method in["addEventListener","removeEventListener","dispatchEvent"])_loop(method);
});

;require.register("model/Model.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Model=void 0;var _Cache=require("../base/Cache"),_Bindable=require("../base/Bindable");function _createForOfIteratorHelper(a,b){var c;if("undefined"==typeof Symbol||null==a[Symbol.iterator]){if(Array.isArray(a)||(c=_unsupportedIterableToArray(a))||b&&a&&"number"==typeof a.length){c&&(a=c);var d=0,e=function(){};return{s:e,n:function n(){return d>=a.length?{done:!0}:{done:!1,value:a[d++]}},e:function e(a){throw a},f:e}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var f,g=!0,h=!1;return{s:function s(){c=a[Symbol.iterator]()},n:function n(){var a=c.next();return g=a.done,a},e:function e(a){h=!0,f=a},f:function f(){try{g||null==c["return"]||c["return"]()}finally{if(h)throw f}}}}function _unsupportedIterableToArray(a,b){if(a){if("string"==typeof a)return _arrayLikeToArray(a,b);var c=Object.prototype.toString.call(a).slice(8,-1);return"Object"===c&&a.constructor&&(c=a.constructor.name),"Map"===c||"Set"===c?Array.from(a):"Arguments"===c||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(c)?_arrayLikeToArray(a,b):void 0}}function _arrayLikeToArray(a,b){(null==b||b>a.length)&&(b=a.length);for(var c=0,d=Array(b);c<b;c++)d[c]=a[c];return d}function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}var Saved=Symbol("Saved"),Changed=Symbol("Changed"),Model=/*#__PURE__*/function(){function a(){_classCallCheck(this,a),Object.defineProperty(this,Changed,{value:_Bindable.Bindable.make({})}),Object.defineProperty(this,Saved,{writable:!0,value:!1})}return _createClass(a,null,[{key:"keyProps",value:function keyProps(){return["id","class"]}}]),_createClass(a,[{key:"consume",value:function consume(a){var b=this,c=!!(1<arguments.length&&void 0!==arguments[1])&&arguments[1],d=this.__proto__.constructor.keyProps(),e=function(a,c){if(c&&"object"===_typeof(c)&&c.__proto__.constructor.keyProps){var d=c.__proto__.constructor.keyProps(),e=d.map(function(a){return c[a]}).join("::"),f=_Cache.Cache.load(e,!1,"models-by-type-and-publicId");f&&(f.consume(c),c=f)}b[a]=c};for(var f in a)(c||!this[Changed][f])&&(d.includes(f)||e(f,a[f]))}},{key:"changed",value:function changed(){this[Saved]=!1}},{key:"stored",value:function stored(){for(var a in this[Changed])this[Changed][a]=!1;this[Saved]=!0}},{key:"isSaved",value:function isSaved(){return this[Saved]}}],[{key:"from",value:function from(a){var b,c=this,d=this.keyProps(),e=d.map(function(b){return a[b]}).join("::"),f="models-by-type-and-publicId",g=_Cache.Cache.load(e,!1,f),h=g?g:_Bindable.Bindable.makeBindable(new this),i=_createForOfIteratorHelper(d);try{for(i.s();!(b=i.n()).done;){var j,k,l=b.value;h[l]=null!==(j=null!==(k=h[l])&&void 0!==k?k:a[l])&&void 0!==j?j:null}}catch(a){i.e(a)}finally{i.f()}if(h.consume(a),_Cache.Cache.store(e,h,0,f),!g){var m=!1;h.bindTo(function(a,b,d){"symbol"===_typeof(b)||a===d[b]||(h[Changed][b]=m,h[Saved]=!m&&c[Saved])}),m=!0}return h}}]),a}();exports.Model=Model,Object.defineProperty(Model,"Saved",{value:Saved}),Object.defineProperty(Model,"Changed",{value:Changed});
});

require.register("model/SourceWorker.js", function(exports, require, module) {
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

require.register("model/Store.js", function(exports, require, module) {
"use strict";var _Model2=require("curvature/model/Model");Object.defineProperty(exports,"__esModule",{value:!0}),exports.Store=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}function _defineProperty(a,b,c){return b in a?Object.defineProperty(a,b,{value:c,enumerable:!0,configurable:!0,writable:!0}):a[b]=c,a}var Store=/*#__PURE__*/function(a){function b(){var a;_classCallCheck(this,b);for(var d=arguments.length,e=Array(d),f=0;f<d;f++)e[f]=arguments[f];return a=c.call.apply(c,[this].concat(e)),_defineProperty(_assertThisInitialized(a),"class","MetaStore"),a}_inherits(b,a);var c=_createSuper(b);return b}(_Model2.Model);exports.Store=Store;
});

;require.register("strings/Parser.js", function(exports, require, module) {
"use strict";function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}// EXTREMELY ALPHA (not the good kind)
var INSERT=1,ENTER=2,LEAVE=3,HOME=4,Chunk=function a(){_classCallCheck(this,a),this.depth=0,this.match=null,this.type="normal",this.list=[]},Parser=/*#__PURE__*/function(){function a(b,c){_classCallCheck(this,a),this.index=0,this.mode="normal",this.stack=[],this.tokens=b||{},this.modes=c||{}}return _createClass(a,[{key:"parse",value:function parse(a){if(!(this.mode in this.modes))throw new Error("Mode ".concat(this.mode," does not exist on parser."),this);var b=new Chunk,c=this.modes[this.mode];for(b.type=this.mode;this.index<a.length;){var j=!1;for(var k in c){var d=this.tokens[k],e=d.exec(a.substr(this.index));if(e&&!(0<e.index)){if(!c[k]){throw new Error("Invalid token type \"".concat(k,"\" found in mode \"").concat(this.mode,"\"."))}var f=e[0],g="object"===_typeof(c[k])?c[k]:[c[k]];j=!0,console.log(b.type,b.depth,f),this.index+=f.length;var h="normal";for(var l in g){var i=g[l];if("string"==typeof i){if(!(i in this.modes))throw new Error("Mode \"".concat(i,"\" does not exist."));this.mode=i,c=this.modes[this.mode],h=i;continue}switch(i){case INSERT:b.list.push(f);break;case ENTER:var m=new Chunk;m.depth=b.depth+1,m.match=f,m.type=h,b.list.push(m),this.stack.push(b),b=m;// this.mode = chunk.type;
break;case LEAVE:if(!this.stack.length)throw console.log(this.mode,"\"".concat(f,"\""),b),new Error("Already at the top of the stack.");b=this.stack.pop(),this.mode=b.type,c=this.modes[this.mode];}}break}}if(!j)break}if(this.stack.length)throw new Error("Did not return to top of stack!");return this.stack.shift()||b}}]),a}();
});

;require.register("tag/LazyTag.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.LazyTag=void 0;var _ScrollTag2=require("./ScrollTag"),_Dom=require("../base/Dom");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var LazyTag=/*#__PURE__*/function(a){function b(a,d,e,f,g){var h;return _classCallCheck(this,b),h=c.call(this,a,d,e,f,g),h.element.classList.remove("cv-visible"),h.element.classList.add("cv-not-visible"),h.bindTo("visible",function(a){a&&(h.afterScroll&&clearTimeout(h.afterScroll),h.afterScroll=setTimeout(function(){h.element&&(h.element.classList.add("cv-visible"),h.element.classList.remove("cv-not-visible"),_Dom.Dom.mapTags(h.element,"[cv-lazy-style]",function(a){var b=a.getAttribute("cv-lazy-style"),c=a.getAttribute("style");a.setAttribute("style",c+";"+b),a.removeAttribute("cv-lazy-style")}))},.5*(h.offsetTop||h.element.offsetTop)+.5*h.element.offsetLeft))}),h}_inherits(b,a);var c=_createSuper(b);return b}(_ScrollTag2.ScrollTag);exports.LazyTag=LazyTag;
});

;require.register("tag/PopOutTag.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.PopOutTag=void 0;var _Bindable=require("../base/Bindable"),_Dom=require("../base/Dom"),_Tag2=require("../base/Tag");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _get(a,b,c){return _get="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(a,b,c){var d=_superPropBase(a,b);if(d){var e=Object.getOwnPropertyDescriptor(d,b);return e.get?e.get.call(c):e.value}},_get(a,b,c||a)}function _superPropBase(a,b){for(;!Object.prototype.hasOwnProperty.call(a,b)&&(a=_getPrototypeOf(a),null!==a););return a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var PopOutTag=/*#__PURE__*/function(a){function b(a,d,e,f,g){var i;return _classCallCheck(this,b),i=c.call(this,a,d,e,f,g),i.poppedOut=!1,i.style=a.getAttribute("style")||"",i.moving=!1,i.hostSelector=a.getAttribute("cv-pop-to"),i.popMargin=a.getAttribute("cv-pop-margin")||0,i.popSpeed=a.getAttribute("data-pop-speed")||1750,a.removeAttribute("cv-pop-to"),a.removeAttribute("cv-pop-margin"),a.removeAttribute("data-pop-speed"),i.verticalDuration=.4,i.horizontalDuration=.1,i.unpoppedStyle="",i.previousScroll=0,i.bodyStyle="",i.bodyScroll=0,i.element.classList.add("unpopped"),i.scrollStyle="",i.style="",i.popTimeout=null,i.rect=null,i.transformRect=null,i.clickListener=function(a){var b=Math.sqrt,c=Math.pow;if(i.rect=i.element.getBoundingClientRect(),!i.poppedOut){i.distance=b(c(i.rect.top,2)+c(i.rect.left,2));var d=i.popSpeed,e=window.innerWidth-i.rect.right,f=window.innerHeight-i.rect.bottom,g=(i.rect.left+e)/2,h=(i.rect.top+f)/2;i.horizontalDuration=g/d,i.verticalDuration=h/d,.1>i.horizontalDuration&&(i.horizontalDuration=.1),.1>i.verticalDuration&&(i.verticalDuration=.1),.4<i.horizontalDuration&&(i.horizontalDuration=.4),.4<i.verticalDuration&&(i.verticalDuration=.4)}i.element.contains(a.target)&&(a.stopPropagation(),a.preventDefault(),i.moving||(i.poppedOut?a.target.matches(".closeButton")&&i.poppedOut&&i.unpop():i.pop()))},i.escapeListener=function(a){i.poppedOut&&"Escape"===a.key&&i.unpop()},i.resizeListener=function(){if(i.poppedOut){for(var g=i.element;g.parentNode&&!g.matches(i.hostSelector)&&g.parentNode!=document;)g=g.parentNode;var a=hostTag.getBoundingClientRect(),b=i.style+i.unpoppedStyle,c=a.x,d=a.y+document.documentElement.scrollTop,e=a.width,f=a.height;i.transformRect&&(c-=i.transformRect.x,d-=i.transformRect.y),c+i.popMargin,d+i.popMargin,e+2*i.popMargin,f+2*i.popMargin,b+=";\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t\toverflow: hidden;\n\t\t\t\tposition:  fixed;\n\t\t\t\tleft:      ".concat(c,"px;\n\t\t\t\ttop:        ").concat(d,"px;\n\t\t\t\twidth:      ").concat(e,"px;\n\t\t\t\theight:     ").concat(f,"px;\n\t\t\t\toverflow-y: auto;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t"),i.element.setAttribute("style",b)}},i.element.___clickListener___||(Object.defineProperty(i.element,"___scrollListeners___",{enumerable:!1,writable:!0}),a.___clickListener___=i.clickListener,a.___escapeListener___=i.escapeListener,a.___resizeListener___=i.resizeListener,i.element.addEventListener("click",a.___clickListener___),window.addEventListener("keyup",a.___escapeListener___),window.addEventListener("resize",a.___resizeListener___),i.cleanup.push(function(a){return function(){a.removeEventListener("click",a.___clickListener___),window.removeEventListener("keyup",a.___escapeListener___),window.removeEventListener("resize",a.___resizeListener___)}}(a))),i}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"pause",value:function pause(){var a=!(0<arguments.length&&void 0!==arguments[0])||arguments[0];_get(_getPrototypeOf(b.prototype),"pause",this).call(this,a),a&&(document.body.setAttribute("style",this.bodyStyle),document.body.setAttribute("style",""))}},{key:"pop",value:function pop(){var a=this;b.popLevel(),this.previousScroll=window.scrollY,this.rect=this.element.getBoundingClientRect(),this.style=this.element.getAttribute("style");var c=this.element;// console.log(hostTag);
for(this.transformRect=null;c.parentNode&&!c.matches(this.hostSelector)&&c.parentNode!=document;)c=c.parentNode,this.transformRect||"none"===getComputedStyle(c).transform||(this.transformRect=c.getBoundingClientRect());console.log(this.transformRect);var d=c.getBoundingClientRect();this.element.classList.add("popping");var e=this.rect.x,f=this.rect.y,g=this.rect.width,i=this.rect.height;this.transformRect&&(e-=this.transformRect.x,f-=this.transformRect.y),window.requestAnimationFrame(function(){a.unpoppedStyle="\n\t\t\t\t;position:  fixed;\n\t\t\t\tleft:       ".concat(e,"px;\n\t\t\t\ttop:        ").concat(f,"px;\n\t\t\t\twidth:      ").concat(g,"px;\n\t\t\t\theight:     ").concat(i,"px;\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition-duration: 0s;\n\t\t\t\toverflow: hidden;\n\t\t\t");var b=d.x,c=d.y+document.documentElement.scrollTop,j=d.width,k=d.height;console.log(a.transformRect),a.transformRect&&(b-=a.transformRect.x,c-=a.transformRect.y),b+a.popMargin,c+a.popMargin,j+2*a.popMargin,k+2*a.popMargin;// transition: width ${this.horizontalDuration}s  ease-out
// , top ${this.verticalDuration}s    ease-out
// , left ${this.horizontalDuration}s ease-out
// , height ${this.verticalDuration}s ease-out
// , all ${this.horizontalDuration}s  ease-out;
var h=a.style+a.unpoppedStyle;a.element.setAttribute("style",h),setTimeout(function(){h+="\n\t\t\t\t\t;left:      ".concat(b,"px;\n\t\t\t\t\ttop:        ").concat(c+document.documentElement.scrollTop,"px;\n\t\t\t\t\twidth:      ").concat(j,"px;\n\t\t\t\t\theight:     ").concat(k,"px;\n\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\ttransition: width ").concat(a.horizontalDuration,"s ease-out\n\t\t\t\t\t\t, top ").concat(a.verticalDuration,"s           ease-out\n\t\t\t\t\t\t, left ").concat(a.horizontalDuration,"s        ease-out\n\t\t\t\t\t\t, height ").concat(a.verticalDuration,"s        ease-out\n\t\t\t\t\t\t, all ").concat(a.horizontalDuration,"s         ease-out;\n\t\t\t\t"),a.moving=!0,a.element.setAttribute("style",h),a.element.classList.add("popped"),a.element.classList.remove("unpopped"),a.element.classList.remove("popping"),a.popTimeout=setTimeout(function(){if(a.element){a.bodyStyle=document.body.getAttribute("style"),document.body.setAttribute("style","height:100%;overflow:hidden;"),a.moving=!1,_Dom.Dom.mapTags(a.element,!1,function(b){var c=new CustomEvent("cvPopped");b.dispatchEvent(c),a.scrollStyle=a.element.getAttribute("style")});var b=new CustomEvent("cvPop",{bubbles:!0,detail:{tag:a,view:a.parent,publicId:a.parent.args.publicId}});a.element.dispatchEvent(b)}},1e3*a.horizontalDuration)},2*16.7),a.poppedOut=!0})}},{key:"unpop",value:function unpop(){var a=this;this.element.classList.add("unpopping"),this.popTimeout&&clearTimeout(this.popTimeout),0==b.level?document.body.setAttribute("style",""):document.body.setAttribute("style",this.bodyStyle||""),b.unpopLevel(),this.rect||(this.rect=this.element.getBoundingClientRect()),window.scrollTo(0,this.previousScroll);var c=this.style+this.unpoppedStyle+";transition: width ".concat(this.horizontalDuration,"s ease-in\n\t\t\t\t\t, height ").concat(this.verticalDuration,"s        ease-in\n\t\t\t\t\t, all ").concat(this.horizontalDuration,"s         ease-in;");this.element.setAttribute("style",c),this.moving=!0,setTimeout(function(){a.element&&a.element.classList.remove("popped")},1e3*this.horizontalDuration),setTimeout(function(){if(a.element.classList.add("unpopped"),a.element.classList.remove("unpopping"),!!a.element){a.element.setAttribute("style",a.style),a.moving=!1,_Dom.Dom.mapTags(a.element,!1,function(a){var b=new CustomEvent("cvUnpopped");a.dispatchEvent(b)});var b=new CustomEvent("cvUnpop",{bubbles:!0,detail:{tag:a,view:a.parent,publicId:a.parent.args.publicId}});a.element.dispatchEvent(b)}},1e3*this.horizontalDuration),this.poppedOut=!1}},{key:"remove",value:function remove(){document.body.setAttribute("style",this.bodyStyle),_get(_getPrototypeOf(b.prototype),"remove",this).call(this)}}],[{key:"popLevel",value:function popLevel(){return this.level||(this.level=0),this.level++,this.level}},{key:"unpopLevel",value:function unpopLevel(){return this.level||(this.level=0),this.level--,0>this.level&&(this.level=0),this.level}}]),b}(_Tag2.Tag);exports.PopOutTag=PopOutTag;
});

;require.register("tag/ScrollTag.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.ScrollTag=void 0;var _Tag2=require("../base/Tag"),_Dom=require("../base/Dom"),_Bindable=require("../base/Bindable");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ScrollTag=/*#__PURE__*/function(a){function b(a,d,e,f,g){var h;return _classCallCheck(this,b),h=c.call(this,a,d,e,f,g),h.visible=!1,h.offsetTop=!1,h.offsetBottom=!1,h.attachListener=function(b){for(var c=b.target;c.parentNode;)c=c.parentNode;rootNode!==window&&rootNode!==document||b.target!==a||(h.addScrollListener(b.target),h.addResizeListener(b.target),h.scrolled(b.target),b.target.removeEventListener("cvDomAttached",h.attachListener))},h.element.addEventListener("cvDomAttached",h.attachListener),h.cleanup.push(function(a){return function(){a.removeEventListener("cvDomAttached",h.attachListener)}}(h.element)),h.bindTo("visible",function(a){var b;b=a?new Event("cvScrolledIn"):new Event("cvScrolledOut"),_Dom.Dom.mapTags(h.element,!1,function(a){a.dispatchEvent(b)}),h.element.dispatchEvent(b)}),h.bindTo("offsetTop",function(a){var b=new CustomEvent("cvScrolled",{detail:{offset:a}});_Dom.Dom.mapTags(h.element,!1,function(a){a.dispatchEvent(b)}),h.element.dispatchEvent(b)}),h}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"scrolled",value:function scrolled(){var a=this.element;if(a){var b=!1,c=a.getBoundingClientRect();0<c.bottom&&c.top<window.innerHeight&&(b=!0),this.proxy.visible=b,this.proxy.offsetTop=c.top||0,this.proxy.offsetBottom=c.bottom||0}}},{key:"addScrollListener",value:function addScrollListener(a){var b=this;if(!a.___scrollListener___){Object.defineProperty(a,"___scrollListener___",{enumerable:!1,writable:!0}),a.___scrollListener___=function(a){b.scrolled(a.target)};for(var c=a,d={passive:!0,capture:!0};c.parentNode;)c=c.parentNode,c.addEventListener("scroll",a.___scrollListener___,d),this.direct.cleanup.push(function(a,b,c){return function(){a.removeEventListener("scroll",b.___scrollListener___,c),b=a=null}}(c,a,d))}}},{key:"addResizeListener",value:function addResizeListener(a){var b=this;a.___resizeListener___||(Object.defineProperty(a,"___resizeListener___",{enumerable:!1,writable:!0}),a.___resizeListener___=function(a){b.scrolled(a.target)},window.addEventListener("resize",this.resizeListener),this.direct.cleanup.push(function(b){return function(){window.removeEventListener("resize",b.___resizeListener___),a.___resizeListener___=null,a=null}}(a)))}}]),b}(_Tag2.Tag);exports.ScrollTag=ScrollTag;
});

;require.register("toast/Toast.js", function(exports, require, module) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Toast=void 0;var _View2=require("../base/View"),_Bindable=require("../base/Bindable"),_ToastAlert=require("./ToastAlert");function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var Toast=/*#__PURE__*/function(a){function b(){var a;return _classCallCheck(this,b),a=c.call(this),a.template="\n\t\t\t<div id = \"[[_id]]\" cv-each = \"alerts:alert\" class = \"toast\">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t",a.args.alerts=[],a}_inherits(b,a);var c=_createSuper(b);return _createClass(b,null,[{key:"instance",value:function instance(){return this.inst||(this.inst=new this),this.inst}}]),_createClass(b,[{key:"pop",value:function pop(a){var b=this,c=this.args.alerts.length;this.args.alerts.push(a),a.decay(function(a){return function(){for(var c in b.args.alerts)if(_Bindable.Bindable.ref(b.args.alerts[c])===_Bindable.Bindable.ref(a))return a.remove(),void delete b.args.alerts[c]}}(a))}},{key:"alert",value:function alert(a,b,c){return this.pop(new _ToastAlert.ToastAlert({title:a,body:b,time:c}))}}]),b}(_View2.View);exports.Toast=Toast;
});

;require.register("toast/ToastAlert.js", function(exports, require, module) {
"use strict";var _View2=require("../base/View");Object.defineProperty(exports,"__esModule",{value:!0}),exports.ToastAlert=void 0;function _typeof(a){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(a){return typeof a}:function(a){return a&&"function"==typeof Symbol&&a.constructor===Symbol&&a!==Symbol.prototype?"symbol":typeof a},_typeof(a)}function _classCallCheck(a,b){if(!(a instanceof b))throw new TypeError("Cannot call a class as a function")}function _defineProperties(a,b){for(var c,d=0;d<b.length;d++)c=b[d],c.enumerable=c.enumerable||!1,c.configurable=!0,"value"in c&&(c.writable=!0),Object.defineProperty(a,c.key,c)}function _createClass(a,b,c){return b&&_defineProperties(a.prototype,b),c&&_defineProperties(a,c),a}function _inherits(a,b){if("function"!=typeof b&&null!==b)throw new TypeError("Super expression must either be null or a function");a.prototype=Object.create(b&&b.prototype,{constructor:{value:a,writable:!0,configurable:!0}}),b&&_setPrototypeOf(a,b)}function _setPrototypeOf(a,b){return _setPrototypeOf=Object.setPrototypeOf||function(a,b){return a.__proto__=b,a},_setPrototypeOf(a,b)}function _createSuper(a){var b=_isNativeReflectConstruct();return function(){var c,d=_getPrototypeOf(a);if(b){var e=_getPrototypeOf(this).constructor;c=Reflect.construct(d,arguments,e)}else c=d.apply(this,arguments);return _possibleConstructorReturn(this,c)}}function _possibleConstructorReturn(a,b){return b&&("object"===_typeof(b)||"function"==typeof b)?b:_assertThisInitialized(a)}function _assertThisInitialized(a){if(void 0===a)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return a}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(a){return!1}}function _getPrototypeOf(a){return _getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function(a){return a.__proto__||Object.getPrototypeOf(a)},_getPrototypeOf(a)}var ToastAlert=/*#__PURE__*/function(a){function b(a){var d;return _classCallCheck(this,b),d=c.call(this,a),d.args.running=!1,d.args.time=d.args.time||16e3,d.init=d.args.time,d.args.title=d.args.title||"Standard alert",d.args.status="new",d.args.body=d.args.body||"This is a standard alert.",d.template="\n\t\t\t<div id = \"[[_id]]\" class = \"alert toast-[[status]]\">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t",d}_inherits(b,a);var c=_createSuper(b);return _createClass(b,[{key:"decay",value:function decay(){var a=this;this.args.running=!0,this.onTimeout(50,function(){a.args.status=""}),this.onTimeout(300,function(){a.args.status="decaying"}),this.onTimeout(2400,function(){a.args.status="imminent"}),this.onTimeout(3500,function(){a.remove()})}}]),b}(_View2.View);exports.ToastAlert=ToastAlert;
});

;require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

/* jshint ignore:start */(function(){var WebSocket=window.WebSocket||window.MozWebSocket,br=window.brunch=window.brunch||{},ar=br["auto-reload"]=br["auto-reload"]||{};if(WebSocket&&!ar.disabled&&!window._ar){window._ar=!0;var cacheBuster=function(a){var b=Math.round,c=b(Date.now()/1e3).toString();return a=a.replace(/(\&|\\?)cacheBuster=\d*/,""),a+(0<=a.indexOf("?")?"&":"?")+"cacheBuster="+c},browser=navigator.userAgent.toLowerCase(),forceRepaint=ar.forceRepaint||-1<browser.indexOf("chrome"),reloaders={page:function(){window.location.reload(!0)},stylesheet:function(){[].slice.call(document.querySelectorAll("link[rel=stylesheet]")).filter(function(a){var b=a.getAttribute("data-autoreload");return a.href&&"false"!=b}).forEach(function(a){a.href=cacheBuster(a.href)}),forceRepaint&&setTimeout(function(){document.body.offsetHeight},25)},javascript:function(){var scripts=[].slice.call(document.querySelectorAll("script")),textScripts=scripts.map(function(a){return a.text}).filter(function(a){return 0<a.length}),srcScripts=scripts.filter(function(a){return a.src}),loaded=0,all=srcScripts.length,onLoad=function(){++loaded,loaded===all&&textScripts.forEach(function(script){eval(script)})};srcScripts.forEach(function(a){var b=a.src;a.remove();var c=document.createElement("script");c.src=cacheBuster(b),c.async=!0,c.onload=onLoad,document.head.appendChild(c)})}},port=ar.port||9486,host=br.server||window.location.hostname||"localhost",connect=function(){var a=new WebSocket("ws://"+host+":"+port);a.onmessage=function(a){if(!ar.disabled){var b=a.data,c=reloaders[b]||reloaders.page;c()}},a.onerror=function(){a.readyState&&a.close()},a.onclose=function(){window.setTimeout(connect,1e3)}};connect()}})();
;
//# sourceMappingURL=curvature.js.map