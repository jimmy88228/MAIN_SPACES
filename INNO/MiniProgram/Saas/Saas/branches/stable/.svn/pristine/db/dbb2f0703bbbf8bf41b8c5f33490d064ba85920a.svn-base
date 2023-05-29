//未对接微信会员卡流程接口
import {
  barcode,
  qrcode,
} from "../../../../../common/utils/codeCanvas/index.js" 
const app = getApp();
Component(app.BTAB({
  properties: {
    userData: {
      type: Object,
      value: {}
    },
    setting: {
      type: Object,
      value: {}
    },
    isLogin: {
      type: Boolean,
      value: false
    },
    needLogin: {
      type: Boolean,
      value: false
    }
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  attached() {
  },
  detached() {
  },
  data: {
    jumpKey: {
      unpaid: {
        name: "待付款",
        url: "pages/micro_mall/order/order_list?orderType=wait_to_pay",
      },
      deliver: {
        name: "待发货",
        url: "pages/micro_mall/order/order_list?orderType=wait_to_shipping",
      },
      receive: {
        name: "待收货",
        url: "pages/micro_mall/order/order_list?orderType=wait_to_receiving",
      },
      change: {
        name: "退换货",
        url: "pages/micro_mall/order/order_list?orderType=order_exchange",
      }
    },
    showQrcode: "",
    CARD_APPID: app.Conf.OPEN_CARD_APPID,
    has_wxcard: false
  },
  ready(){
    let qrCode = this.data.brand_info.default_icon_url + "qrCode.png";
    let dynamicCode = this.data.brand_info.default_icon_url + "dynamicCode.png";
    this.setData({
      qrCode: qrCode,
      dynamicCode: dynamicCode
    })
    this.getSystem();
  },
  observers: {
    'userData': function(userData){
      settingCallback.call(this, this.properties.setting, userData);
    },
    'isLogin': function(isLogin){
      console.log("个人中心isLogin--- userHeader", isLogin);
    }
  },
  methods: {
    dynamicCodeTask() { 
      return this.MyViewTask("#dynamicCode", "dynamicCode", "showCardCode"); 
    },
    dynamicCodeFnc(e){
      this.dynamicCodeTask().then(component=>{
        component.show();
        component.getCaptcha('dynamicCode');
      })
    },
    /*刷新头像*/
    updateAvatarUrlClick(){
      this.refreshAnimate && clearTimeout(this.refreshAnimate);
      this.setData({
        updateAvatarClass: "rotate"
      })
    },
    qrCodeFnc(){
      if (!this.data.show_qr_lg){
        qr_anima.call(this,true); 
      }else{
        qr_anima.call(this, false); 
      } 
    },
    updateAvatarUrl(e){
      let detail = e.detail || {};
      if (!detail.avatarUrl){
        this.setData({
          updateAvatarClass: ""
        })
        return;
      }
      this.refreshAnimate = setTimeout(()=>{
        this.setData({
          'userData.portrait_path': detail.avatarUrl,
          updateAvatarClass: ""
        })
        app.SMH.showToast({
          "title": "头像已更新"
        })
        clearTimeout(this.refreshAnimate);
      },500);
    },
    getSystem(){
      return app.sysTemConfig("users_center_show_store_staff").then(data => {
        this.setData({
          show_store_staff: data && data.Value
        })
      })
    },
    showUpdateAvatarPage(){
      wx.navigateTo({
        url: "/pages/micro_mall/user/update_avatar/update_avatar"
      })
    }
  }
}))
//设置
function settingCallback(setting, userData){
  if (setting.myQRcode) {
    setUserCode.call(this, setting.barcode_card ,userData);
  }
  if (setting.user_qrcode) {
    setQrCode.call(this, setting.barcode_card ,userData);
  }
  //检测是否开启导购
  // if(menuData.isOpenWXWorkGuide == 1){
  //   console.log("触发获取联系店员信息")
  //   initCustomerService.call(this, userData);
  // }
  //检测微信会员卡
  // if (userData.weixin_card_activate == 0){
  //   getWxCard.call(this);
  // }
}
function setUserCode(type, userData = {}){
    let code = type == "1" ? userData.MobileNo : type == "2" ? userData.realUserName : userData.CardNo;
    code = code || "";
    barcode('userCode', code, 650, 110, getCodeUrl.call(this,'userCode'));
    this.setData({
      barCardCode: code
    })
}
function setQrCode(type, userData = {}) {
    let code = type == "1" ? userData.MobileNo : type == "2" ? userData.realUserName : userData.CardNo;
    code = "" + code || "";
    qrcode('qrcode_lg', code, 580, 580, getCodeUrl.call(this, 'qrcode_lg'));
    this.setData({
      showQrcode: code
    })
}
//
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
        console.log("canvasToTempFilePath res", res);
      }
    })
  },300);
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
//会员卡
function getWxCard(){
  app.CardM.getWxCard().then(res=>{
    if (!res.data){
      this.setData({
        has_wxcard: false
      })
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