import LM from "../manager/login-manager.js";
import Conf from "../../conf";
import SMH from "../../helper/show-msg-helper.js";
import { SecKillApi , BargainApi, DistributionApi} from "../manager/http-manager.js";
import Wxapi from "../../helper/wx-api-helper.js"

class WxSubscribe {
  static getInstance() {
    if (!WxSubscribe.instance) {
      WxSubscribe.instance = new WxSubscribe();
    }
    return WxSubscribe.instance;
  }
  constructor() {

  }
  get subConf() {//0--状态，订阅消息状态(0:模板不可用  1:已订阅  2:已拒绝  3:模板被禁  4:订阅后又取消(已授权))
    return {
      disable: 0,
      accept: 1,
      reject: 2,
      ban: 3,
      rejectInner: 4,
    }
  }
  get SubStatus() {
    return {
      disable: 0,
      accept: 1,
      reject: 0,
      ban: 0,
      rejectInner: 2,
    }
  } 
  
  // get skKeyTemplate() {
  //   return {
  //     SECKILL_READY: "isSubscribeReady",
  //     SECKILL_START: "isSubscribeStart",
  //     SECKILL_LAUNCH_SUCC: "isSubscribeLaunch",
  //   }
  // } 

  getKeyTemplate(type){
    if(type == "BARGAIN"){
      return {
        BARGAIN_PROGRESS: "isSubsribeBargainProgress",
        BARGAIN_SUCC: "isSubsribeBargainSucc",
      }
    }else{
      return {
        SECKILL_READY: "isSubscribeReady",
        SECKILL_START: "isSubscribeStart",
        SECKILL_LAUNCH_SUCC: "isSubscribeLaunch",
      }
    }
  }
  getTpls(type, state = {}) {
    let types = initType.call(this, type);
    return getTpls.call(this, types, type)
  }
  setSubscribe(list, setSub,type) {
    return setSubscribe.call(this, list, setSub,type)
  }
  setWxSubscribe(tmplIds = []) {
    console.log('wx setWxSubscribe', tmplIds);
    if (tmplIds.length == 0 || !tmplIds) return Promise.reject();
    return Wxapi.requestSubscribeMessage({
      tmplIds: tmplIds
    }).then(res => {
      let hasAccept = false;
      let num = 0;
      let rejectNum = 0;
      for (let i = 0; i < tmplIds.length; i++) {
        if (res[tmplIds[i]] == "accept") { //勾选的accept
          hasAccept = true;
          num += 1;
        }else{
          rejectNum +=1;
        }
      }
      console.log('订阅', num, ',拒绝', rejectNum, ',总:', tmplIds.length,res);
      if (hasAccept) {  //存在有订阅成功的情况
        return Promise.resolve(res)
      } else if (rejectNum && rejectNum == tmplIds.length){
        return this.subGetSetting(tmplIds);
      }else{
        return Promise.reject(res);
      }
    }).catch(e => {
      if(e && e.errMsg && e.errMsg.indexOf('main')!=-1){
        return Promise.reject({ type: "showError", res: e });
      }else{
        return Promise.reject(e);
      }
    })  
  }
  subGetSetting(tmplIds=[]){
    return Wxapi.getSetting({
      withSubscriptions: true,
    }).then(g_s_res => {
      console.log('getSetting', g_s_res);
      let sub_set = g_s_res && g_s_res.subscriptionsSetting || {};
      let mainSwitch = sub_set.mainSwitch || false;
      let itemSettings = sub_set.itemSettings || {};
      let rejectNum = 0;
      tmplIds && tmplIds.forEach(item => {
        console.log(item, itemSettings[item])
        if (itemSettings[item] == "reject") {
          rejectNum += 1;
        }
      })
      if (rejectNum == tmplIds.length) {
        return Promise.reject({ type: "showError", res: itemSettings });
      }else{
        return Promise.reject({});
      }
    })
  }
  
  checkSubState(id) {
    return checkSubState.call(this, id)
  }
}
function initType(type) {
  let arr = [];
  switch (type) {
    case "SECKILL":
      arr = ["SECKILL_READY", "SECKILL_START", "SECKILL_LAUNCH_SUCC"]
      break;
    case "BARGAIN":
      arr = ["BARGAIN_PROGRESS", "BARGAIN_SUCC"]
      break;
    case "STAFF_COUPON":
      arr = ["INVITE_GIFT_BONUS_EXPIRE"]
    default:
      break;
  }
  return arr;
}
function getTpls(types = [], type = "") {
  if (types && types.length == 0) { return }
  let api = {},req="";
  if(type == "SECKILL"){
    api = SecKillApi;
    req = "getTpls";
  }else if(type == "BARGAIN"){
    api = BargainApi;
    req = "getTpls";
  }else if(type == "STAFF_COUPON"){
    api = DistributionApi;
    req = "getStaffCouponTpls";
  }
  console.log('??',api)
  return api[req]({
    data: {
      "types": types,
      "brandCode": Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      return Promise.resolve(res.data);
    }
    return Promise.reject();

  })
}

function setSubscribe(list = [], setSub,type="") {
  if (list.length == 0) { return Promise.reject() }
  for (let i = 0; i < list.length; i++) {
    if (list[i].state) {
      list[i].state = this.subConf[list[i].state] || ""
    }
    console.log('提交', list[i]);
  }
  let api = {},req = "";
  if(type == "BARGAIN"){
    api = BargainApi;
    req = "setSubscribe";
  }else if(type == "STAFF_COUPON"){
    api = DistributionApi;
    req = "setStaffCouponSub";
  }else{
    api = SecKillApi;
    req = "setSubscribe";
  }
  return api[req]({
    data: {
      "list": list,
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      if (typeof (setSub) == "boolean") {
        SMH.showToast({
          title: setSub ? "成功设置提醒" : "已取消提醒"
        })
      }
      return Promise.resolve();
    }
    return Promise.reject();

  })
}

//废弃
function checkSubState(id) {
  return SecKillApi.getActivitySubscribeStatus({
    params: {
      "activityId": id || 0,
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      return Promise.resolve(res.data || {});
    }
    return Promise.reject();
  })
}

export default WxSubscribe.getInstance();
