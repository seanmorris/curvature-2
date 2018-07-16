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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var View = exports.View = function () {
	function View() {
		var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, View);

		this.args = _Bindable.Bindable.makeBindable(args);
		this._id = this.uuid();
		this.args._id = this._id;
		this.template = '';
		this.parent = null;

		this.firstNode = null;
		this.lastNode = null;
		this.nodes = null;

		this.frames = [];
		this.timeouts = [];
		this.intervals = [];

		this.cleanup = [];

		this.attach = [];
		this.detach = [];

		this.eventCleanup = [];

		this.parent = null;
		this.viewList = null;
		this.viewLists = {};

		this.tags = {};

		this.intervals = [];
		this.timeouts = [];
		this.frames = [];
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
			} else {
				subDoc = document.createRange().createContextualFragment(this.template);
			}

			// Dom.mapTags(subDoc, '[cv-ref]', (tag)=>{
			// 	this.mapRefTags(tag)
			// });

			_Dom.Dom.mapTags(subDoc, false, function (tag) {
				if (tag.matches) {
					tag.matches('[cv-each]') && _this2.mapEachTags(tag);

					tag.matches('[cv-with]') && _this2.mapWithTags(tag);

					tag.matches('[cv-prerender]') && _this2.mapPrendererTags(tag);

					tag.matches('[cv-link]') && _this2.mapLinkTags(tag);

					tag.matches('[cv-on]') && _this2.mapOnTags(tag);

					tag.matches('[cv-bind]') && _this2.mapBindTags(tag);

					_this2.mapInterpolatableTags(tag);

					tag.matches('[cv-ref]') && _this2.mapRefTags(tag);

					tag.matches('[cv-if]') && _this2.mapIfTags(tag);
				} else {
					_this2.mapInterpolatableTags(tag);
				}
			});

			this.nodes = [];

			this.firstNode = document.createComment('Template ' + this._id + ' Start');

			this.nodes.push(this.firstNode);

			if (parentNode) {
				if (insertPoint) {
					parentNode.insertBefore(this.firstNode, insertPoint);
				} else {
					parentNode.appendChild(this.firstNode);
				}
			}

			while (subDoc.firstChild) {
				var newNode = subDoc.firstChild;
				var _attachEvent = new Event('cvDomAttached', { bubbles: true, target: newNode });

				this.nodes.push(subDoc.firstChild);

				if (parentNode) {
					if (insertPoint) {
						parentNode.insertBefore(subDoc.firstChild, insertPoint);
					} else {
						parentNode.appendChild(subDoc.firstChild);
					}
				}

				_Dom.Dom.mapTags(newNode, false, function (node) {
					// node.dispatchEvent(attachEvent);
				});

				newNode.dispatchEvent(_attachEvent);
			}

			this.lastNode = document.createComment('Template ' + this._id + ' End');

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
		key: 'mapInterpolatableTags',
		value: function mapInterpolatableTags(tag) {
			var _this3 = this;

			var regex = /(\[\[(\$?\w+)\]\])/g;

			if (tag.nodeType == Node.TEXT_NODE) {
				var original = tag.nodeValue;

				if (!this.interpolatable(original)) {
					return;
				}

				var header = 0;
				var match = void 0;

				while (match = regex.exec(original)) {
					var bindProperty = match[2];

					var unsafeHtml = false;

					if (bindProperty.substr(0, 1) === '$') {
						unsafeHtml = true;
						bindProperty = bindProperty.substr(1);
					}

					var staticPrefix = original.substring(header, match.index);

					header = match.index + match[1].length;

					var _staticNode = document.createTextNode(staticPrefix);

					tag.parentNode.insertBefore(_staticNode, tag);

					var dynamicNode = void 0;

					if (unsafeHtml) {
						dynamicNode = document.createElement('div');
					} else {
						dynamicNode = document.createTextNode('');
					}

					tag.parentNode.insertBefore(dynamicNode, tag);

					this.args.bindTo(bindProperty, function (dynamicNode, unsafeHtml) {
						return function (v, k, t) {
							// console.log(`Setting ${k} to ${v}`, dynamicNode);
							if (t[k] instanceof View) {
								t[k].remove();
							}

							dynamicNode.nodeValue = '';

							if (v instanceof View) {

								v.render(tag.parentNode, dynamicNode);
							} else {
								// console.log(dynamicNode);
								if (unsafeHtml) {
									dynamicNode.innerHTML = v;
								} else {
									dynamicNode.nodeValue = v;
								}
							}
						};
					}(dynamicNode, unsafeHtml));
				}

				var staticSuffix = original.substring(header);

				var staticNode = document.createTextNode(staticSuffix);

				tag.parentNode.insertBefore(staticNode, tag);

				tag.nodeValue = '';
			}

			if (tag.nodeType == Node.ELEMENT_NODE) {
				var _loop2 = function _loop2(i) {
					if (!_this3.interpolatable(tag.attributes[i].value)) {
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

					for (var j in bindProperties) {
						_this3.args.bindTo(j, function (v, k, t, d) {
							for (var _i9 in bindProperties) {
								for (var _j in bindProperties[_i9]) {
									segments[bindProperties[_i9][_j]] = t[_i9];

									if (k === _i9) {
										segments[bindProperties[_i9][_j]] = v;
									}
								}
							}
							tag.setAttribute(attribute.name, segments.join(''));
						});
					}

					// console.log(bindProperties, segments);

					// console.log(tag.attributes[i].name, tag.attributes[i].value);
				};

				for (var i = 0; i < tag.attributes.length; i++) {
					var _ret2 = _loop2(i);

					if (_ret2 === 'continue') continue;
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

			var parent = this;

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

			while (parent) {
				if (1 || !parent.parent) {
					var refKeyVal = this.args[refKey];

					if (refKeyVal !== undefined) {
						if (!parent.tags[refProp]) {
							parent.tags[refProp] = [];
						}

						parent.tags[refProp][refKeyVal] = new refClass(tag, this, refProp);
					} else {
						parent.tags[refProp] = new refClass(tag, this, refProp);
					}
				}
				parent = parent.parent;
			}
		}
	}, {
		key: 'mapBindTags',
		value: function mapBindTags(tag) {
			var _this4 = this;

			var bindArg = tag.getAttribute('cv-bind');
			this.args.bindTo(bindArg, function (v, k, t) {
				if (t[k] === v) {
					// return;
				}

				if (t[k] instanceof View) {
					t[k].remove();
				}

				if (tag.tagName == 'INPUT' || tag.tagName == 'SELECT') {
					var type = tag.getAttribute('type');
					if (type && type.toLowerCase() == 'checkbox') {
						if (v) {
							tag.checked = true;
						} else {
							tag.checked = false;
						}
					} else if (type !== 'file') {
						tag.value = v || '';
					}
					return;
				}

				if (v instanceof View) {
					v.render(tag);
				} else {
					tag.innerText = v;
				}
			});

			var inputListener = function inputListener(event) {
				if (event.target.getAttribute('type') !== 'password') {
					// console.log(event.target.value);
				}

				if (event.target !== tag) {
					return;
				}

				// console.log(event.target.value);

				_this4.args[bindArg] = event.target.value;
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
			var _this5 = this;

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
					var parent = _this5;

					while (parent) {
						if (typeof parent[callbackName] == 'function') {
							eventMethod = function eventMethod() {
								var _parent;

								(_parent = parent)[callbackName].apply(_parent, arguments);
							};
							break;
						}

						if (parent.viewList && parent.viewList.parent) {
							parent = parent.viewList.parent;
						} else if (parent.parent) {
							parent = parent.parent;
						} else {
							break;
						}
					}

					var eventListener = function (object, parent) {
						return function (event) {
							var argRefs = argList.map(function (arg) {
								var match = void 0;
								if (parseInt(arg) == arg) {
									return arg;
								} else if (arg === 'event' || arg === '$event') {
									return event;
								} else if (arg === '$view') {
									return parent;
								} else if (arg === '$subview') {
									return object;
								} else if (arg in object.args) {
									return object.args[arg];
								} else if (match = /^['"](\w+?)["']$/.exec(arg)) {
									return match[1];
								}
							});
							// console.log(argList, argRefs);
							if (!(typeof eventMethod == 'function')) {
								// console.log(object);
								// console.trace();
								console.log(_this5, parent);
								throw new Error(callbackName + ' is not defined on View object.\n\nTag:\n\n' + tag.outerHTML);
							}
							eventMethod.apply(undefined, _toConsumableArray(argRefs));
						};
					}(object, parent);

					switch (eventName) {
						case '_init':
							eventListener();
							break;

						case '_attach':
							_this5.attach.push(eventListener);
							break;

						case '_detach':
							_this5.detach.push(eventListener);
							break;

						default:
							tag.addEventListener(eventName, eventListener);

							_this5.cleanup.push(function (tag, eventName, eventListener) {
								return function () {
									tag.removeEventListener(eventName, eventListener);
									tag = undefined;
									eventListener = undefined;
								};
							}(tag, eventName, eventListener));
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
			var LinkAttr = tag.getAttribute('cv-link');

			tag.setAttribute('href', LinkAttr);

			var linkClick = function linkClick(event) {
				event.preventDefault();

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
			var prerendering = _Cookie.Cookie.get('prerenderer');

			if (prerenderAttr == 'never' && prerendering || prerenderAttr == 'only' && !prerendering) {
				tag.parentNode.removeChild(tag);
			}
		}
	}, {
		key: 'mapWithTags',
		value: function mapWithTags(tag) {
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

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var view = new View();

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			// console.log(carryProps);

			for (var i in carryProps) {
				this.args.bindTo(carryProps[i], function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			for (var _i10 in this.args[withAttr]) {
				this.args[withAttr].bindTo(_i10, function (view) {
					return function (v, k) {
						view.args[k] = v;
					};
				}(view));
			}

			view.render(tag);
		}
	}, {
		key: 'mapEachTags',
		value: function mapEachTags(tag) {
			var _this6 = this;

			var eachAttr = tag.getAttribute('cv-each');
			var carryAttr = tag.getAttribute('cv-carry');
			tag.removeAttribute('cv-each');
			tag.removeAttribute('cv-carry');

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var carryProps = [];

			if (carryAttr) {
				carryProps = carryAttr.split(',');
			}

			var _eachAttr$split = eachAttr.split(':'),
			    _eachAttr$split2 = _slicedToArray(_eachAttr$split, 3),
			    eachProp = _eachAttr$split2[0],
			    asProp = _eachAttr$split2[1],
			    keyProp = _eachAttr$split2[2];

			// console.log(this, eachProp);

			var viewList = void 0;

			this.args.bindTo(eachProp, function (viewList) {
				return function (v, k, t) {
					if (viewList) {
						viewList.remove();
					}

					viewList = new _ViewList.ViewList(subTemplate, asProp, v, keyProp);

					viewList.parent = _this6;

					viewList.render(tag);

					for (var i in carryProps) {
						_this6.args.bindTo(carryProps[i], function (v, k) {
							viewList.args.subArgs[k] = v;
						});
					}
				};
			}(viewList));

			this.viewLists[eachProp] = viewList;
		}
	}, {
		key: 'mapIfTags',
		value: function mapIfTags(tag) {
			var ifProperty = tag.getAttribute('cv-if');

			var inverted = false;

			if (ifProperty.substr(0, 1) === '!') {
				inverted = true;
				ifProperty = ifProperty.substr(1);
			}

			var subTemplate = tag.innerHTML;

			while (tag.firstChild) {
				tag.removeChild(tag.firstChild);
			}

			var ifDoc = document.createRange().createContextualFragment('');

			var view = new View();

			view.args = this.args;

			this.cleanup.push(function (view) {
				return function () {
					view.remove();
				};
			}(view));

			view.template = subTemplate;
			view.parent = this;

			view.render(tag);

			this.args.bindTo(ifProperty, function (tag, ifDoc) {
				return function (v) {
					var detachEvent = new Event('cvDomDetached');
					var attachEvent = new Event('cvDomAttached');

					if (inverted) {
						v = !v;
					}

					if (v) {
						while (ifDoc.firstChild) {
							var moveTag = ifDoc.firstChild;

							tag.prepend(moveTag);

							moveTag.dispatchEvent(attachEvent);

							_Dom.Dom.mapTags(moveTag, false, function (node) {
								node.dispatchEvent(attachEvent);
							});
						}
					} else {
						while (tag.firstChild) {
							var _moveTag = tag.firstChild;

							ifDoc.prepend(_moveTag);

							_moveTag.dispatchEvent(detachEvent);

							_Dom.Dom.mapTags(_moveTag, false, function (node) {
								node.dispatchEvent(detachEvent);
							});
						}
					}
				};
			}(tag, ifDoc));

			tag.removeAttribute('cv-if');
		}
	}, {
		key: 'postRender',
		value: function postRender(parentNode) {}
	}, {
		key: 'interpolatable',
		value: function interpolatable(str) {
			return !!String(str).match(/\[\[\$?\w+\??\]\]/);
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

			for (var i in this.nodes) {
				this.nodes[i].dispatchEvent(detachEvent);
				this.nodes[i].remove();
			}

			var cleanup = void 0;

			while (cleanup = this.cleanup.shift()) {
				cleanup();
			}

			for (var _i11 in this.tags) {
				if (Array.isArray(this.tags[_i11])) {
					for (var j in this.tags[_i11]) {
						this.tags[_i11][j].remove();
					}
					continue;
				}
				this.tags[_i11].remove();
			}

			for (var _i12 in this.viewLists) {
				if (!this.viewLists[_i12]) {
					continue;
				}
				this.viewLists[_i12].remove();
			}

			this.viewLists = [];

			_Bindable.Bindable.clearBindings(this);
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