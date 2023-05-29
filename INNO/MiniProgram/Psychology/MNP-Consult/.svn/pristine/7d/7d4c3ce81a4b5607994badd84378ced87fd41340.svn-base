import Vue from 'vue';
import store from './store';
import App from './App';
import "@/common/support/polyfill/polyfill-promise.js";
import { installMixins } from './mixins/index.js';
Vue.use(installMixins);

import uView from "uview-ui";
Vue.use(uView);

Vue.prototype.$store = store;

// 全局统一组件
import globalCom from './components/global-component.vue';
import pageNav from '@/components/page-nav/page-nav.vue'

Vue.component('global-com', globalCom);
Vue.component('page-nav', pageNav);

Vue.config.productionTip = false

var EventBus = new Vue();

Vue.prototype.$EventBus = EventBus;

App.mpType = 'app'
const app = new Vue({
    ...App
})

// 将api加载到Vue上 this.$api 调用; this.$util 调用
import { installUtils } from './common/util.js';
Vue.use(installUtils);

// // http拦截器，
// import httpInterceptor from '@/common/http/http.interceptor.js'
// Vue.use(httpInterceptor, app);

app.$mount()
