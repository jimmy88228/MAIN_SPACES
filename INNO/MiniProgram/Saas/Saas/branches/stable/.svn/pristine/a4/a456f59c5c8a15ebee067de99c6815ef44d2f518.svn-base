// components/indexHead/storesForA.js
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
        top: {
            type: Number,
            value: 0,
        }
    },
    data: {
        // brand_name: app.Conf.brand_name || '',
        store_name: '',
        btn_loading: false,
        showHeader: true,
        showStoresA: false,
    },
    lifetimes: {
        attached() {
            this.page = getCurrentPages().pop();
            console.log('pagepage', page);
            let default_scan = this.data.brand_info.default_icon_url + "default_scan.png";
            this.setData({
                default_scan
            })
        }
    },
    pageLifetimes: {
        show() {
            this.init();
        },
        hide() {
            this.unListen();
        }
    },
    methods: {
        init(type) {
            if (!this.inited) {
                if (type == 'normal') {
                    
                } else if (type == 'storesForA') {
                    checkStoresForAFn.call(this);
                }
            }
        },
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
            app.EB.unListen('storesForA', this.storesForAId);
        }
    },
}))
 