'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _View2 = require('../base/View');

var _Field = require('./Field');

var _FieldSet = require('./FieldSet');

var _SelectField = require('./SelectField');

var _HtmlField = require('./HtmlField');

var _HiddenField = require('./HiddenField');

var _ButtonField = require('./ButtonField');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Router           } from 'Router';

// import { Repository       } from '../Repository';

// import { FieldSet         } from './FieldSet';

// import { ToastView        } from '../ToastView';
// import { ToastAlertView   } from '../ToastAlertView';

var Form = exports.Form = function (_View) {
	_inherits(Form, _View);

	function Form(skeleton) {
		var customFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

		_classCallCheck(this, Form);

		var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, {}));

		_this.args.flatValue = _this.args.flatValue || {};
		_this.args.value = _this.args.value || {};

		_this.args.method = skeleton._method || 'GET';

		_this.args.classes = _this.args.classes || [];

		_this.args.bindTo('classes', function (v) {
			_this.args._classes = v.join(' ');
		});

		_this._onSubmit = [];
		_this.action = '';
		_this.template = '\n\t\t\t<form\n\t\t\t\tclass   = "[[_classes]]"\n\t\t\t\tmethod  = "[[method]]"\n\t\t\t\tenctype = "multipart/form-data"\n\t\t\t\tcv-on   = "submit:submit(event)"\n\t\t\t\tcv-ref  = "formTag:curvature/base/Tag"\n\t\t\t\tcv-each = "fields:field"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t';

		_this.args.fields = Form.renderFields(skeleton, _this, customFields);

		_this.args.bindTo('value', function (v) {
			_this.args.valueString = JSON.stringify(v, null, 4);
		});
		return _this;
	}

	_createClass(Form, [{
		key: 'submitHandler',
		value: function submitHandler(event) {
			event.preventDefault();
			event.stopPropagation();
		}
	}, {
		key: 'submit',
		value: function submit(event) {
			this.args.valueString = JSON.stringify(this.args.value, null, 4);

			for (var i in this._onSubmit) {
				this._onSubmit[i](this, event);
			}
		}
	}, {
		key: 'buttonClick',
		value: function buttonClick(event) {
			console.log(event);
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(callback) {
			this._onSubmit.push(callback);
		}
	}, {
		key: 'formData',
		value: function formData() {
			var append = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var field = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var chain = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

			if (!append) {
				append = new FormData();
			}

			if (!field) {
				field = this;
			}

			var parts = [];

			for (var i in field.args.fields) {
				var subchain = chain.slice(0);

				subchain.push(i);

				if (field.args.fields[i].hasChildren()) {
					this.formData(append, field.args.fields[i], subchain);
				} else {
					console.log(i);

					var fullname = subchain[0];

					if (subchain.length > 1) {
						fullname += '[' + subchain.slice(1).join('][') + ']';
					}

					console.log('>>>', field.args.fields[i].args.type);
					console.log('>>>', fullname);
					console.log('>>>', field.args.fields[i].args.value);

					if (field.args.fields[i].args.type == 'file') {
						append.append(fullname, field.args.fields[i].tags.input.element.files[0]);
					} else {
						append.append(fullname, field.args.fields[i].args.value);
					}
					console.log('---');
				}
			}

			return append;
		}
	}, {
		key: 'queryString',
		value: function queryString() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var parts = [];

			for (var i in this.args.flatValue) {
				args[i] = args[i] || this.args.flatValue[i];
			}

			for (var _i in args) {
				parts.push(_i + '=' + encodeURIComponent(args[_i]));
			}

			return parts.join('&');
		}
	}, {
		key: 'populate',
		value: function populate(values) {
			// console.log(values);

			for (var i in values) {
				this.args.value[i] = values[i];
			}
		}
	}, {
		key: 'hasChildren',
		value: function hasChildren() {
			return !!Object.keys(this.args.fields).length;
		}
	}], [{
		key: 'renderFields',
		value: function renderFields(skeleton) {
			var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var fields = {};

			var _loop = function _loop(i) {
				if (fields[i]) {
					return 'continue';
				}

				if (i.substr(0, 1) == '_') {
					return 'continue';
				}

				var field = null;
				var form = null;
				if (parent instanceof Form) {
					form = parent;
				} else {
					form = parent.form;
				}

				if (skeleton[i].name in customFields) {
					field = new customFields[skeleton[i].name](skeleton[i], form, parent, i);
				} else {
					switch (skeleton[i].type) {
						case 'fieldset':
							field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
							break;
						case 'select':
							field = new _SelectField.SelectField(skeleton[i], form, parent, i);
							break;
						case 'html':
							field = new _HtmlField.HtmlField(skeleton[i], form, parent, i);
							break;
						case 'submit':
						case 'button':
							field = new _ButtonField.ButtonField(skeleton[i], form, parent, i);
							break;
						case 'hidden':
							field = new _HiddenField.HiddenField(skeleton[i], form, parent, i);
							break;
						default:
							field = new _Field.Field(skeleton[i], form, parent, i);
							break;
					}
				}

				fields[i] = field;

				field.args.bindTo('value', function (v, k, t, d) {
					// console.log(t,v);
					if (t.type == 'html' && !t.contentEditable || t.type == 'fieldset') {
						return;
					}
					form.args.flatValue[field.args.name] = v;
				});
			};

			for (var i in skeleton) {
				var _ret = _loop(i);

				if (_ret === 'continue') continue;
			}
			return fields;
		}
	}]);

	return Form;
}(_View2.View);