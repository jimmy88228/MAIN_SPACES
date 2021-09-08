import LM from "../../manager/login-manager.js";
import Conf from "../../../conf";
import SMH from "../../helper/show-msg-helper.js";
import { SecKillApi , BargainApi, DistributionApi,CollageApi,BrandApi} from "../../manager/http-manager.js";
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
  //提交接口时订阅状态的转换
  get subConf() {//0--状态，订阅消息状态(0:模板不可用  1:已订阅  2:已拒绝  3:模板被禁  4:订阅后又取消(已授权))
    return {
      disable: 0,
      accept: 1,
      reject: 2,
      ban: 3,
      rejectInner: 4,
    }
  }
  //接口初始定义的订阅状态
  get SubStatus() {
    return {
      disable: 0,
      accept: 1,
      reject: 0,
      ban: 0,
      rejectInner: 2,
    }
  }  
  // 获取接口返回的订阅字段
  getKeyTemplate(type){
    if(type == "BARGAIN"){
      return {
        BARGAIN_PROGRESS: "isSubsribeBargainProgress",
        BARGAIN_SUCC: "isSubsribeBargainSucc",
      }
    }
    else{
      return {
        SECKILL_READY: "isSubscribeReady",
        SECKILL_START: "isSubscribeStart",
        SECKILL_LAUNCH_SUCC: "isSubscribeLaunch",
      }
    }
  }
  //获取模板
  getTpls(type,label) {
    let types = initType.call(this,type,label);
    return getTpls.call(this,type,types,label)
  }
  //提交接口
  setSubscribe(list, setSub,type) {
    return setSubscribe.call(this, list, setSub,type)
  }
  //微信订阅弹窗
  setWxSubscribe(tmplIds = []) {
    console.log('订阅 微信订阅弹窗', tmplIds);
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
      console.log('已订阅:', num, ',已拒绝:', rejectNum, ',总:', tmplIds.length,res);
      if (hasAccept) {  //存在有订阅成功的情况
        return Promise.resolve(res)
      } else if (rejectNum && rejectNum == tmplIds.length){ //全部拒绝（需要检测是否是默认全部拒绝
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
  //获取setting
  subGetSetting(tmplIds=[]){
    return Wxapi.getSetting({
      withSubscriptions: true,
    }).then(g_s_res => {
      console.log('getSetting', g_s_res);
      let sub_set = g_s_res && g_s_res.subscriptionsSetting || {};
      let closedMainSwitch = sub_set.hasOwnProperty('mainSwitch') && !sub_set.mainSwitch //主开关
      let itemSettings = sub_set.itemSettings || {};
      let rejectNum = 0;
      tmplIds && tmplIds.forEach((item,index) => {
        console.log(index,item, itemSettings[item])
        if (itemSettings[item] == "reject") {
          rejectNum += 1;
        }
      })
      if (rejectNum == tmplIds.length || closedMainSwitch) {
        return Promise.reject({ type: "showError", res: itemSettings });
      }else{
        return Promise.reject({});
      }
    })
  }
  //wxTplId 组成的数组
  getwxTplIds(data){
    let tmplIds = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].wxTplId) {
        tmplIds.push(data[i].wxTplId);
      } 
    }
    return tmplIds
  }
  //订阅点击操作
  wxSubscribeHelp({tplsList=[],bool=false,subState,subStateAll,type,info,that={}}){
    subState = subState || getSubScribe.call(this,tplsList,type,info); //订阅状态subState没有传进来就进来再获取
    subStateAll = subStateAll || subState; //目前秒杀页面用到 subStateAll兼容
    console.log('订阅 tplsList',bool,tplsList,subState,type,info);
    let tmplIds = [];
    let select = 0;
    for (let i = 0; i < tplsList.length; i++) {
      if (tplsList[i].wxTplId) {
        tmplIds.push(tplsList[i].wxTplId);
      }
      let tplType = tplsList[i].tplType;
      if (subState[tplType] != 0 || subStateAll[tplType] != 0) { //subStateAll兼容
        select += 1; //已允许
      }
      console.log('订阅 允许状态占比:', select, '/', tplsList.length, tplType, '组件状态:',subState[tplType]);
    }
    // console.log('订阅 tmplIds',select,tmplIds.length,tmplIds,bool);
    if (select == tmplIds.length || bool) { // 完全允许后的取消 || 当前存在已允许
      let subResult = {}; 
      for (let i = 0; i < tmplIds.length; i++) {
        let tplType = tplsList[i].tplType;
        subResult[tmplIds[i]] = bool ? subState[tplType] == 0 ? 'reject' : 'rejectInner' : 'accept'
      }
      console.log('订阅 subResult', subResult);
      that.triggerEvent && that.triggerEvent("updateSubState", { subResult, setSub: !bool }); //兼容
      that.triggerEvent && that.triggerEvent("wxSubCallback", { subResult, setSub: !bool }); //兼容
      return Promise.resolve({ subResult, setSub: !bool });
    }else{
      return this.setWxSubscribe(tmplIds).then(res => {
        let subResult = res;
        console.log('订阅 subResult', subResult);
        if (res.errMsg.indexOf("ok") != -1) {
          that.triggerEvent && that.triggerEvent("updateSubState", { subResult, setSub: true }); //兼容
          that.triggerEvent && that.triggerEvent("wxSubCallback", { subResult, setSub: true }); //兼容
          return Promise.resolve({ subResult, setSub: true });
        } else {
          app.SMH.showToast({
            title: res.errMsg
          })
          return Promise.resolve();
        }
      }).catch(e => {
        console.log(e,'catch')
        if (e && e.type == 'showError') {
          app.SMH.showToast({
            title: "请允许订阅消息在小程序设置中开启"
          })
        }
        return Promise.resolve();
      })
    }
  }
}
//获取参数
function initType(type,label) {
  let types = [];
  switch (type) {
    case "SECKILL":
      types = ["SECKILL_READY", "SECKILL_START", "SECKILL_LAUNCH_SUCC"]
      break;
    case "BARGAIN":
      types = ["BARGAIN_PROGRESS", "BARGAIN_SUCC"]
      break;
    case "COLLAGE":
      types = ["COLLAGE_GROUP_SUCC", "COLLAGE_GROUP_PROGRESS","COLLAGE_GROUP_FAIL"]
      break;
    case "STAFF_COUPON":
      types = ["INVITE_GIFT_BONUS_EXPIRE"]
    case "GLOBAL":
      if(label == 'SEC'){
        types = ['ACTIVITY_JOIN_RESULT','ACTIVITY_STATE','ACTIVITY_PUSH']
      } else if(label == 'SIGN'){
        types = ['SIGN_ACTIVITY_NOTIFY','SIGN_BONUS_EXPIRE','SIGN_BONUS_RECEIVE']
      }
    default:
      break;
  }
  return types;
}
//获取模板
function getTpls(type,types,label="") {
  if (types && types.length == 0) { return Promise.reject()};
  let tplKey = "" + type + label;
  if (this[tplKey]) { return Promise.resolve(this[tplKey])};
  let api = {},req="";
  if(type == "SECKILL"){
    api = SecKillApi;
    req = "getTpls";
  }else if(type == "BARGAIN"){
    api = BargainApi;
    req = "getTpls";
  }else if(type == "COLLAGE"){
    api = BrandApi;
    req = "getTpls";
  }else if(type == "STAFF_COUPON"){
    api = DistributionApi;
    req = "getStaffCouponTpls";
  }else if(type == "GLOBAL"){
    api = BrandApi;
    req = "getTpls";
  }
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
      this[tplKey] = res.data;
      return Promise.resolve(res.data);
    }
    return Promise.reject();

  })
}
//提交接口
function setSubscribe(list = [],setSub,type="",showMsg) {
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
  }else if(type == "COLLAGE"){
    api = CollageApi;
    req = "setSubscribe";
  }else if(type == "STAFF_COUPON"){
    api = DistributionApi;
    req = "setStaffCouponSub";
  }else if(type == "GLOBAL"){
    api = BrandApi;
    req = "setSubscribe";
  }else{
    api = SecKillApi;
    req = "setSubscribe";
  }
  console.log(list)
  return api[req]({
    data: {
      "userToken": LM.userToken,
      "brandCode": Conf.BRAND_CODE,
      "list": list,
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      if (showMsg && typeof (setSub) == "boolean") {
        SMH.showToast({
          title: setSub ? "订阅成功" : "已取消订阅"
        })
      }
      return Promise.resolve();
    }
    return Promise.reject();

  })
}

//获取模板type的订阅关系
function getSubScribe(tplsList,type,info){
  let key = this.getKeyTemplate(type) || {}; 
  let SubScribe = {}
  tplsList && tplsList.forEach(item=>{
    SubScribe[item.tplType] = info[key[item.tplType]] || 0; // info[xxx]：实际状态，xxx是接口的字段名，info是总数据
  })
  console.log('SubScribe检测订阅状态', SubScribe)
  return SubScribe;
}

export default WxSubscribe.getInstance();
