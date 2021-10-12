import Cookies from 'js-cookie';

const user = {
  state: {},
  mutations: {
    logout (state, vm) {
      Cookies.remove('user');
      Cookies.remove('password');
      Cookies.remove('access');
      Cookies.remove('accessToken');

      // 清理主框架缓存信息
      window.sessionStorage.removeItem('mainFrameData');

      // 恢复默认样式
      // let themeLink = document.querySelector('link[name="theme"]');
      // themeLink.setAttribute('href', '');

      // 清空打开的页面等数据，但是保存主题数据
      let theme = '';
      if (window.localStorage.theme) {
        theme = window.localStorage.theme;
      }
      window.localStorage.clear();
      if (theme) {
        window.localStorage.theme = theme;
      }
    }
  }
};

export default user;
