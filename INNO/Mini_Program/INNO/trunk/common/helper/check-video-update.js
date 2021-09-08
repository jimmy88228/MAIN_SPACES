import {
  TabKeys,
  CheckLastRoute
} from "../manager/log-map.js";
// import Promise from "../libs/promise/promise.js";
import RunApi from "./apiPackage.js"
import Conf from "../../conf";
import StorageH from "./handle/storageHandle";
import GetTabList from "../manager/getTabList.js"; 
class checkUpdate {
  static getInstance() {
    if (!checkUpdate.instance) {
      checkUpdate.instance = new checkUpdate();
    }
    return checkUpdate.instance;
  }
  constructor() {  
    this._tab = [];
    this._checked = 0;
    this._showUpdate = 0;
    this._exsist = 0;
    this._lastRoute = '';
  }

  checkUpdate(tab) {
    this._tab = tab.data.list || [];
    return this.getList(tab).then(res=>{
      this._checked = 1;
      return new Promise((rs, rj) => {
        this._tab.forEach(item => {
          if (item.pagePath && TabKeys[item.pagePath] == 'videoShopping') {
            this._exsist = 1;
            let storage_obj = StorageH.get('VIDEO_UPDATE') || {};
            let storage_id = storage_obj && storage_obj.updateId || 0;
            let params = {
              brandCode: Conf.BRAND_CODE
            }
            RunApi.go('VideoShopApi', 'getNewVideoId', params, { diy: true }).then(res => {
              if(res.code==1){
                let data = res.data || "";
                if (data && (!storage_id || (storage_id != data))) {
                  this._showUpdate = 1;
                  let obj = {
                    ...storage_obj,
                    updateId: data,
                  }
                  StorageH.set('VIDEO_UPDATE',obj) 
                  // console.log('更新'); 
                  return rs();
                }
              }
              return rj();
            })
          }
        })
      })
    })
     
  }
  checkRoute(route){
    if (CheckLastRoute[route] && (CheckLastRoute[route].lastRoute == this._lastRoute)) {
      wx.switchTab({
        url: "/" + CheckLastRoute[route].nextRoute,
        // fail() {
        //   wx.navigateTo({
        //     url: '/' + CheckLastRoute[route].nextRoute,
        //   })
        // }
      });
      console.log('视频购物关联跳转', CheckLastRoute[route].nextRoute,",当前页面:",route,",上个页面:", this._lastRoute)
      this._lastRoute = route;
      return false
    }
    this._lastRoute = route;
    return true
  }
  setLastRoute(route){
    this._lastRoute = route;
  }
  setStatus(val=0){
    this._showUpdate = val;
  }
  getList(tab){
    let inited = tab.initBool;
    if(inited){
      return Promise.resolve(tab.data.list);
    }else{
      return GetTabList.getList().then(list=>{
        this._tab = list;
        return list
      })
    }
  }
  get tab(){
    return this._tab
  }
  get checked(){
    return this._checked
  }
  get showUpdate(){
    return this._showUpdate
  }
  get exsist(){
    return this._exsist
  }
} 

export default checkUpdate.getInstance();