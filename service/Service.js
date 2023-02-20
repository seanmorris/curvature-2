"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Service = void 0;
var _Router = require("../base/Router");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Service = /*#__PURE__*/function () {
  function Service() {
    _classCallCheck(this, Service);
  }
  _createClass(Service, null, [{
    key: "register",
    value: function register(script) {
      var _this = this;
      var scope = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '/';
      if (!('serviceWorker' in navigator)) {
        return Promise.reject('Service Workers not supported.');
      }

      // navigator.serviceWorker.startMessages();

      var serviceWorker = navigator.serviceWorker;
      serviceWorker.register(script, {
        scope: scope
      });
      serviceWorker.ready.then(function (registration) {
        var worker = registration.active;
        if (!worker) {
          return;
        }
        _this.workers.set(worker.scriptURL, worker);
        serviceWorker.addEventListener('message', function (event) {
          return _this.handleResponse(event);
        });
      });
      return serviceWorker.ready;
    }
  }, {
    key: "request",
    value: function request(_ref) {
      var _this2 = this;
      var command = _ref.command,
        args = _ref.args,
        echo = _ref.echo,
        notify = _ref.notify,
        _ref$to = _ref.to,
        to = _ref$to === void 0 ? null : _ref$to,
        _ref$broadcast = _ref.broadcast,
        broadcast = _ref$broadcast === void 0 ? false : _ref$broadcast;
      var correlationId = Number(1 / Math.random()).toString(36);
      var getResponse = new Promise(function (accept) {
        _this2.incomplete.set(correlationId, accept);
      });
      var _iterator = _createForOfIteratorHelper(this.workers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _step$value = _slicedToArray(_step.value, 2),
            scriptURL = _step$value[0],
            worker = _step$value[1];
          if (worker.state === 'redundant') {
            return Promise.reject('Worker has been updated, connection lost. Please refresh the page.');
          }
          worker.postMessage({
            correlationId: correlationId,
            broadcast: broadcast,
            command: command,
            notify: notify,
            args: args,
            echo: echo,
            to: to
          });
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return getResponse;
    }
  }, {
    key: "broadcast",
    value: function broadcast(_ref2) {
      var command = _ref2.command,
        args = _ref2.args,
        echo = _ref2.echo,
        notify = _ref2.notify;
      this.request({
        command: command,
        args: args,
        echo: echo,
        notify: notify,
        broadcast: true
      });
    }
  }, {
    key: "handleResponse",
    value: function handleResponse(event) {
      var _this3 = this;
      event.target.ready.then(function (registration) {
        var worker = registration.active;
        _this3.workers.set(worker.scriptURL, worker);
      });
      var packet = event.data;
      if (!packet.to && !packet.correlationId) {
        return;
      }
      if (!this.incomplete.has(packet.correlationId)) {
        if (packet.broadcast) {
          this.handleBroadcast(event);
        } else if (packet.to) {
          this.handleMessage(event);
        }
        return;
      }
      var getResponse = this.incomplete.get(packet.correlationId);
      this.incomplete["delete"](packet.correlationId);
      getResponse(packet.result);
    }
  }, {
    key: "handleRequest",
    value: function handleRequest(event) {
      var _this4 = this;
      if (event.origin !== globalThis.origin) {
        return;
      }
      var packet = event.data;
      var getResponse = Promise.resolve('Unexpected request.');
      if (packet.echo) {
        getResponse = Promise.resolve(packet.echo);
      } else if (packet.notify) {
        var args = packet.args || [];
        getResponse = globalThis.registration.getNotifications().then(function (notifyList) {
          var _globalThis$registrat;
          notifyList.forEach(function (notification) {
            return _this4.notifications.set(notification.tag, notification);
          });
          return (_globalThis$registrat = globalThis.registration).showNotification.apply(_globalThis$registrat, _toConsumableArray(args));
        }).then(function () {
          return globalThis.registration.getNotifications();
        }).then(function (notifyList) {
          var tag = event.data.args && event.data.args[1] && event.data.args[1].tag;
          var notifyClient = new Promise(function (accept) {
            var notifiers;
            if (_this4.notifyClients.has(tag)) {
              notifiers = _this4.notifyClients.get(tag);
            } else {
              notifiers = new Map();
              _this4.notifyClients.set(tag, notifiers);
            }
            notifiers.set(event.source, accept);
          });
          return notifyClient;
        });
      } else if (packet.command) {
        var command = packet.command;
        var _args = packet.args || [];
        var _iterator2 = _createForOfIteratorHelper(this.serviceHandlers),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var handler = _step2.value;
            if (typeof handler[command] === 'function') {
              getResponse = handler[command].apply(handler, _toConsumableArray(_args));
              break;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      if (_typeof(getResponse) !== Promise) {
        getResponse = Promise.resolve(getResponse);
      }
      if (packet.broadcast) {
        var options = {
          type: 'window',
          includeUncontrolled: true
        };
        var source = event.source.id;
        globalThis.clients.matchAll(options).then(function (clientList) {
          clientList.forEach(function (client) {
            getResponse.then(function (response) {
              return client.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
                result: response,
                source: source
              }));
            });
          });
        });
      } else if (packet.to) {
        var _source = event.source.id;
        globalThis.clients.get(packet.to).then(function (client) {
          getResponse.then(function (response) {
            client.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
              result: response,
              source: _source
            }));
          });
        });
      } else {
        getResponse.then(function (response) {
          return event.source.postMessage(_objectSpread(_objectSpread({}, packet), {}, {
            result: response
          }));
        });
      }
    }
  }, {
    key: "handleInstall",
    value: function handleInstall(event) {
      globalThis.skipWaiting();
      var _iterator3 = _createForOfIteratorHelper(this.pageHandlers),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var handler = _step3.value;
          if (typeof handler.handleInstall === 'function') {
            handler.handleInstall(event);
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }, {
    key: "handleActivate",
    value: function handleActivate(event) {
      var _iterator4 = _createForOfIteratorHelper(this.pageHandlers),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var handler = _step4.value;
          if (typeof handler.handleActivate === 'function') {
            handler.handleActivate(event);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
  }, {
    key: "handleError",
    value: function handleError(event) {
      console.error(event);
      var _iterator5 = _createForOfIteratorHelper(this.pageHandlers),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var handler = _step5.value;
          if (typeof handler.handleError === 'function') {
            handler.handleError(event);
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "handlePush",
    value: function handlePush(event) {
      // console.log('push', event);
    }
  }, {
    key: "handleSync",
    value: function handleSync(event) {
      // console.log('sync', event);
    }
  }, {
    key: "handlePeriodicSync",
    value: function handlePeriodicSync(event) {
      // console.log('periodic sync', event);
    }
  }, {
    key: "handleFetch",
    value: function handleFetch(event) {
      var url = new URL(event.request.url);
      var path = url.pathname + url.search;
      var _iterator6 = _createForOfIteratorHelper(this.routeHandlers),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var routes = _step6.value;
          return _Router.Router.match(path, {
            routes: routes
          }, {
            event: event
          }).then(function (result) {
            if (result === undefined) {
              return;
            }
            if (_typeof(result) !== 'object' || !(result instanceof Response)) {
              result = new Response(result);
            }
            return result;
          });
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
  }, {
    key: "handleBroadcast",
    value: function handleBroadcast(event) {
      var _iterator7 = _createForOfIteratorHelper(this.pageHandlers),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var handler = _step7.value;
          if (typeof handler.handleBroadcast === 'function') {
            handler.handleBroadcast(event);
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
  }, {
    key: "handleMessage",
    value: function handleMessage(event) {
      var _iterator8 = _createForOfIteratorHelper(this.pageHandlers),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var handler = _step8.value;
          if (typeof handler.handleMessage === 'function') {
            handler.handleMessage(event);
          }
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "notify",
    value: function notify(title) {
      var _this5 = this;
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var broadcast = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      options.tag = options.tag || ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, function (c) {
        return (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16);
      });
      return new Promise(function (accept, reject) {
        Notification.requestPermission(function (result) {
          accept(result);
        });
      }).then(function (result) {
        return _this5.request({
          notify: true,
          args: [title, options],
          broadcast: broadcast
        });
      });
    }
  }, {
    key: "handleNotifyClicked",
    value: function handleNotifyClicked(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        var focusables = [];
        notifiers.forEach(function (notifier, client) {
          notifier({
            action: event.action,
            data: event.notification.data,
            click: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
          focusables.push(client);
        });
        while (focusables.length) {
          var client = focusables.pop();
          if (client.focus()) {
            break;
          }
        }
        this.notifyClients["delete"](event.notification.tag);
      }
      var _iterator9 = _createForOfIteratorHelper(this.pageHandlers),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var handler = _step9.value;
          if (typeof handler.handleNotifyClicked === 'function') {
            handler.handleNotifyClicked(event);
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      event.notification.close();
    }
  }, {
    key: "handleNotifyClosed",
    value: function handleNotifyClosed(event) {
      if (this.notifyClients.has(event.notification.tag)) {
        var notifiers = this.notifyClients.get(event.notification.tag);
        notifiers.forEach(function (notifier) {
          return notifier({
            action: undefined,
            data: event.notification.data,
            close: Date.now(),
            time: event.notification.timestamp,
            tag: event.notification.tag
          });
        });
      }
      if (this.notifyClients["delete"](event.notification.tag)) {
        var _iterator10 = _createForOfIteratorHelper(this.pageHandlers),
          _step10;
        try {
          for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
            var handler = _step10.value;
            if (typeof handler.handleNotifyDismissed === 'function') {
              handler.handleNotifyDismissed(event);
            }
          }
        } catch (err) {
          _iterator10.e(err);
        } finally {
          _iterator10.f();
        }
      }
      var _iterator11 = _createForOfIteratorHelper(this.pageHandlers),
        _step11;
      try {
        for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
          var _handler = _step11.value;
          if (typeof _handler.handleNotifyClosed === 'function') {
            _handler.handleNotifyClosed(event);
          }
        }
      } catch (err) {
        _iterator11.e(err);
      } finally {
        _iterator11.f();
      }
    }
  }]);
  return Service;
}();
exports.Service = Service;
Object.defineProperty(Service, 'serviceHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'routeHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'pageHandlers', {
  value: new Set()
});
Object.defineProperty(Service, 'notifications', {
  value: new Map()
});
Object.defineProperty(Service, 'notifyClients', {
  value: new Map()
});
Object.defineProperty(Service, 'incomplete', {
  value: new Map()
});
Object.defineProperty(Service, 'workers', {
  value: new Map()
});
if (!globalThis.document) {
  globalThis.addEventListener('install', function (event) {
    return Service.handleInstall(event);
  });
  globalThis.addEventListener('activate', function (event) {
    return Service.handleActivate(event);
  });
  globalThis.addEventListener('error', function (event) {
    return Service.handleActivate(event);
  });
  globalThis.addEventListener('message', function (event) {
    return Service.handleRequest(event);
  });
  globalThis.addEventListener('fetch', function (event) {
    event.waitUntil(new Promise(function (accept) {
      Service.handleFetch(event).then(function (result) {
        if (result) {
          event.respondWith(result);
        }
        accept();
      });
    }));
  });
  globalThis.addEventListener('push', function (event) {
    return Service.handlePush(event);
  });
  globalThis.addEventListener('notificationclose', function (event) {
    return Service.handleNotifyClosed(event);
  });
  globalThis.addEventListener('notificationclick', function (event) {
    return Service.handleNotifyClicked(event);
  });
  globalThis.addEventListener('sync', function (event) {
    return Service.handleSync(event);
  });
  globalThis.addEventListener('periodicsync', function (event) {
    return Service.handlePeriodicSync(event);
  });
}