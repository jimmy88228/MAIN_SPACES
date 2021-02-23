// pages/component/micro-page/items/component/swiper/swiper.js
const app = getApp();
Component(app.BTAB({
  properties: {
    list: {
      type: Array,
      value: [],
      observer: function (n, o) {
        if (!this.readyed) return
        this.init(n);
      }
    },
    _data: {
      type: Object,
      value: {},
      observer: function (n, o) {
        if (!this.readyed || !n) return
        this.initData(n);
      }
    }
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
    this.initHeight();
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
      let layoutRow = 0;
      let layout = _data.layout;
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
            swiperH: res[0].height ? res[0].height + 20 : 250
          })
        }
      })
    },
    onChange(e) {
      // console.log('e', e)
    },
  }
}))
