// pages/component/micro-page/items/component/ad-swiper/swiper.js
const app = getApp();
import mcBehavior from '../../../../help/mc-behavior.js'
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (n, o) {
        // console.log('???',n,this.readyed)
        // if (!this.readyed) return
        n && this.init(n);
      }
    },
    _data: {
      type: Object,
      value: {},
      observer: function (n, o) {
        // if (!this.readyed || !n) return
        this.initData(n);
      }
    },
    type:{
      type:String,
      value:""
    }
  },
  attached() {
    this.readyed = true;
  },
  data: {
    cg_current:0,
    vertical: false,
    circular:true,
    duration: 500,
    interval: 5000,
  },
  ready() {
    setTimeout(()=>{
      this.initHeight();
    },500)
  },
  methods: {
    init(data) {
      // console.log('init ad-swiper', data);
      this.setData({
        current:0,
        swiperData: data
      })
    },
    initData(data) {
      console.log('initData swiper', data)
      let _data = data || {};
      _data.row = 1;
      let layoutRow = 0;
      _data.layout = 'one' //广告位轮播 暂时只有一行一个
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
        infoData: _data
      })
      console.log('infoDatainfoData',this.data.infoData)
    },
    initHeight() { //swiper高度设置
      let that = this;
      let query = this.createSelectorQuery();
      query.select('#listItemId').boundingClientRect();
      query.exec(function (res) {
        console.log('resres', res)
        if (res[0]) {
          that.setData({
            swiperH: res[0].height ? res[0].height : 250
          })
        }
      })
    },
    onChange(e) {
      let current = e.detail.current;
      this.setData({
        cg_current:current
      })
    },
  }
}))
