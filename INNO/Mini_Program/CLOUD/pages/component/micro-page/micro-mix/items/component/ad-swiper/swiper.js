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
        n && this.loadData(n);
      }
    },
    dt: {
      type: Object,
      value: {},
      observer: function (n, o) {
        n && this.init(n);
      }
    },
    type:{
      type:String,
      value:""
    },
    isInited:{
      type:Boolean,
      value:false
    },
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
  },
  methods: {
    init(_data) {
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
        _data, 
      })
    },
    loadData(list) {
      // console.log('init loadData ad-swiper', data);
      list || (list = this.data.list)
      this.setData({
        swiperData:list,
        current:0,
      })
      if(list.length>0){
        Promise.nextTick().then(()=>{
          setTimeout(() => {
            this.initHeight();
          }, 300);
        })
      }else{
        this.setData({
          isEmpty:this.data.isInited?true:false
        })
        this.itemRefresh(); 
      }
    },
    initHeight() { //swiper高度设置
      let query = this.createSelectorQuery();
      query.select('#listItemId').boundingClientRect();
      query.exec(res=>{
        // console.log('initHeight', res,this.data._data.moduleId,this.data.swiperData,this.data.isInited)
          let item = res[0]||{};
          this.setData({
            swiperH: item.height ? item.height : 250
          })
          this.itemRefresh(); 
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
