import strH from "../../../../common/helper/handle/strHandle.js"
//createJsonByKey
var app = getApp();
Page(app.BP({
    data: {
        commission:false,
        productList:{},
        hasNoDelivery:false,
    },
    onLoad: function(options) {
        this.options = options;
        this.setData({
            commission: options.commission == 'true'? true : false,
            staffPrice: options.staffPrice,
            showCommAmount: options.showCommAmount || '0',
            relationType: options.relationType
        })

      getStaffCode.call(this);
      loadData.call(this);
    },
    onReady: function() {
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },
    goShipping(e) {
        let shippingNo = e.currentTarget.dataset.shippingNo;
        let orderId = this.orderId;
        wx.navigateTo({
            url: `/pages/micro_mall/shipping_info/shipping_info?invoiceNo=${shippingNo}&orderId=${orderId}`
        });
    },
    copy(){
      if (this.isLoadingBtn) return
      isLoadingBtn.call(this);
      wx.setClipboardData({
        data: this.data.order_info.order_sn || ""
      })
    }
}))

function loadData() {
    app.CL_DistrApi.orderInfo({
        params: {
            "orderSn": this.options.sn || '',
            // brandCode: app.Conf.BRAND_CODE,
            // userToken: app.LM.userKey
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        if (res.code == 1) {
            const data = res.data || {};
            let orderDeliveryInfoList = data.orderDeliveryInfoList || [];
            let order_detail_list = data.goodsList || [];
            let order_info = data.orderInfo || {};
            // let order_shipping_list = data.orderShippingList || [];
            // let order_entity = data.orderEntity || {};
            let orderUserInfo = data.orderUserInfo || {};
            let goodsCommDetailList = data.orderGoodsCommDetailList || []
            let productList = strH.createJsonByKey(order_detail_list,"productId"); 
            for(let i = 0; i < orderDeliveryInfoList.length; i++){
              let goodsList = orderDeliveryInfoList[i].deliveryGoodsList;
              let invoice_no = orderDeliveryInfoList[i].invoice_no;
              orderDeliveryInfoList[i].invoiceList = invoice_no ? invoice_no.split("#") : []; 
              for (let j = 0; j < goodsList.length; j++){
                let item = goodsList[j];
                let productItem = productList[item.product_id];
                if(productItem){
                  productItem.hasDelivery = true;
                }else{
                  if (!this.data.hasNoDelivery){
                    this.setData({
                      hasNoDelivery: true
                    })
                  }
                }
                item = {
                  ...item,
                  ...productItem
                }
                orderDeliveryInfoList[i].deliveryGoodsList[j] = item;
              }
            }
            let goodsCommDetail = {}
            for(let i = 0; i < goodsCommDetailList.length; i++){
              let goodsId = goodsCommDetailList[i].goodsId;
              let productId = goodsCommDetailList[i].productId;
              goodsCommDetail[goodsId+"_"+productId] = goodsCommDetailList[i]
            }
            this.setData({
              hasDelivery:orderDeliveryInfoList.length>0,
              hasNoDelivery:orderDeliveryInfoList.length<=0,
            })
            this.orderId = order_info.orderId || 0;
            this.setData({
                orderDeliveryInfoList:orderDeliveryInfoList,
                order_detail_list: order_detail_list,
                order_info: order_info,
                cardNum: orderUserInfo.cardNum || '',
                realName: orderUserInfo.realName || '',
                // productList:productList,
                // orderShippingList: order_shipping_list.map(item => {
                //     let invoice = item.invoice_no;
                //     return Object.assign(item, {
                //         invoiceList: (~~invoice.indexOf('#') == 0) ? [invoice] : invoice.split('#')
                //     });
                // }),
                // orderId: order_entity.order_id || 0,
                goodsCommDetail: goodsCommDetail
            })
            console.log("orderDeliveryInfoList",this.data.orderDeliveryInfoList)
            console.log("order_detail_list",this.data.order_detail_list)
        }
    })
}

function getStaffCode() {
  let code = app.LM.staffInfo.staffCode || "";
  this.setData({
    code: code
  })
}


function isLoadingBtn(time = 350) {
  this.isLoadingBtn = true;
  this.isLoadingBtnId = setTimeout(() => {
    this.isLoadingBtn = false
  }, time)
}
