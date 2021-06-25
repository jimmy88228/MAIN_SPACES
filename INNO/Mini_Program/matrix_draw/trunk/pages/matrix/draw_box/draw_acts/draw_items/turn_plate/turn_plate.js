// pages/draw/draw_items/turn_plate/turn_plate.js 
import DrawBehavior from '../../../help/draw-help' 
const Rounds = 7;
const ItemRotate = 60;
const OneRoundDeg = 360;
const app = getApp();
Component({
  behaviors: [Behavior.BaseBehavior,DrawBehavior],
  properties: {
    setting: {
      type: Object,
      default: {},
      observer: function (n, o) {
        // console.log(n, o, '_setting')
        if(n){
          this.setData({
            _setting:n
          })
        }
      }
    },
  },
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
      if(this.loadding)return Promise.reject()
      this.loadding = true;
      let actInfo = this.data.actInfo||{};
      return this.allowJoin(actInfo).then(()=>{
        return this.drawResult(actInfo).then(res=>{
          console.log('resres',res)
          if(res.code == 1){
            let data = res.data||{};
            let index = actInfo.prizeList.findIndex(item=>item.prizeId == data.prizeId);
            index < 0 && (index = 0)
            this.prizeMsg = data;
            console.log(index,data.prizeId,actInfo.prizeList[index])
            _setAnim(this,index); 
            return res;
          }
          return Promise.reject(res);
        });
      }).catch(e=>{
        console.log(e)
        app.SMH.showToast({
          title:e&&e.msg||"抽奖异常"
        })
        this.loadding = false;
        return Promise.reject(e)
      })
    },

    transitionend(e){
      console.log(e,'transitionend');
      let prizeMsg = this.prizeMsg||{};
      let actInfo = this.data.actInfo||{};
      this.triggerEvent('result', {
        actInfo,
        prizeMsg,
      }, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      })
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