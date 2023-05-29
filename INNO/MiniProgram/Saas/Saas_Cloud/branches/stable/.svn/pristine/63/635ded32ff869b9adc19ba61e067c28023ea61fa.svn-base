import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
import StoreH from "../../../../common/helper/handle/storeHandle.js";
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    changeShipInfo:{
      type:Object,
      value:{},
      observer:function(n,o){
        let isSelfGet = n.isSelfGet || 0;
        let shippingList = this.data.shippingList || [];
        if(isSelfGet == 1){
          shippingList[0].isHide = true;
        }else if(isSelfGet == 2){
          shippingList[1].isHide = true;
        }else{
          shippingList[0].isHide = false;
          shippingList[1].isHide = false;
        }
        let selectShipping = this.data.selectShipping || {};
        if(n.store_id){
          selectShipping.selectIndex = 1;
          selectShipping.id = n.store_id;
          selectShipping.name = n.store_name;
        }else{
          selectShipping = {
            selectIndex: 2,
          }
        }
        console.log('进来',n,selectShipping)
        this.curChangeShipInfo = n;
        this.setData({
          shippingList: shippingList,
          selectShipping: selectShipping,
        })
       }
    },
  },
  behaviors: [WindowBehaviors],
  /**
   * 组件的初始数据
   */
  data: {
    boxStyle: "opacity:0; transition: opacity 300ms ease-in-out;",
    shippingList:[
      {
        id: 2,
        name:"快递配送"
      },
      {
        id: 1,
        name:"门店自提"
      }
    ],
    selectShipping:{
      selectIndex:2,
    },
  },
  pageLifetimes: {
    show() {
      // console.log('ship show')
      // let select_store = app.StorageH.get("select_store") || {};
      // if (select_store.id) {
      //   select_store.selectIndex = 1;
      //   this.setData({
      //     selectShipping: select_store
      //   })
      // }else{
      //   let curChangeShipInfo = this.curChangeShipInfo || {};
      //   let val = curChangeShipInfo.store_id ? 1 : 2;
      //   let store_name = curChangeShipInfo.store_id ? curChangeShipInfo.store_name : "";
      //   this.setData({
      //     selectShipping: {
      //       selectIndex: val,
      //       name: store_name
      //     }
      //   })
      // }
    }
  },
  ready(){
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({
      ls_icon2,
      ls_icon1
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
      });
      app.StorageH.remove("select_store");
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
      });
      return 300;
    },
    changeWay(e){
      let dataset = e.currentTarget.dataset || {};
      if (dataset.id == 2){
        this.setData({
          "selectShipping.selectIndex": dataset.id
        })
      }else{
        let id = StoreH.storeId;
        // let curChangeShipInfo = this.curChangeShipInfo || {};
        // curChangeShipInfo.store_id = id; 
        this.setData({
          "selectShipping.selectIndex": dataset.id,
          "selectShipping.id": id,
        })
        // let curChangeShipInfo = this.curChangeShipInfo || {};
        // console.log("curChangeShipInfo", curChangeShipInfo)
        // wx.navigateTo({
        //   url: `/pages/micro_mall/stores/store_nav?type=selectByCart&select_store_id=${curChangeShipInfo.store_id}&loc_f=0&rec_id=${curChangeShipInfo.rec_id}`,
        // })
      }
      
    },
    getChange(){
      changeCartShippingWay.call(this)
    }
  }
}))
function changeCartShippingWay(){
  let curChangeShipInfo = this.curChangeShipInfo; 
  if (!curChangeShipInfo.rec_id) {
    app.SMH.showToast({
      title:"无效购物车id"
    });
    return;
  }
  let selectShipping = this.data.selectShipping;
  //没有切换，不请求
  console.log("curChangeShipInfo", curChangeShipInfo);
  console.log("selectShipping", selectShipping);
  if ((curChangeShipInfo.store_id && curChangeShipInfo.store_id == selectShipping.id && selectShipping.selectIndex == 1) || (!curChangeShipInfo.store_id && selectShipping.selectIndex == 2)){
    this.dismiss();
    console.log('return',curChangeShipInfo,selectShipping)
    return;
  }
  return app.CL_GoodsApi.changeCartStorageShippingWay({
    data:{
      "recId": curChangeShipInfo.rec_id,
      "selfGet": selectShipping.selectIndex,
      // "storeId": selectShipping.selectIndex == 1 ? selectShipping.id : 0,
      // brandCode: app.Conf.BRAND_CODE,
      // userToken: app.LM.userKey
    },
    other:{
      isShowLoad: true
    }
  }).then(res=>{
    if(res.code == 1){
      this.dismiss();
      app.SMH.showToast({
        title: "修改成功"
      })
      this.triggerEvent("changeCallback")
      return Promise.resolve(res);
    }
    app.SMH.showToast({
      title: res.msg
    })
    return Promise.reject();
  })
}
