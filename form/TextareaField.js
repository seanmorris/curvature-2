'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TextareaField = undefined;

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TextareaField = exports.TextareaField = function (_Field) {
	_inherits(TextareaField, _Field);

	function TextareaField(values, form, parent, key) {
		_classCallCheck(this, TextareaField);

		var _this = _possibleConstructorReturn(this, (TextareaField.__proto__ || Object.getPrototypeOf(TextareaField)).call(this, values, form, parent, key));

		_this.args.attrs.type = _this.args.attrs.type || 'hidden';
		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<textarea\n\t\t\t\t\t\tname      = "' + _this.args.name + '"\n\t\t\t\t\t\tcv-bind   = "value"\n\t\t\t\t\t\tcv-ref    = "input:curvature/base/Tag"\n\t\t\t\t\t\tcv-expand = "attrs"\n\t\t\t\t></textarea>\n\t\t\t\t<cv-template cv-if = "attrs.data-caption">\n\t\t\t\t\t<p>[[attrs.data-caption]]</p>\n\t\t\t\t</cv-template>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	return TextareaField;
}(_Field2.Field);