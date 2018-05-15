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