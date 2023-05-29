const app = getApp();
Component(app.BTAB({
  properties: {
    isLogin:{
      type: Boolean,
      value: false
    },
  },
  data: {
    brand_info:{},
    sessionFrom:"",
    winW: app.SIH.windowWidth,
    winH: app.SIH.windowHeight,
    itemX: 645,
    itemY: 700,
    itemW: 120,
    itemH: 88,
  },
  ready(){
    this.baseW = app.SIH.screenWidth / 750;
    this.initData();
  },
  pageLifetimes:{
    show(){},
  },
  methods: {
    initData() {
      let itemY = this.data.itemY;
      let itemW = this.data.itemW;
      let itemH = this.data.itemH;
      let itemX = parseFloat(this.data.winW - (itemW * this.baseW));
      this.setData({
        itemX: itemX,
        itemY: parseFloat(itemY * this.baseW),
        itemW: parseFloat(itemW * this.baseW),
        itemH: parseFloat(itemH * this.baseW),
      })
    },
    noFunc(){},
    joinLiveBtn(){
      this.triggerEvent('joinLiveEvent',{isHelp: true});
    }
  }
}))