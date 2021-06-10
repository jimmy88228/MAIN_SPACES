// pages/draw/draw_acts/draw_acts.js
let Original = []; //存储原始的奖品数据
const app = getApp();
Component({
  behaviors: [Behavior.BaseBehavior],
  properties: { 
  },
  data: {

  },
  attached() {
    let panBox = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box.png";
    let panBoxStay = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box_stay.png";
    let pointer = this.data.brand_info.icon_url + "micro_mall/lottery/pointer.png";
    this.setData({
      panBox,
      panBoxStay,
      pointer
    });
  },
  methods: {
    _onShow(actInfo){
      this.setData({
        actInfo
      })
      wx.nextTick(()=>{
        this.act = this.act || this.selectComponent('#act');
        this.act._onShow(actInfo);
      })
    }, 
  }
}) 