var app = getApp();
var amapFile = require('../../../common/support/libs/amap-wx/amap-wx.js');
import coordtransform from "../../../common/support/libs/map/index.js";
import SG from "../../../common/helper/handle/shopGuideHandle.js"
Page(app.BP({
    data: {
        key: 'c290b7e016c85e8f279b2f80018c6fbf',
        brand_info: app.globalData.brand_info,
        longitude: 0,
        latitude: 0,
        statusType: "",
        distance: "10000",
        time: "10000",
        showPanel: false,
        scale: 16,
        curLat: "0",
        curLon: "0",
        isInit: false,
        isInitTime: false,
        includePoints: [],
        loc_f: 0,
        markers: [{
            iconPath: "",
            id: 0,
            latitude: 0,
            longitude: 0,
            width: 0,
            height: 0,
            callout: {
                content: "",
                // bgColor:"#000",
                // color:"#fff",
                borderRadius: 10,
                padding: 10,
                display: "ALWAYS",
                textAlign: "left",
            }
        }],
        polyline: [],
        controls: [{
            id: 1,
            iconPath: '',
            position: {
                left: 10,
                top: 10,
                width: 30,
                height: 30
            },
            clickable: true
        }],
        options: {},
    },
    tap_phone: function (e) {
        let phone = this.options.phone || "";
        if (!phone || phone == "0") {
            app.SMH.showToast({
                title: "没有可拨打的电话号码"
            });
            return;
        }
        wx.makePhoneCall({
            phoneNumber: phone
        });
    },
    onLoad: function (options) {
        let StoreDetailInfo = app.StorageH.get('StoreDetailInfo') || {};
        this.setData({
            StoreDetailInfo
        })
        var bd09togcj02 = coordtransform.bd09togcj02(options.lon, options.lat);
        let initOptions = {
            lat: bd09togcj02[1],
            lon: bd09togcj02[0]
        }
        let icon_url = this.data.brand_info.icon_url;
        let img_goto = icon_url + "micro_mall/left_menu.png";
        let default_icon = app.Conf.default_icon_url;
        let img_phone = default_icon + "/phone.png";
        let img_location = default_icon + "/location.png";
        let img_btn_r = default_icon + "/btn_r.png";
        let img_btn_l = default_icon + "/btn_l.png"; 
        let newOpt = {};
        Object.assign(newOpt, options, initOptions);
        var that = this;
        this.setData({
            options: options,
            img_phone,
            img_location,
            img_goto,
            img_btn_r,
            img_btn_l
        });
        that.Initmap(newOpt);
        getCustomerService.call(this, options);
    },

    onReady: function () {
        var that = this;
        that.getBandGuidePoin();
        // app.getBrandInfo(this, function (info) {
        // });
    },

    onShow() {
        let _this = this;
        wx.getLocation({
            type: 'gcj02',
            success(res) {
                const latitude = res.latitude;
                const longitude = res.longitude;
                _this.setData({
                    curLat: latitude,
                    curLon: longitude
                });
                let points = _this.data.includePoints;
                points.push({
                    longitude: longitude,
                    latitude: latitude
                });
                console.log(points)
                _this.setData({
                    includePoints: points
                });
            }
        });
    },
    /**
     *初始化地图
     */
    Initmap: function (options) {
        console.log(options);
        var that = this;
        var lat = options.lat;
        var lon = options.lon;
        let loc_f = options.loc_f || 0;
        var markers = this.data.markers;
        var brand_guide_url = this.data.brand_info.icon_url + "micro_mall/guide_point.png?123";
        markers[0].width = realMarker.call(that, 32, 39).width;
        markers[0].height = realMarker.call(that, 32, 39).height;
        markers[0].latitude = lat;
        markers[0].longitude = lon;
        markers[0].title = options.store_name;
        // markers[0].title = options.store_name + " (" + options.city + ")";
        markers[0].callout.content = options.store_name;
        markers[0].iconPath = brand_guide_url;
        // console.log('markersmarkers', markers)
        that.setData({
            markers: markers,
            longitude: lon,
            latitude: lat,
            loc_f: loc_f,
            includePoints: [{
                longitude: lon,
                latitude: lat
            }]
        })
        console.log("视野")
        console.log(that.data.includePoints)

    },
    regionchange(e) {},
    markertap(e) {},
    controltap(e) {
        console.log('controltap', e);
        var options = this.data.options;
        var longitude = parseFloat(options.lon);
        var latitude = parseFloat(options.lat);
        var store_name = options.store_name;
        var addr = options.addr;
        console.log('openLocation')
        wx.openLocation({
            latitude: latitude,
            longitude: longitude,
            name: store_name,
            address: addr
        })
    },
    //下载网络图
    getBandGuidePoin() {
        var that = this;
        var brand_info = this.data.brand_info;
        var brand_guide_url = brand_info.icon_url + "micro_mall/guide_point.png";
        var markers = this.data.markers;
        wx.downloadFile({
            url: brand_guide_url,
            success: function (res) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (res.statusCode === 200) {
                    markers[0].iconPath = res.tempFilePath;
                    that.setData({
                        markers: markers
                    })
                }
            }
        })
    },
    toCurrent() {
        this.mapCtx = wx.createMapContext('map');
        this.mapCtx.moveToLocation();
    },
    goTo(e) {
        wx.showLoading({
            title: '加载中',
        });
        let type = e.currentTarget.dataset.type;
        let typeName = type == 'car' ? '驾车' : type == 'walk' ? '步行' : type == 'ride' ? '骑行' : '前行'
        this.setData({
            statusType: type,
            typeName: typeName
        });
        if (this.data.isInit) {
            this.reduce = -10;
        } else {
            this.reduce = 0;
        }
        if (this.data.isInitTime) {
            this.reduceTime = -10;
        } else {
            this.reduceTime = 0;
        }
        this.getPolyline(type);
    },
    toNavigate(e) {
        let lat = parseFloat(this.data.options.lat) || 0;
        let lon = parseFloat(this.data.options.lon) || 0;
        let store_name = this.data.options.store_name || 0;
        wx.openLocation({
            latitude: lat,
            longitude: lon,
            scale: 18,
            address: store_name,
            complete: res => {
                console.log('complete', res)
            },
        })
    },
    drawPolyline(self, color) {
        let that = this;
        let _timer = setTimeout(function () {
            clearTimeout(_timer);
            wx.hideLoading();
        }, 6000)
        return {
            origin: this.data.curLon + ',' + this.data.curLat,
            destination: this.data.longitude + ',' + this.data.latitude,
            success(data) {
                wx.hideLoading();
                var points = [];
                if (data.paths && data.paths[0] && data.paths[0].steps) {
                    var steps = data.paths[0].steps;
                    for (var i = 0; i < steps.length; i++) {
                        var poLen = steps[i].polyline.split(';');
                        for (var j = 0; j < poLen.length; j++) {
                            points.push({
                                longitude: parseFloat(poLen[j].split(',')[0]),
                                latitude: parseFloat(poLen[j].split(',')[1])
                            })
                        }
                    }
                }
                let distance = 0;
                let distance_botm = 0;
                if (Number((data.paths[0].distance / 1000)) < 1) {
                    distance = Number(data.paths[0].distance) + "米";
                    distance_botm = Number(data.paths[0].distance) + "m";
                } else {
                    distance = Number(data.paths[0].distance / 1000) + "千米";
                    distance_botm = Number(data.paths[0].distance / 1000) + "km";
                }
                console.log('points', points)
                self.setData({
                    distance: distance,
                    distance_botm: distance_botm,
                    time: parseInt(data.paths[0].duration / 60) + "分钟 ",
                    polyline: [{
                        points: points,
                        color: color,
                        width: 6,
                        arrowLine: true
                    }],
                    showPanel: true
                });
            }
        }
    },
    getPolyline(_type) {
        var amap = new amapFile.AMapWX({
            key: this.data.key
        });
        var self = this;
        switch (_type) {
            case 'car':
                amap.getDrivingRoute(this.drawPolyline(this, "#0091ff"));
                break;
            case 'walk':
                amap.getWalkingRoute(this.drawPolyline(this, "#1afa29"));
                break;
            case 'ride':
                amap.getRidingRoute(this.drawPolyline(this, "#f8b693"));
                break;
            default:
                return false;
        }
    },
    onTap(e) {
        let dataset = e.currentTarget.dataset || {};
        let type = dataset.type || '';
        if (type == 'location') {
            // let latitude = parseFloat(this.options.lat);
            // let longitude = parseFloat(this.options.lon);
            // this.setData({
            //   latitude,
            //   longitude
            // })
        } else if (type == 'phone') {
            this.tap_phone();
        } else if (type == 'goto') {
            this.toNavigate();
        }
    },
    startmessage(e) {
        SG.startmessage(e);
    },
    completemessage(e) {
        let storeInfo = this.data.storeInfo || {};
        SG.completemessage(e, storeInfo.staffList).then(data => {
            this.contactGuide = this.contactGuide || this.selectComponent("#contactGuide");
            this.contactGuide.initData(data);
        })
    },
    contactCellClick() {
        console.log("chufa");
    }
}))

function realMarker(w, h) {
    let [scale, tranferWidth, tranferHeight] = [0, 0, 0];
    wx.getSystemInfo({
        success(res) {
            scale = (750 / res.windowWidth).toFixed(2);
            tranferWidth = (w / scale).toFixed(2);
            tranferHeight = (h / scale).toFixed(2);
        }
    });
    return {
        width: Math.ceil(tranferWidth),
        height: Math.ceil(tranferHeight)
    };
}

function getCustomerService(options) {
    let select_store_id = options.select_store_id || 0;
    SG.getCustomerService(select_store_id, 0, 1).then(data => {
        console.log("导购信息", data);
        this.setData({
            storeInfo: data.storeInfo || {}
        })
    })
}