import StoreH from "../../../../common/helper/handle/storeHandle";
import WXMAP_SDK from "../../../../common/helper/handle/wxmap-sdk";
const app = getApp();
Page(app.BP({
    data: {
      isLocation: 0,
      storeList: [],
      address: "",
      currStoreId: 0,
      currStoreInfo: {},
      searchStr: "",
      isInit: false,
    },
    page: 0,
    hasMore:true,
    onLoad: function(options) {
        this.setData({
          type: options.type
        })
        console.log('options',options)
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
          this.getStoreList(res).finally(()=>{
            if(!this.data.isInit){
              this.setData({
                isInit: true
              })
            }
          })
        })
    },
    onHide() {
        this.setData({
            isEmpty: false
        })
    },
    onShow() {
      this.checkLoginAsync();
    },
    onReady: function() {},
    initClick(){
      app.SMH.showToast({
        title: "初始化中，请稍后再试"
      })
    },
    getUserInfo(e){
      let data = e && e.detail || {}
      let {afterRegister, isAlreadyGetStore, fromStoreId} = data;
      const showChangeStoreTips = () => {
        app.SMH.showToast({
          title: "授权成功，请重新选择门店",
          duration:3000
        })
      }
      if (isAlreadyGetStore && fromStoreId) {
        console.log("用户已有绑定店铺，将跳转到首页")
        wx.switchTab({url: `/pages/micro_mall/index/index`})
      } else {
        return showChangeStoreTips()
      }
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
          }).catch((e)=>{
            rs({
              ...ops,
              lat: 0,
              lon: 0,
              isLocation: 2
            })
            // this.setData({
            //   isLocation: 2
            // })
            // rj()
          })
        }
      })
    },
    reLocation(){
      if(this.data.isLocation != 0){
        this.setData({ isLocation: 0})
      }
      StoreH.getLocation(true).then(res=>{
        this.options = res;
        this.setData({ 
          isLocation: 1 ,
          address: WXMAP_SDK.locationInfo && WXMAP_SDK.locationInfo.address
        })
        this.page = 0;
        this.getStoreList(res);
      }).catch(e=>{
        this.setData({ 
          isLocation: 1,
        })
        console.log('catch',e);
      })
    },
    syncInput(e){
      console.log("e",e);
      let val = e.detail.value || "";
      if(this.data.searchStr != val){
        this.setData({
          searchStr: val
        })
      }
      console.log(this.data.searchStr);
    },
    search(){
      this.page = 0;
      this.getStoreList(this.options);
    },
    getStoreList(ops){
      let page = this.page || 0;
      page = page + 1;
      return StoreH.getStoreList({
        page: page,
        lon: ops.lon,
        lat: ops.lat,
        provinceName: ops.provinceName || "",
        cityName: ops.cityName || "",
        searchStr: this.data.searchStr || ""
      }).then(e=>{
        console.log('云店getStoreList',e)
        if(e.code){
          this.page = page;
          let data = e.data || {};
          let list = data.list || [];
          let storeList = this.data.storeList || [];
          let currStoreInfo = this.data.currStoreInfo||{},except=-1;
          for(let i = 0; i < list.length; i++){
            list[i].distanceStr = list[i].distance >= 0 ? (list[i].distance).toFixed(2) : '--';
            if(this.data.currStoreId == list[i].storeId){
              this.setData({
                currStoreInfo: list[i]
              })
              except = i;
            }
          }
          if(except >= 0){
            list.splice(except,1);
          }
          storeList = page == 1 ? list : storeList.concat(list);
          this.hasMore = (storeList.length + (currStoreInfo.storeId?1:0)) < data.count ? true : false;
          this.setData({
            storeList: storeList,
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
            wx.reLaunch({
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
