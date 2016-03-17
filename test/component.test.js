import test from 'tape'
import Component from '../engine/component.js'
import _ from 'lodash'

test('Component', (t) => {

  const user = new Component('user', {
    life: 100,
    sex: 'male'
  });

  t.equal(user.getName(), 'user', 'the name of the component is correct');

  const attributes = Object.keys(user.getAttributesMap());
  t.deepEqual(_.difference(attributes, ['life', 'sex']), [], 'The attributes of the component are the same as the one we set');

  t.equal(user.getAttributesMap().life, 100, 'the default value is correct');

  t.end();
});
