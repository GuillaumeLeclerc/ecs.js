import _ from 'lodash'

export default class ComponentGroup {
  constructor() {
    this.components = _.values(arguments);
  }

  getSubComponents() {
    return this.components;
  }
}
