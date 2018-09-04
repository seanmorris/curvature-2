'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HtmlField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

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
		_this.template = '<div\n\t\t\tname            = "' + _this.args.name + '"\n\t\t\tcv-ref          = "input:curvature/base/Tag"\n\t\t\tcontenteditable = "[[contentEditable]]"\n\t\t>[[$value]]</div>';
		return _this;
	}

	_createClass(HtmlField, [{
		key: 'hasChildren',
		value: function hasChildren() {
			return false;
		}
	}, {
		key: 'disable',
		value: function disable() {
			this.args.disabled = 'disabled';
		}
	}, {
		key: 'getName',
		value: function getName() {
			if (this.tags.input) {
				return this.tags.input.element.getAttribute('name');
			}

			return this.args.name;
		}
	}]);

	return HtmlField;
}(_View2.View);