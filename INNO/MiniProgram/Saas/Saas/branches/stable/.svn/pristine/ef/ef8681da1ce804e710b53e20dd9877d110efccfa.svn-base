import md5 from "../../../../common/support/utils/md5.js"
import {LogMap, LimitAddLog} from "../../../../common/manager/log-map";
import StringUtil from "../../../../common/support/utils/string-util";
const app = getApp();
Page(app.BP({
  data: {
    registerExtra:{},
  },
  onLoad: function (options) {
    this.options = options;
    this.unAutoAddLog=true;
    this.setData({
      isCheckLogin:!!options.isCheckLogin, 
    })
    this._checkUserLogin().then(()=>{ 
      console.log('isLogin',app.LM.isLogin,this.data.isLogin) 
      if(this.data.isCheckLogin && !app.LM.isLogin){  
        this.loginJump(this.options);  
        return
      }
      getUrl.call(this, options);
    })
  },
  loginJump(){
    let prevRoute = `${this.route}?${StringUtil.getPageParamsStr(this.options)}`;
    let url = `/pages/micro_mall/send_goods/login_page?prevRoute=${encodeURIComponent(prevRoute)}`;
    // let url = `/pages/micro_mall/send_goods/login_page?prevRoute=${prevRoute}&preParams=${StringUtil.getPageParamsStr(this.options)}`;
    if(this.options.fromType=='huiyou'){
      let registerExtra = this.huiyouInit();
      url = `${url}&registerExtra=${JSON.stringify(registerExtra||{})}`
    }
    console.log('urlurl',url);
    this.redirectAction(url);
  },
  onReady: function () {

  },
  onShow: function () {
    this.customAddLog();
  },
  onHide: function () {

  },
  getMessage(e){
    console.log("getMessage", e);
    let detail = e.detail || {};
    let data = detail.data || [];
    if(data.length > 0){
      let shareConf = data.splice(-1) || "";
      this.shareConf = JSON.parse(shareConf) || {};
    }
  },
  onShareAppMessage: function (options) {
    let url = encodeURIComponent(options.webViewUrl);
    let share = {
      isCustom: true,
      path: "/" + this.route + "?link_url=" + url
    }
    if(this.options.fromType == 'huiyou'){
      share.path = `${share.path}&type=simple&fromType=huiyou&isCheckLogin=1`
    }
    let shareConf = this.shareConf || {};
    if(shareConf.image){
      share.imageUrl = shareConf.image
    }
    if(shareConf.title){
      share.title = shareConf.title
    }
    if(this.name == "H5_CARE"){ // 自定义分享动作log
      share.addActionName = "H5_CARE_SHARE";
      this.addActionLog(share.addActionName, this.name, this.options)
    }
    return share
  },
  customAddLog(){
    let options = this.options || {};
    let url = decodeURIComponent(options.link_url);
    let name = url.indexOf("mobile/h5_report.php") != -1 ? 'H5_CARE' : null;
    this.name = name;
    app.LM.loginAsync().finally(()=>{
      if (LimitAddLog[this.route] == "isHome" || LimitAddLog[this.route] == "limitAll"){
        return;
      }
      this.addVisitLog(name, this.route, options);
      if (LimitAddLog[this.route]) return;
      this.addPageLog(name, this.route, options, this._isBack);
    })
  },
  loginCallBack(){
    this._checkUserLogin().then(()=>{
      getUrl.call(this, this.options);
    })
  }, 
  huiyouInit(){ 
    let url = decodeURIComponent(this.options.link_url);
    let userSrc = getUserSrc(url); 
    let registerExtra = {
      userSrc
    }
    return registerExtra
  },
}))
function getUrl(options){
  let type = options.type || "";
  let brand_id = app.Conf.brand_id||0;
  let userToken = app.LM.userToken;
  let brandCode = app.Conf.BRAND_CODE;
  console.log('getUrl',options,type)
  if(type == "m_h5" || type == "h5_admin"){
    let time = (new Date().getTime() / 1000).toFixed(0);
    let route = options.route; //&& encodeURIComponent(options.route);
    let hashCode = md5.hexMD5(userToken+'||'+brand_id+'||'+time);
    let url = `${app.Conf.webMh5Url}?brand_id=${brand_id}&time=${time}&token=${userToken}&hashCode=${hashCode}&route=${route}`
    this.setData({
      url: url
    })
    console.log("内嵌页",url);
  } else {
    let url = decodeURIComponent(this.options.link_url);
    let type = this.options.type||"";
    if (!url) return;
    if(type != 'simple'){
      if (url.indexOf('?') == -1) {
        url = url + '?_t=' + Date.now();
      } else {
        url = url + '&_t=' + Date.now();
      }
      url = url + '&brandId=' + brand_id + '&userToken=' + userToken + '&brandCode=' + brandCode
    }
    this.setData({
      url
    })
    console.log("H5页",url); 
  }
}
function getUserSrc(url){
  let shortIndex = url.indexOf('/surl/');
  let shortEnd = url.indexOf('?') > -1 ? url.indexOf('?') : url.length;
  let longIndex = url.indexOf('aid-');
  let longText = url.slice(longIndex+4);
  let longEnd = longText.indexOf('/');
  let userSrc = shortIndex > -1 ? url.slice(shortIndex+6,shortEnd) : longText.slice(0,longEnd);
  console.log('匹配',userSrc,shortIndex,shortEnd,longIndex,longEnd,longText)
  return userSrc
}