'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Form = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _BaseForm2 = require('../Ui/BaseForm');

var _HiddenField = require('curvature/form/HiddenField');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Form = exports.Form = function (_BaseForm) {
	_inherits(Form, _BaseForm);

	function Form(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, Form);

		var _this = _possibleConstructorReturn(this, (Form.__proto__ || Object.getPrototypeOf(Form)).call(this, args, path, 'POST', customFields));

		_this.creating = !!args.publicId;
		return _this;
	}

	_createClass(Form, [{
		key: 'onLoad',
		value: function onLoad(form) {
			for (var i in form.args.fields) {
				if (!form.args.fields[i].tags.input) {
					continue;
				}

				if (form.args.fields[i].args.attrs.type == 'hidden') {
					continue;
				}

				var element = form.args.fields[i].tags.input.element;

				element.focus();

				break;
			}

			_get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'onLoad', this).call(this, form);
		}
	}, {
		key: 'onRequest',
		value: function onRequest() {
			this.args.view.args.loading = true;
			this.args.view.args.classes += ' loading';

			return _get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'onRequest', this).call(this);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(response) {
			this.args.view.args.loading = false;
			this.args.view.args.classes = '';

			if (!this.args.wrapper) {
				this.args.view.addRecord(response.body);
			} else {
				this.args.wrapper.refresh(response.body);
			}

			this.args.view.addButtonClicked();

			_get(Form.prototype.__proto__ || Object.getPrototypeOf(Form.prototype), 'onResponse', this).call(this, response);
		}
	}]);

	return Form;
}(_BaseForm2.BaseForm);