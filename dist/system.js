"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lastId = 0;

var System = function () {

  /**
   * @param Function code the code to run on the store
   * @param Double interval The interval between runs
   */

  function System(engine, code) {
    _classCallCheck(this, System);

    this.id = lastId++;
    this.code = code;
    this.engine = engine;
    this.engine.registerSystem(this);
  }

  /**
   * @return Int The id of the system
   */


  _createClass(System, [{
    key: "getId",
    value: function getId() {
      return this.id;
    }
  }, {
    key: "runNow",
    value: function runNow() {
      this.engine.dispatch(this);
    }

    /**
     * Run the system on a given store
     * @param store Object redux store
     */

  }, {
    key: "run",
    value: function run(store) {
      return this.code(store);
    }

    /**
     * @return Double The frequency of the system
     */

  }]);

  return System;
}();

exports.default = System;
