import ScanH from "../../common/helper/handle/scanHandleParams"
import StrH from "../../common/support/utils/string-util"
import WxApi from "../../common/helper/wx-api-helper.js";
import StringUtil from "../../common/support/utils/string-util";

const app = getApp();
const NearByStoreHeight = 60; //附近门店组件的高度
Component(app.BTAB({
  properties: {
    isHide: {
      type: Boolean | Number,
      value: false
    },
    top: {
      type: Number,
      value: 0,
      observer:function(n){
        console.log('headerheader',n)
      }
    },
    needVerify: {
      type: Boolean,
      value: false
    },
  },
  data: {
    style: 0,
    extraTop:0,
    store_name: '',
    btn_loading: false,
    showType:"normal",
    showHeader: true,
    showStoresA: false,
    showNearByStore:true,
    realHeight: StringUtil.transPx(90),
    close_scan_buy: 0,
    close_nearby_store: 0,
  },
  pageLifetimes: {
    show() {
      this.init('storesForA');
    },
    hide() {
      this.unListen();
    }
  },
  lifetimes: {
    attached() {
      this.page = getCurrentPages().pop(); 
      let searchStr = this.data.brand_info.icon_url + "micro_mall/search_icon.png";
      let menuStr = this.data.brand_info.icon_url + "micro_mall/left_menu.png";
      let default_scan = this.data.brand_info.default_icon_url + "default_scan.png";
      this.setData({
        search_url: searchStr,
        menu_url: menuStr,
        default_scan: default_scan
      }); 
    }
  },
  methods: {
    getSearchGoods() {
      wx.navigateTo({
        url: '../search/search_goods',
      })
    },
    toStore() {
      app.AS.checkAuthorize('scope.userLocation', () => {
        wx.navigateTo({
          url: '/pages/micro_mall/stores/store_nav?type=index'
        })
      }, () => {
        app.SMH.showToast({
          title: "无法获取地理位置"
        })
      });
    },
    scan(e) {
      app.sysTemConfig('scan_shipping_bg_url').then(res => {
        let img = res && res.Value || "";
        if (img) {
          wx.navigateTo({
            url: '/pages/micro_mall/stores/scan_jump/scan_jump',
          })
        } else {
          ScanH.scanAction().then(result => {
            this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
            ScanH.scanActionAnalyse(result, this.pageDialog);
          });
        }
      })
    },
    init(type) {
      if (!this.inited) {
        if (type == 'normal') {
          if (this.data.needVerify) {
            goodsSearchStyle.call(this);
          }
        } else if (type == 'storesForA') {
          checkStoresForAFn.call(this);
        }

        this.trimSysConfig(["close_scan_buy", "close_nearby_store"]).then(res => {
          if (res.code == "1"){
            let data = res.data || [];
            let __setData = {};
            data.forEach(item => {
              let {Key, Value} = item || {};
              __setData[Key] = (Value == "1" ? true : false)
            })
            this.setData(__setData);
          }
        })
      }
    },

    storesForALoadData(loc_obj = {}) {
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
      if (btn_load_fn.call(this)) {
        return
      }
      btn_load_fn.call(this, true);
      let that = this;
      let type = false;
      app.AS.checkAuthorize('scope.userLocation', function (e) {
        type = true;
        locationCallBack.call(that, type);
      }, function (e) {
        console.log('无地理授权');
        app.SMH.showToast({
          title: "无法获取定位信息"
        })
        btn_load_fn.call(that, false);
      }, );
    },
    scan(e) {
      app.sysTemConfig('scan_shipping_bg_url').then(res => {
        let img = res && res.Value || "";
        if (img) {
          wx.navigateTo({
            url: '/pages/micro_mall/stores/scan_jump/scan_jump',
          })
        } else {
          ScanH.scanAction().then(result => {
            this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
            ScanH.scanActionAnalyse(result, this.pageDialog);
          });
        }
      })
    },
    unListen() {
      this.storesForAId && app.EB.unListen('storesForA', this.storesForAId);
      this.storesForAId && delete this.storesForAId;
    },
    showNearInit(e){
      let detail = e.detail;
      if(detail == 1){
        this.setData({
          realHeight: this.data.realHeight + StringUtil.transPx(NearByStoreHeight)
        })
        this.triggerEvent('refreshExtraH', this.properties.isHide ? 0 : this.data.realHeight)
      }
    }
  }
}))

function goodsSearchStyle() {
  let params = {
    brandCode: app.Conf.BRAND_CODE
  }
  return app.RunApi.go('GoodsApi', 'goodsSearchStyle', params, {
    diy: true
  }).then(res => {
    if (res.code == 1) {
      let data = res.data;
      if (data) {
        this.setData({
          brandIcon: data.brandIcon || '',
          searchIcon: data.searchIcon || '',
          storeIcon: data.storeIcon || '',
          scanIcon: data.scanIcon || '',
          style: data.styleType || 1
        })
      } else {
        this.setData({
          style: 0
        })
      }
    }
  })
}


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
    this.inited = true;
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
    complete() {
      btn_load_fn.call(that, false);
    }
  })
}

function btn_load_fn(type) {
  if (typeof (type) == "boolean") {
    this.btn_loading = type;
  } else {
    return this.btn_loading;
  }
}

function checkStoresForAFn() {
  let that = this;
  // that.storeA = that.storeA || that.selectComponent('#stores_a_id') || {};
  that.storesForAId = app.EB.listen('storesForA', (res) => {
    console.log('千店一面回调', res);
    if (res && res.storesForAOpen == 1) {
      let data = res && res.data || {};
      that.setData({
        showType: "storesForA",
        showStoresA: true,
        showHeader: false,
      });
      wx.nextTick(() => {
        that.storesForALoadData(data);
      });
    } else {
      // console.log('千面未开启或用户未注册');
      // this.indexHeader = this.indexHeader || this.selectComponent('#indexHeader');
      // this.indexHeader.init();
      that.checked = true;
      that.init('normal')
      that.setData({
        showType: "normal",
        showHeader: true,
        showStoresA: false,
      })
    }
  });
}