// pages/component/custom/marquee_view.js
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    marqueeData: {
      type: Array,
      default: [],
    },
    act_count_down: {
      type: Object,
      value: {},
    },
    sysConf: {
      type: Object,
      value: {}
    },  
    showSalesVolume: {
      type: Boolean,
      default: false,
    },
  },
  data: {
    installData: [],
    swiperH: 245,
    sys_info: {},
    default_bg: "#EB213A",
    // act_count_down:{},

    isOnlyOne: false,
  },
  ready() {},
  /**
   * 组件的方法列表
   */
  methods: {
    initScroll(data, baseInfo, id, fromType = '', details={}) {
      console.log(data, "initScroll");
      if (!data) return
      let tempData = JSON.parse(JSON.stringify(data));
      baseInfo = baseInfo ||{};
      this.id = id || '';
      this.setSwiperH();
      checkData.call(this, tempData,baseInfo);
      this.setData({
        installData: tempData,
        baseInfo: baseInfo || {},
        fromType:fromType,
        details: details,
        activite_item:(baseInfo.bindType == 7 || baseInfo.bindType == 8 || baseInfo.bindType == 10 || baseInfo.bindType == 11|| baseInfo.bindType == 12)? true:false
      });
     
    },
    setTimeDown(act_count_down) {
      this.setData({
        act_count_down: act_count_down
      })
    },
    setSwiperH() {
      let that = this;
      setTimeout(()=>{
        let query = that.createSelectorQuery();
        query.select('#init_H0').boundingClientRect();
        query.exec(function (res) {
          // console.log('setSwiperH', res, that.id)
          if (res[0]) {
            that.setData({
              swiperH: res[0].height ? res[0].height + 6 : 245
            })
          }
          if (that.id) {
            app.EB.call(that.id, that);
          }
        })
      },600)
    },
    pageJump(e) {
      var dataset = e.currentTarget.dataset;
      if (this.data.fromType=='classify'){
        this.triggerEvent('jump',true);
      }
      let baseInfo = this.data.baseInfo || {};
      let bindType = baseInfo.bindType + "";
      switch (bindType){
        case "1":
          dataset.name = "GOODS";
          break;
        case "2":
          dataset.name = "GOODS_LIST";
          break;
        case "7":
          dataset.name = "SECKILL";
          break;
        case "8":
          dataset.name = "COLLAGE";
          break;
      }
      app.pageJump(dataset);
    }
  }
}))

function checkData(data,baseInfo={}) {
  let j = 0;
  baseInfo = baseInfo||{};
  for (let i in data) {
    if(baseInfo.bindType == '10'){
      data[i].goods_id = 1;
      data[i].goods_name = data[i].goods_name||"";
      data[i].goods_thumb = data[i].act_img||""; 
      data[i].market_price = data[i].max_presale_price||0;
      data[i].price = data[i].min_presale_price||0;
    }else if(baseInfo.bindType == '11'){
      data[i].goods_id = data[i].goods_id;
      data[i].goods_name = data[i].name||"";
      data[i].goods_thumb = data[i].picture||""; 
      data[i].market_price = data[i].market_price||0;
      data[i].price = data[i].sale_price||0;
      data[i].integral = data[i].integral||0;
    }else if(baseInfo.bindType == '12'){
      data[i].goods_id = 0;
      data[i].goods_name = data[i].goodsName||"";
      data[i].goods_thumb = data[i].activityImg||""; 
      data[i].market_price = data[i].maxMarketPrice||0;
      data[i].price = data[i].minBottomPrice||0;
    }
    j++;
  }
  let isOnlyOne = j;
  this.setData({
    isOnlyOne: isOnlyOne,
  })
}