// pages/micro_mall/bargain/goods/goods_detail.js
let WxParse = require("../../../../wxParse/wxParse.js");
import Utils from "../../../../support/utils/utils";
import countDownTextHelp from "../../../../helper/handle/countDownTextHelp.js";
import MyDate from '../../../../support/utils/date-util.js'; 
import {
  CountDown
} from "../../../../helper/manager/timer-manager.js";
const PAGE_TYPE = "BARGAIN_GOODS";
var app = getApp();
Page(app.BP({
    data: {
        show_msg_pop: false,
        isAutoplay: true,
        isCircular: true,
        isIphoneX: app.SIH.isIphoneX,
        isHidden: true,
        // sku
        colorIndex: 0,
        sizeIndex: -1,
        skuPrice: {
            colorName: '',
            sizeName: '',
            productSn: '',
            // productId为0没选择完整规格，为-1是没库存
            productId: 0,
            minBottomPrice: '',
            maxBottomPrice: '',
            minMarketPrice: '',
            maxMarketPrice: ''
        },
        loadSku: false,
        // isLogin: app.LM.isLogin
    },
    onLoad: function (options) {
        this.activityId = options.activityId;
        this.loading = false;
        let home = this.data.brand_info.icon_url + "micro_mall/bargain/bargainDetailHome.png";
        let rule_img = this.data.brand_info.icon_url + "micro_mall/rule.png";
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png";
        let color = this.data.brand_info.style.bargain_color.from_color;
        let l_color = app.getColor(color, -30, -30, -30, 1) || '';
        this.setData({
            home,
            rule_img,
            server_close,
            l_color
        });
        // 计算scroll-view高度
        calcHeight.call(this);
    },
    onShow: function () {
        listen.call(this);
    },
    onHide() {
        stopCountDown.call(this);
        // 初始化
        WxParse.wxParse('article', 'html', '', this, 0);
    },
    onUnload() {
        stopCountDown.call(this);
        // 初始化
        WxParse.wxParse('article', 'html', '', this, 0);
    },
    onShareAppMessage: function (res) {
      let goods_info = this.data.goods_info || {};
      let activity_info = this.data.activity_info || {};
      console.log('activity_infoactivity_info',activity_info)
      let img = activity_info.sharePicture || goods_info.imglist && goods_info.imglist[0] && goods_info.imglist[0].img_url||""
    //   let img = goods_info.imglist && goods_info.imglist[0] && goods_info.imglist[0].img_url||""
      return {
        isCustom:true,
        shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
        title: activity_info.shareTitle|| goods_info.goodsName || "",
        path: `/pages/micro_mall/bargain/goods/goods_detail?activityId=${this.activityId}`,
        imageUrl: img, 
      }
    },
    preView(e) {
      let dataset = e.currentTarget.dataset || {};
      let goods_info = this.data.goods_info || {};
      let imgList = goods_info.imgList;
      let imgs = [];
      for (let i = 0; i < imgList.length; i++) {
        imgs.push(imgList[i].img_url)
      }
      wx.previewImage({
        current: dataset.url,
        urls: imgs,
      })

    },
    /**
     * 页面弹框
     */
    showMsgPop: function (e) {
        this.switchStylePop(e, true);
    },
    hidePop(e){
        setAnim.call(this);
    },
    switchStylePop(e, show) {
        var key = '';
        var show_pop, pop_animate;
        if (e.currentTarget) {
            key = e.currentTarget.dataset.key;
        } else {
            key = e;
        }
        show_pop = "show_" + key;
        pop_animate = key + "_animate";

        if (show) {
            this.setData({
                [show_pop]: true,
                [pop_animate]: true
            });
        } else {
            this.setData({
                [pop_animate]: false
            })
            let _timer3 = setTimeout(() => {
                clearTimeout(_timer3);
                this.setData({
                    [show_pop]: false
                });
            }, 350);
        }
    },
    getSku(e) {
        // this.switchStylePop(e, true);
        setAnim.call(this,"show");
        resetData.call(this);
        controlClick.call(this, () => {
            getHagglePriceActivity.call(this);
        });
    },
    toHome: function () {
        wx.switchTab({
            url: "/pages/micro_mall/index/index",
        });
    },
    selectColor(e) {
        let colorIndex = e.currentTarget.dataset.index;
        this.setData({
            colorIndex
        });
        if (this.data.skuDetals.attr_count === 1) {
            calcPrice.call(this, false, 1, colorIndex);
        }
        if (this.data.skuDetals.attr_count === 2) {
            this.setData({
                sizeList: this.data.sizeList
            });
            calcPrice.call(this, false, 2, colorIndex, this.data.sizeIndex);
        }
    },
    selectSize(e) {
        let sizeIndex = e.currentTarget.dataset.index;
        this.setData({
            sizeIndex
        });
        calcPrice.call(this, false, 2, this.data.colorIndex, sizeIndex);
    },
    confirmStandard(e) {
        if (this.data.skuPrice.productId == 0) {
            this.switchStylePop(e, true);
            app.SMH.showToast({
                "title": "请选择完整规格"
            });
        } else if (this.data.skuPrice.productId == -1) {
            this.switchStylePop(e, true);
            app.SMH.showToast({
                "title": "暂无库存"
            });
        } else {
            // this.switchStylePop(e, false);
            controlClick.call(this, () => {
                createBargain.call(this);
            });
        }
    },
    toBuy() {
        let goodsId = this.data.goods_info.goodsId;
        wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${goodsId}`
        });
    },
    jumpToDetails(e) {
        let userActivityId = e.currentTarget.dataset.userActivityId;
        wx.navigateTo({
            url: `/pages/micro_mall/bargain/bargain/bargain_detail?userActivityId=${userActivityId}`
        });
    },
    getShare() {
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      this.shareModule.checkIfStaffDstb();
    },
    chooseShareType(data) {
      let goods_info = this.data.goods_info;
      let imglist = this.data.goods_info.imgList || [];
      let detail = data.detail;
      let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
      let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
      goods_info.goods_name = goods_info.goodsName;
      goods_info.max_price = goods_info.maxBottomPrice;
      goods_info.min_price = goods_info.minBottomPrice;
      goods_info.market_price = goods_info.minMarketPrice;
      goods_info.min_market_price = goods_info.minMarketPrice;
      goods_info.max_market_price = goods_info.maxMarketPrice;
      goods_info.price = goods_info.minBottomPrice;
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      let allData = {
        info: {
          imgUrl: imglist[0].img_url,
          goodsInfo: goods_info,
          opKind: opKind
        },
        scene: {
          "shareType": shareType,
          "activityId": this.activityId,
          'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
        },
        draw: {
          template: "goods"
        },
      }
      this.staffInfo = detail.staffInfo
      this.setData({
        allData: allData
      })
      this.shareImg.show();
    },
    checkIfStaffDstbCallBack(data) {
      let detail = data.detail;
      this.staffInfo = detail.staffInfo
    },
}))
function loadData() {
    return app.BargainApi.getHagglePriceActivityDetail({
        params: {
            activityId: this.activityId || 0,
            userToken: app.LM.userKey,
            brandCode: app.Conf.BRAND_CODE
        },
        extraData: {
            isShowLoad: true
        }
    }).then(res => {
        let data = res.data;
        if (res.code == 1) {
            let activityInfo = {
                canJoin: data.canJoin || false,
                joins: data.joins || 0,
                ruleDescription: data.ruleDescription || '',
                userActivityId: data.userActivityId,     //该会员正在进行的砍价ID,可使用此ID跳转到正在进行的砍价详情页面
                validityHours: data.validityHours || 0 ,
                preLimitBuyTimes: data.preLimitBuyTimes,
                state:data.status||0,
                stime:data.fromTime||'',
                etime:data.toTime||'',
                serverTime:data.serverTime||'',
                sharePicture:data.sharePicture||"",
                shareTitle:data.shareTitle||"",
                acName:"砍价",
            };
            let goodsInfo = {
                goodsDesciption: data.goodsDesciption || '', //商品详情
                goodsId: data.goodsId,
                goodsName: data.goodsName,
                goodsSn: data.goodsSn,
                imgList: data.imgList || [], //banner图
                maxBottomPrice: data.maxBottomPrice,
                minBottomPrice: data.minBottomPrice,
                maxMarketPrice: data.maxMarketPrice,
                minMarketPrice: data.minMarketPrice
            }
            if(activityInfo.state){
                setDownTime.call(this,activityInfo);
            }
            this.addPageLog(null,this.route,{
              activityId: this.activityId||0,
              goods_id: goodsInfo.goodsId||0
            })
            this.setData({
                activity_info: activityInfo,
                goods_info: goodsInfo,
                isHidden: false
            });
            WxParse.wxParse('article', 'html', goodsInfo.goodsDesciption, this, 0);
            return Promise.resolve(data);
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
            return Promise.reject(res);
        }
    });
}

// 获取sku数据
function getHagglePriceActivity() {
    if (!this.loading) {
        this.loading = true;
        return app.BargainApi.getHagglePriceActivityGoodsDetail({
            params: {
                activityId: this.activityId || 0,
                brandCode: app.Conf.BRAND_CODE
            },
            extraData: {
                isShowLoad: true
            }
        }).then(res => {
            let data = res.data;
            if (res.code == 1) {
                this.setData({
                    skuDetals: {...data},
                    loadSku: true
                });
                calcStandard.call(this);
                return Promise.resolve(data);
            } else {
                app.SMH.showToast({
                    "title": res.msg
                });
                return Promise.reject(res);
            }
        }).finally(() => {
            this.loading = false;
        });
    }
}

function createBargain() {
    return app.BargainApi.createUserHagglePriceActivity({
        data: {
            activityId: this.activityId || 0,
            productId: this.data.skuPrice.productId,
            clientSessionId: app.LgMg.channel &&  app.LgMg.channel.clientSessionId || '',
            brandCode: app.Conf.BRAND_CODE,
            userToken: app.LM.userKey
        },
        extraData: {
            isShowLoad: true
        }
    }).then(res => {
        let userActivityId = res.data;
        if (res.code == 1) {
            setAnim.call(this);
            wx.navigateTo({
                url: `/pages/micro_mall/bargain/bargain/bargain_detail?userActivityId=${userActivityId}`,
            });
        } else {
            app.SMH.showToast({
                "title": res.msg
            });
        }
    });
}


function calcStandard() {
    let standards = {...this.data.skuDetals};
    let colorLength = standards.colorList && standards.colorList.length || 0;
    let attrCount = standards.attr_count;
    if (colorLength > 0) {
        let colorList = standards.colorList.map(item => {
            return Object.assign({}, {
                colorName: item.colorName,
                goodsId: item.goodsId,
                goodsNumber: item.goodsNumber,
                isEnabled: item.isEnabled,
                maxBottomPrice: item.maxBottomPrice,
                maxMarketPrice: item.maxMarketPrice,
                minBottomPrice: item.minBottomPrice,
                minMarketPrice: item.minMarketPrice
            });
        });
        let sizeList = standards.colorList.map(item => item.sizeList) || [];
        this.setData({
            colorList,
            sizeList
        });
        if (attrCount === 1) {
            calcPrice.call(this, false, 1);
        } else if (attrCount === 2) {
            calcPrice.call(this, true, 2);
        }
    }
}
// 
// isDefault(是否默认状态),attrCount(当前几个规格),colorIndex(颜色的索引值),sizeIndex(尺码的索引值)
// 
function calcPrice(isDefault = false, attrCount, colorIndex = 0, sizeIndex = 0) {
    let defaultSizeItem = {};
    let selectFirst = false;  //是否只选中第一个规格
    if (attrCount === 1) {
        defaultSizeItem = this.data.sizeList[colorIndex][0];
        this.setData({
            "skuPrice.colorName": this.data.colorList[colorIndex].colorName,
            "skuPrice.productSn": defaultSizeItem.productSn
        });
        let allClosed = this.data.colorList.every(item => item.isEnabled == false);
        if (defaultSizeItem.isEnabled) {
            this.setData({
                "skuPrice.productId": defaultSizeItem.productId
            });
        } else if (allClosed) {
            this.setData({
                "skuPrice.productId": -1
            });
        }
    } else {
        if (!isDefault && sizeIndex >= 0) {
            defaultSizeItem = this.data.sizeList[colorIndex][sizeIndex];
            this.setData({
                "skuPrice.sizeName": defaultSizeItem.isEnabled ? defaultSizeItem.sizeName : '',
                "skuPrice.productSn": defaultSizeItem.isEnabled ? defaultSizeItem.productSn : '',
                "skuPrice.productId": defaultSizeItem.isEnabled ? defaultSizeItem.productId : 0
            });
        } 
        this.setData({
            "skuPrice.colorName": this.data.colorList[colorIndex].colorName
        });
        if (!isDefault && sizeIndex < 0) selectFirst = true;
    }
    this.setData({
        "skuPrice.minBottomPrice": isDefault || selectFirst ? this.data.skuDetals.minBottomPrice : defaultSizeItem.bottomPrice,
        "skuPrice.maxBottomPrice": isDefault || selectFirst ? this.data.skuDetals.maxBottomPrice : defaultSizeItem.bottomPrice,
        "skuPrice.minMarketPrice": isDefault || selectFirst ? this.data.skuDetals.minMarketPrice : defaultSizeItem.marketPrice,
        "skuPrice.maxMarketPrice": isDefault || selectFirst ? this.data.skuDetals.maxMarketPrice : defaultSizeItem.marketPrice
    });
}

function calcHeight() {
    let [scale, tranferHeight, height] = [0, 0, 0];
    scale = Math.ceil(750 / wx.getSystemInfoSync().windowWidth);
    tranferHeight = 34 * scale;
    height = this.data.isIphoneX ? 110 + tranferHeight : 110;
    this.setData({
        interactHeight: height
    });
}

function resetData() {
    let skuPrice = {
        colorName: '',
        sizeName: '',
        productSn: '',
        productId: 0,
        minBottomPrice: '',
        maxBottomPrice: '',
        minMarketPrice: '',
        maxMarketPrice: ''
    };
    this.setData({
        skuPrice,
        colorIndex: 0,
        sizeIndex: -1,
        loadSku: false
    });
}

let controlClick = Utils.debounce(fn => {
    fn();
}, 400);

function listen() {
    this._checkUserLogin().finally(()=>{
        let scene = this.options.scene;
        if (scene) {
            app.SHP.getParams(["activityId"]).then((params) => {
                this.options = {
                ...this.options,
                ...params
                }
                this.activityId = params.activityId || 0;
                loadData.call(this);
            })
        } else {
            loadData.call(this);
        }
    })
}

function setDownTime(activityInfo={},params={}){
    activityInfo = activityInfo ||{};
    let state = activityInfo.state || 0;
    let startTime = MyDate.parse(activityInfo.serverTime || '') || '';
    let endTime = 0;
    let check = checkTime.call(this,activityInfo); //返回倒计时文案对象
    if (check.timeDown) {
        endTime = check.etime || 0;
    }
    // console.log(state,'开始 结束时间', startTime,endTime);
    stopCountDown.call(this);
    if(!startTime || !endTime)return
    stopCountDown.call(this);
    this.countDown = new CountDown(startTime);
    this.countDown.setTarget(endTime);
    setTime.call(this, this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
        if (e.value <= 0) {
            stopCountDown.call(this); 
            statusUpdate.call(this); 
        }
        setTime.call(this, e);
        });
    }
}

function checkTime(activityInfo={}) {
    activityInfo = activityInfo || {};
    let result = countDownTextHelp.getTimeMsg.call(this, activityInfo);
    result = result || {};
    this.setData({
      timeText: result.text || '',
      time: result.time || ''
    })
    // console.log('time文案文案', result, this.data.timeText);
    return result
}


function stopCountDown() {
    if (this.countDown) {
        this.countDown.stop();
    }
}

function setTime(e) {
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    this.setData({
        time: e.format(day > 0 ? "dd天 HH:mm:ss" : "HH:mm:ss")
    }); 
} 

function statusUpdate(){
    loadData.call(this);
}

function setAnim(type){
    this.specPop = this.specPop || this.selectComponent('#specPop') ;
    if(type == "show"){
      this.style_select_show = true;
      this.specPop.setShow(); 
    }else {
      this.style_select_show = false;
      this.specPop.setHide();
    }
  }
  