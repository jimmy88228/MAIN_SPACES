// components/micro-page/items/ad-nav/ad-nav.js
import mcBehavior from '../../../help/mc-behavior.js'
const app = getApp();
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt: {
      type: Object,
      value: {},
      observer: function (n, o) {
        // if(!this.isAttached)return
        n && this.init(n);
      }
    },
    autoShow: {
      type: Boolean,
      value: false
    },
  },
  attached() {
    this.isAttached = true;
  },
  data: {
    screenWidth: app.SIH.screenWidth,
  },
  methods: {
    init(_data) {
      this.setData({
        _data,
      })
      if(this.properties.autoShow){
        this.loadData();
      }
    },
    loadData(_data) {
      this.setData({
        isInited:true
      })
      this.mcItemRefresh();
    },
  }
}))
