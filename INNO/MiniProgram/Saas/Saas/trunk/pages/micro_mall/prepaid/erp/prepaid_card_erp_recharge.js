// pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge.js
import Utils from "../../../../common/support/utils/utils";
import StringUtil from "../../../../common/support/utils/string-util"
import WxApi from '../../../../common/helper/wx-api-helper.js';
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
    pwd_val: "",
    hideWin: true,
    hidePwd: true,
    //
    showExchange: false, //充值兑换
    showRecharge: false, //充值活动
    searchText: "",
    curStaffList: [],
    selected: false,
    isShowProtocol:true,
  },
  staffListPage: 1,
  staffListHasMore: true,
  staffListHasLoading: false,
  onLoad: function (options) {
    let bInfo = this.data.brand_info || {};
    this.options = options;
    let scanIcon = app.getIconUrl('default_scan.png', 'default_icon_url');
    let img_select_active = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let img_select = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({
      scanIcon,
      img_select,
      img_select_active,
      scanImg: bInfo.default_icon_url + "scan.png",
      pwd_active: bInfo.default_icon_url + "pwd_active.png",
      pwd_hide: bInfo.default_icon_url + "pwd_hide.png",
      defaultImg: bInfo.logo_path + "micro_mall/applet_logo.png",
      remove_btn: bInfo.icon_url + "micro_mall/comment_edit/remove_btn_icon.png",
      noActivityIcon: bInfo.icon_url + "micro_mall/perpaid/no_card.png",
    })
    storedValueInfo.call(this).then(resActId => {
      this.activityId = resActId || 0;
      this.checkShowViewState();
      if (!this.alreadyLoad) {
        getBaseInfo.call(this);
        loadData.call(this).then(() => {})
      }
      this.loading = false;
    })
    getUserAgreement.call(this).then(res=>{
      if(res.code == 1){
        let data = res.data;
        let article_title = data && data.article_title||"";
        this.setData({
          article_title,
          isShowProtocol:data||false
        })
      }
    });
    listen.call(this);
  },
  onReady() {
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    let wxpay = this.data.brand_info.icon_url + "micro_mall/perpaid/ic_wxpay.png";
    this.setData({
      [`payWays[0].img`]: wxpay
    });
    this.mpInputCard = this.selectComponent('#mpInputCard');
    this.mpInputPwd = this.selectComponent('#mpInputPwd');
    this.inputDropDownId = this.selectComponent('#inputDropDownId');
  },
  onShow: function () {
    if (this.activityId) {
      this.alreadyLoad = true;
      getBaseInfo.call(this);
      loadData.call(this)
    }
  },
  checkShowViewState() {
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
    unListen.call(this);
  },
  onUnload() {
    unListen.call(this);
  },
  onShareAppMessage: function (res) {
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
      checkProtocol.call(this).then(() => {
        createCardOrder.call(this);
      }).catch(e=>{
        console.log('catch',e)
      })
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
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let name = dataset.name || '';
    let that = this;
    if (name) {
      return scanCode.call(this).then(res => {
        this.setData({
          [`${name}`]: res.result || ''
        })
      }).catch(e => {
        if (e && e.errMsg && e.errMsg.indexOf('cancel') == -1) {
          app.SMH.showToast({
            title: e.errMsg || "操作异常",
          })
        }
      });
    }

  },
  handle_exchange(e) {
    let card_val = this.mpInputCard.getInput();
    let pwd_val = this.mpInputPwd.getInput();
    console.log('兑换', card_val, pwd_val);
    getBaseInfo.call(this);
    let name = '';
    if (!(/^\S+$/.test(pwd_val))) {
      name = pwd_val ? "请输入正确的密码格式" : "密码不能为空";
    }
    if (!(/^\S+$/.test(card_val))) {
      name = card_val ? "请输入正确的卡号格式" : "卡号不能为空";
    }
    if (name) {
      setResult.call(this, name);
      return
    }
    exchangeClick.call(this, () => {
      showLoadFnc.call(this);
      run_exchange.call(this, card_val, pwd_val);
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
  scanCode(e) {
    let dataset = this.getDataset(e);
    let type = dataset.type || "";
    if (type == 'exchange') {
      let id = dataset.id || '';
      if (id) {
        return scanCode.call(this).then(res => {
          console.log('scanscan', res)
          this[id] = this[id] || this.selectComponent(`#${id}`)
          this[id].setInput(res.result || '');
        }).catch(e => {
          if (e && e.errMsg && e.errMsg.indexOf('cancel') == -1) {
            app.SMH.showToast({
              title: e.errMsg || "操作异常",
            })
          }
        });
      }
    } else if (type == 'staff') {
      return scanCode.call(this).then(res => {
        console.log('scanscan', res)
        if (res && res.scanType == "WX_CODE" && res.path) { 
          let scene = getScene(res.path);
          if (scene) {
            return scanWXCodeLog.call(this, scene).then(res => {
              this.inputDropDownId = this.inputDropDownId || this.selectComponent('#inputDropDownId');
              this.inputDropDownId.setInput(res || "");
              this.searchText = res;
              this.setData({
                searchText: res || ""
              })
              this.searchStaff();
            })
          }
          return Promise.reject()
        }
        return Promise.reject()
      }).catch(e => {
        console.log(e)
        if (!e || (e && e.errMsg && e.errMsg.indexOf('cancel') == -1)) {
          app.SMH.showToast({
            title: e && e.errMsg || "无效的小程序码",
          })
        }
      });
    }
  },
  handleInput(e) {
    let _e = e.detail || {};
    let dataset = this.getDataset(_e);
    let type = dataset.type || "";
    if (type == 'exchange') {
      return
    } else {
      this.searchText = _e.detail;
      this.setData({
        searchText: this.searchText
      })
      this.resetList();
      searchFnc.call(this, () => {
        getStaffDstbList.call(this);
      })
    }
  },
  scrollToLower(e) {
    if (this.staffListHasMore) {
      getStaffDstbList.call(this);
    }
  },
  handleFocus(e) {
    // console.log(e)
    // this.setData({
    //   focus:true
    // })
    // if(!this.data.searchText && this.data.curStaffList.length<=0){
    if (this.data.searchText) {
      getStaffDstbList.call(this);
    }
  },
  handleToggle(e) {
    // let bool = e.detail;
    // this.setData({
    //   focus:bool
    // })
  },
  resetList() {
    this.staffListPage = 1;
    this.staffListHasMore = true;
    this.staffListHasLoading = false;
    this.data.curStaffList = [];
  },
  selectStaff(e) {
    let data = this.getDataset(e.detail, 'data') || {};
    let code = data.dstb_staff_code || "";
    this.staff_select = data;
    this.searchText = code;
    this.inputDropDownId.setFocus(false);
    this.setData({
      // focus:false,
      staff_select: this.staff_select,
      searchText: this.searchText,
    })
    this.inputDropDownId.setInput(code);
    this.resetList();
    getStaffDstbList.call(this);
  },
  searchStaff() {
    this.resetList();
    getStaffDstbList.call(this).then(res => {
      if (res.data && res.data.list.length == 1) {
        this.selectStaff({
          detail: {
            currentTarget: {
              dataset: {
                data: res.data.list[0]
              }
            }
          }
        })
      } else {
        this.staff_select = {};
        this.setData({
          staff_select: {}
        })
        this.inputDropDownId.setFocus(true);
        this.handleFocus();
      }
    });
  },
  onTap(e) {
    let type = this.getDataset(e, 'type') || "";
    if (type == 'protocolSelect') {
      this.setData({
        selected: !!!this.data.selected
      })
    } else if (type == 'protocolJump') {
      wx.navigateTo({
        url: '/pages/micro_mall/articles/agreet/agreet?type=STORED_VALUE',
      })
    }
  }
}))

function listen() {
  if (app.LM.isLogin && !this.data.isLogin) {
    this.setData({
      isLogin: true
    })
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin && !this.data.isLogin) {
      this.setData({
        isLogin: true
      })
      loadData.call(this);
    }
  });
}

function unListen() {
  if (this.listenLoginStatuId) {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
}

function loadData() {
  if (!this.activityId || this.activityId == 0) {
    return new Promise((rs, rj) => {
      return rj();
    });
  }
  return app.UserApi.getStoredValueActivity({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      activityId: this.activityId || 0
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
        cardId: this.data.cardId || data.cardList[0].cardId,
        showRecharge: true,
      });
      // wx.setNavigationBarTitle({
      //   title: "储值" || this.data.activityName
      // });
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
  console.log("createCardOrder")
  if (!this.loading) {
    this.loading = true;
    let staff_select = this.staff_select || {};
    let staff_id = staff_select.dstb_staff_id || 0;
    return app.UserApi.createStoredValueCardOrder({
      data: {
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE,
        activityId: this.activityId || 0,
        cardId: this.data.cardId || 0,
        dstbStaffId: staff_id,
        paymentMode: 1 //微信支付
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      let data = res.data;
      if (res.code == 1) {
        return beforeToPay.call(this, data.orderId);
        // return Promise.resolve(data);
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
  // return app.LM.getUserSimpleInfo(app.LM.userToken).then(res => {
  //   if (res.uId) {
      
  //   }
  // })
  return toPay.call(this, orderId)
}

function toPay(order_id) {
  return PayH.UnifiedorderByOrderId({type:"recharge_card", order_id})
    .then(e => {  
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
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
    })
}

function run_exchange(card_val, pwd_val) {
  let params = {
    cardId: card_val || '',
    password: pwd_val || '',
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
      return Promise.reject(res);
    }
  }).catch(e => {
    let _timer1 = setTimeout(() => {
      clearLoad.call(this);
      clearTimeout(_timer1);
    }, 500)
    let _timer2 = setTimeout(() => {
      clearTimeout(_timer2);
      setResult.call(this, e && e.msg || "兑换无效");
    }, 1000)
  })
}

function getBaseInfo() {
  if (app.LM.isLogin && !(this.data.mobilePhone && this.data.userImg)) {
    let reset = (!this.data.isLogin) ? true : false;
    this.setData({
      isLogin: true
    })
    return app.LM.getUserSimpleInfo(app.LM.userToken, false).then(res => {
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

function storedValueInfo() {
  return app.UserApi.getCurrentStoredValueActivity({
    params: {
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      return Promise.resolve(data.activityId);
    } else {
      return Promise.reject(res);
    }
  });
}

let controlClick = Utils.debounce(fn => {
  fn();
}, 400);

let exchangeClick = Utils.debounce(fn => {
  fn();
}, 400);

let searchFnc = Utils.throttleTwice(fn => {
  fn();
}, 800);

function scanCode() {
  return app.OriginalApi.scanCode({})
}

function scanWXCodeLog(scene = "") {
  return app.BarCodeApi.scanWXCodeLog({
    data: {
      "brandCode": app.Conf.BRAND_CODE,
      "userToken": app.LM.userToken || "",
      "barCodeId": "",
      "scence": scene,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      let p_scene = data.p_scene || "";
      let options = p_scene && JSON.parse(p_scene) || {};
      let staffCode = options.staffCode || "";
      console.log('scanWXCodeLog', staffCode, e)
      return Promise.resolve(staffCode);
    }
    return Promise.reject(e);
  })
}

function getScene(path) {
  let {
    scene = ""
  } = StringUtil.getUrlParam(path);
  return scene
}

function getStaffDstbList() {
  if (this.staffListHasLoading) return Promise.reject();
  this.staffListHasLoading = true;
  return app.DistrApi.getStaffDstbList({
    params: {
      searchText: this.searchText,
      pageIndex: this.staffListPage || 1,
      pageSize: 10,
      brandCode: app.Conf.BRAND_CODE,
    }
  }).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let curStaffList = data.list || [];
      this.setData({
        curStaffList: [...this.data.curStaffList, ...curStaffList]
      });
      let totalCount = data.totalCount || 0;
      this.staffListHasMore = (this.staffListPage * 10) < totalCount;
      this.staffListPage += 1;
    }
    return res
  }).finally(() => {
    this.staffListHasLoading = false;
  })
}

function checkProtocol() {
  let that = this;
  return new Promise((rs,rj)=>{
    if(this.data.isShowProtocol && !this.data.selected){
      this.protocolDialog = this.protocolDialog || this.selectComponent("#protocolDialog");
      this.protocolDialog.setTitle("温馨提示");
      this.protocolDialog.setTwoBtn({
        name: "取消",
        tap: function () {
          that.protocolDialog.dismiss();
          rj();
        }
      }, {
        name: "确认",
        tap: function () {
          that.setData({
            selected:true
          })
          that.protocolDialog.dismiss();
          rs();
        }
      })
      this.protocolDialog.show();
    }else {
      rs();
    }
  })
}

function getUserAgreement(){
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: "STORED_VALUE"
    },
    other: {
      isShowLoad: true
    }
  })
}