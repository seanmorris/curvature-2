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

		_this.topEdge = false;
		_this.resizeListening = false;
		_this.visible = false;
		_this.offsetTop = false;
		_this.offsetBottom = false;

		_this.threshold = 0;

		_this.subscribedTo = [];

		_this.scrollListener = function (event) {
			var tag = event.target;

			_this.scrolled(tag);
		};

		_this.resizeListener = function (event) {
			for (var i in _this.resizeTags) {
				_this.resizeTags[i].scrolled(event.target);
			}
		};

		_this.attachListener = function (e) {
			if (e.path[e.path.length - 1] !== window) {
				return;
			}

			if (e.target !== element) {
				return;
			}

			var current = _Bindable.Bindable.makeBindable(e.target);

			_this.addScrollListener(current);

			_this.scrolled(current);

			_this.element.removeEventListener('cvDomAttached', _this.attachListener);
		};

		_this.element.addEventListener('cvDomAttached', _this.attachListener);

		_this.cleanup.push(function (element) {
			return function () {};
		}(_this.element));

		ScrollTag.addResizeListener(_this);

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
			var _this2 = this;

			if (!tag.scrollListener) {
				Object.defineProperty(tag, 'scrollListener', {
					enumerable: false,
					writable: true
				});

				tag.scrollListener = true;

				window.addEventListener('scroll', this.scrollListener);

				this.cleanup.push(function (element) {
					return function () {
						window.removeEventListener('scroll', _this2.scrollListener);
					};
				}(tag));
			}

			for (var i in this.subscribedTo) {
				if (this.subscribedTo[i] === tag) {
					return;
				}
			}

			if (tag.scrollSubTags) {
				tag.scrollSubTags.push(this);
			}
		}
	}], [{
		key: 'addResizeListener',
		value: function addResizeListener(tag) {
			this.resizeTags = [];

			if (!this.resizeListener) {
				// window.addEventListener('resize', this.resizeListener);

				// this.cleanup.push(()=>{
				// 	window.removeEventListener('resize', this.resizeListener);
				// });
			}

			this.resizeListener = true;

			this.resizeTags.push(tag);
		}
	}]);

	return ScrollTag;
}(_Tag2.Tag);