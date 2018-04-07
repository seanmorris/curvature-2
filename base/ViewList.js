'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.ViewList = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _View = require('./View');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewList = exports.ViewList = function () {
	function ViewList(template, subProperty, list) {
		var _this = this;

		var keyProperty = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

		_classCallCheck(this, ViewList);

		this.args = _Bindable.Bindable.makeBindable({});
		this.args.value = _Bindable.Bindable.makeBindable(list || {});
		this.args.subArgs = _Bindable.Bindable.makeBindable({});
		this.views = {};
		this.template = template;
		this.subProperty = subProperty;
		this.keyProperty = keyProperty;
		this.tag = null;
		this.paused = false;

		this.args.value.before.push(function (t) {
			// console.log(t.executing);
			if (t.executing == 'bindTo') {
				return;
			}
			_this.paused = true;
		});

		this.args.value.after.push(function (t) {
			if (_this.paused) {
				// console.log(t.executing);
				_this.reRender();
			}
			_this.paused = false;
		});

		// console.log(this.args);

		this.args.value.bindTo(function (v, k, t, d) {

			if (_this.paused) {
				return;
			}

			if (d) {
				_this.views[k].remove();

				delete _this.views[k];
				// console.log(`Deleting ${k}`, v, this.views);

				return;
			}

			// console.log(`Setting ${k}`, v, this.views);

			if (!_this.views[k]) {
				var view = new _View.View();

				_this.views[k] = view;

				_this.views[k].template = _this.template;

				_this.views[k].parent = _this.parent;
				_this.views[k].viewList = _this;

				_this.args.subArgs.bindTo(function (v, k, t, d) {
					view.args[k] = v;
				});

				_this.views[k].args[_this.subProperty] = v;

				if (_this.keyProperty) {
					_this.views[k].args[_this.keyProperty] = k;
				}

				t[k] = v;

				_this.reRender();
			}

			_this.views[k].args[_this.subProperty] = v;
		});
	}

	_createClass(ViewList, [{
		key: 'render',
		value: function render(tag) {
			for (var i in this.views) {
				this.views[i].render(tag);
			}

			this.tag = tag;

			// console.log(tag);
		}
	}, {
		key: 'reRender',
		value: function reRender() {
			var _this2 = this;

			// console.log('rerender');
			if (!this.tag) {
				return;
			}

			var views = [];

			for (var i in this.views) {
				views[i] = this.views[i];
			}

			var finalViews = [];

			var _loop = function _loop(_i) {
				var found = false;
				for (var j in views) {
					if (views[j] && _this2.args.value[_i] === views[j].args[_this2.subProperty]) {
						found = true;
						finalViews[_i] = views[j];
						delete views[j];
						break;
					}
				}
				if (!found) {
					var viewArgs = {};
					viewArgs[_this2.subProperty] = _this2.args.value[_i];
					finalViews[_i] = new _View.View(viewArgs);

					finalViews[_i].template = _this2.template;
					finalViews[_i].parent = _this2.parent;
					finalViews[_i].viewList = _this2;

					finalViews[_i].args[_this2.keyProperty] = _i;

					_this2.args.subArgs.bindTo(function (v, k, t, d) {
						finalViews[_i].args[k] = v;
					});
				}
			};

			for (var _i in this.args.value) {
				_loop(_i);
			}

			var appendOnly = true;

			for (var _i2 in this.views) {
				if (this.views[_i2] !== finalViews[_i2]) {
					appendOnly = false;
				}
			}

			if (!appendOnly) {
				while (this.tag.firstChild) {
					this.tag.removeChild(this.tag.firstChild);
				}

				for (var _i3 in finalViews) {
					finalViews[_i3].render(this.tag);
				}
			} else {
				var _i4 = this.views.length || 0;

				while (finalViews[_i4]) {
					finalViews[_i4].render(this.tag);
					_i4++;
				}
			}

			this.views = finalViews;
		}
	}, {
		key: 'remove',
		value: function remove() {
			for (var i in this.views) {
				this.views[i].remove();
			}

			this.views = [];

			while (this.tag.firstChild) {
				this.tag.removeChild(this.tag.firstChild);
			}
		}
	}]);

	return ViewList;
}();