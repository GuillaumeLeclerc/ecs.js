'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _system = require('./system.js');

var _system2 = _interopRequireDefault(_system);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var PeriodicSystem = function (_System) {
  _inherits(PeriodicSystem, _System);

  function PeriodicSystem(engine, code, interval) {
    _classCallCheck(this, PeriodicSystem);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PeriodicSystem).call(this, engine, code));

    _this.interval = interval;
    _this.intervalId = null;
    return _this;
  }

  _createClass(PeriodicSystem, [{
    key: 'start',
    value: function start() {
      if (this.intervalId === null) {
        this.intervalId = setInterval(this.runNow.bind(this), this.interval);
      }
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
        this.intervalId = null;
      }
    }
  }]);

  return PeriodicSystem;
}(_system2.default);

exports.default = PeriodicSystem;
