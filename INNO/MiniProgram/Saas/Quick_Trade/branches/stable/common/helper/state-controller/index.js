import statesData from "./states/index";
import {ObjectIsIncludeAndEqual} from "./utils";
import myProxy from "../../support/proxy/index";

/* 
  调用: 
    if (App.SC.checkIf({isLogin: 1})) {
      this.setData({isLogin: true})
    } else {
      App.SC.waitFor({isLogin: 1}, {instance: this, removeInLifeCycle: "afterOnHide"})
        .then(res => {
          console.log('success', res)
        })
    }
*/

class StateController {
  static getInstance() {
    if (!StateController.instance) {
      StateController.instance = new StateController();
    }
    return StateController.instance
  }

  constructor() {

  }

  checkIf(states) {
    return ObjectIsIncludeAndEqual(this.states, states);
  }

  waitFor(
    states,
    options = {
      instance: null, // 实例(App, Page, component)
      removeInLifeCycle: "", // 在这个实例的什么阶段卸载监听(依赖实例上的inLifeCycle)
    }
  ) {
    const executerPromise = createCheckStateProcess.call(this, states, options);
    return executerPromise
  }

  checkStateChangeAndUpdate(stateName = "") { // 传入stateName就值查该state的变化，不传则检查所有
    let states = this.states;
    let subscriptions = this.subscriptions || [];
    A: for (let index = 0; index < subscriptions.length; index++) {
      let sub = subscriptions[index] || {};
      let {states: expectedStates = {}, handler = {}} = sub;
      if (stateName && expectedStates[stateName] === undefined) continue A;
      let expectedStatesKeys = Object.keys(expectedStates);
      B: for (let key of expectedStatesKeys) {
        let expectedState = expectedStates[key];
        let currentState = states[key];
        if (expectedState !== currentState) continue A;
      }
      console.log("resolve", handler)
      handler.resolve && handler.resolve(states);
      subscriptions.splice(index, 1); // resolve后删掉
      index--;
    }
  }

  checkAndRemoveSub(instance = null) {
    let subscriptions = this.subscriptions || [];
    if (!subscriptions.length) return;
    let timer = setTimeout(() => {
      for (let index = 0; index < subscriptions.length; index++) {
        let subscription = subscriptions[index] || {}, 
          options = subscription.options || {},
          {instance: ins, removeInLifeCycle: rem} = options;
        if (ins === instance && instance.inLifeCycle === rem) {
          subscriptions.splice(index, 1);
          index--;
        }
      }
      clearTimeout(timer);
      timer = null;
    }, 0)
  }

  subscriptions = [];
  states = new myProxy(statesData, {get: stateGetter.bind(this), set: stateSetter.bind(this)}); // {}
}


function createCheckStateProcess(states, options = {}) {
  let sub;
  const checkStatePromise = new Promise((resolve, reject) => {
    sub = {
      states: JSON.parse(JSON.stringify(states)),
      handler: {
        resolve,
        reject
      },
      options
    }
    this.subscriptions.push(sub);
  })
  .finally(() => { // 手动垃圾回收
    sub = states = options = null;
  })

  return checkStatePromise
}

function stateGetter(states, prop) {
  let target = states[prop];
  if (typeof target === "function") {
    return target.call(states);
  }
  return states[prop];
}

function stateSetter(states, prop, value) {
  states[prop] = value;
  try {this.checkStateChangeAndUpdate()} 
  catch (error) {
    console.log("checkStateChangeAndUpdate报错: ", error);
  }
  return true;
}

export default StateController.getInstance();