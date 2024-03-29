import SG from "../../../common/helper/handle/shopGuideHandle.js"
// import PageJump from "../../../common/helper/page-jump.js";
import {displayContactStaffHandle, markAsFinished} from "./user_module/qiweiRelated"
let app = getApp();
Page(app.BP({
  data: {
    userData:{
      weixin_card_activate: 0
    },
    // sign_result:{
    //   sign_status:0,
    //   message:"",
    //   data:{}
    // },
    invite_share:false,
    adData: {},
    menuData: {},
    sysConf:{},
    isStaff:false,
    sessionFrom:"",
    calendar:{},
    // CARD_APPID: app.Conf.OPEN_CARD_APPID,
    needLogin: true,
    bindstaffInfo:{},
  },
  limitUrlTime: 3,
  isLoadUserData: false,
  /**
   * 该页面未对微信会员卡(需发版走流程)
  */
  onLoad: function (options) {
    this.setData({ version: app.LgMg.getVersion()||""})
  },
  _noFn(){},
  onShow: function () {
    listen.call(this);
  },
  onHide(){
    unListen.call(this);
  },
  onUnload(){
    unListen.call(this);
  }, 
  onShareAppMessage: function (res) {
    var user_info = app.globalData.userInfo;
    var brand_info = app.globalData.brand_info;
    var share_info={
      title:'',
      path:'',
      imageUrl:'',
    }
    if (res.from === 'button') {
      // 来自页面内转发按钮
      var share_type = res.target.dataset.share_type;
      if (share_type === 'invited_friends'){
        share_info={
          title:'一起来分享全球精选好货吧！',
          path: '/pages/micro_mall/index/index?invite_usercod=' + user_info['user_code'],
          imageUrl: brand_info.icon_url+'micro_mall/user/invite_share_bg.jpg'
        }
      }
    }
    return {
      ...share_info
    }
  },
  /**
   * 获取个人中心用户信息
  */
  getUserInfo(e){
    //登录回调
    if(this.data.isLogin && this.data.needLogin){
      afterLoginHandle.call(this);
    }
  },
  startmessage(e){
    let detail = e.detail||{};
    console.log('bindStaffInfo',this.data.bindStaffInfo)
    SG.startmessage(detail);
  },
  completemessage(trEt_e){
    let e = trEt_e && trEt_e.detail||{};
    let bindStaffInfo = JSON.parse(JSON.stringify(this.data.bindStaffInfo || {}));
    SG.completemessage(e, bindStaffInfo).then(data => {
      this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
      this.contactGuide.initData(data);
    })
  },
  completemessageStaff(trEt_e){
    let e = trEt_e && trEt_e.detail||{};
    let bindSelfStaffInfo = JSON.parse(JSON.stringify(this.data.bindSelfStaffInfo || {}));
    SG.completemessage(e, bindSelfStaffInfo)
  },
  activeCustomerService(e){
    console.log('企微 activeCustomerService',e)
    this.contactStaff = this.contactStaff || this.selectComponent("#contactStaff");
    this.contactStaff.initData();
  },
  contactCallBack(e){
    let detail = e.detail || {};
    this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
    this.contactGuide.initData(detail);
  },
  // fillIdCard(){
  //   let params={
  //     func_type:"FILL_IDCARD",
  //     fromRoute:"USER",
  //   }
  //   PageJump(params);
  // },
  getUserInfoHandle(){
    return getUserInfoEvent.call(this);
  },
  setAdsPop(){
    this.setData({
      adsPop: {
        isIndex:2,
        pageId:0,
      }
    })
  },
  getConf(){ 
    app.sysTemConfig().then(data=>{
      this.setData({
        sysConf: {...this.data.sysConf,...(data || {})}
      })
    })
    this.trimConfigs(['cloud_qiyu','applet_auth_required']).then(list=>{
      list.forEach(item => {
        if(item.Key == 'applet_auth_required'){ 
          let needLogin = false,userData = this.data.userData || {};
          if (item.Value == 1 || item.Value == 5){//手机
            needLogin =  userData.IsBindMobile == 1 ? false : true;
          } else if (item.Value == 3){
            return checkIsPerfected.call(this).then( isPerfected => {
              needLogin = isPerfected ? false : true;
            })
          }
          this.setData({
            needLogin: needLogin,
          })
        }else if(item.Key == 'cloud_qiyu'){ 
          this.setData({
            sysConf: {...(this.data.sysConf||{}),sevenFishIsShow:item.Value||0}
          })
        }
      }); 
    })
  }
}))

//获取用户信息
function getUserInfoEvent(){
  if(this.isLoadUserData){
    return this.isLoadUserData;
  }
  this.isLoadUserData = app.UserApi.getUserInfoNew({
    params: {
      userToken: app.LM.userKey,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if(e.code == "1"){
      let data = e.data || {};this.setData({
        userData: {...this.data.userData || {},...data}, //为了额外添加的数据不被覆盖
      });
      // this.phone = data.MobileNo || '';
      return Promise.resolve(data);
    }
    return Promise.reject();
  }).finally(()=>{
    this.isLoadUserData && delete this.isLoadUserData;
  })
  return this.isLoadUserData;
}
//获取功能菜单
function getMenuList(){
  return app.CL_BrandApi.getMenuList({
    params:{
      // brandCode: app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == "1"){
      let data = e.data;
      if(!data) return Promise.reject();
      let isOpenWXWorkGuide = false,isOpenWXWorkGuideSelf=false;
      data.forEach(item=>{ //检测是否开启联系导购
        if(item.code == 'userService' || item.code == 'staffService'){
          let setting = item.setting||{};
          let list = setting.list||[];
          console.log('item.code',item.code,list)
          for(let i = 0,len=list.length;i<len;i++){
            if(item.code == 'userService' && list[i].code == 'enterprise_customer_service'){
              isOpenWXWorkGuide = true;
              break;
            }
            if(item.code == 'staffService' && list[i].code == 'qiwei_code'){
              isOpenWXWorkGuideSelf = true;
              break;
            }
          } 
        }
      })
      this.setData({
        isOpenWXWorkGuide,
        isOpenWXWorkGuideSelf,
        menuData: data || [],
      })
      return Promise.resolve(e.data);
      let tempData = e.data && JSON.parse(e.data);
      let ad_list = tempData.ad_list;
      let adData={},n={},m={};
      for (let i in ad_list){
        let arr = i.split("_");
        adData[arr[0]]=[];
      }
      for (let j in ad_list){
        let arr = j.split("_");
        adData[arr[0]].push(ad_list[j]);
      }
      let i = 1,j = 1;
      let tempService = {}, tempexpand = {};
      for (let key in tempData.my_service) {
        if (tempData.my_service[key].is_enable !== 'off'){
          tempService[i++] = tempData.my_service[key];
          if(tempData.my_service[key].keyword == "enterprise_customer_service"){
            tempData.isOpenWXWorkGuide = 1;
          }
        }
          
      }
      for (let key in tempData.my_expand) {
        if (tempData.my_expand[key].is_enable !== 'off'){
          tempexpand[j++] = tempData.my_expand[key];
          if(tempData.my_expand[key].keyword == "enterprise_customer_service"){
            tempData.isOpenWXWorkGuide = 1;
          }
        }  
      } 
      let assetsObj = {
        assetsNorNum : 0,
        assetsMorNum : 0,
        assetsNormal : {},
        assetsMore : {},
      };
      if(tempData.assets_ext && (tempData.assets_ext.is_enable !== 0)){
        for (let key in tempData.assets) {
          if (tempData.assets[key].is_enable !== 0){
            if(assetsObj.assetsNorNum < 4){
              assetsObj.assetsNorNum+=1;
              assetsObj.assetsNormal[key] = tempData.assets[key];
              assetsObj.assetsNormal[key].key = key;
            }else{
              assetsObj.assetsMorNum+=1;
              assetsObj.assetsMore[key] = tempData.assets[key];
              assetsObj.assetsMore[key].key = key;
            }
          }  
        }
      }

      tempData.my_service = tempService;
      tempData.my_expand = tempexpand;
      checkTips.call(this,tempData);
      this.setData({
        menuData: tempData,
        adData: adData,
        assetsObj
      });
      console.log('menuData',this.data.menuData);
      return Promise.resolve(tempData);
    }
    return Promise.reject();
  })
}
function menuDataCallback(userData){
    //检测是否开启导购
    console.log('企微 检测是否开启导购',this.data.isOpenWXWorkGuide == 1,userData.bindStaffId,userData.bindStoreId,userData,)
    if(this.data.isOpenWXWorkGuide == 1){
      initCustomerService.call(this, userData.bindStoreId,userData.bindStaffId);
    }
    if(this.data.isOpenWXWorkGuideSelf == 1){
      if(userData.IsStaff == 1){
        app.LM.checkIfStore().then(storeStaff=>{
          this.setData({storeStaff})
          // initCustomerService.call(this, data.store_id,data.staff_id,'staff');
        })
      }
    }
}

//登录后处理
function afterLoginHandle(){
  getUserInfoEvent.call(this).then(userData=>{
    loginHandle.call(this);
    //签到模块数据
    this.signMod = this.selectComponent('#signMod');
    this.signMod && this.signMod.onShowFnc(); 
    // if (userData.weixin_card_activate == 0) {
    //   getWxCard.call(this);
    // }
    //种草模块数据
    // this.seedGrass = this.seedGrass || this.selectComponent("#seedGrass");
    // this.seedGrass.initGrassData();
  })
  checkUserConf.call(this);
}
//登录状态处理
function loginHandle(){
  let userData = this.data.userData || {};
  if(this.data.isLogin != app.LM.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    })
  }
  this.data.isLogin && menuDataCallback.call(this, userData);
  return app.sysTemConfig("applet_auth_required").then(data => {
    let needLogin = false;
    if (data.Value == 1 || data.Value == 5){//手机
      needLogin =  userData.IsBindMobile == 1 ? false : true
      this.setData({
        needLogin: needLogin
      })
    } else if (data.Value == 3){
      return checkIsPerfected.call(this).then( isPerfected => {
        needLogin = isPerfected ? false : true
        this.setData({
          needLogin: needLogin,
        })
      })
    }else{
      this.setData({
        needLogin: needLogin,
      })
    }
    return Promise.resolve();
  })
  .then(() => {
    !this.data.needLogin && afterWholeLoginProcess.call(this);
  })
}

function listen() {
  console.log("个人中心listen", app.LM.isLogin);
  this.getConf();
  this._checkUserLogin().finally(()=>{
    this.setAdsPop();
    doubleCheckGetVisitedStore.call(this)
      .finally(() => {
        getMenuList.call(this).finally(()=>{
          console.log("个人中心登录回调", app.LM.isLogin);
          if(app.LM.isLogin){
            afterLoginHandle.call(this);
          }
        })
      })
  })
}
function unListen() {
  if(this.isLoadUserData){
    this.isLoadUserData = false;
  }
}

function doubleCheckGetVisitedStore() { // 重复检查是否有店铺，暂时解决无店铺的问题
  let storeInfo = app.StoreH.storeInfo || {};
  if (!storeInfo.storeId || storeInfo.storeId == "0") {
    return app.StoreH.getStoreAsync()
  } else {
    return Promise.resolve();
  }
}

//实时检测分销
function checkUserConf() {
  // let staffInfo = app.LM.staffInfo || {};
  // let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
  // this.setData({
  //   // isStaff: staffInfo.isStaffDstbData || false,
  //   needVerify: storage.needVerify || 0
  // })
  app.LM.checkIfStaffDstbEvent().then(res=>{
    let staffInfo = res || {};
    this.setData({
      isStaff: staffInfo.isStaffDstbData || false
    })
  })
  app.LM.getUserSimpleInfo().then(data=>{
    this.setData({
      needVerify: data.needVerify || 0
    })
    initSessionFrom.call(this, data);
  })
  // if(!this.data.isStaff){
  //   this.listenStaffInfoChange = app.EB.listen("staffInfoChange", () => {
  //     let staffInfo = app.LM.staffInfo || {};
  //     this.setData({
  //       isStaff: staffInfo.isStaffDstbData || false
  //     })
  //   });
  // }

  // if(this.data.needVerify != 1){
  //   this.simpleInfoChange = app.EB.listen("simpleInfoChange", () => {
  //     let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
  //     this.setData({
  //       needVerify: storage.needVerify || 0
  //     })
  //   });
  // }
}
//
function initSessionFrom(user_info){
    user_info = user_info || {};
    let source = user_info.mobilePhone ? `${user_info.cardNum}/${user_info.mobilePhone}` : user_info.cardNum || ``
    let sessionFrom = `${source}|${user_info.realName}|${user_info.portrait_path}`;
    this.setData({
      sessionFrom: sessionFrom
    })
}
//检测完善资料
function checkIsPerfected(){
  let user_info = app.StorageH.get("USER_INFOS") || {};
  if (user_info.isPerfected) {
    return Promise.resolve(user_info.isPerfected);
  }
  return app.UserApi.checkUserIsCompleteInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    }
  }).then(res => {
    if (res.code == 1) {
      user_info.isPerfected = res.data == 1 ? true : false;
      app.StorageH.set("USER_INFOS", user_info);
    }
    return Promise.resolve(user_info.isPerfected || false);
  })
} 

function initCustomerService(storeId,staffId,type='user'){
  if(this[`initCustomerService${type}`]){
    return Promise.resolve(this[`initCustomerService${type}`]);
  }
  return this.initCustomerServiceP = SG.getCustomerService(storeId,staffId, 0, true).then(data => {
    let _setData = {};
    type == 'user' && (_setData.bindStaffInfo = data.staffInfo||{});
    type == 'staff' && (_setData.bindSelfStaffInfo = data.staffInfo||{});
    this.setData({..._setData})
    this[`initCustomerService${type}`] = data;
    return Promise.resolve(data)
  })
}
// function initCustomerService(userData = {}){
//   if (this.initCustomerServiceP) return this.initCustomerServiceP
//   return this.initCustomerServiceP = SG.getCustomerService(userData.bindStoreId, userData.bindStaffId, 0, true).then(data => {
//     this.setData({
//       bindStaffInfo: data.staffInfo || {}
//     })
//     return Promise.resolve(data)
//   })
// }

function afterWholeLoginProcess(){ // 登录流程完全完成后
  checkUserIsSubscribeEnterpriseWechat.call(this)
}

function autoDisplayContactStaff(){
  console.log('企微 autoDisplayContactStaff',this.data.isOpenWXWorkGuide)
  // let menuData = this.data.menuData || {}
  if (this.data.isOpenWXWorkGuide == 1) { // 菜单的"联系店员"开了
    let userData = this.data.userData || {};
    return initCustomerService.call(this, userData.bindStoreId,userData.bindStaffId)
      .then((data) => {
        // 弹窗 如果已有绑定的导购，则弹窗只需显示这一个导购；否则按正常显示列表
        if (userData.bindStaffId && data.staffInfo && data.staffInfo.customerService) { // 有绑定导购
          this.activeCustomerService({onlyShowSpecificStaff: true, staffInfo: data.staffInfo, storeInfo: data.storeInfo || []})
        } else if (data.storeInfo && data.storeInfo.staffList && data.storeInfo.staffList.length) { // 无绑定导购 且 当前店铺有导购
          this.activeCustomerService(data)
        } else {
          return Promise.reject("autoDisplayContactStaff 当前店铺无导购")
        }
      })
  } else {
    return Promise.reject("autoDisplayContactStaff 菜单没有联系店员")
  }
}

function checkUserIsSubscribeEnterpriseWechat(){
  console.log('企微 checkUserIsSubscribeEnterpriseWechat')
  return displayContactStaffHandle()
    .then(() => autoDisplayContactStaff.call(this))
    .then(() => markAsFinished())
    .catch(err => {
      console.log("企微 checkUserIsSubscribeEnterpriseWechat reject->", err)
    })
}