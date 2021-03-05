import "./polyfill/polyfill-promise";
import SMH from "../helper/show-msg-helper.js";
Promise.nextTick = function () {
    return new Promise(rs => wx.nextTick(() => rs()))
}
Promise.prototype.nextTick = function () {
    return this.then(() => Promise.nextTick());
}
Promise.prototype.showError = function (msg) {
    return this.catch(err => SMH.showToast({ title: msg || err }));
};