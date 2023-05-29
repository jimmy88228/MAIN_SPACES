import Conf from "../../conf";
import LM from "../manager/login-manager.js";
import * as Api from "../manager/http-manager.js";

class ApiBase {
  constructor() {
    this._params = {};
    this._other = {};
    this.ApiName = '';
  }

  initParams(params = {}, extra = {}) {
    params = JSON.parse(JSON.stringify(params || {}));
    this._params = params || {};
    if (!extra.diy) {
      this._params.userToken = LM.userToken;
      this._params.brandCode = Conf.BRAND_CODE;
    }
    return this._params;
  }

  initOther(boolean = true) {
    this._other = {
      isShowLoad: boolean
    }
  }

  checkAction(action = '') {
    if (!action) {
      return false;
    }
    if (action.toUpperCase() == 'POST' || action.toUpperCase() == 'GET') {
      return true;
    } else {
      return false;
    }
  }
}

class AllApiManager extends ApiBase {
  static getInstance() {
    if (!AllApiManager.instance) {
      AllApiManager.instance = new AllApiManager();
    }
    return AllApiManager.instance;
  }

  constructor() {
    super();
  } 
  go(action = 'GET', api = '', url = '', params = {}, extra = {}) {  //默认GET请求， action、extra可省略
    let check = this.checkAction(action);
    if (!check) {
      action = 'GET';
      api = arguments[0] || '';
      url = arguments[1] || '';
      params = arguments[2] || {};
      extra = arguments[3] || {};
    }
    this.ApiName = searchApi(api);
    params = JSON.parse(JSON.stringify(params || {}));
    extra = JSON.parse(JSON.stringify(extra || {}));
    this.initParams(params, extra);  //初始化参数
    this.initOther(extra.isShowLoad != false); //loading框
    if (url && this.ApiName && this.ApiName[url]) {
      if (action.toUpperCase() == 'POST') {  //POST请求
        return this.ApiName[url]({
          data: this._params,
          other: this._other
        }).then(res => {
          if(res.code == '1' || extra.resolve){
            return Promise.resolve(res);
          }
          return Promise.reject(res);
        }).catch(e => {
          return Promise.reject(e);
        })
      } else {
        return this.ApiName[url]({ //GET请求
          params: this._params,
          other: this._other
        }).then(res => {
          if(res.code == '1' || extra.resolve){
            return Promise.resolve(res);
          }
          return Promise.reject(res);
        }).catch(e => {
          return Promise.reject(e);
        })
      }
    }
    let err = '* Error:' + api + '--API没有URL--' + url;
    console.log(err);
    return Promise.reject(err);
  }
}


export default AllApiManager.getInstance();


function searchApi(apiName = '') {  //匹配接口List
  return Api[apiName] || ""; 
}

// 页面基于http-manager 不用再维护

// README:
// let params = {  //传参
//      ... 
// }; 
// let extra = {  //扩充内容 //可省略 
//    diy : true   //不设默认的 userToken、brandCode
//    isShowLoad: xxx    //设置loading框   默认true  
//      ...
// };   
// 调用:
// go(action,api,url,{params},{extra}).then().catch()