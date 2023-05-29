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
                id:2
              },
              // {
              //   txt: "换货",
              //   id: 3
              // },
              {
                txt: "仅退款",
                id: 1
              },
            ],
            curr: 2,
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
        limitNum:200,
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
        thisPageHidden: true
    },
    onLoad: function (options) {
        console.log('options', options);
        // decodeFnc.call(this,options);
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
            isChange: select_id == 3
        })
    },
    SetRemark: function (e) {
        let dataset = e.target.dataset || {};
        let key = dataset.key;
        let value = e.detail.value || "";
        if (value.length > this.data.limitNum) return 
        let formData = this.data.formData;
        formData[key] = value
        this.setData({
            formData: formData,
            explainNum: value.length
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
        console.log('chg formDataArr',this.data.formDataArr)
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
      let goodsList = this.allInfo && this.allInfo.goodsList||[];
      let productInfo = selectGoods.productInfo || {}; 
      let data = {
        // ...this.options,
        goods_id: goodsList[0] && goodsList[0].goodsId||0
      }
      console.log('selectGoods',selectGoods)
      // data.product_id = productInfo.product_id || data.product_id;
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
        let that = this;
        let formData = this.data.formData;
        let formDataArr = this.data.formDataArr;
        let address_data = this.data.address_data; 
        let selectGoods = this.data.selectGoods || {};
        let productInfo = selectGoods.productInfo || {}
        let tip = "";
        if(formData.return_type == 3){
          if (!address_data.address_id){
            tip = "请选择收货地址"
          }else if(!productInfo.product_id){
            tip = "请确认换货规格";
          }  
        }
        if(!tip){
          if (formData.return_num == 0) {
            tip = formData.return_type == 3? "换货": "退货" + "数量不能为空！";
          } else if (typeof (formData.reason_id) == "string" && !formData.reason_id) {
              tip = `请选择${formData.return_type == 3? "换货": "退货"}原因！`;
          } else if (!formData.explain) {
              tip = "请填写具体原因!";
          }
        } 
        if (tip) {
            app.SMH.showToast({
                "title": tip
            })
            return;
        }
        if(this.clickState) return;
        this.clickState = true;
        let goodsList = getGoodsList.call(this,formDataArr)||[];  
        let result = getDataParams.call(this,formData,formDataArr,goodsList)||{};
        let dataParams = result.dataParams;
        let url = result.url;
        console.log('result',result); 
        let msg = {
          content:"将在1-3个工作日完成审核。审核通过后，请根据提示的换货地址按要求寄回商品。",
          assistUrl:"/pages/micro_mall/order/assist_guest?orderType=order_exchange",
          listUrl:""
        };
        if(formData.return_type == 3){
          msg.content = "换货申请已受理，" + msg.content;
          msg.listUrl = "/pages/micro_mall/order/order_list?orderType=order_swop"
        } else if(formData.return_type == 1){
          msg.listUrl = "/pages/micro_mall/order/order_list?orderType=order_money"
        }else{
          msg.content = "退货申请已受理，" + msg.content;
          msg.listUrl = "/pages/micro_mall/order/order_list?orderType=order_exchange"
        } 
        return app.CL_BuyApi[url]({
            data: {...dataParams},
            other: { isShowLoad: true }
        }).then(e => {
            if (e.code == "1") {
                wx.showModal({
                    title: "提示",
                    content: msg.content,
                    showCancel: false,
                    confirmText: "完成",
                    success(res) {
                        if (res.confirm && that.options.valet != '1') {
                            wx.redirectTo({
                                url: msg.listUrl
                            })
                        }
                        if (res.confirm && that.options.valet == '1') {
                            if (that.options.is_user == '0') {
                                wx.redirectTo({
                                    url: msg.assistUrl
                                })
                            }
                            if (that.options.is_user == '1') {
                                wx.redirectTo({
                                    url: msg.listUrl
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
        }).finally(()=>{
          this.clickState = false;
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
      else if (!formData.explain) {
        warn = "请填写具体原因"
      }
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
        "returnReasonId": reason_id,
        "returnRemark": formData.explain,
        "addrId": address_data.address_id || 0,
        "goodsId": goods_info.goodsId,
        "goodsType": goods_info.goodsType,
        "returnGoodsnum": goods_info.return_num,
        "productId": productInfo.product_id || goods_info.productId,
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

function initTab(menuInfo={}){
  if (this.initStatus) return;
  this.initStatus = true;
  let returnT = this.data.returnTab || [];
  if(menuInfo && (menuInfo.canOnlyRefund!='1')){//仅退款
    for(let i = 0; i < returnT.tab.length; i++){
      if(returnT.tab[i].id == 1){
        returnT.tab.splice(i,1);
        break;
      }
    }
  }
  if(!this.batch && menuInfo && (menuInfo.canExchangeGoods=='1')){//换货
    returnT.tab.splice(1, 0, {
      txt: '换货',
      id: 3
    })
  }
  this.setData({
    returnTab: returnT
  })
  setPageHide.call(this);
  // app.SMH.showLoading();
  // let p1 = new Promise((rs, rj)=> { app.sysTemConfig("activate_order_only_refund").then(data=>{ rs(data) }).catch(()=>{rj()})});
  // let p2 = new Promise((rs, rj)=> { app.sysTemConfig("activate_order_exchange").then(data=>{ rs(data) }).catch(()=>{rj()})});
  // return Promise.all([p1,p2]).then(res=>{
  //   let returnT = this.data.returnTab || [];
  //   if(res[0].Value != 1){//仅退款
  //     for(let i = 0; i < returnT.tab.length; i++){
  //       if(returnT.tab[i].id == 1){
  //         returnT.tab.splice(i,1);
  //         break;
  //       }
  //     }
  //   }
  //   if(res[1].Value == 1 && menuInfo && (menuInfo.canExchangeGoods=='1')){//换货
  //     returnT.tab.splice(1, 0, {
  //       txt: '换货',
  //       id: 3
  //     })
  //   }
  //   this.setData({
  //     returnTab: returnT
  //   })
  //   setPageHide.call(this);
  // }).catch(()=>{
  //   setPageHide.call(this);
  // })
}
function setPageHide(){
  // app.SMH.hideLoading();
  if(this.data.thisPageHidden) {
    this.setData({
      thisPageHidden: false
    })
  }
  // this.initStatus = false;
}
//申请详情
function getReturnApplyDetail(options = {}) {
  app.CL_BuyApi.getOrderDetail({
    params: {
      orderId: options.order_id,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
        if (e.code == "1") {
            let data = e.data;
            this.allInfo = data;
            let goods_list = data.goodsList;  
            let order_info = data.orderInfo;
            let addressInfo = data.addressInfo;
            let menuInfo = data.menuInfo;
            let userChoiceData = app.StorageH.get("userChoiceData") || {};
            initTab.call(this,menuInfo); 
            formDataInit.call(this,goods_list);
            let addressData = {};
            if(userChoiceData.selectAddr){
              addressData = userChoiceData.selectAddr || {}
              addressData.regionAddr = addressData.province_str + addressData.city_str + addressData.district_str
              addressData.detailAddr = addressData.regionAddr + addressData.address
            }else{
              addressData = {
                address_id:0,
                address: addressInfo.address,
                regionAddr: "",
                consignee: addressInfo.consignee,
                mobile: addressInfo.mobile,
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
    return app.CL_BuyApi.getReturnReasonList({
        params: {
          // brandCode: app.Conf.BRAND_CODE
        }, other: { isShowLoad: true }
    }).then(e => {
        if (e.code == "1") {
            let reason_list = e.data||[];
            let res_list = [], res_key_list = [];
            for(let i = 0,len=reason_list.length;i<len;i++){
              let reason = reason_list[i].reason;
              let id = reason_list[i].reasonId;
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
  this.formDataArrInited = true;
  data = data||[];
  let options = this.options||{};
  let formDataArr = this.data.formDataArr||[];
  // let rec_id = ',' + options.rec_id + ',';
  // let product_id = ',' + options.product_id + ',';
  let groupIndex = ',' + options.groupIndex + ',';
  for (let i in data) {
    // let init = {
    //   return_num : (parseInt(data[i].goodsNumber) - parseInt(data[i].returnNumber)),
    //   canReturnNum:0
    // };
    let checkGoodsId = false;
    let init = {
      ...data[i],
      return_num : (parseInt(data[i].sendNumber) - parseInt(data[i].returnNumber)), 
      canReturnNum : parseInt(data[i].sendNumber) - parseInt(data[i].returnNumber),
    };
    if ((groupIndex && groupIndex.indexOf(',' + data[i].groupIndex + ',') != -1)) {
      checkGoodsId = true;
    }
    checkGoodsId && formDataArr.push(init);
    // let checkRecId = false;
    // if ((rec_id && rec_id.indexOf(',' + data[i].rec_id + ',') != -1)) {
    //   checkRecId = true;
    // }
    // if ((goods_id && goods_id.indexOf(',' + data[i].goodsId + ',') != -1)) {
    //   checkGoodsId = true;
    // }
    // if (product_id.indexOf(',' + data[i].productId + ',') != -1 && checkRecId && checkGoodsId) {
    // if (checkGoodsId) {
    //   if(!this.batch)break
    // }
  }
  this.setData({
    formDataArr
  });
  console.log('formDataArr',formDataArr)
}

function checkBatch(options){
  options = options ||{};
  if(options.groupIndex && options.groupIndex.indexOf(',')!=-1){
  // if((options.rec_id && options.rec_id.indexOf(',')!=-1) && options.product_id && options.product_id.indexOf(',')!=-1){
    this.batch = true;
  }
}

function decodeFnc(options){
  // options = options||{};
  // let arr = ['goods_id','product_id'];
  // arr.forEach(item=>{
  //   if(options[item]){
  //     options[item] = decodeURIComponent(options[item]);
  //   }
  // })
}

function getGoodsList(arr=[]){
  arr = arr || [];
  let detail = [];
  arr.forEach((item,i)=>{
    detail[i] = detail[i] || {}; 
    // detail[i].goodsId = item.goodsId;
    // detail[i].recId = item.rec_id
    // detail[i].productId = item.productId;
    // detail[i].goodsType = item.goodsType
    detail[i].groupIndex = item.groupIndex;
    detail[i].returnNumber = item.return_num;
  })
  return detail;
}

function getDataParams(formData={},formDataArr,goodsList){
  let res_key_list = this.data.res_key_list;
  let address_data = this.data.address_data;
  let selectGoods = this.data.selectGoods||{};
  let reason_id = res_key_list[parseInt(formData.reason_id)].id || 0;
  this.clickState = false;
  let dataParams = {
    "orderId": this.options.order_id,
    "applyType": parseInt(formData.return_type), 
    "reasonId": reason_id,
    "remark": formData.explain,
    "addressInfo":{
      "consignee": address_data.consignee || "",
      "mobile": address_data.mobile || "",
      "districtId": address_data.district || 0,
      "address": address_data.detailAddr || address_data.address || "", 
    },
  }
  let url = 'createReturnOrder';
  if(goodsList.length>1){
    url = 'createReturnOrderBatch'; 
    dataParams.goodsList = goodsList;
  }else{
    dataParams.returnNumber = formDataArr[0].return_num;
    dataParams.groupIndex = formDataArr[0].groupIndex;
    dataParams.exchangeProductId = selectGoods.productInfo && selectGoods.productInfo.product_id || 0;
  }
  let result = {
    url,
    dataParams
  }
  return result;
}