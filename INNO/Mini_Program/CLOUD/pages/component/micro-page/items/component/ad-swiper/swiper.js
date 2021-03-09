// pages/component/micro-page/items/component/ad-swiper/swiper.js
const app = getApp();
Component(app.BTAB({
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
        if (!this.readyed || !n) return
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
      console.log('init swiper', data);
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
      let layout = _data.layout || "";
      layout = 'one'; //暂时只有一行一个
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
        itemData: _data
      })
    },
    initHeight() { //swiper高度设置
      let that = this;
      let query = this.createSelectorQuery();
      query.select('#swiperId').boundingClientRect();
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
