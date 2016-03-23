'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastId = 0;

var getComponentName = function getComponentName(component) {
  var name = component;
  if (typeof component.getName === 'function') {
    name = component.getName();
  }
  return name;
};

var Entity = function () {
  function Entity() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Entity);

    this.id = lastId++;
    _lodash2.default.assign(this, _lodash2.default.cloneDeep(data));
  }

  _createClass(Entity, [{
    key: 'clone',
    value: function clone() {
      var res = new Entity(this);
      lastId--;
      res.id = this.id;
      return res;
    }
  }, {
    key: 'getId',
    value: function getId() {
      return this.id;
    }
  }, {
    key: 'reattach',
    value: function reattach(component) {
      var res = this.clone();
      res[component.getName()] = component.getAttributesMap();
      return res;
    }
  }, {
    key: 'set',
    value: function set(path, value) {
      var res = this.clone();
      _lodash2.default.set(res, path, value);
      return res;
    }
  }, {
    key: 'get',
    value: function get(path) {
      return _lodash2.default.get(this, path);
    }
  }, {
    key: 'attachGroup',
    value: function attachGroup(group) {
      return _lodash2.default.reduce(group.getSubComponents(), function (entity, comp) {
        return entity.attach(comp);
      }, this);
    }
  }, {
    key: 'reattachGroup',
    value: function reattachGroup(group) {
      return _lodash2.default.reduce(group.getSubComponents(), function (entity, comp) {
        return entity.reattach(comp);
      }, this);
    }
  }, {
    key: 'attach',
    value: function attach(component) {
      if (typeof this[getComponentName(component)] === 'undefined') return this.reattach(component);else return this;
    }
  }, {
    key: 'hasComponent',
    value: function hasComponent(component) {
      return _typeof(this[getComponentName(component)]) === 'object';
    }
  }]);

  return Entity;
}();

exports.default = Entity;
