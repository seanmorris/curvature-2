"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RtcClient = void 0;

var _Mixin = require("curvature/base/Mixin");

var _EventTargetMixin = require("curvature/mixin/EventTargetMixin");

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

var RtcClient = /*#__PURE__*/function (_Mixin$with) {
  _inherits(RtcClient, _Mixin$with);

  var _super = _createSuper(RtcClient);

  function RtcClient(rtcConfig) {
    var _this;

    _classCallCheck(this, RtcClient);

    _this = _super.call(this);
    _this.peerClient = new RTCPeerConnection(rtcConfig);
    _this.peerClientChannel = _this.peerClient.createDataChannel("chat");

    _this.peerClientChannel.addEventListener('open', function (event) {
      var openEvent = new CustomEvent('open', {
        detail: event.data
      });
      openEvent.originalEvent = event;

      _this.dispatchEvent(openEvent);

      _this.connected = true;
    });

    _this.peerClientChannel.addEventListener('close', function (event) {
      var closeEvent = new CustomEvent('close', {
        detail: event.data
      });
      closeEvent.originalEvent = event;

      _this.dispatchEvent(closeEvent);

      _this.connected = false;
    });

    _this.peerClientChannel.addEventListener('message', function (event) {
      var messageEvent = new CustomEvent('message', {
        detail: event.data
      });
      messageEvent.originalEvent = event;

      _this.dispatchEvent(messageEvent);
    });

    return _this;
  }

  _createClass(RtcClient, [{
    key: "send",
    value: function send(input) {
      this.peerClientChannel && this.peerClientChannel.send(input);
    }
  }, {
    key: "close",
    value: function close() {
      this.peerClientChannel && this.peerClientChannel.close();
    }
  }, {
    key: "offer",
    value: function offer() {
      var _this2 = this;

      this.peerClient.createOffer().then(function (offer) {
        _this2.peerClient.setLocalDescription(offer);
      });
      var candidates = new Set();
      return new Promise(function (accept) {
        _this2.peerClient.addEventListener('icecandidate', function (event) {
          if (!event.candidate) {
            return;
          } else {
            console.log(event.candidate);
            candidates.add(event.candidate);
          }

          accept(_this2.peerClient.localDescription);
        });
      });
    }
  }, {
    key: "accept",
    value: function accept(answer) {
      var session = new RTCSessionDescription(answer);
      this.peerClient.setRemoteDescription(session);
    }
  }]);

  return RtcClient;
}(_Mixin.Mixin["with"](_EventTargetMixin.EventTargetMixin));

exports.RtcClient = RtcClient;
RtcClient.js;