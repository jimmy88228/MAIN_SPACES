import Wxapi from "../support/tools/wx-api-helper.js";
import { Apis } from "../http/http.api.install.js";
import { Http } from "../http/http.interceptor.js";

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

  // 获取消息列表数据
  getWxSub(){
    return Http(Apis.getWxSubMsgTplCustomerList,{ //post请求带url传参
      other: {
        isShowLoad: false,
        isHideMsg: true
      }
    }).then(res=>{
      if(res.code){
        return res.data
      }
    }).catch(error => {
      this.logout();
      return Promise.reject(error);
    })
  }


}

export default WxSubscribe.getInstance();
