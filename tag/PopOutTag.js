'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PopOutTag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _Bindable = require('../base/Bindable');

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

		_this.element.classList.add('unpopped');

		_this.scrollStyle;

		_this.rect;
		_this.clickListener = function (event) {
			var leftDuration = 0.333;

			if (!_this.rect) {
				_this.rect = _this.element.getBoundingClientRect();
			}

			if (!_this.poppedOut) {
				_this.distance = Math.sqrt(Math.pow(_this.rect.top, 2) + Math.pow(_this.rect.left, 2));

				if (!_this.distance) {
					_this.distance = 200;
				}

				if (!_this.leftDuration) {
					_this.leftDuration = (1 - 1 / _this.distance) / 4;
				}
			}

			if (!_this.element.contains(event.target)) {
				return;
			}

			event.stopPropagation();
			event.preventDefault();

			if (_this.moving) {
				return;
			}

			if (!_this.poppedOut) {
				_this.pop();
			} else if (event.target.matches('.closeButton') && _this.poppedOut) {
				_this.unpop();
			}
		};

		if (!_this.element.___clickListener___) {
			Object.defineProperty(_this.element, '___scrollListeners___', {
				enumerable: false,
				writable: true
			});

			_this.element.___clickListener___ = _this.clickListener;

			_this.element.addEventListener('click', element.___clickListener___);

			_this.cleanup.push(function (element) {
				return function () {
					element.removeEventListener('click', element.___clickListener___);
				};
			}(element));
		}
		return _this;
	}

	_createClass(PopOutTag, [{
		key: 'pause',
		value: function pause() {
			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'pause', this).call(this);
			document.body.setAttribute('style', this.bodyStyle);
			document.body.setAttribute('style', '');
			window.scrollTo(0, this.bodyScroll);
		}
	}, {
		key: 'pop',
		value: function pop() {
			var _this2 = this;

			PopOutTag.popLevel();

			if (!this.rect) {
				this.rect = this.element.getBoundingClientRect();
			}

			this.previousScroll = window.scrollY;

			this.unpoppedStyle = '\n\t\t\t;position:  fixed;\n\t\t\tleft:       ' + this.rect.x + 'px;\n\t\t\ttop:        ' + this.rect.y + 'px;\n\t\t\twidth:      ' + this.rect.width + 'px;\n\t\t\theight:     ' + this.rect.height + 'px;\n\t\t\tz-index:    99999;\n\n\t\t\toverflow: hidden;\n\t\t';

			var style = this.style + this.unpoppedStyle;

			this.element.setAttribute('style', style);

			document.body.style.overflow = 'hidden';
			document.body.style.overflowY = 'hidden';

			setTimeout(function () {
				style += '\n\t\t\t\t;top:   0px;\n\t\t\t\tleft:   0px;\n\t\t\t\twidth:  100%;\n\t\t\t\theight: 100%;\n\t\t\t\toverflow-y: auto;\n\t\t\t\ttransition: ' + _this2.leftDuration + 's ease-out;\n\t\t\t';

				_this2.moving = true;

				_this2.element.classList.add('unpopped');

				_this2.element.classList.add('popped');
				_this2.element.classList.remove('unpopped');
				_this2.element.setAttribute('style', style);

				setTimeout(function () {
					if (!_this2.element) {
						return;
					}
					_this2.bodyStyle = document.body.getAttribute('style');
					_this2.bodyScroll = window.scrollY;
					document.body.setAttribute('style', 'height:0px;overflow:hidden;');
					window.scrollTo(0, 0);
					_this2.moving = false;
					_Dom.Dom.mapTags(_this2.element, false, function (tag) {
						var event = new CustomEvent('cvPopped');

						tag.dispatchEvent(event);

						_this2.scrollStyle = _this2.element.getAttribute('style');
					});
					var event = new CustomEvent('cvPop', {
						bubbles: true,
						detail: {
							tag: _this2,
							view: _this2.parent,
							publicId: _this2.parent.args.publicId
						}
					});
					_this2.element.dispatchEvent(event);
				}, _this2.leftDuration * 1000);
			}, 1);

			this.poppedOut = true;
		}
	}, {
		key: 'unpop',
		value: function unpop() {
			var _this3 = this;

			PopOutTag.unpopLevel();

			if (!this.rect) {
				this.rect = this.element.getBoundingClientRect();
			}

			window.scrollTo(0, this.previousScroll);

			var style = this.style + this.unpoppedStyle + (';transition: ' + this.leftDuration + 's; ease-in');

			document.body.setAttribute('style', this.bodyStyle);

			console.log(PopOutTag.level);

			if (PopOutTag.level == 0) {
				document.body.setAttribute('style', '');
			}

			window.scrollTo(0, this.bodyScroll);

			this.element.setAttribute('style', style);

			this.moving = true;

			setTimeout(function () {
				if (!_this3.element) {
					return;
				}
				_this3.element.classList.add('unpopped');
				_this3.element.classList.remove('popped');
				// element.setAttribute('style', this.style);
			}, this.leftDuration * 500);
			setTimeout(function () {
				if (!_this3.element) {
					return;
				}
				_this3.element.setAttribute('style', _this3.style);
				_this3.moving = false;
				_Dom.Dom.mapTags(_this3.element, false, function (tag) {
					var event = new CustomEvent('cvUnpopped');

					tag.dispatchEvent(event);
				});
				var event = new CustomEvent('cvUnpop', {
					bubbles: true,
					detail: {
						tag: _this3,
						view: _this3.parent,
						publicId: _this3.parent.args.publicId
					}
				});
				_this3.element.dispatchEvent(event);
			}, this.leftDuration * 1000);

			this.poppedOut = false;
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

			if (this.level < 0) {
				this.level = 0;
			}

			return this.level;
		}
	}]);

	return PopOutTag;
}(_Tag2.Tag);