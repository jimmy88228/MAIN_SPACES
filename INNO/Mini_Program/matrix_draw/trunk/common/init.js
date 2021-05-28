import "./support/polyfill/polyfill-promise";
import "./base/base-cps-behavior";
import "./base/base-page";
import "./base/base-paging-behavior";
import "./base/base-paging-page";
import "./anim/anim";

import Smm from "./helper/show-msg-helper";

Promise.nextTick = function () {
    return new Promise(rs => wx.nextTick(() => rs()))
}


Promise.prototype.nextTick = function () {
    return this.then(() => Promise.nextTick());
}

Promise.prototype.showError = function (msg) {
    return this.catch(err => Smm.showToast({ title: msg || err }));
};