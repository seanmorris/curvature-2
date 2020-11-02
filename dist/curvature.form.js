"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ButtonField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var ButtonField = function (_Field) {
  _inherits(ButtonField, _Field);

  var _super = _createSuper(ButtonField);

  function ButtonField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, ButtonField);

    _this = _super.call(this, values, form, parent, key);
    _this.args.title = _this.args.title || _this.args.value;
    _this._onClick = [];
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || _this.args.type;
    _this.args.name = attrs.name = _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type, "\"\n\t\t\t\t\tvalue     = \"[[value]]\"\n\t\t\t\t\tcv-on     = \"click:clicked(event)\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(ButtonField, [{
    key: "clicked",
    value: function clicked(event) {
      var cancels = this._onClick.map(function (callback) {
        return callback(event) === false;
      }).filter(function (r) {
        return r;
      });

      if (cancels.length) {
        if (this.args.attrs.type == 'submit') {
          event.preventDefault();
          event.stopPropagation();
        }

        return;
      }

      if (this.args.attrs.type == 'submit') {
        event.preventDefault();
        event.stopPropagation();
        this.form.tags.formTag.element.dispatchEvent(new Event('submit', {
          'cancelable': true,
          'bubbles': true
        }));
      }
    }
  }, {
    key: "onClick",
    value: function onClick(callback) {
      this._onClick.push(callback);
    }
  }]);

  return ButtonField;
}(_Field2.Field);

exports.ButtonField = ButtonField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Field = void 0;

var _View2 = require("../base/View");

var _Bindable = require("../base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Field = function (_View) {
  _inherits(Field, _View);

  var _super = _createSuper(Field);

  function Field(values, form, parent, key) {
    var _this$args$title, _this$args$value, _this$args$value2;

    var _this;

    _classCallCheck(this, Field);

    var skeleton = Object.assign({}, values);
    _this = _super.call(this, skeleton);
    _this.args.title = (_this$args$title = _this.args.title) !== null && _this$args$title !== void 0 ? _this$args$title : key;
    _this.args.value = (_this$args$value = _this.args.value) !== null && _this$args$value !== void 0 ? _this$args$value : '';
    _this.value = (_this$args$value2 = _this.args.value) !== null && _this$args$value2 !== void 0 ? _this$args$value2 : '';
    _this.skeleton = skeleton;
    _this.disabled = null;
    _this.args.valueString = '';
    _this.form = form;
    _this.parent = parent;
    _this.key = key;
    _this.ignore = _this.args.attrs ? _this.args.attrs['data-cv-ignore'] || false : false;
    var extra = '';
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || skeleton.type || null;
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;

    if (attrs.type == 'checkbox') {
      extra = 'value = "1"';
    }

    _this.template = "\n\t\t\t<label\n\t\t\t\tfor           = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type     = \"").concat(attrs.type || 'text', "\"\n\t\t\t\tcv-ref        = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<input\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype      = \"").concat(attrs.type || 'text', "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t").concat(extra, "\n\t\t\t\t/>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    var setting = null;

    _this.args.bindTo('value', function (v, k) {
      if (!isNaN(v) && v.length && v == Number(v) && v.length === String(Number(v)).length) {
        v = Number(v);
      }

      _this.value = v;

      if (setting == k) {
        return;
      }

      setting = key;
      _this.args.valueString = JSON.stringify(v || '', null, 4);
      _this.valueString = _this.args.valueString;

      if (attrs.type == 'file' && _this.tags.input && _this.tags.input.element.files && _this.tags.input.element.length) {
        if (!attrs.multiple) {
          _this.parent.args.value[key] = _this.tags.input.element.files[0];
        } else {
          var files = Array.from(_this.tags.input.element.files);

          if (!_this.parent.args.value[k] || !files.length) {
            _this.parent.args.value[key] = files;
          } else {
            for (var i in files) {
              if (files[i] !== _this.parent.args.value[key][i]) {
                _this.parent.args.value[key] = files;
              }
            }

            _this.parent.args.value.splice(files.length);
          }
        }
      } else {
        if (!_this.parent.args.value) {
          _this.parent.args.value = {};
        }

        _this.parent.args.value[key] = v;
      }

      _this.args.errors = [];
      setting = null;
    });

    _this.parent.args.value[_this.key] = _this.args.value;

    _this.parent.args.value.bindTo(key, function (v, k) {
      if (setting == k) {
        return;
      }

      setting = k;

      if (attrs.type == 'file') {
        if (_this.tags.input && _this.tags.input.element.files && _this.tags.input.element.files.length) {
          if (!attrs.multiple) {
            _this.parent.args.value[key] = _this.tags.input.element.files[0];
          } else {
            var files = Array.from(_this.tags.input.element.files);

            if (!_this.parent.args.value[key] || !files.length) {
              _this.parent.args.value[key] = files;
            } else {
              for (var i in files) {
                if (files[i] !== _this.parent.args.value[key][i]) {
                  _this.parent.args.value[key] = files;
                }
              }

              _this.parent.args.value[key].splice(files.length);
            }
          }
        } else {
          _this.args.value = v;
        }
      } else {
        _this.args.value = v;
      }

      setting = null;
    });

    return _this;
  }

  _createClass(Field, [{
    key: "disable",
    value: function disable() {
      if (this.hasChildren()) {}

      this.disabled = 'disabled';
    }
  }, {
    key: "enable",
    value: function enable() {
      if (this.hasChildren()) {}

      this.disabled = false;
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "getName",
    value: function getName() {
      var cascadeIfPossible = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.tags.input) {
        return this.tags.input.element.getAttribute('name');
      }

      var name = this.key;

      if (cascadeIfPossible) {
        var parent = this.parent;
        var names = [name];

        while (parent && parent.array && typeof parent.key !== 'undefined') {
          names.unshift(parent.key);
          parent = parent.parent;
        }

        name = names.shift();

        if (names.length) {
          name += "[".concat(names.join(']['), "]");
        }
      }

      return name;
    }
  }]);

  return Field;
}(_View2.View);

exports.Field = Field;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FieldSet = void 0;

var _Field2 = require("./Field");

var _Form = require("./Form");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FieldSet = function (_Field) {
  _inherits(FieldSet, _Field);

  var _super = _createSuper(FieldSet);

  function FieldSet(values, form, parent, key) {
    var _this;

    _classCallCheck(this, FieldSet);

    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'fieldset';
    _this.array = false;

    if (values.array || attrs['data-array'] || attrs['data-multi']) {
      _this.array = attrs['data-array'] = true;
    }

    _this.args.value = {};
    _this.args.fields = _Form.Form.renderFields(values.children, _assertThisInitialized(_this));
    _this.fields = _this.args.fields;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type  = \"").concat(attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t\tcv-ref     = \"label:curvature/base/Tag\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<fieldset\n\t\t\t\t\tname   = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-ref = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand=\"attrs\"\n\t\t\t\t\tcv-each = \"fields:field\"\n\t\t\t\t>\n\t\t\t\t\t[[field]]\n\t\t\t\t</fieldset>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(FieldSet, [{
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return field;
    }
  }]);

  return FieldSet;
}(_Field2.Field);

exports.FieldSet = FieldSet;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FileField = function (_Field) {
  _inherits(FileField, _Field);

  var _super = _createSuper(FileField);

  function FileField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, FileField);

    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || _this.args.type || 'file';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t>\n\t\t\t\t<input\n\t\t\t\t\tname    = \"").concat(_this.getName(), "\"\n\t\t\t\t\ttype    = \"").concat(attrs.type, "\"\n\t\t\t\t\tcv-bind = \"value\"\n\t\t\t\t\tcv-ref  = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t<span style = \"display:none\" cv-if = \"value\">[[[value]]]</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  return FileField;
}(_Field2.Field);

exports.FileField = FileField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _View2 = require("../base/View");

var _Field = require("./Field");

var _FieldSet = require("./FieldSet");

var _SelectField = require("./SelectField");

var _RadioField = require("./RadioField");

var _HtmlField = require("./HtmlField");

var _HiddenField = require("./HiddenField");

var _ButtonField = require("./ButtonField");

var _TextareaField = require("./TextareaField");

var _View3 = require("./multiField/View");

var _Bindable = require("../base/Bindable");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Form = function (_View) {
  _inherits(Form, _View);

  var _super = _createSuper(Form);

  function Form(skeleton) {
    var _this2;

    var customFields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Form);

    _this2 = _super.call(this, {});
    _this2.args.flatValue = _this2.args.flatValue || {};
    _this2.args.value = _this2.args.value || {};
    _this2.args.method = skeleton._method || 'GET';
    _this2.args.classes = _this2.args.classes || [];
    _this2.skeleton = skeleton;

    _this2.args.bindTo('classes', function (v) {
      _this2.args._classes = v.join(' ');
    });

    _this2._onSubmit = [];
    _this2._onRender = [];
    _this2.action = '';
    _this2.template = "\n\t\t\t<form\n\t\t\t\tclass     = \"[[_classes]]\"\n\t\t\t\tmethod    = \"[[method]]\"\n\t\t\t\tenctype   = \"multipart/form-data\"\n\t\t\t\tcv-on     = \"submit:submit(event)\"\n\t\t\t\tcv-ref    = \"formTag:curvature/base/Tag\"\n\t\t\t\tcv-each   = \"fields:field\"\n\t\t\t\tcv-expand = \"attrs\"\n\t\t\t>\n\t\t\t\t[[field]]\n\t\t\t</form>\n\t\t";
    _this2.args.fields = Form.renderFields(skeleton, _assertThisInitialized(_this2), customFields);
    _this2.fields = _this2.args.fields;

    var _this = _Bindable.Bindable.makeBindable(_assertThisInitialized(_this2));

    _this2.args.bindTo('value', function (v) {
      _this.value = v;
    });

    _this2.args.bindTo('valueString', function (v) {
      _this.json = v;
    });

    return _possibleConstructorReturn(_this2, _this);
  }

  _createClass(Form, [{
    key: "submitHandler",
    value: function submitHandler(event) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, {
    key: "submit",
    value: function submit(event) {
      this.args.valueString = JSON.stringify(this.args.value, null, 4);

      for (var i in this._onSubmit) {
        this._onSubmit[i](this, event);
      }
    }
  }, {
    key: "buttonClick",
    value: function buttonClick(event) {}
  }, {
    key: "onSubmit",
    value: function onSubmit(callback) {
      this._onSubmit.push(callback);
    }
  }, {
    key: "onRender",
    value: function onRender(callback) {
      if (this.nodes) {
        callback(this);
        return;
      }

      this._onRender.push(callback);
    }
  }, {
    key: "formData",
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
        if (field.args.fields[i] && field.args.fields[i].disabled) {
          continue;
        }

        var subchain = chain.slice(0);
        subchain.push(i);

        if (field.args.fields[i] && field.args.fields[i].hasChildren()) {
          this.formData(append, field.args.fields[i], subchain);
        } else if (field.args.fields[i]) {
          var fieldName = field.args.fields[i].getName();

          if (field.args.fields[i].args.type == 'file' && field.args.fields[i].tags.input.element.files && field.args.fields[i].tags.input.element.files.length) {
            if (field.args.fields[i].args.attrs.multiple) {
              var files = field.args.fields[i].tags.input.element.files;

              for (var _i = 0; _i < files.length; _i++) {
                if (!files[_i]) {
                  continue;
                }

                append.append(fieldName + '[]', files[_i]);
              }
            } else if (field.args.fields[i].tags.input.element.files[0]) {
              append.append(fieldName, field.args.fields[i].tags.input.element.files[0]);
            }
          } else if (field.args.fields[i].args.type !== 'file' || field.args.fields[i].args.value) {
            append.append(fieldName, field.args.fields[i].args.value === undefined ? '' : field.args.fields[i].args.value);
          }
        }
      }

      return append;
    }
  }, {
    key: "queryString",
    value: function queryString() {
      var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var parts = [];

      for (var i in this.args.flatValue) {
        args[i] = args[i] || this.args.flatValue[i];
      }

      for (var _i2 in args) {
        parts.push(_i2 + '=' + encodeURIComponent(args[_i2]));
      }

      return parts.join('&');
    }
  }, {
    key: "populate",
    value: function populate(values) {
      for (var i in values) {
        this.args.value[i] = values[i];
      }
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return !!Object.keys(this.args.fields).length;
    }
  }, {
    key: "postRender",
    value: function postRender() {
      for (var i in this._onRender) {
        this._onRender[i](this);
      }
    }
  }], [{
    key: "renderFields",
    value: function renderFields(skeleton) {
      var parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var fields = {};

      var _loop = function _loop(i) {
        if (fields[i]) {
          return "continue";
        }

        if (i.substr(0, 1) == '_') {
          return "continue";
        }

        var field = null;
        var form = null;

        if (parent) {
          if (parent instanceof Form) {
            form = parent;
          } else {
            form = parent.form;
          }
        }

        if (customFields && skeleton[i].name in customFields) {
          field = new customFields[skeleton[i].name](skeleton[i], form, parent, i);
        } else {
          switch (skeleton[i].type) {
            case 'fieldset':
              if (skeleton[i].attrs && skeleton[i].attrs['data-multi']) {
                field = new _View3.View(skeleton[i], form, parent, i);
              } else {
                field = new _FieldSet.FieldSet(skeleton[i], form, parent, i);
              }

              break;

            case 'select':
              field = new _SelectField.SelectField(skeleton[i], form, parent, i);
              break;

            case 'radios':
              field = new _RadioField.RadioField(skeleton[i], form, parent, i);
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

            case 'textarea':
              field = new _TextareaField.TextareaField(skeleton[i], form, parent, i);
              break;

            default:
              field = new _Field.Field(skeleton[i], form, parent, i);
              break;
          }
        }

        fields[i] = field;
        var fieldName = field.key;
        field.args.bindTo('value', function (v, k, t, d) {
          if (!isNaN(v) && v.length && v == Number(v) && v.length === String(Number(v)).length) {
            v = Number(v);
          }

          if (t.type == 'html' && !t.contentEditable || t.type == 'fieldset') {
            return;
          }

          if (t.disabled) {
            delete form.args.flatValue[fieldName];
            return;
          }

          t.attrs = t.attrs || {};
          var multiple = t.attrs.multiple;
          var newArray = Array.isArray(v);
          var oldArray = parent.args.value[fieldName];
          var exists = t.attrs.multiple && newArray && Array.isArray(oldArray);

          if (exists) {
            for (var _i3 in v) {
              if (v[_i3] !== parent.args.value[fieldName][_i3]) {
                parent.args.value[fieldName][_i3] = v[_i3];
              }

              parent.args.value[fieldName].splice(v.length);
            }
          } else {
            parent.args.value[fieldName] = v;
          }

          form.args.flatValue[fieldName] = v;
          form.args.valueString = JSON.stringify(form.args.value, null, 4);
          console.log();
        });
      };

      for (var i in skeleton) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }

      return fields;
    }
  }, {
    key: "_updateFields",
    value: function _updateFields(parent, skeleton) {
      for (var i in parent.args.fields) {
        var field = parent.args.fields[i];

        if (skeleton[i]) {
          if (skeleton[i].value) {
            field.args.value = skeleton[i].value;
          }

          if (skeleton[i].errors) {
            field.args.errors = skeleton[i].errors;
          }

          if (skeleton[i].title) {
            field.args.title = skeleton[i].title;
          }

          if (skeleton[i].options) {
            field.args.options = skeleton[i].options;
          }

          if (skeleton[i].attrs) {
            field.args.attrs = skeleton[i].attrs;
          }

          if (field.children && skeleton[i].children) {
            this._updateFields(field, skeleton[i].children);
          }
        }
      }
    }
  }]);

  return Form;
}(_View2.View);

exports.Form = Form;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HiddenField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HiddenField = function (_Field) {
  _inherits(HiddenField, _Field);

  var _super = _createSuper(HiddenField);

  function HiddenField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, HiddenField);

    values.type = 'hidden';
    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.args.type = attrs.type = attrs.type || _this.args.type || 'hidden';
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tstyle     = \"display:none\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<input\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\ttype      = \"hidden\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t<span cv-if = \"value\">[[[value]]]</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  return HiddenField;
}(_Field2.Field);

exports.HiddenField = HiddenField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HtmlField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var HtmlField = function (_Field) {
  _inherits(HtmlField, _Field);

  var _super = _createSuper(HtmlField);

  function HtmlField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, HtmlField);

    _this = _super.call(this, values, form, parent, key);
    _this.key = key;
    _this.args.tagName = _this.args.tagName || 'div';
    _this.args.displayValue = _this.args.value;
    _this.args.attrs = _this.args.attrs || {};
    _this.ignore = _this.args.attrs['data-cv-ignore'] || false;
    _this.args.contentEditable = _this.args.attrs.contenteditable || false;

    _this.args.bindTo('value', function (v) {
      if (!_this.tags.input) {
        return;
      }

      if (_this.tags.input.element === document.activeElement) {
        return;
      }

      _this.args.displayValue = v;
    });

    _this.template = "<".concat(_this.args.tagName, "\n\t\t\tname            = \"").concat(_this.getName(), "\"\n\t\t\tcv-ref          = \"input:curvature/base/Tag\"\n\t\t\tcontenteditable = \"[[contentEditable]]\"\n\t\t\tcv-expand       = \"attrs\"\n\t\t\tcv-bind         = \"$displayValue\"\n\t\t\tcv-on           = \"input:inputProvided(event);\"\n\t\t></").concat(_this.args.tagName, ">");
    return _this;
  }

  _createClass(HtmlField, [{
    key: "inputProvided",
    value: function inputProvided(event) {
      this.args.value = event.target.innerHTML;
    }
  }, {
    key: "hasChildren",
    value: function hasChildren() {
      return false;
    }
  }, {
    key: "getName",
    value: function getName() {
      return this.key;
    }
  }]);

  return HtmlField;
}(_Field2.Field);

exports.HtmlField = HtmlField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadioField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var RadioField = function (_Field) {
  _inherits(RadioField, _Field);

  var _super = _createSuper(RadioField);

  function RadioField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, RadioField);

    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.args.name = attrs.name = attrs.name || _this.args.name || key;
    _this.args.value = _this.args.value || '';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each  = \"options:option:optionText\"/>\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tname      = \"").concat(_this.args.name, "\"\n\t\t\t\t\t\t\ttype      = \"radio\"\n\t\t\t\t\t\t\tvalue     = \"[[option]]\"\n\t\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t\t\t\tcv-on     = \"change:changed(event)\"\n\t\t\t\t\t/>\n\t\t\t\t\t\t[[optionText]]\n\t\t\t\t\t</label>\n\t\t\t\t</span>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(RadioField, [{
    key: "getLabel",
    value: function getLabel() {
      for (var i in this.args.options) {
        if (this.args.options[i] == this.args.value) {
          return i;
        }
      }
    }
  }, {
    key: "changed",
    value: function changed(event) {
      this.args.value = event.target.value;
    }
  }]);

  return RadioField;
}(_Field2.Field);

exports.RadioField = RadioField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var SelectField = function (_Field) {
  _inherits(SelectField, _Field);

  var _super = _createSuper(SelectField);

  function SelectField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, SelectField);

    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type || 'select', "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<select\n\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\tcv-each   = \"options:option:optionText\"\n\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t/>\n\t\t\t\t\t<option value = \"[[option]]\">[[optionText]]</option>\n\t\t\t\t</select>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(SelectField, [{
    key: "postRender",
    value: function postRender() {
      var _this2 = this;

      this.args.bindTo('value', function (v) {
        return _this2.selectOptionByValue(v);
      });
      this.args.options.bindTo(function (v) {
        return _this2.selectOptionByValue(_this2.args.value);
      }, {
        frame: 1
      });
    }
  }, {
    key: "selectOptionByValue",
    value: function selectOptionByValue(value) {
      var tag = this.tags.input.element;

      var _iterator = _createForOfIteratorHelper(tag.options),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;

          if (option.value == value) {
            tag.selectedIndex = option.index;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "getLabel",
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

exports.SelectField = SelectField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TextareaField = void 0;

var _Field2 = require("./Field");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var TextareaField = function (_Field) {
  _inherits(TextareaField, _Field);

  var _super = _createSuper(TextareaField);

  function TextareaField(values, form, parent, key) {
    var _this;

    _classCallCheck(this, TextareaField);

    _this = _super.call(this, values, form, parent, key);
    var attrs = _this.args.attrs || {};
    attrs.type = attrs.type || 'textarea';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor       = \"".concat(_this.getName(), "\"\n\t\t\t\tdata-type = \"").concat(attrs.type, "\"\n\t\t\t\tcv-ref    = \"label:curvature/base/Tag\">\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\t\t\t\t<textarea\n\t\t\t\t\t\tname      = \"").concat(_this.getName(), "\"\n\t\t\t\t\t\tcv-bind   = \"value\"\n\t\t\t\t\t\tcv-ref    = \"input:curvature/base/Tag\"\n\t\t\t\t\t\tcv-expand = \"attrs\"\n\t\t\t\t></textarea>\n\t\t\t\t<cv-template cv-if = \"attrs.data-caption\">\n\t\t\t\t\t<p>[[attrs.data-caption]]</p>\n\t\t\t\t</cv-template>\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\t\t\t</label>\n\t\t");
    return _this;
  }

  return TextareaField;
}(_Field2.Field);

exports.TextareaField = TextareaField;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreateForm = void 0;

var _FormWrapper2 = require("./FormWrapper");

var _HiddenField = require("../../form/HiddenField");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var CreateForm = function (_FormWrapper) {
  _inherits(CreateForm, _FormWrapper);

  var _super = _createSuper(CreateForm);

  function CreateForm(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, CreateForm);

    _this = _super.call(this, args, path, 'POST', customFields || {});
    _this.creating = !!args.publicId;
    return _this;
  }

  _createClass(CreateForm, [{
    key: "onLoad",
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

      _get(_getPrototypeOf(CreateForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      this.args.view.args.loading = true;
      this.args.view.args.classes += ' loading';
      return _get(_getPrototypeOf(CreateForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      this.args.view.args.loading = false;
      this.args.view.args.classes = '';

      if (!response.body) {
        _get(_getPrototypeOf(CreateForm.prototype), "onResponse", this).call(this, response);

        return;
      }

      if (!this.args.wrapper) {
        this.args.view.addRecord(response.body);
      } else {
        this.args.wrapper.refresh(response.body);
      }

      this.args.view.args.creating = '';

      _get(_getPrototypeOf(CreateForm.prototype), "onResponse", this).call(this, response);
    }
  }]);

  return CreateForm;
}(_FormWrapper2.FormWrapper);

exports.CreateForm = CreateForm;
"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FormWrapper = void 0;

var _Repository = require("../../base/Repository");

var _Form = require("../../form/Form");

var _Toast = require("../../toast/Toast");

var _ToastAlert = require("../../toast/ToastAlert");

var _View2 = require("../../base/View");

var _Router = require("../../base/Router");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var FormWrapper = function (_View) {
  _inherits(FormWrapper, _View);

  var _super = _createSuper(FormWrapper);

  function FormWrapper(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, FormWrapper);

    _this = _super.call(this, args);
    _this.path = path;
    _this.args.method = method;
    _this.args.action = _this.args.action || null;
    _this.args.form = null;
    _this.args.title = null;
    _this.args["class"] = '';
    _this.template = "\n\t\t\t<div class = \"form constrict [[class]]\">\n\t\t\t\t<div cv-if = \"title\"><label>[[title]]</label></div>\n\t\t\t\t[[form]]\n\t\t\t</div>\n\t\t";
    _this._onLoad = [];
    _this._onSubmit = [];
    _this._onRender = [];
    _this._onRequest = [];
    _this._onError = [];
    _this._onResponse = [];

    if (path instanceof _Form.Form) {
      _this.loadForm(form, customFields);
    } else {
      _Repository.Repository.request(path).then(function (resp) {
        if (!resp || !resp.meta || !resp.meta.form || !(resp.meta.form instanceof Object)) {
          console.log('Cannot render form with ', resp);
          return;
        }

        _this.loadForm(new _Form.Form(resp.meta.form, customFields));

        _this.onLoad(_this.args.form, resp.body);
      });
    }

    return _this;
  }

  _createClass(FormWrapper, [{
    key: "loadForm",
    value: function loadForm(form) {
      var _this2 = this;

      this.args.form = form;
      this.args.form.onSubmit(function (form, event) {
        if (_this2.onSubmit(form, event) === false) {
          return;
        }

        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }

        var formElement = form.tags.formTag.element;

        var uri = formElement.getAttribute('action') || _this2.args.action || _this2.path;

        var method = formElement.getAttribute('method') || _this2.args.method;

        var query = form.args.flatValue;
        method = method.toUpperCase();

        if (method == 'GET') {
          var _query = {};

          if (_this2.args.content && _this2.args.content.args) {
            _this2.args.content.args.page = 0;
          }

          _query.page = 0;

          for (var i in query) {
            if (i === 'api') {
              continue;
            }

            _query[i] = query[i];
          }

          var promises = _this2.onRequest(_query);

          promises.then(function () {
            _this2.onResponse({});

            _Router.Router.go(uri + '?' + _Router.Router.queryToString(_query));

            _this2.update(_query);
          })["catch"](function (error) {
            _this2.onRequestError(error);
          });
        } else if (method == 'POST') {
          var formData = form.formData();

          var _iterator = _createForOfIteratorHelper(formData.entries()),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var pair = _step.value;
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          var _promises = _this2.onRequest(formData);

          if (_promises) {
            _promises.then(function () {
              _Repository.Repository.request(uri, {
                api: 'json'
              }, formData, false, {
                progressDown: function progressDown(event) {
                  _this2.progressDown(event);
                },
                progressUp: function progressUp(event) {
                  _this2.progressUp(event);
                }
              }).then(function (response) {
                _this2.onResponse(response);
              })["catch"](function (error) {
                _this2.onRequestError(error);
              });
            });
          }
        }
      });
    }
  }, {
    key: "onRequest",
    value: function onRequest(requestData) {
      var promises = [];

      for (var i in this._onRequest) {
        var onReq = this._onRequest[i](requestData, this);

        if (onReq) {
          promises.push(onReq);
        }
      }

      if (promises.length == 0) {
        return Promise.resolve();
      }

      return Promise.all(promises);
    }
  }, {
    key: "onRequestError",
    value: function onRequestError(error) {
      for (var i in this._onError) {
        this._onError[i](error, this);
      }

      if (error.messages) {
        for (var _i in error.messages) {
          _Toast.Toast.instance().alert(error.body && error.body.id ? 'Success!' : 'Error!', error.messages[_i], 3500);
        }
      }
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      for (var i in this._onResponse) {
        this._onResponse[i](response, this);
      }

      if (response.messages) {
        for (var _i2 in response.messages) {
          _Toast.Toast.instance().alert(response.body && response.body.id ? 'Success!' : 'Error!', response.messages[_i2], 3500);
        }
      }
    }
  }, {
    key: "onLoad",
    value: function onLoad(form, model) {
      for (var i in this._onLoad) {
        this._onLoad[i](this, form, model);
      }
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(form, event) {
      for (var i in this._onSubmit) {
        this._onSubmit[i](this, event);
      }
    }
  }, {
    key: "postRender",
    value: function postRender() {
      for (var i in this._onRender) {
        this._onRender[i](this.args.form);
      }
    }
  }, {
    key: "customFields",
    value: function customFields() {
      return {};
    }
  }, {
    key: "submit",
    value: function submit() {}
  }, {
    key: "progressUp",
    value: function progressUp(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }, {
    key: "progressDown",
    value: function progressDown(event) {
      console.log(event.loaded, event.total, event.loaded / event.total);
    }
  }]);

  return FormWrapper;
}(_View2.View);

exports.FormWrapper = FormWrapper;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchForm = void 0;

var _Config = require("../../base/Config");

var _FormWrapper2 = require("./FormWrapper");

var _HiddenField = require("../../form/HiddenField");

var _Repository = require("../../base/Repository");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var backend = _Config.Config.get('backend') || '//';

var SearchForm = function (_FormWrapper) {
  _inherits(SearchForm, _FormWrapper);

  var _super = _createSuper(SearchForm);

  function SearchForm(args, path) {
    var _this;

    var method = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'GET';
    var customFields = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, SearchForm);

    _this = _super.call(this, args, path, 'POST', {
      search: _HiddenField.HiddenField
    });
    _this.superTemplate = _this.template;
    _this.args.records = [];
    _this.selected = null;
    _this.template = "\n\t\t\t".concat(_this.superTemplate, "\n\t\t\t<div cv-each = \"records:record:r\" class = \"dropdown-results\">\n\t\t\t\t<div\n\t\t\t\t\tcv-on         = \"click:select(event)\"\n\t\t\t\t\tdata-index    = \"[[r]]\"\n\t\t\t\t\tdata-publicId = \"[[record.publicId]]\"\n\t\t\t\t\tclass         = \"[[record.classes]]\"\n\t\t\t\t>\n\t\t\t\t\t[[record.title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t");
    return _this;
  }

  _createClass(SearchForm, [{
    key: "onLoad",
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

        _Repository.Repository.request(backend + _this2.path, {
          keyword: v
        }).then(function (response) {
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

      _get(_getPrototypeOf(SearchForm.prototype), "onLoad", this).call(this, form);
    }
  }, {
    key: "onRequest",
    value: function onRequest() {
      return _get(_getPrototypeOf(SearchForm.prototype), "onRequest", this).call(this);
    }
  }, {
    key: "onResponse",
    value: function onResponse(response) {
      _get(_getPrototypeOf(SearchForm.prototype), "onResponse", this).call(this, response);
    }
  }, {
    key: "select",
    value: function select(event) {
      var _this3 = this;

      var index = event.target.getAttribute('data-index');
      var publicId = event.target.getAttribute('data-publicId');
      var record = this.args.records[index];
      console.log(record);
      this.args.view.addRecord(record);
      this.args.view.addButtonClicked();
      return;

      _Repository.Repository.request(backend + this.path + '/' + publicId).then(function (response) {
        console.log(response.body);

        if (!response.body) {
          return;
        }

        _this3.args.view.addRecord(response.body);

        _this3.args.view.addButtonClicked();
      });
    }
  }, {
    key: "onSubmit",
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

exports.SearchForm = SearchForm;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.View = void 0;

var _Config = require("../../base/Config");

var _Form = require("../../form/Form");

var _FieldSet2 = require("../../form/FieldSet");

var _CreateForm = require("./CreateForm");

var _SearchForm = require("./SearchForm");

var _FormWrapper = require("./FormWrapper");

var _Wrapper = require("./Wrapper");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var View = function (_FieldSet) {
  _inherits(View, _FieldSet);

  var _super = _createSuper(View);

  function View(values, form, parent, key) {
    var _this;

    _classCallCheck(this, View);

    _this = _super.call(this, values, form, parent, key);
    _this.args._fields = [];
    _this.dragging = false;
    _this.dropping = false;

    for (var i in _this.args.fields) {
      _this.args._fields[i] = _this.wrapSubfield(_this.args.fields[i]);
    }

    _this.args.fields[-1].disable();

    _this.args.creating = '';
    _this.args.fieldType = '';
    _this.args.createForm = _this.args.createForm || '';
    _this.args.searchForm = _this.args.searchForm || '';
    _this.args.createFormReady = false;

    _this.setCreateForm({
      view: _assertThisInitialized(_this)
    });

    _this.args.loader = '...';
    _this.args.addIcon = '&#215;';
    _this.args.addIcon = 'a';
    _this.args.addIcon = '+';
    _this.args.draggable = 'true';
    _this.template = "\n\t\t\t<label\n\t\t\t\tfor        = \"".concat(_this.args.name, "\"\n\t\t\t\tdata-type  = \"").concat(_this.args.attrs.type, "\"\n\t\t\t\tdata-multi = \"").concat(_this.args.attrs['data-multi'] ? 'true' : 'false', "\"\n\t\t\t>\n\t\t\t\t<span cv-if = \"title\">\n\t\t\t\t\t<span cv-ref = \"title:curvature/base/Tag\">[[title]]</span>\n\t\t\t\t</span>\n\n\t\t\t\t<fieldset\n\t\t\t\t\tname  = \"").concat(_this.args.name, "\"\n\t\t\t\t\tclass = \"multi-field [[creating]] [[fieldType]]\"\n\t\t\t\t>\n\n\t\t\t\t\t<div class = \"record-list\" cv-each = \"_fields:field:f\">\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tclass     = \"single-record\"\n\t\t\t\t\t\t\tdata-for  = \"[[f]]\"\n\t\t\t\t\t\t>[[field]]</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay create\">\n\t\t\t\t\t\t<div class = \"form constrict\">\n\t\t\t\t\t\t\t<div\n\t\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\t\tclass = \"bubble bottom left-margin close\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t&#215;\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t[[createForm]]\n\t\t\t\t\t\t[[searchForm]]\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<div class = \"overlay loading\">\n\t\t\t\t\t\t[[loader]]\n\t\t\t\t\t</div>\n\t\t\t\t\t<div cv-if = \"createFormReady\" class=\"add-button-holder\">\n\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tcv-on = \"click:addButtonClicked(event)\"\n\t\t\t\t\t\t\tclass = \"bubble bottom left-margin add\"\n\t\t\t\t\t\t\ttab-index = \"0\"\n\t\t\t\t\t\t>[[addIcon]]</div>\n\n\t\t\t\t\t</div>\n\n\t\t\t\t</fieldset>\n\n\t\t\t\t<span cv-each = \"errors:error:e\">\n\t\t\t\t\t<p class = \"cv-error\">[[error]]</p>\n\t\t\t\t</span>\n\n\t\t\t</label>\n\t\t");
    return _this;
  }

  _createClass(View, [{
    key: "setCreateForm",
    value: function setCreateForm(args) {
      var _this2 = this;

      var origin = '';

      if (_Config.Config.get('backend')) {
        origin = _Config.Config.get('backend');
      }

      if (this.args.attrs['data-create-endpoint'] !== false) {
        this.args.createForm = new _CreateForm.CreateForm(Object.assign({}, args), this.args.attrs['data-create-endpoint'] ? origin + this.args.attrs['data-create-endpoint'] : args.publicId ? origin + "".concat(this.args.attrs['data-endpoint'], "/").concat(args.publicId, "/edit") : origin + "".concat(this.args.attrs['data-endpoint'], "/create"));

        this.args.createForm._onLoad.push(function (wrap, form) {
          _this2.args.createFormReady = true;
        });
      } else {
        this.args.createFormReady = true;
      }

      console.log(this.args.createFormReady);
      this.args.searchForm = new _SearchForm.SearchForm(Object.assign({}, args), origin + this.args.attrs['data-endpoint']);
    }
  }, {
    key: "wrapSubfield",
    value: function wrapSubfield(field) {
      return new _Wrapper.Wrapper({
        field: field,
        parent: this
      });
    }
  }, {
    key: "addButtonClicked",
    value: function addButtonClicked() {
      if (!this.args.creating) {
        this.args.creating = 'creating';
      }
    }
  }, {
    key: "addRecord",
    value: function addRecord(record) {
      this.args.creating = '';

      if (!Array.isArray(record)) {
        record = [record];
      }

      for (var i in record) {
        var _skeleton$attrs;

        var fieldClass = this.args.fields[-1].constructor;
        var skeleton = Object.assign({}, this.args.fields[-1].skeleton);
        var name = Object.values(this.args.fields).length - 1;
        skeleton = this.cloneSkeleton(skeleton);
        skeleton = this.correctNames(skeleton, name);
        skeleton.attrs = (_skeleton$attrs = skeleton.attrs) !== null && _skeleton$attrs !== void 0 ? _skeleton$attrs : {};
        skeleton.attrs['data-array'] = true;
        var superSkeleton = {};
        superSkeleton[name] = skeleton;

        var newField = _Form.Form.renderFields(superSkeleton, this)[name];

        this.args.fields[name] = newField;
        var newWrap = this.wrapSubfield(newField);
        newField.args.value.id = record[i].id || '';
        newField.args.value["class"] = record[i]["class"] || '';
        newField.args.value.title = record[i].title || '';
        newField.args.value.key = this.args._fields.length;

        this.args._fields.push(newWrap);

        newWrap.refresh(record[i]);
      }
    }
  }, {
    key: "editRecord",
    value: function editRecord(record, wrapper) {
      this.setCreateForm({
        view: this,
        publicId: record.publicId,
        wrapper: wrapper
      });
      this.args.creating = this.args.creating ? '' : 'creating';
    }
  }, {
    key: "deleteImage",
    value: function deleteImage(index) {
      console.log(index, this.args.fields);
      this.args.fields[index].disable();
      this.args._fields[index].args.classes = 'deleted';
    }
  }, {
    key: "undeleteImage",
    value: function undeleteImage(index) {
      this.args.fields[index].enable();
      this.args._fields[index].args.classes = '';
    }
  }, {
    key: "cloneSkeleton",
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
    key: "correctNames",
    value: function correctNames(skeleton, id) {
      skeleton.name = skeleton.name.replace(/\[-1\]/, "[".concat(id, "]"));
      skeleton.attrs.name = skeleton.name;

      if ('children' in skeleton) {
        for (var i in skeleton.children) {
          skeleton.children[i] = this.correctNames(skeleton.children[i], id);
        }
      }

      return skeleton;
    }
  }, {
    key: "drag",
    value: function drag(event) {
      this.dragging = event.target;
    }
  }, {
    key: "dragOver",
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
    key: "drop",
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
      var dragField, dropField;

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
    key: "dragStop",
    value: function dragStop() {
      this.dragging = false;
      this.dropping = false;
    }
  }, {
    key: "changeAttributePrefix",
    value: function changeAttributePrefix(node, attribute, oldPrefix, newPrefix) {
      var oldName = node.getAttribute(attribute);
      var newName = newPrefix + node.getAttribute(attribute).substring(oldPrefix.length);
      node.setAttribute(attribute, newName);
    }
  }, {
    key: "extractIndex",
    value: function extractIndex(name) {
      var groups;

      if (groups = /\[(-?\d+)\]$/.exec(name)) {
        return parseInt(groups[1]);
      }

      return false;
    }
  }, {
    key: "changeIndex",
    value: function changeIndex(name, index) {
      var newName = name.replace(/\[(-?\d+)\]$/, '[' + index + ']');
      return newName;
    }
  }, {
    key: "cancel",
    value: function cancel(event) {
      event.stopPropagation();
    }
  }]);

  return View;
}(_FieldSet2.FieldSet);

exports.View = View;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Wrapper = void 0;

var _Config = require("../../base/Config");

var _View2 = require("../../base/View");

var _Repository = require("../../base/Repository");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var Wrapper = function (_View) {
  _inherits(Wrapper, _View);

  var _super = _createSuper(Wrapper);

  function Wrapper(args) {
    var _this;

    _classCallCheck(this, Wrapper);

    _this = _super.call(this, args);
    _this.template = "\n\t\t\t<div\n\t\t\t\tclass = \"wrapped-field [[classes]]\"\n\t\t\t\tcv-on = \"click:editRecord(event, key)\"\n\t\t\t\ttitle = \"[[fieldName]]: [[id]]\"\n\t\t\t>\n\t\t\t\t<div\n\t\t\t\t\tcv-on = \"click:deleteImage(event, key)\"\n\t\t\t\t\tstyle = \"display: inline; cursor:pointer;\"\n\t\t\t\t>\n\t\t\t\t\t[[icon]]\n\t\t\t\t</div>\n\t\t\t\t<div class = \"field-content\">\n\t\t\t\t\t[[title]]\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t\t<div style = \"display:none\">[[field]]</div>\n\t\t";
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

    _this.args.field.args.value.bindTo('id', function (v, k) {
      if (!v) {
        return;
      }

      _Repository.Repository.request(_this.backendPath(), {
        id: v
      }).then(function (response) {
        _this.args.id = v;
        var record = response.body[0];

        if (!record) {
          _this.args.publicId = null;
          _this.args.title = null;
          return;
        }

        _this.refresh(record);
      });
    }, {
      wait: 0
    });

    _this.args.field.args.value.bindTo('keyword', function (v) {
      _this.args.keyword = v;
    });

    return _this;
  }

  _createClass(Wrapper, [{
    key: "editRecord",
    value: function editRecord() {
      this.args.parent.editRecord(this.args.record, this);
    }
  }, {
    key: "deleteImage",
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
    key: "backendPath",
    value: function backendPath() {
      var backend = _Config.Config.get('backend') || '//';
      return backend + this.args.parent.args.attrs['data-endpoint'];
    }
  }, {
    key: "getRecordTitle",
    value: function getRecordTitle(record) {
      if (record._titleField) {
        return record[record._titleField];
      }

      return record.title || record.publicId || record.id;
    }
  }, {
    key: "refresh",
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

exports.Wrapper = Wrapper;
