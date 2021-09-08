// pages/micro_mall/order/apply_return.js
var app = getApp();
Page(app.BP({

    /**
     * 页面的初始数据
     */
    data: {
        brand_info: app.globalData.brand_info,
        returnTab: {
            tab: [
              {
                txt:"退货",
                id:0,
                tip:"已收到货，需要退回收到的货物"
              },
              {
                txt: "仅退款",
                id: 1,
                tip:"未收到货或与商家协商同意只退款"
              },
            ],
            curr: 0,
        },
        reason_list: [],
        canReturnNum: 0,
        sys_config: {},
        isChange:0,
        formData: {
            return_type: 0,
            return_num: 1,
            reason_id: "",
            explain: "",
        },
        formDataArr:[],
        explainNum:0,
        limitNum:300,
        address_data: {
            city: 0,
            city_str: "",
            district: 0,
            district_str: "",
            province: 0,
            province_str: ""
        },
        selectGoods:{},
        remarks_val: '',
        show_remarks_val: true,
        remarks_focus: false,
        remarks_h: 0,
        thisPageHidden: true,
        hasGift: false,
    },
    onLoad: function (options) {
        console.log('options', options);
        decodeFnc.call(this,options);
        let brandInfo = this.data.brand_info || {};
        let rightbutton = brandInfo.icon_url + "micro_mall/rightbutton.png";
        let return_active = brandInfo.icon_url + "micro_mall/return_active.png";
        let return_img = brandInfo.icon_url + "micro_mall/return.png";
        let g_add = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add.png";
        let g_add_none = this.data.brand_info.icon_url + "micro_mall/shopping_cart/g_add_none.png";
        let g_reduce = brandInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
        let g_reduce_none = brandInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
        this.options = options;
        checkBatch.call(this,this.options);
        this.setData({
            g_add: g_add,
            g_add_none: g_add_none,
            rightbutton:rightbutton,
            return_active: return_active,
            return_img: return_img,
            g_reduce: g_reduce,
            g_reduce_none:g_reduce_none,
        })
        csSetShow.call(this)
        checkIsUserAgreement.call(this).then(data =>{
          if(data == 1){
            getUserAgreement.call(this);
          } 
        })
        // initTab.call(this); 
    },
    onShow() {
        getReturnApplyReasion.call(this);
        getReturnApplyDetail.call(this, this.options);
    },
    onReady: function () { },
    onUnload(){
      app.StorageH.remove("userChoiceData");
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
        var value = e.detail.value;
        var formData = this.data.formData;
        formData.reason_id = parseInt(value);
        this.setData({
            formData: formData
        })
    },
    singleSelect: function (e) {
        let dataset = e.currentTarget.dataset;
        let select_id = dataset.select_id;
        let formData = this.data.formData;
        let returnTab = this.data.returnTab;
        returnTab.curr = select_id;
        formData.return_type = select_id;
        this.setData({
            returnTab:returnTab,
            formData: formData,
            isChange: select_id > 1
        })
    },
    SetRemark: function (e) {
        let dataset = e.target.dataset || {};
        let key = dataset.key;
        let value = e.detail.value;
        let cursor = e.detail.cursor || 0;
        let formData = this.data.formData;
        formData[key] = value
        this.setData({
            formData: formData,
            explainNum: cursor
        })
    },
    reduceGoodsNum(e){
      this.changeGoodsNum(e);
    },
    addGoodsNum(e){
      this.changeGoodsNum(e);
    },
    changeGoodsNum(e){
      console.log(e);
      let dataset = e.currentTarget.dataset||{};
      let op = dataset.op||"";
      let index = dataset.index||0;
      let formDataArr = this.data.formDataArr[index] || {};
      console.log('formDataArr',formDataArr)
      let change = false;
      if (op == "add"){
        let order_info = this.data.order_info || {};
        if (parseInt(formDataArr.return_num) < parseInt(formDataArr.canReturnNum)){
        // if (parseInt(formDataArr.return_num) < parseInt(this.data.canReturnNum)){
          formDataArr.return_num++;
          change=true;
        }
      }else{
        if ( 1 < parseInt(formDataArr.return_num)) {
          formDataArr.return_num--;
          change=true;
        }
      }
      if(change){
        this.setData({
          [`formDataArr[${index}]`]:formDataArr
        })
        console.log('formDataArrformDataArr',this.data.formDataArr)
      }
    },
    /*选择地区*/
    // showRegionSelect: function () {
    //     let that = this;
    //     let address_data = this.data.address_data;
    //     this.areaSelect = this.areaSelect || this.selectComponent("#areaSelect");
    //     this.areaSelect.SwitchAreaSelect(address_data, function (info) {
    //         that.setData({
    //             address_data: info
    //         })
    //     });
    // },
    changeAddress(){
        wx.navigateTo({
          url: '/pages/micro_mall/address/address_list',
        })
    },
    showSpec(){
      let selectGoods = this.data.selectGoods || {};
      let productInfo = selectGoods.productInfo || {};
      let data = {
        ...this.options,
      }
      data.product_id = productInfo.product_id || data.product_id;
      this.specView = this.specView || this.selectComponent("#specView");
      console.log(data,"specView");
      this.specView.initData(data); 
    },
    confirmSelectCallback(e){
      let detail = e.detail || {};
      this.setData({
          selectGoods: detail, 
      })
    },
    confirmReturn: function () {
        if(!this.clickHold('confirmReturnId',1500))return 
        let that = this;
        let formData = this.data.formData;
        let formDataArr = this.data.formDataArr;
        let tip = "";
        if (formData.return_num == 0) {
            tip = "退货数量不能为空！";
        } else if (typeof (formData.reason_id) == "string" && !formData.reason_id) {
            tip = "请选择退货原因！";
        } 
        // else if (!formData.explain) {
        //     tip = "请填写具体原因!";
        // }
        if (tip) {
            app.SMH.showToast({
                "title": tip
            })
            return;
        }
        let detailList = getDetailList.call(this,formDataArr)||[];  
        let result = getDataParams.call(this,formData,formDataArr,detailList)||{};
        let dataParams = result.dataParams;
        let url = result.url;
        console.log('result',result);
        return app.BuyApi[url]({
            data: {...dataParams},
            other: { isShowLoad: true }
        }).then(e => {
            if (e.code == "1") {
                wx.showModal({
                    title: "提示",
                    content: "退货申请已受理，将在1-3个工作日完成审核。审核通过后，请根据提示的退货地址按要求寄回商品。",
                    showCancel: false,
                    confirmText: "完成",
                    success(res) {
                        if (res.confirm && that.options.valet != '1') {
                            wx.redirectTo({
                                url: "/pages/micro_mall/order/order_list?orderType=order_exchange"
                            })
                        }
                        if (res.confirm && that.options.valet == '1') {
                            if (that.options.is_user == '0') {
                                wx.redirectTo({
                                    url: "/pages/micro_mall/order/assist_guest?orderType=order_exchange"
                                })
                            }
                            if (that.options.is_user == '1') {
                                wx.redirectTo({
                                    url: "/pages/micro_mall/order/order_list?orderType=order_exchange"
                                })
                            } 
                        }
                    }
                })
                return Promise.resolve(e);
            }
            app.SMH.showToast({
                "title": e.msg || "申请失败"
            })
            return Promise.reject();
        })
    },
    createExchangeReshipOrder(){
      let address_data = this.data.address_data;
      let goods_info = this.data.formDataArr[0] || {};
      let formData = this.data.formData || {};
      let options = this.options || {};
      let res_key_list = this.data.res_key_list || [];
      let selectGoods = this.data.selectGoods || {};
      let productInfo = selectGoods.productInfo || {}
      let warn = "";
      if (!productInfo.product_id){
        warn = "请选择规格"
      }
      else if ((typeof (formData.reason_id) == "string" && !formData.reason_id) ) {
        warn = "请选择原因"
      }
      // else if (!formData.explain) {
      //   warn = "请填写具体原因"
      // }
      else if (!address_data.address_id){
        warn = "请选择地址"
      }
      if (warn){
        app.SMH.showToast({
          title: warn
        })
        return;
      }
      let reason_id = res_key_list[parseInt(formData.reason_id)].id;
      let reqData = {
        "recId": options.rec_id,
        "relatedOrderId": options.order_id,
        "userToken": app.LM.userToken,
        "returnReasonId": reason_id,
        "returnRemark": formData.explain || "",
        "addrId": address_data.address_id || 0,
        "goodsId": goods_info.goodsId,
        "goodsType": goods_info.goodsType,
        "returnGoodsnum": goods_info.return_num,
        "productId": productInfo.product_id || goods_info.productId,
        "brandCode": app.Conf.BRAND_CODE,
      }
      if (this.clickState){return}
      this.clickState = true;
      return app.BuyApi.createExchangeReshipOrder({
        data: reqData,
        other:{
          isShowLoad:true
        }
      }).then( res=>{
        if(res.code == 1){
          if(res.data != 1){
            app.SMH.showToast({
              "title": e.msg || "申请失败"
            })
            return Promise.reject(res);
          }
          app.StorageH.remove("userChoiceData");
          wx.showModal({
            title: "提示",
            content: "换货申请已受理，将在1-3个工作日完成审核。审核通过后，请根据提示的换货地址按要求寄回商品。",
            showCancel: false,
            confirmText: "完成",
            success(res) {
              if (res.confirm && options.valet != '1') {
                wx.redirectTo({
                  url: "/pages/micro_mall/order/order_list?orderType=order_swop"
                })
              }
              if (res.confirm && options.valet == '1') {
                if (options.is_user == '0') {
                  wx.redirectTo({
                    url: "/pages/micro_mall/order/assist_guest?orderType=order_exchange"
                  })
                }
                if (options.is_user == '1') {
                  wx.redirectTo({
                      url: "/pages/micro_mall/order/order_list?orderType=order_swop"
                  })
                }
              }
            }
          })
          return Promise.resolve(res);
        }
        app.SMH.showToast({
          "title": e.msg || "申请失败"
        })
        return Promise.reject(res);
      }).finally(()=>{
        this.clickState = false
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

function initTab(info={}){
  if(this.batch) {
    setPageHide.call(this);
    return;
  }
  if (this.initStatus) return;
  this.initStatus = true;
  app.SMH.showLoading();
  let p1 = new Promise((rs, rj)=> { app.sysTemConfig("activate_order_only_refund").then(data=>{ rs(data) }).catch(()=>{rj()})});
  let p2 = new Promise((rs, rj)=> { app.sysTemConfig("activate_order_exchange").then(data=>{ rs(data) }).catch(()=>{rj()})});
  return Promise.all([p1,p2]).then(res=>{
    let returnT = this.data.returnTab || [];
    if(res[0].Value != 1){//仅退款
      for(let i = 0; i < returnT.tab.length; i++){
        if(returnT.tab[i].id == 1){
          returnT.tab.splice(i,1);
          break;
        }
      }
    }
    if(res[1].Value == 1 && info && info.can_exchange=='1'){//换货
      returnT.tab.splice(1, 0, {
        txt: '换货',
        id: 2,
        tip:"已收到货并与商家协商同意换货"
      })
    }
    this.setData({
      returnTab: returnT
    })
    setPageHide.call(this);
  }).catch(()=>{
    setPageHide.call(this);
  })
}
function setPageHide(){
  app.SMH.hideLoading();
  if(this.data.thisPageHidden) {
    this.setData({
      thisPageHidden: false
    })
  }
  // this.initStatus = false;
}
//申请详情
function getReturnApplyDetail(options = {}) {
    return app.BuyApi.getALLOrderEntity({
        params: {
            orderId: options.order_id,
            brandCode: app.Conf.BRAND_CODE,
            userToken:app.LM.userToken
        }, other: { isShowLoad: true }
    }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            let goods_list = data.orderDetailList;  
            let order_info = data.orderEntity;
            let userChoiceData = app.StorageH.get("userChoiceData") || {};
            initTab.call(this,order_info); 
            formDataInit.call(this,goods_list);
            let addressData = {};
            if(userChoiceData.selectAddr){
              addressData = userChoiceData.selectAddr || {}
              addressData.regionAddr = addressData.province_str + addressData.city_str + addressData.district_str
            }else{
              addressData = {
                address_id:0,
                address: order_info.Address,
                regionAddr: order_info.RegionAddr,
                consignee: order_info.consignee,
                mobile: order_info.mobile,
              }
            }
            this.setData({
                order_info: order_info,
                address_data:addressData
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}
//申请原因
function getReturnApplyReasion() {
    return app.BuyApi.getOrderReturnReasonList({
        params: {
            brandCode: app.Conf.BRAND_CODE
        }, other: { isShowLoad: true }
    }).then(e => {
        if (e.code == "1") {
            let reason_list = e.data||[];
            let res_list = [], res_key_list = [];
            for(let i = 0,len=reason_list.length;i<len;i++){
              let reason = reason_list[i].reason;
              let id = reason_list[i].id;
              res_list.push(reason);
              res_key_list.push({
                  id: id,
                  resaon: reason
              })
            }
            this.setData({
                reason_list: res_list,
                res_key_list: res_key_list
            })
            return Promise.resolve(e);
        }
        return Promise.reject();
    })
}

function checkIsUserAgreement(){
  return app.UserApi.checkIsUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: "RETURN" // USER:会员，RETURN:退换货
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      return Promise.resolve(res.data);
    }
    return Promise.reject();
  })
}

function getUserAgreement(){
  return app.UserApi.getUserAgreement({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      agreementType: "RETURN" // USER:会员，RETURN:退换货
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      this.setData({
        articleList: data.child_article || []
      })
    }
    return Promise.reject();
  })
}


function csSetShow() {
    if (app.Conf.brandConf && app.Conf.brandConf.showContact) {
        let cs = this.selectComponent('#csId');
        cs.setShow();
    }
}

function formDataInit(data=[]){
  if(this.formDataArrInited)return;
  data = data||[];
  let options = this.options||{};
  let formDataArr = this.data.formDataArr||[];
  let rec_id = ',' + options.rec_id + ',';
  let product_id = ',' + options.product_id + ',';
  let goods_id = ',' + options.goods_id + ',';
  let hasGift = false;
  for (let i in data) {
    let init = {
      return_num : (parseInt(data[i].goods_num) - parseInt(data[i].return_goods_number)),
      canReturnNum:0
    };
    let checkRecId = false;
    let checkGoodsId = false;
    init = {
      ...init,
      ...data[i],
      canReturnNum : parseInt(data[i].goods_num) - parseInt(data[i].return_goods_number)
    };
    if ((rec_id && rec_id.indexOf(',' + data[i].rec_id + ',') != -1)) {
      checkRecId = true;
    }
    if ((goods_id && goods_id.indexOf(',' + data[i].goodsId + ',') != -1)) {
      checkGoodsId = true;
    }
    if (product_id.indexOf(',' + data[i].productId + ',') != -1 && checkRecId && checkGoodsId) {
      formDataArr.push(init);
      if(data[i].goodsType == "99" && !hasGift){
        hasGift = true
      }
      if(!this.batch)break
    }
    
  }
  this.setData({
    formDataArr,
    hasGift: hasGift
  });
  this.formDataArrInited = true;
}

function checkBatch(options){
  options = options ||{};
  if((options.rec_id && options.rec_id.indexOf(',')!=-1) && options.product_id && options.product_id.indexOf(',')!=-1){
    this.batch = true;
  }
}

function decodeFnc(options){
  options = options||{};
  let arr = ['goods_id','product_id','rec_id'];
  arr.forEach(item=>{
    if(options[item]){
      options[item] = decodeURIComponent(options[item]);
    }
  })
}

function getDetailList(arr=[]){
  arr = arr || [];
  let detail = [];
  arr.forEach((item,i)=>{
    detail[i] = detail[i] || {}; 
    detail[i].goodsId = item.goodsId;
    detail[i].recId = item.rec_id
    detail[i].productId = item.productId;
    detail[i].goodsType = item.goodsType
    detail[i].returnGoodsnum = item.return_num
  })
  return detail;
}

function getDataParams(formData={},formDataArr,detailList){
  let res_key_list = this.data.res_key_list;
  let address_data = this.data.address_data;
  let reason_id = res_key_list[parseInt(formData.reason_id)].id;
  this.clickState = false;
  let dataParams = {
    "userToken": app.LM.userToken,
    "relatedOrderId": this.options.order_id,
    "bankName": "",
    "bankUser": "",
    "bankAccount": "",
    "returnType": 1,
    "returnReasonId": reason_id,
    "returnRemark": formData.explain || "",
    "consignee": formData.userName || "",
    "telePhone": formData.userMobile || "",
    "districtId": address_data.district || 0,
    "addr": formData.address || "", 
    "refundType": parseInt(formData.return_type), 
    "inAdvance":this.options.inAdvance||0,
    "brandCode": app.Conf.BRAND_CODE, 
  }
  let url = 'createReshipOrder';
  if(detailList.length>1){
    url = 'createBatchReshipOrder';
    dataParams.detailList = detailList;
  }else if(detailList.length==1){
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