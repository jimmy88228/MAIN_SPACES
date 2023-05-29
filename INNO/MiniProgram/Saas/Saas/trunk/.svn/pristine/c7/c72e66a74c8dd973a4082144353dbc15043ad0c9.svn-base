// pages/micro_mall/invoice/invoice_list/list.js
const app = getApp();
Page(app.BP({ 
  data: {
    list:[{text:"抬头管理"}],
    // list:[{text:"扫码开票"},{text:"抬头管理"}],

  },
  onLoad: function (options) {
    let scan_invoice = this.data.brand_info.default_icon_url + 'scan_invoice.png';
    let title_invoice = this.data.brand_info.default_icon_url + 'title_invoice.png';
    this.setData({
      scan_invoice,
      title_invoice
    })
  }, 
  onShow(){ 
    if(this.onReadyed){
      this.l_box = this.l_box || this.selectComponent('#l_box')||{};
      this.l_box.init();
    }
  },
  onReady: function () {
    this.onReadyed = true;
    this.l_box = this.selectComponent('#l_box')||{};
    this.l_box.init();
  },
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    if(type=="tab"){
      let index = dataset.index;
      // if(index==0){
      //   wx.scanCode({
      //     success:res=>{
      //       let msg = res&&res.errMsg||"";
      //       if(msg.indexOf('ok')!=-1){
      //         let result = res.result||"";
      //         let type = "OFFLINE";
      //         wx.navigateTo({
      //           url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=invoice&order_type=${type}&sn=${result}`,
      //         })
      //         // getOrderInfo.call(this,201912241700||result);
      //       }
      //     },
      //     fail:res=>{
      //       console.log('扫码 fail',res)
      //     },
      //     complete:res=>{
      //       console.log('扫码 complete',res)
      //     }
      //   })
      // }else 
      if(index == 0){
        wx.navigateTo({
          url: '/pages/micro_mall/invoice/title_manager/title_manager',
        })
      }
    }
  }
}))
 


function getOrderInfo(id){
  return app.BuyApi.getALLOrderEntity({
    params: {
      orderId: id,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(res=>{
    if (res.code == "1") {
      let data = res.data;
      let order_info = data.orderEntity||{};
      let electricEntity = data.electricEntity;
      if(order_info.is_allow_electric==1){
        let sn = order_info.order_sn||"";
        let price = order_info.order_amount;
        let type = "OFFLINE"
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=invoice&order_type=${type}&sn=${sn}&price=${price}`,
        })
      }else if(electricEntity && electricEntity.taskId){
        wx.navigateTo({
          url: `/pages/micro_mall/invoice/invoice_detail/detail?id=${electricEntity.taskId}`,
        })
      }
    }
  })
}