// pages/micro_mall/stores/scan_jump/scan_jump.js
const app = getApp();
import ScanH from "../../../../common/helper/handle/scanHandleParams"

Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.options = options;
    this.options.type = this.options.type || "explain";
    this.setData({
      options
    })
    initImg.call(this);
  }, 
  scan(){
    ScanH.scanAction().then(result => {
      this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
      ScanH.scanActionAnalyse(result,this.pageDialog);
    }); 
  },
  jump(){
    wx.navigateTo({
      url: '/pages/micro_mall/stores/scan_jump/scan_jump?type=method',
    })
  }
})) 
 
function initImg(){ 
  return app.sysTemConfig('brand_url').then(res => {
    if(res.Value){ 
      let brand_url = res.Value || "";
      if(this.options.type == 'explain'){
        app.sysTemConfig('scan_shipping_bg_url').then(res => {
          let img_explain_bg = (res && res.Value || "");
          img_explain_bg = brand_url + img_explain_bg;
          this.setData({
            img_explain_bg
          })
        })
      }
      app.sysTemConfig('scan_shipping_scan_method_img').then(res => {
        let img_method_bg = (res && res.Value || "");
        img_method_bg = brand_url + img_method_bg;
        let default_scan = this.data.brand_info.default_icon_url + "default_scan.png";
        this.setData({
          img_method_bg,
          default_scan
        })
      })

    }
  })
 
}