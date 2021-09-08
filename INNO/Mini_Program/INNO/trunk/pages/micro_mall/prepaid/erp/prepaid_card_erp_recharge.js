// pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge.js
import Utils from "../../../../common/support/utils/utils";
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
    searchText:"",
    curStaffList:[]
  },
  staffListPage:1,
  staffListHasMore:true,
  staffListHasLoading:false,
  onLoad: function(options) {
    let bInfo = this.data.brand_info || {};
    this.options = options;
    let scanIcon = app.getIconUrl('default_scan.png','default_icon_url');
    this.setData({
      scanIcon,
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
      if (!this.alreadyLoad){
        getBaseInfo.call(this);
        loadData.call(this).then(()=>{
        }).finally(() => {
          this.showPage();
        })
      }
      this.loading = false;
    })
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
  },
  onShow: function() {
    if (this.activityId){
      this.alreadyLoad = true;
      getBaseInfo.call(this);
      loadData.call(this).finally(() => {
        this.showPage();
      });
    }
  },
  checkShowViewState(){
    let type = this.activityId && this.activityId != 0 ? this.options.type : 'exchange';
    app.sysTemConfig('is_show_exchange_stored_value').then(res => {
      let value = 1||res.Value || 0;
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
    let dataset = e.currentTarget && e.currentTarget.dataset || {};
    let name = dataset.name || '';
    let that = this;
    if (name) {
      return scanCode.call(this).then(res=>{
          this.setData({
            [`${name}`]: res.result || ''
          })
      }).catch(e=>{
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
      run_exchange.call(this,card_val,pwd_val);
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
  scanCode(e){
    let dataset = this.getDataset(e);
    let type = dataset.type||"";
    if(type == 'exchange'){
      let id = dataset.id || '';
      if (id) {
        return scanCode.call(this).then(res=>{
            console.log('scanscan',res)
            this[id] = this[id] || this.selectComponent(`#${id}`)
            this[id].setInput(res.result||'');
        }).catch(e=>{
            if (e && e.errMsg && e.errMsg.indexOf('cancel') == -1) {
              app.SMH.showToast({
                title: e.errMsg || "操作异常",
              })
            }
        });
      }
    }else if(type == 'staff'){
      return scanCode.call(this).then(res=>{
        console.log('scanscan',res)
        if(res && res.scanType == "WX_CODE" && res.path){
          let scene = getScene(res.path);
          if(scene){
            return scanWXCodeLog.call(this,scene).then(res=>{
              this.mpInput = this.mpInput || this.selectComponent('#mpInput');
              this.mpInput.setInput(res||"");
              this.searchText = res;
              this.setData({
                searchText:res||""
              })
              this.searchStaff();
            })
          }
          return Promise.reject()
        }
        return Promise.reject()
      }).catch(e=>{
          console.log(e)
          if (!e || (e && e.errMsg && e.errMsg.indexOf('cancel') == -1)) {
            app.SMH.showToast({
              title: e && e.errMsg || "无效的小程序码",
            })
          }
      });
    }
  },
  handleInput(e){
    let dataset = this.getDataset(e);
    let type = dataset.type||"";
    if(type == 'staff'){
      this.searchText = e.detail;
      this.setData({searchText:this.searchText})
      this.resetList();
      searchFnc.call(this,()=>{
        getStaffDstbList.call(this);
      })
    }else if(type == 'exchange'){
     
    }
  },
  scrollToLower(e){
    if(this.staffListHasMore){
      getStaffDstbList.call(this);
    }
  },
  handleFocus(e){
    this.setData({
      focus:true
    })
    if(!this.data.searchText && this.data.curStaffList.length<=0){
      getStaffDstbList.call(this);
    }
  },
  handleToggle(){
    this.setData({
      focus:!!!this.data.focus,
    })
  },
  resetList(){
    this.staffListPage = 1;
    this.staffListHasMore = true;
    this.staffListHasLoading = false;
    this.data.curStaffList = [];
  },
  searchStaff(){
    this.resetList();
    getStaffDstbList.call(this).then(res=>{
      if(res.data && res.data.list.length == 1){
        this.selectStaff({currentTarget:{dataset:{data:res.data.list[0]}}})
      }else if(!this.data.focus){
        this.staff_select = {};
        this.setData({
          staff_select:{}
        })
        this.handleFocus();
      }
    });
  },
  selectStaff(e){
    let dataset = this.getDataset(e);
    let data = dataset.data||{};
    let code = data.dstb_staff_code||"";
    this.staff_select = data;
    this.searchText = code;
    this.setData({
      focus:false,
      staff_select:this.staff_select,
      searchText:this.searchText,
    })
    this.mpInput = this.mpInput || this.selectComponent('#mpInput');
    this.mpInput.setInput(code);
    this.resetList();
    getStaffDstbList.call(this);
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
  if (!this.activityId || this.activityId == 0){
    return new Promise((rs, rj)=>{
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
    let staff_select = this.staff_select||{};
    let staff_id = staff_select.dstb_staff_id || 0;
    return app.UserApi.createStoredValueCardOrder({
      data: {
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE,
        activityId: this.activityId || 0,
        cardId: this.data.cardId || 0,
        dstbStaffId:staff_id,
        paymentMode: 1 //微信支付
      },
      other: {
        isShowLoad: true
      }
    }).then(res => {
      let data = res.data;
      if (res.code == 1) {
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
  app.LM.getUserSimpleInfo(app.LM.userToken).then(res => {
    if (res.uId) {
      toPay.call(this, orderId, res.uId)
    }
  })
}

function toPay(orderId, userId) {
  return PayH.UnifiedorderByOrderId("recharge_card",orderId)
  .then(e => {
    if (e.code == "1") {
      let pay_info = e.data || {};
      return app.OriginalApi.requestPayment({pay_info,jimmy:441}).then(e=>{
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        if (e.errMsg.indexOf('ok') != -1) {
          this.pageDialog.setTitle("充值成功，充值金额将在5分钟内到账");
          this.pageDialog.setSingleBtn(() => {
            wx.navigateBack({
              delta: 1
            });
          });
          this.pageDialog.show();
        } else {
          app.SMH.showToast({
            "title": "支付失败"
          });
        }
      })
      // WxApi.requestPayment({
      //   'timeStamp': pay_info.timeStamp + '',
      //   'nonceStr': pay_info.nonceStr,
      //   'package': pay_info.package,
      //   'signType': pay_info.signType,
      //   'paySign': pay_info.sign,
      // }).then(e => {
         
      // });
    } else {
      app.SMH.showToast({
        "title": e.msg
      });
    }
  })
}

function run_exchange(card_val,pwd_val) {
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
  }).catch(e=>{
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

let searchFnc = Utils.throttle(fn => {
  fn();
}, 800);
 
function scanCode(){
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
      let data = e.data||{};
      let p_scene = data.p_scene || "";
      let options = p_scene && JSON.parse(p_scene) || {};
      let staffCode = options.staffCode||"";
      console.log('scanWXCodeLog',staffCode,e)
      return Promise.resolve(staffCode);
    }
    return Promise.reject(e);
  })
}

function getScene(path){
  let key = "scene=";
  if(!path || (path.indexOf(key) == -1))return "";
  let scene = path.slice(path.indexOf(key) + key.length);
  return scene
}

function getStaffDstbList(){
  if(this.staffListHasLoading)return Promise.reject();
  this.staffListHasLoading = true;
  return app.DistrApi.getStaffDstbList({
    params:{
      searchText:this.searchText,
      pageIndex:this.staffListPage || 1,
      pageSize:10,
      brandCode:app.Conf.BRAND_CODE,
    }
  }).then(res=>{
    console.log('resres',res);
    if(res.code == '1'){
      let data = res.data||{};
      let curStaffList = data.list||[];
      this.setData({
        curStaffList:[...this.data.curStaffList,...curStaffList]
      });
      let totalCount = data.totalCount||0;
      this.staffListHasMore = (this.staffListPage * 10) < totalCount;
      this.staffListPage += 1;
    }
    return res
  }).finally(()=>{
    this.staffListHasLoading = false;
  })
}