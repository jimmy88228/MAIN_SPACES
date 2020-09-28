// pages/component/indexHead/storesForA.js
import ScanH from "../../../helper/handle/scanHandleParams"
import StrH from "../../../support/utils/string-util"
const app = getApp();
import WxApi from "../../../helper/wx-api-helper.js";
Component(app.BTAB({
    properties: {
        showStoresA: {
            type: Boolean,
            value: false
        },
        top:{
            type: Number,
            value:0,
          }
    },
    data: {
        // brand_name: app.Conf.brand_name || '',
        store_name: '',
        btn_loading: false,
    },
    ready(){
        let default_scan = this.data.brand_info.default_icon_url + "default_scan.png";
        this.setData({default_scan})
    },
    methods: {
        onShowFn(loc_obj = {}) {
            let that = this;
            let search_url = this.data.brand_info.icon_url + "micro_mall/search_gray.png";
            let stores_a_logo = this.data.brand_info.icon_url + "micro_mall/stores_a_logo.jpg";
            let location_down = this.data.brand_info.icon_url + "micro_mall/location_down.png";
            this.setData({
                search_url: search_url,
                stores_a_logo: stores_a_logo,
                location_down: location_down,
            });
            checkStoresFirst.call(this, stores_a_logo);
            getMemeberBelongStore.call(this, loc_obj);
        }, 
        handle_search() {
            wx.navigateTo({
                url: '/pages/micro_mall/search/search_goods',
            })
        },
        handle_location() {
            if(btn_load_fn.call(this)){return}
            btn_load_fn.call(this, true);
            let that = this;
            let type = false;
            app.AS.checkAuthorize('scope.userLocation', function(e) {
                type = true;
                locationCallBack.call(that, type);
            }, function(e) {
                console.log('无地理授权');
                app.SMH.showToast({
                    title: "无法获取定位信息"
                })
                btn_load_fn.call(that,false);
            }, );
        },
        scan(e){
          ScanH.scanAction.call(this,result => {
            scanAction.call(this, result);
          });
        },
    },
}))

function getMemeberBelongStore(loc_obj = {}) {
    let lat = loc_obj.lat || 0;
    let lon = loc_obj.lon || 0;
    let isUseLocation = loc_obj.isUseLocation || 0;
    app.UserApi.getMemeberBelongStore({
        params: {
            lat,
            lon,
            isUseLocation,
            userToken: app.LM.userToken,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: false
        }
    }).then(res => {
        this.triggerEvent('getStoreMsg');
        if (res.code == 1) {
            this.setData({
                store_name: res.data && res.data.store_name
            })
        }
    })
}

function checkStoresFirst(url) {
    let that = this;
    if (url) {
        return WxApi.getImageInfo({
            src: StrH.changeHttp.call(that, url)
        }).then(res => {
            let w_val = (res.width || 0);
            let h_val = (res.height || 0);
            that.setData({
                width: w_val.toFixed(2) || 0,
                height: h_val.toFixed(2) || 0,
            })
            return Promise.resolve();
        }).catch(e => {
            console.log('getImageError:', e);
            return Promise.resolve();
        })
    }
    return Promise.resolve();
}

function locationCallBack(e = false) {
    let that = this;
    wx.navigateTo({
        url: '/pages/micro_mall/stores/store_nav',
        complete(){
          btn_load_fn.call(that,false);
        }
    })
}


function btn_load_fn(type) {
    if(typeof(type) == "boolean"){
      this.btn_loading = type;
    }else{
      return this.btn_loading;
    }
}
function scanAction(result){
  if(typeof(result) == "string"){
    getGoodsScanInfo.call(this, result);
  }else{
    if(result.goods_id){
      wx.navigateTo({
        url: `/pages/micro_mall/goods/goods_info?goods_id=${result.goods_id||0}&color_id=${result.color_id||0}`,
      })
    }
  }
}
function getGoodsScanInfo(result){
  return app.GoodsApi.getGoodsScanInfo({
    params:{
      brandCode:app.Conf.BRAND_CODE,
      searchVal: result||""
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data||{};
      if(data){
        wx.navigateTo({
          url: `/pages/micro_mall/goods/goods_info?goods_id=${data.goodsId||0}&color_id=${data.colorId||0}`,
        })
      }
      return Promise.resolve(res);
    }
    this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
    this.pageDialog.setTitle("温馨提示");
    this.pageDialog.setTouchCancel(true);
    this.pageDialog.setCentent(res && res.msg || "商品信息异常");
    this.pageDialog.setSingleBtn(
      {
        name: "确定",
        tap:() => {
          this.pageDialog.dismiss();
        }
      }
    )
    this.pageDialog.show();
  })
}
// function scanAction() {
//     if(this.lock){
//       console.log('lock');return
//     };
//     let that = this;
//     that.lock = true;
//     wx.scanCode({
//       success: res => {
//         let msg = res && res.errMsg || "";
//         if (msg.indexOf('ok') != -1) {
//           let result = res.result || "";
//           console.log(res.result,res,"扫码 suc")
//           return app.GoodsApi.getGoodsScanInfo({
//             params:{
//               brandCode:app.Conf.BRAND_CODE,
//               searchVal: result||""
//             },other:{
//               isShowLoad:true
//             }
//           }).then(res=>{
//             if(res.code == 1){
//               let data = res.data||{};
//               if(data){
//                 wx.navigateTo({
//                   url: `/pages/micro_mall/goods/goods_info?goods_id=${data.goodsId||0}&color_id=${data.colorId||0}`,
//                 })
//               }
//               return Promise.resolve(res);
//             }
//             this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
//             this.pageDialog.setTitle("温馨提示");
//             this.pageDialog.setTouchCancel(true);
//             this.pageDialog.setCentent(res && res.msg || "商品信息异常");
//             this.pageDialog.setSingleBtn(
//               {
//                 name: "确定",
//                 tap: function () {
//                   that.pageDialog.dismiss();
//                 }
//               }
//             )
//             this.pageDialog.show();
//           })
//         }
//       },
//       fail: res => {
//         console.log('扫码 fail', res)
//       },
//       complete: res => {
//         that.lock = false;
//         console.log('扫码 complete', res)
//       }
//     })
//   }