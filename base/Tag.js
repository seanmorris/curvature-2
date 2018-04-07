'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Tag = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tag = exports.Tag = function () {
	function Tag(element, parent, ref, index) {
		_classCallCheck(this, Tag);

		this.element = _Bindable.Bindable.makeBindable(element);
		this.parent = parent;
		this.ref = ref;
		this.index = index;

		this.proxy = _Bindable.Bindable.makeBindable(this);
		this.cleanup = [];

		return this.proxy;
	}

	_createClass(Tag, [{
		key: 'remove',
		value: function remove() {
			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			_Bindable.Bindable.clearBindings(this);
		}
	}]);

	return Tag;
}();