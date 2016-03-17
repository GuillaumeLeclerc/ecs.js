import _ from 'lodash'
var lastId = 0;

const getComponentName = (component) => {
  var name = component;
  if (typeof component.getName === 'function') {
    name = component.getName();
  }
  return name;
}

export default class Entity {
  constructor(data = {}) {
    this.id = lastId++;
    _.assign(this,_.cloneDeep(data));
  }

  clone() {
    const res = new Entity(this);
    lastId--;
    res.id = this.id;
    return res;
  }

  getId() {
    return this.id;
  }

  reattach(component) {
    const res = this.clone();
    res[component.getName()] = component.getAttributesMap();
    return res;
  }

  set(path, value) {
    const res = this.clone();
    _.set(res, path, value);
    return res;
  }

  get(path) {
    return _.get(this, path);
  }

  attachGroup(group) {
    return _.reduce(group.getSubComponents(), (entity, comp) => {
      return entity.attach(comp);
    }, this);
  }

  reattachGroup(group) {
    return _.reduce(group.getSubComponents(), (entity, comp) => {
      return entity.reattach(comp);
    }, this);
  }


  attach(component) {
    if (typeof this[getComponentName(component)] === 'undefined') return this.reattach(component);
    else return this;
  }

  hasComponent(component) {
    return typeof this[getComponentName(component)] === 'object';
  }
}
