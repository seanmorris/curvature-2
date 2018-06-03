'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ScrollTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Tag2 = require('../base/Tag');

var _Dom = require('../base/Dom');

var _Bindable = require('../base/Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ScrollTag = exports.ScrollTag = function (_Tag) {
	_inherits(ScrollTag, _Tag);

	function ScrollTag(element, parent, ref, index) {
		_classCallCheck(this, ScrollTag);

		var _this = _possibleConstructorReturn(this, (ScrollTag.__proto__ || Object.getPrototypeOf(ScrollTag)).call(this, element, parent, ref, index));

		_this.visible = false;
		_this.offsetTop = false;
		_this.offsetBottom = false;

		_this.scrollListener = function (event) {
			_this.scrolled(event.target);
		};

		_this.resizeListener = function (event) {
			_this.scrolled(event.target);
		};

		_this.attachListener = function (e) {
			if (e.path[e.path.length - 1] !== window) {
				return;
			}

			if (e.target !== element) {
				return;
			}

			// let current = Bindable.makeBindable(e.target);

			_this.addScrollListener(e.target);
			_this.addResizeListener(e.target);

			_this.scrolled(e.target);

			e.target.removeEventListener('cvDomAttached', _this.attachListener);
		};

		_this.element.addEventListener('cvDomAttached', _this.attachListener);

		_this.cleanup.push(function (element) {
			return function () {
				element.removeEventListener('cvDomAttached', _this.attachListener);
			};
		}(_this.element));

		_this.bindTo('visible', function (v) {
			var scrolledEvent = void 0;

			if (v) {
				scrolledEvent = new Event('cvScrolledIn');
			} else {
				scrolledEvent = new Event('cvScrolledOut');
			}

			_Dom.Dom.mapTags(_this.element, false, function (node) {
				node.dispatchEvent(scrolledEvent);
			});

			_this.element.dispatchEvent(scrolledEvent);
		});

		_this.bindTo('offsetTop', function (v) {
			var scrolledEvent = new CustomEvent('cvScrolled', {
				detail: { offset: v }
			});
			_Dom.Dom.mapTags(_this.element, false, function (node) {
				node.dispatchEvent(scrolledEvent);
			});

			_this.element.dispatchEvent(scrolledEvent);
		});
		return _this;
	}

	_createClass(ScrollTag, [{
		key: 'scrolled',
		value: function scrolled(scroller) {
			var current = this.element;

			var offsetTop = 0,
			    offsetBottom = 0;

			var visible = false;

			var rect = this.element.getBoundingClientRect();

			if (rect.bottom > 0 && rect.top < window.innerHeight) {
				visible = true;
			}

			this.proxy.visible = visible;
			this.proxy.offsetTop = rect.top || 0;
			this.proxy.offsetBottom = rect.bottom || 0;
		}
	}, {
		key: 'addScrollListener',
		value: function addScrollListener(tag) {
			if (!tag.___scrollListeners___) {
				Object.defineProperty(tag, '___scrollListeners___', {
					enumerable: false,
					writable: true
				});

				tag.___scrollListener___ = this.scrollListener;

				var node = tag;

				while (node.parentNode) {
					node = node.parentNode;

					node.addEventListener('scroll', tag.___scrollListener___);

					this.cleanup.push(function (node, tag) {
						return function () {
							node.removeEventListener('scroll', tag.___scrollListener___);
							tag = node = null;
						};
					}(node, tag));
				}
			}
		}
	}, {
		key: 'addResizeListener',
		value: function addResizeListener(tag) {
			if (!tag.___resizeListener___) {
				Object.defineProperty(tag, '___resizeListener___', {
					enumerable: false,
					writable: true
				});

				tag.___resizeListener___ = this.resizeListener;

				window.addEventListener('resize', this.resizeListener);

				this.cleanup.push(function (element) {
					return function () {
						window.removeEventListener('resize', element.___resizeListener___);
						tag.___resizeListener___ = null;
						tag = null;
					};
				}(tag));
			}
		}
	}]);

	return ScrollTag;
}(_Tag2.Tag);