'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ViewList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewList = function () {
	function ViewList(template, subProperty, list, parent) {
		var _this = this;

		var keyProperty = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

		_classCallCheck(this, ViewList);

		this.args = _Bindable.Bindable.makeBindable({});
		this.args.value = _Bindable.Bindable.makeBindable(list || {});
		this.args.subArgs = _Bindable.Bindable.makeBindable({});
		this.views = [];
		this.cleanup = [];
		this.template = template;
		this.subProperty = subProperty;
		this.keyProperty = keyProperty;
		this.tag = null;
		this.paused = false;
		this.parent = parent;

		this.args.value.___before___.push(function (t) {
			if (t.___executing___ == 'bindTo') {
				return;
			}
			_this.paused = true;
		});

		this.args.value.___after___.push(function (t) {
			if (t.___executing___ == 'bindTo') {
				return;
			}

			_this.paused = t.___stack___.length > 1;

			_this.reRender();
		});

		var debind = this.args.value.bindTo(function (v, k, t, d) {

			if (_this.paused) {
				return;
			}

			if (d) {
				if (_this.views[k]) {
					_this.views[k].remove();
				}

				_this.views.splice(k, 1);

				for (var i in _this.views) {
					_this.views[i].args[_this.keyProperty] = i;
				}

				return;
			}

			if (!_this.views[k]) {
				_this.reRender();
			}
		}, { wait: 0 });

		this.cleanup.push(debind);
	}

	_createClass(ViewList, [{
		key: 'render',
		value: function render(tag) {
			for (var i in this.views) {
				this.views[i].render(tag);
			}

			this.tag = tag;
		}
	}, {
		key: 'reRender',
		value: function reRender() {
			var _this2 = this;

			if (this.paused || !this.tag) {
				return;
			}

			var views = [];

			for (var i in this.views) {
				views[i] = this.views[i];
			}

			var finalViews = [];

			for (var _i in this.args.value) {
				var found = false;

				for (var j in views) {
					if (views[j] && this.args.value[_i] === views[j].args[this.subProperty]) {
						found = true;
						finalViews[_i] = views[j];
						finalViews[_i].args[this.keyProperty] = _i;
						delete views[j];
						break;
					}
				}

				if (!found) {
					(function () {
						var viewArgs = {};
						var view = finalViews[_i] = new _View.View(viewArgs);

						finalViews[_i].template = _this2.template;
						finalViews[_i].parent = _this2.parent;
						finalViews[_i].viewList = _this2;

						finalViews[_i].args[_this2.keyProperty] = _i;
						finalViews[_i].args[_this2.subProperty] = _this2.args.value[_i];

						_this2.cleanup.push(_this2.args.value.bindTo(_i, function (v, k, t) {
							viewArgs[_this2.keyProperty] = k;
							viewArgs[_this2.subProperty] = v;
						}));

						_this2.cleanup.push(viewArgs.bindTo(_this2.subProperty, function (v, k) {
							var index = viewArgs[_this2.keyProperty];
							_this2.args.value[index] = v;
						}));

						_this2.cleanup.push(_this2.args.subArgs.bindTo(function (v, k, t, d) {
							viewArgs[k] = v;
						}));

						viewArgs[_this2.subProperty] = _this2.args.value[_i];
					})();
				}
			}

			for (var _i2 in views) {
				var _found = false;

				for (var _j in finalViews) {
					if (views[_i2] === finalViews[_j]) {
						_found = true;
						break;
					}
				}

				if (!_found) {
					views[_i2].remove();
				}
			}

			var appendOnly = true;

			for (var _i3 in this.views) {
				if (this.views[_i3] !== finalViews[_i3]) {
					appendOnly = false;
				}
			}

			for (var _i4 in finalViews) {
				if (finalViews[_i4] === this.views[_i4]) {
					continue;
				}

				views.splice(_i4 + 1, 0, finalViews[_i4]);

				finalViews[_i4].render(this.tag);
			}

			for (var _i5 in finalViews) {
				finalViews[_i5].args[this.keyProperty] = _i5;
			}

			this.views = finalViews;
		}
	}, {
		key: 'pause',
		value: function pause() {
			var _pause = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			for (var i in this.views) {
				this.views[i].pause(_pause);
			}
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.views) {
				this.views[i].remove();
			}

			var cleanup = void 0;

			while (this.cleanup.length) {
				cleanup = this.cleanup.pop();
				cleanup();
			}

			this.views = [];

			while (this.tag && this.tag.firstChild) {
				this.tag.removeChild(this.tag.firstChild);
			}

			_Bindable.Bindable.clearBindings(this.args.subArgs);
			_Bindable.Bindable.clearBindings(this.args);

			if (!this.args.value.isBound()) {
				_Bindable.Bindable.clearBindings(this.args.value);
			}
		}
	}]);

	return ViewList;
}();

exports.ViewList = ViewList;