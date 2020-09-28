import MyDate from '../../../support/utils/date-util.js';
const app = getApp();
let orderTypeTit = "";
let next_act = "order_info";
Page(app.BP({
    data: {
        tabNum0: "mobile_tab",
        tabNum1: "store_tab",
        tabNum2: "swop_tab",
        clickTabId: "mobile_tab",
        mobileList: [],
        storeList: [],
        brand_info: app.globalData.brand_info,
        options: {},
        count: 3,
        isEmptyMobile: false,
        isEmptyStore: false,
        order_text: "订单号",
        btn_text: "订单详情",
        allwaysVal: false,
        showExchange: false,
        leftIndex: 1,
        rightIndex: 2,
        cardInfo:{}
    },
    mobilePage: 0,
    orderType: 1,
    storePage: 0,
    mobileOrderMore: true,
    storeOrderMore: true,
    onLoad: function(options) {
        this.options = options; 
        let empty_order = this.data.brand_info.icon_url + "micro_mall/order/empty_order.png";
        let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg"; 
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 49, 121, 97, 1);
        this.setData({ 
            options: options, 
            empty_order: empty_order,
            empty_url: empty_url,
            l_bg_color: 'background:' + l_bg_color + ';'
        })
        checkSalesVolume.call(this);
    },
    onReady: function() {},
    onShow: function() {
        this.onShowFnc('onshow');
    },
    onShowFnc(type){
        checkExchange.call(this).then(res => {
          if (!this.initAlready) {
            initFn.call(this);
          }
          let times = 1;
          if (this.data.clickTabId == this.data.tabNum1) {
            //店铺订单
            this.data.storeList = []; 
            if(type=='onshow'){
                times = this.storePage || 1;
            }else{
                this.storePage = 0;
            }
            this.loadStoreOrder(times,type);
          } else {
            this.data.mobileList = []; 
            //手机订单
            // this.mobilePage = 0;
            if(type=='onshow'){
                times = this.mobilePage || 1;
            }else{
                this.mobilePage = 0;
            }
            this.loadMobileData(times,type);
          }
        })
    },
    onReachBottom: function() {
        let that = this;
        let clickTabId = this.data.clickTabId;
        let tabNum0 = this.data.tabNum0;
        let tabNum1 = this.data.tabNum1;
        let timer = setTimeout(function() {
            if (clickTabId == tabNum0) {
                if (that.mobileOrderMore) {
                    that.loadMobileData();
                }else{
                  app.SMH.showToast({
                    title:"已经到底了"
                  })
                }
            } else if (clickTabId == tabNum1) {
                if (that.storeOrderMore) {
                    that.loadStoreOrder();
                }else{
                  app.SMH.showToast({
                    title:"已经到底了"
                  })
                }
            }
            timer && clearTimeout(timer);
        }, 500);

    },
    /**
     * 设置请求数据
     */
    setReqData: function() {
        let clickTabId = this.data.clickTabId;
        let tabNum0 = this.data.tabNum0;
        let tabNum1 = this.data.tabNum1;
        let options = this.data.options;
        let reqData;
        let orderType = options.orderType;

        switch (orderType) {
            case 'wait_to_pay':
                this.orderType = 1;
                orderTypeTit = "待付款";
                next_act = "order_info";
                break;
            case 'wait_to_shipping':
                this.orderType = 2;
                orderTypeTit = "待发货";
                next_act = "order_info";
                break;
            case 'wait_to_receiving':
                this.orderType = 3;
                orderTypeTit = "待收货";
                next_act = "order_info";
                break;
            case 'order_exchange':
                this.orderType = 4;
                orderTypeTit = "退换货";
                next_act = "order_exchange_info";
                break; 
            case 'order_swop':
                this.orderType = 4;
                orderTypeTit = "退换货";
                next_act = "order_exchange_info";
                break; 
            case 'all':
                this.orderType = 0;
                orderTypeTit = "";
                next_act = "order_info";
            default:
                this.orderType = 0;
                orderTypeTit = "";
                next_act = "order_info";
        }
        this.setData({
            orderType:this.orderType
        })
        //设置title 
        wx.setNavigationBarTitle({
            title: orderTypeTit + "订单列表",
        })
        this.setData({
            "cardInfo.title": orderTypeTit + "订单列表"
        })
        return reqData;
    },
    /**
     * 手机订单请求
     */
    loadMobileData: function(times=1,type) {
        var that = this;
        var reqData = this.setReqData();
        getMobileOrderList.call(this,times,type);
    },
    /**
     * 店铺订单请求
     */
    loadStoreOrder: function(times=1,type) {
        var that = this;
        var reqData = this.setReqData();
        getStoreOrderList.call(this,times=1,type);
    },
    onTabClick: function(e) {
        var clickTabId = this.data.clickTabId;
        var tab_id = e.currentTarget.id;
        this.setData({
            clickTabId: tab_id
        });
        // console.log('onTabClick', tab_id);
        // console.log('this.orderType', this.orderType);
        if (tab_id === this.data.tabNum1) {
            console.log("---clear----")
            this.storePage = 0;
            this.data.storeList = [];
            // this.setData({
            //     storeList: []
            // });
            this.loadStoreOrder();
        } else if (tab_id === this.data.tabNum2) {
            this.mobilePage = 0;
            this.data.mobileList = [];
            // this.setData({
            //     mobileList: []
            // });
            if (this.orderType == '4') {
                checkOrderText.call(this);
            } 
            this.loadMobileData();
        } else if (tab_id === this.data.tabNum0) {
            this.mobilePage = 0;
            this.data.mobileList = [];
            // this.setData({
            //     mobileList: []
            // });
            if (this.orderType == '4') {
                checkOrderText.call(this);
            } 
            this.loadMobileData();
        }
    },
    onPageJump: function(e) {
        var dataset = e.currentTarget.dataset;
        var order_id = dataset.order_id;
        var order_sn = dataset.order_sn;
        var return_id = dataset.return_id;
        var parent_order_sn = dataset.parent_order_sn;
        var sign = dataset.sign;
        if ((this.data.clickTabId === this.data.tabNum0) || (this.data.clickTabId === this.data.tabNum2)) {
            //退换货
            if (next_act == "order_exchange_info") {
                wx.navigateTo({
                    url: next_act + '?order_sn=' + order_sn + '&return_id=' + return_id + '&type=' + this.data.clickTabId
                })
            } else { //其他类型订单
                var link_order_sn = "";
                if (parent_order_sn) {
                    link_order_sn = parent_order_sn;
                } else {
                    link_order_sn = order_sn;
                }
                wx.navigateTo({
                    url: next_act + '?order_sn=' + link_order_sn + '&order_id=' + order_id
                })
            }
        } else {
            //erp跳转
            wx.navigateTo({
                url: 'erp_order_info?order_sn=' + order_sn
            })
        }

    },

    jumpToComment: function(e) {
        let dataset = e.currentTarget.dataset||{};
        if (this.data.clickTabId === this.data.tabNum0) {
            var order_id = dataset.order_id;
            let g_list_len = dataset.g_list_len||0;
            if(g_list_len == 1){
                let goods_id = dataset.goods_id||0;
                let goods_sn = dataset.goods_sn||"";
                let goods_type = 0;
                console.log('jimmy',`/pages/micro_mall/comment/comment_edit/comment_edit?order_id=${order_id}&goods_id=${goods_id}&goods_sn=${goods_sn}&goods_type=${goods_type}`);
                wx.navigateTo({
                  url: `/pages/micro_mall/comment/comment_edit/comment_edit?order_id=${order_id}&goods_id=${goods_id}&goods_sn=${goods_sn}&goods_type=${goods_type}`,
                })
                return
            }
            wx.navigateTo({
                url: `../comment/mobile_order_comment/mobile_order_comment?order_id=${order_id}`,
            })
        } else {
            var order_sn = dataset.order_sn;
            var order_id = dataset.order_id;
            wx.navigateTo({
                url: `../comment/store_order_comment/store_order_comment?order_sn=${order_sn}&order_id=${order_id}`,
            })
        } 
    },
  onTap(e){
    let dataset = e.currentTarget.dataset;
    let type = dataset.type || "";
    let order_id = dataset.order_id || 0;
    let params = {};
    if (type =="oneMoreOrder"){
      params.orderId = order_id;
      params.clientSessionId = app.LgMg.channel && app.LgMg.channel.clientSessionId;
      params.visitLogId = app.LgMg.pageLog && app.LgMg.pageLog.logId;
      return app.RunApi.go('post', 'BuyApi','oneMoreOrder',params).then(res=>{
        if(res.code!= -1){
          let data = res.data || [];
          let sucArr = [];
          let failArr = [];
          let recIds = [];
          data.forEach(item=>{
            if(item.code==1){
              sucArr.push(item);
              recIds.push(item.recId);
            }else if(item.code==-1){
              failArr.push(item)
            }
          })
          recIds = recIds.join(',');
          let storage = {
            recIds,
            sucArr,
            failArr,
            update:true
          }
          console.log('oneMoreOrder', recIds, sucArr, failArr);
          app.StorageH.set('One_More_Order', storage);
          setTimeout(()=>{
            wx.switchTab({
              url: `/pages/micro_mall/shopping/shopping_cart`,
            })
          },1000)
        } else {
          this.setData({
            failText: res && res.msg || "订单中的商品都已卖完咯"
          })
          this.tips_window = this.tips_window || this.selectComponent('#tips_window');
          this.tips_window.show();
        }
         
      }).catch(e=>{
        app.SMH.showToast({
          title:e && e.msg || "订单商品异常"
        })
      })
    }else if(type=='shipping'){
      wx.navigateTo({
        url: '/pages/micro_mall/shipping_info/shipping_info' + '?orderId=' + order_id
      })
    } else if (type =='buyAgain'){
      wx.navigateTo({
        url: `/pages/micro_mall/order/order_info?first_time_topay=${1}&order_id=${order_id}`
      })
    }else if(type=='issue_invoice'){
        let sn = dataset.sn||"";
        let order_type = dataset.order_type||"ONLINE";
        let price = Number(dataset.price||0);
        if(order_type != "OFFLINE"){
            let shipping_fee = Number(dataset.sp_fee||0);
            let offline_surplus = Number(dataset.offline_surplus||0);
            price = parseFloat((price + offline_surplus - shipping_fee).toFixed(2)); 
        }
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=invoice&order_type=${order_type}&sn=${sn}&price=${price}`,
        })
    }else if(type=='detail_invoice'){
        let id = dataset.id||0;
        let sn = dataset.sn||"";
        let price = dataset.price||"";
        wx.navigateTo({
            url: `/pages/micro_mall/invoice/invoice_detail/detail?id=${id}&sn=${sn}&price=${price}`,
        })
    }
  },
  onTapConfirm(e){
    console.log('onTapConfirm',e)
    this.detail = e.detail|| "";
    this.onShowFnc('confirm');
  },
}))

function getMobileOrderList(times=1,type) { 
    this.setData({
        isEmptyMobile: false
    })
    let pageIndex = 0;
    if(type != 'onshow'){
        this.mobilePage = this.mobilePage + 1;
        pageIndex = this.mobilePage;
    }else{
        pageIndex = 1;
    }
    let reqUrl = this.orderType == 4 ? 'getExAPPVariousTypeOrderList' : 'getAPPVariousTypeOrderList';
    let orderKind = 1;
    if (this.data.showExchange) {
        orderKind = this.data.clickTabId == this.data.tabNum0 ? 2 : 3
    } else {
        orderKind = 1;
    }
    let params = {
        userToken: app.LM.userToken,
        pageIndex: pageIndex,
        orderKind: orderKind,
        orderType: this.orderType,
        pageSize: app.Conf.PAGE_SIZE * times,
        brandCode: app.Conf.BRAND_CODE
    };
    if(this.orderType != 4){
        params.searchStr = this.detail || "";
    }
    console.log('orderKind', orderKind)
    return app.BuyApi[reqUrl]({
        params: params,
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let mobileList = this.data.mobileList;
            let data = e.data || [];
            if (data.length < app.Conf.PAGE_SIZE) {
                this.mobileOrderMore = false;
            } else {
                this.mobileOrderMore = true;
            }
            for (let item in data) {
                let order_info = data[item]||{};
                let rec_time_format = order_info.rec_time || "";
                let nowDate = MyDate.parse(MyDate.format(new Date(), "yyyy-MM-dd HH:mm:ss"));
                let rec_time = MyDate.parse(rec_time_format);
                let space_time = nowDate - rec_time;
                let space_day = Math.floor(space_time / (60 * 60 * 24 * 1000)) || 0;
                let show_invoice_btn = space_day > 30 ? false : true;
                order_info.platform_src = order_info.platform_src && order_info.platform_src.toLowerCase() || 'wxapp'
                order_info.show_invoice_btn = show_invoice_btn;
            }
            if (data) {
                mobileList = mobileList.concat(data);
            }
            this.setData({
                mobileList: mobileList || []
            })
            if (this.data.mobileList.length == 0) {
                this.setData({
                    isEmptyMobile: true
                })
            }
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });
}

function getStoreOrderList(times=1,type) { 
    let pageIndex = 0;
    if(type != 'onshow'){
        this.storePage = this.storePage + 1;
        pageIndex = this.storePage;
    }else{
        pageIndex = 1;
    }
    return app.BuyApi.getStoreOrderList({
        params: {
            userToken: app.LM.userToken,
            pageIndex: pageIndex,
            pageSize: app.Conf.PAGE_SIZE * times,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let storeList = this.data.storeList;
            let data = e.data || [];
            if (data.length < app.Conf.PAGE_SIZE) {
                this.storeOrderMore = false;
            } else {
                this.storeOrderMore = true;
            }
            storeList = storeList.concat(data);
            this.setData({
                storeList: storeList || []
            })
            //   let data = e.data;
            //     let storeList = this.data.storeList;
            //     if (e.data.length < app.Conf.PAGE_SIZE) {
            //         this.storeOrderMore = false;
            //     } else {
            //         this.storeOrderMore = true;
            //     }
            //     if (data.order_list.length > 0) {
            //         storeList = storeList.concat(data.order_list);
            //     }
            //     this.setData({
            //         storeList: storeList || []
            //     })
            if (this.data.storeList.length == 0) {
                this.setData({
                    isEmptyStore: true
                });
            }
            return Promise.resolve(e);
        }
        return Promise.reject(e);
    }).finally(e => {
        if (!this.data.isReady) {
            this.setData({
                isReady: true
            })
        }
    });
}

function checkExchange() {
    if (!(this.options.orderType == 'order_exchange' || this.options.orderType == 'order_swop') || this.data.showExchange){
        return Promise.resolve(); 
    }
    return app.sysTemConfig('activate_order_exchange').then(res => {
    // return app.sysTemConfig('is_allow_exchange_goods').then(res => {
        console.log('配置', res)
        let value = res.Value || 0;
        if (value == 1) {
            this.setData({
                showExchange: true,
            })
            return Promise.resolve();
        } 
        return Promise.resolve(); 
    })
} 
  
function initFn(){ 
    var tabNum0 = this.data.tabNum0;
    var tabNum1 = this.data.tabNum1;
    var tabNum2 = this.data.tabNum2;
    var order_type = this.options.orderType;
    var clickTabId = this.data.clickTabId;
    this.initAlready = true;
    if (order_type == 'store') {
        clickTabId = tabNum1
    } else if (order_type == 'order_swop' && this.data.showExchange) {
        clickTabId = tabNum2
    } else {
        clickTabId = tabNum0
    }
    this.setData({
        clickTabId: clickTabId
    })
    if (order_type == "order_exchange" ) {
        checkOrderText.call(this);
    } else if (order_type == "order_swop" && this.data.showExchange) { 
        checkOrderText.call(this);
    }
} 

function checkOrderText() {
    let text1 = '退货单号';
    let text2 = '退货详情';
    if (this.data.clickTabId == this.data.tabNum2) {
        text1 = "换货单号";
        text2 = "换货详情";
    }
    this.setData({
        order_text: text1,
        btn_text: text2
    })
}

function checkSalesVolume(){
    return app.sysTemConfig("activate_electric_kp").then(data=>{
      this.setData({
        showElectricBtn: data.Value||0
      })
    })
}