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

	function PopOutTag(element, parent, ref, index, direct) {
		_classCallCheck(this, PopOutTag);

		var _this = _possibleConstructorReturn(this, (PopOutTag.__proto__ || Object.getPrototypeOf(PopOutTag)).call(this, element, parent, ref, index, direct));

		_this.poppedOut = false;
		_this.style = element.getAttribute('style');
		_this.moving = false;

		_this.hostSelector = _this.element.getAttribute('cv-pop-to');

		_this.element.removeAttribute('cv-pop-to');

		_this.leftDuration = 0;
		_this.topDuration = 0;
		_this.rightDuration = 0;
		_this.bottomDuration = 0;

		_this.verticalDuration = 0;
		_this.horizontalDuration = 0;

		_this.unpoppedStyle = '';
		_this.previousScroll = 0;

		_this.bodyStyle = '';
		_this.bodyScroll = 0;

		_this.element.classList.add('unpopped');

		_this.scrollStyle;

		_this.popTimeout = null;

		// this.element.addEventListener('cvDomDetached', this.detachListener);
		_this.rect;

		_this.clickListener = function (event) {
			_this.rect = _this.element.getBoundingClientRect();

			if (!_this.poppedOut) {
				_this.distance = Math.sqrt(Math.pow(_this.rect.top, 2) + Math.pow(_this.rect.left, 2));

				var cut = element.getAttribute('data-pop-speed') || 1750;

				var fromRight = window.innerWidth - _this.rect.right;
				var fromBottom = window.innerHeight - _this.rect.bottom;

				var horizontalAverage = (_this.rect.left + fromRight) / 2;
				var vericalAverage = (_this.rect.top + fromBottom) / 2;

				_this.horizontalDuration = horizontalAverage / cut;
				_this.verticalDuration = vericalAverage / cut;

				if (_this.horizontalDuration < 0.01) {
					_this.horizontalDuration = 0.01;
				}
				if (_this.verticalDuration < 0.01) {
					_this.verticalDuration = 0.01;
				}

				if (_this.horizontalDuration > 0.4) {
					_this.horizontalDuration = 0.4;
				}
				if (_this.verticalDuration > 0.4) {
					_this.verticalDuration = 0.4;
				}

				// console.log(this.horizontalDuration, this.verticalDuration);
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

		_this.escapeListener = function (event) {
			// console.log(event);
			if (event.key !== 'Escape') {
				return;
			}
			_this.unpop();
		};

		if (!_this.element.___clickListener___) {
			Object.defineProperty(_this.element, '___scrollListeners___', {
				enumerable: false,
				writable: true
			});

			_this.element.___clickListener___ = _this.clickListener;
			_this.element.___escapeListener___ = _this.escapeListener;

			_this.element.addEventListener('click', element.___clickListener___);
			window.addEventListener('keyup', element.___escapeListener___);

			_this.cleanup.push(function (element) {
				return function () {
					element.removeEventListener('click', element.___clickListener___);
					window.removeEventListener('keyup', element.___escapeListener___);
				};
			}(element));
		}
		return _this;
	}

	_createClass(PopOutTag, [{
		key: 'pause',
		value: function pause() {
			var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'pause', this).call(this, paused);

			if (paused) {
				document.body.setAttribute('style', this.bodyStyle);
				document.body.setAttribute('style', '');
			}
		}
	}, {
		key: 'pop',
		value: function pop() {
			var _this2 = this;

			PopOutTag.popLevel();

			this.previousScroll = window.scrollY;

			this.rect = this.element.getBoundingClientRect();
			this.style = this.element.getAttribute('style');

			var hostTag = this.element;

			// console.log(hostTag);

			while (hostTag.parentNode && !hostTag.matches(this.hostSelector)) {
				if (hostTag.parentNode == document) {
					break;
				}
				hostTag = hostTag.parentNode;
			}

			// console.log(hostTag);

			var hostRect = hostTag.getBoundingClientRect();

			window.requestAnimationFrame(function () {

				_this2.unpoppedStyle = '\n\t\t\t\t;position:  fixed;\n\t\t\t\tleft:       ' + _this2.rect.x + 'px;\n\t\t\t\ttop:        ' + _this2.rect.y + 'px;\n\t\t\t\twidth:      ' + _this2.rect.width + 'px;\n\t\t\t\theight:     ' + _this2.rect.height + 'px;\n\t\t\t\tz-index:    99999;\n\t\t\t\ttransition: width ' + _this2.horizontalDuration + 's  ease-out\n\t\t\t\t\t\t\t, top ' + _this2.verticalDuration + 's    ease-out\n\t\t\t\t\t\t\t, left ' + _this2.horizontalDuration + 's ease-out\n\t\t\t\t\t\t\t, height ' + _this2.verticalDuration + 's ease-out\n\t\t\t\t\t\t\t, all ' + _this2.horizontalDuration + 's  ease-out;\n\t\t\t\toverflow: hidden;\n\t\t\t';

				var style = _this2.style + _this2.unpoppedStyle;

				_this2.element.setAttribute('style', style);

				window.requestAnimationFrame(function () {
					style += '\n\t\t\t\t\t;left:      ' + hostRect.x + 'px;\n\t\t\t\t\ttop:        ' + hostRect.y + 'px;\n\t\t\t\t\twidth:      ' + hostRect.width + 'px;\n\t\t\t\t\theight:     ' + hostRect.height + 'px;\n\t\t\t\t\toverflow-y: auto;\n\t\t\t\t\ttransition: width ' + _this2.horizontalDuration + 's ease-out\n\t\t\t\t\t\t, top ' + _this2.verticalDuration + 's           ease-out\n\t\t\t\t\t\t, left ' + _this2.horizontalDuration + 's        ease-out\n\t\t\t\t\t\t, height ' + _this2.verticalDuration + 's        ease-out\n\t\t\t\t\t\t, all ' + _this2.horizontalDuration + 's         ease-out;\n\t\t\t\t';

					_this2.moving = true;

					_this2.element.setAttribute('style', style);
					_this2.element.classList.add('popped');
					_this2.element.classList.remove('unpopped');

					_this2.popTimeout = setTimeout(function () {
						if (!_this2.element) {
							return;
						}
						_this2.bodyStyle = document.body.getAttribute('style');

						document.body.setAttribute('style', 'height:100%;overflow:hidden;');

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
					}, _this2.horizontalDuration * 1000);
				});

				_this2.poppedOut = true;
			});
		}
	}, {
		key: 'unpop',
		value: function unpop() {
			var _this3 = this;

			this.element.classList.add('unpopping');

			if (this.popTimeout) {
				clearTimeout(this.popTimeout);
			}

			if (PopOutTag.level == 0) {
				document.body.setAttribute('style', '');
			} else {
				document.body.setAttribute('style', this.bodyStyle || '');
			}

			PopOutTag.unpopLevel();

			if (!this.rect) {
				this.rect = this.element.getBoundingClientRect();
			}

			window.scrollTo(0, this.previousScroll);

			var style = this.style + this.unpoppedStyle + (';transition: width ' + this.horizontalDuration + 's ease-in\n\t\t\t\t\t, height ' + this.verticalDuration + 's        ease-in\n\t\t\t\t\t, all ' + this.horizontalDuration + 's         ease-in;');

			this.element.setAttribute('style', style);

			this.moving = true;

			setTimeout(function () {
				if (!_this3.element) {
					return;
				}
				_this3.element.classList.remove('popped');
			}, this.horizontalDuration * 1000);
			setTimeout(function () {
				_this3.element.classList.add('unpopped');
				_this3.element.classList.remove('unpopping');
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
			}, this.horizontalDuration * 1000);

			this.poppedOut = false;
		}
	}, {
		key: 'remove',
		value: function remove() {
			document.body.setAttribute('style', this.bodyStyle);
			_get(PopOutTag.prototype.__proto__ || Object.getPrototypeOf(PopOutTag.prototype), 'remove', this).call(this);
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