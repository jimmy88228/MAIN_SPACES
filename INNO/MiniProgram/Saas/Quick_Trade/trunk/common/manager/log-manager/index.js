// import Conf from "../../conf.js"
// import { uuid16ByTime } from "../../utils/normal/index";
// import AppUtil from "../helper/app-utils.js";
// import StringUtil from "../support/utils/string-util.js";
// import LM from "./login-manager";
// import MyDate from '../support/utils/date-util.js';
// import SHP from "../helper/handle/scanHandleParams.js"
// import WxGH from "../helper/handle/wxGroupHandle.js"
// import StorageH from "../helper/handle/storageHandle.js"
// import PH from "../helper/handle/paramsHandle";
// import {
//   VsLogApi,
//   GoodsApi,
//   DistributionApi
// } from "./http-manager";
// import {
//   PageKeys,
//   LogMap,
//   KeyParamName,
//   ExtendKeyParamName,
//   SceneType,
//   PageType,
//   SceneChannel,
//   ActionName,
// } from "./log-map";
// import SIH from "../helper/sys-infos-helper.js"
// let sysInfo = SIH.systemInfo;
// let shareUser = "";

// class LogManager {
//   static getInstance() {
//     if (!LogManager.instance) {
//       LogManager.instance = new LogManager();
//     }
//     return LogManager.instance;
//   }
//   // 设置基础会话
//   setBaseChannel(ops_params){
//     if (!ops_params.path){
//       let page = getCurrentPages().slice(-1)[0];
//       ops_params.path = (page && page.route) || ""; 
//     }
//     if (!ops_params.scene){
//       ops_params.scene = this.lastScene;
//     }
//     this.checkResult = checkBaseChannel.call(this, ops_params);
//   }
//   // 设置详细会话
//   setChannel(ops_params) {
//     if(this.checkResult && this.checkResult.createLogSession){
//       beforeCreateSession.call(this, ops_params)
//     }
//     createChannel.call(this, ops_params || {}, this.checkResult).then(res=>{
//       res = res || {};
//       this._channel = res.channelData || {};
//       if (res.createLogSessionExtend){
//         this.createLogSessionExtend();
//       }
//     }); 
//   }
//   createSession(channel) {
//       AppUtil.log(channel);
//       VsLogApi.CreateLogSession({
//         data: {
//           ...channel,
//           userToken: LM.userToken || "",
//           cookieId: SIH.cookieId || "",
//           brandCode: Conf.BRAND_CODE || ""
//         },
//         other: {
//           isShowLoad: false
//         }
//       });
//   }
//   createLogSessionExtend(){
//     let channelData = this.channel || {};
//     console.log("channelData",channelData);
//     let exTendData = {
//       channelType: channelData.channelType || "",
//       channel: channelData.channel || "",
//       fromUser: channelData.fromUser || "",
//       clientSessionId: channelData.clientSessionId || "",
//       scene:channelData.scene,
//       pageName: channelData.pageName || "",
//       pagePath: channelData.pagePath || "",
//       pageKeyParam1: channelData.pageKeyParam1 || "",
//       pageKeyParam2: channelData.pageKeyParam2 || "",
//       pageKeyParam3: channelData.pageKeyParam3 || "",
//       extendParam1: channelData.extendParam1 || "",
//       extendParam2: channelData.extendParam2 || "",
//       extendParam3: channelData.extendParam3 || "",
//       pageParamsJson: channelData.pageParamsJson || "",
//       inviteType: channelData.inviteType || "",
//       dstbStaffCode: channelData.dstbStaffCode||"",
//       customChannel: channelData.customChannel || "",
//       extendLogList: channelData.extendLogList||[]
//     }
//     VsLogApi.CreateLogSessionExtend({
//       data:{
//         ...exTendData,
//         userToken: LM.userToken || "",
//         cookieId: SIH.cookieId || "",
//         brandCode: Conf.BRAND_CODE || ""
//       },
//       other: {
//         isShowLoad: false
//       }
//     }).finally(()=>{
//       // // extend 提交后提交一波日志，避免首次进入快速退出页面，无法提交数据
//       this.submit('channelSubmit');
//     })
//   }
//   createLogSessionByNavInside(customChannelParams = {}){ // 小程序内跳转时，如果需要调用createLogSessionExtend接口，就调用这
//     console.log("调用createLogSessionByNavInside", customChannelParams)
//     let paramsJson = PH.paramsJson() || {};
//     let options = paramsJson.options || {};
//     let query = options.query || {};
//     options.query = {...query, ...customChannelParams}
//     this.setBaseChannel(options);
//     this.setChannel(options);
//     // createChannel.call(this, options).then(res=>{
//     //   res = res || {};
//     //   this._channel = res.channelData || {};
//     //   this.createLogSessionExtend(customChannelParams)
//     // })
//   }
//   setHideTag() {
//     this.addVisitLog("APP_HIDE");
//     this.addPageLog("APP_HIDE");
//     return this;
//   }
//   submit(type) {
//     this.submitVisit(type);
//     this.submitAction(type);
//     this.submitPageLog(type);
//     this.submitSearchLog(type);
//     return this;
//   }
//   submitVisit() {
//     if (this.visitlogTid) {
//       clearTimeout(this.visitlogTid);
//       delete this.visitlogTid;
//     }
//     if (this.visitlogs && this.visitlogs.length > 0) {
//       let visitlogs = this.visitlogs;
//       delete this.visitlogs;
//       VsLogApi.writePageLog({
//         data: {
//           "ip": "",
//           "machineid": sysInfo.model || "",
//           "userToken": LM.userToken,
//           "sysversion": sysInfo.system + sysInfo.version,
//           "appversion": "1.0.0",
//           "systype": "WXAPP",
//           "cookie_id": SIH.cookieId,
//           "brandCode": Conf.BRAND_CODE,
//           "store_id": 0,
//           "device_type": sysInfo.system,
//           "channel_code": "",
//           "erp_channel_code": "",
//           "details": visitlogs || []
//       },
//         other: {
//           isShowLoad: false
//         }
//       })
//     }
    
//     return this;
//   }
//   submitAction() {
//     if (this.actionLogTid) {
//       clearTimeout(this.actionLogTid);
//       delete this.actionLogTid;
//     }
//     if (this.actionLogs && this.actionLogs.length > 0) {
//       let actionLogs = this.actionLogs;
//       delete this.actionLogs;
//       VsLogApi.uploadLogActionList({
//         data: {
//           userToken: LM.userToken,
//           cookieId: SIH.cookieId,
//           brandCode: Conf.BRAND_CODE,
//           actionList: actionLogs || [],
//           clientTime: new Date().getTime()
//         },
//         other: {
//           isShowLoad: false
//         }
//       });
//     } else {

//     }
//     return this;
//   }
//   submitPageLog(type){
//     console.log("submitPageLog", this.pagelogs);
//     if (this.pagelogTid) {
//       clearTimeout(this.pagelogTid);
//       delete this.pagelogTid;
//     }
//     if (this.pagelogs && this.pagelogs.length > 0) {
//       let pagelogs = this.pagelogs;
//       delete this.pagelogs;
//       VsLogApi.AddPageLog({
//         data: {
//           userToken: LM.userToken,
//           cookieId: SIH.cookieId,
//           brandCode: Conf.BRAND_CODE,
//           visitLogList: pagelogs,
//           clientTime: new Date().getTime()
//         },
//         other: {
//           isShowLoad: false
//         }
//       })
//       this.isNoChannelSubmit = false;
//     } else if(type == 'channelSubmit'){
//       this.isNoChannelSubmit = true;
//     }
//     return this;
//   }
//   submitExtendChannelLog(params){
//     //广告点击，直播进入时页面写完日志后提交
//     let channelType = "",channel="";
//     params = params || {};
//     if(params.room_id && params.openid){
//       channelType = "LIVE";
//       channel = params.room_id;
//     }else if(params.tag){
//       channelType = "ADVERT";
//       channel = params.tag;
//     }
//     if(!channelType) return;
//     VsLogApi.createExtendChannelLog({
//       data: {
//         "brandCode": Conf.BRAND_CODE,
//         "userToken": LM.userToken,
//         "cookieId": SIH.cookieId,
//         "clientSessionId": this.channel.clientSessionId,
//         "visitLogId": this.pageLog.logId,
//         "extendChannelType": channelType,
//         "extendChannel": channel
//       },
//       other: {
//         isShowLoad: false
//       }
//     })
//     return this;
//   }
//   addVisitLog(name, path, params) {
//     if ((!name && !path) || !this.channel) {
//       return;
//     }
//     this.visitLog = createVisitLog(name, path, params, this.visitLog, this.channel);
//     AppUtil.log(this.visitLog);
//     this.visitlogs || (this.visitlogs = []);
//     this.visitlogs.push(this.visitLog);
//     if (this.visitlogs.length >= 20) {
//       this.visitlogTid = setTimeout(() => { this.submitVisit(); }, 500);
//     } else if (!this.visitlogTid) {
//       this.visitlogTid = setTimeout(this.submitVisit.bind(this), 30000);
//     }
//     return this;
//   }
//   addPageLog(name, path, params,isBack){
//     console.log("isNoChannelSubmit", this.isNoChannelSubmit,"----", name,"------", path,'-----', this.channel);
//     if ((!name && !path) || !this.channel) {
//       return;
//     }
//     this.pageLog = createPageLog(name, path, params, this.pageLog, this.channel, isBack);
//     AppUtil.log(this.pageLog);
//     this.pagelogs || (this.pagelogs = []);
//     this.pagelogs.push(this.pageLog);
    
//     if(this.isNoChannelSubmit){
//       this.pagelogTid = setTimeout(() => { this.submitPageLog();},500);
//     } else {
//       if (this.pagelogs.length >= 20) {
//         this.pagelogTid = setTimeout(() => { this.submitPageLog();},500);
//       } else if (!this.pagelogTid) {
//         this.pagelogTid = setTimeout(this.submitPageLog.bind(this), 30000);
//       }
//     }
//     this.submitExtendChannelLog(params);
//     return this;
//   }
//   //搜索日志
//   addSearchLog(words,isSetSto=true){
//     if(!(/^(\S+)$/.test(words)))return
//     isSetSto && setStorageFnc(words); //搜索记录缓存
//     this.searchLog = createSearchLog(words);
//     AppUtil.log(this.searchLog);
//     this.searchLogs || (this.searchLogs = []);
//     this.searchLogs.push(this.searchLog);
//     if (this.searchLogs.length >= 10) {
//       this.searchLogTid = setTimeout(() => { this.submitSearchLog();},500);
//     } else if (!this.searchLogTid) {
//       this.searchLogTid = setTimeout(this.submitSearchLog.bind(this), 30000);
//     }
//     return this;
//   } 
//   submitSearchLog(){
//     if (this.searchLogTid) {
//       clearTimeout(this.searchLogTid);
//       delete this.searchLogTid;
//     }
//     if (this.searchLogs && this.searchLogs.length > 0) {
//       let searchLogs = this.searchLogs;
//       delete this.searchLogs;
//       GoodsApi.uploadSearchKeyword({
//         data: {
//           userToken: LM.userToken,
//           brandCode: Conf.BRAND_CODE,
//           detailList: searchLogs,
//         },
//         other: {
//           isShowLoad: false
//         }
//       })
//     }
//     return this;
//   }
//   //分销分享日志
//   addStaffActivityLog(shareType,relatedId){
//     if(!relatedId)return
//     this.staffActLog = createstaffActLog(shareType,relatedId);
//     this.staffActLogs || (this.staffActLogs = []);
//     this.staffActLogs.push(this.staffActLog);
//     AppUtil.log(this.staffActLog,this.staffActLogs);
//     if (this.staffActLogs.length >= 10) {
//       this.staffActLogTid = setTimeout(() => { this.submitStaffActLog();},500);
//     } else if (!this.staffActLogTid) {
//       this.staffActLogTid = setTimeout(this.submitStaffActLog.bind(this), 30000);
//     }
//     return this;
//   }
//   submitStaffActLog(){
//     if (this.staffActLogTid) {
//       clearTimeout(this.staffActLogTid);
//       delete this.staffActLogTid;
//     }
//     if (this.staffActLogs && this.staffActLogs.length > 0) {
//       let staffActLogs = this.staffActLogs;
//       delete this.staffActLogs;
//       DistributionApi.uploadStaffDstbShareActivityShareLog({
//         data: {
//           userToken: LM.userToken,
//           brandCode: Conf.BRAND_CODE,
//           cookieId:SIH.cookieId,
//           shareLogList: staffActLogs,
//         },
//         other: {
//           isShowLoad: false
//         }
//       })
//     }
//     return this;
//   }
//   initGlobalParams(ops){
//     let query = ops.query;
//     shareUser = query.fromUser || ""
//   }
//   clearGlobalParams(){
// 		this.setHideTag();
//     this.submit();
//   }
//   addActionLog(name, position, params, tag) {
//     if (!name || !this.channel) {
//       return;
//     }
//     let initActionData = initAction.call(this, name, position, params);
//     name = initActionData.name;
//     position = initActionData.position;
//     params = initActionData.params;
//     let actionLog = createActionLog(name, position, params, tag, this.pageLog, this.channel);
//     AppUtil.log(actionLog);
//     this.actionLogs || (this.actionLogs = []);
//     this.actionLogs.push(actionLog);
//     if (this.actionLogs.length >= 20) {
//       this.actionLogTid = setTimeout(this.submitAction.bind(this), 500);
//     } else if (!this.actionLogTid) {
//       this.actionLogTid = setTimeout(this.submitAction.bind(this), 30000);
//     }
//     return this;
//   }
//   customPageVisitRecord(fromUserToken, pageId = 0, activityId, openid, keyParams1, scene) {
//     if (!SceneType[scene] || !SceneType[scene].type || !pageId || !openid) return Promise.reject();
//     return VsLogApi.postCustomPageVisitRecord({
//       data: {
//         sourceUserToken: fromUserToken || "",
//         pageId: pageId || "",
//         openid: "",
//         sharedType: SceneType[scene].type || "",
//         keyParams1: keyParams1,//staffCode
//         brandCode: Conf.BRAND_CODE,
//         activityId: activityId || 0,
//         cookieid: openid || ""
//       },
//       other: {
//         isShowLoad: false
//       }
//     })
//   }
//   get channel(){
//     return this._channel;
//   }
// }
// //初始化acition参数
// function initAction(name,position, params) {
//   //动作日记没有传position,params
//   if (name){
//     name = ActionName[name] || name;
//   }
//   if (position && params) {
//     return {
//       position,
//       params,
//       name
//     }
//   } else {
//     let this_page = getCurrentPages().pop();
//     let params = params || this_page.options || {};
//     if (!position && this_page.route) {
//       position = LogMap[this_page.route] || "";
//     }
//     position = position || ""
//     return {
//       position,
//       params,
//       name
//     }
//   }
// }
// function getPageName(path,params){
//   let keys = LogMap[path];
//   if(!keys) return "";
//   if(typeof(keys) == "string"){
//     return keys
//   }
//   if (keys instanceof Array && keys.length > 0){
//     let key = keys[0];
//     if (path === "pages/micro_mall/plugins/presale/presale_buy_info"){
//       let paramsKeys = key["params"] || [];
//       let keyStr = "";
//       for (let i = 0; i < paramsKeys.length; i++){
//         let val = params[paramsKeys[i]] && params[paramsKeys[i]] != '0' ? 1 : 0;
//         keyStr = keyStr ? keyStr + "," + val : val;
//       }
//       return key[keyStr] || key["default"] || "";
//     }else{
//       for (let i in params) {
//         if (key[params[i]]) return key[params[i]];
//       }
//     }
//   }
//   return "";
// }

// function setStorageFnc(words){
//   let list = StorageH.get('search_list') || [];
//   let isCanAdd=true;
//   list.some(item=>{
//     if(item == words){
//       isCanAdd=false;
//       return true
//     }
//   })
//   isCanAdd && list.push(words);
//   StorageH.set("search_list", list);
// }

// function hasP(p) {
//   if (!p) {
//     return false;
//   }
//   for (let key in p) {
//     return true;
//   }
//   return false;
// }

// function getPageKeyParams(path, params, name ="KeyParamName") {
//   let keyParams = {};
//   let keyNames = {}; 
//   keyNames = KeyParamName[path]; 
//   if (keyNames && keyNames.length > 0) {
//     let keyMapCount = Math.min(keyNames.length, 3);
//     for (let i = 0; i < keyMapCount; i++) {
//       let keyName = keyNames[i];
//       // 特殊keyName兼容
//       if(LogMap[path] == 'BUY_BONUS_ACT_DETAIL' && i == 0){
//         let key1 = "activityId";
//         (key1 in params) && (keyName = key1) || ('activityid' in params) && (keyName = 'activityid')
//       }
//       if (keyName in params) {
//         keyParams["keyParam" + (i + 1)] = (params[keyName] || params[keyName] == 0) ? params[keyName] : "";
//       }
//     }
//   }
//   return keyParams;
// } 

// function getPageSessionKeyParams(path, params, name = "pageKeyParam") {
//   let keyParams = {};
//   let keyNames = {};
//   name = name || 'pageKeyParam';
//   if (name == 'extendParam') {
//     if (!(params && params.opKind))return {};
//     keyNames = ExtendKeyParamName[params.opKind];
//   } else {
//     keyNames = KeyParamName[path];
//   }
//   if (keyNames && keyNames.length > 0) {
//     let keyMapCount = Math.min(keyNames.length, 3);
//     for (let i = 0; i < keyMapCount; i++) {
//       let keyName = keyNames[i];
//       // 特殊keyName兼容
//       if(LogMap[path] == 'BUY_BONUS_ACT_DETAIL' && i == 0){
//         let key1 = "activityId";
//         (key1 in params) && (keyName = key1) || ('activityid' in params) && (keyName = 'activityid')
//       }
//       if (keyName in params) {
//         keyParams[name + (i + 1)] = (params[keyName] || params[keyName] == 0) ? params[keyName] : "";
//       }
//     }
//   }
//   return keyParams;
// }
// function getActionKeyParams(params) {
//   let keyParams = {},j = 1;
//   for (let i in params){
//     let keyName = "keyParam" + j;
//     keyParams[keyName] = (params[i] || params[i] == 0) ? params[i] : "";
//     if (keyParams[keyName] == ""){
//       let key = i.toUpperCase();
//       if (key.indexOf("ID") != -1) {
//         keyParams[keyName] = 0;
//       }
//     }
//     j++;
//   }
//   return keyParams;
// }
// function getExtendParams(query,keyParam){
//   let {extendParam1,extendParam2,extendParam3} = query;
//   console.log('queryqueryquery',query)
//   if(query.shareType == "STAFF_ACTIVITY" || query.shareType == "STAFF_GOODS"){
//     extendParam1 = query.staffCode;
//     extendParam2 = query.activityId || query.staffActivityId || 0;
//     extendParam3 = query.goods_id || query.page_id || 0;
//   }
//   return {
//     extendParam1,
//     extendParam2,
//     extendParam3
//   }
// }
// function getExtendLogList(query){
//   console.log('getExtendLogList',query)
//   let obj = {},list = [];
//   if(query.shareType == "STAFF_ACTIVITY" || query.shareType == "STAFF_GOODS"){
//     obj.extendType = query.shareType;
//     obj.extendValue = query.activityId || query.staffActivityId || 0;
//     obj.enterType = query.scene ? "SCAN" : "CLICK";
//     obj.extendParam1 = (query.shareType == "STAFF_ACTIVITY" ? query.page_id : query.goods_id) || 0;
//     obj.extendParam2 = query.staffCode;
//     obj.extendParam3 = "";
//     list.push(obj);
//   }
//   return list
// }
// //old 页面log
// function createVisitLog(name, path, params, lastLog, channel) {
//   params = params || {};
//   let keyParams = {};
//   let paramsJson;
//   let createTime = MyDate.format(new Date(),"yyyy-MM-dd HH:mm:ss");
//   let page_type= "", key_name= "", relatedId= 0,goodsId= 0;
//   if (PageType[path]){
//     page_type = PageType[path].page_type;
//     if (path == "pages/micro_mall/category/category") {
//       if (params.func_type == "CA") {
//         page_type = page_type["CA"];
//       } else if (params.func_type == "VC") {
//         page_type = page_type["VC"];
//       }
//     }
//     relatedId = params[PageType[path]["params"]] || 0;
//     goodsId = PageType[path]["params"] == "goods_id" ? params[PageType[path]["params"]] : 0;
//   }
//   return {
//     vtime: createTime,
//     funcname: name || getPageName.call(this, path, params) || "",
//     func_content: path,
//     page_type: page_type || name || getPageName.call(this, path, params) || "",
//     related_id: relatedId,
//     goods_id: goodsId,
//     is_from_shared: shareUser ? 1 : 0,
//   };
// }
// //new 页面log
// function createPageLog(name, path, params, lastLog, channel, isBack){
//   let keyParams;
//   let paramsJson;
//   let extendKeyParams;
//   if (hasP(params)) {
//     keyParams = getPageKeyParams(path, params,'KeyParamName');
//     extendKeyParams = getPageKeyParams(path, params,'ExtendKeyParamName');
//     try {
//       paramsJson = JSON.stringify(params);
//     } catch (e) { }
//   }
//   let createTime = new Date().getTime()
//   let lastLogId;
//   let lastLogTimeStamp;
//   if (lastLog) {
//     lastLogId = lastLog.logId;
//     lastLogTimeStamp = lastLog.createTime ? createTime - lastLog.createTime : 0;
//   }
//   return {
//     ...(keyParams || {}),
//     ...(extendKeyParams || {}),
//     logId: uuid16ByTime(32),
//     clientSessionId: channel.clientSessionId || 0,
//     name: name || getPageName.call(this, path, params) || "",
//     path: path || "",
//     paramsJson: paramsJson || "",
//     lastLogId: lastLogId || 0,
//     lastLogTimeStamp: lastLogTimeStamp,
//     createTime: createTime,
//     isBack: isBack ? 1:0
//   };
// }
// //动作
// function createActionLog(name, position, params, tag = "", visitLog, channel) {
//   let keyParams;
//   let paramsJson;
//   if (hasP(params)) {
//     keyParams = getActionKeyParams(params);
//     try {
//       paramsJson = JSON.stringify(params);
//     } catch (e) { }
//   }
//   name = name.toUpperCase();
//   return {
//     ...(keyParams || {}),
//     clientSessionId: channel.clientSessionId || 0,
//     visitLogId: visitLog && visitLog.logId || 0,
//     actionId: uuid16ByTime(32),
//     name: name || "",
//     paramsJson: paramsJson || "",
//     position: position || "",
//     createTime: new Date().getTime(),
//     tag: tag
//   };
// }
// //搜索
// function createSearchLog(words){
//   return {
//     searchStr:words,
//     searchTime:MyDate.format(new Date(),'yyyy-MM-dd HH:mm:ss')
//   };
// }
// //分销活动、商品
// function createstaffActLog(shareType,relatedId){
//   return {
//     shareType,
//     relatedId,
//     createTime:MyDate.format(new Date(),'yyyy-MM-dd HH:mm:ss')
//   };
// }
// //
// function checkChannelTime(time = 30){
//   if (this.channelTime) {
//     let intervalTime = new Date().getTime() - parseFloat(this.channelTime);
//     return intervalTime > ( time * 1000 );
//   } else {
//     this.channelTime = new Date().getTime();
//     return true;
//   }
// }
// //
// function createChannel(ops_params, checkResult) {
//   let keyParams, paramsJson, extendKeyParams;
//   ops_params = ops_params || {};
//   let params = ops_params.query || '';
//   let scene = ops_params.scene || 0;
//   return checkChannel.call(this, ops_params, checkResult).then(channelInfo=>{
//     channelInfo = channelInfo || {};
//     channelInfo.channelType = StringUtil.trim(channelInfo.channelType);
//     let query = channelInfo.query || params || {}
//     let page = getCurrentPages().slice(-1)[0];
//     let _options = page && page.options || {};
//     let path = _options.scene ? _options.p_path : ops_params.path;
//     let _query = {
//       ...query,
//       ..._options
//     }
//     let extendParamsList = {}, extendLogList=[]; 
//     if (hasP(_query)) {
//       keyParams = getPageSessionKeyParams(path, _query);
//       if ((SceneChannel[scene] || scene) && query.opKind){
//         extendKeyParams = getPageSessionKeyParams(path, query, 'extendParam');
//       }
//       extendParamsList = getExtendParams.call(this,_query);
//       extendLogList = getExtendLogList.call(this,_query);
//       console.log('extendKeyParams',extendKeyParams)
//       console.log('extendParamsList',extendParamsList)
//       console.log('extendLogList',extendLogList)
//       try {
//         paramsJson = JSON.stringify(_query);
//       } catch (e) {}
//     }
//     let channelData = { //this.channel
//       channelType: channelInfo.channelType || "",
//       channel: channelInfo.channel || "",
//       clientSessionId: this.channel.clientSessionId,
//       fromUser: _query.fromUser || "",
//       pageParamsJson: paramsJson || "",
//       scene: scene || "",
//       model: SIH.model || "",
//       os: SIH.os || "",
//       appVersion: SIH.appVersion || "",
//       sdkVersion: SIH.sdkVersion || "",
//       createTime: new Date().getTime(),
//       pageName: getPageName.call(this, path, _query) || "",
//       pagePath: path || "",
//       ...(keyParams||{}),
//       ...(extendKeyParams||{}),
//       inviteType: query.shareType,
//       dstbStaffCode: query.staffCode,
//       customChannel: query.customChannel || "",
//       extendLogList,
//       ...(extendParamsList || {}),
//     }
//     let data = {
//       channelData,
//       createLogSession:channelInfo.createLogSession || false,
//       createLogSessionExtend: channelInfo.createLogSessionExtend || false,
//     }
//     return Promise.resolve(data)
//   });
// }
// // 同步检测会话信息
// function checkBaseChannel(ops_params){
//   let channelType = '',  createLogSession = false, createLogSessionExtend = false, channel = "";
//   ops_params = ops_params || {};
//   let query = ops_params.query || {};
//   let scene = ops_params.scene || 0;
//   //1--30秒对比
//   let checkTime = checkChannelTime.call(this);
//   if (checkTime){
//     this.channelTime = new Date().getTime();
//     createLogSession = true;
//     createLogSessionExtend = true;
//   }
//   //2--进入的场景值是否属于渠道场景值
//   if (SceneChannel[scene] || scene) {
//     channelType = SceneChannel[scene] && SceneChannel[scene].channel || (scene + '');
//     createLogSession = true;
//     createLogSessionExtend = true;
//   } 
//   //3--是否与上次进入的scene场景值一致
//   if (!this.lastScene || ((this.lastScene != scene) && scene)) {
//     createLogSession = true;
//     createLogSessionExtend = true;
//   }
//   scene && (this.lastScene = scene);
//   //4--是否分享进入
//   if (query.fromUser && !createLogSessionExtend) {
//     createLogSession = true;
//     createLogSessionExtend = true;
//   }
//   if (ops_params._reset){
//     createLogSession = true;
//     createLogSessionExtend = true;
//   }
//   if (query.channelType) {    //自定义渠道
//     channelType = query.channelType || "MINI_QRCODE" || "";
//     channel = query.channel || query.scene ||"";
//   }
//   if(createLogSession || createLogSessionExtend){ // 重新生成会话ID
//     this._channel = {
//       ...this._channel,
//       clientSessionId: uuid16ByTime(32, 16)
//     }
//   }
//   // //提交createLogSession 目前只获取基本的信息
//   // if (createLogSession){
//   //   beforeCreateSession.call(this, ops_params);
//   // }
//   return {
//     createLogSession,
//     createLogSessionExtend,
//     channelType,
//     channel
//   }
// }
// // 检测异步会话信息
// function checkChannel(ops_params = {}, checkResult){
//   checkResult = checkResult || {};
//   let {
//     channel,
//     channelType,
//     createLogSession,
//     createLogSessionExtend,
//   } = checkResult;
//   ops_params = ops_params || {};
//   let query = ops_params.query || {};
//   let scene = ops_params.scene || 0;
//   let p = new Promise((rs,rj)=>{
//     if (channelType) {
//       if (channelType === "EXTERNAL_LINK") { // 自定义跳转带自定义渠道进入
//         channel = scene;
//         return rs();
//       }
//       else if (channelType == 'CUSTOM' || query.channelType) { //扫码进入
//         console.log("进入扫码",query);
//         createLogSessionExtend = true; 
//         if (!query.channelType) {    
//           channelType = "MINI_QRCODE";
//           channel = query.scene;
//         }
//         SHP.getParams(["options"]).then(params => {
//             let ph = params["options"] || {};
//             console.log("SHP options", ph);
//             query = ph.query;
//             createLogSessionExtend = true;
//             return rs();
//         }) 
//       }
//       else if (channelType == 'GROUP_SHARE') { //群分享
//         WxGH.getShareTicket(ops_params.shareTicket).then(res => {
//           console.log('群分享结果', res);
//           if(res){
//             channel = res;
//             createLogSessionExtend = true;
//           }else{
//             channelType = "" 
//           }
//           return rs();
//         });
//       } else if (channelType == 'OFFIACCOUNT_MENU' || channelType == 'OFFIACCOUNT_MSG' || channelType == 'OFFIACCOUNT_ARTICLE' || channelType == 'MINIPRO') {   //appId
//         channel = ops_params.referrerInfo && ops_params.referrerInfo.appId || ops_params.query && ops_params.query.appid || 'NO_APPID';
//         if (channel){
//           createLogSessionExtend = true;
//         }else{
//           channelType = "";
//         }
//         return rs();
//       } else {
//         channel = scene;
//         return rs();
//       }
//     }else{
//       return rs();
//     }
//   })
//   return p.then(res=>{
//     return Promise.resolve({
//       channelType,
//       channel,
//       query,
//       createLogSession,
//       createLogSessionExtend,
//     });
//   })
// }
// function beforeCreateSession(optionData){
//   let channelType;
//   let channel;
//   let keyParams;
//   let paramsJson;
//   let path = optionData.path;
//   let params = optionData.query;
//   let scene = optionData.scene;
//   if (hasP(params)) {
//     keyParams = getPageSessionKeyParams(path, params);
//     try {
//       paramsJson = JSON.stringify(params);
//     } catch (e) { }
//     if (params.fromUser) {
//       channelType = "INVITE";
//       channel = params.fromUser;
//     } else if (params.channelType) {
//       channelType = params.channelType;
//       channel = params.channel;
//     } else if (params.scene) {
//       channelType = "MINI_QRCODE",
//       channel = params.scene
//     }
//     channelType = StringUtil.trim(channelType);
//   }
//   let _channel = {
//     clientSessionId: this.channel.clientSessionId,
//     channelType: channelType || "",
//     channel: channel || "",
//     scene: scene || "",
//     model: SIH.model || "",
//     os: SIH.os || "",
//     fromUser: params.fromUser || "",
//     appVersion: SIH.appVersion || "",
//     sdkVersion: SIH.sdkVersion || "",
//     createTime: new Date().getTime(),
//     pageName: getPageName.call(this, path, params) || "",
//     pagePath: path,
//     ...keyParams,
//     pageParamsJson: paramsJson,
//     inviteType: params.shareType,
//     dstbStaffCode: params.staffCode,
//     customChannel: params.customChannel || ""
//   }
//   console.log("创建channel", _channel)
//   this._channel = _channel;
//   this.createSession(_channel);
// }
// export default LogManager.getInstance();
// export {
//   PageKeys,
//   LogMap,
//   KeyParamName
// };