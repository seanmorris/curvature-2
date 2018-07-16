'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Field = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('curvature/base/Bindable');

var _View2 = require('../base/View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Field = exports.Field = function (_View) {
	_inherits(Field, _View);

	function Field(values, form, parent, key) {
		_classCallCheck(this, Field);

		var skeleton = Object.assign(values);

		var _this = _possibleConstructorReturn(this, (Field.__proto__ || Object.getPrototypeOf(Field)).call(this, values));

		_this.args.title = _this.args.title || '';
		_this.args.value = _this.args.value || '';
		_this.skeleton = skeleton;

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

			if (_this.args.attrs.type == 'file') {
				if (_this.tags.input && _this.tags.input.element.files) {
					console.log(_this.tags.input.element.files[0]);

					_this.parent.args.value[key] = _this.tags.input.element.files[0];
				}
			} else {
				_this.parent.args.value[key] = v;
			}
			setting = null;
		});

		console.log(_this.parent.args.value);

		_this.parent.args.value = _Bindable.Bindable.makeBindable(_this.parent.args.value);

		_this.parent.args.value.bindTo(key, function (v, k) {
			if (setting == k) {
				return;
			}

			setting = k;

			if (_this.args.attrs.type == 'file') {
				if (_this.tags.input && _this.tags.input.element.files) {
					_this.args.value = _this.tags.input.element.files[0];
				}
			} else {
				_this.args.value = v;
			}

			setting = null;
		});

		var extra = '';

		if (_this.args.attrs.type == 'checkbox') {
			extra = 'value = "1"';
		}

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor       = "' + _this.args.name + '"\n\t\t\t\tdata-type = "' + _this.args.attrs.type + '"\n\t\t\t\tcv-ref    = "label:curvature/base/Tag"\n\t\t\t>\n\t\t\t\t<span cv-if = "title" cv-ref = "title:curvature/base/Tag">[[title]]:</span>\n\t\t\t\t<input\n\t\t\t\t\tname    = "' + _this.args.name + '"\n\t\t\t\t\ttype    = "' + (_this.args.attrs.type || 'text') + '"\n\t\t\t\t\tcv-bind = "value"\n\t\t\t\t\tcv-ref  = "input:curvature/base/Tag"\n\t\t\t\t\t' + extra + '\n\t\t\t\t/>\n\t\t\t</label>\n\t\t';
		//type    = "${this.args.attrs.type||'text'}"
		return _this;
	}

	_createClass(Field, [{
		key: 'hasChildren',
		value: function hasChildren() {
			return false;
		}
	}]);

	return Field;
}(_View2.View);