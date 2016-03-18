import {Component, EntitiesManipulator, Entity} from '../engine/main.js'
import test from 'tape'
import _ from 'lodash'

const user = new Component('user', {
  life: 100
});

const flower = new Component('flower', {
  color: 'red',
  type: 'rose'
});

const tree = new Component('tree', {
  leaves: 12
});

const entities = [
  new Entity().attach(user).set('user.life', 200),
  new Entity().attach(user),
  new Entity().attach(tree),
  new Entity().attach(tree),
  new Entity().attach(tree)
]

test('EntitiesManipulator', (t) => {
  const manip = new EntitiesManipulator(entities);

  t.equal(manip.size(), entities.length, 'the length is correct');

  t.test('Iterating', (t) => {
    var nb = 0;
    manip.forEach(() => { nb++; });
    t.equal(nb, entities.length, 'we iterate over all entities if there are no conditions');

    nb = 0;
    manip.forEach(({user}) => { nb++; });
    t.equal(nb, 2, 'we iterate only over the correct entities if we set a condition');

    nb = 0;
    manip.forEach(({tree}) => { nb++; });
    t.equal(nb, 3, 'we iterate only over the correct entities if we set a condition');

    nb = 0;
    manip.interactions(({user}, {tree}) => {
      nb ++;
    });

    t.equal(nb, 6, 'We iterate over the whole cartesian product when doing an interaction');
    t.end();
  });

  t.test('Adding', (t) => {
    const manip2 = new EntitiesManipulator(entities);
    manip2.add(new Entity().attach(flower));
    t.equal(manip2.size(), entities.length + 1, 'the size is updated when adding');
    var nb = 0;
    manip2.forEach(({flower}) => nb++);
    t.equal(nb, 1, 'We can iterate over added elements');
    t.end();
  });

  t.test('Extracting', (t) => {
    const manip2 = new EntitiesManipulator(entities);
    const result = manip2.get();
    t.equal(result.length, manip2.size(), 'We extract as many entities as there are in the manipulator');
    t.ok(_.every(result, (r) => {
      return r instanceof Entity;
    }), 'We extracted only entities');
    t.end();
  });

  t.test('Mapping', (t) => {
    const manip2 = new EntitiesManipulator(entities);
    const lifes = manip2.map(({user}) => user.life);
    t.equal(_.difference([100, 200], lifes).length, 0, 'We extracted the correct information with the map ');

    t.ok(_.every(manip2.map(({id}) => id), _.isInteger), 'all ids are integers');
    t.end();
  });

  t.test('Editing on the fly', (t) => {
    const manip2 = new EntitiesManipulator(entities);
    const manip3 = new EntitiesManipulator(entities);
    const manip4 = new EntitiesManipulator(entities);
    manip2.forEach(({user}) => user.life = 500);

    var sum = 0;
    manip2.forEach(({user}) => sum += user.life);
    t.equal(sum, 1000, 'The values were edited');
    var sum = 0;
    manip3.forEach(({user}) => sum += user.life);
    t.equal(sum, 300, 'The values were not modified inside other manipulators');
    const res = manip2.get();
    t.ok(_.find(res, {user: {life: 500}}), 'we can find the modified component after extraction');

    manip2.forEach(({user}) => user.remove());
    var sum = 0;
    manip2.forEach(({user}) => sum += user.life);
    t.equal(sum, 0, 'user components were removed');
    manip3.forEach(({user}) => sum += user.life);
    t.equal(sum, 300, 'The values were not modified inside other manipulators');
    const res2 = manip2.get();
    t.notOk(_.find(res2, (e) => typeof e.user !== 'undefined'), 'there are no user component left');

    manip4.forEach(({tree}) => tree.getEntity().remove());
    const got = manip4.get();
    t.equal(manip4.size(), 2, 'Entities were completely removed');

    var count = 0;
    manip3.forEach((o) => {
      o.toJSON;
      count++;
    });
    t.equal(count, manip3.size(), 'calling toJSON does not throw exception');

    t.end();
  });

  t.end();
});



