// pages/micro_mall/goods/module/tips/activty_tip.js
import MyDate from '../../../../../support/utils/date-util.js';

let app = getApp();
Component(app.BTAB({
  properties: {
    isTeaser:{
      type:Boolean,
      value:false
    },
    PADDING:{
      type: String,
      value: "10rpx 5rpx 30rpx 5rpx"
    }
  },
  data: {
    activityArr:[],
    teaserArr:[],
    jumpLink:{
      PRESALE:"pages/micro_mall/plugins/presale/presale_activity_detail",
      COLLAGEGROUP:"pages/micro_mall/collageGroup/activity_goods_detail",
      POINTMKT:"pages/micro_mall/point/point_goods_detail/point_goods_detail",
      POINTMK:"pages/micro_mall/point/point_goods_detail/point_goods_detail",
      SECKILL:"pages/micro_mall/sk/goods-info-sk/goods-info-sk",
      BARGAIN:"pages/micro_mall/bargain/goods/goods_detail"
    }
  },
  ready(){
    let teaser = this.data.brand_info.icon_url + "micro_mall/teaser/teaser.png?123";
    let right = this.data.brand_info.icon_url + "micro_mall/teaser/right.png?123";
    let bargain = this.data.brand_info.icon_url + "micro_mall/teaser/bargain.png?123";
    let collage = this.data.brand_info.icon_url + "micro_mall/teaser/collage.png?123";
    let point = this.data.brand_info.icon_url + "micro_mall/teaser/point.png?123";
    let presale = this.data.brand_info.icon_url + "micro_mall/teaser/presale.png?123";
    let seckill = this.data.brand_info.icon_url + "micro_mall/teaser/seckill.png?123";
    let right_brand = this.data.brand_info.icon_url + "micro_mall/teaser/right_brand.png?123";

    this.setData({
      right,
      teaser,
      bargain,
      collage,
      point,
      presale,
      seckill,
      right_brand
    }) 
  },
  methods: {
    loadData(data, goodsId=0) {
      data = data || []; 
      this.goodsId = goodsId || 0;
      let teaserArr = [], activityArr = []
      data.forEach(item => {
        item.startTimeStr = MyDate.format(MyDate.parse(item.startTime || ''), "M月d号 HH:mm");
        if (item.isTeaser) {
          teaserArr.push(item);
        } else {
          activityArr.push(item);
        }
      })
      this.setData({
        activityArr,
        teaserArr,
        showPage: true
      })
    },
    activeJump(e){
      if (this.isJump) return;
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
      let activityId = dataset.activityId || 0;
      let relatedId = dataset.relatedId || 0;
      if (!activityId || !type) return;
      let params = ""
      switch(type){
        case"PRESALE":
          params = `?activity_id=${activityId}`
          break;
        case "COLLAGEGROUP":
          params = `?activity_id=${activityId}`
          break;
        case "POINTMKT":
          params = `?goodsId=${this.goodsId}&mkGoodsId=${activityId}`
          break;
        case "POINTMK":
          params = `?goodsId=${this.goodsId}&mkGoodsId=${activityId}`
          break;
        case "SECKILL":
          params = `?goodsId=${this.goodsId}&activityId=${activityId}&groupId=${relatedId}`
          break;
        case "BARGAIN":
          params = `?activityId=${activityId}`
          break;
      }
      let url = "/" + this.data.jumpLink[type] + params;
      this.isJump = true;
      let that = this;
      wx.navigateTo({
        url: url,
        complete:function(){
          if (that.isJump){
            that.isJump = false
          }
        }
      })
    }
  },
}))

