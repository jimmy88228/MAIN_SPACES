import LgMg from "../manager/log-manager.js";
import FM from "../helper/form-id-manager";
import GetSystemConfig from "../helper/handle/getSystemConfig";
import LM from "../manager/login-manager.js";
import MyStr from "../support/utils/string-util.js";
import WxApi from "../helper/wx-api-helper.js";
import {TabKeys} from "../manager/log-map.js";
let loadingObj = {};
export default {
    noAction() {},
    addPageLog(name, path, options, _isBack) {
      this._isBack = true;
      LgMg.addPageLog(name, path, options, _isBack);
    },
    addActionLog(name, position, options) {
      LgMg.addActionLog(name, position, options);
    },
    addSearchLog(words, isSetSto = true) {
      LgMg.addSearchLog(words, isSetSto);
    },
    addStaffActivityLog(shareType, relatedId) {
      LgMg.addStaffActivityLog(shareType, relatedId);
    },
    formAction(e) {
      let formId = e && e.detail && e.detail.formId;
      FM.push(formId, false);
    },
    nextTick() {
      return new Promise(rs => {
        wx.nextTick(rs);
      });
    },
    MyViewTask(id, label, key) {
      this._myview || (this._myview = {});
      let vs = this._myview;
      if (vs[label]) {
        return Promise.resolve(vs[label]);
      }
      if (key) {
        this.setData({
          [key]: true
        });
      }
      return this.nextTick().then(() => {
        vs[label] = this.selectComponent(id);
        return vs[label];
      });
    },
    jumpAction(e) {
        let url = this.getDataset(e,"url"); 
        url && wx.navigateTo({
          url: url,
          fail() {
            wx.switchTab({
              url: url,
            })
          }
        })
    },
    redirectAction(e) {
      let url = this.getDataset(e,"url");
      url && wx.redirectTo({
        url: url,
        fail() {
            wx.switchTab({
                url: url,
            })
        }
      });
    },
    getDataset(e,type) {
      let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
      if(type)return dataset[type]
      return dataset;
    },
    clickHold(key = "DEF", d = 800) {
      this.clickHoldMap || (this.clickHoldMap = {});
      let chm = this.clickHoldMap
      if (chm[key]) {
        return false;
      } else {
        chm[key] = true;
        let timer = setTimeout(() => {
          delete chm[key];
          clearTimeout(timer);
        }, d);
        return true;
      }
    },
    _getQuery(id,selectType,pageType="page",cb) {
      return new Promise((rs, rj) => {
        // setTimeout(() => {}, 300);
        this.nextTick().then(()=>{
            let query = pageType == "page" ? wx.createSelectorQuery() : wx.createSelectorQuery().in(this);
            let idSel = id || '#main';
            if (selectType == 'all') {
                query.selectAll(idSel).boundingClientRect()
            } else {
                query.select(idSel).boundingClientRect();
            }
            query.selectViewport().scrollOffset().exec(
                res => {
                cb && typeof (cb) == 'function' && cb();
                rs(res || {})
                }
            )
        })
      })
    },
    checkLoginChange(set = true,cb) {
      let isLogin = LM.isLogin;
      if (!this.isCheckLogined || this.isLogin !== isLogin) {
        this.isCheckLogined = true;
        this.isLogin = isLogin;
        set && this.setData({
          isLogin
        })
        typeof (cb) == "function" && cb(isLogin)
        return true; //登录状态改变
      }
      return false;  //登录状态没有变化
    }, 
    checkLoginAsync(){
      return this._checkUserLogin();
    },  
    _checkUserLogin(callback){ 
      return LM.loginAsync().then(()=>{
        this._setUserLogin(callback);
        return LM.isLogin;  
      }).catch(()=>{
        this._setUserLogin(callback);
        return Promise.resolve(LM.isLogin);  
      }) 
    },
    _setUserLogin(callback){
      if(this.data.isLogin != LM.isLogin){
        this.setData({
            isLogin: LM.isLogin
        })
      }
      typeof(callback) == "function" && callback(LM.isLogin)
    },
    trimConfigs(arr) {
      return GetSystemConfig.trimConfigs(arr);
    },
    _imgLoad(e) { 
      let key = this.getDataset(e,"key") || "";
      console.log('_imgLoad', e);
      key && this.setData({
        [key]: e && e.detail || {}
      })
    }, 
    //获取配置并setData
    _getSysConf(key,dataName=""){
      return GetSystemConfig.getSysConfig(key).then(data => {
        dataName && this.setData({
            [dataName]: data.Value||0
        })
        return data
      })
    },
    //获取页面的this.data
    _getPageData(key=""){
      let page = getCurrentPages().slice(-1)[0]||{};
      let result = JSON.parse(JSON.stringify(page.data || {}));
      return key ? result[key] : result
    },
    //获取当前页面的customTab值(组件常用到,注意生命周期时序)
    checkCustomTab(reset=false){
      if(this.checkCustomTabInited && !reset)return
      this.checkCustomTabInited = true;
      let page = getCurrentPages().slice(-1)[0] || {};
      this.setData({
        customTab:page.data && page.data.customTab||false,
        customTabStyle:page.data && page.data.customTab && "customTab",
      })
    },
    // 刷新当前页面(通过重定向到当前页面 tab页面则是重启到当前页面)
    refreshCurrentPage(){
      let params = this.options || {};
      let paramsStr = MyStr.getPageParamsStr(params);
      let route = this.route || "";
      console.log('刷新当前页面',route,params);
      let url =  "/" + route + "?" + paramsStr;
      return WxApi.redirectTo({url})
        .catch(err => {
          console.log('重定向失败,原因:', err)
          return WxApi.reLaunch({url})
        })
    },
    hideTabBar(isHideTab){
      let page = getCurrentPages().pop() || {};
      if (page.route && TabKeys[page.route] && typeof (page.getTabBar) == "function") {
        let tab = page.getTabBar();
        if (tab && typeof (isHideTab) == "boolean" && tab.data.isHideTab != isHideTab) {
          tab.setData({isHideTab: isHideTab})
          return true
        }
      }
      return false
    },
    _showModal(params){
      return WxApi.showModal({
        title: params.title || "提示",
        content: params.content || "",
        showCancel: params.showCancel || true,
        cancelText: params.cancelText || "取消",
        confirmText: params.confirmText || "确定",
      }).then(res=>{
        if (res.confirm) {
          return Promise.resolve(res);
        }
        return Promise.reject(res);
      })
    }, 
    _throttle(key="normal",time=800,fromType){
      let pageData = getCurrentPages().pop();
      let page = pageData.route;
      !loadingObj[page] && (loadingObj[page] = {});
      if(loadingObj[page][key]){
        throw (key+'---throttle');
      }
      loadingObj[page][key] = true;
      if(fromType != 'api'){
        let timer = setTimeout(() => {
          clearTimeout(timer);
          delete loadingObj[page][key];
        }, time);
      }
      return page
    },
    _throttleApi(key="normal",fromType,page){
      key = key + '_API'; 
      if(fromType == 'release'){
        setTimeout(() => {
          // this.hideLoading();
          loadingObj[page] && delete loadingObj[page][key];
        }, 500);
        return false;
      }else{
        // this.showLoading();
        return this._throttle(key,800,'api'); 
      }
    },
    setWarehouse(list,extend={}){
      let inventory_model_config = extend && extend.inventory_model_config; // 2：库存=仓库库存 else: 库存=库存+仓库库存
      if (inventory_model_config == 2){
        list.forEach(item => {
          item.product_number = item.warehouse_product_number || 0;
        })
      } else {
        list.forEach(item => {
          item.product_number += item.warehouse_product_number || 0;
        })
      }
    }
};

