// pages/component/pop/adsPop.js
import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const PAGE_TYPE = "STAFF_COUPON";
const app = getApp();
const SharePath = '/pages/micro_mall/coupon_center/receive/receive';
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'apply-shared'
  },
  properties: {
    bonusInfo:{
      type: Object,
      value:{},
      observer(n){
        n = n || {};
        if(n.canSendCound < this.data.inputNum){
          this.setData({
            inputNum: n.canSendCound
          })
        }
      }
    }
  },
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    inputNum: 1,
    shareId:"",
    shareInfo:{
      isCustom: true,
      shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL ,
      title: "",
      path: "",
      imageUrl: ""
    }
  },
  ready(){
    this.initData();
  },
  pageLifetimes: {
    show() {},
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      setTimeout(()=>{
        this.setData({
          shareId: ""
        })
        this.triggerEvent("choiceHide");   
      },700);
      return 300;
    },
    initData(){
      let g_add = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add.png";
      let g_add_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add_none.png";
      let g_reduce = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_reduce.png";
      let g_reduce_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
      this.setData({
        g_add,
        g_add_none,
        g_reduce,
        g_reduce_none
      })
    },
    changeNum(e){
      let dataset = e.currentTarget.dataset || {};
      let inputNum = parseInt(this.data.inputNum) || 1;
      if(dataset.type == "reduce"){
        if(inputNum > 1){
          inputNum = inputNum - 1
        }else{
          return;
        }
      }else if(dataset.type == "add"){
        if(inputNum < parseInt(dataset.canSendCound)){
          inputNum = inputNum + 1
        }else{
          return;
        }
      }
      console.log(inputNum)
      this.setData({
        inputNum: inputNum
      })
    },
    blurInput(e){
      let dataset = e.currentTarget.dataset || {};
      let val = e.detail && parseInt(e.detail.value) || 1;
      if(val > parseInt(dataset.canSendCound)){
        val = dataset.canSendCound;
      }
      this.setData({
        inputNum : val
      })
    },
    createShareEvent(){
      createShare.call(this);
    },
    showDesc(e){
      let dataset = e.currentTarget.dataset || {};
      let activieTaskId = this.data.activieTaskId || ""
      if(activieTaskId == dataset.taskId){
        activieTaskId = ""
      }else{
        activieTaskId = dataset.taskId || ""
      }
      this.setData({
        activieTaskId: activieTaskId
      })
    },
    _noFn() {},
  }
}))
function createShare(){
  let bonusInfo = this.data.bonusInfo || {};
  let inputNum = this.data.inputNum || 1;
  return app.DistrApi.shareStaffCoupon({
    data: {
      userToken: app.LM.userToken,
      taskId: bonusInfo.taskId,
      shareNumber: inputNum,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || {};
      let bonusInfo = this.data.bonusInfo || {};
      let shareInfo = this.data.shareInfo || {};
      shareInfo.title = bonusInfo.shareTitle;
      shareInfo.path = SharePath + "?shareId=" + data
      shareInfo.imageUrl = bonusInfo.shareImage;
      this.setData({
        shareId: data,
        shareInfo: shareInfo
      })
      app.SMH.showToast({
        title: "任务生成成功，可点击分享好友"
      })
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}