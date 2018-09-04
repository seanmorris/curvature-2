'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.FieldSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

var _Form = require('./Form');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FieldSet = exports.FieldSet = function (_Field) {
	_inherits(FieldSet, _Field);

	function FieldSet(values, form, parent, key) {
		_classCallCheck(this, FieldSet);

		var _this = _possibleConstructorReturn(this, (FieldSet.__proto__ || Object.getPrototypeOf(FieldSet)).call(this, values, form, parent, key));

		_this.args.value = {};
		_this.args.fields = _Form.Form.renderFields(values.children, _this);
		_this.template = '\n\t\t\t<label\n\t\t\t\tfor        = "' + _this.args.name + '"\n\t\t\t\tdata-type  = "' + _this.args.attrs.type + '"\n\t\t\t\tdata-multi = "' + (_this.args.attrs['data-multi'] ? 'true' : 'false') + '"\n\t\t\t\tcv-ref     = "label:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = "' + _this.args.name + '"\n\t\t\t\t\tcv-ref = "input:curvature/base/Tag"\n\t\t\t\t\tcv-expand="attrs"\n\t\t\t\t>\n\t\t\t\t\t<div cv-each = "fields:field">\n\t\t\t\t\t\t<div cv-bind = "field"></div>\n\t\t\t\t\t</div>\n\t\t\t\t</fieldset>\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(FieldSet, [{
		key: 'hasChildren',
		value: function hasChildren() {
			return !!Object.keys(this.args.fields).length;
		}
	}, {
		key: 'wrapSubfield',
		value: function wrapSubfield(field) {
			return field;
		}
	}]);

	return FieldSet;
}(_Field2.Field);