'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Theme = exports.Theme = function () {
	function Theme() {
		_classCallCheck(this, Theme);

		this.views = {
			'SeanMorris\\TheWhtRbt\\Location': {
				single: 'twr9/LocationPreview',
				list: 'twr9/LocationList'
			},
			'SeanMorris\\TheWhtRbt\\Image': {
				single: 'DetailView',
				list: 'DetailListView'
			}
		};
	}

	_createClass(Theme, [{
		key: 'resolve',
		value: function resolve(model) {
			var modelClass = void 0;

			if (Array.isArray(model)) {
				for (var i in model) {
					var _modelClass = model[i].class || model[i].content_type;

					if (modelClass && modelClass !== _modelClass) {
						throw new Error('Model list mismatch!');
					} else {
						modelClass = _modelClass;
					}
				}

				if (this.views[modelClass]) {
					if (this.views[modelClass].list) {
						return this.views[modelClass].list;
					}

					return this.views[modelClass];
				}

				return 'DetailListView';
			} else if (model) {
				modelClass = model.class || model.content_type;

				if (this.views[modelClass]) {
					if (this.views[modelClass].single) {
						return this.views[modelClass].single;
					}

					return this.views[modelClass];
				}

				return 'DetailView';
			}

			return false;
		}
	}]);

	return Theme;
}();