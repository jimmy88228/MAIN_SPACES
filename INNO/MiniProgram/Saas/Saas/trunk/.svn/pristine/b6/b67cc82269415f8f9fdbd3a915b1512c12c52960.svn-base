import { CountDown } from "../../../../common/manager/timer-manager.js";
const app = getApp();
const MAX_COUNT = 500;
Page(app.BP({
    data: {
        bonusInfo: {},
        baseInfo: {},
        isSlotContent: false, // 显示兑换数量框
        exchangeNumber: 1, // 兑换数量
        brand_info: app.globalData.brand_info
    },
    onLoad: function(options) {
        this.options = options;
    },
    onShow: function() {
        getTime.call(this, "show");
        getPointMkBonusDetail.call(this, this.options);
        listen.call(this);
    },
    onHide: function() {
        unListen.call(this);
        getTime.call(this, "hide");
    },
    onUnload: function() {
        unListen.call(this);
        getTime.call(this, "hide");
    },
    onShareAppMessage: function() {
      let baseInfo = this.data.baseInfo;
      if (baseInfo.mk_bonus_id) {
        this.addActionLog("coupon_share", "INTEGRAL", {
          mkBonusId: baseInfo.mk_bonus_id
        })
      };
      return {
        addActionName:"coupon_share",
        shareType: app.ShareType["POINT_COUPON"] || app.ShareType.NORMAL,
        title: baseInfo.name,
        path: '/' + this.route + "?mkBonusId=" + baseInfo.mk_bonus_id,
        imageUrl: "",
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },
    exchangeBonusEvent() {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        let baseInfo = this.data.baseInfo;
        let mkBonusId = baseInfo.mk_bonus_id;
        if (!mkBonusId) return;
        checkExchangeBonus.call(this, mkBonusId).then(e => {
            let that = this;
            this.pageDialog.setTitle(`确定要兑换该优惠券吗？`);
            this.pageDialog.setTwoBtn({
                name: "取消",
                tap: function () {
                  that.pageDialog.dismiss();
                  that.setData({ isSlotContent: false })
                }
            }, {
                name: "立即兑换",
                tap: function() {
                    that.validate(that.data.exchangeNumber)
                      .then(() => {
                        that.pageDialog.dismiss();
                        setTimeout(()=>{
                          that.setData({ isSlotContent: false }, () => {exchangeBonus.call(that, mkBonusId);})
                        },200)
                      })
                      .catch(err => {
                        console.log("校验失败", err)
                        app.SMH.showToast({ title: err && err.msg || err })
                      })
                }
            })
            this.setData({ isSlotContent: true }, () => {
              this.pageDialog.show();
            })
        })
    },
    validate(value) {
      let limitBuyCount = Number(this.data.baseInfo.limitBuyCount) || 0;
      value = Number(value) || 0;
      return new Promise((rs, rj) => {
        if (value < 1) rj({value: 1, msg: "数量不能小于1"})
        else if ((limitBuyCount > 0 && value > limitBuyCount)) rj({value: limitBuyCount, msg: `最多只能兑换${limitBuyCount}张`})
        else if (value>MAX_COUNT) rj({value: MAX_COUNT, msg: `每次兑换数量不超过${MAX_COUNT}张`})
        else rs(value)
      })
    },
    changeExchangeQuantity(e) {
      let exchangeNumber = Number(this.data.exchangeNumber) || 0;
      if (e.type == 'input') { // 用户输入
        let userInput = e.detail.value;
        if (userInput === '') { // 用户输入可以空格
          this.setData({exchangeNumber: ''})
          return 
        }
        exchangeNumber = Number(userInput) || 0
      } else { // 点加减
        let qty = Number(e.currentTarget.dataset.qty)
        exchangeNumber += qty
      }

      this.validate(exchangeNumber)
        .then(() => {this.setData({exchangeNumber})})
        .catch(err => {
          console.log("校验失败", err)
          err.value && this.setData({exchangeNumber: err.value});
          app.SMH.showToast({ title: err && err.msg || err })
        })
    },
    checkBindInfo(){
      this.exchangeBonusEvent();
    },
}))
function getTime(pageAction){
  let userChoiceData = app.StorageH.get("userChoiceData") || {};
  if (pageAction == "show"){
    console.log("show", userChoiceData);
    if (userChoiceData.changeTime){
      let changeTime = parseInt((userChoiceData.changeTime - new Date().getTime()) / 1000)
      if (changeTime > 0){
        setCountdownTime.call(this,changeTime);
      }
    }
  } else if (pageAction == "hide"){
    console.log("hide");
    if (this.data.secondsTime){
      userChoiceData.changeTime = new Date().getTime() + (this.data.secondsTime * 1000);
      console.log("userChoiceData", userChoiceData);
      app.StorageH.set("userChoiceData", userChoiceData)
    }
  }
}
function countdownTime(){
  getCountdownTime.call(this).then(time=>{
    setCountdownTime.call(this,time);
  })
}
function getCountdownTime(){
  if(this.time){
    return Promise.resolve(this.time);
  }
  return app.sysTemConfig("exchange_coupon_countdown_time").then(data=>{
    let time = data.Value || 10;
    this.time = time;
    return Promise.resolve(time);
  })
}
function setCountdownTime(time){
  if(time){
    if (!this.countDown){
      this.countDown = new CountDown();
    }
    let nowTime = new Date().getTime() + (time * 1000);
    this.countDown.setTarget(new Date(nowTime));
    if (!this.countDown.isRunning) {
      this.countDown.start(e => {
        if (e.value <= 0){
          stopCountDown.call(this);
        }else{
          let seconds = parseInt((e.value % (1000 * 60)) / 1000);
          this.setData({
            secondsTime: seconds
          })
        }
      });
    }
  }
}
function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
    delete this.countDown;

    this.onShow();
  }
}


function getPointMkBonusDetail(options = {}) {
    if (!options.mkBonusId) return Promise.reject();
    return app.PointApi.getPointMkBonusDetail({
        params: {
            mkBonusId: options.mkBonusId,
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userToken || "",
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data || {};
            let baseInfo = data.baseInfo || {};
            if (baseInfo.is_show_exchange_number == 1){
              let exchange_number = parseFloat(baseInfo.exchange_number) || 0;
              let ex_number_str = exchange_number;
              if (exchange_number > 10000){
                ex_number_str = parseFloat(exchange_number / 10000) + "万";
              }
              if (exchange_number > 100000){
                ex_number_str = parseFloat(exchange_number / 10000) + "万+";
              }
              baseInfo.exchange_number_str = ex_number_str;
            }
            let realInventory = Number(baseInfo.inventory) - Number(baseInfo.exchange_number);
            let limitBuyCount = Number(baseInfo.limit_buy_count) == 0 ? Number(realInventory) : Math.min(Number(baseInfo.limit_buy_count), Number(realInventory));
            baseInfo.limitBuyCount = limitBuyCount || 0;
            initCountDownData.call(this,baseInfo);
            this.setData({
                baseInfo: baseInfo || {},
                bonusInfo: data.bonusInfo || {}
            })
        }else{
            app.SMH.showToast({
                title:e.msg||'优惠券异常',
                duration:3000
            })
        }
    })
}

function checkExchangeBonus(mkBonusId) {
    if (!mkBonusId) return Promise.reject();
    if (this.checking) { return Promise.reject()};
    this.checking = true;
    return app.PointApi.checkExchangeBonus({
        params: {
            mkBonusId: mkBonusId,
            number: 1, // 固定为1
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true,
            title:""
        }
    }).then(e => {
        if (e.code == "1") {
            return Promise.resolve();
        } else {
            if (e.msg) {
                this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                this.pageDialog.setTitle(e.msg);
                this.pageDialog.setSingleBtn(() => {
                    this.pageDialog.dismiss();
                });
                this.pageDialog.show();
            }
            return Promise.reject();
        }
        return Promise.reject();
    }).finally(()=>{
      if (this.checking){
        this.checking = false;
      }
    })
}

function exchangeBonus(mkBonusId) {
    if (!mkBonusId) return Promise.reject();
    let that = this;
    let exchangeNumber = this.data.exchangeNumber;
    if (this.data.exchanging) {
      return Promise.reject()
    }else{
      this.setData({
        exchanging: true
      })
    }
    countdownTime.call(this);
    return app.PointApi.exchangeBonus({
        data: {
            mkBonusId: mkBonusId,
            number: exchangeNumber,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true,
            title:"兑换中"
        }
    }).then(e => {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        // this.pageDialog.setTitle("");
        let that = this;
        if (e.code == "1") {
          wx.showModal({content: "兑换成功,优惠券将在五分钟内到账", showCancel: false})
        } else {
          wx.showModal({
            title: "提示",
            content: e.msg || "兑换失败",
            showCancel: false
          })
        }
      }).finally(() => {
        if (this.data.exchanging) {
          setTimeout(() => {
            this.setData({
              exchanging: false
            })
          },100)
        }
      })
}

//授权
function authorizeUserInfo(e) {
    return app.LM.getUserTokenAsync(true);
}

function listen() {
    this.setData({
        isLogin: app.LM.isLogin
    });
    this.listenLoginStatuId = app.EB.listen("LoginStateChange", register => {
        this.setData({
          isLogin: app.LM.isLogin
        });
    });
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
    stopCountDown.call(this);
}

function initCountDownData(data){
  if(!data)return;
  let result = {};
  result.stime = data.start_time || "";
  result.etime = data.end_time || "";
  result.serverTime = data.server_time || "";
  result.acName = "兑换";
  result.type = "point"
  this.actCountDownId || (this.actCountDownId = this.selectComponent('#actCountDownId'));
  let cbData = this.actCountDownId.initData(result,()=>{
      getPointMkBonusDetail.call(this, this.options);
  });
  this.setData({
    disabledTip: cbData && cbData.state != 2 && cbData.disabledTip || ""
  })
}