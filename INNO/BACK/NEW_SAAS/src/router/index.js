import Vue from 'vue';
import iView from 'view-design';
import util from '../libs/util';
import VueRouter from 'vue-router';
import Cookies from 'js-cookie';
import { routers, otherRouter, appRouter } from './router';

Vue.use(VueRouter);

/**
 * 重写路由的push方法；这里是防止点击两次菜单发生两次push 同一个路由报错
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
	return routerPush.call(this, location).catch(error=> error)
}

// 路由配置
const RouterConfig = {
  // 启用路由的history 模式
  mode: 'history',
  routes: routers
};

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
  // 加载条
  iView.LoadingBar.start();
  // 页面的title 标题
  util.title(to.meta.title + (util.cache.get('adminSystemName') != null ? ' - ' + util.cache.get('adminSystemName') : ''));

  // 判断当前是否是锁定状态
  if (Cookies.get('locking') === '1' && to.name !== 'locking') {
    next({
      replace: true,
      name: 'locking'
    });
  } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
    next(false);
  } else {
    // 如果发现 user 或 accessToken 这个cookie 不存在，那么路由会跳到登录页，util.notLoginPath 过滤掉 可以非登录页面
    if (!Cookies.get('accessToken') && util.notLoginPath.indexOf(to.name) == -1) {
      // 跳转到登录页面
      next({ name: 'login' });
    } else if (Cookies.get('accessToken') && Cookies.get('user') && to.name === 'login') {
      // 判断是否已经登录且前往的是登录页
      util.title();

      // 跳到去主页
      next({ name: 'home_index' });
    } else {
      const curRouterObj = util.getRouterObjByName([otherRouter, ...appRouter], to.name);
      // 需要判断权限的路由
      if (curRouterObj && curRouterObj.access !== undefined) {
        if (curRouterObj.access === parseInt(Cookies.get('access'))) {
          util.toDefaultPage([otherRouter, ...appRouter], to.name, router, next); // 如果在地址栏输入的是一级菜单则默认打开其第一个二级菜单的页面
        } else {
          next({
            replace: true,
            name: 'error-403'
          });
        }
      } else {
        // 没有配置权限的路由, 直接通过
        util.toDefaultPage([...routers], to.name, router, next);
      }
    }
  }
});

router.afterEach((to) => {
  util.openNewPage(router.app, to.name, to.params, to.query);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});
// beforeEach(进行权限判断, 标题更改, 进度条开始加载) => beforeRouteUpdate(动态参数的路径 /foo/:id, 重用组件才调用) => beforeEnter => beforeRouteEnter => beforeResolve => afterEach(进度条结束) => beforeRouteLeave(离开路由进行提示)