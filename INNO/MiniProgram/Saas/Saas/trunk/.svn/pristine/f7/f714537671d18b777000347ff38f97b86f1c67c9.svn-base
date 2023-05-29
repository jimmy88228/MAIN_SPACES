// pages/micro_mall/user/seed_grass/seed_grass.js
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    adData:{
      type:Array,
      value:[],
    }
  },
  data: {
    autoplay: true,
    interval: 3000,
    duration: 320
  },
  pageLifetimes: {
    show: function () {
      if (!this.data.autoplay){
        this.setData({
          autoplay: true
        })
      }
    },
    hide: function () {
      if (this.data.autoplay) {
        this.setData({
          autoplay: false
        })
      }
    },
  },
  methods: {
    changeSwiper(e) {
      let dataset = e.currentTarget.dataset || {};
      let detail = e.detail || {};
      let current = detail.current;
      let itemSub = dataset.itemSub;
      let keyName = `swiperCurrent.${itemSub}.current`;
      this.setData({
        [keyName]: current
      })
    },
    loadImg(e){
      let dataset = e.currentTarget.dataset || {}
      let detail = e.detail || {};
      let adSwiperH = this.data.adSwiperH || {};
      let imgW = detail.width;
      let imgH = detail.height;
      let winW = app.SIH.windowWidth;
      let adH = (winW * imgH) / imgW;
      if (adSwiperH[dataset.itemSub]) {
        if (adH > adSwiperH[dataset.itemSub].adH) {
          adSwiperH[dataset.itemSub].adH = adH
        }
      } else {
        adSwiperH[dataset.itemSub] = {
          adH: adH
        }
      }
      this.setData({
        adSwiperH: adSwiperH
      })
    },
    adJump(e) {
      let dataset = e.currentTarget.dataset;
      let type = dataset.type;
      if (type == 1) {
        dataset.name = "AD";
      } else if (type == 2) {
        dataset.name = "LOOP_AD";
      }
      app.pageJump(dataset);
    }
  }
}))