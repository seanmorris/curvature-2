'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Wrapper = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _View2 = require('../../base/View');

var _Repository = require('../../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wrapper = exports.Wrapper = function (_View) {
	_inherits(Wrapper, _View);

	function Wrapper(args) {
		_classCallCheck(this, Wrapper);

		var _this = _possibleConstructorReturn(this, (Wrapper.__proto__ || Object.getPrototypeOf(Wrapper)).call(this, args));

		_this.template = '\n\t\t\t<div\n\t\t\t\tclass = "wrapped-field [[classes]]"\n\t\t\t\tcv-on = "click:editRecord(event, key)"\n\t\t\t\ttitle = "[[fieldName]]: [[id]]"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\tcv-on = "click:deleteImage(event, key)"\n\t\t\t\t\tstyle = "display: inline; cursor:pointer;"\n\t\t\t\t>\n\t\t\t\t\t[[icon]]\n\t\t\t\t</div>\n\t\t\t\t<div class = "field-content">\n\t\t\t\t\t[[title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style = "display:none">[[field]]</div>\n\t\t';

		_this.args.field = _this.args.field || '!';
		_this.args.keyword = '';
		_this.args.title = '';
		_this.args.record = {};
		_this.args.key = _this.args.field.key;
		_this.args.classes = '';
		_this.args.icon = '×';
		_this.deleted = false;

		_this.args.field.args.bindTo('fieldName', function (v) {
			_this.args.fieldName = v;
		});

		_this.args.fieldName = _this.args.field.args.name;

		_this.args.id = _this.args.field.args.value.id;

		_this.args.bindTo('id', function (v) {
			_this.args.field.args.value.id = v;
		});

		_this.args.field.args.value.bindTo('id', function (v) {
			if (!v) {
				return;
			}

			_Repository.Repository.request(_this.backendPath(), { id: v }).then(function (response) {
				_this.args.id = v;

				var record = response.body[0];

				if (!record) {
					_this.args.publicId = null;
					_this.args.title = null;

					return;
				}

				_this.refresh(record);
			});
		}, { wait: 0 });

		_this.args.field.args.value.bindTo('keyword', function (v) {
			_this.args.keyword = v;
		});
		return _this;
	}

	_createClass(Wrapper, [{
		key: 'editRecord',
		value: function editRecord() {
			this.args.parent.editRecord(this.args.record, this);
		}
	}, {
		key: 'deleteImage',
		value: function deleteImage(event, index) {
			event.stopPropagation();

			if (!this.deleted) {
				this.args.icon = '↺';
				this.args.parent.deleteImage(index);
				this.deleted = true;
			} else {
				this.args.icon = '×';
				this.args.parent.undeleteImage(index);
				this.deleted = false;
			}
		}
	}, {
		key: 'backendPath',
		value: function backendPath() {
			return _Config.Config.backend + this.args.parent.args.attrs['data-endpoint'];
		}
	}, {
		key: 'getRecordTitle',
		value: function getRecordTitle(record) {
			if (record._titleField) {
				return record[record._titleField];
			}

			return record.title || record.publicId || record.id;
		}
	}, {
		key: 'refresh',
		value: function refresh(model) {
			for (var i in model) {
				this.args[i] = model[i];
			}

			this.args.record = model;

			this.args.title = this.getRecordTitle(model);
		}
	}]);

	return Wrapper;
}(_View2.View);