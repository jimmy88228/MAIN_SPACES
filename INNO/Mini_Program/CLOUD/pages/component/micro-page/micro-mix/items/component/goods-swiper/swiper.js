// pages/component/micro-page/items/component/swiper/swiper.js
const app = getApp();
import mcBehavior from '../../../../help/mc-behavior.js'
const tempData = [{},{},{}]
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    goodsList: {
      type: Array,
      value: [],
      observer: function (n, o) {
        n && this.loadData(n);
      }
    },
    dt: {
      type: Object,
      value: {},
      observer: function (n, o) {
        this.init(n);
      }
    },
    isInited: {
      type: Boolean,
      value: false,
    },
    
  },
  attached() {
    this.readyed = true;
  },
  data: {
    autoplay: true,
    current: 0,
    interval: 5000,
    duration: 500,
    circular: false,
    vertical: false
  },
  ready() {
  },
  methods: {
    loadData(data) {
      this.setData({
        current:0,
        swiperData:data,
        isEmpty:this.data.isInited && (!data || (data && data.length<=0))
      })
      // console.log('初始化 init goods-swiper loadData', data,'isEmpty:',this.data.isEmpty,this.data._data.moduleId);
      if(data&&data.length>0){
        this.initHeight();
      }else{
        this.itemRefresh();
      }
    },
    init(data) {
      let _data = data || {};
      let layoutRow = 0;
      let layout = _data.layout || "";
      switch (layout) {
        case "one":
          layoutRow = 1;
          break;
        case "two":
          layoutRow = 2;
          break;
        case "three":
          layoutRow = 3;
          break;
      }
      _data.layoutRow = layoutRow;
      this.setData({
        _data,
      })
    },
    initHeight() { //swiper高度设置
      let that = this;
      let query = this.createSelectorQuery();
      query.select('#listItemId0').boundingClientRect();
      query.exec(res=>{
        // console.log('initHeight',res,this.data._data.moduleId);
        let item = res[0]||{};
        this.setData({
          swiperH: item.height ? item.height + (this.data.isInited?30:0) : 250
        })
        this.itemRefresh();
      })
    },
    onChange(e) { 
    },
  }
}))
