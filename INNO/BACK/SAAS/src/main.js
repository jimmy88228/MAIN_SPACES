import "@/install";
import Vue from "vue";
import router from "@/plugins/router";
import "@/mixin";
import "@/assets";
import "@/global";
import PageHelper from "@/helper/page-helper";
import store from "@/store";

import App from "@/App";

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
    if (PageHelper.checkLogin(to, from, next)) {
        return;
    }
    next();
});
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");

window.$Bus = new Vue({ router });
