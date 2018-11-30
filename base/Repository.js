'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _Cache = require('./Cache');

var _Model = require('./Model');

var _Form = require('../form/Form');

var _FormWrapper = require('../form/multiField/FormWrapper');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var objects = {};

var Repository = function () {
	function Repository(uri) {
		_classCallCheck(this, Repository);

		this.uri = uri;
	}

	_createClass(Repository, [{
		key: 'get',
		value: function get(id) {
			var _this = this;

			var refresh = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var resourceUri = this.uri + '/' + id;

			var cached = _Cache.Cache.load(resourceUri, false, 'model-uri-repo');

			if (!refresh && cached) {
				return Promise.resolve(cached);
			}

			return Repository.request(resourceUri).then(function (response) {
				return _this.extractModel(response.body);
			});
		}
	}, {
		key: 'page',
		value: function page() {
			var _this2 = this;

			var _page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

			var args = arguments[1];

			return Repository.request(this.uri, args).then(function (response) {
				var records = [];

				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;

				try {
					for (var _iterator = response.body[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var record = _step.value;

						records.push(_this2.extractModel(record));
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}

				return records;
			});
		}
	}, {
		key: 'edit',
		value: function edit() {
			var publicId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			var resourceUri = this.uri + '/create';

			if (publicId) {
				resourceUri = this.uri + '/' + publicId + '/edit';
			}

			// console.log(resourceUri);

			return Repository.request(resourceUri).then(function (response) {
				var form = new _Form.Form(response.meta.form);
				// let model = this.extractModel(response.body);

				return new _FormWrapper.FormWrapper(form, resourceUri);
			});
		}
	}, {
		key: 'extractModel',
		value: function extractModel(rawData) {
			var model = _Bindable.Bindable.makeBindable(new _Model.Model(this));

			model.consume(rawData);

			var resourceUri = this.uri + '/' + model.publicId;

			_Cache.Cache.store(resourceUri, model, 10, 'model-uri-repo');

			if (model.class) {
				var cacheKey = model.class + '::' + model.publidId;

				var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

				// if(cached)
				// {
				// 	cached.consume(rawData);
				// 	return cached;
				// }

				_Cache.Cache.store(cacheKey, model, 10, 'model-type-repo');
			}

			return model;
		}
	}], [{
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
		key: 'domCache',
		value: function domCache(uri, content) {
			// console.log(uri, content);
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
			var post = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			var _this3 = this;

			var cache = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
			var options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};

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

			if (post) {
				cache = false;
				type = 'POST';
				if (post instanceof FormData) {
					formData = post;
				} else {
					formData = new FormData();
					for (var i in post) {
						formData.append(i, post[i]);
					}
				}
				postString = Object.keys(post).map(function (arg) {
					return encodeURIComponent(arg) + '=' + encodeURIComponent(post[arg]);
				}).join('&');
			}

			fullUri = uri + '?' + queryString;

			var xhr = new XMLHttpRequest();

			if ('responseType' in options) {
				xhr.responseType = options.responseType;
			}

			if (!post && cache && this.cache && this.cache[fullUri]) {
				return Promise.resolve(this.cache[fullUri]);
			}

			var tagCacheSelector = 'script[data-uri="' + fullUri + '"]';

			var tagCache = document.querySelector(tagCacheSelector);

			if (!post && cache && tagCache) {
				var tagCacheContent = JSON.parse(tagCache.innerText);

				return Promise.resolve(tagCacheContent);
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

							if (!_this3.cache) {
								_this3.cache = {};
							}

							if (xhr.status === OK) {

								if (xhr.getResponseHeader("Content-Type") == 'application/json' || xhr.getResponseHeader("Content-Type") == 'application/json; charset=utf-8' || xhr.getResponseHeader("Content-Type") == 'text/json' || xhr.getResponseHeader("Content-Type") == 'text/json; charset=utf-8') {
									response = JSON.parse(xhr.responseText);
									if (response.code == 0) {
										// Repository.lastResponse = response;

										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										var _tagCache = document.querySelector('script[data-uri="' + fullUri + '"]');

										var prerendering = window.prerenderer;

										if (prerendering) {
											if (!_tagCache) {
												_tagCache = document.createElement('script');
												_tagCache.type = 'text/json';
												_tagCache.setAttribute('data-uri', fullUri);
												document.head.appendChild(_tagCache);
											}

											// console.log(JSON.stringify(response));

											_tagCache.innerText = JSON.stringify(response);
										}

										resolve(response);
									} else {
										if (!post && cache) {
											// this.cache[fullUri] = response;
										}

										reject(response);
									}
								} else {
									// Repository.lastResponse = xhr.responseText;

									if (!post && cache) {
										// this.cache[fullUri] = xhr.responseText;
									}

									resolve(xhr);
								}
							} else {
								reject('HTTP' + xhr.status);
							}
							_this3.xhrs[xhrId] = null;
						}
					};

					xhr.open(type, fullUri, true);

					// if(post)
					// {
					// 	xhr.setRequestHeader("Content-type", "multipart/form-data");
					// }
					xhr.send(formData);
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


exports.Repository = Repository;