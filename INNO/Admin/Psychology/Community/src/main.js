import Vue from "vue";
import router from "@/plugins/router";
import "@/mixins/index.js";
import "@/global";
import 'view-design/dist/styles/iview.css';
import "@/assets";
import PageHelper from "@/helper/page-helper";
import store from "./store";
import App from "@/App";
import "@/support/polyfill/polyfill-promise.js";
// import LM from "@/helper/login-manager.js"

// 全局组件
// 组件的加载
import { installComponent } from '@/components/index';
installComponent(Vue); 
  
// 插件的加载
import { installAll } from '@/install';
installAll(Vue);

// 接口挂载
import { installHttp } from '@/helper/manager/index';
Vue.use(installHttp);

// 公共api挂载
import utils from "@/helper/utils/index";
Vue.prototype.$utils = utils;


Vue.config.productionTip = false;
router.beforeEach((to, from, next) => {
    if (PageHelper.checkLogin(to, from, next)) {
        return;
    }
    next(); 
})

new Vue({
    router,
    store,
    metaInfo(){
        return {
            meta: [
                { name: 'viewport', content: 'width=device-width, initial-scale=1 minimum-scale=1 maximum-scale=1 user-scalable=no' },
            ],
        }
    }, 
    render: h => h(App)
}).$mount("#app");

window.$Bus = new Vue({ router });
