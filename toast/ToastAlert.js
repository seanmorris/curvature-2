'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ToastAlert = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ToastAlert = exports.ToastAlert = function (_View) {
	_inherits(ToastAlert, _View);

	function ToastAlert(args) {
		_classCallCheck(this, ToastAlert);

		var _this = _possibleConstructorReturn(this, (ToastAlert.__proto__ || Object.getPrototypeOf(ToastAlert)).call(this, args));

		_this.args.time = _this.args.time || 10000;
		_this.init = _this.args.time;
		_this.args.opacity = 1;
		_this.args.title = _this.args.title || 'Standard alert';
		_this.args.body = _this.args.body || 'This is a standard alert.';
		_this.template = '\n\t\t\t<div id = "[[_id]]" style = "opacity:[[opacity]]" class = "alert">\n\t\t\t\t<h3>[[title]]</h3>\n\t\t\t\t<p>[[body]]</p>\n\t\t\t</div>\n\t\t';
		return _this;
	}

	_createClass(ToastAlert, [{
		key: 'decay',
		value: function decay(complete) {
			var _this2 = this;

			var decayInterval = 16;
			var decay = setInterval(function () {
				if (_this2.args.time > 0) {
					_this2.args.time -= decayInterval;
					_this2.args.opacity = _this2.args.time / _this2.init;

					if (_this2.args.time <= 0) {
						if (complete) {
							complete();
						}
						clearInterval(decay);
					}
				}
			}, decayInterval);
		}
	}]);

	return ToastAlert;
}(_View2.View);