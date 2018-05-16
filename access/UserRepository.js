'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UserRepository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Config = require('Config');

var _Repository2 = require('curvature/base/Repository');

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
			return this.request(this.uri + 'current', false, false, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'logout',
		value: function logout() {
			return this.request(this.uri + 'logout', false, {}, false).then(function (user) {
				return user;
			});
		}
	}, {
		key: 'uri',
		get: function get() {
			return _Config.Config.backend + '/user/';
		}
	}]);

	return UserRepository;
}(_Repository2.Repository);