"use strict";
/**
 * 去除等号两侧的空格
 *
 * @param {string} str
 * @returns {string}
 */
function removeEqualSpace(str) {
    return str.replace(/\s*\=\s*/g, '=');
}
exports.removeEqualSpace = removeEqualSpace;
/**
 * 修正长度大于2的空格，修正为1
 *
 * @param {string} str
 * @returns {string}
 */
function removeMultiSpace(str) {
    return str.replace(/\s{2,}/g, " ");
}
exports.removeMultiSpace = removeMultiSpace;
/**
 * 移除所有的空格
 *
 * @export
 * @param {string} str
 * @returns {string}
 */
function removeAllSpace(str) {
    return str.replace(/\s*/g, '');
}
exports.removeAllSpace = removeAllSpace;
