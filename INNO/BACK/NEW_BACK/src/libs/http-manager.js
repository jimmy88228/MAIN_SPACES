import axios from 'axios';
import Cookies from 'js-cookie';
import qs from 'qs';
import Conf from '../config/index';

const httpManager = {};

// 客服 ws 地址
httpManager.kefuWs = '';

// 自动适应 https 和 http
httpManager.protocol = function () {
  return document.location.protocol == 'https:' ? 'https:' : 'http:';
};
httpManager.apiHost = Conf.API_URL;
httpManager.downloadHost = Conf.DOWNLOAD_URL;
httpManager.kefuWs = Conf.KEFUWS;
// 后台是否可注册
httpManager.canRegister = Conf.ALLOW_REGISTER;
// 显示系统图库
httpManager.canShowSystemImage = Conf.ALLOW_SHOW_SYSTEMIMAGE;
// 显示登录框特效
httpManager.showLoginBoxTx = Conf.ALLOW_SHOW_LOGINBOXTX;

// 未登录的情况下，可以访问的vue 路由
httpManager.notLoginPath = [
  'login', 'login-code', 'forget-password',
  'register', 'register-personal-user', 'register-enterprise-user'
];

httpManager.title = function (title) {
  title = title || '管理后台';
  window.document.title = title;
};

httpManager.ajax = axios.create({
  // ajax 超时时间为 60s
  baseURL: httpManager.apiHost,
  timeout: 60000
});

/* eslint-disable no-proto */
httpManager.ajax.__proto__ = axios;
/* eslint-enable */

// 拦截request,设置全局请求为ajax请求
httpManager.ajax.interceptors.request.use((config) => {
  // 把access-token 参数放入到所有的请求中
  config.headers['Authorization'] = Cookies.get('accessToken') !=null ? Cookies.get('accessToken') : '';

  if (config.method == 'get') {
    //config.params['xxx'] = 'xxx';
  }
  else {
    // 对于非GET 参数，这个参数 Content-Type 是非常重要的，否则就会导致option
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded';

    // 如果url 带 ? 那么后面就跟&
    //config.url += config.url.indexOf('?') == -1 ? '?' : '&';

    // post 的参数，必须通过 qs 转换一次，否则PHP会接收不到
    // 空數組會被直接過濾，需要設置null
    config.data = qs.stringify(config.data)
  }
  return config;
});

// 拦截响应response，并做一些错误处理
httpManager.ajax.interceptors.response.use((response) => {
  const data = response.data;
  if (typeof data === 'string') {
    // 下载类型
  } else if (!data.code) {
    // 数据变更失败，请求成功的
    const setEvent = new window.CustomEvent('httpErrorEvent', {
      detail: {
        status: 200,
        message: data.message
      }
    });
    // 注册到setEvent中
    window.dispatchEvent(setEvent);
  }
  // return response.data; ???
  return response;
},
(err) => {
  // 这里是返回状态码不为200时候的错误处理
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误';
        break;

      case 401:
        err.message = '未授权，请登录';
        break;

        // 自定义http code 430
      case 430:
        err.message = '访问权限不足！';
        break;

        // 审核中的用户,跳转到企业审核页面
      case 431:
        err.message = '账号在审核中';
        break;

        // logout 退出登录 token 失效的情况
      case 432:
        Cookies.remove('accessToken');
        Cookies.remove('locking');
        window.location = '/login';
        break;

      case 403:
        err.message = '拒绝访问';
        break;

      case 404:
        err.message = '请求地址出错';
        break;

      case 408:
        err.message = '请求超时';
        break;

      case 500:
        err.message = '服务器内部错误';
        break;

      case 501:
        err.message = '服务未实现';
        break;

      case 502:
        err.message = '网关错误';
        break;

      case 503:
        err.message = '服务不可用';
        break;

      case 504:
        err.message = '网关超时';
        break;

      case 505:
        err.message = 'HTTP版本不受支持';
        break;

      default:
    }

    // 发送自定义事件
    const setEvent = new window.CustomEvent('httpErrorEvent', {
      detail: {
        status: err.response.status,
        message: err.message
      }
    });
    // 注册到setEvent中
    window.dispatchEvent(setEvent);

    return Promise.reject(err);
  }
  // 网络错误
  if (err) {
    // 发送自定义事件
    const setEvent = new window.CustomEvent('httpErrorEvent', {
      detail: {
        status: '哎呀！请求出错了',
        message: '访问地址不存在。'
      }
    });
    // 注册到setEvent中
    window.dispatchEvent(setEvent);

    return Promise.reject(err);
  }
});
export default httpManager;
