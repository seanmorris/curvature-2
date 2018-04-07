'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Field = undefined;

var _View2 = require('base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_View) {
	_inherits(Field, _View);

	function Field(values, form, parent, key) {
		_classCallCheck(this, Field);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, values));

		_this.args.title = _this.args.title || '';
		_this.args.value = _this.args.value || '';

		_this.args.valueString = '';

		_this.form = form;
		_this.parent = parent;
		_this.key = key;

		_this.ignore = _this.args.attrs['data-cv-ignore'] || false;

		var setting = null;

		_this.args.bindTo('value', function (v, k) {
			// console.trace();
			// console.log(this.args.name, v, k);

			if (setting == key) {
				return;
			}

			// console.log(this.args.name, v, k);

			_this.args.valueString = JSON.stringify(v || '', null, 4);

			setting = key;

			_this.parent.args.value[key] = v;
			setting = null;
		});

		_this.parent.args.value.bindTo(key, function (v, k) {
			if (setting == k) {
				return;
			}

			setting = k;

			_this.args.value = v;

			setting = null;
		});

		_this.template = '\n\t\t\t<label cv-ref = "label:base/Tag">\n\t\t\t\t<span cv-if = "title" cv-ref = "title:base/Tag">[[title]]:</span>\n\t\t\t\t<input\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\ttype    = "' + (_this.args.attrs.type || 'text') + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-ref  = "input:base/Tag"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		//type    = "${this.args.attrs.type||'text'}"
		return _this;
	}

	return Field;
}(_View2.View);