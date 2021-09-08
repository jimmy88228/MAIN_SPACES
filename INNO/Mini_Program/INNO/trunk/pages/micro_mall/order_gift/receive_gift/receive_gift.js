import {
  barcode
} from "../../../../common/helper/utils/goComplete/index.js"
const app = getApp();
Page(app.BP({
  data: {
    receiveDetail: {}
  },
  limitUrlTime: 3,
  onLoad(options) {
  },
  onReady() {
  },
  onShow() {
    getExchangeDetail.call(this)
  },
  onHide() {
  }
}))
function getExchangeDetail(){
  let options = this.options || {};
  if(!options.exchangeId) return;
  return app.UserApi.getExchangeDetail({
    params:{
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE,
      exchangeId: options.exchangeId
    },
    other:{
      isShowLoad:true
    }
  }).then(e=>{
    if(e.code == 1){
      let data = e.data || {};
      this.setData({
        receiveDetail: data || {}
      })
      barcode('goodsCode', data.exchangeCode, 592, 186, getCodeUrl.call(this,'goodsCode'));
      return Promise.resolve(e);
    }else{
      return Promise.reject(e);
    }
  })
}
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
      complete(res){}
    })
  },300);
}