'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = {};

var Repository = exports.Repository = function () {
	function Repository() {
		_classCallCheck(this, Repository);
	}

	_createClass(Repository, null, [{
		key: 'loadPage',
		value: function loadPage() {
			var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			return this.request(this.uri, args).then(function (response) {
				return response;
				// return response.map((skeleton) => new Model(skeleton));
			});
		}
	}, {
		key: 'load',
		value: function load(id) {
			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			this.objects = this.objects || {};
			this.objects[this.uri] = this.objects[this.uri] || {};

			if (this.objects[this.uri][id]) {
				return Promise.resolve(this.objects[this.uri][id]);
			}

			return this.request(this.uri + '/' + id).then(function (response) {
				// let model = new Model(response);
				// return this.objects[this.uri][id] = model;
			});
		}
	}, {
		key: 'form',
		value: function form() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var uri = this.uri + '/' + 'create';
			if (id) {
				uri = this.uri + '/' + id + '/edit';
			}
			return this.request(uri).then(function (skeleton) {
				return skeleton;
			});
		}
	}, {
		key: 'clearCache',
		value: function clearCache() {
			if (this.objects && this.objects[this.uri]) {
				this.objects[this.uri] = {};
			}
		}
	}, {
		key: 'request',
		value: function request(uri) {
			var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			var _this = this;

			var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
			var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;

			var type = 'GET';
			var queryString = '';
			var formData = null;
			var queryArgs = {};

			if (args) {
				queryArgs = args;
			}

			queryArgs.api = queryArgs.api || 'json';

			queryString = Object.keys(queryArgs).map(function (arg) {
				return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
			}).join('&');

			var fullUri = uri;
			var postString = '';

			cache = false;

			if (post) {
				cache = false;
				type = 'POST';
				formData = new FormData();
				for (var i in post) {
					formData.append(i, post[i]);
				}
				postString = Object.keys(post).map(function (arg) {
					return encodeURIComponent(arg) + '=' + encodeURIComponent(post[arg]);
				}).join('&');
			}

			fullUri = uri + '?' + queryString;

			var xhr = new XMLHttpRequest();

			if (!post && cache && this.cache && this.cache[fullUri]) {
				return Promise.resolve(this.cache[fullUri]);
			}

			xhr.withCredentials = true;
			xhr.timeout = 15000;

			var xhrId = this.xhrs.length;

			if (!post) {
				this.xhrs.push(xhr);
			}

			return new Promise(function (xhrId) {
				return function (resolve, reject) {
					xhr.onreadystatechange = function () {
						var DONE = 4;
						var OK = 200;

						var response = void 0;

						if (xhr.readyState === DONE) {

							if (!_this.cache) {
								_this.cache = {};
							}

							if (xhr.status === OK) {

								if (response = JSON.parse(xhr.responseText)) {
									if (response.code == 0) {
										// Repository.lastResponse = response;

										if (!post && cache) {
											_this.cache[fullUri] = response;
										}

										// console.log(response.body);

										resolve(response);
									} else {
										if (!post && cache) {
											_this.cache[fullUri] = response;
										}

										reject(response);
									}
								} else {
									// Repository.lastResponse = xhr.responseText;

									if (!post && cache) {
										_this.cache[fullUri] = xhr.responseText;
									}

									resolve(xhr.responseText);
								}
							} else {
								reject('HTTP' + xhr.status);
							}
							_this.xhrs[xhrId] = null;
						}
					};

					xhr.open(type, fullUri);

					if (post) {
						xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					}
					xhr.send(postString);
				};
			}(xhrId));
		}
	}, {
		key: 'cancel',
		value: function cancel() {
			for (var i in this.xhrs) {
				if (!this.xhrs[i]) {
					continue;
				}
				this.xhrs[i].abort();
			}
			this.xhrList = [];
		}
	}, {
		key: 'xhrs',
		get: function get() {
			return this.xhrList = this.xhrList || [];
		}
	}]);

	return Repository;
}();

// Repository.lastResponse = null;