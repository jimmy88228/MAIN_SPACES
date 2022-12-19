// components/micro-page/items/component/swiper/swiper.js
const app = getApp();
import mcBehavior from '../../../../help/mc-behavior.js'
import TLH from '../../../../../../components/template/help/tag-list-help'
const layoutToInt = {
  "one":1,
  "two":2,
  "three":3,
  "four":4,
}
const layoutToStr = {
  1:"one",
  2:"two",
  3:"three",
  4:"four",
}
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
    timeManager:{
      type: Object,
      value: {},
    },
    tagJson:{
      type: Object,
      value: {},
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
    circular: true,
    vertical: false
  },
  ready() {
  },
  methods: {
    loadData(data) {
      let _data = this.data._data||{}; 
      if(data.length < _data.layoutRow){
        // console.log('重置layout',_data.moduleId,data.length,_data.layoutRow,_data.layoutRealRow)
        _data.layoutRealRow = data.length;
        this.setData({
          _data
        })
      }
      this.setData({
        current:0,
        swiperData:data,
        isEmpty:this.data.isInited && (!data || (data && data.length<=0))
      })
      if(data&&data.length>0){
        this.initHeight();
      }else{
        this.mcItemRefresh();
      }
    },
    init(data) {
      let _data = data || {};
      let layout = _data.layout || "";
      let layoutRow = layoutToInt[layout] || 1; 
      _data.layoutRow = layoutRow;
      _data.layoutRealRow = layoutRow;
      this.setData({
        _data,
      })
    },
    initHeight() { //swiper高度设置 
      this.mcGetQuery('.list-item','all').then((res=>{
        let arr = res && res[0]||[];
        let maxH = 0;
        arr.forEach(item=>{
          if(maxH<item.height){
            maxH = item.height;
          }
        })
        // console.log('maxH',maxH,arr)
        this.setData({
          swiperH: maxH>0 ? maxH : 250
        })
        this.mcItemRefresh();
      }));
    },
    onChange(e) { 
    }, 
    loadTag(e){
      TLH.loadTag(e,this);
    }
  }
}))
