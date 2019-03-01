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
		value: function getCurrentUser() {
			var _this2 = this;

			var refresh = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			this.args = this.args || _Bindable.Bindable.makeBindable({});
			if (window.prerenderer) {
				return;
			}
			if (!refresh && this.running) {
				console.log(this.running);
				return this.running;
			}
			if (!refresh && this.args.response) {
				return Promise.resolve(this.args.response);
			}
			if (refresh === false) {
				return Promise.resolve(this.args.response);
			}
			this.running = this.request(this.uri + 'current', false, false, false).then(function (response) {
				_this2.running = false;
				if (response.body && response.body.roles) {
					for (var i in response.body.roles) {
						if (response.body.roles[i].class == 'SeanMorris\\Access\\Role\\Administrator') {
							response.body.isAdmin = true;
						}
					}
				}
				if (response.body && response.body.id) {
					_this2.args.response = response;
					_this2.args.current = response.body;
				}
				return response;
			});

			return this.running;
		}
	}, {
		key: 'login',
		value: function login() {
			return this.request(this.uri + '/login');
		}
	}, {
		key: 'logout',
		value: function logout() {
			var _this3 = this;

			this.args = this.args || _Bindable.Bindable.makeBindable({});
			var user = this.args.current;

			return this.request(this.uri + 'logout', false, {}, false).then(function () {
				_this3.args.current = null;
				return user;
			});
		}
	}, {
		key: 'onChange',
		value: function onChange(callback) {
			this.args = this.args || _Bindable.Bindable.makeBindable({});
			return this.args.bindTo('current', callback);
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);

_Repository2.Repository.onResponse(function (response) {
	UserRepository.args = UserRepository.args || _Bindable.Bindable.makeBindable({});
	if (response && response.meta && response.meta.currentUser && (!UserRepository.args.current || response.meta.currentUser.id !== UserRepository.args.current.id)) {
		UserRepository.args.current = response.meta.currentUser;
	}
}, { wait: 0 });

// setInterval(() => {
// 	UserRepository.getCurrentUser();
// 	console.log('!!!');
// }, 5000);