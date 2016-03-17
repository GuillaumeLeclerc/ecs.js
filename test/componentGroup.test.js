import ComponentGroup from '../engine/componentGroup.js'
import Component from '../engine/component.js'

import test from 'tape'

test('ComponentGroup', (t) => {

  const c1 = new Component('user', {
    life: 100
  });

  const c2 = new Component('living', {
  });

  const group = new ComponentGroup(c1, c2);

  t.equal(group.getSubComponents().length, 2, 'the correct number of components has been passed');

  const got = group.getSubComponents()[0];
  t.deepEqual(got.getAttributesMap(), {
    life: 100
  }, 'the user object has been passed');
  t.end()
});
