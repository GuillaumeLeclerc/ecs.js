export default class Component {
  constructor(name, attributes) {
    this.name = name;
    this.attributes = attributes;
  }

  getName() {
    return this.name;
  }

  getAttributesMap () {
    return {...this.attributes};
  }
}
