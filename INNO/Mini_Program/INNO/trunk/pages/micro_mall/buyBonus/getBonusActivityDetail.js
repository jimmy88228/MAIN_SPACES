// pages/micro_mall/buyBonus/getBonusActivitDetail.js
import WxApi from '../../../common/helper/wx-api-helper.js'
import PayH from '../../../common/helper/handle/payHandle.js'
let WxParse = require("../../../components/thirdParty/wxParse/wxParse.js");
const app = getApp();
Page(app.BP({
  data: {
    activity_info: {},
    brand_info: {},
    //
    buy_animate: false,
    show_buy: false,
    //
    select_pay_way: true,
    isLogin: app.LM.isLogin,
    showData: false
  },
  modal: "",
  alert: "",
  order_id: 0,
  interval_times: 0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.options = options;
    this.options.activityId = options.activityId || options.activityid;
    let g_home = this.data.brand_info.icon_url + "micro_mall/g_home.png";
    this.setData({
      g_home: g_home
    }) 
  },
  onShow() {
    let scene = this.options.scene;
    if (scene) {
      app.SHP.getParams(["activityid", "activityId"]).then((params) => {
        this.options = {
          ...this.options,
          ...params
        }
        getactivityInfo.call(this, this.options);
      })
    } else {
      getactivityInfo.call(this, this.options);
    }
    listen.call(this);
  },
  onHide(){
    app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  },
  onUnload: function() {
    clearInterval(this.loadInterval);
    clearTimeout(this.payStatus);
    this.onUnloadVal = true;
    app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  },
  onShareAppMessage: function() {
    return {
      isCustom: true,
      path: '/pages/micro_mall/buyBonus/getBonusActivityDetail?activityId=' + this.options.activityId,
      title: this.data.activity_info.activityName || '',
      imageUrl: this.data.activity_info.imgUrl || ''
    }
  },
  //购买点击判断授权
  getBuyClick() {
    this.buyPopAnimate("show");
  },
  getBuy() {
    this.buyPopAnimate("show");
  },
  changeSelect() {
    return
    var select_pay_way = this.data.select_pay_way;
    this.setData({
      select_pay_way: !select_pay_way
    })
  },
  confirmBuy() {
    if (this.loading_buy) return;
    setLoading.call(this, 1000);
    let activity_info = this.data.activity_info;
    let activityId = activity_info.activityId || 0;
    let params = {
      activityId
    }
    if (!this.order_id) {
      app.RunApi.go('post', 'ActApi', 'createBuyBonusOrder', params).then(res => {
        console.log('resresres2', res);
        if (res.code == 1) {
          let order_id = res.data || '';
          if (order_id) {
            this.order_id = order_id;
            goPay.call(this, order_id);
            // return app.wxReq("", "pay_getAppletPayInfo", {
            //   order_id: order_id,
            //   pay_type: 'buyb'
            // }, null);
          }
          return
        }
        app.SMH.showToast({
          title: res && res.msg || '订单异常'
        })
      })
    } else {
      console.log('生成过订单', this.order_id)
      goPay.call(this, this.order_id);
    }
  }, 
  /**
   * 购买弹框
   */
  buyPopAnimate(show) {
    var that = this;
    if (show == "show") {
      this.setData({
        show_buy: true,
        buy_animate: true
      })
    } else {
      this.setData({
        buy_animate: false
      })
      let _timer1 = setTimeout(function() {
        clearTimeout(_timer1);
        that.setData({
          show_buy: false
        })
      }, 350)
    }
  },
  toHome: function() {
    wx.switchTab({
      url: '/pages/micro_mall/index/index',
    });
  },
  _noFn() {},
}))


function getactivityInfo(options) {
  if (!options.activityId) {
    app.SMH.showToast({
      title:"无效活动ID"
    })
    return;
  };
  return app.ActApi.getBuyBonusActivitDetail({
    params: {
      activityId: options.activityId,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == "1") {
      let data = res.data||{};
      if (!this.onloadVal) {
        this.onloadVal = true
        this.act_bonus = this.act_bonus || this.selectComponent('#act_bonus');
        this.act_bonus.onLoadFnc('act', this.options.activityId || '');
        let active_desc = res.data.active_desc || '';
        WxParse.wxParse('article', 'html', active_desc, this, 0);
      }
      initCountDownData.call(this,data)
      this.setData({
        activity_info: data
      })
    }
  }).finally(() => {
    this.setData({
      showData: true
    })
  })
}

function checkOrderStatus() {
  if (!this.order_id) return;
  return app.ActApi.getBuyBonusOrderPayStatus({
    data: {
      order_id: this.order_id
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == "1") {

    }
  })
}

function listen() {
  if (app.LM.isLogin && this.data.isLogin) return
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin && !this.data.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  });
}

function goPay(order_id = '') {
  // let payType = app.Conf.PAYTYPE || {};
  // let params = {
  //   // order_id,
  //   // pay_type: 'buyb'
  //   orderSn: order_info.order_sn,
  //   payType: payType["buyb"].type,
  //   userToken: app.LM.userToken,
  //   payMethod: app.Conf.PAYMETHOD,
  //   brandCode: app.Conf.BRAND_CODE
  // }
  let extra = {
    diy: true
  }

  // return app.RunApi.go('PayApi', 'getAppletPrepayId', params, extra)
  return PayH.UnifiedorderByOrderId("buyb",order_id)
  .then(res => {
    let pay_info = res.data;
    return WxApi.requestPayment({
      'timeStamp': pay_info.timeStamp + '',
      'nonceStr': pay_info.nonceStr,
      'package': pay_info.package,
      'signType': pay_info.signType,
      'paySign': pay_info.sign,
    }).then(res => {
      this.buyPopAnimate();
      this.order_id = 0;
      this.interval_times = 0;
      getOrderPayStatus.call(this, order_id);
    }).catch(e => {
      console.log('无支付', e);
      if (e && e.errMsg && e.errMsg.indexOf('cancel') == -1) {
        this.order_id = 0;
        console.log('支付异常', e);
      }
    })
  })
}

function getOrderPayStatus(orderId = '') {
  if (!orderId) return
  this.interval_times += 1;
  let params = {
    orderId: orderId,
    brandCode: app.Conf.BRAND_CODE
  }
  let extra = {
    diy: true,
    isShowLoad: false
  }
  return app.RunApi.go('ActApi', 'getBuyBonusOrderPayStatus', params, extra).then(res => {
    console.log('PayStatus', res);
    if (res && res.code == '1') {
      let data = res.data;
      if (data.payStatus == 1) {
        clearLoad.call(this);
        app.SMH.showToast({
          title: "支付成功"
        });
        if (data.returnStatus == 0) {
          let _timer2 = setTimeout(function() {
            clearTimeout(_timer2);
            wx.navigateTo({
              url: './getBonusOrderList',
            })
          }, 350)
        } else {
          this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
          this.pageDialog.setTouchCancel(false);
          this.pageDialog.setTitle("来晚一步了，礼包已被抢完");
          this.pageDialog.setCentent("支付金额将原路退回你账户中");
          this.pageDialog.setSingleBtn(() => {
            this.pageDialog.dismiss();
            let _timer = setTimeout(() => {
              clearTimeout(_timer)
              wx.navigateTo({
                url: './getBonusOrderList',
              })
            }, 350)
          });
          this.pageDialog.show();
        }
      } else {
        if (this.onUnloadVal) return
        console.log('interval_times', this.interval_times);
        if (this.interval_times > 3) {
          clearLoad.call(this);
          app.SMH.showToast({
            title: "订单未同步，请稍后查看"
          });
          return
        }
        if (!this.data.showLoad) {
          showLoadAnim.call(this);
        }
        this.payStatus = setTimeout(() => {
          getOrderPayStatus.call(this, orderId);
        }, 3000)
      }
    }
  })
}


function setLoading(time = 1000) {
  this.loading_buy = true
  let _timer = setTimeout(() => {
    this.loading_buy = false;
    clearTimeout(_timer);
  }, time)
}

function showLoadAnim() {
  let num = 1;
  let arr = ['.', '..', '...'];
  clearTimeout(this.resultTimeOut);
  this.setData({
    showLoad: true,
    loadingText: arr[0]
  })
  this.loadInterval = setInterval(() => {
    this.setData({
      loadingText: arr[num]
    })
    num += 1;
    if (num == 3) {
      num = 0;
    }
  }, 800)
}

function clearLoad() {
  this.interval_times = 0;
  clearInterval(this.loadInterval);
  clearTimeout(this.payStatus);
  this.setData({
    showLoad: false
  })
}

function initCountDownData(data){
  if(!data)return;
  let result = {};
  result.stime = data.fromTime || "";
  result.etime = data.toTime || "";
  result.serverTime = data.serverTime || "";
  result.acName = "购礼包";
  result.type = "buyBonus"
  this.actCountDownId || (this.actCountDownId = this.selectComponent('#actCountDownId'));
  let cbData = this.actCountDownId.initData(result,()=>{
      getactivityInfo.call(this, this.options);
  });
  this.setData({
    disabledTip: cbData && cbData.state != 2 && cbData.disabledTip || ""
  })
}