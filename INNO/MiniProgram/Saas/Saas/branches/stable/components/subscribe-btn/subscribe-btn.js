// components/subscribe-btn/subscribe-btn.js
import WxSub from "../../common/helper/handle/wxSubscribe";
import appUtils from '../../common/support/utils/utils';
const app = getApp(); 
const timeSet = {
  "GLOBALSIGN":60*24*7,
  "GLOBALSEC":60*24*365,
  "PRESALEBUY" : 3
}
Component(app.BTAB({
  properties: { 
    info:{
      type:Object,
      value:{}
    },
    customData:{
      type:Object,
      value:{}
    },
    hold:{
      type:Boolean,
      value:false
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },
  lifetimes:{
    // attached(){
      // let info = this.properties.info||{};
      // console.log('attachedattached',info);
      // let {type,label} = info;
      // type && getTpls.call(this,type,label)
    // },
  },
  data: {

  },
  methods: {
    subscribe(e){
      // 如果属性hold为true，或者页面上有beforeFunc 且返回 true 则停止
      if(this.properties.hold)return;
      if(typeof getCurrentPages().pop().beforeFunc === 'function' && getCurrentPages().pop().beforeFunc())return;
      let info = this.properties.info||{};
      let customData = this.properties.customData||{};
      info.customData = customData;
      info.that = this;
      appUtils.throttle(()=>{
        return WxSub.subscribeGlobal(info);
      })();
      //必须传值：needSubscribe,relatedType,relatedId,extendId1
      // let {type="",label="",needSubscribe=true,relatedType='',relatedId=0,extendId1=0,subState,subStateAll,bool=false,curActInfo={},showMsg=false} = info;
      // return getTpls.call(this,type,label).then(()=>{
      //   let tpls = this.tpls;
      //   console.log('infoinfo',info,tpls)
      //   if(needSubscribe && tpls.length>0){
      //     if(!(getSetSubscribe(relatedId,'get',label,type,this))){
      //       let tplsList = this.tpls||[];
      //       return WxSub.wxSubscribeHelp({tplsList,subState,subStateAll,bool,type,info:curActInfo,that:this}).then(res=>{
      //         getSetSubscribe(relatedId,'set',label,type,this);
      //         if(res){
      //           setGloabalSubscribe.call(this,res,{relatedId,relatedType,extendId1,type})
      //           showMsg && app.SMH.showToast({
      //             title: bool ? "操作完成" : "订阅成功"
      //           })
      //         };
      //         this.triggerEvent('subscribeCallBack',{...customData,setSub:true})
      //       })
      //     }else{
      //       this.triggerEvent('subscribeCallBack',{...customData})
      //       return Promise.resolve();
      //     }
      //   }else{
      //     let customData = this.data.customData||{};
      //     this.triggerEvent('subscribeCallBack',{...customData});
      //     return Promise.resolve();
      //   }
      // })
       
    },
  }
}))


// function getTpls(type,label){
//   return WxSub.getTpls(type,label||"").then(data => {
//     this.tpls = data||[];
//     this.triggerEvent('initTpls',this.tpls);
//   })
// }

// function getSetSubscribe(id=0,opType='get',label="",type,that){
//   let keyName = "" + type + label;
//   let tpls = that.tpls||[];
//   let storName = "SUBSCRIBE_" + keyName; 
//   console.log('keyName',keyName)
//   if(opType == 'get'){
//     let storage = app.StorageH.get(storName,{})||{};
//     if(tpls.length<=0 || storage[label] && storage[label][id])return true //无需订阅
//   }else if(opType == 'set'){
//     let storage = app.StorageH.get(storName,{})||{};
//     storage[label] || (storage[label] = {});
//     storage[label][id] = true;
//     app.StorageH.set(storName,storage,timeSet[keyName]||60*24*7);
//   }
// }

// function setGloabalSubscribe(detail={},{relatedId,relatedType,extendId1,type}){ //订阅接口传参处理
//   let subResult = detail.subResult || {};
//   console.log('thisthis',this)
//   let tplsList = this.tpls || [];
//   let reqList=[];
//   for (let i = 0; i < tplsList.length; i++){
//     let wxTplId = tplsList[i].wxTplId || "";
//     let tplType = tplsList[i].tplType || "";
//     let brandTplId = tplsList[i].brandTplId || 0;
//     let state=subResult[wxTplId];
//     console.log('subResult',subResult,wxTplId)
//     reqList.push({
//       relatedType,
//       relatedId,
//       extendId1,
//       tplType,
//       brandTplId,
//       state
//     }) 
//   }
//   WxSub.setSubscribe(reqList,null,type);
// }