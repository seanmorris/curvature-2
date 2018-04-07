'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HtmlField = undefined;

var _View2 = require('base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HtmlField = exports.HtmlField = function (_View) {
	_inherits(HtmlField, _View);

	function HtmlField(values, form, parent, key) {
		_classCallCheck(this, HtmlField);

		var _this = _possibleConstructorReturn(this, (HtmlField.__proto__ || Object.getPrototypeOf(HtmlField)).call(this, values, form, parent, key));

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;
		_this.args.contentEditable = _this.args.attrs.contenteditable || false;
		_this.template = '<div contenteditable = "[[contentEditable]]">[[$value]]</div>';
		return _this;
	}

	return HtmlField;
}(_View2.View);