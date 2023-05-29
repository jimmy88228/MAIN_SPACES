import {
  CL_UserApi
} from "../../manager/http-manager.js"
import StorageH from "../handle/storageHandle.js";
import StartPageHandle from "../handle/startPageHandle.js";
import SHP from "../handle/scanHandleParams.js";
import AS from "../authorize-set";
import WxApi from "../../support/tools/wx-api-promise.js";
import Conf from "../../../conf";
import WXMAP_SDK from "./wxmap-sdk";
import EB from "../../support/tools/event-bus.js";
import SMH from "../../helper/show-msg-helper.js"
import LM from '../../manager/login-manager'
import {LogMap,CardType,JumpInType,SceneType} from '../../manager/log-map';
import MyStr from "../../support/utils/string-util.js";

const STORE_PATH = "pages/micro_mall/stores/changeStore/changeStore";
const ORDER_LIST_PATH = "pages/micro_mall/order/order_list";
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
    this._needSelectJump = false;
    this._jumped_startup_page = false;
    let storeInfo = StorageH.get(STORE_KEY);
    if(storeInfo){
      this._storeInfo = storeInfo;
    }
  }

  setGetVisitStoreCallBack(cb){
    typeof cb === "function" && (this._getStoreCallBack = cb);
  }

  getStoreAsync(ops){
    let options = ops || wx.getEnterOptionsSync && wx.getEnterOptionsSync() || {};
    let h = this._storeH;
    console.log('获取店铺信息 getStoreAsync',options)
    if(h){
      return h;
    }
    this._storeH = h = this.storeRuleHandle(options).finally(()=>{
      if (typeof this._getStoreCallBack === "function"){
        this._getStoreCallBack();
        this._getStoreCallBack = null;
      }
      delete this._storeH;
    })
    return h
  }
  storeRuleHandle(ops){
    return new Promise((rs,rj)=>{
      console.log('云店进来',ops)
      let query = ops.query || {};
      if(query.barCodeId || query.scene || this.getStoreCode(query)){ //rule_parameter_store 不可取消 
        console.log('云店分享途径',query)
        if(query.scene && !this.getStoreCode(query) && this.storeInfo.storeId){
          return rs();
        }
        return getVisitStore.call(this, {storeCode: this.getStoreCode(query)}).finally(()=>{
          rs();
        }); 
      } else { // 带定位请求
        return this.getLocation().then(data=>{
          return getVisitStore.call(this, data).finally(()=>{
            rs();
          });
        }).catch(()=>{
          return getVisitStore.call(this,{}).finally(()=>{
            rs();
          });
        })
      }
    })
  }
  setNeedSelectJump(bool=true){
    this._needSelectJump = bool;
  }
  getLocation(isTap=false){
    console.log('云店 getLocation')
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
              console.log('resultresult',result)
              params.provinceName = result.ad_info && result.ad_info.province;
              params.cityName = result.ad_info && result.ad_info.city;
              rs(params);
            }).catch(()=>{
              rs(params);
            })
          }).catch(e=>{
            rj(e);
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
  clearStoreInfo(){
    this._storeInfo = {};
  }
  
  checkStoreUpdate(options={}){
    let query = options.query||{};
    console.log('对比storeCode',CardType[options.scene],JumpInType[options.scene],SceneType[options.scene],query.storeCode , this.storeCode,query)
    if((!this._jumped_startup_page||CardType[options.scene]||JumpInType[options.scene]||SceneType[options.scene]) && LogMap[options.path] != 'CHANGE_STORE_PAGE'){ //第一次进来|分享卡片|不在切换店铺页面|不是锁定状态
      if(!this.storeId || ((CardType[options.scene] || JumpInType[options.scene] || SceneType[options.scene]) && query.storeCode && query.storeCode!=this.storeCode)){
        query._lastRoute = options.path||"";
        StartPageHandle.setReleasePage(false);
        let paramsStr = MyStr.getPageParamsStr(query);
        console.log('(非扫码)需要更新storeCode:',options.path,'跳去中间页');
        this._jumped_startup_page = true;
        wx.redirectTo({
          url: "/" + Conf.STARTUP_PAGE + "?" + paramsStr, 
        })
      }
    }
  }

  changeStoreWhereUserBelong(targetStore = {}){ // 用户注册后，需要帮用户切换店铺 -> 切换到会员归属店铺
    try{
      let {fromStoreId: storeId = 0, fromStoreCode: storeCode = "", fromStoreName: storeName = ""} = targetStore
      // 切换店铺操作
      let storeInfo = this.storeInfo || {};
      storeInfo = {...storeInfo, storeId, storeName, storeCode}
      return changeStore.call(this, storeInfo).then(() => {
        let data = {...targetStore, isAlreadyGetStore: true}
        this._afterChangeStoreData = data;
        return Promise.resolve(data)
      })
    } catch(err){
      console.log("切换到用户归属店铺报错", err)
      return Promise.resolve(data)
    }
  }

  afterChangeStore(data = {}){
    if (!this.afterChangeStoreData) return Promise.resolve(data || true);
    data = {...data, ...this.afterChangeStoreData}
    this.disabledAfterChangeStore()
    // 切换店铺后，判断是否要刷新页面、跳转或按原流程走
    let pages = getCurrentPages(),
      curPage = pages[pages.length - 1];
    if (curPage.route == 'pages/micro_mall/user_info/user_info' || curPage.route == 'pages/micro_mall/stores/changeStore/changeStore'){
       // 如果用户在个人资料页面或切换店铺页面，切换门店后按原流程走
       return Promise.resolve(data || true)
      //  this.clickHandleEvent(data);
    } else curPage.refreshCurrentPage() // 刷新页面
    return Promise.resolve(false)
  }

  disabledAfterChangeStore(){
    this._afterChangeStoreData = "";
  }
  
  setStore(data){
    if (data){
      this._storeInfo = data;
      StorageH.set(STORE_KEY, data,20);
    }
  }
  getStoreCode(ops){
    return ops&&(ops.storeCode||ops.store_code)||"";
  }
  get storeInfo(){
    return this._storeInfo || {};
  }
  get storeId(){
    return (this._storeInfo && this._storeInfo.storeId) || 0
  }
  get storeCode(){
    return (this._storeInfo && this._storeInfo.storeCode) || ''
  }
  get needSelectJump(){
    return this._needSelectJump || false;
  }

  get afterChangeStoreData(){
    return this._afterChangeStoreData || ""
  }
  // isHoldPage(page){
  //   //在获取店铺信息期间，并且不在以上页面【limitUnHold】中的，统一hold页面
  //   if(limitUnHold.indexOf(page.route) == -1 && this.storeRuleHandleKey){ return true; }
  //   return false
  // }
  //只在app.onShow执行一次 , 且在欢迎页，协议页，强制登录页后，获取store信息
  // listen(ops){
  //   this.storeRuleHandleKey = EB.listen("storeRuleHandle", () => {
  //     this.getStoreAsync(ops);
  //   })
  // }
  // callListen(){
  //   if(this.storeRuleHandleKey) { 
  //     EB.call("storeRuleHandle", this);
  //     EB.unListen("storeRuleHandle", this.storeRuleHandleKey);
  //     delete this.storeRuleHandleKey
  //   }
  // }
}
export default storeManager.getInstance(); 

function getVisitStore(params, isShowLoad){
  console.log('getVisitStore paramsparams',params)
  return LM.loginAsync().ignore(()=>{
    return CL_UserApi.getVisitStore({
      data: {
        provinceName: params.provinceName || "",
        cityName: params.cityName || "",
        storeCode: params.storeCode || "",
        storeId: params.storeId || 0,
        lat: params.lat || 0,
        lon: params.lon || 0
      },
      other: {
        isShowLoad: isShowLoad
      }
    }).then(e=>{
      console.log('云店getVisitStore then',e)
      if(e.code == 1){
        let data = e.data || {}
        let page = getCurrentPages().splice(-1)[0];
        if(data.needSelect){
          this.setStore(data);
          if(page.route != STORE_PATH && page.route != ORDER_LIST_PATH){ // 微信要小程序订单中心页的path，进来时不能跳去其他页面
            console.log('云店getVisitStore jump');
            this.setNeedSelectJump(true);
            wx.redirectTo({
              url: `/${STORE_PATH}?lat=${params.lat||0}&lon=${params.lon||0}&provinceName=${params.provinceName||''}&cityName=${params.cityName||''}`,
            })
          }
        } else if(data.storeId){
          this.setStore(data);
          this.setNeedSelectJump(false);
          // !page._onLoaded && page.onLoad(page.options);
          // page.onShow();
        } else {
          // !page._onLoaded && page.onLoad(page.options);
          // page.onShow();
        }
        return Promise.resolve(data);
      }else{
        SMH.showToast({
          title: e && e.msg || "门店信息异常"
        })
      }
      return Promise.reject();
    }).catch(()=>{
      let page = getCurrentPages().splice(-1)[0];
      page.onShow();
      return Promise.reject();
    })
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
    other:{
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
    other:{
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

function changeStore(storeInfo){
  let storeId = storeInfo.storeId;
  return this.getLocation()
    .then(res => {
      return this.changeVisitStore({...res, storeId})
    })
    .catch(err => {
      console.log("changeStoreWhereUserBelong.err", err);
      return Promise.resolve({});
    })
}