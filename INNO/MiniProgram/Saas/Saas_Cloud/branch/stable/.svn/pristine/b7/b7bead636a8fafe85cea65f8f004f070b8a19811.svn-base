import Conf from "../../conf.js"
import Utils from "../../common/support/utils/utils.js";
import AppUtil from "../../common/helper/app-utils.js";
import StringUtil from "../../common/support/utils/string-util.js";
import LM from "./login-manager";
import MyDate from '../../common/support/utils/date-util.js';
import SHP from "../../common/helper/handle/scanHandleParams.js";
import WxGH from "../../common/helper/handle/wxGroupHandle.js";
import storeH from "../../common/helper/handle/storeHandle.js";
import {
  CL_VsLogApi,
  DistributionApi
} from "./http-manager";
import {
  PageKeys,
  LogMap,
  KeyParamName,
  ExtendKeyParamName,
  SceneType,
  PageType,
  SceneChannel,
  ActionName,
  WithOutLogMap
} from "./log-map";
import SIH from "../helper/sys-infos-helper.js"
import PH from "../helper/handle/paramsHandle.js";
// let shareUser = "";  
class LogManager {
  static getInstance() {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }
    return LogManager.instance;
  }
  // 设置基础会话
  setBaseChannel(ops_params){
    if (!ops_params.path){
      let page = getCurrentPages().slice(-1)[0];
      ops_params.path = (page && page.route) || ""; 
    }
    if (!ops_params.scene){
      ops_params.scene = this.lastScene;
    }
    this.checkResult = checkBaseChannel.call(this, ops_params);
  }  
  // 设置详细会话
  setChannel(ops_params) {
    console.log('setChannel',ops_params,this.checkResult)
    if(this.checkResult && this.checkResult.createLogSession){
      beforeCreateSession.call(this, ops_params)
    }
    console.log('setChannel2',ops_params,this.checkResult)
    createChannel.call(this, ops_params || {}, this.checkResult).then(res=>{
      res = res || {};
      this._channel = res.channelData || {};
      if (res.createLogSessionExtend){
        this.createLogSessionExtend();
      }
    }); 
  }
  getVersion(){
    if(this._version){return this._version}
    let accountInfo = wx.getAccountInfoSync() || {};
    this._version = accountInfo.miniProgram && accountInfo.miniProgram.version || "";
    return this._version
  }
  get channel(){
    return this._channel;
  }
  get version(){
    return this._version || "";
  }
  createSession(channel) {
      AppUtil.log(channel);
      console.log('进来 CreateLogSession',channel)
      CL_VsLogApi.CreateLogSession({
        data: {
          storeId: channel.storeId||0, 
          clientSessionId: channel.clientSessionId||"",
          scene: channel.scene || "",
          model: channel.model || "",
          os: channel.os || "",
          appVersion: channel.appVersion || "",
          sdkVersion: channel.sdkVersion || "",
          pageName: channel.pageName || "",
          pagePath: channel.pagePath||"",
          pageKeyParam1:channel.pageKeyParam1,
          pageKeyParam2:channel.pageKeyParam2,
          pageKeyParam3:channel.pageKeyParam3, 
          pageParamsJson: channel.pageParamsJson,
          shareCode: channel.shareCode||"",
          version:channel.version||""
        },
        other: {
          isShowLoad: false
        }
      });
  }
  createLogSessionExtend(customChannelParams = {}){
    let channelData = this.channel || {};
    let exTendData = {
      storeId: storeH.storeId,
      channelType: channelData.channelType || "",
      channel: channelData.channel || "",
      shareCode: channelData.shareCode || "",
      clientSessionId: channelData.clientSessionId || "",
      scene:channelData.scene,
      pageName: channelData.pageName || "",
      pagePath: channelData.pagePath || "",
      pageKeyParam1: channelData.pageKeyParam1 || "",
      pageKeyParam2: channelData.pageKeyParam2 || "",
      pageKeyParam3: channelData.pageKeyParam3 || "",
      extendParam1: channelData.extendParam1 || "",
      extendParam2: channelData.extendParam2 || "",
      extendParam3: channelData.extendParam3 || "",
      pageParamsJson: channelData.pageParamsJson || "",
      inviteType: channelData.inviteType || "",
      dstbStaffCode: channelData.dstbStaffCode||"",
      staffCode: channelData.staffCode||"",
      customChannel: channelData.customChannel || "",
      extendLogList: channelData.extendLogList||[],
      ...customChannelParams
    }
    console.log('进来 this.channel',this.channel)
    // console.log('进来 createLogSessionExtend',exTendData);
    CL_VsLogApi.CreateLogSessionExtend({
      data:{
        ...exTendData,
        cookieId: SIH.cookieId || "",
      },
      other: {
        isShowLoad: false
      }
    })
  }
  createLogSessionByNavInside(customChannelParams){ // 小程序内跳转时，如果需要调用createLogSessionExtend接口，就调用这
    console.log("调用createLogSessionByNavInside", customChannelParams)
    let paramsJson = PH.paramsJson() || {};
    let options = paramsJson.options || {};
    createChannel.call(this, options).then(res=>{
      res = res || {};
      this._channel = res.channelData || {};
      this.createLogSessionExtend(customChannelParams)
    })
  }
  setHideTag() {
    this.addPageLog("APP_HIDE");
    return this;
  }
  submit() {
    // this.submitVisit();
    this.submitAction();
    this.submitPageLog();
    return this;
  } 
  submitAction() {
    if (this.actionLogTid) {
      clearTimeout(this.actionLogTid);
      delete this.actionLogTid;
    }
    if (this.actionLogs && this.actionLogs.length > 0) {
      let actionLogs = this.actionLogs;
      delete this.actionLogs;
      CL_VsLogApi.uploadLogActionList({
        data: {
          // cookieId: SIH.cookieId,
          actionList: actionLogs || [],
          clientTime: new Date().getTime()
        },
        other: {
          isShowLoad: false
        }
      });
    }
    return this;
  }
  submitPageLog(){
    if (this.pagelogTid) {
      clearTimeout(this.pagelogTid);
      delete this.pagelogTid;
    }
    if (this.pagelogs && this.pagelogs.length > 0) {
      let pagelogs = this.pagelogs;
      delete this.pagelogs;
      CL_VsLogApi.AddPageLog({
        data: {
          // cookieId: SIH.cookieId,
          visitLogList: pagelogs,
          clientTime: new Date().getTime()
        },
        other: {
          isShowLoad: false
        }
      })
    }
    return this;
  }
  submitExtendChannelLog(params){
    //广告点击，直播进入时页面写完日志后提交
    let channelType = "",channel="";
    params = params || {}
    if(params.room_id && params.openid){
      channelType = "LIVE";
      channel = params.room_id;
    }else if(params.tag){
      channelType = "ADVERT";
      channel = params.tag;
    }
    if(!channelType) return;
    CL_VsLogApi.createExtendChannelLog({
      data: {
        storeId: storeH.storeId,
        // "cookieId": SIH.cookieId,
        "clientSessionId": this.channel.clientSessionId,
        "visitLogId": this.pageLog.logId,
        "extendChannelType": channelType,
        "extendChannel": channel
      },
      other: {
        isShowLoad: false
      }
    })
    return this;
  }
  addPageLog(name, path, params,isBack){
    if ((!name && !path) || !this.channel) {
      return;
    }
    this.pageLog = createPageLog(name, path, params, this.pageLog, this.channel, isBack);
    AppUtil.log(this.pageLog);
    this.pagelogs || (this.pagelogs = []);
    this.pagelogs.push(this.pageLog);
    if (this.pagelogs.length >= 20) {
      this.pagelogTid = setTimeout(() => { this.submitPageLog();},500);
    } else if (!this.pagelogTid) {
      this.pagelogTid = setTimeout(this.submitPageLog.bind(this), 30000);
    }
    this.submitExtendChannelLog(params);
    return this;
  } 
  //分销分享日志
  addStaffActivityLog(shareType,relatedId){
    if(!relatedId)return
    this.staffActLog = createstaffActLog(shareType,relatedId);
    this.staffActLogs || (this.staffActLogs = []);
    this.staffActLogs.push(this.staffActLog);
    AppUtil.log(this.staffActLog,this.staffActLogs);
    if (this.staffActLogs.length >= 10) {
      this.staffActLogTid = setTimeout(() => { this.submitStaffActLog();},500);
    } else if (!this.staffActLogTid) {
      this.staffActLogTid = setTimeout(this.submitStaffActLog.bind(this), 30000);
    }
    return this;
  }
  submitStaffActLog(){
    if (this.staffActLogTid) {
      clearTimeout(this.staffActLogTid);
      delete this.staffActLogTid;
    }
    if (this.staffActLogs && this.staffActLogs.length > 0) {
      let staffActLogs = this.staffActLogs;
      delete this.staffActLogs;
      DistributionApi.uploadStaffDstbShareActivityShareLog({
        data: {
          userToken: LM.userKey,
          brandCode: Conf.BRAND_CODE,
          cookieId:SIH.cookieId,
          shareLogList: staffActLogs,
        },
        other: {
          isShowLoad: false
        }
      })
    }
    return this;
  }
  initGlobalParams(ops){
    // let query = ops.query;
    // shareUser = query.fromUser || ""
  }
  clearGlobalParams(){
    this.submit();
  }
  addActionLog(name, position, params, tag) {
    if (!name || !this.channel) {
      return;
    }
    let initActionData = initAction.call(this, name, position, params);
    name = initActionData.name;
    position = initActionData.position;
    params = initActionData.params;
    let actionLog = createActionLog(name, position, params, tag, this.pageLog, this.channel);
    AppUtil.log(actionLog);
    this.actionLogs || (this.actionLogs = []);
    this.actionLogs.push(actionLog);
    if (this.actionLogs.length >= 20) {
      this.actionLogTid = setTimeout(this.submitAction.bind(this), 500);
    } else if (!this.actionLogTid) {
      this.actionLogTid = setTimeout(this.submitAction.bind(this), 30000);
    }
    return this;
  }
  customPageVisitRecord(fromUserToken, pageId = 0, activityId, openid, keyParams1, scene) {
    if (!SceneType[scene] || !SceneType[scene].type || !pageId || !openid) return Promise.reject({scene,pageId,openid});
    return CL_VsLogApi.postCustomPageVisitRecord({
      data: {
        sourceUserToken: fromUserToken || "",
        pageId: pageId,
        openid: "",
        sharedType: SceneType[scene].type || "",
        keyParams1: keyParams1,//staffCode
        activityId: activityId,
        cookieid: openid,
        brandCode: Conf.BRAND_CODE,
      },
      other: {
        isShowLoad: false
      }
    })
  }
}
function hasP(p) {
  if (!p) {
    return false;
  }
  for (let key in p) {
    return true;
  }
  return false;
} 
function getPageKeyParams(path, params, name ="KeyParamName") {
  let keyParams = {};
  let keyNames = {}; 
  keyNames = KeyParamName[path]; 
  if (keyNames && keyNames.length > 0) {
    let keyMapCount = Math.min(keyNames.length, 3);
    for (let i = 0; i < keyMapCount; i++) {
      let keyName = keyNames[i];
      if (keyName in params) {
        keyParams["keyParam" + (i + 1)] = (params[keyName] || params[keyName] == 0) ? params[keyName] : "";
      }
    }
  }
  return keyParams;
}  
function getPageSessionKeyParams(path, params, name = "pageKeyParam") {
  let keyParams = {};
  let keyNames = {};
  name = name || 'pageKeyParam';
  if (name == 'extendParam') {
    if (!(params && params.opKind))return {};
    keyNames = ExtendKeyParamName[params.opKind];
  } else {
    keyNames = KeyParamName[path];
  }
  if (keyNames && keyNames.length > 0) {
    let keyMapCount = Math.min(keyNames.length, 3);
    for (let i = 0; i < keyMapCount; i++) {
      let keyName = keyNames[i];
      if (keyName in params) {
        keyParams[name + (i + 1)] = (params[keyName] || params[keyName] == 0) ? params[keyName] : "";
      }
    }
  }
  return keyParams;
}
function getActionKeyParams(params) {
  let keyParams = {},j = 1;
  for (let i in params){
    let keyName = "keyParam" + j;
    keyParams[keyName] = (params[i] || params[i] == 0) ? params[i] : "";
    if (keyParams[keyName] == ""){
      let key = i.toUpperCase();
      if (key.indexOf("ID") != -1) {
        keyParams[keyName] = 0;
      }
    }
    j++;
  }
  return keyParams;
}
function getExtendParams(query,keyParam){
  let {extendParam1,extendParam2,extendParam3} = query;
  if(query.shareType == "STAFF_ACTIVITY" || query.shareType == "STAFF_GOODS"){
    extendParam1 = query.staffCode;
    extendParam2 = query.activityId;
    extendParam3 = query.goods_id;
  }else if(query.shareType == "STORE_STAFF_ACTIVITY" || query.shareType == "STORE_STAFF_GOODS"){
    extendParam1 = query.storeStaffCode;
    extendParam2 = query.activityId;
    extendParam3 = query.goods_id;
  }
  return {
    extendParam1,
    extendParam2,
    extendParam3
  }
}
function getExtendLogList(query){
  console.log('getExtendLogList',query)
  let obj = {},list = [];
  if(query.shareType == "STAFF_ACTIVITY" || query.shareType == "STAFF_GOODS"){
    obj.extendType = query.shareType;
    obj.extendValue = query.activityId || query.staffActivityId || 0;
    obj.enterType = query.scene ? "SCAN" : "CLICK";
    obj.extendParam1 = (query.shareType == "STAFF_ACTIVITY" ? query.page_id : query.goods_id) || 0;
    obj.extendParam2 = query.staffCode;
    obj.extendParam3 = query.storeCode || ""; // 云店独有，店铺代码
    list.push(obj);
  } else if(query.shareType == "STORE_STAFF_ACTIVITY" || query.shareType == "STORE_STAFF_GOODS") {
    obj.extendType = query.shareType;
    obj.extendValue = query.activityId || query.staffActivityId || 0;
    obj.enterType = query.scene ? "SCAN" : "CLICK";
    obj.extendParam1 = (query.shareType == "STORE_STAFF_ACTIVITY" ? query.page_id : query.goods_id) || 0;
    obj.extendParam2 = query.storeStaffCode;
    obj.extendParam3 = query.storeCode || ""; // 云店独有，店铺代码
    list.push(obj);
  }
  return list
}
//old 页面log
// function createVisitLog(name, path, params, lastLog, channel){}

//new 页面log
function createPageLog(name, path, params, lastLog, channel, isBack){
  let keyParams;
  let paramsJson;
  let extendKeyParams;
  if (hasP(params)) {
    keyParams = getPageKeyParams(path, params,'KeyParamName');
    extendKeyParams = getPageKeyParams(path, params,'ExtendKeyParamName');
    try {
      paramsJson = JSON.stringify(params);
    } catch (e) { }
  }
  let createTime = new Date().getTime()
  let lastLogId;
  let lastLogTimeStamp;
  if (lastLog) {
    lastLogId = lastLog.logId;
    lastLogTimeStamp = lastLog.createTime ? createTime - lastLog.createTime : 0;
  }
  return {
    ...(keyParams || {}),
    ...(extendKeyParams || {}),
    logId: Utils.uuid16ByTime(32),
    clientSessionId: channel.clientSessionId || 0,
    name: name || getPageName.call(this, path, params) || "",
    path: path || "",
    paramsJson: paramsJson || "",
    lastLogId: lastLogId || 0,
    lastLogTimeStamp: lastLogTimeStamp,
    createTime: createTime,
    storeId: storeH.storeId,
    isBack: isBack ? 1:0
  };
}
//动作
function createActionLog(name, position, params, tag = "", visitLog, channel) {
  let keyParams;
  let paramsJson;
  if (hasP(params)) {
    keyParams = getActionKeyParams(params);
    try {
      paramsJson = JSON.stringify(params);
    } catch (e) { }
  }
  name = name.toUpperCase();
  return {
    ...(keyParams || {}),
    clientSessionId: channel.clientSessionId || 0,
    visitLogId: visitLog && visitLog.logId || 0,
    actionId: Utils.uuid16ByTime(32),
    name: name || "",
    paramsJson: paramsJson || "",
    position: position || "",
    createTime: new Date().getTime(),
    tag: tag,
    storeId: storeH.storeId
  };
}
//
function createChannel(ops_params) {
  console.log('进来 createChannel');
  let channelType, channel, keyParams, paramsJson, extendKeyParams;
  ops_params = ops_params || {};
  let params = ops_params.query || '';
  let scene = ops_params.scene || 0;
  let clientSessionId = ""; 
  return checkChannel.call(this, ops_params,this.checkResult).then(channelInfo=>{
    channelInfo = channelInfo || {};
    channelInfo.channelType = StringUtil.trim(channelInfo.channelType);
    // console.log('进来 checkChannel then',channelInfo)
    let query = channelInfo.query || params || {}
    let page = getCurrentPages().pop();
    let _options = page && page.options || {};
    let path = _options.scene ? _options.p_path : ops_params.path;
    let _query = {
      ...query,
      ..._options
    }
    let extendParamsList = {}, extendLogList=[]; 
    if (hasP(_query)) {
      keyParams = getPageSessionKeyParams(path, _query);
      if (SceneChannel[scene] || scene && query.opKind){
        extendKeyParams = getPageSessionKeyParams(path, query, 'extendParam');
      }
      extendParamsList = getExtendParams.call(this,_query,keyParams);
      extendLogList = getExtendLogList.call(this,_query);
      console.log('extendKeyParams',extendKeyParams)
      console.log('extendParamsList',extendParamsList)
      console.log('extendLogList',extendLogList)
      try {
        paramsJson = JSON.stringify(_query);
      } catch (e) {}
    }
    let lastChannel = this.channel || {};
    clientSessionId = lastChannel.clientSessionId;
    let channelData = { //this.channel
      channelType: channelInfo.channelType || "",
      channel: channelInfo.channel || "",
      clientSessionId: clientSessionId || Utils.uuid16ByTime(32, 16) || "",
      shareCode: _query.fromUser || "",
      pageParamsJson: paramsJson || "",
      scene: scene || "",
      model: SIH.model || "",
      os: SIH.os || "",
      appVersion: SIH.appVersion || "",
      sdkVersion: SIH.sdkVersion || "",
      createTime: new Date().getTime(),
      pageName: getPageName.call(this, path, _query) || "",
      pagePath: path || "",
      ...(keyParams||{}),
      ...(extendKeyParams||{}),
      inviteType: query.shareType,
      dstbStaffCode: query.staffCode,
      staffCode: query.storeStaffCode,
      customChannel: query.customChannel || "",
      extendLogList,
      ...(extendParamsList || {})
    }
    let data = {
      channelData,
      createLogSession:channelInfo.createLogSession || false,
      createLogSessionExtend: channelInfo.createLogSessionExtend || false,
    }
    return Promise.resolve(data)
  });
} 
// 同步检测会话信息
function checkBaseChannel(ops_params){
  let channelType = '',  createLogSession = false, createLogSessionExtend = false, channel = "";
  ops_params = ops_params || {};
  let query = ops_params.query || {};
  let scene = ops_params.scene || 0;
  //1--30秒对比
  let checkTime = checkChannelTime.call(this);
  if (checkTime){
    this.channelTime = new Date().getTime();
    createLogSession = true;
    createLogSessionExtend = true;
  }
  //2--进入的场景值是否属于渠道场景值
  if (SceneChannel[scene] || scene) {
    channelType = SceneChannel[scene] && SceneChannel[scene].channel || (scene + '');
    createLogSession = true;
    createLogSessionExtend = true;
  } 
  //3--是否与上次进入的scene场景值一致
  if (!this.lastScene || ((this.lastScene != scene) && scene)) {
    createLogSession = true;
    createLogSessionExtend = true;
  }
  scene && (this.lastScene = scene);
  //4--是否分享进入
  if (query.fromUser && !createLogSessionExtend) {
    createLogSession = true;
    createLogSessionExtend = true;
  }
  if (ops_params._reset){
    createLogSession = true;
    createLogSessionExtend = true;
  }
  if (query.channelType) {    //自定义渠道
    channelType = query.channelType || "MINI_QRCODE" || "";
    channel = query.channel || query.scene ||"";
  }
  if(createLogSession || createLogSessionExtend){ // 重新生成会话ID
    this._channel = {
      ...this._channel,
      clientSessionId: Utils.uuid16ByTime(32, 16)
    }
  }
  // //提交createLogSession 目前只获取基本的信息
  // if (createLogSession){
  //   beforeCreateSession.call(this, ops_params);
  // }
  return {
    createLogSession,
    createLogSessionExtend,
    channelType,
    channel
  }
}
function checkChannel(ops_params = {}, checkResult){
  checkResult = checkResult || {};
  console.log('进来 checkChannel',ops_params,checkResult,);
  let {
    channel,
    channelType,
    createLogSession,
    createLogSessionExtend,
  } = checkResult;
  ops_params = ops_params || {};
  let query = ops_params.query || {};
  let scene = ops_params.scene || 0;  
  let p = new Promise((rs,rj)=>{
    if (channelType) {
      if (channelType === "EXTERNAL_LINK") { // 自定义跳转带自定义渠道进入
        channel = scene;
        return rs();
      }
      else if (channelType == 'CUSTOM' || query.channelType) { //扫码进入
        console.log("进入扫码",query);
        createLogSessionExtend = true; 
        if (!query.channelType) {    
          channelType = "MINI_QRCODE";
          channel = query.scene;
        }
        SHP.getParams(["options"]).then(params => {
            let ph = params["options"] || {};
            console.log("SHP options", ph);
            query = ph.query;
            createLogSessionExtend = true;
            return rs();
        }) 
      }
      else if (channelType == 'GROUP_SHARE') { //群分享
        WxGH.getShareTicket(ops_params.shareTicket).then(res => {
          console.log('群分享ID', res);
          if(res){
            channel = res;
            createLogSessionExtend = true;
          }else{
            channelType = "" 
          }
          return rs();
        });
      } else if (channelType == 'OFFIACCOUNT_MENU' || channelType == 'OFFIACCOUNT_MSG' || channelType == 'OFFIACCOUNT_ARTICLE' || channelType == 'MINIPRO') {   //appId
        channel = ops_params.referrerInfo && ops_params.referrerInfo.appId || ops_params.query && ops_params.query.appid || 'NO_APPID';
        if (channel){
          createLogSessionExtend = true;
        }else{
          channelType = "";
        }
        return rs();
      } else {
        channel = scene;
        return rs();
      }
    }else{
      return rs();
    }
  })
  return p.then(res=>{
    return Promise.resolve({
      channelType,
      channel,
      query,
      createLogSession,
      createLogSessionExtend,
    });
  })
}
function beforeCreateSession(optionData, lastChannel){
  let channelType;
  let channel;
  let keyParams;
  let paramsJson;
  let path = optionData.path;
  let params = optionData.query;
  let scene = optionData.scene;
  if (hasP(params)) {
    keyParams = getPageSessionKeyParams(path, params);
    try {
      paramsJson = JSON.stringify(params);
    } catch (e) { }
    console.log('params.fromUser',params.fromUser)
    if (params.fromUser) {
      channelType = "INVITE";
      channel = params.fromUser;
    } else if (params.channelType) {
      channelType = params.channelType;
      channel = params.channel;
    } else if (params.scene) {
      channelType = "MINI_QRCODE",
      channel = params.scene
    }
    channelType = StringUtil.trim(channelType);
  }
  lastChannel = {
    clientSessionId: Utils.uuid16ByTime(32, 16),
    scene: scene || "",
    model: SIH.model || "",
    os: SIH.os || "",
    appVersion: SIH.appVersion || "",
    sdkVersion: SIH.sdkVersion || "",
    createTime: new Date().getTime(),
    pageName: getPageName.call(this, path, params) || "",
    pagePath: path,
    ...keyParams,
    pageParamsJson: paramsJson,
    shareCode: params.fromUser||"",
    storeId: storeH.storeId,
    channelType: channelType || "",
    channel: channel || "",
    inviteType: params.shareType,
    dstbStaffCode: params.staffCode,
    staffCode: params.storeStaffCode,
    customChannel: params.customChannel || "",
    version:this.version||""
  }
  this._channel = lastChannel;
  this.createSession(lastChannel);
}
//初始化acition参数
function initAction(name,position, params) {
  //动作日记没有传position,params
  if (name){
    name = ActionName[name] || name;
  }
  if (position && params) {
    return {
      position,
      params,
      name
    }
  } else {
    let this_page = getCurrentPages().pop();
    let params = params || this_page.options || {};
    if (!position && this_page.route) {
      position = LogMap[this_page.route] || "";
    }
    position = position || ""
    return {
      position,
      params,
      name
    }
  }
}
function getPageName(path,params){
  let keys = LogMap[path];
  if(!keys) return "";
  if(typeof(keys) == "string"){
    return keys
  }
  if (keys instanceof Array && keys.length > 0){
    let key = keys[0];
    if (path === "pages/micro_mall/plugins/presale/presale_buy_info"){
      let paramsKeys = key["params"] || [];
      let keyStr = "";
      for (let i = 0; i < paramsKeys.length; i++){
        let val = params[paramsKeys[i]] && params[paramsKeys[i]] != '0' ? 1 : 0;
        keyStr = keyStr ? keyStr + "," + val : val;
      }
      return key[keyStr] || key["default"] || "";
    }else{
      for (let i in params) {
        if (key[params[i]]) return key[params[i]];
      }
    }
  }
  return "";
} 
//分销活动、商品
function createstaffActLog(shareType,relatedId){
  return {
    shareType,
    relatedId,
    createTime:MyDate.format(new Date(),'yyyy-MM-dd HH:mm:ss')
  };
} 
//
function checkChannelTime(time = 30){
  if (this.channelTime) {
    let intervalTime = new Date().getTime() - parseFloat(this.channelTime);
    return intervalTime > ( time * 1000 );
  } else {
    this.channelTime = new Date().getTime();
    return true;
  }
}

export default LogManager.getInstance();
export {
  PageKeys,
  LogMap,
  KeyParamName
};