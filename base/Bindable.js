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

            Object.defineProperty(object, 'isBound', {
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

            // Object.defineProperty(object, 'toString', {
            //     enumerable: false,
            //     writable: true
            // });

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
                writable: false,
                value: object
            });
            object.___isBindable___ = Bindable;
            object.___wrapped___ = {};
            object.___binding___ = {};
            object.___bindingAll___ = [];
            object.___stack___ = [];
            object.___stackTime___ = [];
            object.___before___ = [];
            object.___after___ = [];
            object.___setCount___ = {};
            object.bindTo = function (property) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

                var bindToAll = false;

                if (property instanceof Function) {
                    options = callback || {};
                    callback = property;
                    bindToAll = true;
                }

                var throttle = false;

                if (options.delay >= 0) {
                    callback = function (callback) {
                        return function (v, k, t, d) {
                            var p = t[k];
                            setTimeout(function () {
                                return callback(v, k, t, d, p);
                            }, options.delay);
                        };
                    }(callback);
                }

                if (options.throttle >= 0) {
                    callback = function (callback) {
                        return function (v, k, t, d) {
                            if (throttle) {
                                return;
                            }
                            var p = t[k];
                            callback(v, k, t, d, p);
                            throttle = true;
                            setTimeout(function () {
                                return throttle = false;
                            }, options.throttle);
                        };
                    }(callback);
                }

                var waiter = void 0;

                if (options.wait >= 0) {
                    callback = function (callback) {
                        return function (v, k, t, d) {
                            if (waiter) {
                                clearTimeout(waiter);
                            }
                            var p = t[k];
                            waiter = setTimeout(function () {
                                return callback(v, k, t, d, p);
                            }, options.wait);
                        };
                    }(callback);
                }

                if (bindToAll) {
                    var _bindIndex = object.___bindingAll___.length;

                    object.___bindingAll___.push(callback);

                    for (var i in object) {
                        callback(object[i], i, object, false);
                    }

                    return function () {
                        object.___bindingAll___[_bindIndex] = null;
                    };
                }

                if (!object.___binding___[property]) {
                    object.___binding___[property] = [];
                }

                var bindIndex = object.___binding___[property].length;

                object.___binding___[property].push(callback);

                callback(object[property], property, object, false);

                return function () {
                    if (!object.___binding___[property]) {
                        return;
                    }
                    object.___binding___[property][bindIndex] = null;
                };
            };

            object.isBound = function () {
                for (var i in object.___bindingAll___) {
                    if (object.___bindingAll___[i]) {
                        return true;
                    }
                }

                for (var _i in object.___binding___) {
                    for (var j in object.___binding___[_i]) {
                        if (object.___binding___[_i][j]) {
                            return true;
                        }
                    }
                }
                return false;
            };

            // object.toString = object.toString || (() => {
            //     if (typeof object == 'object') {
            //         return JSON.stringify(object);
            //         return '[object]'
            //     }

            //     return object;
            // });

            for (var i in object) {
                if (object[i] && _typeof(object[i]) == 'object' && !object[i] instanceof Node && !object[i] instanceof Promise) {
                    object[i] = Bindable.makeBindable(object[i]);
                }
            }

            var set = function set(target, key, value) {
                if (typeof key === 'string' && key.substring(0, 3) === '___' && key.slice(-3) === '___') {
                    return true;
                }

                if (target[key] === value) {
                    return true;
                }

                // console.log(`Setting ${key}`, value);

                if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) == 'object' && !(value instanceof Node)) {
                    // console.log(value);
                    if (value.___isBindable___ !== Bindable) {
                        value = Bindable.makeBindable(value);

                        for (var _i2 in value) {
                            if (value[_i2] && _typeof(value[_i2]) == 'object') {
                                value[_i2] = Bindable.makeBindable(value[_i2]);
                            }
                        }
                    }
                }

                for (var _i3 in object.___bindingAll___) {
                    if (!object.___bindingAll___[_i3]) {
                        continue;
                    }
                    object.___bindingAll___[_i3](value, key, target, false);
                }

                var stop = false;

                if (key in object.___binding___) {
                    for (var _i4 in object.___binding___[key]) {
                        if (!object.___binding___[key]) {
                            continue;
                        }
                        if (!object.___binding___[key][_i4]) {
                            continue;
                        }
                        if (object.___binding___[key][_i4](value, key, target, false, target[key]) === false) {
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

                return Reflect.set(target, key, value);
            };

            var del = function del(target, key) {
                if (!(key in target)) {
                    return true;
                }

                for (var _i5 in object.___bindingAll___) {
                    object.___bindingAll___[_i5](undefined, key, target, true, target[key]);
                }

                if (key in object.___binding___) {
                    for (var _i6 in object.___binding___[key]) {
                        if (!object.___binding___[key][_i6]) {
                            continue;
                        }
                        object.___binding___[key][_i6](undefined, key, target, true, target[key]);
                    }
                }

                if (Array.isArray(target)) {
                    target.splice(key, 1);
                } else {
                    delete target[key];
                }

                return true;
            };

            var get = function get(target, key) {
                if (target[key] instanceof Function) {

                    if (target.___wrapped___[key]) {
                        return target.___wrapped___[key];
                    }

                    target.___wrapped___[key] = function () {
                        target.___executing___ = key;

                        target.___stack___.unshift(key);
                        // target.___stackTime___.unshift((new Date).getTime());

                        // console.log(`Start ${key}()`);

                        for (var _i7 in target.___before___) {
                            target.___before___[_i7](target, key, object);
                        }

                        var objRef = object instanceof Promise ? object : object.___ref___;

                        var ret = target[key].apply(objRef, arguments);

                        for (var _i8 in target.___after___) {
                            target.___after___[_i8](target, key, object);
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

                if (target[key] instanceof Object) {
                    Bindable.makeBindable(target[key]);
                }

                // console.log(`Getting ${key}`);

                return target[key];
            };

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
            object.___bindingAll___ = [];
            object.___binding___ = {};
            object.___before___ = [];
            object.___after___ = [];
            object.___ref___ = {};
            // object.toString         = ()=>'{}';
        }
    }, {
        key: 'resolve',
        value: function resolve(object, path) {
            var owner = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

            // console.log(path, object);

            var node = void 0;
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
    }]);

    return Bindable;
}();