import myProxy from "../../support/proxy/index";

const MAX_BLOCKING_TIME = 5 * 1000; // 最长阻塞时间 ms

class LifeCycleController {
  static getInstance() {
    if (!LifeCycleController.instance) {
      LifeCycleController.instance = new LifeCycleController();
    }
    return LifeCycleController.instance
  }

  add(process) {
    if (typeof process !== "function") {
      console.error("LifeCycleController error: process is not a function", process)
    }
    else {
      const handleFn = () => {
        let next = this.next.bind(this);
        process(() => next && next() && (next = null));
        this.timeoutTimerId = setTimeout(() => {
          next && next() && (next = null);
        }, MAX_BLOCKING_TIME);
      };
      this.processStack.push(handleFn);
    }
  }
  
  next() {
    this.timeoutTimerId && clearTimeout(this.timeoutTimerId);
    this.pendingProcess = null;
    return this.processStack.shift();
  }
  
  processStack = new myProxy([], {set: onProcessStackSet.bind(this)}); // []
  pendingProcess = null;
  timeoutTimerId = NaN;
}

function onProcessStackSet(processStack, prop, value) {
  if (prop === "length" && typeof value === "number" && value !== 0) { // 只监听length
    if (!this.pendingProcess) {
      this.pendingProcess = processStack[0];
      setTimeout(() => {this.pendingProcess()}, 0);
    }
  }
  processStack[prop] = value;
  return true
}

export default LifeCycleController.getInstance()