import test from 'tape'
import {PeriodicSystem, Entity, Component, System, ECS} from '../engine/main.js'

const engine = new ECS();

const userComponent = new Component('user', {
  life: 100
});


test('Systems', (t) => {

  t.test('Running basic system', (t) => {
    t.plan(1);
    t.timeoutAfter(100);
    const System1 = new System(engine, () => {
      t.ok(true, 'The system has run')
    });
    System1.runNow();
  });

  t.test('Running multiple time a basic system', (t) => {
    t.plan(1);
    var count = 0;
    const System2 = new System(engine, () => count++);
    System2.runNow();
    System2.runNow();
    System2.runNow();
    setTimeout(() => {
      t.equal(count, 3, 'The test was run the correct number of times');
    }, 50);
  });

  t.test('Systems can access Data', (t) => {
    const engine2 = new ECS();
    t.plan(3)
    const Adder = new System(engine2, (entities) => {
      t.ok(true, 'Adder system got called');
      entities.add(new Entity().attach(userComponent).set('user.life', 155));
    });
    Adder.runNow();
    
    const Checker = new System(engine2, (entities) => {
      entities.forEach(({user}) => t.equal(user.life, 155, 'The non-default value was passed to the entity list'))
    });

    setTimeout(() => {
      const {entities} = engine2.getStore().getState();
      t.equal(entities.length, 1, 'The store inside the engine contains the correct number of entities');
    }, 50);

    Checker.runNow();
  });

  t.test('Errors in systems does not crash the whole engine', (t) => {
    const buggy = new System(engine, () => {
      throw "hoho"
    });
    t.plan(2);
    t.doesNotThrow(() => {
      buggy.runNow();
    });

    const workingFine = new System(engine, () => {
      t.ok(true, 'The correct system still runs fine');
    });
    workingFine.runNow();
  });

  t.test('Trying to forge fake events makes the engine crash', (t) => {
    const store = engine.getStore();
    t.throws(() => {
      store.dispatch({
        type: 'ECS_ENGINE_SYSTEM_RUN',
        systemId: -1
      });
    });
    t.end();
  });

  t.test('Periodic Systems', (t) => {
    t.plan(2);
    var count = 0;
    const syst = new PeriodicSystem(engine, () => {
      count++;
    }, 10);
    syst.start();
    setTimeout(() => {
      syst.stop();
      t.equal(count, 5, 'The system has been running the correct number of times');
    }, 55);

    setTimeout(() => {
      t.equal(count, 5, 'The system has not run after we stopped it');
    }, 80);
  });
  t.end();
});
