'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.SearchForm = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Config = require('Config');

var _FormWrapper2 = require('./FormWrapper');

var _HiddenField = require('../../form/HiddenField');

var _Repository = require('../../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SearchForm = exports.SearchForm = function (_FormWrapper) {
	_inherits(SearchForm, _FormWrapper);

	function SearchForm(args, path) {
		var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
		var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

		_classCallCheck(this, SearchForm);

		var _this = _possibleConstructorReturn(this, (SearchForm.__proto__ || Object.getPrototypeOf(SearchForm)).call(this, args, path, 'POST', { search: _HiddenField.HiddenField }));

		_this.superTemplate = _this.template;

		_this.args.records = [];
		_this.selected = null;

		_this.template = '\n\t\t\t' + _this.superTemplate + '\n\t\t\t<div cv-each = "records:record:r" class = "dropdown-results">\n\t\t\t\t<div\n\t\t\t\t\tcv-on         = "click:select(event)"\n\t\t\t\t\tdata-index    = "[[r]]"\n\t\t\t\t\tdata-publicId = "[[record.publicId]]"\n\t\t\t\t\tclass         = "[[record.classes]]"\n\t\t\t\t>\n\t\t\t\t\t[[record.title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t';
		return _this;
	}

	_createClass(SearchForm, [{
		key: 'onLoad',
		value: function onLoad(form) {
			var _this2 = this;

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

			form.args.flatValue.bindTo('keyword', function (v) {
				_this2.args.records = [];
				_this2.selected = null;

				if (!v) {
					return;
				}

				console.log(_this2.path, v);

				_Repository.Repository.request(_Config.Config.backend + _this2.path, { keyword: v }).then(function (response) {
					console.log(response.body);
					if (!response.body) {
						return;
					}

					_this2.args.records = response.body.map(function (r) {
						r.classes = '';
						if (r.title == v) {
							r.classes = 'selected';
							_this2.selected = r;
						}
						return r;
					});
				});
			});

			_get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onLoad', this).call(this, form);
		}
	}, {
		key: 'onRequest',
		value: function onRequest() {
			// this.args.view.args.loading = true;
			// this.args.view.args.classes += ' loading';

			return _get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onRequest', this).call(this);
		}
	}, {
		key: 'onResponse',
		value: function onResponse(response) {
			// this.args.view.args.loading = false;
			// this.args.view.args.classes = '';

			// if(!this.args.wrapper)
			// {
			// 	this.args.view.addRecord(response.body);
			// }
			// else
			// {
			// 	this.args.wrapper.refresh(response.body);
			// }

			// this.args.view.addButtonClicked();

			_get(SearchForm.prototype.__proto__ || Object.getPrototypeOf(SearchForm.prototype), 'onResponse', this).call(this, response);
		}
	}, {
		key: 'select',
		value: function select(event) {
			var _this3 = this;

			var index = event.target.getAttribute('data-index');
			var publicId = event.target.getAttribute('data-publicId');

			var record = this.args.records[index];

			console.log(record);

			this.args.view.addRecord(record);
			this.args.view.addButtonClicked();

			return;

			_Repository.Repository.request(_Config.Config.backend + this.path + '/' + publicId).then(function (response) {
				console.log(response.body);
				if (!response.body) {
					return;
				}

				_this3.args.view.addRecord(response.body);
				_this3.args.view.addButtonClicked();
			});
		}
	}, {
		key: 'onSubmit',
		value: function onSubmit(form, event) {
			event.preventDefault();
			event.stopPropagation();
			if (this.selected) {
				this.args.view.addRecord(this.selected);
				this.args.view.addButtonClicked();
			}
			return false;
		}
	}]);

	return SearchForm;
}(_FormWrapper2.FormWrapper);