'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Keyboard = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('../base/Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Keyboard = exports.Keyboard = function () {
	function Keyboard() {
		var _this = this;

		_classCallCheck(this, Keyboard);

		this.maxDecay = 60;

		this.listening = true;

		this.keys = _Bindable.Bindable.makeBindable({});
		this.codes = _Bindable.Bindable.makeBindable({});

		document.addEventListener('keyup', function (event) {
			_this.keys[event.key] = -1;
			_this.codes[event.code] = -1;
		});

		document.addEventListener('keydown', function (event) {
			if (_this.keys[event.key] > 0) {
				return;
			}
			_this.keys[event.key] = 1;
			_this.codes[event.code] = 1;
		});
	}

	_createClass(Keyboard, [{
		key: 'getKey',
		value: function getKey(key) {
			if (!this.keys[key]) {
				return 0;
			}

			return this.keys[key];
		}
	}, {
		key: 'getKeyCode',
		value: function getKeyCode(code) {
			if (!this.codes[code]) {
				return 0;
			}

			return this.codes[code];
		}
	}, {
		key: 'update',
		value: function update() {
			for (var i in this.keys) {
				if (this.keys[i] > 0) {
					this.keys[i]++;
				} else {
					this.keys[i]--;

					if (this.keys[i] < -this.maxDecay) {
						delete this.keys[i];
					}
				}
			}
			for (var i in this.codes) {
				if (this.codes[i] > 0) {
					this.codes[i]++;
				} else {
					this.codes[i]--;

					if (this.codes[i] < -this.maxDecay) {
						delete this.keys[i];
					}
				}
			}
		}
	}]);

	return Keyboard;
}();