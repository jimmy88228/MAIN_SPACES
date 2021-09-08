import ScanH from "../../common/helper/handle/scanHandleParams"
let app = getApp();
Component(app.BTAB({
    properties: {
      top:{
        type: Number,
        value:0,
      },
      needVerify:{
        type:Boolean,
        value:false
      }
    },

  data: {
    style: 0
  },
  ready() {
    let searchStr = this.data.brand_info.icon_url + "micro_mall/search_icon.png";
    let menuStr = this.data.brand_info.icon_url + "micro_mall/left_menu.png";
    let default_scan = this.data.brand_info.default_icon_url + "default_scan.png";
    this.setData({
      search_url: searchStr,
      menu_url: menuStr,
      default_scan:default_scan
    });
    if(!this.data.needVerify){
      this.init();
    }
  },
  /**
   * 组件的方法列表
   */
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
            ScanH.scanActionAnalyse(result,this.pageDialog);
          }); 
        } 
      })
    },
    init() {
      goodsSearchStyle.call(this);
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