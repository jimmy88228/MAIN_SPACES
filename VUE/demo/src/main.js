import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  delimiters:['${','}'],
  render: h => h(App) //有render 不用  template
}).$mount("#app");    //有mount  不用  el

router.beforeEach((to, from, next) => {
  console.log('beforeEach 全局',to,from)
  next();
})

//等同于
// new Vue({
//   el: '#app',         //有el
//   router,
//   store,
//   components: { App },
//   template: '<App/>'  //有template
// })
 