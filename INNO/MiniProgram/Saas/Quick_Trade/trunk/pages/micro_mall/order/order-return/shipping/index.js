
const App = getApp(); 
import LocaleCompareHelp from '../../../../../common/helper/locale-compare-help/index'  
Page(App.BP({
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
  return App.Http.UserApi.getShippingList({
    params:{
      brandCode:App.Conf.BRAND_CODE
    },
  }).then(res=>{
    if(res.code==1){
      let data = res.data || [];
      return Promise.resolve(data);
    }
    return Promise.reject(res);
  })
  // return App.RunApi.go('BrandApi','getShippingList',{brandCode:App.Conf.BRAND_CODE},{diy:true}).then(res=>{
  //   if(res.code==1){
  //     let data = res.data || [];
  //     return Promise.resolve(data);
  //   }
  //   return Promise.reject(res);
  // })
}