"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Elicit = void 0;

var _Mixin = require("curvature/base/Mixin");

var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");

var _PromiseMixin = require("curvature/mixin/PromiseMixin");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var IterateDownload = Symbol('IterateDownload');
var Retry = Symbol('Retry');
var HandleFirstByte = Symbol('HandleFirstByte');
var HandleProgress = Symbol('HandleProgress');
var HandleComplete = Symbol('HandleComplete');
var HandleHeaders = Symbol('HandleHeaders');
var HandleClose = Symbol('HandleClose');
var HandleError = Symbol('HandleError');
var HandleOpen = Symbol('HandleOpen');
var HandleFail = Symbol('HandleFail');
var LastChunkSize = Symbol('LastChunkSize');
var LastChunkTime = Symbol('LastChunkTime');
var Options = Symbol('Options');
var Fetch = Symbol('Fetch');
var Type = Symbol('Type');
var Url = Symbol('Url');
var RetriesLeft = Symbol('RetriesLeft');
var TimeoutLeft = Symbol('TimeoutLeft');
var Timeout = Symbol('Timeout');
var Timer = Symbol('Timer');
var Canceller = Symbol('Canecller');
var Cancelled = Symbol('Caneclled');
var Paused = Symbol('Paused');
var Received = Symbol('Received');
var Length = Symbol('Length');
var Opened = Symbol('Opened');
var Closed = Symbol('Closed');
var Start = Symbol('Start');
var First = Symbol('First');
var End = Symbol('End');

var Elicit = /*#__PURE__*/function (_Mixin$with) {
  _inherits(Elicit, _Mixin$with);

  var _super = _createSuper(Elicit);

  function Elicit(url) {
    var _this2;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Elicit);

    _this2 = _super.call(this);
    _this2[RetriesLeft] = options.retries || 5;
    _this2[Timeout] = options.timeout || 4500;
    _this2[TimeoutLeft] = options.maxTimeout || _this2[Timeout] * _this2[RetriesLeft];
    _this2[LastChunkTime] = 0;
    _this2[LastChunkSize] = 0;
    _this2[Cancelled] = false;
    _this2[Received] = 0;
    _this2[Paused] = false;
    _this2[Closed] = 0;
    _this2[Options] = Object.assign({}, options);
    _this2[Url] = url;

    if (!options.defer) {
      _this2.open();
    }

    return _this2;
  }

  _createClass(Elicit, [{
    key: "open",
    value: function open() {
      var _this3 = this;

      if (this[Opened] && !this[Closed]) {
        return;
      }

      if (!this[Start]) {
        this[Start] = Date.now();
      }

      this[Canceller] = new AbortController();
      this[Options].signal = this[Canceller].signal;
      this[Opened] = Date.now();
      this[Closed] = 0;
      this[First] = 0;
      this[Fetch] = fetch(this[Url], this[Options]).then(function (response) {
        return _this3[HandleOpen](response);
      })["catch"](function (error) {
        return _this3[HandleError](error);
      });

      var onTimeout = function onTimeout() {
        if (!_this3[First]) {
          _this3[Canceller].abort();

          _this3[HandleClose]();

          _this3[TimeoutLeft] = Math.max(0, _this3[TimeoutLeft] - _this3[Timeout]);

          if (!_this3[TimeoutLeft]) {
            return;
          }

          _this3[HandleFail](new Error('Timed out.'));
        }
      };

      this[Timer] = setTimeout(onTimeout, this[Timeout]);
    }
  }, {
    key: "headers",
    value: function headers() {
      return this[Fetch].then(function (_ref) {
        var response = _ref.response,
            stream = _ref.stream;
        return response.headers;
      });
    }
  }, {
    key: "json",
    value: function json() {
      var _this4 = this;

      return this[Fetch].then(function (_ref2) {
        var response = _ref2.response,
            stream = _ref2.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this4.type
          }
        });
        return wrapped.json();
      });
    }
  }, {
    key: "text",
    value: function text() {
      var _this5 = this;

      return this[Fetch].then(function (_ref3) {
        var response = _ref3.response,
            stream = _ref3.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this5.type
          }
        });
        return wrapped.text();
      });
    }
  }, {
    key: "css",
    value: function css() {
      return this.text().then(function (css) {
        var sheet = new CSSStyleSheet();
        sheet.replace(css);
        return sheet;
      });
    }
  }, {
    key: "blob",
    value: function blob() {
      var _this6 = this;

      return this[Fetch].then(function (_ref4) {
        var response = _ref4.response,
            stream = _ref4.stream;
        var wrapped = new Response(stream, {
          headers: {
            'Content-Type': _this6.type
          }
        });
        return wrapped.blob();
      });
    }
  }, {
    key: "buffer",
    value: function buffer() {
      return this.blob().then(function (blob) {
        return blob.arrayBuffer();
      });
    }
  }, {
    key: "bytes",
    value: function bytes() {
      return this.buffer().then(function (buffer) {
        return new Uint8Array(buffer);
      });
    }
  }, {
    key: "objectUrl",
    value: function objectUrl() {
      return this.blob().then(function (blob) {
        return URL.createObjectURL(blob);
      });
    }
  }, {
    key: "cancel",
    value: function cancel() {
      if (!this.emitCancelEvent()) {
        return;
      }

      this[Canceller].abort();
      this[Cancelled] = true;
      this.emitCancelledEvent();
    }
  }, {
    key: "pause",
    value: function pause() {
      if (this[End] || this[Paused] || this[Closed]) {
        return;
      }

      if (!this.emitPauseEvent()) {
        return;
      }

      this[Paused] = true;
      this.emitPausedEvent();
    }
  }, {
    key: "unpause",
    value: function unpause() {
      if (this[End] || !this[Paused]) {
        return;
      }

      if (!this.emitUnpauseEvent()) {
        return;
      }

      this[Paused] = false;
      this.emitUnpausedEvent();
    }
  }, {
    key: "done",
    get: function get() {
      return !!this[End];
    }
  }, {
    key: "type",
    get: function get() {
      return this[Type];
    }
  }, {
    key: "totalTime",
    get: function get() {
      if (!this[End]) {
        return Date.now() - this[Start];
      }

      return this[End] - this[Start];
    }
  }, {
    key: "waitTime",
    get: function get() {
      if (!this[First]) {
        return Date.now() - this[Opened];
      }

      return this[First] - this[Opened];
    }
  }, {
    key: "loadTime",
    get: function get() {
      if (!this[Opened]) {
        return 0;
      }

      if (!this[Closed]) {
        return Date.now() - this[First];
      }

      return this[Closed] - this[First];
    }
  }, {
    key: "speed",
    get: function get() {
      if (!this[Opened]) {
        return 0;
      }

      var time;

      if (this[End]) {
        time = this[End] - this[LastChunkTime];
      } else {
        time = Date.now() - this[LastChunkTime];
      }

      if (!time) {
        time = 0.01;
      }

      return this[LastChunkSize] / time;
    }
  }, {
    key: "received",
    get: function get() {
      return this[Received];
    }
  }, {
    key: "length",
    get: function get() {
      return this[Length];
    }
  }, {
    key: "isPaused",
    get: function get() {
      return this[Paused];
    }
  }, {
    key: IterateDownload,
    value: function value(reader, controller, length) {
      var _this7 = this;

      this[HandleProgress](length, 0);
      var lastTime = Date.now();
      var lastSize = 1;

      var handleChunk = function handleChunk(_ref5) {
        var done = _ref5.done,
            value = _ref5.value;

        if (done) {
          controller.close();
          return _this7[HandleComplete]();
        }

        controller.enqueue(value);
        _this7[Received] += value.length;

        if (!_this7[First]) {
          _this7[HandleFirstByte](value);
        }

        _this7[HandleProgress](length, _this7[Received]);

        _this7[LastChunkTime] = lastTime;
        _this7[LastChunkSize] = lastSize;
        lastTime = Date.now();
        lastSize = value.length;
        return iterate();
      };

      var iterate = function iterate() {
        if (_this7[Cancelled]) {
          return reader.cancel();
        }

        if (_this7[Paused]) {
          return new Promise(function (accept) {
            setTimeout(function () {
              return accept(iterate());
            }, 100);
          });
        }

        return reader.read().then(function (chunk) {
          return handleChunk(chunk);
        })["catch"](function (error) {
          return _this7[HandleError](error);
        });
      };

      return iterate();
    }
  }, {
    key: Retry,
    value: function value() {
      if (!this.emitRetryEvent()) {
        return;
      }

      if (this[RetriesLeft] <= 0) {
        return;
      }

      this[Canceller].abort();
      this[HandleClose]();
      this[Received] = 0;
      this[RetriesLeft]--;
      return this.open();
    }
  }, {
    key: HandleOpen,
    value: function value(response) {
      var reader = response.body.getReader();
      var length = this[Length] || response.headers.get('Content-Length');
      var type = this[type] || response.headers.get('Content-Type');
      this[Length] = length;
      this[Type] = type;
      this[HandleHeaders](response.headers);

      var _this = this;

      var stream = new ReadableStream({
        start: function start(controller) {
          _this[IterateDownload](reader, controller, length);
        }
      });
      return {
        response: response,
        stream: stream
      };
    }
  }, {
    key: HandleClose,
    value: function value() {
      this[Closed] = Date.now();
      this.emitCloseEvent();
    }
  }, {
    key: HandleHeaders,
    value: function value(headers) {
      this.emitHeadersEvent(headers);
    }
  }, {
    key: HandleProgress,
    value: function value(length, received) {
      this.emitProgressEvent(length, received);
    }
  }, {
    key: HandleComplete,
    value: function value() {
      this[End] = Date.now();
      this[HandleClose]();
      this.emitCompleteEvent();

      this[_PromiseMixin.PromiseMixin.Accept]();
    }
  }, {
    key: HandleError,
    value: function value(error) {
      console.warn(error);

      if (!this.emitErrorEvent(error)) {
        return this[Retry]();
      }

      return this[HandleFail](error);
    }
  }, {
    key: HandleFail,
    value: function value(error) {
      this[End] = Date.now();
      this[HandleClose]();
      this.emitFailEvent(error);
      return this[_PromiseMixin.PromiseMixin.Reject](error);
    }
  }, {
    key: HandleFirstByte,
    value: function value(received) {
      clearInterval(this[Timer]);
      this[First] = Date.now();
      this.emitFirstByteEvent(received);
    }
  }, {
    key: "emitProgressEvent",
    value: function emitProgressEvent(length, received) {
      var done = length ? received / length : 0;
      var totalTime = this.totalTime;
      var loadTime = this.loadTime;
      var waitTime = this.waitTime;
      var speed = this.speed;
      return this.dispatchEvent(new CustomEvent('progress', {
        detail: {
          length: length,
          received: received,
          done: done,
          speed: speed,
          loadTime: loadTime,
          waitTime: waitTime,
          totalTime: totalTime
        }
      }));
    }
  }, {
    key: "emitOpenEvent",
    value: function emitOpenEvent() {
      return this.dispatchEvent(new CustomEvent('open'));
    }
  }, {
    key: "emitCloseEvent",
    value: function emitCloseEvent() {
      return this.dispatchEvent(new CustomEvent('close'));
    }
  }, {
    key: "emitFirstByteEvent",
    value: function emitFirstByteEvent(received) {
      return this.dispatchEvent(new CustomEvent('firstByte', {
        detail: {
          received: received
        }
      }));
    }
  }, {
    key: "emitHeadersEvent",
    value: function emitHeadersEvent(headers) {
      return this.dispatchEvent(new CustomEvent('headers', {
        detail: {
          headers: headers
        }
      }));
    }
  }, {
    key: "emitCompleteEvent",
    value: function emitCompleteEvent() {
      return this.dispatchEvent(new CustomEvent('complete'));
    }
  }, {
    key: "emitErrorEvent",
    value: function emitErrorEvent() {
      return this.dispatchEvent(new CustomEvent('error', {
        cancelable: this[RetriesLeft] > 0
      }));
    }
  }, {
    key: "emitRetryEvent",
    value: function emitRetryEvent() {
      return this.dispatchEvent(new CustomEvent('retry', {
        cancelable: true
      }));
    }
  }, {
    key: "emitFailEvent",
    value: function emitFailEvent() {
      return this.dispatchEvent(new CustomEvent('fail'));
    }
  }, {
    key: "emitPauseEvent",
    value: function emitPauseEvent() {
      return this.dispatchEvent(new CustomEvent('pause', {
        cancelable: true
      }));
    }
  }, {
    key: "emitPausedEvent",
    value: function emitPausedEvent() {
      this.dispatchEvent(new CustomEvent('paused'));
    }
  }, {
    key: "emitUnpauseEvent",
    value: function emitUnpauseEvent() {
      return this.dispatchEvent(new CustomEvent('unpause', {
        cancelable: true
      }));
    }
  }, {
    key: "emitUnpausedEvent",
    value: function emitUnpausedEvent() {
      this.dispatchEvent(new CustomEvent('unpaused'));
    }
  }, {
    key: "emitCancelEvent",
    value: function emitCancelEvent() {
      return this.dispatchEvent(new CustomEvent('cancel', {
        cancelable: true
      }));
    }
  }, {
    key: "emitCancelledEvent",
    value: function emitCancelledEvent() {
      return this.dispatchEvent(new CustomEvent('cancelled'));
    }
  }]);

  return Elicit;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin, _PromiseMixin.PromiseMixin)); // elicit.addEventListener('open', event => console.log(event));
// elicit.addEventListener('close', event => console.log(event));
// elicit.addEventListener('firstByte', event => console.log(event));
// elicit.addEventListener('headers', event => console.log(event));
// elicit.addEventListener('complete', event => console.log(event));
// elicit.addEventListener('error', event => console.log(event));
// elicit.addEventListener('fail', event => console.log(event));
// elicit.addEventListener('pause', event => console.log(event));
// elicit.addEventListener('paused', event => console.log(event));
// elicit.addEventListener('unpause', event => console.log(event));
// elicit.addEventListener('unpaused', event => console.log(event));
// elicit.addEventListener('cancelled', event => console.log(event));
// elicit.addEventListener('cancel', event => console.log(event));


exports.Elicit = Elicit;