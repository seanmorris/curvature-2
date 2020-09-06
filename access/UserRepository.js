"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRepository = void 0;

var _Config = require("Config");

var _Bindable = require("../base/Bindable");

var _Repository2 = require("../base/Repository");

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

var UserRepository = /*#__PURE__*/function (_Repository) {
  _inherits(UserRepository, _Repository);

  var _super = _createSuper(UserRepository);

  function UserRepository() {
    _classCallCheck(this, UserRepository);

    return _super.apply(this, arguments);
  }

  _createClass(UserRepository, null, [{
    key: "getCurrentUser",
    value: function getCurrentUser() {
      var _this = this;

      var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (window.prerenderer || navigator.userAgent.match(/prerender/i)) {
        window.prerenderer = window.prerenderer || true;
        return;
      }

      if (this.args.response && refresh === false) {
        return Promise.resolve(this.args.response);
      }

      return this.request(this.uri + 'current', false, false).then(function (response) {
        if (response.body && response.body.roles) {
          for (var i in response.body.roles) {
            if (response.body.roles[i]["class"] == 'SeanMorris\\Access\\Role\\Administrator') {
              response.body.isAdmin = true;
            }
          }
        }

        if (response.body && response.body.id) {
          _this.args.response = response;
          _this.args.current = response.body;
        }

        return response;
      });
    }
  }, {
    key: "login",
    value: function login() {
      return this.request(this.uri + '/login');
    }
  }, {
    key: "logout",
    value: function logout() {
      var _this2 = this;

      var user = this.args.current;
      delete this.args.current;
      return this.request(this.uri + 'logout', false, {}, false).then(function () {
        _this2.args.current = null;
        return user;
      });
    }
  }, {
    key: "onChange",
    value: function onChange(callback) {
      return this.args.bindTo('current', callback);
    }
  }, {
    key: "uri",
    get: function get() {
      return _Config.Config.backend + '/user/';
    }
  }]);

  return UserRepository;
}(_Repository2.Repository);

exports.UserRepository = UserRepository;
Object.defineProperty(UserRepository, 'args', {
  configurable: false,
  writable: false,
  value: _Bindable.Bindable.makeBindable({})
});

_Repository2.Repository.onResponse(function (response) {
  if (response && response.meta && 'currentUser' in response.meta && (!UserRepository.args.current || response.meta.currentUser.id !== UserRepository.args.current.id)) {
    UserRepository.args.current = response.meta.currentUser;
  }
});