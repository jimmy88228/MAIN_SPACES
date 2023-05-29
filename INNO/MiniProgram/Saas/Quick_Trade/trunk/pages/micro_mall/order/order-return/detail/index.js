import WxApi from "../../../../../common/utils/wxapi/index";
const App = getApp();
let regTrim = /^[A-Za-z0-9]*$/;
Page(App.BP({
    data: {
        mainColor:App.SH.pageStyleObj['main-color'],
        return_order: "",
        exchage_info: {},
        shipping_num: "",
        sys_return_address: "",
        sys_config: {},
        isOrderCancell:false,
        returnMethodsArr:[{key:'online',name:"线上退货"},{key:'store',name:"线下退货"}],
        refundMethodsArr:[{key:'weChat',name:"微信原路返回"},{key:'store',name:"线下退款"}],
        curReturnType:"online",
        curRefundType:"weChat",
        isInited:false, 
        formData: { 
          explain: "", 
        },
        explainNum: 0,
        limitNum: 50,
        remarks_val: '',
        show_remarks_val: true,
        remarks_focus: false,
    },
    options: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.options = options;
        let pageStyle = this.data.pageStyle;
        this.setData({options,pageStyle:pageStyle+='background:#fff;'});
        this.setView({ 
          confirmPopRef: { get: () => this.findView("#confirmPop") }, 
        })
    },
    onUnload(){
        checkShipping("remove");
    },
    onShow() {
        checkShipping.call(this);
        this.loadData();
    },
    onPullDownRefresh() {
      this.loadData()
    },
    loadData() {
      getAfterSaleStatusRecord.call(this);
      return getAfterSaleOrderDetail.call(this);
    },
    changeVal: function(e) {
        var dataset = e.currentTarget.dataset;
        var key = dataset.key;
        var val = e.detail.value;
        let data = this.data[key];
        console.log('changeVal',val)
        if(regTrim.test(val)){
            data = val;
        }
        this.setData({
            [key]: data
        })
    },
    saveOrderNum: function() {
        this._throttle('saveOrderNum');
        let shipping_num = this.data.shipping_num;
        let shipping_Company = this.data.shipping_Company||{};
        let isOnline = !!(this.data.curReturnType == 'online');
        let err = "";
        if(isOnline){
          if (!shipping_num) {
              err = "请输入物流单号"; 
          }else if(!shipping_Company || !shipping_Company.shippingId){
              err = "请选择快递公司"; 
          }
        }
        if(err){
            App.SMH.showToast({
                title: err,
            });
            return
        }
        let params = {
          refundType:2,
          Id:this.options.alterSaleId||0,
          shippingType:isOnline? 0:1, //0快递配送 , 1到店退
          shippingId:isOnline? shipping_Company.shippingId:0,
          shippingName:isOnline? shipping_Company.shippingName:"",
          invoiceNo:isOnline? shipping_num:"",
        }
        let key = this._throttleApi('saveOrderNum');
        return getUploadShipping(params).then(res=>{
          if(res.code == 1){
            this.loadData().ignore(()=>{
              App.SMH.showToast({title:"信息提交成功"})
            });
          }
          return res;
        })
        .finally(()=>{
          this._throttleApi('saveOrderNum','release',key);
        })
    },
    back: function(e) {
        this._throttle('back');
        wx.reLaunch({
            url: '/' + App.Conf.navConfig.INDEX_PATH,
        })
    },
    onShipping(e){
        this._throttle('onShipping');
        wx.navigateTo({
          url: `/pages/micro_mall/order/order-return/shipping/index`,
        })
    },
    copy(e){
        this._throttle('copy');
        let dataset = e.currentTarget.dataset||{};
        let value = dataset.value ||"";
        wx.setClipboardData({
            data: value
        })
    },   
    onTap(e){
      this._throttle('onTap');
      let {op} = this.getDataset(e);
      let {menuInfo,afterSaleDetail} = this.data;
      let params = {
        check : Number(op),
        Id : Number(this.options.alterSaleId),
        type : afterSaleDetail.refundType == "退款" ? 0:1,
        refundType : (afterSaleDetail.refundType == "退款" || menuInfo.canReceive == 1)?1:0,
      } 
      console.log('params',params);
      let content = `确认${op == 1?'同意':'拒绝'}${afterSaleDetail.refundType}申请吗`;
      this._showModal({title:"提示",content}).then(()=>{
        let key = this._throttleApi('onTap');
        return getCheckAfterSale(params).then(res=>{
          if(res.code == 1){
            this.loadData().ignore(()=>{
              App.SMH.showToast({
                title:"操作成功"
              })
            });
          }
          return res;
        }).finally(()=>{
          this._throttleApi('onTap','release',key);
        })
      })
    },
    refund(){
      this._throttle('refund');
      this.confirmPopRef.showModal(()=>{
        return Promise.resolve(this.data.curRefundType)
      }).then(()=>{
        let params = {
          Id : this.options.alterSaleId,
          refundKind : this.data.curRefundType == 'weChat' ? 0:1,
          actionNote:this.data.formData && this.data.formData.explain || ""
        }
        let key = this._throttleApi('refund');
        return getRefund(params).then(res=>{
          if(res.code==1){
            this.loadData().ignore(()=>{
              App.SMH.showToast({
                title:"操作成功"
              })
            });
          }
          return res;
        }).finally(()=>{
          this._throttleApi('refund','release',key);
        })
      }) 
    },
    radioSel(e){
      console.log(e);
      this.setData({
        curReturnType:e.detail
      })
    },
    refundSel(e){
      console.log(e)
      this.setData({
        curRefundType:e.detail
      })
    }, 
    SetRemark: function (e) {
      let dataset = e.target.dataset || {};
      let key = dataset.key;
      let value = e.detail.value || "";
      let formData = this.data.formData;
      console.log('备注',value.length >= this.data.limitNum,value.length , this.data.limitNum)
      console.log(value)
      if ((value.length >= this.data.limitNum)){
        value = value.slice(0,this.data.limitNum);
      } 
      formData[key] = value;
      this.setData({
        formData: formData,
        explainNum: value.length
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
    handleCopyTap(e) {
      this._throttle('handleCopyTap');
      let text = this.getDataset(e, "text");
      WxApi.setClipboardData({data: text})
    }
}))  
function getAfterSaleOrderDetail() {
    return App.Http.QT_OrderReturnApi.getAfterSaleOrderDetail({
      params:{
        alterSaleId:this.options.alterSaleId||0
      }
    }).then(res => {
      if(res.code == 1){
        let data = res.data||{};
        let {afterSaleDetail,goodsList,menuInfo,returnAddress} = data;
        let staff = returnAddress.returnStaffName && ("  收货人：" + returnAddress.returnStaffName) || "";
        let phone = returnAddress.returnStorePhone && ("  电话：" + returnAddress.returnStorePhone) || "";
        returnAddress.copyText = returnAddress.returnAddress + staff + phone;
        wx.setNavigationBarTitle({
          title: (afterSaleDetail && afterSaleDetail.refundType || "") + '订单详情'
        })
        this.setData({afterSaleDetail,goodsList,menuInfo,returnAddress,isInited:true})
        return res;
      }
      return Promise.reject();
    }).finally(()=>{
        wx.stopPullDownRefresh();
    })
}


function checkShipping(type) {
    if(type == 'remove'){
        App.StorageH.remove('Shipping_Company');
    }else{
        let shipping_Company = App.StorageH.get('Shipping_Company') || {};
        this.setData({
            shipping_Company
        })
    }
}

function updateOrderAction(params){
  return App.Http.BuyApi.Update_Order_action({
    params 
  })
}
function getRefund(params){
  return App.Http.QT_OrderReturnApi.getRefund({
    params
  })
}

function getCheckAfterSale(params){
  return App.Http.QT_OrderReturnApi.getCheckAfterSale({
    params
  })
}

function getUploadShipping(params){
  return App.Http.QT_OrderReturnApi.getUploadShipping({
    params
  })
}

function getAfterSaleStatusRecord(){
  return App.Http.QT_OrderReturnApi.getAfterSaleStatusRecord({
    params:{alterSaleId:this.options.alterSaleId||0}
  }).then(res=>{
    if(res.code == 1){
      this.setData({
        recordList:res.data||[]
      })
    }
  })
}