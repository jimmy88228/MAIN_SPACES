var App = getApp();
Page(App.BP({
  data: {
    returnTab: {
      tab: [{
          txt: "退货",
          id: 2,
          tip: "已收到货，需要退回收到的货物",
        },
        {
          txt: "仅退款",
          id: 1,
          tip: "未收到货或与商家协商同意只退款"
        },
      ],
      curr: 2,
      txt: "退货"
    },
    reason_list: [],
    canReturnNum: 0,
    sys_config: {},
    formData: {
      return_type: 0,
      return_num: 1,
      reason_id: "",
      explain: "",
      reason: "",
    },
    formDataArr: [],
    explainNum: 0,
    limitNum: 200,
    address_data: {
      city: 0,
      city_str: "",
      district: 0,
      district_str: "",
      province: 0,
      province_str: ""
    },
    selectGoods: {},
    remarks_val: '',
    show_remarks_val: true,
    remarks_focus: false,
    remarks_h: 0,
    thisPageHidden: true,
    hasGift: false
  },
  subConfig: {
    type: "AFTER_SALE",
    label: "CONFIRM"
  },
  onLoad: function (options) {
    console.log('options', options);
    let brandInfo = this.data.brand_info || {};
    let rightbutton = brandInfo.icon_url + "micro_mall/rightbutton.png";
    let return_active = brandInfo.icon_url + "micro_mall/return_active.png";
    let return_img = brandInfo.icon_url + "micro_mall/return.png";
    let g_add = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add.png";
    let g_add_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add_none.png";
    let g_reduce = brandInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
    let g_reduce_none = brandInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
    this.options = options;
    this.setData({
      g_add: g_add,
      g_add_none: g_add_none,
      rightbutton: rightbutton,
      return_active: return_active,
      return_img: return_img,
      g_reduce: g_reduce,
      g_reduce_none: g_reduce_none,
    })
    this.init();
  },
  init(){
    get_Order_Return_ReasonList.call(this);
    getOrderDetail.call(this, this.options);
  },
  onUnload() {
    App.StorageH.remove("userChoiceData");
  },
  changeReturnNum(e) {
    var value = e.detail.value;
    var formData = this.data.formData;
    formData.return_num = parseInt(value);
    this.setData({
      formData: formData
    })
  },
  returnReason: function (e) {
    let value = e.detail.value;
    let return_reason_list = this.data.return_reason_list||[]; 
    this.setData({
      'formData.reason': return_reason_list[parseInt(value)]
    })
  },
  singleSelect: function (e) {
    let dataset = e.currentTarget.dataset;
    let select_id = dataset.select_id;
    let txt = dataset.txt;
    let formData = this.data.formData;
    let returnTab = this.data.returnTab;
    returnTab.curr = select_id;
    returnTab.txt = txt || "";
    formData.reason = "";
    formData.return_type = select_id;
    this.setData({
      returnTab: returnTab,
      formData: formData,
    })
  },
  SetRemark: function (e) {
    let dataset = e.target.dataset || {};
    let key = dataset.key;
    let value = e.detail.value || "";
    let formData = this.data.formData; 
    if ((value.length >= this.data.limitNum)){
      value = value.slice(0,this.data.limitNum);
    }  
    formData[key] = value;
    this.setData({
      formData: formData,
      explainNum: value.length
    })
  },
  reduceGoodsNum(e) {
    this.changeGoodsNum(e);
  },
  addGoodsNum(e) {
    this.changeGoodsNum(e);
  },
  changeGoodsNum(e) {
    let dataset = e.currentTarget.dataset || {};
    let op = dataset.op || "";
    let index = dataset.index || 0;
    let goodsList = this.data.goodsList||[];
    let item = goodsList[index] || {};
    let change = false;
    if (op == "add") {
      if (parseInt(item.curReturnNumber) < parseInt(item.canReturnNumber)) {
        item.curReturnNumber++;
        change = true;
      }
    } else {
      if (1 < parseInt(item.curReturnNumber)) {
        item.curReturnNumber--;
        change = true;
      }
    }
    if (change) {
      this.setData({
        [`goodsList[${index}]`]: item
      })
    }
  }, 
  changeAddress() {
    wx.navigateTo({
      url: '/pages/micro_mall/address/address_list',
    })
  },
  showSpec() {
    let selectGoods = this.data.selectGoods || {};
    let productInfo = selectGoods.productInfo || {};
    let data = {
      ...this.options,
    }
    data.product_id = productInfo.product_id || data.product_id;
    this.specView = this.specView || this.selectComponent("#specView");
    console.log(data, "specView");
    this.specView.initData(data);
  },
  confirmSelectCallback(e) {
    let detail = e.detail || {};
    this.setData({
      selectGoods: detail,
    })
  },
  confirmReturn() {
    let {
      orderInfo,
      formData,
      goodsList,
      returnTab
    } = this.data;
    let tip = "";
    if (formData.curReturnNumber == 0) {
      tip = "退货数量不能为0！";
    } else if (!formData.reason) {
      tip = "请选择退货原因！";
    }
    if (tip) {
      App.SMH.showToast({
        "title": tip
      })
      return;
    }
    let sumNumber = 0;
    goodsList.forEach(item => {
      sumNumber += Number(item.curReturnNumber)
    })
    let key = this._throttleApi('confirmReturn');
    return App.Http.QT_OrderReturnApi.applyAfterSale({
      data: {
        "id": 0, //新增0 只做新增
        "order_goods_id": orderInfo.orderId || 0, //订单商品ID
        "action_note": "申请售后:" + returnTab.txt || "", //操作备注
        "altersale_reason": formData.reason || "", //售后原因
        "altersale_remark": formData.explain || "", //售后说明
        "altersale_type": 1, //0取消，1退货
        "altersale_goodsnum": sumNumber, //售后商品数量
        "shipping_type": 0, //寄回方式，0快递配送，1到店退
        "refund_type": returnTab.curr || 1, //1：仅退款 2：退货退款  
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == "1") {
        // 退货后 调起订阅消息授权
        let orderInfo = this.data.orderInfo||{};
        wx.showModal({
          title: "提示",
          content: "退货申请已受理，将在1-3个工作日完成审核。审核通过后，请根据提示的退货地址按要求寄回商品。",
          showCancel: false,
          confirmText: "完成",
          success(res) {
            if (res.confirm) {
              wx.redirectTo({
                url: `/pages/micro_mall/order/order-return/list/index?searchStr=${orderInfo.orderSn||''}`
              })
            }
          }
        })
        return Promise.resolve(e);
      } else {
        App.SMH.showToast({
          "title": e.msg || "申请失败"
        })
        return Promise.reject();
      }
    }).finally(()=>{
      this._throttleApi('confirmReturn','release',key);
    })
  },
  ShowRemarksVal: function () {
    var show_remarks_val = this.data.show_remarks_val;
    var remarks_focus = this.data.remarks_focus;
    show_remarks_val = !show_remarks_val;
    remarks_focus = !remarks_focus;
    this.setData({
      show_remarks_val: show_remarks_val,
      remarks_focus: remarks_focus
    })
  },
  remarksInput: function (e) {
    var font_num = e.detail.cursor;
    var remarks_val = e.detail.value;
    this.setData({
      font_num: font_num,
      remarks_val: remarks_val
    })
  },

})) 
function setPageHide() {
  App.SMH.hideLoading();
  if (this.data.thisPageHidden) {
    this.setData({
      thisPageHidden: false
    })
  }
  // this.initStatus = false;
}
//申请详情
function getOrderDetail(options = {}) {
  return App.Http.QT_BuyApi.getOrderDetail({
    params: {
      orderId: options.order_id,
      staffType: options.staff_type || 0,
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      let { 
        goodsList, 
        orderInfo, 
      } = data;
      goodsList = goodsList.map(item => ({
        ...item,
        curReturnNumber: 1,
        canReturnNumber: parseInt(item.goodsNumber) - parseInt(item.returnGoodsNumber),
      }))
      this.detailInfo = data;
      this.setData({
        goodsList,
        orderInfo
      })
    }
    return res; 
  }).catch(err => {
    App.SMH.showToast({
      title: err && err.msg || "获取订单信息失败"
    });
    return Promise.reject(err);
  })
}
//申请原因
function get_Order_Return_ReasonList() {
  return App.Http.QT_OrderReturnApi.get_Order_Return_ReasonList({
    params: {}
  }).then(e => {
    if (e.code == "1") {
      let data = e.data || [];
      this.setData({
        return_reason_list: data.map(item => (item.reason || "")),
      })
      return Promise.resolve(e);
    }
    return Promise.reject(e);
  })
}

function formDataInit(data = []) {
  if (this.formDataArrInited) return;
  data = data || [];
  let options = this.options || {};
  let formDataArr = this.data.formDataArr || [];
  let rec_id = ',' + options.rec_id + ',';
  let product_id = ',' + options.product_id + ',';
  let goods_id = ',' + options.goods_id + ',';
  let hasGift = false;
  for (let i in data) {
    let init = {
      return_num: (parseInt(data[i].goods_num) - parseInt(data[i].return_goods_number)),
      canReturnNum: 0
    };
    let checkRecId = false;
    let checkGoodsId = false;
    init = {
      ...init,
      ...data[i],
      canReturnNum: parseInt(data[i].goods_num) - parseInt(data[i].return_goods_number)
    };
    if ((rec_id && rec_id.indexOf(',' + data[i].rec_id + ',') != -1)) {
      checkRecId = true;
    }
    if ((goods_id && goods_id.indexOf(',' + data[i].goodsId + ',') != -1)) {
      checkGoodsId = true;
    }
    if (product_id.indexOf(',' + data[i].productId + ',') != -1 && checkRecId && checkGoodsId) {
      formDataArr.push(init);
      if (data[i].goodsType == "99" && !hasGift) {
        hasGift = true
      }
      if (!this.batch) break
    }

  }
  this.setData({
    formDataArr,
    hasGift: hasGift
  });
  this.formDataArrInited = true;
}

function getDetailList(arr = []) {
  arr = arr || [];
  let detail = [];
  arr.forEach((item, i) => {
    detail[i] = detail[i] || {};
    detail[i].goodsId = item.goodsId;
    detail[i].recId = item.rec_id
    detail[i].productId = item.productId;
    detail[i].goodsType = item.goodsType
    detail[i].returnGoodsnum = item.return_num
  })
  return detail;
}

function getDataParams(formData = {}, formDataArr, detailList) {
  let res_key_list = this.data.res_key_list;
  let address_data = this.data.address_data;
  this.clickState = false;
  let dataParams = {
    "userToken": App.LM.userToken,
    "relatedOrderId": this.options.order_id,
    "bankName": "",
    "bankUser": "",
    "bankAccount": "",
    "returnType": 1,
    "returnReasonId": formData.reason || "",
    "returnRemark": formData.explain || "",
    "consignee": formData.userName || "",
    "telePhone": formData.userMobile || "",
    "districtId": address_data.district || 0,
    "addr": formData.address || "",
    "refundType": parseInt(formData.return_type),
    "inAdvance": this.options.inAdvance || 0,
    "brandCode": App.Conf.BRAND_CODE,
  }
  let url = 'createReshipOrder';
  if (detailList.length > 1) {
    url = 'createBatchReshipOrder';
    dataParams.detailList = detailList;
  } else if (detailList.length == 1) {
    dataParams.goodsId = formDataArr[0].goodsId || 0;
    dataParams.recId = formDataArr[0].rec_id || 0;
    dataParams.goodsType = formDataArr[0].goodsType || 0;
    dataParams.returnGoodsnum = formDataArr[0].return_num || 0;
    dataParams.productId = formDataArr[0].productId || 0;
  }
  let result = {
    url,
    dataParams
  }
  return result;
}