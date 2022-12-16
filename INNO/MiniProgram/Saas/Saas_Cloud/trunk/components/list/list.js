// pages/micro_mall/coupon_center/list/list.js
const app = getApp();
Component(app.BTAB({
  properties: {
    isSwiper:{
      type: Boolean,
      value: false
    },
    current:{
      type: Number,
      value: 0,
      observer(n,o){
        if(this.data._current != n){
          clearTimeout(this.timer);
          this.timer = setTimeout(()=>{
            this.setData({
              _current: n
            })
          },350)
        }
      }
    },
    tabData:{
      type:Array,
      value:[],
    }, 
    listData:{
      type:Array,
      value:[],
    },
    refresh:{
      type:Boolean,
      value:true,
    },
    scrollY:{
      type:Boolean,
      value:true,
    },
    scrollX:{
      type:Boolean,
      value:false,
    },
  },

  options:{
    multipleSlots: true
  },
  data: {
    tip_toggle:false,
    _current: 0,
    refreshTriggered: false,
  },
  methods: {
    swiperChange(e){
      let detail = e.detail || {};
      let current = detail.current;
      this.triggerEvent('swiperChange', { current });
    },
    scrolltolower(){
      let _current = this.data._current;
      this.triggerEvent('scrolltolower', { current: _current });
    },
    refresherrefresh(e){
      let _current = this.data._current;
      this.triggerEvent('refresherrefresh', { current: _current });
    },
    refreshEnd(e){
      this.setData({
        refreshTriggered: false
      })
      app.SMH.showToast({
        title: '已刷新',
      })
    },
    refreshShow(e){
      this.setData({
        refreshTriggered: true
      })
    },

  }
}))
