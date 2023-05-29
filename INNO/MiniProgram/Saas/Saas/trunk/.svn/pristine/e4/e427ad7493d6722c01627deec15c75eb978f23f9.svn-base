// components/custom/marquee_view.js
const app = getApp();
Component(app.BTAB({
  /**
   * 组件的属性列表
   */
  properties: {
    marqueeData: {
      type: Array,
      default: [],
      observer:function (n) {
        this.initData(n);
      }
    }, 
    baseInfo: {
      type: Object,
      default: {},
    }, 
    cur_ac_id: {
      type: Number,
      default: 0,
    },
  },
  
  data: {
    installData: [],
    swiperH: 150,
    sys_info: {},
    default_bg: "#EB213A",
    // act_count_down:{},
    ac_conf:app.Conf.style.n_sk_color,
    isOnlyOne: false,
  },
  ready() {},
  /**
   * 组件的方法列表
   */
  methods: {
    initScroll(data, baseInfo, id, fromType = '', details={}) {
      return
    },
    initData(data){
      data = data || [];
      try{
        if(data instanceof(Array) && data.length>0){
          this.initId = setTimeout(()=>{
            this.setData({
              installData:data||[]
            })
          },200)
        }
      }catch(error){
        console.log(error)
      }
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
        case "9":
          dataset.name = "SK_HELP";
          break;
      }
      app.pageJump(dataset);
    }
  }
}))

function checkData(data) {
  for (let i in data) {
    data[i].goods_id = data[i].goodsId||0;
    data[i].goods_name = data[i].goodsName||"";
    data[i].goods_thumb = data[i].picture||""; 
    data[i].market_price = data[i].marketPrice||0;
    data[i].activity_id = data[i].activityId||0;
  } 
}