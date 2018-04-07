'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HiddenField = undefined;

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HiddenField = exports.HiddenField = function (_Field) {
	_inherits(HiddenField, _Field);

	function HiddenField(values, form, parent, key) {
		_classCallCheck(this, HiddenField);

		var _this = _possibleConstructorReturn(this, (HiddenField.__proto__ || Object.getPrototypeOf(HiddenField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label>\n\t\t\t\t<input\n\t\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\t\ttype    = "' + _this.args.attrs.type + '"\n\t\t\t\t\t\tcv-bind = "value"\n\t\t\t\t/>\n\t\t\t\t<span style = "display:none" cv-if = "value">[[[value]]]</span>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return HiddenField;
}(_Field2.Field);