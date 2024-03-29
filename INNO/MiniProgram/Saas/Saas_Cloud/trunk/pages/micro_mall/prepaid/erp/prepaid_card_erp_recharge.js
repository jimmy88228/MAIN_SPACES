// pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge.js
import Utils from "../../../../common/support/utils/utils";
import WxApi from '../../../../common/support/tools/wx-api-promise.js';
import PayH from '../../../../common/helper/handle/payHandle.js';
const app = getApp();
Page(app.BP({
  data: {
    payWays: [{
      payType: "微信支付",
      img: ""
    }],
    curAmountIndex: 0,
    curPayIndex: 0,
    isDecode: true,
    validTime: "",
    isLogin: app.LM.isLogin,
    type: 'exchange',
    _left: 0,
    card_val: "",
    pwd_val: "",
    hideWin: true,
    hidePwd: true,
    //
    showExchange: false, //充值兑换
    showRecharge: false //充值活动
  },
  onLoad: function(options) {
    let bInfo = this.data.brand_info || {};
    this.options = options;
    this.setData({
      scanImg: bInfo.default_icon_url + "scan.png",
      pwd_active: bInfo.default_icon_url + "pwd_active.png",
      pwd_hide: bInfo.default_icon_url + "pwd_hide.png",
      defaultImg: bInfo.logo_path + "micro_mall/applet_logo.png",
      remove_btn: bInfo.icon_url + "micro_mall/comment_edit/remove_btn_icon.png",
      noActivityIcon: bInfo.icon_url + "micro_mall/perpaid/no_card.png",
    })
    storedValueInfo.call(this).then(resActId => {
      this.activityId = resActId || 0;
      // this.setData({
      //   showRecharge: this.activityId && this.activityId != 0 ? true : false,
      // })
      this.checkShowViewState();
      if (!this.alreadyLoad){
        getBaseInfo.call(this);
        loadData.call(this).then(()=>{
        })
      }
      this.loading = false;
      
    })
    this._checkUserLogin();
  },
  onReady() {
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    let wxpay = this.data.brand_info.icon_url + "micro_mall/perpaid/ic_wxpay.png";
    this.setData({
      [`payWays[0].img`]: wxpay
    });
  },
  onShow: function() {
    if (this.activityId){
      this.alreadyLoad = true;
      getBaseInfo.call(this);
      loadData.call(this)
    }
  },
  checkShowViewState(){
    let type = this.activityId && this.activityId != 0 ? this.options.type : 'exchange';
    app.sysTemConfig('is_show_exchange_stored_value').then(res => {
      let value = res.Value || 0;
      type = value == 0 ? "recharge" : type;
      this.setData({
        showExchange: value == 1 ? true : false,
        type: value == 0 ? "recharge" : type,
        _left: type == "recharge" && value == 1 ? 50 : this.data._left
      })
    })
  },
  onHide() {
  },
  onUnload() {
  },
  onShareAppMessage: function(res) {
    let path = `/pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge?activityId=${this.activityId}&type=${this.data.type || 'exchange'}`
    this.share_conf = this.share_conf || {};
    return {
      isCustom: true,
      path: path,
      title: this.share_conf.share_title,
      imageUrl: this.share_conf.activity_image
    }
  },
  selectType(e) {
    let typeIndex = e.currentTarget.dataset.typeIndex;
    let content = e.currentTarget.dataset.content;
    let validTime = e.currentTarget.dataset.vaildTime;
    let cardId = e.currentTarget.dataset.cardId;
    if (content === "amount") {
      // 充值金额
      this.setData({
        curAmountIndex: typeIndex,
        validTime: validTime,
        cardId: cardId
      });
    } else {
      // 支付方式
      this.setData({
        curPayIndex: typeIndex
      });
    }
  },
  createOrder() {
    controlClick.call(this, () => {
      createCardOrder.call(this);
    });
  },
  handle_tab(e) {
    console.log(e);
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let type = dataset.type || 'exchange';
    let num = parseFloat(dataset.num || 0) || 0;
    this.setData({
      type: type,
      _left: num * 50,
    })
  },
  handle_scan(e) {
    console.log('handle_scan', e);
    // getBaseInfo.call(this);
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let name = dataset.name || '';
    let that = this;
    if (name) {
      wx.scanCode({
        // onlyFromCamera: true,
        success(res) {
          console.log('---scan success', res)
          that.setData({
            [`${name}`]: res.result || ''
          })
        },
        fail(res) {
          console.log('---scan fail', res);
          if (res && res.errMsg.indexOf('cancel') == -1) {
            app.SMH.showToast({
              title: res.errMsg || "操作异常",
            })
          }
        },
      })
    }

  },
  handle_input(e) {
    // console.log('handle_input', e);
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let name = dataset.name || '';
    if (!name) return;
    let detail = e.detail && e.detail.value || '';
    this.setData({
      [`${name}`]: detail
    })
  },
  handle_exchange(e) {
    console.log('兑换', this.data.card_val, this.data.pwd_val);
    getBaseInfo.call(this);
    let name = '';
    if (!(/^\S+$/.test(this.data.pwd_val))) {
      name = this.data.pwd_val ? "请输入正确的密码格式" : "密码不能为空";
    }
    if (!(/^\S+$/.test(this.data.card_val))) {
      name = this.data.card_val ? "请输入正确的卡号格式" : "卡号不能为空";
    }
    if (name) {
      setResult.call(this, name);
      return
    }
    exchangeClick.call(this, () => {
      showLoadFnc.call(this);
      run_exchange.call(this);
    })
  },
  win_cancel(e) {
    if (this.data.hideWin) return
    this.setData({
      showWinAnim: false,
    })
    let page = getCurrentPages();
    let len = page.length;
    let that = this;
    let _timer = setTimeout(() => {
      that.setData({
        hideWin: true,
        card_val: '',
        pwd_val: '',
      })
      //跳转
      if (len > 1 && page[len - 2] && page[len - 2].route == "pages/micro_mall/prepaid/erp/prepaid_card_erp") {
        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.redirectTo({
          url: `/pages/micro_mall/prepaid/erp/prepaid_card_erp`,
        })
      }
      clearTimeout(_timer);
    }, 260)
  },
  input_close(e) {
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let name = dataset.name || '';
    if (!name) return;
    this.setData({
      [`${name}`]: ''
    })
  },
  handle_longpress(e) {
    if (this.data.hidePwd) {
      this.setData({
        hidePwd: false
      })
    }
  },
  handle_touch_end(e) {
    if (!this.data.hidePwd) {
      this.setData({
        hidePwd: true
      })
    }
  },
  handle_showPwd(e) {
    this.setData({
      hidePwd: !this.data.hidePwd
    })
  },
  _noFn() {}
}))

function loadData() {
  if (!this.activityId || this.activityId == 0){
    return new Promise((rs, rj)=>{
      return rj();
    });
  }
  return app.UserApi.getStoredValueActivity({
    params: {
      activityId: this.activityId || 0,
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    let data = res.data;
    if (res.code == 1) {
      this.share_conf = {
        share_title: data.share_title,
        share_desc: data.share_desc,
        activity_image: data.activity_image
      }
      this.setData({
        activityName: data.activityName,
        activityRemark: data.activityRemark,
        cardList: data.cardList || [],
        storeName: data.storeName,
        // 默认值
        validTime: data.cardList[0].cardPeriodStr,
        cardId: data.cardList[0].cardId,
        showRecharge: true,
      });
      wx.setNavigationBarTitle({
        title: "储值" || this.data.activityName
      });
      return Promise.resolve(data);
    } else {
      this.setData({
        showRecharge: false,
        type: "exchange"
      })
      return Promise.reject(res);
    }
  });
}

function createCardOrder() {
  if (!this.loading) {
    this.loading = true;
    return app.UserApi.createStoredValueCardOrder({
      data: {
        activityId: this.activityId || 0,
        cardId: this.data.cardId || 0,
        paymentMode: 1, //微信支付
        brandCode: app.Conf.BRAND_CODE,
        userToken: app.LM.userKey
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      let data = res.data;
      if (res.code == 1) {
        // toPay.call(this, data.orderId);
        beforeToPay.call(this, data.orderId);
        return Promise.resolve(data);
      } else {
        app.SMH.showToast({
          "title": res.msg || '订单异常'
        });
        return Promise.reject(res);
      }
    }).finally(() => {
      this.loading = false;
    });
  }
}

function beforeToPay(orderId) {
  app.LM.getUserSimpleInfo(app.LM.userKey).then(res => {
    if (res.uId) {
      toPay.call(this, orderId, res.uId)
    }
  })
}

function toPay(orderId, userId) {
  // return app.PayApi.getAppletPrepayId({
  //   params: {
  //     order_id: orderId || 0,
  //     pay_type: "recharge_card",
  //     user_id: userId
  //   },
  //   other: {
  //     isShowLoad: true
  //   }
  // })
  return PayH.UnifiedorderByOrderId("recharge_card",orderId)
  .then(e => {
    if (e.code == "1") {
      let pay_info = e.data;
      WxApi.requestPayment({
        'timeStamp': pay_info.timeStamp + '',
        'nonceStr': pay_info.nonceStr,
        'package': pay_info.package,
        'signType': pay_info.signType,
        'paySign': pay_info.sign,
      }).then(e => {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        if (e.errMsg.indexOf('ok') != -1) {
          this.pageDialog.setTitle("充值成功，充值金额将在5分钟内到账");
          this.pageDialog.setSingleBtn(() => {
            this.pageDialog.dismiss();
            let timer = setTimeout(() => {
              clearTimeout(timer);
              wx.navigateBack({
                delta: 1
              });
            }, 300)
          });
          this.pageDialog.show();
        } else {
          app.SMH.showToast({
            "title": "支付失败"
          });
        }
      });
    } else {
      app.SMH.showToast({
        "title": e.msg
      });
    }
  })
}

function run_exchange() {
  let params = {
    cardId: this.data.card_val || '',
    password: this.data.pwd_val || '',
  };
  let extra = {
    isShowLoad: false
  }
  app.RunApi.go('post', 'UserApi', 'storedValueCard', params, extra).then(res => {
    if (res && res.code == 1) {
      let that = this;
      let _timer = setTimeout(() => {
        clearLoad.call(this);
        that.setData({
          hideWin: false,
          price: res.data || ''
        })
        wx.nextTick(() => {
          that.setData({
            showWinAnim: true,
          })
        })
        clearTimeout(_timer);
      }, 1000)
    } else {
      let _timer1 = setTimeout(() => {
        clearLoad.call(this);
        clearTimeout(_timer1);
      }, 500)
      let _timer2 = setTimeout(() => {
        clearTimeout(_timer2);
        setResult.call(this, res && res.msg || "兑换无效");
      }, 1000)
    }
  })
}

function getBaseInfo() {
  if (app.LM.isLogin && !(this.data.mobilePhone && this.data.userImg)) {
    let reset = (!this.data.isLogin) ? true : false;
    this.setData({
      isLogin: true
    })
    return app.LM.getUserSimpleInfo(app.LM.userToken, false).then(res => {
      console.log('getUserSimpleInfo', res);
      if (res) {
        this.setData({
          cardNum: res.cardNum || '',
          mobilePhone: res.mobilePhone || '',
          userImg: res.portrait_path || '',
          realName: res.realName,
        })
        if (reset) {
          loadData.call(this);
        }
      }
    })
  }
}

function showLoadFnc() {
  let num = 1;
  let arr = ['.', '..', '...'];
  clearTimeout(this.resultTimeOut);
  this.setData({
    showLoad: true,
    showMsg: false,
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
  }, 500)
}

function setResult(msg = '') {
  if (!msg) return;
  clearLoad.call(this);
  clearTimeout(this.resultTimeOut);
  this.setData({
    showMsg: true,
    result: msg,
  });
  this.resultTimeOut = setTimeout(() => {
    this.setData({
      showMsg: false
    });
    clearTimeout(this.resultTimeOut);
  }, 2000);
}

function clearLoad() {
  clearInterval(this.loadInterval);
  this.setData({
    showLoad: false
  })
}

function getConfig(id = '') {
  if (!id) return Promise.reject();
  return app.sysTemConfig(id).then(res => {
    let value = res && res.Value || '0'
    if (value == '1') {
      this.setData({
        showTab: true
      })
      return res
    } else {
      return Promise.reject();
    }
  });
}

function storedValueInfo() {
  return app.UserApi.getUserStoredValueInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    let data = res.data;
    if (res.code == 1) {
      // this.setData({
      //   activityId: data.activityId, //当前活动的ID，为0 表示没正在进行的充值活动
      //   cardNum: data.cardNum,
      //   mobilePhone: data.mobilePhone,
      //   storedValue: data.storedValue,
      //   noteImg: data.noteImg,
      //   showCard: false
      // });
      // this.activityId = data.activityId || 0;
      return Promise.resolve(data.activityId);
    } else {
      return Promise.resolve(0);
    }
  });
}

let controlClick = Utils.debounce(fn => {
  fn();
}, 400);

let exchangeClick = Utils.debounce(fn => {
  fn();
}, 400);