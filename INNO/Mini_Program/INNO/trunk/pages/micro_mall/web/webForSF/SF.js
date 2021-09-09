import md5 from "../../../../common/support/utils/md5.js"
import {LogMap, LimitAddLog} from "../../../../common/manager/log-map";
const app = getApp();
Page(app.BP({
  data: {},
  onLoad: function (options) {
    this.options = options;
    this.unAutoAddLog=true;
    app.LM.loginAsync().finally(()=>{
      getUrl.call(this, options);
    })
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
  }
}))
function getUrl(options){
  let type = options.type || "";
  let brand_id = app.Conf.brand_id;
  let userToken = app.LM.userToken;
  let brandCode = app.Conf.BRAND_CODE;
  if(type == "m_h5" || type == "h5_admin"){
    let time = (new Date().getTime() / 1000).toFixed(0);
    let route = options.route; //&& encodeURIComponent(options.route);
    let hashCode = md5.hexMD5(userToken+'||'+brand_id+'||'+time);
    let url = `${app.Conf.webMh5Url}?brand_id=${brand_id}&time=${time}&token=${userToken}&hashCode=${hashCode}&route=${route}`
    console.log("内嵌页",url);
    this.setData({
      url: url
    })
  } else {
    let url = decodeURIComponent(this.options.link_url);
    if (!url) return;
    if (url.indexOf('?') == -1) {
      url = url + '?_t=' + Date.now();
    } else {
      url = url + '&_t=' + Date.now();
    }
    url = url + '&brandId=' + brand_id + '&userToken=' + userToken + '&brandCode=' + brandCode
    this.setData({
      url: url
    })
  }
}