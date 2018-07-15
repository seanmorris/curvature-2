'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LoginView = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _View2 = require('../base/View');

var _Router = require('../base/Router');

var _Repository = require('../base/Repository');

var _UserRepository = require('./UserRepository');

var _Toast = require('../toast/Toast');

var _ToastAlert = require('../toast/ToastAlert');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoginView = exports.LoginView = function (_View) {
	_inherits(LoginView, _View);

	function LoginView() {
		_classCallCheck(this, LoginView);

		var _this = _possibleConstructorReturn(this, (LoginView.__proto__ || Object.getPrototypeOf(LoginView)).call(this));

		_this.template = '\n\t\t\t<a cv-link = "user">User</a>\n\t\t\t<br />\n\t\t\t\n\t\t\t<a cv-link = "user/login">Login</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/register">Register</a>\n\t\t\t<br />\n\n\t\t\t<a cv-link = "user/logout">Logout</a>\n\t\t\t<br />\n\n\t\t\t<input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Login via FaceBook"\n\t\t\t \tcv-on = "click:facebookLogin(event)"\n\t\t\t />\n\t\t\t <input\n\t\t\t\ttype  = "button"\n\t\t\t\tvalue = "Log Out"\n\t\t\t \tcv-on = "click:logout(event)"\n\t\t\t />\n\t\t';
		return _this;
	}

	_createClass(LoginView, [{
		key: 'facebookLogin',
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
					}));

					// history.go(-1);

					// Router.instance().updateView(this, this.routes, true);
				});
			});
		}
	}, {
		key: 'logout',
		value: function logout(event) {
			var logoutWindow = window.open(_Config.Config.backend + '/user/logout?page=app%3Fclose%3D1');
		}
	}]);

	return LoginView;
}(_View2.View);