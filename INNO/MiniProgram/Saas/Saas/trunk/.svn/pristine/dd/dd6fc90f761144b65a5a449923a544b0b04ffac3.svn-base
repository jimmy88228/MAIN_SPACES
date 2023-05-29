var app = getApp();
var wxbarcode = require('./utils/index.js');
Page(app.BP({
    data: {
        brand_info: app.globalData.brand_info,
        order_id: 0,
        erp_info: {},
        order_code_url: "",
        isShow: true
    },

    onLoad: function (options) {
        let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg";
        this.options = options;
        this.setData({
            order_sn: options.order_sn,
            empty_url: empty_url
        })
        // sysTemConfig.call(this,'electric');
    },


    onReady: function () {
        let bg_color = app.getColor(this.data.brand_info.style.bg_color, 28, 31, 30, 1);
        this.setData({
            bg_color: bg_color
        })
    },


    onShow: function () {
        var that = this;
        this.orderInfoInit();
        this.pageHome = this.pageHome || this.selectComponent("#pageHome")
        this.pageHome && this.pageHome.initPageHome();
    },

    /**
     *去评价 
     */
    toComment: function (e) {
        // var order_sn = e.currentTarget.dataset.orderSn;
        let erp_info = this.data.erp_info||{};
        let order_sn = erp_info.order_sn||'';
        let order_id = erp_info.order_id||0;
        let goods_list = erp_info.goods_list||[];
        if(goods_list.length==1){
            let goods_id = goods_list[0].goods_id||0;
            let goods_sn = goods_list[0].goods_sn||0;
            wx.navigateTo({
                url: `/pages/micro_mall/comment/comment_edit/comment_edit?order_sn=${order_sn}&type=store&order_id=${order_id}&goods_id=${goods_id}&goods_sn=${goods_sn}`,
            })
            return
        }
        wx.navigateTo({
            url: `../comment/mobile_order_comment/mobile_order_comment?order_sn=${order_sn}&type=store`,
        })
    },
    jump_detail: function (e) {
        const id = e.currentTarget.dataset.id;
        if (id != 0) {
            wx.navigateTo({
                url: `/pages/micro_mall/goods/goods_info?goods_id=${id}`
            })   
        }
    },
    orderInfoInit: function (order_id) {
        wx.showLoading();
        var that = this;
        var brand_info = this.data.brand_info;
        console.log(brand_info)
        var readata = {
            order_sn: order_id
        }
        // app.wxReq("", "order_getErpOrderInfo", readata, function (info) {
        //   wx.hideLoading();
        //   if (info.error !=0){
        //     wx.showToast({
        //       title: info.message,
        //       image: '/images/micro_mall/cn/err_tip_icon.png'
        //     })
        //     return;
        //   }
        //   var erp_info = info.data;
        //   erp_info.add_time = erp_info.add_time.replace(/\//g, '.');
        //   var order_code_url = brand_info.createQrCodeUrl + '?text=' + erp_info.order_sn + '&scale=3&font=no';
        //   that.setData({
        //     erp_info: erp_info,
        //     order_code_url: order_code_url
        //   })

        // })
        app.BuyApi.getStoreOrderDetail({
            data: {
                orderSn: this.options.order_sn,
                brandCode: app.Conf.BRAND_CODE
            },
            other: {
                isShowLoad: true
            }
        }).then(e => {
            if (e.code == "1") {
                wx.hideLoading();
                var erp_info = e.data;
                let clone = { ...erp_info};
                clone.order_amount = parseFloat(Number(clone.order_amount).toFixed(2));
                // var order_code_url = brand_info.createQrCodeUrl + '?text=' + erp_info.order_sn + '&scale=3&font=no';
                that.setData({
                    realWidth: realMarker.call(that, 479, 120).width,
                    realHeight: realMarker.call(that, 479, 120).height
                })
                wxbarcode.barcode('barcode', clone.order_sn, 479, 120);
                that.setData({
                    erp_info: clone,
                    isShow: false
                    // order_code_url: order_code_url
                })
                return Promise.resolve(e);
            }
            return Promise.reject();
        })
    },

    onTurnBack: function () {
        wx.redirectTo({
            url: 'order_list?order_type=store'
        }) 
    },
    onTap(e){
        let dataset = e.currentTarget.dataset||{};
        let type = dataset.type||"";
        if(type=='issue_invoice'){
            let type = "OFFLINE";
            let order_info = this.data.erp_info||{};
            wx.navigateTo({
              url: `/pages/micro_mall/invoice/issue_manager/issue_manager?type=invoice&order_type=${type}&sn=${order_info.order_sn||""}&price=${order_info.order_amount}`,
            })
          }else if(type=='detail_invoice'){
            let order_info = this.data.erp_info||{};
            let type = "OFFLINE";
            wx.navigateTo({
              url: `/pages/micro_mall/invoice/invoice_detail/detail?id=${order_info.electric_task_id||0}&sn=${order_info.order_sn||""}&price=${order_info.order_amount}`,
            })
          }
    }
}))
function realMarker(w, h) {
    let [scale, tranferWidth, tranferHeight] = [0, 0, 0];
    wx.getSystemInfo({
        success(res) {
            scale = (750 / res.windowWidth).toFixed(2);
            tranferWidth = (w / scale).toFixed(2);
            tranferHeight = (h / scale).toFixed(2);
        }
    });
    return {
        width: Math.ceil(tranferWidth),
        height: Math.ceil(tranferHeight)
    };
}