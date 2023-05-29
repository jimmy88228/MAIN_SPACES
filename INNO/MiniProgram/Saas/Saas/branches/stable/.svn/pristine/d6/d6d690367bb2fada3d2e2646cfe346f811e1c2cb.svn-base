var app = getApp();
Page(app.BP({
  data: {
    orderId: '',
    storeLevel: [true, true, true, true, true],
    staffLevel: [true, true, true, true, true],
    mannerLevel: [true, true, true, true, true],
    orderGoodsInfoList: [],
    hasCommentLogistics: false,
      brand_info: app.globalData.brand_info
  },
  buildLevel: function (level) {
    return [true, true, true, true, true].map((item, index) => {
      if (index >= level && level > 0) {
        return false;
      } else {
        return true;
      }
    })
  },

  onLoad: function (options) {
      console.log(options)
      let empty_url = this.data.brand_info.icon_url + "micro_mall/default.jpg";
      this.setData({
          empty_url: empty_url
      })
    this.options = options;
      this.setData({
          orderId: options.order_id,
          order_sn: options.order_sn,
      });
  },

  onReady: function () {},

  onShow: function () {
    getOfflineOrderCommentDetail.call(this,this.options);
  },

  handleScore: function (e) {
    if (this.data.hasCommentLogistics) {
      return;
    }
    const commentType = e.target.dataset.commenttype;
    const clickIndex = +e.target.dataset.index;
    let startScore = this.data[commentType];
    for (let index = 0, len = startScore.length; index < len; index++) {
      if (index > clickIndex) {
        startScore[index] = false;
      } else {
        startScore[index] = true;
      }
    }
    this.setData({
      [commentType]: startScore
    });
  },

  culateLevel: function (list) {
    return list.filter(item => {
      return item === true
    }).length
  },

  confirmComment: function () {
    let options = this.options;
    let storeLevel = this.data.storeLevel;
    let staffLevel = this.data.staffLevel;
    let mannerLevel = this.data.mannerLevel;
    let tip = "";
    if (!this.culateLevel(storeLevel)) {
      tip = "请评论店铺环境质量";
    } else if (!this.culateLevel(staffLevel)) {
      tip = "请评论导购服务";
    } else if (!this.culateLevel(mannerLevel)) {
      tip = "请评论导购仪表";
    }
    if (tip) {
      app.SMH.showToast({
        "title": tip
      })
      return;
    }
    return app.GoodsApi.commentOfflineOrder({
      data: {
        "orderSn": options.order_sn,
        "store_level": storeLevel,
        "staff_level": staffLevel,
        "manner_level": mannerLevel,
        "brandCode": app.Conf.BRAND_CODE
      }, other: { isShowLoad: true }
    }).then(e => {
      if (e.code == "1") {
        app.SMH.showToast({
          title: '评价成功！',
          icon: 'success'
        });
        this.setData({
          hasCommentLogistics: true
        });
        return Promise.resolve(e);
      }
      return Promise.reject();
    })
    // app.wxReq("", "comment_setCommentOrder", reqData, (info) => {
    //   wx.hideLoading();

    //   if (info.error != 0) {
    //     wx.showToast({
    //       image: '/images/micro_mall/cn/err_tip_icon.png',
    //       title: info.message,
    //     });
    //     return;
    //   } else {
    //     wx.showToast({
    //       title: '评价成功！',
    //       icon:'success'
    //     });
    //     this.setData({
    //       hasCommentLogistics: true
    //     });
    //   }
    // })

  }
}))
function getOfflineOrderCommentDetail(options = {}){
  return app.GoodsApi.getOfflineOrderCommentDetail({
    params:{
        orderSn: this.options.order_sn,
      brandCode:app.Conf.BRAND_CODE
    },other:{isShowLoad:true}
  }).then( e=>{
    if(e.code == "1"){
      let data = e.data;
      const orderCommentInfo = data.orderCommentInfo;
      this.setData({
        orderGoodsInfoList: data.orderGoodsInfos,
        storeLevel: this.buildLevel(orderCommentInfo._store_level),
        staffLevel: this.buildLevel(orderCommentInfo._staff_level),
        mannerLevel: this.buildLevel(orderCommentInfo._manner_level),
        hasCommentLogistics: (
          orderCommentInfo._store_level +
          orderCommentInfo._staff_level +
          orderCommentInfo._manner_level
        ) > 0
      });
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}