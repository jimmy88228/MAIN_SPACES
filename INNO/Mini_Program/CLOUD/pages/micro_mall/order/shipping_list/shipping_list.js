// pages/micro_mall/order/shipping_list/shipping_list.js
import LocaleCompareHelp from '../../../../helper/manager/localeCompareHelp.js' 
const app = getApp();
Page(app.BP({
  data: { 
    current:0
  },
  onLoad: function (options) { 
    loadData.call(this).then(res=>{ 
      let result = LocaleCompareHelp.getIndexes(res);
      this.setData({
        result
      })
      console.log('result',this.data.result)
    });
  }, 
  onReady: function () {

  },  
  onShareAppMessage: function () {

  },
  updateStatus(e){
    let current = e && e.detail||0; 
    this.setData({
      current
    })
  }
})) 

function loadData(){
  return app.RunApi.go('BrandApi','getShippingList',{}).then(res=>{
    if(res.code==1){
      let data = res.data || [];
      return Promise.resolve(data);
    }
    return Promise.reject(res);
  })
}