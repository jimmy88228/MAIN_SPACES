// components/micro-page/items/component/ad-swiper/swiper.js
const app = getApp();
import mcBehavior from '../../../../help/mc-behavior.js'
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    dt: {
      type: Object,
      value: {},
      observer: function (n, o) {
        n && this.init(n);
      }
    },
    type: {
      type: String,
      value: ""
    },
    isInited: {
      type: Boolean,
      value: false
    },
    multiple: {
      type: Number,
      value: 1
    },
  },
  attached() {
    this.readyed = true;
  },
  data: {
    cg_current: 0,
    vertical: false,
    circular: true,
    duration: 500,
    interval: 5000,
    swiperH: 0,
    swiperMsg:{
      swiper_h: 0,
      swiper_ws: {}
    },
  },
  ready() {},
  methods: {
    init(_data) {
      if(_data.type == 't1'){
        _data.autoPlay = true;
        if(_data.open_slide){ //左右滑动变成轮播
          // _data.row = 1;
          // _data.type = "t2"
        }
      }else{ //t2
        _data.row = 1;//t2整屏轮播 默认一行一个  
      }
      console.log('ad-swiper',_data.moduleId,_data)
      this.setData({
        _data,
      })
    },
    loadData(list) {
      list || (list = (this.data.swiperData || []));
      this.setData({
        swiperData: list,
        current: 0,
      })
      if (list.length <= 0) {
        this.setData({
          isEmpty: this.data.isInited ? true : false
        })
        this.mcItemRefresh();
        return
      }
      let _data = this.data._data||{};
      if(_data.type == 't2' && _data.showStyle == '3'){
        this.setSwiperStyle(0,list.length);
      }
      // if(list.length>0){
      //   wx.nextTick(()=>{
      //     setTimeout(() => {
      //       this.initHeight();
      //     }, 300);
      //   }) 
      // }else{
      //   this.setData({
      //     isEmpty:this.data.isInited?true:false
      //   })
      //   this.mcItemRefresh(); 
      // }
    },
    swiperChangeEvent(isAdd = true){
      let cur = this.data.swiper_current || 0;
      let dataL = this.data.swiperData.length || 0;
      let i = isAdd ? 1 : -1;
      if(dataL > 0){
        cur = cur + i;
        if(isAdd){
          if(cur == dataL){
            cur = 0;
          }
        } else {
          if(cur < 0){
            cur = (dataL - 1);
          }
        }
        if(cur != this.data.swiper_current){
          this.setData({
            swiper_current: cur
          })
          this.setSwiperStyle(cur, dataL);
        }
      } 
    },
    setSwiperStyle(cur, dataL){
      let styleList = [];
      for(let i = 0; i < dataL; i++){
        let style = ""
        if(i == cur){
          style = "z-index: 5;opacity: 1;transform:translate(-50%, -50%); scale(1);"
        } else if((cur - 1) == i || (cur == 0 && i == (dataL - 1))){
          style = "z-index: 3;opacity: 0.8;left:0;transform:translate(0, -50%) scale(0.8);"
        } else if((cur + 1) == i || (cur == (dataL - 1) && i == 0)){
          style = "z-index: 3;opacity: 0.8;left:100%;transform:translate(-100%, -50%) scale(0.8);"
        } else {
          style = "z-index: 2;opacity: 0.8;transform:translate(-50%, -50%) scale(0.8);"
        }
        styleList.push({ style: style })
      }
      this.setData({
        styleList
      })
    },
    swiperTouchS(e){
      let changedTouches = e.changedTouches || [];
      this.touchs = this.touchs || {};
      this.touchs.x1 = changedTouches[0].clientX;
      this.touchs.y1 = changedTouches[0].clientY;
      this.swiperTime && clearTimeout(this.swiperTime);
    },
    swiperTouchE(e){
      let changedTouches = e.changedTouches || [];
      this.touchs.x2 = changedTouches[0].clientX;
      this.touchs.y2 = changedTouches[0].clientY;
      let touchs = this.touchs || {};
      if(touchs.x1 > touchs.x2){
        this.swiperChangeEvent();
      } else if(touchs.x1 < touchs.x2){
        this.swiperChangeEvent(false);
      } 
    },
    initHeight() { //swiper高度设置 
      // this.mcGetQuery('.list-item', 'all').then((res => {
      //   let arr = res && res[0] || [];
      //   if (arr.length > 0) {
      //     let maxH = 0;
      //     arr.forEach(item => {
      //       if (maxH < item.height) {
      //         maxH = item.height;
      //       }
      //     })
      //     maxH < this.data.swiperH && (maxH = this.data.swiperH);
      //     console.log('ad-swiper maxH', maxH, arr, this.data.isInited, this.data._data)
      //     this.setData({
      //       swiperH: maxH > 0 ? maxH : (this.data.swiperH || 250)
      //     })
      //     this.mcItemRefresh();
      //   }
      // }));
    },
    onChange(e) {
      let current = e.detail.current;
      this.setData({
        cg_current: current
      })
    },
    imgLoad(e) {
      // console.log('imgLoad',this.data._data.moduleId,e);
      let dataset = e.currentTarget.dataset || {};
      let img_h = e.detail.height;
      let img_w = e.detail.width;
      let swiperMsg = this.data.swiperMsg || {};
      let _data = this.data._data || {};
      let swiper_h = swiperMsg.swiper_h || 0,scaler_h = 0;
      let swiper_ws = {};
      let imgVW = 750;
      let key = dataset.key||0;
      if(_data.type == "t1"){ // 静态图
        imgVW = _data.open_slide ? parseFloat(750/_data.row) : 150; //是否开启左右滑动
      } else if (_data.showStyle == "3") {
        imgVW = 400;
      } else if (_data.showStyle == "2") {
        imgVW = img_w;
        swiper_ws[key] = img_w;
      } else if(_data.showStyle == "1"){
        imgVW = 750;
      }
      scaler_h = (img_h * imgVW) / img_w / (_data.layoutRow || 1);
      if (swiper_h < scaler_h) {
        swiper_h = scaler_h;
      }
      let widthKey = `swiperMsg.swiper_ws.${key}`;
      let tempH = this.data.swiperMsg.swiper_h || 0;
      this.setData({
        ['swiperMsg.swiper_h']: swiper_h || 0,
        [widthKey]: imgVW
      })
      // console.log('swiperMsg',this.data._data.moduleId,key,swiperMsg)
      tempH != swiper_h && (this.mcItemRefresh());
    }
  }
}))