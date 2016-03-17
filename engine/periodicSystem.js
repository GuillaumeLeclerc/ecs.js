import System from './system.js'
export default class PeriodicSystem extends System{
  constructor (engine, code, interval) {
    super(engine, code);
    this.interval = interval;
    this.intervalId = null;
  }

  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(this.runNow.bind(this), this.interval);
    }
  }
  
  stop() {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
}
