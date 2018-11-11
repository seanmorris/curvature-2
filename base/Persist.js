'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Persist = undefined;

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Persist = exports.Persist = function Persist(bucket, object) {
	_classCallCheck(this, Persist);

	_Bindable.Bindable.makeBindable(this);

	var index = {};
	var bindings = {};
	var indexKey = bucket + '::#[index]';
	var _index = void 0;

	var store = function store(key, value) {
		index[key] = 1;

		if (bindings[key]) {
			bindings[key]();
			delete bindings[key];
		}

		if (value instanceof Object) {
			var bindable = _Bindable.Bindable.makeBindable(value);

			bindings[key] = bindable.bindTo(function (v, k, t, d) {
				t[k] = v;
				localStorage.setItem(bucket + '::$[' + key + ']', JSON.stringify({ key: key, value: value }));
			});
		}

		console.log(key, value, JSON.stringify({ key: key, value: value }));

		localStorage.setItem(bucket + '::$[' + key + ']', JSON.stringify({ key: key, value: value }));

		localStorage.setItem(indexKey, JSON.stringify(index));
	};

	object.bindTo(function (v, k, t, d) {
		t[k] = v;
		store(k, v);
	});

	if (_index = localStorage.getItem(indexKey)) {
		index = JSON.parse(_index);

		for (var i in index) {
			var source = localStorage.getItem(bucket + '::$[' + i + ']');

			console.log(source);

			var _JSON$parse = JSON.parse(source),
			    key = _JSON$parse.key,
			    value = _JSON$parse.value;

			console.log(i);

			object[key] = value;
		}
	}
};