import MyDate from '../../../common/support/utils/date-util.js';
const app = getApp();
let orderTypeTit = "";
// let this.next_act = "order_info";
const Tab_Obj = {
    "money":"refund_money_tab",
    "goods":"refund_goods_tab",
}
Page(app.BP({
    data: {
        isLogin: null,
        clickTabId: "mobile_tab",
        orderList: [],
        storeList: [],
        brand_info: app.globalData.brand_info,
        options: {},
        count: 3,
        isEmptyMobile: false,
        isEmptyStore: false,
        order_text: "订单号",
        btn_text: "订单详情",
        allwaysVal: false,
        leftIndex: 1,
        rightIndex: 2,
        cardInfo:{},
        orderTab:[],
        outsideComponents: { // 该页面的最外层容器的组件对象-解决层级问题用
          agreementPop: {confirmIsGetInfoBtn: true},
          getCouponsPop: {},
          contactStaffGuide: {}
        },
    },
    orderPage: 1,
    orderType: 1,
    storePage: 0,
    orderMore: true,
    storeOrderMore: true,
    onLoad: function(options) {
        this.options = options; 
        this.next_act = "order_info";
        let empty_order = this.data.brand_info.icon_url + "micro_mall/order/empty_order.png";
        let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg"; 
        let l_bg_color = app.getColor(this.data.brand_info.style.bg_color, 49, 121, 97, 1);
        checkSearch.call(this);
        this.setReqData();
        this.setData({ 
            options: options, 
            empty_order: empty_order,
            empty_url: empty_url,
            l_bg_color: 'background:' + l_bg_color + ';'
        });
        checkSalesVolume.call(this);
        checkLogistics.call(this); 
    },
    onReady: function() {
        if(this.detail){
            this.search = this.search || this.selectComponent('#search');
            this.search.setVal(this.detail);
        }
    },
    onShow: function() {
      listen.call(this, 'onshow')
    },
    onUnload: function() {
      unListen.call();
    },
    onReachBottom: function() {
        let clickTabId = this.data.clickTabId; 
        if(clickTabId != "store_tab" && this.orderMore){
            this.loadData();
        }else if(clickTabId == "store_tab" && this.storeOrderMore){
            this.loadStoreOrder(); 
        }else{
            app.SMH.showToast({
                title:"已经到底了"
            })
        } 
    }, 
    setReqData: function() {
        let options = this.options;
        let reqData;
        let orderType = options.orderType;
        switch (orderType) {
            case 'wait_to_pay':
                this.orderType = 1;
                orderTypeTit = "待付款";
                this.next_act = "order_info";
                break;
            case 'wait_to_shipping':
                this.orderType = 2;
                orderTypeTit = "待发货";
                this.next_act = "order_info";
                break;
            case 'wait_to_receiving':
                this.orderType = 3;
                orderTypeTit = "待收货";
                this.next_act = "order_info";
                break;
            case 'order_exchange':
                this.orderType = 4;
                orderTypeTit = "退换货";
                this.next_act = "order_exchange_info";
                break; 
            case 'order_swop':
                this.orderType = 4;
                orderTypeTit = "退换货";
                this.next_act = "order_exchange_info";
                break; 
            case 'all':
                this.orderType = 0;
                orderTypeTit = "";
                this.next_act = "order_info";
            default:
                this.orderType = 0;
                orderTypeTit = "";
                this.next_act = "order_info";
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
    loadData: function(times=1,type) {
        loadDataList.call(this,times,type);
    },
    loadStoreOrder: function(times=1,type) {
        getStoreOrderList.call(this,times=1,type);
    },
    onTabClick: function(e) {
        let dataset = e.currentTarget.dataset||{};
        let type = dataset.type||"";
        this.setData({
            clickTabId: type
        });
        if (type == "store_tab") { //店铺订单
            this.storePage = 1;
            this.data.storeList = []; 
            this.loadStoreOrder();
        } else {
            this.orderPage = 1;
            this.data.orderList = []; 
            if (this.orderType == '4') {
                checkOrderText.call(this);
            } 
            this.loadData();
        }
    },
    onPageJump: function(e) {
        var dataset = e.currentTarget.dataset;
        var order_id = dataset.order_id;
        var order_sn = dataset.order_sn;
        var return_id = dataset.return_id;
        var parent_order_sn = dataset.parent_order_sn;
        // var sign = dataset.sign;
        if(this.data.clickTabId == "store_tab"){
            //erp跳转
            wx.navigateTo({
                url: 'erp_order_info?order_sn=' + order_sn
            })
        }else {
            //退换货
            if (this.next_act == "order_exchange_info") { 
                wx.navigateTo({
                    url: this.next_act + '?order_sn=' + order_sn + '&return_id=' + return_id + '&type=' + this.data.clickTabId
                })
            } else { //其他类型订单
                var link_order_sn = "";
                if (parent_order_sn) {
                    link_order_sn = parent_order_sn;
                } else {
                    link_order_sn = order_sn;
                }
                wx.navigateTo({
                    url: this.next_act + '?order_sn=' + link_order_sn + '&order_id=' + order_id
                })
            }
        }

    },

    jumpToComment: function(e) {
        let dataset = e.currentTarget.dataset||{};
        if (this.data.clickTabId != "store_tab") {
            var order_id = dataset.order_id;
            let g_list_len = dataset.g_list_len||0;
            if(g_list_len == 1){
                let goods_id = dataset.goods_id||0;
                let goods_sn = dataset.goods_sn||"";
                wx.navigateTo({
                  url: `/pages/micro_mall/comment/comment_edit/comment_edit?order_id=${order_id}&goods_id=${goods_id}&goods_sn=${goods_sn}`,
                })
                return
            }
            wx.navigateTo({
                url: `../comment/mobile_order_comment/mobile_order_comment?order_id=${order_id}`,
            })
        } else {
            let g_list_len = dataset.g_list_len||0;
            let order_sn = dataset.order_sn || '';
            let order_id = dataset.order_id || '';
            let type = dataset.type;  
            if(g_list_len == 1){
                let goods_id = dataset.goods_id||0;
                let goods_sn = dataset.goods_sn||"";
                wx.navigateTo({
                  url: `/pages/micro_mall/comment/comment_edit/comment_edit?order_sn=${order_sn}&type=${type}&order_id=${order_id}&goods_id=${goods_id}&goods_sn=${goods_sn}`,
                })
                return
            } 
            wx.navigateTo({
                url: `../comment/mobile_order_comment/mobile_order_comment?order_sn=${order_sn}&type=${type}`,
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
    onShowFunc.call(this, 'confirm', true);
  },
}))

function listen(type){
  let that = this;
  if (!app.LM.isLogin){
      this.setData({isLogin: false});
      this.loginId = app.EB.listen('LoginStateChange',()=>{
          that.setData({
              isLogin:app.LM.isLogin
          }, onShowFunc.bind(that, type))
      })
  }else{
      that.setData({
          isLogin: true
      }, onShowFunc.bind(that, type))
  }
}

function unListen(){
  if (!this.loginId){return;}
  app.EB.unListen('LoginStateChange',this.loginId);
}

function onShowFunc(type){
  setTabShow.call(this).then(res => {
    let timesTemp = this.data.clickTabId == "store_tab" ? this.storePage:this.orderPage;
    timesTemp = timesTemp > 1 ? timesTemp - 1 : timesTemp;
    reset.call(this, type == 'onshow');
    if (!this.initAlready) {
      initFn.call(this);
    }
    if (this.data.clickTabId == "store_tab") {//店铺订单
      this.loadStoreOrder(timesTemp,type);
    } else {
      this.loadData(timesTemp,type);
    }
  })
}

function loadDataList(times=1,type) { 
    this.setData({
        isEmptyMobile: false
    })
    let {params={},api={}} = getParams.call(this,times)
    return app.BuyApi[api.reqUrl]({
        params: {...params},
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let orderList = this.data.orderList;
            let data = e.data || [];
            if (data.length < app.Conf.PAGE_SIZE) {
                this.orderMore = false;
            } else {
                this.orderMore = true;
            }
            type == 'onshow' && (this.orderPage = times);
            this.orderPage += 1;
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
                orderList = orderList.concat(data);
            }
            this.setData({
                orderList: orderList || []
            })
            if (this.data.orderList.length == 0) {
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
    return app.BuyApi.getStoreOrderList({
        params: {
            userToken: app.LM.userToken,
            pageIndex: this.storePage,
            pageSize: app.Conf.PAGE_SIZE * times,
            brandCode: app.Conf.BRAND_CODE
        },
        other: {
            isShowLoad: true
        }
    }).then(e => {
        if (e.code == "1") {
            let storeList = this.data.storeList;
            this.storePage += 1;
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

function setTabShow() {
    if (this.data.orderTab.length>0){
        return Promise.resolve(); 
    }
    // refund_money_tab , refund_goods_tab , swop_tab
    if((this.options.orderType == 'order_exchange' || this.options.orderType == 'order_swop')){
        let arr = [app.sysTemConfig('activate_order_exchange'),app.sysTemConfig('open_single_goods_cancel')];
        return Promise.all(arr).then(res=>{
            let orderTab=[{key:"refund_goods_tab",name:"退货单"}];
            let clickTabId = "refund_goods_tab";
            res.forEach(item=>{
                if(item.Value == "1"){
                    if(item.Key == "activate_order_exchange"){
                        orderTab.push({key:"swop_tab",name:"换货单"});
                    }else if(item.Key == "open_single_goods_cancel"){
                        clickTabId = "refund_money_tab";
                        orderTab.unshift({key:"refund_money_tab",name:"退款单"});
                    };
                };
            });
            this.options.exType &&(clickTabId = (Tab_Obj[this.options.exType] || "refund_goods_tab"));
            this.setData({
                clickTabId,
                orderTab,
                // showExchange: true,
            })
        })
    }else{
        let orderTab=[{key:"mobile_tab",name:"手机订单"},{key:"store_tab",name:"店铺订单"}];
        this.setData({
            orderTab
        })
        return Promise.resolve(); 
    }
} 
  
function initFn(){
    var order_type = this.options.orderType;
    this.initAlready = true;
    if (order_type == "order_exchange") {
        checkOrderText.call(this);
    } else if (order_type == "order_swop") { 
        checkOrderText.call(this);
    }
} 

function checkOrderText() {
    let text1 = '退货单号';
    let text2 = '退货详情';
    if (this.data.clickTabId == "store_tab") {
        text1 = "换货单号";
        text2 = "换货详情";
    }else if(this.data.clickTabId == "refund_money_tab"){
        text1 = "退款单号";
        text2 = "退款详情";
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

function checkLogistics(){
  return app.sysTemConfig("is_show_logistics").then(e=>{
    this.setData({
      isHideLogistics: !!(e.Value === 0 || e.Value === '0')
    })
  })
}

function getParams(times) {
    let params = {
        userToken: app.LM.userToken,
        pageIndex: this.orderPage,
        pageSize: app.Conf.PAGE_SIZE * times,
        searchStr : this.detail || "",
        brandCode: app.Conf.BRAND_CODE
    };
    let api = {reqUrl : "getAPPVariousTypeOrderList"};
    let id = this.data.clickTabId; 
    if(this.orderType != 4){
        params.orderType = this.orderType;
        params.orderKind = 1;
    }else if (this.orderType == 4 && id != 'refund_money_tab') {
        params.orderType = this.orderType;
        params.orderKind = id == "refund_goods_tab" ? 2 :  id == "swop_tab" ? 3 : 2
        api.reqUrl = "getExAPPVariousTypeOrderList";
    }else if(this.orderType == 4  && id == 'refund_money_tab'){
        api.reqUrl = "getOrderRefundList"
    } 
    console.log({params,api},'params')
    return {params,api}
}

function reset(_onshow=false) {
    if(this.data.clickTabId == 'store_tab'){
        this.data.storeList = [];
        // let temp = this.storePage;
        this.storePage = 1;
        // return _onshow?temp:this.storePage; 
    }else{
        this.data.orderList = [];
        // let temp = this.orderPage;
        this.orderPage = 1;
        // return _onshow?temp > 1 ? temp-1 :temp :this.orderPage; 
    }
}

function checkSearch() {
    let options = this.options||{};
    options.sn && (this.detail = options.sn);
}