var lastId = 0;

export default class Entity {
  constructor(data = {}) {
    this.id = lastId++;
    Object.assign(this,data);
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

  flag(flagName) {
    const res = this.clone();
    res[flagName] = true;
    return res;
  }

  deFlag(flagName) {
    const res = this.clone();
    delete res[flagName];
    return res;
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
    group.forEach((component) => {
      this.attach(component);
    });
  }

  reattachGroup(group) {
    group.forEach((component) => {
      this.reattach(component);
    });
  }

  getComponentName (component) {
    var name = component;
    if (typeof component.getName === 'function') {
      name = component.getName();
    }
    return name;
  }

  attach(component) {
    if (this.getComponentName(component)) return this.reattach(component);
    else return this;
  }

  detach(component) {
    if (this.hasComponent(component)) {
      delete this[component];
    };
  }

  hasComponent(component) {
    return typeof this[this.getComponentName(component)] === 'object';
  }

  hasFlag(flagName) {
    return this[flagName] === true;
  }
}
