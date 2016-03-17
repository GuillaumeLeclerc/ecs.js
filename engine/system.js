var lastId = 0;
export default class System {

  /**
   * @param Function code the code to run on the store
   * @param Double interval The interval between runs
   */
  constructor (engine, code) {
    this.id = lastId ++;
    this.code = code;
    this.engine = engine;
    this.engine.registerSystem(this);
  }

  /**
   * @return Int The id of the system
   */
  getId () {
    return this.id;
  }

  runNow () {
    this.engine.dispatch(this);
  }

  /**
   * Run the system on a given store
   * @param store Object redux store
   */
  run (store) {
    return this.code(store);
  }

  /**
   * @return Double The frequency of the system
   */
}
