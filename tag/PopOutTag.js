'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PopOutTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Dom = require('../base/Dom');

var _Tag2 = require('../base/Tag');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PopOutTag = exports.PopOutTag = function (_Tag) {
	_inherits(PopOutTag, _Tag);

	function PopOutTag(element, parent, ref, index) {
		_classCallCheck(this, PopOutTag);

		var _this = _possibleConstructorReturn(this, (PopOutTag.__proto__ || Object.getPrototypeOf(PopOutTag)).call(this, element, parent, ref, index));

		_this.poppedOut = false;
		_this.style = element.getAttribute('style');
		_this.moving = false;

		_this.leftDuration = 0;
		_this.unpoppedStyle = '';
		_this.previousScroll = 0;

		_this.bodyStyle = '';
		_this.bodyScroll = 0;

		element.classList.add('unpopped');

		_this.scrollStyle;

		_this.rect;
		_this.clickListener = function (event) {
			var leftDuration = 0.333;

			if (!_this.poppedOut || !_this.rect) {
				_this.rect = element.getBoundingClientRect();

				_this.distance = Math.sqrt(Math.pow(_this.rect.top, 2) + Math.pow(_this.rect.left, 2));

				if (!_this.leftDuration) {
					_this.leftDuration = (1 - 1 / _this.distance) / 4;
				}
			}

			if (!_this.element.contains(event.target)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();

			if (_this.moving) {
				return;
			}

			if (!_this.poppedOut) {
				_this.previousScroll = window.scrollY;

				_this.unpoppedStyle = '\n\t\t\t\t\t;position:  fixed;\n\t\t\t\t\tleft:       ' + _this.rect.x + 'px;\n\t\t\t\t\ttop:        ' + _this.rect.y + 'px;\n\t\t\t\t\twidth:      ' + _this.rect.width + 'px;\n\t\t\t\t\theight:     ' + _this.rect.height + 'px;\n\t\t\t\t\tz-index:    99999;\n\n\t\t\t\t\toverflow: hidden;\n\t\t\t\t';

				var style = _this.style + _this.unpoppedStyle;

				element.setAttribute('style', style);

				document.body.style.overflow = 'hidden';
				document.body.style.overflowY = 'hidden';

				setTimeout(function () {
					style += '\n\t\t\t\t\t\t;top:   0px;\n\t\t\t\t\t\tleft:   0px;\n\t\t\t\t\t\twidth:  100%;\n\t\t\t\t\t\theight: 100%;\n\t\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\t\ttransition: ' + _this.leftDuration + 's ease-out;\n\t\t\t\t\t';

					_this.moving = true;

					element.classList.add('unpopped');

					element.classList.add('popped');
					element.classList.remove('unpopped');
					element.setAttribute('style', style);

					console.log(_this.leftDuration * 1000);
					setTimeout(function () {
						PopOutTag.popLevel();
						_this.bodyStyle = document.body.getAttribute('style');
						_this.bodyScroll = window.scrollY;
						console.log(_this.bodyScroll);
						document.body.setAttribute('style', 'height:0px;overflow:hidden;');
						window.scrollTo(0, 0);
						_this.moving = false;
						_Dom.Dom.mapTags(element, false, function (tag) {
							var event = new Event('cvPopped');

							tag.dispatchEvent(event);

							_this.scrollStyle = element.getAttribute('style');
						});
					}, _this.leftDuration * 1000);
				}, 1);

				_this.poppedOut = !_this.poppedOut;
			} else if (event.target.matches('.closeButton') && _this.poppedOut) {
				window.scrollTo(0, _this.previousScroll);
				setTimeout(function () {}, 1);

				var _style = _this.style + _this.unpoppedStyle + (';transition: ' + _this.leftDuration + 's; ease-in');

				console.log(_this.leftDuration);

				if (0 === PopOutTag.unpopLevel()) {
					document.body.setAttribute('style', _this.bodyStyle);
					document.body.setAttribute('style', '');

					window.scrollTo(0, _this.bodyScroll);
				}

				element.setAttribute('style', _style);

				_this.moving = true;

				setTimeout(function () {
					element.classList.add('unpopped');
					element.classList.remove('popped');
					// element.setAttribute('style', this.style);
				}, _this.leftDuration * 500);
				setTimeout(function () {
					element.setAttribute('style', _this.style);
					_this.moving = false;
					_Dom.Dom.mapTags(element, false, function (tag) {
						var event = new Event('cvUnpopped');

						tag.dispatchEvent(event);
					});
				}, _this.leftDuration * 1000);

				_this.poppedOut = !_this.poppedOut;
			}
		};

		element.addEventListener('click', _this.clickListener);

		_this.cleanup.push(function (element) {
			return function () {
				element.removeEventListener('click', _this.clickListener);
			};
		}(element));
		return _this;
	}

	_createClass(PopOutTag, [{
		key: 'pause',
		value: function pause() {
			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'pause', this).call(this);
			document.body.setAttribute('style', this.bodyStyle);
			document.body.setAttribute('style', '');
			window.scrollTo(0, this.bodyScroll);

			console.log('!!!');
		}
	}], [{
		key: 'popLevel',
		value: function popLevel() {
			if (!this.level) {
				this.level = 0;
			}

			this.level++;

			return this.level;
		}
	}, {
		key: 'unpopLevel',
		value: function unpopLevel() {
			if (!this.level) {
				this.level = 0;
			}

			this.level--;

			return this.level;
		}
	}]);

	return PopOutTag;
}(_Tag2.Tag);