// pages/draw/draw_items/turn_plate/turn_plate.js 
import DrawBehavior from '../../../help/draw-help' 
const Rounds = 6;
const ItemRotate = 60;
const OneRoundDeg = 360;
const app = getApp();
Component({
  behaviors: [Behavior.BaseBehavior,DrawBehavior],
  properties: {},
  attached() {
    let panBox = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box.png";
    let panBoxStay = this.data.brand_info.icon_url + "micro_mall/lottery/pan-box_stay.png";
    let pointer = this.data.brand_info.icon_url + "micro_mall/lottery/pointer.png";
    this.curIndex = 0;
    this.setData({
      panBox,
      panBoxStay,
      pointer
    });
  },
  data: {
    actInfo: {},
    curDeg:0,
  }, 

  methods: { 
    _onShow(actInfo = {}) {
      console.log('actInfo',actInfo, actInfo.prizeList)
      this.setData({
        actInfo,
      }) 
    },

    draw() {
      // this.triggerEvent('draw',{type:this.data.actInfo.activityTypeCode});
      if(this.loadding)return
      this.loadding = true;
      let actInfo = this.data.actInfo||{};
      this.allowJoin(actInfo).then(()=>{
        this.drawResult(actInfo).then(res=>{
          console.log('resres',res)
          if(res.code == 1){
            let data = res.data||{};
            let index = actInfo.prizeList.findIndex(item=>item.prizeId == data.prizeId);
            _setAnim.call(this,index); 
          }
        });
      }).catch(e=>{
        this.loadding = false;
      })
    },
    transitionend(e){
      console.log(e,'transitionend');
      this.loadding && (this.loadding = false);
    }
  }
})

function _setAnim(that,index){ 
  let curDeg = that.data.curDeg + Rounds * OneRoundDeg + (index - that.curIndex)*ItemRotate;
  // console.log('deg',curDeg, index , that.curIndex,(index - that.curIndex)*ItemRotate)
  that.setData({
    curDeg
  });
  that.curIndex = index;
}