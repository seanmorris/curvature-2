'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Toast = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _ToastAlert = require('./ToastAlert');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Toast = exports.Toast = function (_View) {
	_inherits(Toast, _View);

	_createClass(Toast, null, [{
		key: 'instance',
		value: function instance() {
			if (!this.inst) {
				this.inst = new this();
			}
			return this.inst;
		}
	}]);

	function Toast() {
		_classCallCheck(this, Toast);

		var _this = _possibleConstructorReturn(this, (Toast.__proto__ || Object.getPrototypeOf(Toast)).call(this));

		_this.template = '\n\t\t\t<div id = "[[_id]]" cv-each = "alerts:alert" class = "toast">\n\t\t\t\t[[alert]]\n\t\t\t</div>\n\t\t';
		// this.style = {
		// 	'': {
		// 		position:   'fixed'
		// 		, top:      '0px'
		// 		, right:    '0px'
		// 		, padding:  '8px'
		// 		, 'z-index':'999999'
		// 		, display:  'flex'
		// 		, 'flex-direction': 'column-reverse'
		// 	}
		// };

		_this.args.alerts = [];

		_this.args.alerts.bindTo(function (v) {
			console.log(v);
		});
		return _this;
	}

	_createClass(Toast, [{
		key: 'pop',
		value: function pop(alert) {
			var _this2 = this;

			var index = this.args.alerts.length;

			this.args.alerts.push(alert);

			alert.decay(function (alert) {
				return function () {
					for (var i in _this2.args.alerts) {
						if (_this2.args.alerts) {
							_this2.args.alerts[i] === alert;

							_this2.args.alerts.splice(i, 1);
							return;
						}
					}
				};
			}(alert));
		}
	}]);

	return Toast;
}(_View2.View);