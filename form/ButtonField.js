'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ButtonField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ButtonField = exports.ButtonField = function (_Field) {
	_inherits(ButtonField, _Field);

	function ButtonField(values, form, parent, key) {
		_classCallCheck(this, ButtonField);

		var _this = _possibleConstructorReturn(this, (ButtonField.__proto__ || Object.getPrototypeOf(ButtonField)).call(this, values, form, parent, key));

		_this.args.title = _this.args.title || _this.args.value;
		_this.template = '\n\t\t\t<label cv-ref = "label:curvature/base/Tag">\n\t\t\t\t<input\n\t\t\t\t\tname  = "' + _this.args.name + '"\n\t\t\t\t\ttype  = "' + _this.args.attrs.type + '"\n\t\t\t\t\tvalue = "[[title]]"\n\t\t\t\t\ton    = "click:clicked(event)"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(ButtonField, [{
		key: 'clicked',
		value: function clicked(event) {
			this.form.buttonClick(this.args.name);
		}
	}]);

	return ButtonField;
}(_Field2.Field);