export class Bindable {
    static isBindable(object) {
        if (!object.___binding___) {
            return false;
        }

        return object.___binding___ === Bindable;
    }
    static makeBindable(object) {

        if (!object ||
            object.___binding___ ||
            typeof object !== 'object' ||
            object instanceof Node
        ) {
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
        object.___wrapped___    = {};
        object.___binding___    = {};
        object.___bindingAll___ = [];
        object.bindTo = ((object) => (property, callback = null) => {
            if (callback == null) {
                callback = property;
                object.___bindingAll___.push(callback);
                for (let i in object) {
                    callback(object[i], i, object, false);
                }
                return;
            }

            if (!object.___binding___[property]) {
                object.___binding___[property] = [];
            }

            object.___binding___[property].push(callback);

            callback(object[property], property, object, false);

        })(object);

        object.___stack___ = [];
        object.___stackTime___ = [];
        object.___before___ = [];
        object.___after___ = [];
        object.___setCount___ = {};

        object.toString = ((object) => () => {
            if (typeof object == 'object') {
                return JSON.stringify(object);
                return '[object]'
            }

            return object;
        })(object);

        for (let i in object) {
            if (object[i] &&
                typeof object[i] == 'object' &&
                !object[i] instanceof Node
            ) {
                object[i] = Bindable.makeBindable(object[i]);
            }
        }

        let set = ((object) => (target, key, value) => {
            if (target[key] === value && typeof value !== object) {
                return true;
            }

            // console.log(`Setting ${key}`, value);

            if (value && typeof value == 'object' && !(value instanceof Node)) {
                if (value.___isBindable___ !== Bindable) {
                    value = Bindable.makeBindable(value);

                    for (let i in value) {
                        if (value[i] && typeof value[i] == 'object') {
                            value[i] = Bindable.makeBindable(value[i]);
                        }
                    }
                }
            }

            for (let i in object.___bindingAll___) {
                object.___bindingAll___[i](value, key, target, false);
            }

            let stop = false;

            if (key in object.___binding___) {
                for (let i in object.___binding___[key]) {
                    if (object.___binding___[key][i](value, key, target, false) === false) {
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

            const warnOn = 10;

            if (target.___setCount___[key] > warnOn && value instanceof Object) {
                console.log(
                    'Warning: Resetting bindable reference "' +
                    key +
                    '" to object ' +
                    target.___setCount___[key] +
                    ' times.'
                );
            }

            return true;
        })(object);

        let del = ((object) => (target, key) => {
            // console.log(key, 'DEL');

            if (!(key in target)) {
                return true;
            }

            for (let i in object.___bindingAll___) {
                object.___bindingAll___[i](undefined, key, target, true);
            }

            if (key in object.___binding___) {
                for (let i in object.___binding___[key]) {
                    object.___binding___[key][i](undefined, key, target, true);
                }
            }

            if (Array.isArray(target)) {
                target.splice(key, 1);
            } else {
                delete target[key];
            }

            return true;
        })(object);

        let get = ((object) => (target, key) => {
            if (typeof target[key] == 'function') {

            	if(target.___wrapped___[key])
            	{
            		return target.___wrapped___[key];
            	}

                target.___wrapped___[key] = function() {
                    target.___executing___ = key;

                    target.___stack___.unshift(key);
                    target.___stackTime___.unshift((new Date).getTime());

                    // console.log(`Start ${key}()`);

                    for (let i in target.___before___) {
                        target.___before___[i](target, key, object);
                    }

                    let ret = target[key].apply(target, arguments);

                    for (let i in target.___after___) {
                        target.___after___[i](target, key, object);
                    }

                    target.___executing___ = null;

                    let execTime = (new Date).getTime() - target.___stackTime___[0];

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
        })(object);

        object.___ref___ = new Proxy(object, {
            deleteProperty: del,
            get: get,
            set: set
        });

        return object.___ref___;
    }
    static clearBindings(object) {
        object.___wrapped___    = {};
        object.___bindingAll___ = {};
        object.___binding___    = {};
        object.___before___     = {};
        object.___after___      = {};
        object.___ref___        = {};
        object.toString         = ()=>'{}';
    }
}