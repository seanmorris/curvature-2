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
                        target[key] = value;
                    }

                    if (!target.___setCount___[key]) {
                        target.___setCount___[key] = 0;
                    }

                    target.___setCount___[key]++;

                    var warnOn = 10;

                    if (target.___setCount___[key] > warnOn && value instanceof Object) {
                        console.log('Warning: Resetting bindable reference "' + key + '" to object ' + target.___setCount___[key] + ' times.');
                    }

                    return true;
                };
            }(object);

            var del = function (object) {
                return function (target, key) {
                    // console.log(key, 'DEL');

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
                    if (typeof target[key] == 'function') {

                        if (target.___wrapped___[key]) {
                            return target.___wrapped___[key];
                        }

                        target.___wrapped___[key] = function () {
                            target.___executing___ = key;

                            target.___stack___.unshift(key);
                            target.___stackTime___.unshift(new Date().getTime());

                            // console.log(`Start ${key}()`);

                            for (var _i6 in target.___before___) {
                                target.___before___[_i6](target, key, object);
                            }

                            var ret = target[key].apply(target, arguments);

                            for (var _i7 in target.___after___) {
                                target.___after___[_i7](target, key, object);
                            }

                            target.___executing___ = null;

                            var execTime = new Date().getTime() - target.___stackTime___[0];

                            if (execTime > 150) {
                                // console.log(`End ${key}(), took ${execTime} ms`);
                            }

                            target.___stack___.shift();
                            target.___stackTime___.shift();

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
    }]);

    return Bindable;
}();