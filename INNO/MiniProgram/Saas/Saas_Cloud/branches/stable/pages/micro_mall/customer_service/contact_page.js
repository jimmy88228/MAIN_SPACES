import md5 from "../../../common/helper/utils/md5.js"
const app = getApp();
Page(app.BP({
  data: {
  },
  onLoad: function (options) {
    this.options = options;
  },
  onReady: function () {

  },
  onShow: function () {
    let options = this.options;
    if(options.type == "old_cs"){
      getStaffWebUrl.call(this,options);
    }else{
      getCustomerUrl.call(this).then(url=>{
        if(!url){
          getUrlParams.call(this);
        }
      });
    }
    
  },
  onHide: function () {

  }
}))
function getCustomerUrl(){
  return app.sysTemConfig("third_party_customer_service_url").then(data => {
    if (data.Value){
      return app.LM.getUserSimpleInfo(app.LM.userToken).then(res => {
        
        let customParams = {};
        if (res.cardNum){
          customParams["卡号"] = res.cardNum
        }
        if (res.mobilePhone) {
          customParams["手机号"] = res.mobilePhone
        }
        let customParamsStr = JSON.stringify(customParams);
        let paramsStr = `uname=${res.realName}&face=${res.portrait_path}&tel=${res.mobilePhone}&params=${customParamsStr}`;
        let url = data.Value || "";
        if (url.indexOf("?") != -1){
          url = url + '&' + paramsStr;
        }else{
          url = url + '?' + paramsStr;
        }
        this.setData({
          url: url
        })
        console.log("客服url",url);
        return Promise.resolve(url);
      })
    }else{
      return Promise.resolve(data.Value);
    }
  })
}
function getStaffWebUrl(ops){
    let storeInfo = app.LM.storeInfo || app.StorageH.get("STOREINFO") || "";
    let p = "";
    if (!storeInfo) {
      p = app.LM.checkIfStore();
    } else {
      p = Promise.resolve(storeInfo)
    }
    p.then((storeInfo)=>{
      if(!storeInfo.staff_id) return;
      let kfTime = (new Date().getTime() / 1000).toFixed(0);
      let kfUid = storeInfo.staff_id;
      let brand_id = app.Conf.brand_id || 0;
      let kfKey = md5.hexMD5(kfTime + '|123|' + kfUid);
      let url = `${app.Conf.webViewUrl}/staff_wap/cs_service.php?kfTime=${kfTime}&kfStaffId=${kfUid}&kfKey=${kfKey}&brand_id=${brand_id}`;
      console.log("url",url)
      this.setData({
        url: url
      })
    })
}
function getUrlParams(){
  app.LM.getUserSimpleInfo(app.LM.userToken).then(res => {
    let kfTime = (new Date().getTime() / 1000).toFixed(0);
    let kfUid = res.uId;
    let kfKey = md5.hexMD5(kfTime + '|123|' + kfUid);
    let webContactUrl = app.Conf.webContactUrl;
    let brand_id = app.Conf.brand_id || 0;
    let url = `${webContactUrl}?kfTime=${kfTime}&kfUid=${kfUid}&kfKey=${kfKey}&brand_id=${brand_id}`
    if (this.options.goods_id && this.options.goods_id != 0) {
      url = url + "&act=send_goods&goods_id=" + this.options.goods_id
    }
    console.log(url,"url");
    this.setData({
      url: url
    })
  }).catch(() => {
    // app.SMH.showToast({
    //   "title": "用户未登录"
    // })
  })
}
