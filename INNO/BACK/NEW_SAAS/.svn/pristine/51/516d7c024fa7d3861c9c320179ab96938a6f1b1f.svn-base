import Vue from 'vue';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import global from './global.js';
Vue.prototype.global = global;
import '@/directive';
import '@/filters';
// 组件的加载
import {
  installAll
} from '@/component/index';

installAll(Vue);

// 接口挂载
import { installUtils } from './libs/util.js';
Vue.use(installUtils);

new Vue({
  el: '#app',
  router: router,
  store: store,
  render: h => h(App),
  data: {
    currentPageName: ''
  },
  mounted () {
    this.currentPageName = this.$route.name;
    // 显示打开的页面的列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    this.$store.commit('updateMenulist');
  },
  created () {
    const tagsList = [];
    appRouter.map((item) => {
      if (typeof (item.children) !== 'undefined') {
        if (item.children.length <= 1) {
          tagsList.push(item.children[0]);
        } else {
          tagsList.push(...item.children);
        }
      }
    });
    this.$store.commit('setTagsList', tagsList);
  }
});
