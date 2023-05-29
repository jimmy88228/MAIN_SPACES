import Wxapi from "../../../common/helper/wx-api-helper.js"
const app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    selected: false,
    agreetD: {},
    isNeedLogin: "0",
    isLogin:app.LM.isLogin
  },
  onLoad: function (options) {
    this.options = options;
    getUserAgreement.call(this);
    let brand_info = this.data.brand_info;
    let agreetS = `${brand_info.icon_url}micro_mall/agreet/Selected.png`;
    let agreetNoS = `${brand_info.icon_url}micro_mall/agreet/noSelected.png`;
    this.setData({
      options:options,
      agreetS: agreetS,
      agreetNoS: agreetNoS
    })
  },
  onShow() {
    // listen.call(this);
    // this.initParams();
  },
  onHide(){
    // unListen.call(this);
  },
  selectHandle() {
    this.setData({
      selected: !this.data.selected
    })
  },
  comfirmSelect() {
    let reqConf = app.StorageH.get("REQCONF") || {};
    reqConf.agreetConf = reqConf.agreetConf || {}
    reqConf.agreetConf.isHandleCheck = this.data.selected ? 1 : 0;
    app.StorageH.set("REQCONF", reqConf, 30 * 24 * 60)
    Wxapi.navigateBack()
  },
  goJump(e) {
    let dataset = e.currentTarget.dataset || {};
    if (dataset.url) {
      wx.navigateTo({
        url: dataset.url,
      })
    }
  },
  initParams(){}
}))
function getUserAgreement() {
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: this.options.type||"USER" // USER:会员，RETURN:退换货
    }, other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      this.setData({
        showPage:true,
        agreetD: res.data
      })
    }
  })
}
