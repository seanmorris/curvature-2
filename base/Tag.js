'use strict';

Object.defineProperty(exports, "__esModule", {
		value: true
});
exports.Tag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = exports.Tag = function () {
		function Tag(element, parent, ref, index, direct) {
				_classCallCheck(this, Tag);

				this.element = _Bindable.Bindable.makeBindable(element);
				this.parent = parent;
				this.direct = direct;
				this.ref = ref;
				this.index = index;

				this.proxy = _Bindable.Bindable.makeBindable(this);
				this.cleanup = [];

				// this.detachListener = (event) => {
				// 	return;

				// 	if(event.target != this.element)
				// 	{
				// 		return;
				// 	}
				// 	if(event.path[event.path.length -1] !== window)
				// 	{
				// 		return;
				// 	}

				// 	this.element.removeEventListener('cvDomDetached', this.detachListener);

				// 	this.remove();
				// };

				// this.element.addEventListener('cvDomDetached', this.detachListener);

				return this.proxy;
		}

		_createClass(Tag, [{
				key: 'remove',
				value: function remove() {
						_Bindable.Bindable.clearBindings(this);

						var cleanup = void 0;

						while (cleanup = this.cleanup.shift()) {
								cleanup();
						}

						this.clear();

						if (!this.element) {
								return;
						}

						var detachEvent = new Event('cvDomDetached');

						this.element.dispatchEvent(detachEvent);
						this.element.remove();

						this.element = this.ref = this.parent = null;
				}
		}, {
				key: 'clear',
				value: function clear() {
						if (!this.element) {
								return;
						}

						var detachEvent = new Event('cvDomDetached');

						while (this.element.firstChild) {
								this.element.firstChild.dispatchEvent(detachEvent);
								this.element.removeChild(this.element.firstChild);
						}
				}
		}, {
				key: 'pause',
				value: function pause() {
						var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
				}
		}]);

		return Tag;
}();