'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Repository = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _Router = require('./Router');

var _Cache = require('./Cache');

var _Model = require('./Model');

var _Bag = require('./Bag');

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
			var args = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var resourceUri = this.uri + '/' + id;

			var cached = _Cache.Cache.load(resourceUri + _Router.Router.queryToString(_Router.Router.queryOver(args), true), false, 'model-uri-repo');

			if (!refresh && cached) {
				return Promise.resolve(cached);
			}

			return Repository.request(resourceUri, args).then(function (response) {
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

				for (var i in response.body) {
					var record = response.body[i];

					records.push(_this2.extractModel(record));
				}

				response.body = records;

				return response;
			});
		}
	}, {
		key: 'edit',
		value: function edit() {
			var publicId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var customFields = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			var resourceUri = this.uri + '/create';

			if (publicId) {
				resourceUri = this.uri + '/' + publicId + '/edit';
			}

			// console.log(resourceUri);

			if (!data) {
				return Repository.request(resourceUri).then(function (response) {
					var form = new _Form.Form(response.meta.form, customFields);
					// let model = this.extractModel(response.body);

					return new _FormWrapper.FormWrapper(form, resourceUri, 'POST', customFields);
				});
			} else {
				return Repository.request(resourceUri, { api: 'json' }, data).then(function (response) {
					return response.body;
				});
			}
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
		key: 'encode',
		value: function encode(obj) {
			var namespace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
			var formData = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (!formData) {
				formData = new FormData();
			}

			for (var i in obj) {
				var ns = i;

				if (namespace) {
					ns = namespace + '[' + ns + ']';
				}

				if (obj[i] && _typeof(obj[i]) !== 'object') {
					formData.append(ns, obj[i]);
				} else {
					this.encode(obj[i], ns, formData);
				}
			}

			return formData;
		}
	}, {
		key: 'onResponse',
		value: function onResponse(callback) {
			if (!this._onResponse) {
				this._onResponse = new _Bag.Bag();
			}

			return this._onResponse.add(callback);
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

			if (!this._onResponse) {
				this._onResponse = new _Bag.Bag();
			}

			queryArgs.api = queryArgs.api || 'json';

			queryString = Object.keys(queryArgs).map(function (arg) {
				return encodeURIComponent(arg) + '=' + encodeURIComponent(queryArgs[arg]);
			}).join('&');

			var fullUri = uri;
			// let postString = '';

			if (post) {
				cache = false;
				type = 'POST';
				if (post instanceof FormData) {
					formData = post;
				} else {
					formData = this.encode(post);
				}
				// postString = Object.keys(post).map((arg) => {
				// 	return encodeURIComponent(arg)
				// 	+ '='
				// 	+ encodeURIComponent(post[arg])
				// }).join('&');
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

			var link = document.createElement("a");
			link.href = fullUri;

			var uriPath = link.pathname;

			if (!post) {
				this.xhrs[uriPath] = xhr;
			}

			var reqPromise = new Promise(function (resolve, reject) {
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

									var onResponse = _this3._onResponse.items();

									for (var i in onResponse) {
										onResponse[i](response, true);
									}

									resolve(response);
								} else {
									if (!post && cache) {
										// this.cache[fullUri] = response;
									}

									var _onResponse = _this3._onResponse.items();

									for (var _i in _onResponse) {
										_onResponse[_i](response, true);
									}

									reject(response);
								}
							} else {
								// Repository.lastResponse = xhr.responseText;

								if (!post && cache) {
									// this.cache[fullUri] = xhr.responseText;
								}

								var _onResponse2 = _this3._onResponse.items();

								for (var _i2 in _onResponse2) {
									_onResponse2[_i2](xhr, true);
								}

								resolve(xhr);
							}
						} else {
							reject('HTTP' + xhr.status);
						}
						delete _this3.xhrs[uriPath];
					}
				};

				xhr.open(type, fullUri, true);

				// if(post)
				// {
				// 	xhr.setRequestHeader("Content-type", "multipart/form-data");
				// }
				xhr.send(formData);
			});

			return reqPromise;
		}
	}, {
		key: 'cancel',
		value: function cancel() {
			var regex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : /^.$/;

			for (var i in this.xhrs) {
				console.log(i);
				if (!this.xhrs[i]) {
					continue;
				}
				if (i.match(regex)) {
					console.log('!!!');
					this.xhrs[i].abort();
				}
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