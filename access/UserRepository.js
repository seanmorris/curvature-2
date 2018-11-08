'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserRepository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Bindable = require('../base/Bindable');

var _Repository2 = require('../base/Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var UserRepository = exports.UserRepository = function (_Repository) {
	_inherits(UserRepository, _Repository);

	function UserRepository() {
		_classCallCheck(this, UserRepository);

		return _possibleConstructorReturn(this, (UserRepository.__proto__ || Object.getPrototypeOf(UserRepository)).apply(this, arguments));
	}

	_createClass(UserRepository, null, [{
		key: 'getCurrentUser',
		value: function getCurrentUser(refresh) {
			var _this2 = this;

			this.args = this.args || _Bindable.Bindable.makeBindable({});
			if (window.prerenderer) {
				return;
			}
			return this.request(this.uri + 'current', false, false, false).then(function (response) {
				if (response.body.roles) {
					for (var i in response.body.roles) {
						if (response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator') {
							response.body.isAdmin = true;
						}
					}
				}
				_this2.args.current = response.body;
				return response;
			});
		}
	}, {
		key: 'login',
		value: function login() {
			return this.request(_Config.Config.backend + '/user/login');
		}
	}, {
		key: 'logout',
		value: function logout() {
			this.args = this.args || _Bindable.Bindable.makeBindable({});
			this.args.current = null;
			return this.request(this.uri + 'logout', false, {}, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'onChange',
		value: function onChange(callback) {
			this.args = this.args || _Bindable.Bindable.makeBindable({});
			this.args.bindTo('current', callback);
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);

// setInterval(() => {
// 	UserRepository.getCurrentUser();
// 	console.log('!!!');
// }, 5000);