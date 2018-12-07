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

			console.log(t.___executing___, t.___stack___.length);

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
			console.trace();

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
					if (views[j] && this.args.value[_i] === views[j].args[this.subProperty]
					// && !(this.args.value[i] instanceof Object)
					) {
							// console.log(i, views[j].args._id);
							found = true;
							finalViews[_i] = views[j];
							finalViews[_i].args[this.keyProperty] = _i;
							delete views[j];
							break;
						}
				}

				if (!found) {
					var viewArgs = {};
					var view = finalViews[_i] = new _View.View(viewArgs);

					console.log(_i, view.args._id);

					finalViews[_i].template = this.template;
					finalViews[_i].parent = this.parent;
					finalViews[_i].viewList = this;

					finalViews[_i].args[this.keyProperty] = _i;
					finalViews[_i].args[this.subProperty] = this.args.value[_i];

					// this.cleanup.push(
					// 	this.args.value.bindTo(i, (v,k,t)=>{
					// 		viewArgs[ this.keyProperty ] = k;
					// 		// viewArgs[ this.subProperty ] = v;
					// 	})
					// );

					// this.cleanup.push(
					// 	viewArgs.bindTo(this.subProperty, (v,k)=>{
					// 		let index = viewArgs[ this.keyProperty ];
					// 		this.args.value[index] = v;
					// 	}
					// ));

					// this.cleanup.push(
					// 	this.args.subArgs.bindTo((v, k, t, d) => {
					// 		viewArgs[k] = v;
					// 	})
					// );

					viewArgs[this.subProperty] = this.args.value[_i];
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

			for (var _i3 in views) {
				if (views[_i3] !== finalViews[_i3]) {
					appendOnly = false;
				}
			}

			// console.log('==============');

			// console.log(finalViews, this.views);

			for (var _i4 in finalViews) {
				// console.log(
				// 	i
				// 	, finalViews[i]
				// 		? finalViews[i].args[ this.keyProperty ]
				// 		: null
				// 	, this.views[i]
				// 		? this.views[i].args[ this.keyProperty ]
				// 		: null
				// 	, finalViews[i] === this.views[i]
				// );

				if (finalViews[_i4] === views[_i4]) {
					continue;
				}

				if (_i4 == 0) {
					views.unshift(finalViews[_i4]);
					var subDoc = document.createRange().createContextualFragment('');
					finalViews[_i4].render(subDoc);
					this.tag.prepend(subDoc);
					continue;
				}

				if (views[_i4]) {
					views.splice(views[_i4].args[this.keyProperty], 1);
				}

				views.splice(_i4 + 1, 0, finalViews[_i4]);

				finalViews[_i4].render(this.tag, views[_i4 + 1] || null);
			}

			for (var _i5 in views) {
				views[_i5].args[this.keyProperty] = _i5;
			}

			this.views = finalViews;

			// if(1||!appendOnly)
			// {
			// 	while(this.tag.firstChild)
			// 	{
			// 		this.tag.removeChild(this.tag.firstChild);
			// 	}

			// 	for(let i in finalViews)
			// 	{
			// 		finalViews[i].render(subDoc);
			// 	}
			// }
			// else
			// {
			// 	let i = this.views.length || 0

			// 	while(finalViews[i])
			// 	{
			// 		finalViews[i].render(subDoc);
			// 		i++;
			// 	}
			// }

			// this.tag.appendChild(subDoc);
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