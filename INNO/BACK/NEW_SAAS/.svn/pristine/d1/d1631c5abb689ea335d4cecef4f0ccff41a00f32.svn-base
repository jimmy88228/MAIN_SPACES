import Apis from './http-api.js';
import httpManager from './http-manager.js';
import vueUntils from './vue-utils.js';

const utils = {
  apiUrl: Apis.apiUrl,
  ...httpManager,
  ...vueUntils
};

export default utils;

export const installUtils = {
  install (Vue) {
    Vue.prototype.$util = utils;
    Vue.prototype.$ajax = httpManager.ajax;
    Vue.prototype.$api = {
      ...Apis.apiUrl
    };
  }
}
