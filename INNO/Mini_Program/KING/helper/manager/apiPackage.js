import {
  MainApi,
  UserApi,
  DstbApi,
  RegApi,
  GoodsApi,
  BuyApi,
  BrandApi,
  PayApi,
  FromApi,
  PointApi,
  PreSaleApi,
  DistributionApi,
  CollageApi,
  VsLogApi,
  SmktPayApi,
  GrassApi,
  PageApi,
  BargainApi,
  ActApi,
  SecKillApi,
  VoteApi,
  VideoShopApi,
  LiveApi
} from "./http-manager.js";

import Conf from "../../conf";
import LM from "./login-manager.js";

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
    searchApi.call(this, api);
    params = JSON.parse(JSON.stringify(params || {}));
    extra = JSON.parse(JSON.stringify(extra || {}));
    this.initParams(params, extra);  //初始化参数
    this.initOther(extra.isShowLoad != false); //loading框
    // console.log('顺序', extra.label||'', api , url, this._params , action);
    if (url && this.ApiName && this.ApiName[url]) {
      if (action.toUpperCase() == 'POST') {  //POST请求
        return this.ApiName[url]({
          data: this._params,
          other: this._other
        }).then(res => {
          return Promise.resolve(res);
        }).catch(e => {
          return Promise.reject(e);
        })
      } else {
        return this.ApiName[url]({ //GET请求
          params: this._params,
          other: this._other
        }).then(res => {
          return Promise.resolve(res);
        }).catch(e => {
          return Promise.reject(e);
        })
      }
    }
    let err = '****RunApi Error:' + api + ' 没有 ' + url;
    console.log(err);
    return Promise.reject(err);
  }
}


export const RunApi = AllApiManager.getInstance();


function searchApi(api = '') {  //匹配接口List
  switch (api) {
    case 'UserApi':
      this.ApiName = UserApi;
      return;
    case 'MainApi':
      this.ApiName = MainApi;
      return;
    case 'RegApi':
      this.ApiName = RegApi;
      return;
    case 'GoodsApi':
      this.ApiName = GoodsApi;
      return;
    case 'BuyApi':
      this.ApiName = BuyApi;
      return;
    case 'BrandApi':
      this.ApiName = BrandApi;
      return;
    case 'FromApi':
      this.ApiName = FromApi;
      return;
    case 'PayApi':
      this.ApiName = PayApi;
      return;
    case 'PointApi':
      this.ApiName = PointApi;
      return;
    case 'PreSaleApi':
      this.ApiName = PreSaleApi;
      return;
    case 'DistrApi':
      this.ApiName = DistributionApi;
      return;
    case 'CollageApi':
      this.ApiName = CollageApi;
      return;
    case 'VsLogApi':
      this.ApiName = VsLogApi;
      return;
    case 'SmktPayApi':
      this.ApiName = SmktPayApi;
      return;
    case 'GrassApi':
      this.ApiName = GrassApi;
      return;
    case 'PageApi':
      this.ApiName = PageApi;
      return;
    case 'BargainApi':
      this.ApiName = BargainApi;
      return;
    case 'ActApi':
      this.ApiName = ActApi;
      return;
    case 'SecKillApi':
      this.ApiName = SecKillApi;
      return;
    case 'VoteApi':
      this.ApiName = VoteApi;
      return;
    case 'VideoShopApi':
      this.ApiName = VideoShopApi;
      return;
    case 'LiveApi':
      this.ApiName = LiveApi;
      return;
    default:
      this.ApiName = '';
      return
  }
}

// Methods:

// let params = {  //传参
//      ... 
// };

// let extra = {  //扩充内容 //可省略 
//    diy : true   //不设默认的 userToken、brandCode
//    isShowLoad: xxx    //设置loading框   默认true  
//      ...
// };  

// 实现:
// .go(action,api,url,{params},{extra}).then().catch()