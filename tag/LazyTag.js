'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.LazyTag = undefined;

var _ScrollTag2 = require('./ScrollTag');

var _Dom = require('curvature/base/Dom');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LazyTag = exports.LazyTag = function (_ScrollTag) {
	_inherits(LazyTag, _ScrollTag);

	function LazyTag(element, parent, ref, index, direct) {
		_classCallCheck(this, LazyTag);

		var _this = _possibleConstructorReturn(this, (LazyTag.__proto__ || Object.getPrototypeOf(LazyTag)).call(this, element, parent, ref, index, direct));

		_this.element.classList.remove('cv-visible');
		_this.element.classList.add('cv-not-visible');

		_this.bindTo('visible', function (v) {
			if (v) {
				if (_this.afterScroll) {
					clearTimeout(_this.afterScroll);
				}
				_this.afterScroll = setTimeout(function () {
					if (!_this.element) {
						return;
					}

					_this.element.classList.add('cv-visible');
					_this.element.classList.remove('cv-not-visible');

					_Dom.Dom.mapTags(_this.element, '[cv-lazy-style]', function (tag) {
						var lazyStyle = tag.getAttribute('cv-lazy-style');
						var style = tag.getAttribute('style');

						tag.setAttribute('style', style + ';' + lazyStyle);

						tag.removeAttribute('cv-lazy-style');
					});
				}, (_this.offsetTop || _this.element.offsetTop) * 0.5 + _this.element.offsetLeft * 0.5);
			}
		});
		return _this;
	}

	return LazyTag;
}(_ScrollTag2.ScrollTag);