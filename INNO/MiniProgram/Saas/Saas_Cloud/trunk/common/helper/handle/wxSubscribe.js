import LM from "../../manager/login-manager.js";
import Conf from "../../../conf";
import SMH from "../../helper/show-msg-helper.js";
import { SecKillApi , BargainApi, DistributionApi,CollageApi,BrandApi, PreSaleApi} from "../../manager/http-manager.js";
import Wxapi from "../../helper/wx-api-helper.js";
import StorageH from "./storageHandle";
const timeSet = {
  "GLOBALSIGN":60*24*7,
  "GLOBALSEC":60*24*365,
  "PRESALEBUY" : 3,
  // "GLOBALASSISTANCE": 60*24*7
}
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
  getTpls(type,label, extraTplsParam) {
    let types = initType.call(this,type,label);
    return getTplsFnc.call(this,type,types,label, extraTplsParam)
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
      return res
      // if (hasAccept) {  //存在有订阅成功的情况
      //   return Promise.resolve(res)
      // } else if (rejectNum && rejectNum == tmplIds.length){ //全部拒绝（需要检测是否是默认全部拒绝
      //   return this.subGetSetting(tmplIds);
      // }else{
      //   return Promise.reject(res);
      // }
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
          SMH.showToast({
            title: res.errMsg
          })
          return Promise.resolve();
        }
      }).catch(e => {
        console.log(e,'catch')
        if (e && e.type == 'showError') {
          SMH.showToast({
            title: "请允许订阅消息在小程序设置中开启"
          })
        } else if (e && typeof e.errMsg === "string" && e.errMsg.indexOf("gesture") >= 0 && !this.hadRejected){
          this.hadRejected = true
          return Promise.reject("invokedError")
        }
        return Promise.resolve();
      })
    }
  }

  subscribeGlobal(info){
    console.log('subscribeGlobal',info)
    let {type="",label="",needSubscribe=true,relatedType='',relatedId=0,extendId1=0,subState,subStateAll,bool=false,curActInfo={},showMsg=false,customData={},that={}, extraTplsParam = {}} = info;
      
    return this.getTpls(type,label,extraTplsParam).then(()=>{
        let tplKey = "" + type + label;
        let tpls = this[tplKey]||[];
        if(needSubscribe && tpls.length>0){
          if(!timeSet[tplKey] || !(getSetSubscribe(relatedId,'get',label,type,this))){ //需订阅
            let tplsList = this[tplKey]||[];
            console.log('需订阅',tplsList);
            return this.wxSubscribeHelp({tplsList,subState,subStateAll,bool,type,info:curActInfo,that:this}).then(res=>{
              timeSet[tplKey] && getSetSubscribe(relatedId,'set',label,type,this);
              if(res){
                setGloabalSubscribe.call(this,res,{relatedId,relatedType,extendId1,type,label})
                showMsg && SMH.showToast({
                  title: bool ? "操作完成" : "订阅成功"
                })
              };
              that.triggerEvent && that.triggerEvent('subscribeCallBack',{...customData,setSub:true})
            })
          }else{ //无需订阅
            console.log('无需订阅');
            that.triggerEvent && that.triggerEvent('subscribeCallBack',{...customData})
            return Promise.resolve();
          }
        }else{
          // let customData = this.data.customData||{};
          that.triggerEvent && that.triggerEvent('subscribeCallBack',{...customData});
          return Promise.resolve();
        }
      })
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
    case "PRESALE":
      types = ["PRESALE_PAYMENT", "PRESALE_END_PAYMENT"];
      break;
    case "STAFF_COUPON":
      types = ["INVITE_GIFT_BONUS_EXPIRE"];
      break;
    case "ORDER":
      types = ["ORDER_SHIPMENTS", "NOTICE_ACTIVITY", "NOTICE_WELFARE_ACTIVITY"];
      break;
    case "BONUS_ORDER":
      types = ["ORDER_BONUS_EXPIRE", "NOTICE_COUPON_PACKAGE", "NOTICE_COUPON_WELFARE"];
      break;
    case "RECEIVE_COUPON":
      types = ["INVITE_GIFT_BONUS_EXPIRE", "NOTICE_COUPON_RECEIVE", "NOTICE_COUPON_ACTIVITY"];
      break;
    case "AFTER_SALE":
      types = ["APPLY_FOR_AFTER_SALE", "REFUND_SUCCESS", "AFTER_SALE_ACTIVITY_INFORM"];
      break;
    case "GLOBAL":
      if(label == 'SEC'){
        types = ['ACTIVITY_JOIN_RESULT','ACTIVITY_STATE','ACTIVITY_PUSH']
      } else if(label == 'SIGN'){
        types = ['SIGN_ACTIVITY_NOTIFY','SIGN_BONUS_EXPIRE','SIGN_BONUS_RECEIVE']
      } else if(label == 'Bonus'){
        types = ['RECEIVE_COUPON','COUPON_ACTIVITY_STATUS','COUPON_EXPIRATION']
      } else if(label == 'ASSISTANCE'){
        types = ["FRIEND_ASSISTANCE_SUCCESS", "AWARD_REACH", "FRIEND_ASSISTANCE"];
      } else if (label == 'BAR_CODE'){
        types = ["NOTICE_WELFARE_ACTIVITY", "COUPON_ACTIVITY_NOTICE", "ACTIVITY_NOTICE"];
      } else if (label == 'MY_COUPON'){
        types = ["ORDER_BONUS_EXPIRE"]
      } else if (label == 'FULLFILL_PROFILE'){
        types = ["NOTICE_COUPON_RECEIVE"]
      }
      break;
    default:
      break;
  }
  console.log("types", types);
  return types;
}
//获取模板
function getTplsFnc(type,types,label="", extraTplsParam = {}) {
  if (types && types.length == 0) { return Promise.reject()};
  let tplKey = "" + type + label;
  if (this[tplKey] && label != 'ASSISTANCE') { return Promise.resolve(this[tplKey])};
  let api = {},req="";
  if(type == "SECKILL"){ // 秒杀
    api = SecKillApi;
    req = "getTpls";
  }else if(type == "BARGAIN"){ // 砍价
    api = BargainApi;
    req = "getTpls";
  }else if(type == "COLLAGE"){ // 
    api = BrandApi;
    req = "getTpls";
  }else if(type == "PRESALE"){ // 预售
    api = BrandApi;
    req = "getTpls";
  }else if(type == 'ORDER'){ // 订单
    api = BrandApi;
    req = "getTpls";
  }else if(type == 'BONUS_ORDER'){ // 购券订单
    api = BrandApi;
    req = "getTpls";
  }else if(type == 'RECEIVE_COUPON'){ // 领券
    api = BrandApi;
    req = "getTpls";
  }else if(type == 'AFTER_SALE'){ // 售后
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
      "brandCode": Conf.BRAND_CODE,
      // "userToken": LM.userToken,
      "userToken": LM.userKey,
      ...extraTplsParam
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      this[tplKey] = res.data;
      return Promise.resolve(res.data);
    }
    return Promise.resolve();
  }).catch(err => {
    console.log("获取模板信息报错", err);
    return Promise.resolve();
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
  if(type == "BARGAIN"){ // 砍价
    api = BargainApi;
    req = "setSubscribe";
  }else if(type == "COLLAGE"){  // 
    api = CollageApi;
    req = "setSubscribe";
  }else if(type == "PRESALE"){ // 预售
    api = PreSaleApi;
    req = "Post_PresaleSubscriptionRecord"
  }else if(type == "STAFF_COUPON"){ // 
    api = DistributionApi;
    req = "setStaffCouponSub";
  }else if(type == "ORDER"){ //  
    api = BrandApi;
    req = "setSubscribe";
  }else if(type == "AFTER_SALE"){ //  
    api = BrandApi;
    req = "setSubscribe";
  }else if(type == "GLOBAL"){ //  
    api = BrandApi;
    req = "setSubscribe";
  }else if(type == "RECEIVE_COUPON"){ //  
    api = BrandApi;
    req = "setSubscribe";
  }else if(type == "BONUS_ORDER"){ //  
    api = BrandApi;
    req = "setSubscribe";
  }else{  // 秒杀
    api = SecKillApi;
    req = "setSubscribe";
  }
  console.log(list)
  return api[req]({
    data: {
      // "userToken": LM.userToken,
      "userToken": LM.userKey,
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

//获取模板type的订阅关系 (当前的已订阅、非订阅状态)
function getSubScribe(tplsList,type,info){
  let key = this.getKeyTemplate(type) || {}; 
  let SubScribe = {}
  tplsList && tplsList.forEach(item=>{
    SubScribe[item.tplType] = info[key[item.tplType]] || 0; // info[xxx]：实际状态，xxx是接口的字段名，info是总数据 （0:未订阅、1：已订阅
  })
  console.log('SubScribe检测订阅状态', SubScribe)
  return SubScribe;
}

//封装help
function getSetSubscribe(id=0,opType='get',label="",type,that){
  try{ 
    let keyName = "" + type + label;
    let tpls = that[keyName]||[];
    let storName = "SUBSCRIBE_" + keyName; 
    if(opType == 'get'){
      let storage = StorageH.get(storName,{})||{};
      if(tpls.length<=0 || storage[label] && storage[label][id])return true //无需订阅
    }else if(opType == 'set'){
      let storage = StorageH.get(storName,{})||{};
      storage[label] || (storage[label] = {});
      storage[label][id] = true;
      StorageH.set(storName,storage,timeSet[keyName]||60*24*7);
    }
  }catch(e){
    console.log(e)
  }
}

function setGloabalSubscribe(detail={},{relatedId,relatedType,extendId1,type,label}){ //订阅接口传参处理
  let subResult = detail.subResult || {};
  let tplKey = "" + type + label;
  let tplsList = this[tplKey] || [];
  let reqList=[];
  for (let i = 0; i < tplsList.length; i++){
    let wxTplId = tplsList[i].wxTplId || "";
    let tplType = tplsList[i].tplType || "";
    let brandTplId = tplsList[i].brandTplId || 0;
    let state=subResult[wxTplId];
    console.log('subResult',subResult,wxTplId)
    reqList.push({
      relatedType,
      relatedId,
      extendId1,
      tplType,
      brandTplId,
      state
    }) 
  }
  this.setSubscribe(reqList,null,type);
}

export default WxSubscribe.getInstance();
