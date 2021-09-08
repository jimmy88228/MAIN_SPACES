// pages/component/indexHead/storesForA.js
import ScanH from "../../common/helper/handle/scanHandleParams"
import StrH from "../../common/support/utils/string-util"
const app = getApp();
import WxApi from "../../common/helper/wx-api-helper.js";
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
          app.sysTemConfig('scan_shipping_bg_url').then(res => {
            let img = res && res.Value || "";
            if (img) {
              wx.navigateTo({
                url: '/pages/micro_mall/stores/scan_jump/scan_jump',
              })
            } else {
              ScanH.scanAction().then(result => {
                this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                ScanH.scanActionAnalyse(result,this.pageDialog);
              }); 
            } 
          })
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
                store_name: res.data && res.data.store_name || ""
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