import _ from 'lodash'

const superRandomValue = "1231---ðđßðđłł€¶ŋđŋŋß"

const convertEntity = (manipulator, e) => {
  const working = {};
  const removed = [];
  var that = null;
  const handler = {
    get (e, component, z, t) {
      if (component === 'id') {
        return e.id;
      }
      if (component === 'toJS' || component === 'toJSON' || typeof component === 'symbol') {
        console.log('adfasdfasdf');
        return e[component];
      }
      if (component === 'remove') {
        return function () {
          manipulator.scheduleRemoval(e.id);
        }
      }

      if (!e.hasComponent(component) || removed.indexOf(component) !== -1) {
        throw "no component";
      }
      if (typeof working[component] === 'undefined') {
        const cloned = _.clone(e[component]);
        working[component] = new Proxy(cloned, {
          get (comp, path) {
            switch (path) {
              case 'getEntity':
                return () => {
                  return that;
                }
              case 'remove':
                return () => {
                  removed.push(component);
                }
              default:
                return comp[path];
            }
          }
        });
      }
      return working[component];
    },
    apply (e, x, y) {
      if(Object.keys(working).length === 0) {
        return e;
      } else {
        const res = e.clone();
        Object.assign(res, working);
        _.each(removed, (r) => {
          console.log('asdfasdf', r);
          delete res[r];
        });
        return res;
      }
    }
  }
  that =  new Proxy(e, handler);
  return that;
}

export default class Manipulator {
  constructor(entities) {
    this.source = _.map(entities, convertEntity.bind(null, this));
    this.removing = [];
  }

  scheduleRemoval(id) {
    this.removing.push(id);
  }

  applyRemovals() {
    _.remove(this.source, (e) => {
      return this.removing.indexOf(e.id) != -1;
    });
    this.removing = [];
  }

  get () {
    const res = _.map(this.source, (e) => e());
    return res;
  }

  add (e) {
    this.source.push(convertEntity.bind(null, this)(e));
    return this;
  }

  map (f) {
    const res =  _.reject(_.map(this.source, (e) => {
      try {
        return f(e);
      } catch (e) {
        return superRandomValue;
      }
    }), (v) => {
      return v === superRandomValue;
    });
    this.applyRemovals();
    return res;
  }

  forEach (f) {
     _.each(this.source, (e) => {
      try {
        f(e);
      } catch (e) { }
    });
    this.applyRemovals();
    return this;
  }

  interactions (f) {
     _.each(this.source, (e) => {
       _.each(this.source, (e2) => {
          try {
            f(e, e2);
          } catch (e) { }
       });
    });
  }

  size() {
    return this.source.length;
  }
}
