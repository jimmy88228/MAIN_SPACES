const app = getApp();
Component(
  app.BTAB({
    properties: {
      isLogin:{
        type:Boolean,
        value:false
      },
      package_list: {
        type: Array,
        value: []
      },
      goodsId:{
        type: Number,
        value: 0
      }
    },
    options: {
      styleIsolation: 'apply-shared'
    },
    data: {
      showTip:false,
      actInfo:{}
    }, 
    detached() {
    },
    ready(){
      let bInfo = this.data.brand_info || {};
      this.setData({
        rightbutton: bInfo.icon_url + "micro_mall/rightbutton.png"
      })
    },
    methods: {
      jump_list: function (e) {
        wx.navigateTo({
          url: `/pages/micro_mall/goods_collocation/collocation_list/collocation_list?goods_id=${this.properties.goodsId}`,
        })
      },
      collocationJump: function (e) {
        let package_id = e.currentTarget.dataset.id || 0;
        wx.navigateTo({
          url: `/pages/micro_mall/goods_collocation/goods_collocation?package_id=${package_id}`,
        })
      },
    }
  })
);
