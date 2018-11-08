'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Model = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Cache = require('./Cache');

var _Bindable = require('./Bindable');

var _Repository = require('./Repository');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Model = exports.Model = function () {
	function Model(repository) {
		_classCallCheck(this, Model);

		this.repository = repository;
	}

	_createClass(Model, [{
		key: 'consume',
		value: function consume(values) {
			for (var property in values) {
				var value = values[property];

				if (values[property] instanceof Object && values[property].class && values[property].publicId) {
					var cacheKey = values[property].class + '::' + values[property].publidId;

					var cached = _Cache.Cache.load(cacheKey, false, 'model-type-repo');

					value = _Bindable.Bindable.makeBindable(new Model(this.repository));

					if (cached) {
						value = cached;
					}

					value.consume(values[property]);

					_Cache.Cache.store(cacheKey, value, 0, 'model-type-repo');
				}

				this[property] = value;
			}
		}
	}]);

	return Model;
}();