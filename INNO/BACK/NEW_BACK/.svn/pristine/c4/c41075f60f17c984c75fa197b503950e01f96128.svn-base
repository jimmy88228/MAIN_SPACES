let apiHost, downloadHost, kefuWs;
let canRegister = false;
let canShowSystemImage = false;
let protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
if (document.location.port == '' || document.location.port == 80) {
  // 80 端口
  if (document.location.hostname == 'devadmincenter.innourl.com') {
    // 188测试环境
    apiHost = protocol + '//devadminwebapi.innourl.com/ba_v1';
    downloadHost = protocol + '//devadminwebapi.innourl.com';
    kefuWs = 'ws://172.20.0.188:3400/';
  } else if (document.location.hostname == 'devmatrixadmin.innourl.cn') {
    // 188matrix 测试环境
    apiHost = protocol + '//devmatrixadminapi.innourl.cn/ba_v1';
    downloadHost = protocol + '//devmatrixadminapi.innourl.cn';
  } else if (document.location.hostname == 'admincenter.igoso.com.cn') {
    // goso 正式环境
    // 请求接口配置
    apiHost = protocol + '//adminwebapi.igoso.com.cn/ba_v1';
    downloadHost = protocol + '//adminwebapi.igoso.com.cn';
    kefuWs = 'ws://118.31.59.32:3400/';
  } else if (document.location.hostname == 'admincenter.innourl.cn') {
    // 新saas 的正式环境
    // 请求接口配置
    apiHost = protocol + '//admincenterapi.innourl.cn/ba_v1';
    downloadHost = protocol + '//admincenterapi.innourl.cn';
    kefuWs = 'ws://49.235.44.152:3400/';
  } else if (document.location.hostname == 'admincenter.highwavesports.com') {
    // 劲浪体育
    // 请求接口配置
    apiHost = protocol + '//adminwebapi.highwavesports.com/ba_v1';
    downloadHost = protocol + '//adminwebapi.highwavesports.com';
    kefuWs = 'ws://39.104.177.253:3400/';
  } else if (document.location.hostname == 'admincenter.chinakingking.com') {
    // 金王
    // 请求接口配置
    apiHost = protocol + '//adminwebapi.chinakingking.com/ba_v1';
    downloadHost = protocol + '//adminwebapi.chinakingking.com';
    kefuWs = 'ws://39.105.18.29:3400/';
  } else if( document.location.hostname == 'proadmincenter.innourl.com' ){
    // 百家好
    apiHost = protocol + '//proadminwebapi.innourl.com/ba_v1';
    downloadHost = protocol + '//proadminwebapi.innourl.com';
    kefuWs = 'ws://172.20.0.181:3400/';
  }
} else if (document.location.hostname == '10.1.1.40') {
  // le的测试环境
  // 请求接口配置
  apiHost = protocol + '//devadminwebapi.innourl.com/ba_v1';
  downloadHost = protocol + '//devadminwebapi.innourl.com';
  kefuWs = 'ws://172.20.0.188:3400/';
} else if( document.location.port == 8099 ){
	// 小程序矩阵的测试环境
	// 请求接口配置
	apiHost = protocol + '//matrix.saas2.cc/ba_v1';
	downloadHost = protocol + '//matrix.saas2.cc';
} else {
  // 开发环境
  // 请求接口配置
  apiHost = protocol + '//webapi.saas2.cc/ba_v1';
  downloadHost = protocol + '//webapi.saas2.cc';
  kefuWs = 'ws://172.20.0.188:3400/';
}
export default {
    PAGE_START: 1,
    PAGE_SIZE_DEF: 20,
    PAGE_SIZE_OPTS: [10, 20, 50],
    // 后台是否可注册
    ALLOW_REGISTER: canRegister,
    // 显示系统图库
    ALLOW_SHOW_SYSTEMIMAGE: canShowSystemImage,
    // 显示登录框特效
    ALLOW_SHOW_LOGINBOXTX: true,
    API_URL: apiHost,
    DOWNLOAD_URL: downloadHost,
    KEFUWS: kefuWs
}
