'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Persist = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View = require('./View');

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Persist = exports.Persist = function () {
	function Persist() {
		_classCallCheck(this, Persist);
	}

	_createClass(Persist, null, [{
		key: 'watch',
		value: function watch(bucket, object) {
			var subBinding = {};
			var key = 'Persist::[' + bucket + ']';

			var _source = localStorage.getItem(key);
			var source = void 0;

			object = _Bindable.Bindable.makeBindable(object);

			var debind = object.bindTo(function (v, k, t, d, p) {
				if (subBinding[k]) {
					subBinding[k]();
				}

				if ((typeof v === 'undefined' ? 'undefined' : _typeof(v)) === 'object') {
					subBinding[k] = Persist.watch(bucket + '::' + k, v);
				}

				localStorage.setItem(key, JSON.stringify(object));
			}, { delay: 0 });

			if (source = JSON.parse(_source)) {
				for (var i in source) {
					object[i] = source[i];
				}
			}

			return function () {
				debind();
				for (var _i in subBinding) {
					subBinding[_i]();
				}
				localStorage.removeItem(key);
			};
		}
	}]);

	return Persist;
}();