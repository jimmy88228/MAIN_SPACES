import WxApi from "../../../../common/utils/wxapi/index";
const App = getApp();
Component(App.BC({
  properties: {
    styleType: { // 0: 普通
      type: String,
      value: "0"
    },
    title: { // 标题
      type: String,
      value: ""
    }
  },
  pageLifetimes:{
    show(){
      this.setStoreInfo();
      // App.StoreH.getVisitStoreByLogin().ignore(()=>{
      //   this.setStoreInfo();
      // });
    }
  },
  data:{
    storeInfo:{}
  },
  methods: {
    setStoreInfo(){
      let storeInfo = App.StoreH.storeInfo||{};
      console.log('storeInfo',storeInfo)
      this.setData({
        storeInfo
      })
    },
    naviBack() {
      WxApi.navigateBack({
        delta: 1
      })
    }
  }
}))