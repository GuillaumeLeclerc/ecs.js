'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var superRandomValue = "1231---ðđßðđłł€¶ŋđŋŋß";

var convertEntity = function convertEntity(manipulator, e) {
  var working = {};
  var removed = [];
  var that = null;
  var handler = {
    get: function get(e, component, z, t) {
      if (component === 'id') {
        return e.id;
      }
      if (component === 'toJS' || component === 'toJSON' || (typeof component === 'undefined' ? 'undefined' : _typeof(component)) === 'symbol') {
        console.log('adfasdfasdf');
        return e[component];
      }
      if (component === 'remove') {
        return function () {
          manipulator.scheduleRemoval(e.id);
        };
      }

      if (!e.hasComponent(component) || removed.indexOf(component) !== -1) {
        throw "no component";
      }
      if (typeof working[component] === 'undefined') {
        var cloned = _lodash2.default.clone(e[component]);
        working[component] = new Proxy(cloned, {
          get: function get(comp, path) {
            switch (path) {
              case 'getEntity':
                return function () {
                  return that;
                };
              case 'remove':
                return function () {
                  removed.push(component);
                };
              default:
                return comp[path];
            }
          }
        });
      }
      return working[component];
    },
    apply: function apply(e, x, y) {
      if (Object.keys(working).length === 0) {
        return e;
      } else {
        var _ret = function () {
          var res = e.clone();
          Object.assign(res, working);
          _lodash2.default.each(removed, function (r) {
            console.log('asdfasdf', r);
            delete res[r];
          });
          return {
            v: res
          };
        }();

        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
      }
    }
  };
  that = new Proxy(e, handler);
  return that;
};

var Manipulator = function () {
  function Manipulator(entities) {
    _classCallCheck(this, Manipulator);

    this.source = _lodash2.default.map(entities, convertEntity.bind(null, this));
    this.removing = [];
  }

  _createClass(Manipulator, [{
    key: 'scheduleRemoval',
    value: function scheduleRemoval(id) {
      this.removing.push(id);
    }
  }, {
    key: 'applyRemovals',
    value: function applyRemovals() {
      var _this = this;

      _lodash2.default.remove(this.source, function (e) {
        return _this.removing.indexOf(e.id) != -1;
      });
      this.removing = [];
    }
  }, {
    key: 'get',
    value: function get() {
      var res = _lodash2.default.map(this.source, function (e) {
        return e();
      });
      return res;
    }
  }, {
    key: 'add',
    value: function add(e) {
      this.source.push(convertEntity.bind(null, this)(e));
      return this;
    }
  }, {
    key: 'map',
    value: function map(f) {
      var res = _lodash2.default.reject(_lodash2.default.map(this.source, function (e) {
        try {
          return f(e);
        } catch (e) {
          return superRandomValue;
        }
      }), function (v) {
        return v === superRandomValue;
      });
      this.applyRemovals();
      return res;
    }
  }, {
    key: 'forEach',
    value: function forEach(f) {
      _lodash2.default.each(this.source, function (e) {
        try {
          f(e);
        } catch (e) {}
      });
      this.applyRemovals();
      return this;
    }
  }, {
    key: 'interactions',
    value: function interactions(f) {
      var _this2 = this;

      _lodash2.default.each(this.source, function (e) {
        _lodash2.default.each(_this2.source, function (e2) {
          try {
            f(e, e2);
          } catch (e) {}
        });
      });
    }
  }, {
    key: 'size',
    value: function size() {
      return this.source.length;
    }
  }]);

  return Manipulator;
}();

exports.default = Manipulator;
