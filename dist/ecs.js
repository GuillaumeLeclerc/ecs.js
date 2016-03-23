'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = require('redux');

var _entitiesManipulator = require('./entitiesManipulator.js');

var _entitiesManipulator2 = _interopRequireDefault(_entitiesManipulator);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SYSTEM_RUN = "ECS_ENGINE_SYSTEM_RUN";

var Engine = function () {
  function Engine() {
    _classCallCheck(this, Engine);

    this.systems = {};
    this.store = (0, _redux.createStore)(this.getReducer());
  }

  _createClass(Engine, [{
    key: 'registerSystem',
    value: function registerSystem(system) {
      this.systems[system.getId()] = system;
    }
  }, {
    key: 'dispatch',
    value: function dispatch(system) {
      this.store.dispatch({
        type: SYSTEM_RUN,
        systemId: system.getId()
      });
    }
  }, {
    key: 'getStore',
    value: function getStore() {
      return this.store;
    }
  }, {
    key: 'getReducer',
    value: function getReducer() {
      var _this = this;

      return function () {
        var previous = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var _ref = arguments[1];
        var type = _ref.type;
        var systemId = _ref.systemId;
        var _previous$entities = previous.entities;
        var entities = _previous$entities === undefined ? [] : _previous$entities;
        var _previous$state = previous.state;
        var state = _previous$state === undefined ? {} : _previous$state;

        if (type === SYSTEM_RUN) {
          var system = _this.systems[systemId];
          if (!system) {
            throw "Unknown system " + systemId;
          } else {
            var manipulator = new _entitiesManipulator2.default(entities);
            try {
              var newState = _lodash2.default.cloneDeep(state);
              system.run(manipulator, state);
              return { entities: manipulator.get(), state: newState };
            } catch (e) {
              console.error("Error in System " + system.getId());
              console.error(e.message);
              console.error(e.stack);
            }
          }
        }
        return { entities: entities, state: state };
      };
    }
  }]);

  return Engine;
}();

exports.default = Engine;
;
