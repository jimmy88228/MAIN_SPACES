import coordtransform from "../../../../libs/map/index.js";
import StoreH from "../../../../helper/handle/storeHandle";
import WXMAP_SDK from "../../../../helper/handle/wxmap-sdk";
const app = getApp();
Page(app.BP({
    data: {
      isLocation: 0,
      storeList: [],
      address: "",
      currStoreId: 0,
      currStoreInfo: {}
    },
    page: 0,
    hasMore:true,
    onLoad: function(options) {
        this.setData({
          type: options.type
        })
        this.beforeHandle(options).then(res=>{
          if(this.data.isLocation != res.isLocation){
            this.setData({
              isLocation: res.isLocation,
              address: WXMAP_SDK.locationInfo && WXMAP_SDK.locationInfo.address,
              currStoreId: StoreH.storeId
            })
          }
          this.options = res;
          this.page = 0;
          this.getStoreList(res);
        })
    },
    onHide() {
        this.setData({
            isEmpty: false
        })
    },
    onShow() {
      this._checkUserLogin();
    },
    onReady: function() {},
    getUserInfo(){
      app.SMH.showToast({
        title: "授权成功，请选择进入门店！"
      })
    },
    beforeHandle(ops){
      return new Promise((rs, rj)=>{
        if(ops.lat && ops.lon){
          rs({
            ...ops,
            isLocation: 1
          });
        } else {
          return StoreH.getLocation().then(res=>{
            rs({
              ...res,
              isLocation: 1
            });
          }).catch(()=>{
            this.setData({
              isLocation: 2
            })
            rj()
          })
        }
      })
    },
    reLocation(){
      if(this.data.isLocation != 0){
        this.setData({ isLocation: 0})
      }
      StoreH.getLocation().then(res=>{
        this.options = res;
        this.setData({ 
          isLocation: 1 ,
          address: WXMAP_SDK.locationInfo && WXMAP_SDK.locationInfo.address
        })
        this.page = 0;
        this.getStoreList(res);
      })
    },
    getStoreList(ops){
      let page = this.page || 0;
      page = page + 1;
      StoreH.getStoreList({
        page: page,
        lon: ops.lon,
        lat: ops.lat,
        provinceName: ops.provinceName || "",
        cityName: ops.cityName || ""
      }).then(e=>{
        if(e.code){
          this.page = page;
          let data = e.data || {};
          let list = data.list || [];
          let storeList = this.data.storeList || [];
          this.hasMore = storeList.length < data.count ? true : false;
          let currStoreInfo = {};
          for(let i = 0; i < list.length; i++){
            list[i].distanceStr = list[i].distance ? (list[i].distance).toFixed(2) : '--';
            if(this.data.currStoreId == list[i].storeId){
              currStoreInfo = list[i];
            }
          }
          storeList = page == 1 ? data.list : storeList.concat(data.list);
          this.setData({
            storeList: storeList,
            currStoreInfo: currStoreInfo
          })
        }
      })
    },
    onReachBottom(){
      if(this.hasMore){
        this.getStoreList(this.options);
      } else {
        app.SMH.showToast({
          title: "已经到底了！"
        })
      }
    },
    changeStore(e){
      let dataset = e.currentTarget.dataset || {};
      if(!dataset.storeId) return;
      StoreH.changeVisitStore({
        ...this.options,
        storeId: dataset.storeId
      }).then(data=>{
        if(data.storeId){
          app.SMH.showToast({
            title: "修改成功"
          })
          setTimeout(()=>{
            wx.switchTab({
              url: '/pages/micro_mall/index/index',
            })
          },500)
        }
      }).catch(error=>{
        app.SMH.showToast({
          title: error.msg
        })
      })
    }
}))
