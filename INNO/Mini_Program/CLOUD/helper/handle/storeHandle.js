import {
  CL_UserApi
} from "../manager/http-manager.js"
import StorageH from "../handle/storageHandle.js";
import SHP from "../handle/scanHandleParams.js";
import AS from "../manager/authorize-set";
import WxApi from "../../support/tools/wx-api-promise.js";
import Conf from "../../conf";
import WXMAP_SDK from "./wxmap-sdk";
import EB from "../../support/tools/event-bus.js";
import SMH from "../../helper/show-msg-helper.js"
const STORE_PATH = "pages/micro_mall/stores/changeStore/changeStore";
const STORE_KEY = "STORE_STORAGE";

const limitUnHold = [
  STORE_PATH, 
  "pages/micro_mall/agreet_page/agreet",
  "pages/micro_mall/articles/agreet/agreet",
  "pages/startup/startup_page",
  "pages/micro_mall/send_goods/login_page"
];
/**
 * 规则说明
 * 1，rule_parameter_store  客户优先进入带参的门店
 * 2，rule_binding_store  客户优先进入绑定的门店
 * 3，rule_lately_store  客户优先进入最近访问的门店
 * 4，rule_partition_store  客户优先进入隔离门店
 * 5，rule_area_recommend  客户优先进入地区指定推荐
 * 6，rule_lbs_recommend  客户优先进入LBS定位推荐
 * 7，rule_no_result_jump  无门店推荐结果，直接进入指定页：value=0(门店列表) / value=门店ID（指定门店）
 * 0，rule_change_store  是否允许用户切换门店
*/

class storeManager {
  static getInstance() {
    if (!storeManager.instance) {
      storeManager.instance = new storeManager();
    }
    return storeManager.instance;
  }
  constructor() {
    let storeInfo = StorageH.get(STORE_KEY);
    if(storeInfo){
      this._storeInfo = storeInfo;
    }
  } 
  storeRuleHandle(ops){
    console.log('云店storeRuleHandle',ops)
    let query = ops.query || {};
    if(query.barCodeId || query.scene || query.storeCode){ //rule_parameter_store 不可取消
      if(query.storeCode){
        console.log('云店分享store',query)
        getVisitStore.call(this, {storeCode: query.storeCode});
      } else {
        console.log('云店扫码store',params)
        SHP.getParams(["storeCode"]).then(params=>{
          getVisitStore.call(this, {storeCode: params.storeCode});
        })
      }
    } else { // 带定位请求
      this.getLocation().then(data=>{
        getVisitStore.call(this, data);
      }).catch(()=>{
        getVisitStore.call(this,{});
      })
    }
  }
  getLocation(isTap=false){
    return new Promise((rs, rj)=>{
      AS.checkAuthorize("scope.userLocation", (e)=>{
        if(e){
          WxApi.getLocation({
            type: 'gcj02'//'wgs84',
          }).then(res=>{
            let params = {
              lat: res.latitude,
              lon: res.longitude
            }
            WXMAP_SDK.reverseGeocoder({
              latitude: res.latitude,
              longitude: res.longitude
            }).then(result=>{
              params.provinceName = result.ad_info && result.ad_info.province;
              params.cityName = result.ad_info && result.ad_info.city;
              rs(params);
            }).catch(()=>{
              rs(params);
            })
          })
        }
      },
        (e)=>{
          rj(e);
        },
        isTap
      )
    })
  }
  getStoreList(params){
    return getStoreList.call(this, params)
  }
  changeVisitStore(params){
    return changeVisitStore.call(this, params)
  }
  get storeInfo(){
    return this._storeInfo || {};
  }
  get storeId(){
    return (this._storeInfo && this._storeInfo.storeId) || 0
  }
  isHoldPage(page){
    //在获取店铺信息期间，并且不在以上页面【limitUnHold】中的，统一hold页面
    if(limitUnHold.indexOf(page.route) == -1 && this.storeRuleHandleKey){ return true; }
    return false
  }
  //只在app.onShow执行一次 , 且在欢迎页，协议页，强制登录页后，获取store信息
  listen(ops){
    this.storeRuleHandleKey = EB.listen("storeRuleHandle", () => {
      this.storeRuleHandle(ops);
    })
  }
  callListen(){
    if(this.storeRuleHandleKey) { 
      EB.call("storeRuleHandle", this);
      EB.unListen("storeRuleHandle", this.storeRuleHandleKey);
      delete this.storeRuleHandleKey
    }
  }
}
export default storeManager.getInstance(); 

function getVisitStore(params, isShowLoad){
  return CL_UserApi.getVisitStore({
    data: {
      storeCode: params.storeCode || "",
      provinceName: params.provinceName || "",
      cityName: params.cityName || "",
      lat: params.lat || 0,
      lon: params.lon || 0
    },
    extraData: {
      isShowLoad: isShowLoad
    }
  }).then(e=>{
    console.log('云店getVisitStore then',e)
    if(e.code == 1){
      let data = e.data || {}
      let page = getCurrentPages().splice(-1)[0];
      if(data.needSelect){
        this._storeInfo = data;
        StorageH.set(STORE_KEY, data,20);
        if(page.route != STORE_PATH){
          console.log('云店getVisitStore jump')
          wx.redirectTo({
            url: `/${STORE_PATH}?lat=${params.lat}&lon=${params.lon}&provinceName=${params.provinceName}&cityName=${params.cityName}`,
          })
        }
      } else if(data.storeId){
        this._storeInfo = data;
        StorageH.set(STORE_KEY, data,20);
        !page._onLoaded && page.onLoad(page.options);
        page.onShow();
      } else {
        !page._onLoaded && page.onLoad(page.options);
        page.onShow();
      }
      return Promise.resolve(data);
    }else{
      SMH.showToast({
        title: e && e.msg || "门店信息异常"
      })
    }
    return Promise.reject();
  })
}
function getStoreList(params){
  return CL_UserApi.getVisitStoreList({
    params: {
      provinceName: params.provinceName || "",
      cityName: params.cityName || "",
      lat: params.lat || 0,
      lon: params.lon || 0,
      pageIndex: params.page,
      pageSize: Conf.PAGE_SIZE,
      searchStr: params.searchStr
    },
    extraData:{
      isShowLoad: true
    }
  })
}
function changeVisitStore(params){
  if(!params.storeId) {
    return Promise.reject();
  }
  return CL_UserApi.changeVisitStore({
    data: {
      provinceName: params.provinceName || "",
      cityName: params.cityName || "",
      lat: params.lat || "",
      lon: params.lon || "",
      storeId: params.storeId,
    },
    extraData:{
      isShowLoad: true
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {}
      this._storeInfo = {
        ...this._storeInfo,
        ...data
      };
      StorageH.set(STORE_KEY, this._storeInfo);
      return Promise.resolve(this._storeInfo);
    }
    return Promise.reject(e);
  })
}