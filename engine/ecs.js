import {createStore, combineReducers, compose} from 'redux'
import Manipulator from './entitiesManipulator.js'
import _ from 'lodash'

const SYSTEM_RUN = "ECS_ENGINE_SYSTEM_RUN";

export default class Engine {
  constructor() {
    this.systems = {};
    this.keyboardMappings = {};
    this.store = createStore(this.getReducer(), 
      window.devToolsExtension ? window.devToolsExtension() : f => f
    );
    document.onkeydown = ({keyCode}) => {
      console.log(keyCode, 'down');
      const mapping = this.keyboardMappings[keyCode];
      if (mapping) {
        const {system, once} = mapping;
        system.runNow();
        if (!once) {
          system.start();
        }
      }
    }
    document.onkeyup = ({keyCode}) => {
      console.log(keyCode, 'up');
      const mapping = this.keyboardMappings[keyCode];
      if (mapping) {
        mapping.system.stop();
      }
    }
  }

  registerSystem(system) {
    this.systems[system.getId()] = system;
  }

  dispatch(system) {
    this.store.dispatch({
      type: SYSTEM_RUN,
      systemId: system.getId()
    });
  }

  getStore () {
    return this.store;
  }

  getReducer() {
    return (previous = {}, {type, systemId}) => {
      const {entities = [], state = {}} = previous;
      if (type === SYSTEM_RUN) {
        const system = this.systems[systemId];
        if (!system) {
          throw "Unknown system " + systemId;
        } else {
          const manipulator = new Manipulator(entities);
          try {
            const newState = _.cloneDeep(state);
            const res = system.run(manipulator, state);
            if (res) return res.get();
            else return {entities:manipulator.get(), state: newState};
          } catch (e) {
            console.error("Error in System " + system.getId());
            console.error(e.message);
            console.error(e.stack);
          }
        }
      }
      return {entities, state};
    }
  }

  mapKey(code, system, once=false) {
    this.keyboardMappings[code] = {
      system,
      once
    }
  }
};
