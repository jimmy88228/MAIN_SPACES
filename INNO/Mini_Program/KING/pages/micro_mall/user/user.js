// pages/micro_mall/user/user.js
import {
  barcode,
  qrcode
} from "../../../utils/goComplete/index.js" 
import SG from "../../../helper/handle/shopGuideHandle.js"
import CheckUpdateTimer from "../../../helper/manager/check-update-timer";
import promise from "../../../libs/promise/promise.js";
import PageJump from "../../../helper/page-jump.js";

let app = getApp();
Page(app.BP({
  dynamicCodeTask() { return this.MyViewTask("#dynamicCode", "dynamicCode", "showCardCode"); },
  data: {
    userInfo:{
      weixin_card_activate: 0
    },
    userData:{},
    sign_result:{
      sign_status:0,
      message:"",
      data:{}
    },
    invite_share:false,
    indicatorDots: true,
    adData: {},
    menuData: {},
    linkMap: {
      'retailList': '/pages/micro_mall/order/order_list?order_type=store',
      'unpaid': '/pages/micro_mall/order/order_list?orderType=wait_to_pay',
      'deliver': '/pages/micro_mall/order/order_list?orderType=wait_to_shipping',
      'receive': '/pages/micro_mall/order/order_list?orderType=wait_to_receiving',
      'change': '/pages/micro_mall/order/order_list?orderType=order_exchange',
      'nearbyShop': '/pages/micro_mall/stores/store_nav',
      'customer_service': '',
      'personal': '/pages/micro_mall/user_info/user_info',
      'user_card': '/pages/micro_mall/membership_card/membership_card',
      'publicNumber': '/pages/micro_mall/wx_service/follow_wx',
      // 'pointExchange':'/pages/micro_mall/store_mod/qr_code',
      'pointExchange':'',
      'myCollect': '/pages/micro_mall/collection/my_collection',
      'bonus_package': '/pages/micro_mall/buyBonus/getBonusActivityList',
      // 'history':'/pages/micro_mall/sk/activity-sk/activity-sk?groupId=4&activityId=5',
      'history':'/pages/micro_mall/footmark/my_footmark',
      'myAddress':'/pages/micro_mall/address/address_list?visit_type=check',
      'exchangeShop':'/pages/micro_mall/point/point_goods_list/point_goods_list',
      //我的资产
      'my_point': '/pages/micro_mall/integral/my_integral',
      'balance':'pages/micro_mall/balance/my_balance',
      'coupon':'/pages/micro_mall/coupon/my_coupon',
      'prepay_card':'/pages/micro_mall/prepaid/user_prepaid_card',
      'recharge_card': '/pages/micro_mall/prepaid/prepaid_card_erp',
      "redpack": "/pages/micro_mall/red_packet/red_balance/red_balance",
      "prepaidcard": "/pages/micro_mall/prepaid/erp/prepaid_card_erp",
      
      'retailList':'/pages/micro_mall/order/order_list?order_type=store',
      'collageGroup':'/pages/micro_mall/collageGroup/my_collage',
      'distribution':'/pages/micro_mall/distribution_center/distribution_center',
      'presell':'/pages/micro_mall/plugins/presale/presale_order_list',
      'storeQRPay':'/pages/store_pay/pay_center/pay_center',
      'modify_pwd':'/pages/micro_mall/changeInfo/pw/password',
      'sign_gift':"/pages/micro_mall/sign/app/app_sign",
      'invitingFriends':"/pages/micro_mall/distribution_center/distribution_service/guest_follows/guest_follows",
      'share_code': ["/pages/micro_mall/store_mod/qr_code", "/pages/micro_mall/my_store_mod/qr_code"],
      "valet_order":"/pages/micro_mall/order/assist_guest",
      "bargain": "/pages/micro_mall/bargain/index/my_bargain",
      "my_present": "/pages/micro_mall/lottery/lottery_record/lottery_record",
      "paypal":"/pages/micro_mall/paypal/paypal",
      "staff_guide":"/pages/micro_mall/guide_point/guide_point?pageType=staffGuide",
      "seckill":"/pages/micro_mall/sk/orders-sk/order-list",
      "memberInterests":"/pages/micro_mall/articles/agreet/agreet?type=USER_RIGHT",
      "electronic_invoice_setting":"/pages/micro_mall/invoice/invoice_list/list",
      "old_cs": "/pages/micro_mall/customer_service/contact_page?type=old_cs",
      "feedback": "/pages/micro_mall/web/webForSF/SF?type=m_h5&route=%2Fpages%2Fmy%2Fsetting%2Ffeedback-list",
      "kefu_h5": "/pages/micro_mall/web/webForSF/SF?type=h5_admin&route=%2Fpages%2Fapp%2Fcustomer-service-worker%2Findex",
      "invite_user": "/pages/micro_mall/inviteAward/inviteAward"
    },
    sys_config:{},
    isStaff:false,
    needLogin:true,
    sessionFrom:"",
    CARD_APPID: app.Conf.OPEN_CARD_APPID,
    updateAvatarClass:"",
    show_qr_lg:false,
    assetsArr:[]
  },
  limitUrlTime: 3,
  onLoad: function (options) {
    console.log(options,"user")
      let cargo_unpaid = this.data.brand_info.icon_url + "micro_mall/user/cargo_unpaid.png";
      let cargo_deliver = this.data.brand_info.icon_url + "micro_mall/user/cargo_deliver.png";
      let cargo_receive = this.data.brand_info.icon_url + "micro_mall/user/cargo_receive.png";
      let cargo_change = this.data.brand_info.icon_url + "micro_mall/user/cargo_change.png";
      let qrCode = this.data.brand_info.default_icon_url + "qrCode.png?123";
      let dynamicCode = this.data.brand_info.default_icon_url + "dynamicCode.png";
      let tip_idCard = this.data.brand_info.default_icon_url + "tip_idCard.png";
      this.setData({
          cargo_unpaid,
          cargo_deliver,
          cargo_receive,
          cargo_change,
          qrCode,
          dynamicCode,
          tip_idCard
      })
      // listen.call(this);
      if(wx.getSystemInfoSync().system.split(' ')[0].toLocaleUpperCase() === 'ANDROID') {
        this.setData({
          isAndroid: true
        })
      }
  },
  _noFn(){},
  onShow: function () {
    if(this.ready) {
      listen.call(this);
    }
    //检测分销
    checkIfStaffDstbEvent.call(this);
    getSysTemConfig.call(this,"","sys_config");
    getSysTemConfig.call(this,"users_center_show_store_staff","show_store_staff");
  },
  onHide(){
    unListen.call(this);
  },
  onUnload(){
    unListen.call(this);
  },
  onReady(){
    this.ready = true;
    listen.call(this);
  },
  onShareAppMessage: function (res) {
    var that = this;
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
    if(app.LM.isLogin && this.data.needLogin){
      getUserInfoEvent.call(this).then(userData => {
        loginHandle.call(this);
        if (userData.weixin_card_activate == 0){
          getWxCard.call(this);
        }
      });
    }
  },
  funcJump:function(e){
    let that = this;
    let dataset = e.currentTarget.dataset;
    let url = dataset.url ? dataset.url : "";
    let key = dataset.key;
    let type = dataset.type;
    let sys_config = this.data.sys_config;
    let invite_share = this.data.invite_share;
    if (!app.LM.isLogin) return;
    if (key == 'distribution') {
        let name = dataset.name || '';
        let isStaffDstbData = app.LM.staffInfo.isStaffDstbData;
        let pageId = app.LM.staffInfo.pageId;
        if (!isStaffDstbData) {
            app.DistrApi.applyStaff({
                params: {
                    brandCode: app.Conf.BRAND_CODE,
                },
                other: {
                    isShowLoad: true
                }
            }).then(res=>{
              if (res.data && res.data.is_enabled!=0){
                pageId = pageId || res.data.page_id
                wx.navigateTo({
                    url: `/pages/micro_mall/custom_page/custom_page?page_id=${pageId}&isStaff=${isStaffDstbData}&phone=${this.phone}`,
                })
              }else{
                app.SMH.showToast({
                  title:'敬请期待...'
                })
              } 
            })
           
        }else{ 
            url = url + `?name=${name || ''}`
            wx.navigateTo({
                url: url,
            })
        }
        return;
    }
    //第三方客服跳转
    if (key === 'thirdCs' && sys_config.third_cs_open){
      let userInfo = app.LM.userInfo || {};
      let uId = userInfo.uId || 0;
      url = "/pages/micro_mall/customer_service/contact_page?userId=" + uId;
    }
    //
    if (key == "share_code"){
      let linkMap = this.data.linkMap || {};
      let urlArr = linkMap[key] || [];
      if (type == "service"){
        url = urlArr[1] || "";
      }else{
        url = urlArr[0] || "";
      }
    }
    if(key == "redpack"){
      let userData = this.data.userData||{};
      wx.navigateTo({
        url: url + `?sum=${userData.redpack_amount_sum||0}&un_amount=${userData.unusable_redpack_amount||0}`,
      })
      return
    }else if(key == "balance"){
      let item = dataset.item ||{};
      wx.navigateTo({
        url: url + `?balance=${userData.account_balance}&title=${item.name}`,
      })
      return
    }
    if(!url) return;
    //跳转
    wx.navigateTo({
      url: url,
    })
  },
  updateAvatarUrlClick(){
    this.refreshAnimate && clearTimeout(this.refreshAnimate);
    this.setData({
      updateAvatarClass: "rotate"
    })
  },
  updateAvatarUrl(e){
    let detail = e && e.detail || {};
    if (!detail.avatarUrl){
      this.setData({
        updateAvatarClass: ""
      })
      return;
    }
    this.refreshAnimate = setTimeout(()=>{
      this.setData({
        'userData.portrait_path': detail.avatarUrl || "",
        'userData.UserName': detail.nickName || "",
        updateAvatarClass: ""
      })
      app.SMH.showToast({
        "title": "信息已更新"
      })
      clearTimeout(this.refreshAnimate);
    },500);
  },
  qrCodeFnc(){
    console.log('二维码图片', this.data.qrcode_lg);
    if (!this.data.show_qr_lg){
      qr_anima.call(this,true); 
    }else{
      qr_anima.call(this, false); 
    } 
  },
  startmessage(e){
    SG.startmessage(e);
  },
  completemessage(e){
    let bindStaffInfo = this.data.bindStaffInfo || {};
    SG.completemessage(e, bindStaffInfo).then(data => {
      this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
      this.contactGuide.initData(data);
    })
  },
  activeCustomerService(){
    this.contactStaff = this.contactStaff || this.selectComponent("#contactStaff");
    this.contactStaff.initData();
  },
  contactCallBack(e){
    let detail = e.detail || {};
    this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
    this.contactGuide.initData(detail);
  },
  showAreaContMore(e){
    let dataset = e.currentTarget.dataset;
    let assetsObj = this.data.assetsObj||{};
    let key = dataset.key||"";
    if(assetsObj.assetsMorNum>0 && key){
      this.setData({
        [key]:!!!this.data[key]
      })
  }
  },
  dynamicCodeFnc(e){
    this.dynamicCodeTask().then(component=>{
      component.show();
      component.getCaptcha('dynamicCode');
    })
  },
  fillIdCard(){
    let params={
      func_type:"FILL_IDCARD",
      fromRoute:"USER",
    }
    PageJump(params);
  }
}))

//获取用户信息
function getUserInfoEvent(){
  return app.UserApi.getUserInfoNew({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if(e.code == "1"){
      let data = e.data || {};
      //data.redpack_amount_sum = parseFloat(((data.usable_redpack_amount || 0) + (data.unusable_redpack_amount || 0)).toFixed(2));
      this.setData({
        userData: {...this.data.userData||{},...data}, //为了额外添加的数据不被覆盖
      });
      this.phone = data.MobileNo || '';
      console.log("触发监听 userDataState");
      setTimeout(()=>{
        app.EB.call("userDataState", this);
      },300);
      return Promise.resolve(data);
    }
    return Promise.reject();
  })
}
//获取功能菜单
function getMenuList(){
  return app.BrandApi.getMenuList({
    params:{
      brandCode: app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then( e=>{
    if(e.code == "1"){
      this.loadMyQRcode = true;
      if(!e.data) return Promise.reject();
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
function installMenuData(){
  //未检测登录调用，后期需优化
  getMenuList.call(this).then(menuData=>{
    let userData = this.data.userData || {};
    if (userData.MemberId || userData.memberId || this.userDataState){
      console.log("一进来获取到用户信息");
      menuDataCallback.call(this, menuData, userData);
    }else{
      console.log("获取用户信息不及时");
      this.userDataState = app.EB.listen("userDataState", () => {
        let userData = this.data.userData || {};
        if(userData.MemberId || userData.memberId || this.userDataState){
          menuDataCallback.call(this, menuData, userData);
        }
      });
    }
    
  })
}
function menuDataCallback(menuData, userData){
    let assets = menuData.assets || {}
    if (menuData.myQRcode) {
      setUserCode.call(this, userData);
    }
    if (menuData.userQrcode) {
      setQrCode.call(this, userData);
    }
    if (assets.my_point && assets.my_point.is_enable == 1) {
      getUserPoint.call(this);
    }
    if (assets.prepaidcard && assets.prepaidcard.is_enable == 1) {
      getUserPrepaid.call(this);
    }
    if (assets.redpack && assets.redpack.is_enable == 1){
      getUserRedpackAmount.call(this);
    }
    if (assets.coupon && assets.coupon.is_enable == 1){
      getUsefulCouponCount.call(this);
    }
    //检测是否开启导购
    if(menuData.isOpenWXWorkGuide == 1){
      console.log("触发获取联系店员信息")
      initCustomerService.call(this, userData);
    }
}
function getBarCodeConf(){
  if(this._barcode_card){
    return this._barcode_card;
  } else {
    this._barcode_card = app.sysTemConfig("barcode_card").finally(()=> {
      setTimeout(()=>{
        this._barcode_card = ""
      }, 500)
    })
    return this._barcode_card;
  }
}

function setUserCode(userData = {}){
  getBarCodeConf.call(this).then(data => {
    let code = data.Value == "1" ? userData.MobileNo : data.Value == "2" ? userData.realUserName : userData.CardNo;
    code = code || "";
    barcode('userCode', code, 650, 110, getCodeUrl.call(this,'userCode'));
    this.setData({
      barCardCode: code
    })
  })
}

function setQrCode(userData = {}) {
  let code = '';
  getBarCodeConf.call(this).then(data => {
    code = data.Value == "1" ? userData.MobileNo : data.Value == "2" ? userData.realUserName : userData.CardNo;
    code = "" + code || "";
    qrcode('qrcode_lg', code, 580, 580, getCodeUrl.call(this, 'qrcode_lg'));
    this.setData({
      showQrcode: code
    })
  })
}

function getSysTemConfig(cfg_prop="",dataName=""){
  if(dataName){
    return app.sysTemConfig(cfg_prop).then(data => {
      this.setData({
        [dataName]: cfg_prop ? (data ? data.Value : null) : data
      })
    })
  }else{
    return Promise.reject();
  }
}

function getCodeUrl(name=''){
  if (!name)return
  let that  = this;
  setTimeout(()=>{
    wx.canvasToTempFilePath({
      canvasId: `${name}`,
      success(res) {
        that.setData({
          [`${name}`]: res.tempFilePath
        })
      },
      fail(){
        if(that.limitUrlTime > 0){
          getCodeUrl.call(that, name);
          that.limitUrlTime = that.limitUrlTime - 1;
        }
      },
      complete(res){
        console.log('图片complete', res);
      }
    })
  },300);
}
 

//登录后处理
function afterLoginHandle(){
  getUserInfoEvent.call(this).then(userData=>{
    loginHandle.call(this);
    if (userData.weixin_card_activate == 0) {
      getWxCard.call(this);
    }
    //种草模块数据
    this.seedGrass = this.seedGrass || this.selectComponent("#seedGrass");
    this.seedGrass.initGrassData();
    //订单数
    getUserOrderCount.call(this);
  })
}
//登录状态处理
function loginHandle(){
  let userData = this.data.userData || {};
  this.setData({
    isLogin: true
  })
  return app.sysTemConfig("applet_auth_required").then(data => {
    let needLogin = false;
    if (data.Value == 1 || data.Value == 5){//手机
      needLogin =  userData.IsBindMobile == 1 ? false : true
      this.setData({
        needLogin: needLogin
      })
    } else if (data.Value == 3){
      checkIsPerfected.call(this).then(isPerfected=>{
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
}

function listen() {
  installMenuData.call(this);
  if (app.LM.isLogin){
    afterLoginHandle.call(this);
    initSessionFrom.call(this);
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", data => {
    if(app.LM.isLogin){
      afterLoginHandle.call(this);
      initSessionFrom.call(this);
    }
  });
}
function unListen() {
  if (this.listenLoginStatuId){
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
  if (this.listenStaffInfoChange) {
    app.EB.unListen("staffInfoChange", this.listenStaffInfoChange);
  }
  if (this.userDataState){
    app.EB.unListen("userDataState", this.userDataState);
  }
  if (this.simpleInfoChange){
    app.EB.unListen("simpleInfoChange", this.simpleInfoChange);
  }
  if (this.data.autoplay){
    this.setData({
      autoplay: false
    })
  }
}

//实时检测分销
function checkIfStaffDstbEvent() {
  let staffInfo = app.LM.staffInfo || {};
  let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
  this.setData({
    isStaff: staffInfo.isStaffDstbData || false,
    needVerify: storage.needVerify || 0
  })
  if(!this.data.isStaff){
    this.listenStaffInfoChange = app.EB.listen("staffInfoChange", () => {
      let staffInfo = app.LM.staffInfo || {};
      this.setData({
        isStaff: staffInfo.isStaffDstbData || false
      })
    });
  }
  if(this.data.needVerify != 1){
    this.simpleInfoChange = app.EB.listen("simpleInfoChange", () => {
      let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
      this.setData({
        needVerify: storage.needVerify || 0
      })
    });
  }
}
//
function initSessionFrom(){
    let user_info = app.StorageH.get("USER_INFOS") || {};
    let conf = app.Conf;
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
      userToken: app.LM.userToken
    }
  }).then(res => {
    if (res.code == 1) {
      user_info.isPerfected = res.data == 1 ? true : false;
      app.StorageH.set("USER_INFOS", user_info);
    }
    return Promise.resolve(user_info.isPerfected || false);
  })
}
//会员卡
function getWxCard(){
  app.CardM.getWxCard().then(res=>{
    if (!res.data){
      has_wxcard:false;
      return;
    }
    app.CardM.getOpenCardParams(res.data).then(extraData=>{
      console.log(extraData,"extraData");
      this.setData({
        extraData: extraData,
        has_wxcard: true
      })
    })
  })
}
//积分
function getUserPoint(){
  return app.UserApi.getUserPointAmount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.Points_Own": res.data
      })
    }
  })
}
//储值
function getUserPrepaid(){
  return app.UserApi.getUserStoredValueAmount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.offline_store_value_own": res.data
      })
    }
  })
}
//优惠券
function getUsefulCouponCount(){
  return app.UserApi.getUsefulCouponCount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        "userData.canUseCouponNum": res.data
      })
    }
  })
}
//红包余额
function getUserRedpackAmount(){
  return app.UserApi.getUserRedpackAmount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      let redpack_amount_sum = parseFloat(((data.usable_amount || 0) + (data.unusable_amount || 0)).toFixed(2));
      this.setData({
        "userData.redpack_amount_sum": redpack_amount_sum,
        "userData.usable_redpack_amount": data.usable_amount,
        "userData.unusable_redpack_amount": data.unusable_amount
      })
    }
  })
}
//
function getUserOrderCount(){
  return app.BuyApi.getUserOrderCount({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      this.setData({
        "userData.userOrderCount": data
      })
    }
  })
}

 
function qr_anima(bool=false){
  let that =this;
  if(bool){
    this.setData({
      show_qr_lg: true
    });
    wx.nextTick(() => {
      that.setData({
        show_lg_class: true
      });
    })
  }else{
    this.setData({
      show_lg_class: false
    });
    setTimeout(() => {
      this.setData({
        show_qr_lg: false
      })
    }, 250)
  } 
}

function checkTips(data={}){
  data = data||{};
  if(data.my_expand_ext && data.my_expand_ext.is_enable == 1 || data.my_service_ext && data.my_service_ext.is_enable == 1){
      CheckUpdateTimer.checkTimer('rankTip').then(res=>{
      this.setData({
        showRankTip:true
      })
    }).catch(e=>{
      if(this.data.showRankTip){
        this.setData({
          showRankTip:false
        })
      }
    })
  } 
}
//
function initCustomerService(userData){
  if (userData.bindStaffId){
    SG.getCustomerService(userData.bindStoreId, userData.bindStaffId, 0, true).then(data => {
      console.log("导购信息", data);
      this.setData({
        bindStaffInfo: data.staffInfo || {}
      }) 
    })
  }
} 