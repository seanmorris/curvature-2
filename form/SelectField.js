'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SelectField = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Field2 = require('./Field');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SelectField = exports.SelectField = function (_Field) {
	_inherits(SelectField, _Field);

	function SelectField(values, form, parent, key) {
		_classCallCheck(this, SelectField);

		var _this = _possibleConstructorReturn(this, (SelectField.__proto__ || Object.getPrototypeOf(SelectField)).call(this, values, form, parent, key));

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag">\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-each = "options:option:optionText"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t/>\n\t\t\t\t\t<option value = "[[option]]">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t</label>\n\t\t';

		console.log(values);

		_this.args.bindTo('value', function (v, k, t, d, p) {
			console.log(_this.args.name, v, p);
		});
		return _this;
	}

	_createClass(SelectField, [{
		key: 'postRender',
		value: function postRender(parentNode) {
			var _this2 = this;

			this.onTimeout(0, function () {
				var tag = _this2.tags.input.element;

				for (var i in tag.options) {
					var option = tag.options[i];

					console.log(option);

					if (option.value == _this2.args.value) {
						tag.selectedIndex = i;
					}
				}
			});
		}
	}, {
		key: 'getLabel',
		value: function getLabel() {
			for (var i in this.args.options) {
				if (this.args.options[i] == this.args.value) {
					return i;
				}
			}
		}
	}]);

	return SelectField;
}(_Field2.Field);