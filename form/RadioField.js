'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RadioField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RadioField = exports.RadioField = function (_Field) {
	_inherits(RadioField, _Field);

	function RadioField(values, form, parent, key) {
		_classCallCheck(this, RadioField);

		var _this = _possibleConstructorReturn(this, (RadioField.__proto__ || Object.getPrototypeOf(RadioField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span\n\t\t\t\t\tcv-each  = "options:option:optionText"\n\t\t\t\t\tcv-carry = "value"\n\t\t\t\t\t--cv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname      = "' + _this.args.name + '"\n\t\t\t\t\t\t\ttype      = "radio"\n\t\t\t\t\t\t\tvalue     = "[[option]]"\n\t\t\t\t\t\t\tcv-bind   = "value"\n\t\t\t\t\t\t\tcv-expand = "attrs"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(RadioField, [{
		key: 'getLabel',
		value: function getLabel() {
			for (var i in this.args.options) {
				if (this.args.options[i] == this.args.value) {
					return i;
				}
			}
		}
	}]);

	return RadioField;
}(_Field2.Field);