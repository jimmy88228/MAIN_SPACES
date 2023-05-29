import md5 from "../../../common/support/utils/md5.js"
import Utils from "../../../common/support/utils/utils";
import StorageH from "../../../common/helper/handle/storageHandle.js"
const app = getApp();
const sha1 = require("../../../common/support/libs/sha1/index.js");
const SPECIAL_BRANDS = { // 需要特殊处理的品牌
  MRJ: true, // 美人计
  INNOVATION: true, // 测试环境
}
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
        console.log("url地址: ", url)
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
  let thirdPartyCSUrl = (StorageH.get('CustomerServiceConf') || {}).url
  if (thirdPartyCSUrl){
    if (SPECIAL_BRANDS[app.Conf.BRAND_CODE]) return operation4SpecificBrand.call(this, thirdPartyCSUrl, app.Conf.BRAND_CODE)
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

      let url = thirdPartyCSUrl || "";
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
    return Promise.resolve(thirdPartyCSUrl);
  }
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

function operation4SpecificBrand(url, BRAND_CODE){ // 特殊品牌的操作
  if (BRAND_CODE === "MRJ" || BRAND_CODE === "INNOVATION") {
    return app.LM.getUserSimpleInfo(app.LM.userToken)
    .then(userInfo => {
      let nonce = new Date().getTime(),
      timestamp = new Date().getTime(),
      web_token = app.LM.userToken,
      im_user_key = "96517a3c0b4f7b3cbb727c6777270e45",
      signature = createSignatureByUdeskRule(nonce, timestamp, web_token, im_user_key),
      cardNo = userInfo.cardNum;
  
      let paramsStr = `nonce=${nonce}&timestamp=${timestamp}&web_token=${web_token}&signature=${signature}&c_cf_会员卡号=${cardNo}`;
      if (url.indexOf("?") != -1){
        url = url + '&' + paramsStr;
      }else{
        url = url + '?' + paramsStr;
      }
      this.setData({url})
      return Promise.resolve(url)
    })
    .catch(err => {
      this.setData({url})
      return Promise.resolve(url)
    })
  }
}

function createSignatureByUdeskRule(nonce, timestamp, web_token, im_user_key){
  let sign_str = `nonce=${nonce}&timestamp=${timestamp}&web_token=${web_token}&${im_user_key}`;
  sign_str = sha1(sign_str);
  sign_str = sign_str.toUpperCase();
  return sign_str
}