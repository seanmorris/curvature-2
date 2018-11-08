'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.RuleSet = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Dom = require('./Dom');

var _Tag = require('./Tag');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RuleSet = exports.RuleSet = function () {
	function RuleSet() {
		_classCallCheck(this, RuleSet);
	}

	_createClass(RuleSet, [{
		key: 'add',
		value: function add(selector, callback) {
			this.rules = this.rules || {};
			this.rules[selector] = this.rules[selector] || [];

			this.rules[selector].push(callback);

			return this;
		}
	}, {
		key: 'apply',
		value: function apply() {
			var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
			var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			RuleSet.apply(doc);

			for (var selector in this.rules) {
				for (var i in this.rules[selector]) {
					var callback = this.rules[selector][i];
					var wrapped = RuleSet.wrap(doc, callback, view);
					var nodes = doc.querySelectorAll(selector);

					var _iteratorNormalCompletion = true;
					var _didIteratorError = false;
					var _iteratorError = undefined;

					try {
						for (var _iterator = nodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
							var node = _step.value;

							wrapped(node);
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
				}
			}
		}
	}], [{
		key: 'add',
		value: function add(selector, callback) {
			this.globalRules = this.globalRules || {};
			this.globalRules[selector] = this.globalRules[selector] || [];

			this.globalRules[selector].push(callback);

			return this;
		}
	}, {
		key: 'apply',
		value: function apply() {
			var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
			var view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			for (var selector in this.globalRules) {
				for (var i in this.globalRules[selector]) {
					var callback = this.globalRules[selector][i];
					var wrapped = this.wrap(doc, callback, view);
					var nodes = doc.querySelectorAll(selector);

					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;

					try {
						for (var _iterator2 = nodes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var node = _step2.value;

							wrapped(node);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			}
		}
	}, {
		key: 'wait',
		value: function wait() {
			var _this = this;

			var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'DOMContentLoaded';
			var node = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

			var listener = function (event, node) {
				return function () {
					node.removeEventListener(event, listener);
					return _this.apply();
				};
			}(event, node);

			node.addEventListener(event, listener);
		}
	}, {
		key: 'wrap',
		value: function wrap(doc, callback) {
			var view = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

			if (callback instanceof _View.View || callback && callback.prototype && callback.prototype instanceof _View.View) {
				callback = function (callback) {
					return function () {
						return callback;
					};
				}(callback);
			}

			return function (element) {
				if (!element.___cvApplied___) {
					Object.defineProperty(element, '___cvApplied___', {
						enumerable: false,
						writable: true
					});

					element.___cvApplied___ = [];
				}

				for (var i in element.___cvApplied___) {
					if (callback == element.___cvApplied___[i]) {
						return;
					}
				}

				element.___cvApplied___.push(callback);

				var tag = new _Tag.Tag(element);
				var parent = tag.element.parentNode;
				var sibling = tag.element.nextSibling;

				var result = callback(tag);

				if (result instanceof HTMLElement) {
					result = new _Tag.Tag(result);
				}

				if (result instanceof _Tag.Tag) {
					if (!result.element.contains(tag.element)) {
						while (tag.element.firstChild) {
							result.element.appendChild(tag.element.firstChild);
						}

						tag.remove();
					}

					if (sibling) {
						parent.insertBefore(result.element, sibling);
					} else {
						parent.appendChild(result.element);
					}
				}

				if (result && result.prototype && result.prototype instanceof _View.View) {
					result = new result();
				}

				if (result instanceof _View.View) {
					if (view) {
						view.cleanup.push(function (r) {
							return function () {
								r.remove();
							};
						}(result));
					}

					tag.clear();
					result.render(tag.element);
				}
			};
		}
	}]);

	return RuleSet;
}();