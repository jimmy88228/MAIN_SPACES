import WxApi from "../../../../common/support/tools/wx-api-promise.js"
const app = getApp();

Page(app.BP({

  data: {
    memberInfo:{},
    memberRight:[],
    IMBonusList:[],
    IMGoodsList: [],
    current: 0,
  },
  onShow(){
    listen.call(this);
    getMyInfoByIM.call(this);
    getUserBenefit.call(this);
    getIMBonusListByMain.call(this);
    getIMGoodsListByMain.call(this);
  },
  onHide(){
    unListen.call(this);
  },
  onUnload(){
    unListen.call(this);
  },
  onLoad: function (options) {

  },

  getDetails(e){
    let dataset = e.currentTarget.dataset;
    let url = dataset.url;
    if(!url) return;
    WxApi.navigateTo({
      url: url
    })
  },

  checkMemeberRight(e){
    let dataset = e.currentTarget.dataset;
    let index = dataset.index;
    let memberRight = this.data.memberRight;
    this.member = this.member || this.selectComponent("#member");
    this.member.getMemberRight(memberRight,index);
  },
  loginToGetMemberInfo(){
    authorizeUserInfo.call(this).then( e=>{
      getMyInfoByIM.call(this);
      getUserBenefit.call(this);
    })
  }
}))
//会员信息
function getMyInfoByIM(){
  return app.IntegralApi.getMyInfoByIM({
    params:{
      token: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then( e=>{
    if(e.code == 1){
      let data = e.data;
      this.setData({
        memberInfo: data
      })
    }
  })
}
//获取会员权益
function getUserBenefit(){
  if (!app.LM.userToken) return;
  return app.IntegralApi.getUserBenefit({
    params: {
      token: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      this.setData({
        memberRight: data
      })
    }
  })
}
//对劵列表
function getIMBonusListByMain(){
  if (!app.LM.userToken) return Promise.reject();
  return app.IntegralApi.getIMBonusListByMain({
    params:{
      token: app.LM.userToken
    },
    other:{
      isShowLoad: true
    }
  }).then( e=>{
    if(e.code == "1"){
      this.setData({
        IMBonusList: e.data
      })
    }
  })
}
//对商品列表
function getIMGoodsListByMain() {
  if (!app.LM.userToken) return Promise.reject();
  return app.IntegralApi.getIMGoodsListByMain({
    params: {
      token: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      this.setData({
        IMGoodsList: e.data
      })
    }
  })
}

//授权
function authorizeUserInfo() {
  return app.LM.getUserTokenAsync(true);
}

function listen() {
  this.setData({
    isLogin: app.LM.isLogin
  });
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    getMyInfoByIM.call(this);
    getUserBenefit.call(this);
    getIMBonusListByMain.call(this);
    getIMGoodsListByMain.call(this);
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
}

function unListen() {
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}