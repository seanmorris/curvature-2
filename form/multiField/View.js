'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.View = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Form = require('../../form/Form');

var _FieldSet2 = require('../../form/FieldSet');

var _CreateForm = require('./CreateForm');

var _SearchForm = require('./SearchForm');

var _FormWrapper = require('./FormWrapper');

var _Wrapper = require('./Wrapper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// import { Loader     } from '../Ui/ZZ';

var View = exports.View = function (_FieldSet) {
	_inherits(View, _FieldSet);

	function View(values, form, parent, key) {
		_classCallCheck(this, View);

		var _this = _possibleConstructorReturn(this, (View.__proto__ || Object.getPrototypeOf(View)).call(this, values, form, parent, key));

		_this.args._fields = [];

		_this.dragging = false;
		_this.dropping = false;

		for (var i in _this.args.fields) {
			_this.args._fields[i] = _this.wrapSubfield(_this.args.fields[i]);
		}

		_this.args.fields[-1].disable();

		_this.args.creating = '';
		_this.args.fieldType = '';

		// this.args.loader = new Loader;
		// this.args.loader = 'LOADING!!!';

		_this.args.createForm = _this.args.createForm || '';
		_this.args.searchForm = _this.args.searchForm || '';

		_this.setCreateForm({ view: _this });

		_this.args.loader = '...';
		_this.args.addIcon = '&#215;';
		_this.args.addIcon = 'a';
		_this.args.addIcon = '+';

		_this.template = '\n\t\t\t<label\n\t\t\t\tfor        = "' + _this.args.name + '"\n\t\t\t\tdata-type  = "' + _this.args.attrs.type + '"\n\t\t\t\tdata-multi = "' + (_this.args.attrs['data-multi'] ? 'true' : 'false') + '"\n\t\t\t>\n\t\t\t\t<span cv-if = "title">\n\t\t\t\t\t<span cv-ref = "title:curvature/base/Tag">[[title]]</span>\n\t\t\t\t</span>\n\n\t\t\t\t<fieldset\n\t\t\t\t\tname  = "' + _this.args.name + '"\n\t\t\t\t\tclass = "multi-field [[creating]] [[fieldType]]"\n\t\t\t\t>\n\n\t\t\t\t\t<div class = "record-list" cv-each = "_fields:field:f">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass     = "single-record"\n\t\t\t\t\t\t\tdata-for  = "[[f]]"\n\t\t\t\t\t\t\tdraggable = "true"\n\t\t\t\t\t\t\tcv-on     = "\n\t\t\t\t\t\t\t\tdrop:drop(event);\n\t\t\t\t\t\t\t\tdragstart:drag(event);\n\t\t\t\t\t\t\t\tdragend:dragStop(event);\n\t\t\t\t\t\t\t\tdragover:dragOver(event);\n\t\t\t\t\t\t\t"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t[[field]]\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = "overlay create">\n\t\t\t\t\t\t<div class = "form constrict">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tcv-on = "click:addButtonClicked(event)"\n\t\t\t\t\t\t\t\tclass = "bubble bottom left-margin close"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t&#215;\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t[[createForm]]\n\t\t\t\t\t\t[[searchForm]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = "overlay loading">\n\t\t\t\t\t\t[[loader]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div cv-if = "createFormReady">\n\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tcv-on = "click:addButtonClicked(event)"\n\t\t\t\t\t\t\tclass = "bubble bottom left-margin add"\n\t\t\t\t\t\t>[[addIcon]]</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</fieldset>\n\n\t\t\t</label>\n\t\t';
		return _this;
	}

	_createClass(View, [{
		key: 'setCreateForm',
		value: function setCreateForm(args) {
			var _this2 = this;

			this.args.createForm = new _CreateForm.CreateForm(Object.assign({}, args), args.publicId ? this.args.attrs['data-endpoint'] + '/' + args.publicId + '/edit' : this.args.attrs['data-endpoint'] + '/create');

			this.args.createForm._onLoad.push(function (wrap, form) {
				_this2.args.createFormReady = true;
			});

			this.args.searchForm = new _SearchForm.SearchForm(Object.assign({}, args), this.args.attrs['data-endpoint']);
		}
	}, {
		key: 'wrapSubfield',
		value: function wrapSubfield(field) {
			return new _Wrapper.Wrapper({ field: field, parent: this });
		}
	}, {
		key: 'addButtonClicked',
		value: function addButtonClicked() {
			if (!this.args.creating) {
				this.args.creating = 'creating';
			}
		}
	}, {
		key: 'addRecord',
		value: function addRecord(record) {
			if (!Array.isArray(record)) {
				record = [record];
			}

			for (var i in record) {
				var fieldClass = this.args.fields[-1].constructor;

				var skeleton = Object.assign({}, this.args.fields[-1].skeleton);
				var name = Object.values(this.args.fields).length - 1;

				skeleton = this.cloneSkeleton(skeleton);

				skeleton = this.correctNames(skeleton, name);

				var superSkeleton = {};

				superSkeleton[name + 1] = skeleton;

				var newField = _Form.Form.renderFields(superSkeleton, this)[name + 1];

				this.args.fields[name] = newField;

				var newWrap = this.wrapSubfield(newField);

				newField.args.value.id = record[i].id || '';
				newField.args.value.class = record[i].class || '';
				newField.args.value.title = record[i].title || '';

				this.args._fields.push(newWrap);

				newWrap.refresh(record[i]);
			}
		}
	}, {
		key: 'editRecord',
		value: function editRecord(record, wrapper) {
			this.setCreateForm({
				view: this,
				publicId: record.publicId,
				wrapper: wrapper
			});

			this.args.creating = this.args.creating ? '' : 'creating';
		}
	}, {
		key: 'deleteImage',
		value: function deleteImage(index) {
			this.args.fields[index].disable();
			this.args._fields[index].args.classes = 'deleted';
		}
	}, {
		key: 'undeleteImage',
		value: function undeleteImage(index) {
			this.args.fields[index].enable();
			// console.log(this.args.fields[index]);
			// console.log(this.args._fields[index]);
			// console.log('===============');

			this.args._fields[index].args.classes = '';
		}
	}, {
		key: 'cloneSkeleton',
		value: function cloneSkeleton(object) {
			var level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

			var _object = {};

			if (Array.isArray(object)) {
				_object = [];
			}

			for (var i in object) {
				if (i == 'fields') {
					continue;
				}

				if (!object[i] || _typeof(object[i]) !== 'object') {
					_object[i] = object[i];

					continue;
				}

				_object[i] = Object.assign({}, this.cloneSkeleton(object[i], level + 1));
			}

			return _object;
		}
	}, {
		key: 'correctNames',
		value: function correctNames(skeleton, id) {
			skeleton.name = skeleton.name.replace(/\[-1\]/, '[' + id + ']');

			skeleton.attrs.name = skeleton.name;

			if ('children' in skeleton) {
				for (var i in skeleton.children) {
					skeleton.children[i] = this.correctNames(skeleton.children[i], id);
				}
			}

			return skeleton;
		}
	}, {
		key: 'drag',
		value: function drag(event) {
			this.dragging = event.target;
		}
	}, {
		key: 'dragOver',
		value: function dragOver(event) {
			if (!this.dragging) {
				return false;
			}

			var dropping = event.target;

			while (dropping && !dropping.matches('[draggable="true"]')) {
				dropping = dropping.parentNode;
			}

			if (dropping) {
				this.dropping = dropping;
				event.preventDefault();
			}
		}
	}, {
		key: 'drop',
		value: function drop(event) {
			event.stopPropagation();

			var dragLabel = this.dragging.querySelector('label');
			var dropLabel = this.dropping.querySelector('label');

			var dragName = dragLabel.getAttribute('for');
			var dropName = dropLabel.getAttribute('for');

			var dragIndex = this.extractIndex(dragName);
			var dropIndex = this.extractIndex(dropName);

			if (dragIndex == dropIndex || dragIndex == dropIndex - 1) {
				this.dragging = false;
				this.dropping = false;
				return;
			}

			var dragFields = dragLabel.querySelectorAll('[name^="' + dragName + '"]');
			var dragLabels = dragLabel.querySelectorAll('[for^="' + dragName + '"]');

			var dropFields = dropLabel.querySelectorAll('[name^="' + dropName + '"]');
			var dropLabels = dropLabel.querySelectorAll('[for^="' + dropName + '"]');

			var dropBefore = this.dropping;

			var offset = 0;

			var dragField = void 0,
			    dropField = void 0;

			for (var i in this.args.fields) {
				var currentFieldSet = this.args.fields[i].tags.input.element;
				var currentLabel = this.args.fields[i].tags.label.element;
				var currentName = currentFieldSet.getAttribute('name');

				if (dragLabel == currentLabel) {
					dragField = this.args.fields[i];
				}

				if (dropLabel == currentLabel) {
					dropField = this.args.fields[i];
				}

				var currentIndex = this.extractIndex(currentName);
				var newName = false;

				if (currentIndex < 0) {
					continue;
				}

				if (dragIndex > dropIndex && currentIndex >= dropIndex && currentIndex <= dragIndex) {
					newName = this.changeIndex(currentName, currentIndex + 1);
					offset = -1;
				} else if (dragIndex < dropIndex && currentIndex <= dropIndex && currentIndex >= dragIndex) {
					newName = this.changeIndex(currentName, currentIndex - 1);
					offset = 0;
				}

				if (newName !== false) {
					this.changeAttributePrefix(currentLabel, 'for', currentName, newName);

					this.args.fields[i].args.fieldName = newName;

					this.changeAttributePrefix(currentFieldSet, 'name', currentName, newName);

					var currentFields = currentFieldSet.parentNode.querySelectorAll('[name^="' + currentName + '"]');

					for (var _i = 0; _i < currentFields.length; _i++) {
						this.changeAttributePrefix(currentFields[_i], 'name', currentName, newName);
					}

					var currentLabels = currentFieldSet.parentNode.querySelectorAll('[for^="' + currentName + '"]');

					for (var _i2 = 0; _i2 < currentLabels.length; _i2++) {
						this.changeAttributePrefix(currentLabels[_i2], 'for', currentName, newName);
					}
				}
			}

			dragName = dragLabel.getAttribute('for');
			dropName = dropLabel.getAttribute('for');

			dragIndex = this.extractIndex(dragName);
			dropIndex = this.extractIndex(dropName);

			this.changeAttributePrefix(dragLabel, 'for', dragName, this.changeIndex(dragName, dropIndex + offset));

			for (var _i3 = 0; _i3 < dragFields.length; _i3++) {
				this.changeAttributePrefix(dragFields[_i3], 'name', dragName, this.changeIndex(dragName, dropIndex + offset));
			}

			for (var _i4 = 0; _i4 < dragLabels.length; _i4++) {
				this.changeAttributePrefix(dragLabels[_i4], 'for', dragName, this.changeIndex(dragName, dropIndex + offset));
			}

			dragField.args.fieldName = dragLabel.getAttribute('for');

			this.changeAttributePrefix(dropLabel, 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));

			for (var _i5 = 0; _i5 < dropFields.length; _i5++) {
				this.changeAttributePrefix(dropFields[_i5], 'name', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
			}

			for (var _i6 = 0; _i6 < dropLabels.length; _i6++) {
				this.changeAttributePrefix(dropLabels[_i6], 'for', dropName, this.changeIndex(dropName, dropIndex + offset + 1));
			}

			dropField.args.fieldName = dropLabel.getAttribute('for');

			this.dragging.parentNode.insertBefore(this.dragging, dropBefore);

			this.dragging = false;
			this.dropping = false;
		}
	}, {
		key: 'dragStop',
		value: function dragStop() {
			this.dragging = false;
			this.dropping = false;
		}
	}, {
		key: 'changeAttributePrefix',
		value: function changeAttributePrefix(node, attribute, oldPrefix, newPrefix) {
			var oldName = node.getAttribute(attribute);

			var newName = newPrefix + node.getAttribute(attribute).substring(oldPrefix.length);

			node.setAttribute(attribute, newName);
		}
	}, {
		key: 'extractIndex',
		value: function extractIndex(name) {
			var groups = void 0;

			if (groups = /\[(-?\d+)\]$/.exec(name)) {
				return parseInt(groups[1]);
			}

			return false;
		}
	}, {
		key: 'changeIndex',
		value: function changeIndex(name, index) {
			var newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');

			return newName;
		}
	}, {
		key: 'cancel',
		value: function cancel(event) {
			event.stopPropagation();
		}
	}]);

	return View;
}(_FieldSet2.FieldSet);