"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EventPipe = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var EventPipe = function EventPipe(events) {
  var headers = new Headers();
  headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Cache-Control', 'no-cache');
  headers.set('Content-Type', 'text/event-stream');
  headers.set('Connection', 'keep-alive');

  var _TransformStream = new TransformStream(),
      readable = _TransformStream.readable,
      writable = _TransformStream.writable;

  var writer = writable.getWriter();
  var encoder = new TextEncoder();
  var eventSenders = [];

  var _iterator = _createForOfIteratorHelper(events),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var getEvent = _step.value;

      if (!(getEvent instanceof Promise)) {
        getEvent = Promise.resolve(getEvent);
      }

      getEvent.then(function (event) {
        var _event$type, _event$id;

        if (!event || _typeof(event) !== 'object') {
          event = {
            data: event
          };
        }

        writer.write(encoder.encode("event: ".concat((_event$type = event.type) !== null && _event$type !== void 0 ? _event$type : 'ServerEvent', "\n") + "data: ".concat(JSON.stringify(event.data), "\n") + "id: ".concat((_event$id = event.id) !== null && _event$id !== void 0 ? _event$id : Date.now(), "\n\n")));
      });
      eventSenders.push(getEvent);
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  Promise.all(eventSenders).then(function () {
    return writer.close();
  });
  return new Response(readable, {
    status: '200',
    statusText: 'OK',
    headers: headers
  });
};

exports.EventPipe = EventPipe;