const app = getApp();
Component(app.BTAB({
  properties: {
    isHidden: {
      type: Boolean,
      value: false,
      observer: function (nv, ov) {
        if (nv) {
          this.setData({
            anima: "opacity: 0.35;right:-50rpx;transition: right 300ms ease-in-out;"
          });
        } else {
          this.setData({
            anima: "transition: right 300ms ease-in-out;"
          });
        }
      }
    }
  },
  data: {
    isHidden: false
  },
  ready(){
    let sk_record = this.data.brand_info.icon_url + "micro_mall/sec_kill/sk_record.png?123";
    this.setData({
      sk_record
    })
  },
  methods: {
    jump(e) {
      let type = e.currentTarget.dataset.type;
      if (type == "record") {
        wx.navigateTo({
          url: "/pages/micro_mall/sk/orders-sk/order-list",
        })
      }
    },
    init(type='',tips=''){
      this.setData({
        type,
        tips,
      })
    },
    onScroll(o, callBack) {
      if (o.scrollTop < 0) {
        return;
      }
      this.firstScrollTop || (this.firstScrollTop = o.scrollTop);
      var lastSrcollTop = this.lastSrcollTop || 0;
      let dt = o.scrollTop - lastSrcollTop;
      if (Math.abs(o.scrollTop - this.firstScrollTop) > 20) {
        this.firstScrollTop = o.scrollTop;
        this.setData({
          isHidden: dt > 0
        })
        callBack && callBack(dt);
      }
      this.lastSrcollTop = o.scrollTop;
    }
  }
}))
