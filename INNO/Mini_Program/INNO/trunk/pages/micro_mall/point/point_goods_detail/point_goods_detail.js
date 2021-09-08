import MyDate from '../../../../common/support/utils/date-util.js';
import {
    CountDown
} from "../../../../common/manager/timer-manager.js";
import StrH from "../../../../common/helper/handle/strHandle.js";
import AllStaffApply from "../../../../common/helper/all-staff-apply";
const app = getApp();
const WxParse = require("../../../../components/thirdParty/wxParse/wxParse.js");
const PAGE_TYPE = "POINT_GOODS";
Page(app.BP({
    data: {
        isLogin: app.LM.isLogin,
        iconUrl: app.Conf.ICON_URL,
        isIphoneX: app.SIH.isIphoneX,
        brand_info: app.globalData.brand_info,
        //
        allData: {},
        productList: {},
        baseInfo: {},
        productList: [], //需要显示的规格（值）列表
        productSpecList: [], //尺码和规格值的绑定信息列表
        specList: [], //尺码信息列表,
        cartNum: 0,
        isReady: true,
        goodsDetails: {},
        goodsService: [],
        msg_pop_animate: false,
        style_select_show: 'hide',
        select_goods: { //选择的商品
            productInfo: {}, //当前商品信息
            goods_id:0,
            select_color: "", //选择颜色对象
            select_size: "", //选择尺码对象
            select_color_id: 0, //选择颜色id
            select_size_id: 0, //选择尺码id
            select_goods_count: 1, //选择商品数量
            shippingType:2,
            storeId:0,
            selfGet:0
        },
    },
    isLoading: false,
    onLoad: function(options) {
        app.StorageH.remove('select_store');
        this.options = options;
        let bInfo = this.data.brand_info || {};
        let g_add = bInfo.icon_url + "micro_mall/shopping_cart/g_add.png";
        let g_add_none = bInfo.icon_url + "micro_mall/shopping_cart/g_add_none.png";
        let g_reduce = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
        let g_reduce_none = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
        let detail_share = bInfo.icon_url + "micro_mall/detail_share.png";
        let g_home = bInfo.icon_url + "micro_mall/g_home.png";
        let rule_img = bInfo.icon_url + "micro_mall/rule.png";
        let server_close = bInfo.icon_url + "micro_mall/server_close.png";
        let p_color = bInfo.style.p_color || {};
        this.setData({
            p_color: p_color,
            detail_share: detail_share,
            g_home: g_home,
            g_add: g_add,
            g_add_none: g_add_none,
            g_reduce: g_reduce,
            g_reduce_none: g_reduce_none,
            rule_img: rule_img,
            server_close: server_close
        });
        let _this = this;
        // this.userInfo = wx.getStorage('userInfo');
        if (!app.globalData.addr_id) {
            wx.getStorage({
                key: 'userInfo',
                success: function(res) {
                    _this.addressId = (res.data.selectAddr && res.data.selectAddr.address_id) || '';
                    app.globalData.addr_id = (res.data.selectAddr && res.data.selectAddr.address_id) || '';
                },
                fail: function(res) {
                    _this.userInfo = ''
                }
            })
        }
    },

    onReady: function() {
        //   console.log('颜色', this.data.brand_info)
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
        // this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        // this.pageDialog.setCentent("您已兑换过此优惠券");
        // this.pageDialog.show();
        // this.pageDialog.setSingleBtn(() => {
        //   this.pageDialog.dismiss();
        // });
    },

    onShow: function() {
        let options = this.options || {};
        if (options.scene) {
          // this.sceneParamsChangeId = app.EB.listen("SceneParamsChange", () => {
          //   let paramsJson = app.PH.paramsJson();
          //   if (paramsJson.mkGoodsId) {
          //     this.options.mkGoodsId = paramsJson.mkGoodsId;
          //   }
          //   if (paramsJson.goodsId) {
          //     this.options.goodsId = paramsJson.goodsId;
          //   }
          //   onShowEvent.call(this, this.options);
          // })
          app.SHP.getParams(["mkGoodsId", "goodsId"]).then((params) => {
            this.options = {
              ...this.options,
              ...params
            }
            onShowEvent.call(this, this.options);
          })
        } else {
          onShowEvent.call(this, this.options);
        }
        
        
        // get_list.call(this); //列表

        // initSpecPopup.call(this);
        // getPointMkGoodsDetail.call(this, this.options).then(e => {
        //   var goodsToken = e.data.baseInfo.goodsToken;
        //   return getGoodsDetailJson.call(this, goodsToken);
        // });
        // getGoodsService.call(this, this.options);
        
    },
    onHide() {
        WxParse.wxParse('article', 'html', '', this, 0);
        stopCountDown.call(this);
        unListen.call(this);
    },
    onUnload() {
        WxParse.wxParse('article', 'html', '', this, 0);
        app.StorageH.remove('select_store');
        stopCountDown.call(this);
        unListen.call(this);
    },
    showServicePopup() {
        let goodsService = this.data.goodsService;
        this.servicePopup.show();
        this.servicePopup.getGoodsServiceData(goodsService);
    },

    //选择颜色
    colorSelect(e) {
        let color_id = e.currentTarget.dataset.color_id;
        let color_name = e.currentTarget.dataset.color_name;
        let select_goods = this.data.select_goods;
        select_goods['select_color_id'] = color_id;
        select_goods['select_color'] = color_name;
        select_goods['select_size_id'] = 0;
        select_goods['select_size'] = '';
        select_goods['productInfo'] = {};
        this.setData({
            select_goods: select_goods
        })
        getSpecNumMap.call(this);
    },
    //选择规格
    sizeSelect(e) {
        let size_id = e.currentTarget.dataset.size_id;
        let size_name = e.currentTarget.dataset.size_name;
        let select_goods = this.data.select_goods;
        select_goods['select_size_id'] = size_id;
        select_goods['select_size'] = size_name;
        this.setData({
            select_goods: select_goods
        })
        getSpecNumMap.call(this);
    },
    hideStylePop: function() {
        this.setData({
            style_select_show: 'ishide',
            noScroll: false
        })
    },
    //立即兑换
    showStylePop: function(e) {
        // let _this = this;
        // var errMsg = e.detail.errMsg;
        // if (e.currentTarget.dataset.type == 'login' && errMsg != 'getUserInfo:ok') {
        //     return
        // }
        // this.setData({
        //     isLogin: app.LM.isLogin
        // })
        // app.LM.getUserTokenAsync(true).then(e => {
        //     if (app.LM.isLogin) {
        //         this.loginPage = this.loginPage || this.selectComponent("#loginPage");
        //         this.loginPage.checkLogin({}, "need");
        //     }
        // })
        this.loginCallback(e);
    },
    //登录回调
    loginCallback(e) {
        checkBuyPointMkGoods.call(this).then(res => {
            if (res.code == 1) {
                this.setData({
                    BuyType: 1,
                    style_select_show: 'isshow',
                    noScroll: true
                });
                setAnim.call(this,"show");
                getSpecNumMap.call(this);
            } else {
                let that = this;
                this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                this.pageDialog.setTitle(res.msg);
                this.pageDialog.setCentent("");
                this.pageDialog.setSingleBtn();
                this.pageDialog.show();
            }
        });
    },
    exchange(e) {
        wx.navigateTo({
            url: `/pages/micro_mall/goods/goods_info?goods_id=${this.data.baseInfo.goods_id}`,
        })
    },
    addGoodsNum(e) {
        let select_goods = this.data.select_goods;
        let limit_count = this.data.baseInfo.limit_count;
        let inventory = limit_count == 0 || limit_count >= select_goods.productInfo.inventory ? select_goods.productInfo.inventory : limit_count;
        if ((select_goods.select_goods_count < inventory) && select_goods.productInfo.inventory) {
            // if (select_goods.select_goods_count < select_goods.productInfo.inventory){
            select_goods.select_goods_count++;
            this.setData({
                select_goods: select_goods
            })
        }
        console.log('select_goods', select_goods)
    },
    reduceGoodsNum(e) {
        let select_goods = this.data.select_goods;
        if (select_goods.select_goods_count > 1) {
            select_goods.select_goods_count--;
            this.setData({
                select_goods: select_goods
            })
        }
        console.log('select_goods', select_goods)
    },

    home_jump(e) {
        wx.switchTab({
            url: '/pages/micro_mall/index/index',
        })
    },
    addToCart(e) {
        pointMkGoodsCheckout.call(this, this.data.select_goods);
    },
    onShareAppMessage: function(res) {
        let baseInfo = this.data.baseInfo;
        let mkGoodsId = baseInfo.mk_goods_id;
        let goodsId = baseInfo.goods_id;
        let img = baseInfo.picture
        if(mkGoodsId && goodsId){
          this.addActionLog("goods_share", "INTEGRAL", {
            mk_goods_id: mkGoodsId,
            goods_id: goodsId
          })
        };
        return {
            addActionName:"goods_share",
            shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
            title: baseInfo.name,
            path: '/pages/micro_mall/point/point_goods_detail/point_goods_detail?goodsId=' + goodsId + '&mkGoodsId=' + mkGoodsId,
            imageUrl: img,
            success: function(res) {
                // 转发成功
            },
            fail: function(res) {
                // 转发失败
            }

        }
    },
    getShare(){
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      this.shareModule.checkIfStaffDstb();
    },
    chooseShareType(data) {
      let baseInfo = this.data.baseInfo;
      let imglist = this.data.pictureList || [];
      let detail = data.detail;
      let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
      let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
      baseInfo.goods_name = baseInfo.name;
      baseInfo.max_price = baseInfo.max_sale_price;
      baseInfo.min_price = baseInfo.min_sale_price;
      baseInfo.price = baseInfo.min_price;
      baseInfo.market_price = baseInfo.min_market_price;
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      let allData = { 
        info:{
          imgUrl: imglist[0].picture,
          goodsInfo: baseInfo,
          opKind:opKind
        },
        scene: {
          "shareType": shareType,
          "goodsId": this.options.goodsId,
          "mkGoodsId": this.options.mkGoodsId,
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
    switchStylePop: function(e) {
        if (!this.data.show_msg_pop) {
            this.setData({
                show_msg_pop: !this.data.show_msg_pop,
                msg_pop_animate: !this.data.msg_pop_animate
            })
        } else {
            this.setData({
                msg_pop_animate: !this.data.msg_pop_animate
            });
            let _timer = setTimeout(() => {
                clearTimeout(_timer);
                this.setData({
                    show_msg_pop: !this.data.show_msg_pop
                })
            }, 350)
        }
    },
    shippingChange(e){
        let detail = e&&e.detail||{};
        let index = detail.index||2;
        let storeId = detail.store_id||0;
        let update = detail.update||false;
        let select_goods = this.data.select_goods||{};
        select_goods.shippingType = index||2;
        select_goods.storeId = storeId||0;
        this.setData({
            select_goods
        })
        console.log('shippingChange',e,update)
        if(update){
            onShowEvent.call(this, this.options);
        }
    }
}))
function onShowEvent(ops){
    initShippingInfo.call(this);
    getPointMkGoodsDetail.call(this, ops).then(res=>{
      let staffInfo = app.LM.staffInfo || {};
      let baseInfo = this.data.baseInfo||{};
      loadComments.call(this,baseInfo.goods_id||0);
      this.commission = this.commission || this.selectComponent("#commission");
      return this.commission.getCommission("POINTMKT", ops.goodsId, ops.mkGoodsId);
    })
    listen.call(this);
}

//获取详情  --包含所有信息
function getPointMkGoodsDetail(options = {}) {
    let select_goods = this.data.select_goods||{};
    console.log('getPointMkGoodsDetail');
    return app.PointApi.getPointMkGoodsDetail({
            params: {
                userToken: app.LM._userToken,
                brandCode: app.Conf.BRAND_CODE,
                mkGoodsId: options.mkGoodsId || 0,
                goodsId: options.goodsId || 0,
                storeId:select_goods.storeId, //jimmy1
            },
            other: {
                isShowLoad: true
            }
        })
        .then(e => {
            if (e.code == "1") {
                console.log('商品详情', e);
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                });
                let data = e.data;
                let pictureList = data.pictureList || [];
                let color_img = {};
                for (let item in pictureList) {
                    if (!color_img[pictureList[item].color_id]) {
                        color_img[pictureList[item].color_id] = [];
                    }
                    color_img[pictureList[item].color_id].push(pictureList[item]); 
                }
                this.setData({
                    color_img: color_img
                })
                let productList = data.productList || {};
                let baseInfo = data.baseInfo || {};
                let specList = data.specList || [];
                let article = baseInfo.goods_desc;
                let _that = this;
                AllStaffApply.checkAllStaffApply(this,{goods_id:baseInfo.goods_id||0,relatedId:baseInfo.mk_goods_id||0,goodsType:"POINTMKT"});
                if(baseInfo.is_show_exchange_number == 1){
                  let exchange_number = parseFloat(baseInfo.exchange_number) || 0;
                  let ex_number_str = exchange_number;
                  if (exchange_number > 10000) {
                    ex_number_str = parseFloat(exchange_number / 10000) + "万";
                  }
                  if (exchange_number > 100000) {
                    ex_number_str = parseFloat(exchange_number / 10000) + "万+";
                  }
                  baseInfo.exchange_number_str = ex_number_str
                }
                WxParse.wxParse('article', 'html', article, _that, 0);
                let color_spec = {},
                    size_spec = {};
                let color_key_listTemp = {};
                let size_key_listTemp = {};
                if (specList[0] && specList[0].list) {
                    for (let item in specList[0].list) {
                        color_key_listTemp[specList[0].list[item].spec_value_id] = specList[0].list[item];
                    }
                }
                if (specList[1] && specList[1].list) {
                    for (let item in specList[1].list) {
                        size_key_listTemp[specList[1].list[item].spec_value_id] = specList[1].list[item];
                    }
                }
                let temp;
                for (let item in productList) {
                    let color_id = productList[item].color_id;
                    let size_id = productList[item].size_id;
                    productList[item].color_n = StrH.ellipsisStr(productList[item].color_name);
                    productList[item].size_n = StrH.ellipsisStr(productList[item].size_name);
                    if (!color_spec[color_id]) {
                        color_spec[color_id] = []
                    }
                    color_spec[color_id].push(productList[item]);
                    if (!color_spec[color_id]['is_enable']) {
                        color_spec[color_id]['is_enable'] = productList[item].inventory > 0
                    }
                    if (!size_spec[size_id]) {
                        size_spec[size_id] = []
                    }
                    size_spec[size_id].push(productList[item]);
                }
                let is_enable = {};
                for (let item in productList) {
                    if (!is_enable[productList[item].color_id]) {
                        is_enable[productList[item].color_id] = color_spec[productList[item].color_id].is_enable
                    }
                }
                this.setData({
                    is_enable: is_enable
                })
                // let isStart = false;
                // if ((MyDate.parse(baseInfo.server_time) > MyDate.parse(baseInfo.start_time)) && (MyDate.parse(baseInfo.server_time) < MyDate.parse(baseInfo.end_time))) {
                //     isStart = true;
                // }
                // this.setData({
                //     isStart: isStart
                // })
                // if (isStart) {
                //     start_time = baseInfo.server_time;
                //     end_time = baseInfo.end_time;
                //     startCountDown.call(this, start_time, end_time)
                // } else {
                //     start_time = baseInfo.server_time;
                //     end_time = baseInfo.start_time;
                //     startCountDown.call(this, start_time, end_time)
                // }
                initCountDownData.call(this,baseInfo);
                let {
                    limit_count,
                    max_market_price,
                    max_sale_price,
                    min_integral,
                    min_market_price,
                    min_sale_price,
                    mk_goods_id,
                    goods_id,
                } = baseInfo;
                let selfGet = data.selfGet||0;
                let src = `select_goods.productInfo`
                if(!(this.data.select_goods&&this.data.select_goods.productInfo && this.data.select_goods.productInfo.product_id)){
                    this.setData({
                        [src]: {
                            limit_count,
                            max_market_price,
                            max_sale_price,
                            min_integral,
                            min_market_price,
                            min_sale_price,
                            mk_goods_id
                        }
                    })
                }
                let select_goods = this.data.select_goods;
                select_goods['goods_id'] = goods_id;
                select_goods['selfGet'] = selfGet;
                if (this.data.select_goods.select_color_id == 0) {
                    select_goods['select_color_id'] = specList[0].list[specList[0].list.length - 1].spec_value_id || specList[0].list[0].spec_value_id || 0;
                    select_goods['select_color'] = specList[0].list[specList[0].list.length - 1].spec_value || specList[0].list[0].spec_value || '';
                }
                let color_temp_list = {};
                this.setData({
                    baseInfo: baseInfo,
                    color_spec: color_spec,
                    size_spec: size_spec,
                    pictureList: pictureList,
                    specList: specList,
                    color_key_list: color_key_listTemp || '',
                    size_key_list: size_key_listTemp || '',
                    productList: productList,
                    select_goods: select_goods
                });
                return Promise.resolve(e);
            } else {
                return Promise.reject(e);
            }
        })
        .catch(e => {
            app.SMH.showToast({
                title: typeof e.msg == "string" ? e.msg : ""
            });
            let _timer = setTimeout(function() {
                clearTimeout(_timer);
                wx.navigateBack();
            }, 1000);
        }).finally(e => {
            if (!this.data.isReady) {
                this.setData({
                    isReady: true
                })
            }
        });
}

function getGoodsDetailJson(name) {
    if (!name) return;
    return app.JsonApi.getGoodsDetailJson({
        params: {
            fileName: name
        }
    }).then(e => {
        if (e.code == 1) {
            this.setData({
                goodsDetails: e.data
            })
            loadGoodsDesc.call(this);
        }
    })
}

function loadGoodsDesc() {
    var goodsDetails = this.data.goodsDetails;
    if (goodsDetails) {
        //调用富文本
        WxParse.wxParse("goodsDetails", 'html', goodsDetails, this, 5);
        console.log(this.data.goodsDetails);
    }
    this.hasLoadDesc = true
}

function getGoodsService(options) {
    if (!options.goodsId) return;
    return app.GoodsApi.getGoodsService({
            params: {
                goodsId: options.goodsId,
                brandCode: app.Conf.BRAND_CODE,
            },
            other: {
                isShowLoad: true
            }
        })
        .then(e => {
            if (e.code == 1) {
                this.setData({
                    goodsService: e.data
                })
            }
        })
}

function checkBuyIntegralGoods(mkGoodsId) {
    if (!mkGoodsId) return Promise.reject();
    return app.IntegralApi.checkBuyIntegralGoods({
        params: {
            mkGoodsId: mkGoodsId,
            token: app.LM.userToken
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            return Promise.resolve(e);
        } else {
            if (e.msg) {
                this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                this.pageDialog.setCentent(e.msg);
                this.pageDialog.setSingleBtn(() => {
                      this.pageDialog.dismiss();
                });
                this.pageDialog.show();
            }
            return Promise.reject();
        }
    })
}

function initSpecPopup() {
    this.specPopup = this.specPopup || this.selectComponent("#specPopup");
    this.servicePopup = this.servicePopup || this.selectComponent("#servicePopup");
}

function setSpecData(type) {
    this.specPopup.show();
}

//授权
function authorizeUserInfo(e) {
    return app.LM.getUserTokenAsync(true);
}

function listen() {
    this.setData({
        isLogin: app.LM.isLogin
    });
    this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
        this.setData({
            isLogin: app.LM.isLogin
        });
    });
}

function unListen() {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function startCountDown(startTime, endTime) {
    if (!this.countDown) {
        stopCountDown.call(this);
        this.countDown = new CountDown(MyDate.parse(startTime));
    }
    this.countDown.setTarget(MyDate.parse(endTime));
    setTime.call(this, this.countDown);
    if (!this.countDown.isRunning) {
        this.countDown.start(e => {
            if (e.value <= 0) {
                stopCountDown.call(this);
                getPointMkGoodsDetail.call(this, this.options);
            }
            setTime.call(this, e);
        });
    }
}

function stopCountDown() {
    if (this.countDown) {
        this.countDown.stop();
    }
}


function setTime(e) {
    let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
    let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
    let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = parseInt((e.value % (1000 * 60)) / 1000);
    let count_down = {
        day: day,
        hour: hour,
        min: minutes,
        sec: seconds
    }
    this.setData({
        count_down: count_down
    });
}

//遍历选择的情况
function getSpecNumMap() {
    let color_spec = this.data.color_spec;
    let size_spec = this.data.size_spec;
    let select_goods = this.data.select_goods;
    let goodsExtend = this.data.goodsExtend;
    if ((select_goods.select_color_id && select_goods.select_size_id) || (select_goods.select_color_id && this.data.specList.length < 2)) {
        console.log('color_spec', color_spec)
        console.log('选满', select_goods);
        let canSelectSpec = color_spec[select_goods.select_color_id];
        for (let i in canSelectSpec) {
            if (this.data.specList.length == 1) {
                select_goods.select_size_id = canSelectSpec[i].size_id;
                select_goods.productInfo = canSelectSpec[i];
                break;
            } else {
                if (canSelectSpec[i].size_id == select_goods.select_size_id) {
                    select_goods.productInfo = canSelectSpec[i];
                    break;
                }
            }
        }
        this.setData({
            select_goods: select_goods
        })
        console.log('select_goods', select_goods);
        //结算
    } else { //选择颜色
        console.log('color_spec2', this.data.color_spec)
        console.log('没选满', color_spec[select_goods.select_color_id])
        let canSelectSpec = [];
        let min_m_price = null,
            max_m_price = null,
            min_price = null,
            max_price = null,
            min_point = null,
            max_point = null;
        let color_key_list = {},
            size_key_list = {};
        let productInfo = select_goods.productInfo;
        if (select_goods.select_color_id) {
            canSelectSpec = color_spec[select_goods.select_color_id];
        } else if (select_goods.select_size_id) {
            canSelectSpec = size_spec[select_goods.select_size_id];
        }
        for (let i in canSelectSpec) {
            //获取价格区间
            let market_price = canSelectSpec[i].market_price;
            let sale_price = canSelectSpec[i].sale_price;
            let exchange_point = canSelectSpec[i].exchange_point;
            if (min_m_price == null || min_m_price > parseFloat(market_price)) {
                min_m_price = parseFloat(market_price)
            }
            if (max_m_price == null || max_m_price < parseFloat(market_price)) {
                max_m_price = parseFloat(market_price)
            }
            if (min_price == null || min_price > parseFloat(sale_price)) {
                min_price = parseFloat(sale_price)
            }
            if (max_price == null || max_price < parseFloat(sale_price)) {
                max_price = parseFloat(sale_price)
            }
            if (min_point == null || min_point > parseFloat(exchange_point)) {
                min_point = parseFloat(exchange_point)
            }
            if (max_point == null || max_point < parseFloat(exchange_point)) {
                max_point = parseFloat(exchange_point)
            }
        }
        productInfo.max_exchange_point = max_point;
        productInfo.max_market_price = max_m_price;
        productInfo.max_price = max_price;
        productInfo.min_exchange_point = min_point;
        productInfo.min_market_price = min_m_price;
        productInfo.min_price = min_price;
        this.setData({
            select_goods: select_goods
        })
        console.log('select_goods', select_goods)
    }
}

function checkBuyPointMkGoods() {
    let select_goods = this.data.select_goods||{};
    return app.PointApi.checkBuyPointMkGoods({
        params: {
            mkGoodsId: this.data.baseInfo.mk_goods_id,
            userToken: app.LM._userToken,
            brandCode: app.Conf.BRAND_CODE,
            //jimmy2
            shippingType:select_goods.shippingType||2,
            storeId:select_goods.storeId||0,
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        console.log('checkBuyPointMkGoods', res);
        return res
    })
}

function pointMkGoodsCheckout(select_goods) {
    console.log('select_goods finally:', select_goods)
    // console.log(typeof (this.data.baseInfo.mk_goods_id), typeof (this.data.baseInfo.goods_id), typeof (select_goods.productInfo.product_id), typeof (select_goods.select_goods_count), typeof (0), typeof (0), typeof (app.LM._userToken), typeof (app.Conf.BRAND_CODE) )

    if (!this.data.select_goods.productInfo.product_id) {
        app.SMH.showToast({
            title: '请选择完整规格'
        })
        return
    }
    if((select_goods.shippingType == 1 || select_goods.selfGet == 1) && (!select_goods.storeId || select_goods.storeId==0)){
        app.SMH.showToast({
            title: '请选择自提店铺'
        })
        return
    }
    if (!this.isLoading) {
        this.isLoading = true;
        app.globalData.CheckOut = {
            mkGoodsId: this.data.baseInfo.mk_goods_id,
            goodsId: this.data.baseInfo.goods_id,
            productId: select_goods.productInfo.product_id,
            "number": select_goods.select_goods_count,
            addressId: this.addressId || 0,
            isUsePoint: 0,
            userToken: app.LM._userToken,
            brandCode: app.Conf.BRAND_CODE,
            shippingType:select_goods.shippingType||2,
            storeId:select_goods.storeId||0,
            consignee,
            mobile
        }
        console.log('app.globalData.CheckOut', app.globalData.CheckOut)
        let  store_data = app.StorageH.get('store_data') || {};
        let consignee = store_data.contact || "";
        let mobile = store_data.mob_phone || ""; 
        return app.PointApi.pointMkGoodsCheckout({
            data: {
                mkGoodsId: this.data.baseInfo.mk_goods_id,
                goodsId: this.data.baseInfo.goods_id,
                productId: select_goods.productInfo.product_id,
                "number": select_goods.select_goods_count,
                addressId: app.globalData.addr_id || this.addressId || 0,
                isUsePoint: 0,
                userToken: app.LM._userToken,
                brandCode: app.Conf.BRAND_CODE,
                shippingType:select_goods.shippingType||2,
                storeId:select_goods.storeId||0,
                consignee,
                mobile
            },
            other: {
                isShowLoad: true
            }
        }).then(res => {
            if (res.code == 1) {
                app.globalData.order_detail = res.data;
                let select_goods = this.data.select_goods||{};
                let shippingType = select_goods.shippingType;
                let storeId = select_goods.storeId;
                wx.navigateTo({
                  url: `/pages/micro_mall/point/point_settlement/integral_settlement?shippingType=${shippingType}&storeId=${storeId}`,
                })
            } else {
                // app.SMH.showToast({
                //     title: res.msg
                // })
                let that = this;
                this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
                if (res.msg.indexOf("积")>=0) {
                    
                    this.pageDialog.setTitle("积分不足，赶紧去赚积分吧");
                }else{
                    this.pageDialog.setTitle(res.msg);
                } 
                this.pageDialog.setCentent("");
                this.pageDialog.setSingleBtn();
                this.pageDialog.show();
            }
            console.log('res', res);
        }).finally(() => {
            this.setData({
                style_select_show: 'ishide',
                noScroll: false
            })
            setAnim.call(this);
            let _timer = setTimeout(() => {
                clearTimeout(_timer);
                this.isLoading = false;
            }, 800)

        })
    }
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

function initShippingInfo() {
    this.shippingTypeMod = this.shippingTypeMod || this.selectComponent('#shippingTypeMod');   
    this.shippingTypeMod.initShippingInfo();
}
function  loadComments(goods_id) {
    this.comments = this.comments || this.selectComponent('#comments');
    this.comments.initData(goods_id||this.options.goodsId||0);
}


function initCountDownData(data){
    if(!data)return;
    let result = {};
    result.stime = data.start_time || "";
    result.etime = data.end_time || "";
    result.serverTime = data.server_time || "";
    result.acName = "积分兑换";
    result.type = "point"
    this.actCountDownId || (this.actCountDownId = this.selectComponent('#actCountDownId'));
    let cbData = this.actCountDownId.initData(result,()=>{
        getPointMkGoodsDetail.call(this, this.options)
    });
    console.log('cbData',cbData)
    this.setData({
        disabledTip: cbData && cbData.state != 2 && cbData.disabledTip || ""
    })
}

 