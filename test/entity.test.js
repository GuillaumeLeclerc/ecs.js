import test from 'tape'
import Entity from '../engine/entity.js'
import Component from '../engine/component.js'
import ComponentGroup from '../engine/componentGroup.js'

const userComponent = new Component('user', {
  life: 100,
  sex: 'male'
});

const positionalComponent = new Component('positional', {
  x: 0,
  y: 0
});

test('Entities', (t) => {
  t.test('Creating Entites', (t) => {
    const t1 = new Entity();
    const t2 = new Entity();
    t.equal(t1.getId(), 0, 'the first Entity has id #1');
    t.ok(t1.getId() !== t2.getId(), 'no two entities has the same id');
    t.end();
  })

  t.test('Cloning Entities', (t) => {
    const t3 = new Entity({
      data: {
        v: 3
      }
    });

    t.equal(t3.data.v, 3, 'the values passed to the constructor are saved');
    const t4 = t3.clone();
    t.equal(t4.data.v, 3, 'the clone has the same attributes as t3');

    t.notEqual(t4, t3, 'the clone should not be the same as the original');
    t4.data.v = 5;
    t.equal(t3.data.v, 3, 'changing the clone does not change the original');
    t.end();
  });

  t.test('Editing an Entity', (t) => {
    const t1 = new Entity();
    t.equal(typeof t1.get('attr'), 'undefined', 'getting an unkonwn attributes return undefined');
    const t2 = t1.set('attr', 19);

    t.notEqual(t1 ,t2, 'setting an attribute generate a new entity');
    t.equal(t2.get('attr'), 19, 'we can retrieve the set attribute');
    t.equal(typeof t1.get('attr'), 'undefined', 'the first instance was not changed');
    t.end();
  });

  t.test('Managing components', (t) => {
    const t1 = new Entity().attach(userComponent);

    t.ok(t1.hasComponent(userComponent), 'The component was registered');
    t.ok(t1.hasComponent('user'), 'We can also use the component name instead of the component itself');
    t.equal(t1.get('user.life'), 100, 'the default values are set in the component');

    const t2 = t1.set('user.life', 101);
    t.equal(t2.get('user.life'), 101, 'We can set the value of one attribute of a component');
    t.equal(t1.get('user.life'), 100, 'The value on the original component has not changed');

    const t3 = t2.attach(userComponent);
    t.equal(t3.get('user.life'), 101, 'attaching the same component another time does not change the values');
    const t4 = t2.reattach(userComponent);
    t.equal(t4.get('user.life'), 100, 'forcing reattach reset to the default values');

    t.end();
  });

  t.test('Groups of components', (t) => {
    const group = new ComponentGroup(userComponent, positionalComponent);
    const entity = new Entity().attachGroup(group);
    t.ok(entity.hasComponent(userComponent) && 
      entity.hasComponent(positionalComponent), 'Attaching a component attach all of its subcomponents');

    const e2 = entity.set('user.life', 200);
    t.equal(e2.get('user.life'), 200, 'we can edit components from group');
    const e3 = entity.reattachGroup(group);
    t.equal(e3.get('user.life'), 100, 'Reattaching reset components to their default values');
    t.end();
  });
})
