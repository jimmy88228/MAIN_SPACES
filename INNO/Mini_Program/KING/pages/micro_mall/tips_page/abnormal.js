const app = getApp();
Page(app.BP({ 
  data: {

  }, 
  onLoad: function (options) {
    let brand_info = this.data.brand_info || {};
    let busy = brand_info.default_icon_url + "busy.jpg";
    this.setData({
      busy
    })
  },  
  jump(e){
    console.log(e)
    let dataset = e.currentTarget.dataset || {};
    let url = dataset.url || '';
    let type = dataset.type || '';
    console.log(url)
    if(!url)return
    if (type == 'tab'){
      wx.reLaunch({
        url: url,
      }) 
    }else{
      wx.redirectTo({
        url: url,
      }) 
    }
  },
  handle_error(){
    this.setData({
      hideImg:true
    })
  }
}))
 