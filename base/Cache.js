'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = exports.Cache = function () {
	function Cache() {
		_classCallCheck(this, Cache);
	}

	_createClass(Cache, null, [{
		key: 'store',
		value: function store(key, value, expiry) {
			var bucket = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'standard';

			var expiration = expiry * 1000 + new Date().getTime();

			// console.log(
			// 	`Caching ${key} until ${expiration} in ${bucket}.`
			// 	, value
			// 	, this.bucket
			// );

			if (!this.bucket) {
				this.bucket = {};
			}

			if (!this.bucket[bucket]) {
				this.bucket[bucket] = {};
			}

			this.bucket[bucket][key] = { expiration: expiration, value: value };
		}
	}, {
		key: 'load',
		value: function load(key) {
			var defaultvalue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
			var bucket = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'standard';

			// console.log(
			// 	`Checking cache for ${key} in ${bucket}.`
			// 	, this.bucket
			// );

			if (this.bucket && this.bucket[bucket] && this.bucket[bucket][key]) {
				// console.log(this.bucket[bucket][key].expiration, (new Date).getTime());
				if (this.bucket[bucket][key].expiration > new Date().getTime()) {
					return this.bucket[bucket][key].value;
				}
			}

			return defaultvalue;
		}
	}]);

	return Cache;
}();