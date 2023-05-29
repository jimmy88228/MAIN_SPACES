// components/indexHead/showNearByStore.js
const app = getApp();
import AS from "../../common/helper/authorize-set";
import WxAPi from "../../common/helper/wx-api-helper"
Component(app.BTAB({
    properties: {},
    data: {
        locate: 0,
        top: app.SIH.navPlace,
    },
    // pageLifetimes: {
    // },
    lifetimes: {
        ready() {
            this.init();
        }
    },
    methods: {
        locate(reset = false) {
            let dstbStaffCode = "";
            if (!this.initBelongStore || reset) {
                app.LM.loginAsync(false).then(() => {
                    let options = wx.getEnterOptionsSync();
                    let query = options.query || {};
                    if (query.scene) {
                        app.SHP.getParams(["staffCode"]).then((params) => {
                            dstbStaffCode = params.staffCode || ""
                            this.getStore(dstbStaffCode);
                        })
                    } else {
                        dstbStaffCode = query.staffCode || "";
                        this.getStore(dstbStaffCode);
                    }
                })
            }
        },
        getStore(dstbStaffCode) {
            locateFnc.call(this, dstbStaffCode).then(res => {
                getUserBelongStoreFnc.call(this, {
                    lat: res.lat,
                    lon: res.lon,
                    dstbStaffCode,
                    isUseLocation: 1
                });
            }).catch(e => {
                getUserBelongStoreFnc.call(this, {
                    lat: 0,
                    lon: 0,
                    dstbStaffCode,
                    isUseLocation: 0
                });
            });
        },
        // onTap(e) {
        //     let type = this.getDataset(e, 'type');
        //     locateFnc.call(this, type).then(res=>{
        //         getUserBelongStoreFnc.call(this,{lat:res.lat,lon:res.lon,dstbStaffCode:'',isUseLocation:1});
        //     });
        // },
        init() {
            return this.trimSysConfig(["nearby_store", "nearby_store_image", "brand_url"]).then(res => {
                if (res.code == "1") {
                    console.log('resres', res)
                    let data = res.data || [];
                    let _data = {};
                    data && data.forEach(item => {
                        let key = item.Key || "";
                        if (key == 'nearby_store') {
                            _data.nearby_store = item && item.Value;
                        } else if (key == 'nearby_store_image') {
                            _data.nearby_store_image = item && item.Value;
                        } else if (key == 'brand_url') {
                            _data.brand_url = item && item.Value;
                        }
                    })
                    this.setData({
                        ..._data
                    })
                    if (_data.nearby_store == 1) {
                        this.triggerEvent('showNearInit', _data.nearby_store)
                        this.nextTick().then(() => {
                            this.locate();
                        })
                    }
                }
            })
        }
    }
}))

function locateFnc(dstbStaffCode) {
    if (app.LM.isLogin || dstbStaffCode) { //已注册的用户 || 分销员途径进来的 -- 不需要定位坐标
        return Promise.reject();
    }
    if (this.data.locate == 0) {
        let that = this;
        return new Promise((rs, rj) => {
            AS.checkAuthorize("scope.userLocation").then(res => {
                WxAPi.getLocation({
                    type: 'gcj02',
                }).then(res => {
                    let lat = res.latitude;
                    let lon = res.longitude;
                    setLocate.call(that, 1)
                    rs({
                        lat,
                        lon
                    });
                }).catch(e => {
                    console.log('catch', e)
                    setLocate.call(that, -1);
                    rj(e)
                })
            }).catch(e => {
                console.log('catch', e)
                setLocate.call(that, -1);
                rj(e)
            });
        })
    } else {
        rj()
    }
}

function setLocate(value) {
    this.setData({
        locate: value
    })
}

// function jump() {
//     wx.navigateTo({
//         url: '/pages/micro_mall/stores/store_nav?type=nearByName',
//     })
// }

function getUserBelongStoreFnc(params) {
    return app.RunApi.go('UserApi', 'getUserBelongStore', params || {}).then(res => {
        let data = res.data || {};
        this.initBelongStore = true;
        this.setData({
            nearByName: data.store_name || ""
        })
    })
}