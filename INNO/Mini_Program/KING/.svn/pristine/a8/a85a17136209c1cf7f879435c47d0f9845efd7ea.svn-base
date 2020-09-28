import md5 from "../../../../utils/md5.js"
const app = getApp();
Page(app.BP({
  data: {},
  onLoad: function (options) {
    this.options = options;
    getUrl.call(this, options);
  },
  onReady: function () {

  },
  onShow: function () {},
  onHide: function () {

  },
  onShareAppMessage: function (options) {
   let url = encodeURIComponent(options.webViewUrl);
    return {
      isCustom: true,
      path: "/" + this.route + "?link_url=" + url
    }
  }
}))
function getUrl(options){
  let type = options.type || "";
  if(type == "m_h5" || type == "h5_admin"){
    let brand_id = app.Conf.brand_id;
    let time = (new Date().getTime() / 1000).toFixed(0);
    let route = options.route; //&& encodeURIComponent(options.route);
    let userToken = app.LM.userToken;
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
    console.log('url',url)
    this.setData({
      url: url
    })
  }
}