import LM from "../manager/login-manager.js";
import Conf from "../../conf";
import { UserApi } from "../manager/http-manager.js";
import AS from "../manager/authorize-set.js";
import SMH from "../show-msg-helper.js"
import WxAPi from "../../helper/wx-api-helper.js";
class ShopGuideManager {
  static getInstance() {
    if (!ShopGuideManager.instance) {
      ShopGuideManager.instance = new ShopGuideManager();
    }
    return ShopGuideManager.instance;
  }
  constructor() {
    
  }
  getLocation(callback){
    let that = this;
    return new Promise((rs,rj)=>{
      AS.checkAuthorize("scope.userLocation", function () {
        WxAPi.getLocation({
          type: 'gcj02',
        }).then(res => {
          let lat = res.latitude;
          let lon = res.longitude;
          console.log("res", res)
          rs({ lat, lon});
        }).catch(e => {
          rj(e)
        })
      });
    })
    
  }
  getCustomerService(storeId, staffId, isStore,isAutoLoad){
    let data = {
      storeId,
      staffId,
      isStore,
      isAutoLoad
    };
    if (!staffId && !storeId) {
      return this.getLocation().then((locat)=>{
        data = {
          ...data,
          ...locat
        }
        console.log("this.data", data)
        return getCustomerServiceInfo.call(this, data)
      })
    }else{
      return getCustomerServiceInfo.call(this, data);
    }
  }
  startmessage(e){
    console.log("startmessage", e);
    SMH.showLoading(null,0);
    this.loadTime && clearTimeout(this.loadTime);
    this.loadTime = setTimeout(()=>{
      SMH.hideLoading(0);
      clearTimeout(this.loadTime);
      this.loadTime = "";
    },3000)
  }
  completemessage(e,staff){
    console.log("completemessage", e);
    SMH.hideLoading(0);
    let detail = e.detail || {};
    let dataset = e.target.dataset || {};
    let index = dataset.index;
    let p = new Promise(function(rs,rj){
      if (detail.errcode == 0 || detail.errcode == "-3006") {
        let data = {};
        if (detail.errcode == "-3006"){
          if (staff instanceof Array){
            data = staff[index] || {};
          } else if (staff instanceof Object && staff.staffId){
            data = staff || {};
          }
        }
        rs(data);
      } else {
        app.SMH.showToast({
          title: "触发失败"
        });
        rj();
      }
    })
    return p;
  }
}
function getCustomerServiceInfo(params = {}) {
  // storeId：店铺id（会员绑定店铺或指定店铺均可）
  // staffId：会员绑定店员id
  // lat：定位维度，会员中心查询时用到，用于在会员没有绑定店铺或者店员时查找附近最近一个店铺
  // lon：定位经度，会员中心查询时用到，用于在会员没有绑定店铺或者店员时查找附近最近一个店铺
  // brandCode：品牌编码
  // isStore：是否是店铺详情中调用，是则不会去查找附近店铺
  return UserApi.getCustomerServiceInfo({
    params: {
      storeId: params.storeId || 0,
      staffId: params.staffId || 0,
      lat: params.lat || 0,
      lon: params.lon || 0,
      isStore: params.isStore || 0
    },
    other: {
      isShowLoad: false
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      if (data.storeInfo){
        data.storeInfo.storeId = params.storeId
      }
      return Promise.resolve(data);
    }
    if(!params.isAutoLoad){
      SMH.showToast({
        title: res.msg
      })
    }
    return Promise.reject({});
  })
}

export default ShopGuideManager.getInstance();
