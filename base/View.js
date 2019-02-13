'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.View = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Bindable = require('./Bindable');

var _ViewList = require('./ViewList');

var _Router = require('./Router');

var _Cookie = require('./Cookie');

var _Dom = require('./Dom');

var _Tag = require('./Tag');

var _RuleSet = require('./RuleSet');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = exports.View = function () {
	function View() {
		var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, View);

		Object.defineProperty(this, '___VIEW___', {
			enumerable: false,
			writable: true
		});

		this.___VIEW___ = View;

		this.args = _Bindable.Bindable.makeBindable(args);
		this._id = this.uuid();
		this.args._id = this._id;
		this.template = '';
		this.document = '';

		this.firstNode = null;
		this.lastNode = null;
		this.nodes = null;

		this.cleanup = [];

		this.attach = [];
		this.detach = [];

		this.eventCleanup = [];

		this.parent = null;
		this.viewList = null;
		this.viewLists = {};

		this.withViews = {};

		this.tags = {};

		this.intervals = [];
		this.timeouts = [];
		this.frames = [];

		this.ruleSet = new _RuleSet.RuleSet();
		this.preRuleSet = new _RuleSet.RuleSet();
		this.subBindings = {};

		this.removed = false;
		this.preserve = false;

		this.interpolateRegex = /(\[\[((?:\$)?[\w\.]+)\]\])/g;
	}

	_createClass(View, [{
		key: 'onFrame',
		value: function onFrame(callback) {
			var c = function c(timestamp) {
				callback(timestamp);
				window.requestAnimationFrame(c);
			};

			c();
		}
	}, {
		key: 'onTimeout',
		value: function onTimeout(time, callback) {
			var _this = this;

			var wrappedCallback = function wrappedCallback() {
				_this.timeouts[index].fired = true;
				_this.timeouts[index].callback = null;
				callback();
			};
			var timeout = setTimeout(wrappedCallback, time);
			var index = this.timeouts.length;

			this.timeouts.push({
				timeout: timeout,
				callback: wrappedCallback,
				time: time,
				fired: false,
				created: new Date().getTime(),
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearTimeout',
		value: function clearTimeout(timeout) {
			for (var i in this.timeouts) {
				if (timeout === this.timeouts[i].timeout) {
					clearInterval(this.timeouts[i].timeout);

					delete this.timeouts[i];
				}
			}
		}
	}, {
		key: 'onInterval',
		value: function onInterval(time, callback) {
			var timeout = setInterval(callback, time);

			this.intervals.push({
				timeout: timeout,
				callback: callback,
				time: time,
				paused: false
			});

			return timeout;
		}
	}, {
		key: 'clearInterval',
		value: function (_clearInterval) {
			function clearInterval(_x) {
				return _clearInterval.apply(this, arguments);
			}

			clearInterval.toString = function () {
				return _clearInterval.toString();
			};

			return clearInterval;
		}(function (timeout) {
			for (var i in this.intervals) {
				if (timeout === this.intervals[i].timeout) {
					clearInterval(this.intervals[i].timeout);

					delete this.intervals[i];
				}
			}
		})
	}, {
		key: 'pause',
		value: function pause() {
			var paused = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

			if (paused === undefined) {
				this.paused = !this.paused;
			}

			this.paused = paused;

			if (this.paused) {
				for (var i in this.timeouts) {
					if (this.timeouts[i].fired) {
						delete this.timeouts[i];
						continue;
					}

					clearTimeout(this.timeouts[i].timeout);
				}

				for (var _i in this.intervals) {
					clearInterval(this.intervals[_i].timeout);
				}
			} else {
				for (var _i2 in this.timeouts) {
					if (!this.timeouts[_i2].timeout.paused) {
						continue;
					}

					if (this.timeouts[_i2].fired) {
						delete this.timeouts[_i2];
						continue;
					}

					this.timeouts[_i2].timeout = setTimeout(this.timeouts[_i2].callback, this.timeouts[_i2].time);
				}

				for (var _i3 in this.intervals) {
					if (!this.intervals[_i3].timeout.paused) {
						continue;
					}

					this.intervals[_i3].timeout.paused = false;

					this.intervals[_i3].timeout = setInterval(this.intervals[_i3].callback, this.intervals[_i3].time);
				}
			}

			for (var _i4 in this.viewLists) {
				if (!this.viewLists[_i4]) {
					return;
				}

				this.viewLists[_i4].pause(!!paused);
			}

			for (var _i5 in this.tags) {
				if (Array.isArray(this.tags[_i5])) {
					for (var j in this.tags[_i5]) {
						this.tags[_i5][j].pause(!!paused);
					}
					continue;
				}
				this.tags[_i5].pause(!!paused);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
			var insertPoint = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

			if (insertPoint instanceof View) {
				insertPoint = insertPoint.firstNode;
			}

			if (this.nodes) {
				for (var i in this.detach) {
					this.detach[i]();
				}

				var _loop = function _loop(_i6) {
					var detachEvent = new Event('cvDomDetached', { bubbles: true, target: _this2.nodes[_i6] });
					var attachEvent = new Event('cvDomAttached', { bubbles: true, target: _this2.nodes[_i6] });

					_this2.nodes[_i6].dispatchEvent(detachEvent);

					_Dom.Dom.mapTags(_this2.nodes[_i6], false, function (node) {
						node.dispatchEvent(detachEvent);
					});

					if (parentNode) {
						if (insertPoint) {
							parentNode.insertBefore(_this2.nodes[_i6], insertPoint);
						} else {
							parentNode.appendChild(_this2.nodes[_i6]);
						}
					}

					_Dom.Dom.mapTags(_this2.nodes[_i6], false, function (node) {
						node.dispatchEvent(attachEvent);
					});

					_this2.nodes[_i6].dispatchEvent(attachEvent);
				};

				for (var _i6 in this.nodes) {
					_loop(_i6);
				}

				for (var _i7 in this.attach) {
					this.attach[_i7]();
				}

				return;
			}

			var subDoc = void 0;

			if (this.template == document) {
				subDoc = this.template;
			} else if (this.document) {
				subDoc = this.document;
			} else {
				subDoc = document.createRange().createContextualFragment(this.template);

				this.document = subDoc;
			}

			this.preRuleSet.apply(subDoc, this);

			_Dom.Dom.mapTags(subDoc, false, function (tag) {
				if (tag.matches) {
					tag.matches('[cv-each]') && _this2.mapEachTags(tag);

					tag.matches('[cv-with]') && _this2.mapWithTags(tag);

					tag.matches('[cv-prerender]') && _this2.mapPrendererTags(tag);

					tag.matches('[cv-link]') && _this2.mapLinkTags(tag);

					tag.matches('[cv-bind]') && _this2.mapBindTags(tag);

					tag.matches('[cv-attr]') && _this2.mapAttrTags(tag);

					_this2.mapInterpolatableTags(tag);

					tag.matches('[cv-expand]') && _this2.mapExpandableTags(tag);

					tag.matches('[cv-if]') && _this2.mapIfTags(tag);

					tag.matches('[cv-ref]') && _this2.mapRefTags(tag);

					tag.matches('[cv-on]') && _this2.mapOnTags(tag);
				} else {
					_this2.mapInterpolatableTags(tag);
				}
			});

			this.ruleSet.apply(subDoc, this);

			this.nodes = [];

			if (window['devmode'] === true) {
				this.firstNode = document.createComment('Template ' + this._id + ' Start');
			} else {
				this.firstNode = document.createTextNode('');
			}

			this.nodes.push(this.firstNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.firstNode, insertPoint);
				} else {
					parentNode.appendChild(this.firstNode);
				}
			}

			var _loop2 = function _loop2() {
				var newNode = subDoc.firstChild;
				var attachEvent = new Event('cvDomAttached', { bubbles: true, target: newNode });

				_this2.nodes.push(newNode);

				if (parentNode) {
					if (insertPoint) {
						parentNode.insertBefore(newNode, insertPoint);
					} else {
						parentNode.appendChild(newNode);
					}
				}

				_Dom.Dom.mapTags(newNode, false, function (node) {
					node.dispatchEvent(attachEvent);
				});

				newNode.dispatchEvent(attachEvent);
			};

			while (subDoc.firstChild) {
				_loop2();
			}

			if (window['devmode'] === true) {
				this.lastNode = document.createComment('Template ' + this._id + ' End');
			} else {
				this.lastNode = document.createTextNode('');
			}

			this.nodes.push(this.lastNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.lastNode, insertPoint);
				} else {
					parentNode.appendChild(this.lastNode);
				}
			}

			for (var _i8 in this.attach) {
				this.attach[_i8]();
			}

			this.postRender(parentNode);

			// return this.nodes;
		}
	}, {
		key: 'mapExpandableTags',
		value: function mapExpandableTags(tag) {
			var _this3 = this;

			var expandProperty = tag.getAttribute('cv-expand');
			var expandArg = _Bindable.Bindable.makeBindable(this.args[expandProperty] || {});

			tag.removeAttribute('cv-expand');

			var _loop3 = function _loop3(i) {
				if (i == 'name' || i == 'type') {
					return 'continue';
				}

				var debind = expandArg.bindTo(i, function (tag, i) {
					return function (v) {
						tag.setAttribute(i, v);
					};
				}(tag, i));

				_this3.cleanup.push(function () {
					debind();
					if (expandArg.isBound()) {
						_Bindable.Bindable.clearBindings(expandArg);
					}
				});
			};

			for (var i in expandArg) {
				var _ret3 = _loop3(i);

				if (_ret3 === 'continue') continue;
			}
		}
	}, {
		key: 'mapAttrTags',
		value: function mapAttrTags(tag) {
			var _this4 = this;

			var attrProperty = tag.getAttribute('cv-attr');

			tag.removeAttribute('cv-attr');

			var pairs = attrProperty.split(',');
			var attrs = pairs.map(function (p) {
				return p.split(':');
			});

			var _loop4 = function _loop4(i) {
				var proxy = _this4.args;
				var bindProperty = attrs[i][1];
				var property = bindProperty;

				if (bindProperty.match(/\./)) {
					var _Bindable$resolve = _Bindable.Bindable.resolve(_this4.args, bindProperty, true);

					var _Bindable$resolve2 = _slicedToArray(_Bindable$resolve, 2);

					proxy = _Bindable$resolve2[0];
					property = _Bindable$resolve2[1];
				}

				if (proxy[attrs[i][1]]) {
					tag.setAttribute(attrs[i][0], proxy[attrs[i][1]]);
				}

				var attrib = attrs[i][0];

				_this4.cleanup.push(proxy.bindTo(property, function (v) {
					if (v == null) {
						tag.setAttribute(attrib, '');
						return;
					}
					tag.setAttribute(attrib, v);
				}));
			};

			for (var i in attrs) {
				_loop4(i);
			}
		}
	}, {
		key: 'mapInterpolatableTags',
		value: function mapInterpolatableTags(tag) {
			var _this5 = this;

			var regex = this.interpolateRegex;

			if (tag.nodeType == Node.TEXT_NODE) {
				var original = tag.nodeValue;

				if (!this.interpolatable(original)) {
					return;
				}

				var header = 0;
				var match = void 0;

				var _loop5 = function _loop5() {
					var bindProperty = match[2];

					var unsafeHtml = false;

					if (bindProperty.substr(0, 1) === '$') {
						unsafeHtml = true;
						bindProperty = bindProperty.substr(1);
					}

					if (bindProperty.substr(0, 3) === '000') {
						expand = true;
						bindProperty = bindProperty.substr(3);

						return 'continue';
					}

					var staticPrefix = original.substring(header, match.index);

					header = match.index + match[1].length;

					var staticNode = document.createTextNode(staticPrefix);

					tag.parentNode.insertBefore(staticNode, tag);

					var dynamicNode = void 0;

					if (unsafeHtml) {
						dynamicNode = document.createElement('div');
					} else {
						dynamicNode = document.createTextNode('');
					}

					var proxy = _this5.args;
					var property = bindProperty;

					if (bindProperty.match(/\./)) {
						var _Bindable$resolve3 = _Bindable.Bindable.resolve(_this5.args, bindProperty, true);

						var _Bindable$resolve4 = _slicedToArray(_Bindable$resolve3, 2);

						proxy = _Bindable$resolve4[0];
						property = _Bindable$resolve4[1];
					}

					tag.parentNode.insertBefore(dynamicNode, tag);

					var debind = proxy.bindTo(property, function (dynamicNode, unsafeHtml) {
						return function (v, k, t) {
							if (t[k] instanceof View && t[k] !== v) {
								if (!t[k].preserve) {
									t[k].remove();
								}
							}

							dynamicNode.nodeValue = '';

							if (v instanceof View) {
								v.render(tag.parentNode, dynamicNode);

								_this5.cleanup.push(function () {
									if (!v.preserve) {
										v.remove();
									}
								});
							} else {
								if (v instanceof Object && v.__toString instanceof Function) {
									v = v.__toString();
								}

								if (unsafeHtml) {
									dynamicNode.innerHTML = v;
								} else {
									dynamicNode.nodeValue = v;
								}
							}
						};
					}(dynamicNode, unsafeHtml));

					_this5.cleanup.push(function () {
						debind();
						if (!proxy.isBound()) {
							_Bindable.Bindable.clearBindings(proxy);
						}
					});
				};

				while (match = regex.exec(original)) {
					var _ret5 = _loop5();

					if (_ret5 === 'continue') continue;
				}

				var staticSuffix = original.substring(header);

				var staticNode = document.createTextNode(staticSuffix);

				tag.parentNode.insertBefore(staticNode, tag);

				tag.nodeValue = '';
			}

			if (tag.nodeType == Node.ELEMENT_NODE) {
				var _loop6 = function _loop6(i) {
					if (!_this5.interpolatable(tag.attributes[i].value)) {
						return 'continue';
					}

					var header = 0;
					var match = void 0;
					var original = tag.attributes[i].value;
					var attribute = tag.attributes[i];

					var bindProperties = {};
					var segments = [];

					while (match = regex.exec(original)) {
						segments.push(original.substring(header, match.index));

						if (!bindProperties[match[2]]) {
							bindProperties[match[2]] = [];
						}

						bindProperties[match[2]].push(segments.length);

						segments.push(match[1]);

						header = match.index + match[1].length;
					}

					segments.push(original.substring(header));

					var _loop7 = function _loop7(j) {
						var proxy = _this5.args;
						var property = j;

						if (j.match(/\./)) {
							var _Bindable$resolve5 = _Bindable.Bindable.resolve(_this5.args, j, true);

							var _Bindable$resolve6 = _slicedToArray(_Bindable$resolve5, 2);

							proxy = _Bindable$resolve6[0];
							property = _Bindable$resolve6[1];
						}

						var longProperty = j;

						var debind = proxy.bindTo(property, function (v, k, t, d) {
							for (var _i9 in bindProperties) {
								for (var _j in bindProperties[longProperty]) {
									segments[bindProperties[longProperty][_j]] = t[_i9];

									if (k === property) {
										segments[bindProperties[longProperty][_j]] = v;
									}
								}
							}

							tag.setAttribute(attribute.name, segments.join(''));
						});

						_this5.cleanup.push(function () {
							debind();
							if (!proxy.isBound()) {
								_Bindable.Bindable.clearBindings(proxy);
							}
						});
					};

					for (var j in bindProperties) {
						_loop7(j);
					}
				};

				for (var i = 0; i < tag.attributes.length; i++) {
					var _ret6 = _loop6(i);

					if (_ret6 === 'continue') continue;
				}
			}
		}
	}, {
		key: 'mapRefTags',
		value: function mapRefTags(tag) {
			var refAttr = tag.getAttribute('cv-ref');

			var _refAttr$split = refAttr.split(':'),
			    _refAttr$split2 = _slicedToArray(_refAttr$split, 3),
			    refProp = _refAttr$split2[0],
			    refClassname = _refAttr$split2[1],
			    refKey = _refAttr$split2[2];

			var refClass = this.stringToClass(refClassname);

			tag.removeAttribute('cv-ref');

			Object.defineProperty(tag, '___tag___', {
				enumerable: false,
				writable: true
			});

			this.cleanup.push(function () {
				tag.___tag___ = null;
				tag.remove();
			});

			var parent = this;
			var direct = this;

			if (this.viewList) {
				parent = this.viewList.parent;
				// if(!this.viewList.parent.tags[refProp])
				// {
				// 	this.viewList.parent.tags[refProp] = [];
				// }

				// let refKeyVal = this.args[refKey];

				// this.viewList.parent.tags[refProp][refKeyVal] = new refClass(
				// 	tag, this, refProp, refKeyVal
				// );
			} else {
					// this.tags[refProp] = new refClass(
					// 	tag, this, refProp
					// );
				}

			var tagObject = new refClass(tag, this, refProp, undefined, direct);

			tag.___tag___ = tagObject;

			while (parent) {
				if (!parent.parent) {}

				var refKeyVal = this.args[refKey];

				if (refKeyVal !== undefined) {
					if (!parent.tags[refProp]) {
						parent.tags[refProp] = [];
					}

					parent.tags[refProp][refKeyVal] = tagObject;
				} else {
					parent.tags[refProp] = tagObject;
				}

				parent = parent.parent;
			}
		}
	}, {
		key: 'mapBindTags',
		value: function mapBindTags(tag) {
			var _this6 = this;

			var bindArg = tag.getAttribute('cv-bind');
			var proxy = this.args;
			var property = bindArg;
			var top = null;

			if (bindArg.match(/\./)) {
				var _Bindable$resolve7 = _Bindable.Bindable.resolve(this.args, bindArg, true);

				var _Bindable$resolve8 = _slicedToArray(_Bindable$resolve7, 3);

				proxy = _Bindable$resolve8[0];
				property = _Bindable$resolve8[1];
				top = _Bindable$resolve8[2];
			}

			if (proxy !== this.args) {
				this.subBindings[bindArg] = this.subBindings[bindArg] || [];

				this.cleanup.push(this.args.bindTo(top, function () {
					while (_this6.subBindings.length) {
						console.log('HERE!');
						_this6.subBindings.shift()();
					}
				}));
			}

			var debind = proxy.bindTo(property, function (v, k, t, d, p) {

				if (p instanceof View && p !== v) {
					p.remove();
				}

				if (tag.tagName == 'INPUT' || tag.tagName == 'SELECT' || tag.tagName == 'TEXTAREA') {
					var type = tag.getAttribute('type');
					if (type && type.toLowerCase() == 'checkbox') {
						tag.checked = !!v;
					} else if (type && type.toLowerCase() == 'radio') {
						tag.checked = v == tag.value;
					} else if (type !== 'file') {
						if (tag.tagName == 'SELECT') {
							// console.log(k, v, tag.outerHTML, tag.options.length);
							for (var i in tag.options) {
								var option = tag.options[i];

								if (option.value == v) {
									tag.selectedIndex = i;
								}
							}
						}
						tag.value = v == null ? '' : v;
					} else if (type === 'file') {
						// console.log(v);	
					}
					return;
				}

				if (v instanceof View) {
					v.render(tag);
				} else {
					tag.innerText = v;
				}
			});

			if (proxy !== this.args) {
				this.subBindings[bindArg].push(debind);
			}

			this.cleanup.push(debind);

			var inputListener = function inputListener(event) {
				if (event.target !== tag) {
					return;
				}

				var type = tag.getAttribute('type');
				var multi = tag.getAttribute('multiple');
				if (type && type.toLowerCase() == 'checkbox') {
					if (tag.checked) {
						proxy[property] = event.target.value;
					} else {
						proxy[property] = false;
					}
				} else if (type !== 'file') {
					proxy[property] = event.target.value;
				} else if (type == 'file' && multi) {
					proxy[property] = Array.from(event.target.files);
				}
			};

			tag.addEventListener('input', inputListener);
			tag.addEventListener('change', inputListener);
			tag.addEventListener('value-changed', inputListener);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('input', inputListener);
					tag.removeEventListener('change', inputListener);
					tag.removeEventListener('value-changed', inputListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, inputListener));

			tag.removeAttribute('cv-bind');
		}
	}, {
		key: 'mapOnTags',
		value: function mapOnTags(tag) {
			var _this7 = this;

			var action = String(tag.getAttribute('cv-on')).split(/;/).map(function (a) {
				return a.split(':');
			}).map(function (object, tag) {
				return function (a) {
					var eventName = a[0].replace(/(^[\s\n]+|[\s\n]+$)/, '');
					var callbackName = a[1];
					var argList = [];
					var groups = /(\w+)(?:\(([$\w\s'",]+)\))?/.exec(callbackName);
					if (groups.length) {
						callbackName = groups[1].replace(/(^[\s\n]+|[\s\n]+$)/, '');
						if (groups[2]) {
							argList = groups[2].split(',').map(function (s) {
								return s.trim();
							});
						}
					}

					var eventMethod = void 0;
					var parent = _this7;

					while (parent) {
						if (typeof parent[callbackName] == 'function') {
							var _ret8 = function () {
								var _parent = parent;
								var _callBackName = callbackName;
								eventMethod = function eventMethod() {
									_parent[_callBackName].apply(_parent, arguments);
								};
								return 'break';
							}();

							if (_ret8 === 'break') break;
						}

						if (parent.viewList && parent.viewList.parent) {
							parent = parent.viewList.parent;
						} else if (parent.parent) {
							parent = parent.parent;
						} else {
							break;
						}
					}

					var eventListener = function (object, parent, eventMethod, tag) {
						return function (event) {
							var argRefs = argList.map(function (arg) {
								var match = void 0;
								if (parseInt(arg) == arg) {
									return arg;
								} else if (arg === 'event' || arg === '$event') {
									return event;
								} else if (arg === '$view') {
									return parent;
								} else if (arg === '$tag') {
									return tag;
								} else if (arg === '$parent') {
									return _this7.parent;
								} else if (arg === '$subview') {
									return _this7;
								} else if (arg in _this7.args) {
									return _this7.args[arg];
								} else if (match = /^['"](\w+?)["']$/.exec(arg)) {
									return match[1];
								}
							});
							if (!(typeof eventMethod == 'function')) {
								throw new Error(callbackName + ' is not defined on View object.\n\nTag:\n\n' + tag.outerHTML);
							}
							eventMethod.apply(undefined, _toConsumableArray(argRefs));
						};
					}(object, parent, eventMethod, tag);

					switch (eventName) {
						case '_init':
							eventListener();
							break;

						case '_attach':
							_this7.attach.push(eventListener);
							break;

						case '_detach':
							_this7.detach.push(eventListener);
							break;

						default:
							tag.addEventListener(eventName, eventListener);

							_this7.cleanup.push(function () {
								tag.removeEventListener(eventName, eventListener);
							});
							break;
					}

					return [eventName, callbackName, argList];
				};
			}(this, tag));

			tag.removeAttribute('cv-on');
		}
	}, {
		key: 'mapLinkTags',
		value: function mapLinkTags(tag) {
			var linkAttr = tag.getAttribute('cv-link');

			tag.setAttribute('href', linkAttr);

			var linkClick = function linkClick(event) {
				event.preventDefault();

				if (linkAttr.substring(0, 4) == 'http' || linkAttr.substring(0, 2) == '//') {
					window.open(tag.getAttribute('href', linkAttr));

					return;
				}

				_Router.Router.go(tag.getAttribute('href'));
			};

			tag.addEventListener('click', linkClick);

			this.cleanup.push(function (tag, eventListener) {
				return function () {
					tag.removeEventListener('click', eventListener);
					tag = undefined;
					eventListener = undefined;
				};
			}(tag, linkClick));

			tag.removeAttribute('cv-link');
		}
	}, {
		key: 'mapPrendererTags',
		value: function mapPrendererTags(tag) {
			var prerenderAttr = tag.getAttribute('cv-prerender');
			var prerendering = window.prerenderer;

			if (prerenderAttr == 'never' && prerendering || prerenderAttr == 'only' && !prerendering) {
				tag.parentNode.removeChild(tag);
			}
		}
	}, {
		key: 'mapWithTags',
		value: function mapWithTags(tag) {
			var _this8 = this;

			var withAttr = tag.getAttribute('cv-with');
			var carryAttr = tag.getAttribute('cv-carry');
			tag.removeAttribute('cv-with');
			tag.removeAttribute('cv-carry');

			var subTemplate = tag.innerHTML;

			var carryProps = [];

			if (carryAttr) {
				carryProps = carryAttr.split(',').map(function (s) {
					return s.trim();
				});
			}

			var debind = this.args.bindTo(withAttr, function (v, k, t, d) {
				if (_this8.withViews[k]) {
					_this8.withViews[k].remove();
				}

				while (tag.firstChild) {
					tag.removeChild(tag.firstChild);
				}

				var view = new View();

				_this8.cleanup.push(function (view) {
					return function () {
						view.remove();
					};
				}(view));

				view.template = subTemplate;
				view.parent = _this8;

				var _loop8 = function _loop8(i) {
					var debind = _this8.args.bindTo(carryProps[i], function (v, k) {
						view.args[k] = v;
					});

					view.cleanup.push(debind);
					_this8.cleanup.push(function () {
						debind();
						view.remove();
					});
				};

				for (var i in carryProps) {
					_loop8(i);
				}

				var _loop9 = function _loop9(i) {
					var debind = v.bindTo(i, function (v, k) {
						view.args[k] = v;
					});

					_this8.cleanup.push(function () {
						debind();
						if (!v.isBound()) {
							_Bindable.Bindable.clearBindings(v);
						}
						view.remove();
					});

					view.cleanup.push(function () {
						debind();
						if (!v.isBound()) {
							_Bindable.Bindable.clearBindings(v);
						}
					});
				};

				for (var i in v) {
					_loop9(i);
				}

				view.render(tag);

				_this8.withViews[k] = view;
			});

			this.cleanup.push(debind);
		}
	}, {
		key: 'mapEachTags',
		value: function mapEachTags(tag) {
			var _this9 = this;

			var eachAttr = tag.getAttribute('cv-each');
			tag.removeAttribute('cv-each');

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			// let carryProps = [];

			// if(carryAttr)
			// {
			// 	carryProps = carryAttr.split(',');
			// }

			var _eachAttr$split = eachAttr.split(':'),
			    _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
			    eachProp = _eachAttr$split2[0],
			    asProp = _eachAttr$split2[1],
			    keyProp = _eachAttr$split2[2];

			var debind = this.args.bindTo(eachProp, function (v, k, t, d, p) {
				if (_this9.viewLists[eachProp]) {
					_this9.viewLists[eachProp].remove();
				}

				var viewList = new _ViewList.ViewList(subTemplate, asProp, v, _this9, keyProp);

				_this9.cleanup.push(function () {
					viewList.remove();
				});

				var debindA = _this9.args.bindTo(function (v, k, t, d) {
					if (k == '_id') {
						return;
					}

					// console.log(k,v);

					if (viewList.args.subArgs[k] !== v) {
						// view.args[k] = v;
						viewList.args.subArgs[k] = v;
					}
				});

				for (var i in _this9.args) {
					if (i == '_id') {
						continue;
					}

					viewList.args.subArgs[k] = _this9.args[i];
				}

				var debindB = viewList.args.bindTo(function (v, k, t, d, p) {
					if (k == '_id' || k.substring(0, 3) === '___') {
						return;
					}

					var newRef = v;
					var oldRef = p; //t[k];

					if (v instanceof View) {
						newRef = v.___ref___;
					}

					if (p instanceof View) {
						oldRef = p.___ref___;
					}

					if (newRef !== oldRef && t[k] instanceof View) {
						t[k].remove();
					}

					if (k in _this9.args && newRef !== oldRef) {
						_this9.args[k] = v;
					}
				}, { wait: 0 });

				// let debindC = viewList.args.subArgs.bindTo((v,k,t,d,p)=>{
				// 	if(k == '_id')
				// 	{
				// 		return;
				// 	}

				// 	console.log(k,v,p,this.args[k]);

				// 	if(this.args[k] === v)
				// 	{
				// 		// return;
				// 	}

				// 	if(k in this.args)
				// 	{
				// 		this.args[k] = v;
				// 	}
				// });

				_this9.cleanup.push(function () {
					debindA();
					debindB();
				});

				while (tag.firstChild) {
					tag.removeChild(tag.firstChild);
				}

				_this9.viewLists[eachProp] = viewList;

				viewList.render(tag);
			});

			this.cleanup.push(function () {
				debind();
			});
		}
	}, {
		key: 'mapIfTags',
		value: function mapIfTags(tag) {
			var ifProperty = tag.getAttribute('cv-if');

			tag.removeAttribute('cv-if');

			var subTemplate = tag.innerHTML;

			var inverted = false;

			if (ifProperty.substr(0, 1) === '!') {
				inverted = true;
				ifProperty = ifProperty.substr(1);
			}

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var ifDoc = document.createRange().createContextualFragment('');

			var view = new View();

			view.template = subTemplate;
			view.parent = this;

			var deBindSync = this.syncBind(view);

			// let debindA = this.args.bindTo((v,k,t,d)=>{
			// 	if(k == '_id')
			// 	{
			// 		return;
			// 	}

			// 	if(view.args[k] !== v)
			// 	{
			// 		view.args[k] = v;
			// 	}
			// });

			// for(let i in this.args)
			// {
			// 	if(i == '_id')
			// 	{
			// 		continue;
			// 	}

			// 	view.args[i] = this.args[i];
			// }

			// let debindB = view.args.bindTo((v,k,t,d,p)=>{
			// 	if(k == '_id')
			// 	{
			// 		return;
			// 	}

			// 	let newRef = v;
			// 	let oldRef = p;

			// 	if(v instanceof View)
			// 	{
			// 		newRef = v.___ref___;
			// 	}

			// 	if(p instanceof View)
			// 	{
			// 		oldRef = p.___ref___;
			// 	}

			// 	if(newRef !== oldRef && p instanceof View)
			// 	{
			// 		p.remove();
			// 	}

			// 	if((k in this.args) && newRef !== oldRef)
			// 	{
			// 		this.args[k] = v;
			// 	}
			// }, {wait:0});

			var cleaner = this;

			while (cleaner.parent) {
				cleaner = cleaner.parent;
			}

			this.cleanup.push(function () {
				deBindSync();
				// view.remove();
			});

			view.render(tag);

			var proxy = this.args;
			var property = ifProperty;

			if (ifProperty.match(/\./)) {
				var _Bindable$resolve9 = _Bindable.Bindable.resolve(this.args, ifProperty, true);

				var _Bindable$resolve10 = _slicedToArray(_Bindable$resolve9, 2);

				proxy = _Bindable$resolve10[0];
				property = _Bindable$resolve10[1];
			}

			var debind = proxy.bindTo(property, function (v, k) {
				if (Array.isArray(v)) {
					v = !!v.length;
				}

				if (inverted) {
					v = !v;
				}

				if (v) {
					view.render(tag);
				} else {
					while (tag.firstChild) {
						tag.firstChild.remove();
					}
					view.render(ifDoc);
				}
			});

			this.cleanup.push(function () {
				debind();
				if (!proxy.isBound()) {
					_Bindable.Bindable.clearBindings(proxy);
				}
			});
		}

		// mapTemplateTags(tag)
		// {
		// 	let subTemplate = tag.innerHTML;

		// 	view.template = subTemplate;
		// 	view.parent   = this;

		// 	let deBindSync = this.syncBind(view);

		// 	let cleaner = this;

		// 	while(cleaner.parent)
		// 	{
		// 		cleaner = cleaner.parent;
		// 	}

		// 	this.cleanup.push(()=>{
		// 		deBindSync();
		// 		// view.remove();
		// 	});

		// 	view.render(tag);
		// }

	}, {
		key: 'syncBind',
		value: function syncBind(subView) {
			var _this10 = this;

			var debindA = this.args.bindTo(function (v, k, t, d) {
				if (k == '_id') {
					return;
				}

				if (subView.args[k] !== v) {
					subView.args[k] = v;
				}
			});

			for (var i in this.args) {
				if (i == '_id') {
					continue;
				}

				subView.args[i] = this.args[i];
			}

			var debindB = subView.args.bindTo(function (v, k, t, d, p) {
				if (k == '_id') {
					return;
				}

				var newRef = v;
				var oldRef = p;

				if (v instanceof View) {
					newRef = v.___ref___;
				}

				if (p instanceof View) {
					oldRef = p.___ref___;
				}

				if (newRef !== oldRef && p instanceof View) {
					p.remove();
				}

				if (k in _this10.args && newRef !== oldRef) {
					_this10.args[k] = v;
				}
			}, { wait: 0 });

			return function () {
				debindA();
				debindB();
			};
		}
	}, {
		key: 'postRender',
		value: function postRender(parentNode) {}
	}, {
		key: 'interpolatable',
		value: function interpolatable(str) {
			return !!String(str).match(this.interpolateRegex);
		}
	}, {
		key: 'uuid',
		value: function uuid() {
			return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
				return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
			});
		}
	}, {
		key: 'remove',
		value: function remove() {
			var detachEvent = new Event('cvDomDetached');

			for (var _i10 in this.tags) {
				if (Array.isArray(this.tags[_i10])) {
					for (var j in this.tags[_i10]) {
						this.tags[_i10][j].remove();
					}
					continue;
				}
				this.tags[_i10].remove();
			}

			for (var _i11 in this.nodes) {
				this.nodes[_i11].dispatchEvent(detachEvent);
				this.nodes[_i11].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			for (var _i12 in this.viewLists) {
				if (!this.viewLists[_i12]) {
					continue;
				}
				this.viewLists[_i12].remove();
			}

			this.viewLists = [];

			for (var _i13 in this.timeouts) {
				clearInterval(this.timeouts[_i13].timeout);
				delete this.timeouts[_i13];
			}

			for (var i in this.intervals) {
				clearInterval(this.intervals[i].timeout);
				delete this.intervals[i];
			}

			this.removed = true;

			// Bindable.clearBindings(this.args);
		}
	}, {
		key: 'update',
		value: function update() {}
	}, {
		key: 'beforeUpdate',
		value: function beforeUpdate(args) {}
	}, {
		key: 'afterUpdate',
		value: function afterUpdate(args) {}
	}, {
		key: 'stringToClass',
		value: function stringToClass(refClassname) {
			var refClassSplit = refClassname.split('/');
			var refShortClassname = refClassSplit[refClassSplit.length - 1];
			var refClass = require(refClassname);

			return refClass[refShortClassname];
		}
	}], [{
		key: 'isView',
		value: function isView() {
			return View;
		}
	}]);

	return View;
}();