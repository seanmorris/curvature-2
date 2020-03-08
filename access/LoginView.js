"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoginView = void 0;

var _Config = require("Config");

var _View2 = require("../base/View");

var _Router = require("../base/Router");

var _Repository = require("../base/Repository");

var _UserRepository = require("./UserRepository");

var _Toast = require("../toast/Toast");

var _ToastAlert = require("../toast/ToastAlert");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var LoginView = /*#__PURE__*/function (_View) {
  _inherits(LoginView, _View);

  function LoginView() {
    var _this;

    _classCallCheck(this, LoginView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(LoginView).call(this));
    _this.template = "\n\t\t\t<a cv-link = \"user\">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = \"user/login\">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/register\">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = \"user/logout\">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Login via FaceBook\"\n\t\t\t \tcv-on = \"click:facebookLogin(event)\"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = \"button\"\n\t\t\t\tvalue = \"Log Out\"\n\t\t\t \tcv-on = \"click:logout(event)\"\n\t\t\t />\n\t\t";
    return _this;
  }

  _createClass(LoginView, [{
    key: "facebookLogin",
    value: function facebookLogin(event) {
      var _this2 = this;

      console.log('fb!');
      event.preventDefault();
      var fbWindow = window.open(_Config.Config.backend + '/facebookLogin');

      if (this.userCheck) {
        this.clearInterval(this.userCheck);
      }

      this.userCheck = this.onInterval(333, function () {
        _UserRepository.UserRepository.getCurrentUser(true).then(function (response) {
          var user = response.body;

          if (!user.id || !user) {
            return;
          }

          _this2.clearInterval(_this2.userCheck);

          _Router.Router.clearCache();

          _Repository.Repository.clearCache();

          _Toast.Toast.instance().pop(new _ToastAlert.ToastAlert({
            title: 'Logged in as ' + user.username,
            body: 'ID: ' + user.publicId,
            time: 2400
          })); // history.go(-1);
          // Router.instance().updateView(this, this.routes, true);

        });
      });
    }
  }, {
    key: "logout",
    value: function logout(event) {
      var logoutWindow = window.open(_Config.Config.backend + '/user/logout?page=app%3Fclose%3D1');
    }
  }]);

  return LoginView;
}(_View2.View);

exports.LoginView = LoginView;