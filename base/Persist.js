'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Persist = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Persist = exports.Persist = function () {
	function Persist() {
		_classCallCheck(this, Persist);
	}

	_createClass(Persist, null, [{
		key: 'watch',
		value: function watch(bucket, object) {
			var refresh = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

			var index = {};
			var bindings = {};
			var indexKey = bucket + '::#[index]';
			var _index = void 0;

			// if(refresh)
			// {
			// 	let index = JSON.parse(localStorage.getItem(indexKey));
			// 	for(let i in index)
			// 	{
			// 		localStorage.removeItem(`${bucket}::$[${index[i]}]`);
			// 	}
			// 	console.log(index);
			// }

			var store = function store(key, value) {
				var del = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

				index[key] = 1;

				if (bindings[key]) {
					bindings[key]();
					delete bindings[key];
				}

				if (del) {
					localStorage.removeItem(bucket + '::$[' + key + ']');
					delete index[key];
				} else {
					if (value instanceof Object) {
						var bindable = _Bindable.Bindable.makeBindable(value);

						bindings[key] = bindable.bindTo(function (v, k, t, d) {
							t[k] = v;
							localStorage.setItem(bucket + '::$[' + key + ']', JSON.stringify({ key: key, value: value }));
						});
					}

					localStorage.setItem(bucket + '::$[' + key + ']', JSON.stringify({ key: key, value: value }));
				}

				localStorage.setItem(indexKey, JSON.stringify(index));
			};

			if (_index = localStorage.getItem(indexKey)) {
				index = JSON.parse(_index);

				var values = {};

				for (var i in index) {
					var source = localStorage.getItem(bucket + '::$[' + i + ']');

					if (!source) {
						continue;
					}

					var _JSON$parse = JSON.parse(source),
					    _key = _JSON$parse.key,
					    value = _JSON$parse.value;

					values[_key] = value;
				}

				if (Array.isArray(object)) {
					while (object.pop()) {}
				}

				for (var _i in values) {
					if (Array.isArray(object)) {
						if (_i !== object.length) {
							localStorage.removeItem(bucket + '::$[' + _i + ']');
						}
						object.push(values[_i]);
						continue;
					}
					object[key] = values[_i];
				}
			}

			var debind = object.bindTo(function (v, k, t, d) {
				store(k, v, d);
			}, { wait: 0 });

			return function () {
				debind();
				for (var _i2 in bindings) {
					bindings[_i2]();
				}
			};
		}
	}]);

	return Persist;
}();