import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import pages from './modules/pages';
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    //
  },
  mutations: {
    //
  },
  actions: {

  },
  modules: {
    app,
    pages
  }
});

export default store;
