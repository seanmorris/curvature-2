'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bag = exports.Bag = function () {
	function Bag(changeCallback) {
		_classCallCheck(this, Bag);

		this.meta = Symbol('meta');
		this.content = {};
		this._items = false;

		this.changeCallback = changeCallback;
	}

	_createClass(Bag, [{
		key: 'add',
		value: function add(item) {
			if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) instanceof Object) {
				throw new Error('Only objects may be added/removed from Bags.');
			}

			if (!item[this.meta]) {
				item[this.meta] = Symbol('bagId');
			}

			this.content[item[this.meta]] = item;

			if (this.changeCallback) {
				this.changeCallback(this.content[item[this.meta]], this.meta, 1);
			}
		}
	}, {
		key: 'remove',
		value: function remove(item) {
			if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) !== 'object') {
				throw new Error('Only objects may be added/removed from Bags.');
			}

			if (!item[this.meta] || !this.content[item[this.meta]]) {
				if (this.changeCallback) {
					this.changeCallback(undefined, this.meta, 0);
				}
				return false;
			}

			var removed = this.content[item[this.meta]];

			delete this.content[item[this.meta]];

			if (this.changeCallback) {
				this.changeCallback(removed, this.meta, -1);
			}
		}
	}, {
		key: 'id',
		value: function id(item) {
			return item[this.meta];
		}
	}, {
		key: 'get',
		value: function get(key) {
			return this.content[key];
		}
	}, {
		key: 'keys',
		value: function keys() {
			return Object.getOwnPropertySymbols(this.content).slice();
		}
	}, {
		key: 'items',
		value: function items() {
			var _this = this;

			return this.keys().map(function (key) {
				return _this.get(key);
			}).slice();

			var newItems = this.keys().map(function (key) {
				return _this.get(key);
			}).slice();

			if (!this._items) {
				this._items = [];
			}

			var add = [];
			var remove = [];

			for (var i in this.items) {
				console.log('R', newItems.indexOf(this.items[i]));

				if (newItems.indexOf(this.items[i]) < 0) {
					remove.push(i);
				}
			}

			remove.sort();
			remove.reverse();

			for (var _i in newItems) {
				console.log('A', this._items.indexOf(newItems[_i]));

				if (this._items.indexOf(newItems[_i]) < 0) {
					add.push(_i);
				}
			}

			console.log(add, remove);

			for (var _i2 in remove) {
				this._items.splice(remove[_i2], 1);
			}

			for (var _i3 in add) {
				this._items.push(newItems[add[_i3]]);
			}

			console.log(newItems, this._items);

			return this._items;
		}
	}]);

	return Bag;
}();