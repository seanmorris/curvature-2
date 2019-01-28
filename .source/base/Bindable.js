export class Bindable {
    static isBindable(object) {
        if (!object.___binding___) {
            return false;
        }

        return object.___binding___ === Bindable;
    }
    static makeBindable(object) {

        if (!object
            || object.___binding___
            || typeof object !== 'object'
            || object instanceof Node
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
        object.___wrapped___    = {};
        object.___binding___    = {};
        object.___bindingAll___ = [];
        object.___stack___      = [];
        object.___stackTime___  = [];
        object.___before___     = [];
        object.___after___      = [];
        object.___setCount___ = {};
        object.bindTo = (property, callback = null, options = {}) => {
            let bindToAll = false;

            if (property instanceof Function) {
                options   = callback || {};
                callback  = property;
                bindToAll = true;
            }

            let throttle = false;

            if (options.delay >= 0) {
                callback = ((callback) => (v,k,t,d) => {
                    let p = t[k];
                    setTimeout(()=>callback(v,k,t,d,p), options.delay);
                })(callback);
            }

            if (options.throttle >= 0) {
                callback = ((callback) => (v,k,t,d) => {
                    if (throttle) {
                        return;
                    }
                    let p = t[k];
                    callback(v,k,t,d,p);
                    throttle = true;
                    setTimeout(()=>throttle = false, options.throttle);
                })(callback);
            }

            let waiter;

            if (options.wait >= 0) {
                callback = ((callback) => (v,k,t,d) => {
                    if (waiter) {
                        clearTimeout(waiter);
                    }
                    let p = t[k];
                    waiter = setTimeout(()=>callback(v,k,t,d,p), options.wait);
                })(callback);
            }

            if(bindToAll) {
                let bindIndex = object.___bindingAll___.length;

                object.___bindingAll___.push(callback);

                for (let i in object) {
                    callback(object[i], i, object, false);
                }

                return () => {
                    object.___bindingAll___[bindIndex] = null;
                };
            }

            if (!object.___binding___[property]) {
                object.___binding___[property] = [];
            }

            let bindIndex = object.___binding___[property].length;

            object.___binding___[property].push(callback);

            callback(object[property], property, object, false);

            return () => {
                if (!object.___binding___[property]) {
                    return;
                }
                object.___binding___[property][bindIndex] = null;
            };
        };

        object.isBound = () => {
            for (let i in object.___bindingAll___) {
                if (object.___bindingAll___[i]) {
                    return true;
                }
            }

            for (let i in object.___binding___) {
                for (let j in object.___binding___[i]) {
                    if (object.___binding___[i][j]) {
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

        for (let i in object) {
            if (object[i] &&
                typeof object[i] == 'object' &&
                !object[i] instanceof Node
            ) {
                object[i] = Bindable.makeBindable(object[i]);
            }
        }

        let set = (target, key, value) => {
            if(typeof key === 'string'
                && key.substring(0,3) === '___'
                && key.slice(-3) === '___'
            ){
                return true;
            }

            if (target[key] === value) {
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
                if(!object.___bindingAll___[i]) {
                    continue;
                }
                object.___bindingAll___[i](value, key, target, false);
            }

            let stop = false;

            if (key in object.___binding___) {
                for (let i in object.___binding___[key]) {
                    if(!object.___binding___[key]) {
                        continue;
                    }
                    if(!object.___binding___[key][i]) {
                        continue;
                    }
                    if (object.___binding___[key][i](value, key, target, false, target[key]) === false) {
                        stop = true;
                    }
                }
            }

            if (!stop) {
                let descriptor = Object.getOwnPropertyDescriptor(
                    target
                    , key
                );

                let excluded = (
                    target instanceof File
                    && key == 'lastModifiedDate'
                );
                
                if(!excluded
                    && (!descriptor || descriptor.writable)
                ){
                    target[key] = value;
                }
            }

            if (!target.___setCount___[key]) {
                target.___setCount___[key] = 0;
            }

            target.___setCount___[key]++;

            const warnOn = 10;

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

        let del = (target, key) => {
            if (!(key in target)) {
                return true;
            }

            for (let i in object.___bindingAll___) {
                object.___bindingAll___[i](undefined, key, target, true, target[key]);
            }

            if (key in object.___binding___) {
                for (let i in object.___binding___[key]) {
                    if(!object.___binding___[key][i]) {
                        continue;
                    }
                    object.___binding___[key][i](undefined, key, target, true, target[key]);
                }
            }

            if (Array.isArray(target)) {
                target.splice(key, 1);
            } else {
                delete target[key];
            }

            return true;
        };

        let get = (target, key) => {
            if (target[key] instanceof Function) {

            	if(target.___wrapped___[key])
            	{
            		return target.___wrapped___[key];
            	}

                target.___wrapped___[key] = function() {
                    target.___executing___ = key;

                    target.___stack___.unshift(key);
                    // target.___stackTime___.unshift((new Date).getTime());

                    // console.log(`Start ${key}()`);

                   for (let i in target.___before___) {
                        target.___before___[i](target, key, object);
                    }

                    let ret = target[key].apply(object.___ref___, arguments);

                    for (let i in target.___after___) {
                        target.___after___[i](target, key, object);
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
    static clearBindings(object) {
        object.___wrapped___    = {};
        object.___bindingAll___ = [];
        object.___binding___    = {};
        object.___before___     = [];
        object.___after___      = [];
        object.___ref___        = {};
        // object.toString         = ()=>'{}';
    }
    static resolve(object, path, owner = false)
    {
        // console.log(path, object);

        let node;
        let pathParts = path.split('.');
        let top       = pathParts[0];

        while(pathParts.length)
        {
            if(owner && pathParts.length === 1)
            {
                let obj = this.makeBindable(object);

                return [obj, pathParts.shift(), top];
            }

            node = pathParts.shift();

            if(!node in object
                || !object[node]
                || !(object[node] instanceof Object)
            ){
                object[node] = {};
            }

            object = this.makeBindable(object[node]);
        }

        return [this.makeBindable(object), node, top];
    }
}