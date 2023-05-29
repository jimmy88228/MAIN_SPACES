// components/pop/adsPop.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
import SG from "../../../common/helper/handle/shopGuideHandle.js";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    bindStoreId:{
      type:Number,
      value:0
    },
    bindStaffId: {
      type: Number,
      value: 0
    },
    setStyle:{
      type:String,
      value:""
    }
  },
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    onlyShowSpecificStaff: false,
    staffInfo: {},
    storeInfo: {}
  },
  pageLifetimes: {
    show() {
      getChangeStore.call(this);
    },
    hide() {

    }
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transform: translateY(0);transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transform: translateY(100%);transition: all 300ms ease-in-out;"
      });
      app.StorageH.remove("select_store")
      return 300;
    },
    initData(optionsData = {}){ // optionsData-> onlyShowSpecificStaff: 只显示一个特定的导购 , staffInfo: 特定导购的信息 , storeInfo: 导购列表信息
      let {onlyShowSpecificStaff = false, staffInfo, storeInfo} = optionsData;
      if (onlyShowSpecificStaff && staffInfo) { // 只显示一个特定的导购
        this.setData({onlyShowSpecificStaff, staffInfo});
        this.show();
      } else { // 一般情况：显示导购列表
        this.setData({
          storeInfo: storeInfo || [],
          onlyShowSpecificStaff: false,
          staffInfo: {}
        })
        this.show();
      }
    },
    startmessage(e){
      // console.log("startmessage",e);
      SG.startmessage(e);
    },
    completemessage(e){
      let storeInfo = this.data.storeInfo || {};
      console.log("completemessage", e)
      SG.completemessage(e, storeInfo.staffList).then(data=>{
        this.triggerEvent("contactCallBack", data);
      })
    },
    changeStore(){
      let storeInfo = this.data.storeInfo || {};
      wx.navigateTo({
        url: '/pages/micro_mall/stores/store_nav?type=contactStaff&no_data_text=附近暂无可选店铺&select_store_id=' + storeInfo.storeId || 0,
      })
    },
    _noFn() {},
  }
}))
function getChangeStore(){
  let storeInfo = this.data.storeInfo || {};
  let select_store = app.StorageH.get("select_store") || {};
  if (storeInfo.storeCode && select_store.id && storeInfo.storeId != select_store.id){
    let bindStaffId = this.properties.bindStaffId || 0;
    SG.getCustomerService(select_store.id, bindStaffId, 0).then(data => {
      this.setData({
        storeInfo: data.storeInfo,
      })
      this.show();
    })
  }
}