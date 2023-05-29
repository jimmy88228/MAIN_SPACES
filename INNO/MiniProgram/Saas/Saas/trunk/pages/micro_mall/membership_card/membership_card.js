import {
    barcode
} from "../../../common/utils/codeCanvas/index.js"
var app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        brand_info: app.globalData.brand_info,
        rankImage: '',
        cardNo: '',
        card_info: {},
        articalLink: '',
        isAndroid: false,
        sys_config: {},
        showImg: true,
        url: ""
    },
    errAction() {
        this.setData({
            url: this.data.url + ' ',
        });
    },
    onShow: function() {
        app.sysTemConfig("barcode_card").then(data =>{
          this.barcodeCard = data.Value || 0;
          getCardDetail.call(this, this.barcodeCard);
        })
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {}
}))

function getCardDetail(barcodeCard) {
  let baseW = app.SIH.screenWidth / 750;
  return app.UserApi.getUserCardInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let brandInfo = this.data.brand_info;
      let code = barcodeCard == 1 ? data.mobilePhone : data.cardNum;
      barcode('barCanvas', code, 500, 150);
      this.setData({
        rankImage: data.rankImage,
        cardNo: code,
        card_info: data,
        showImg: false
      });
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}