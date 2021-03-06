// pages/draw/draw_box/draw_acts/draw_items/fruit_act/fruit_act.js
import DrawBehavior from '../../../help/draw-help' 
const Rounds = 5;
const OneRoundTimes = 8;
const BaseTime = 90;
const app = getApp();
const TransIndex = [0,1,2,5,8,7,6,3]; //0~7转换成九宫格所在的位置
const PageShowPrizeIndex = [0,1,2,7,3,6,5,4]; //奖品顺序适配九宫格
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
    }
  },
  attached() {
    this.realIndex = 0;
  },
  data: {
    actInfo: {},
    curIndex:-1,
    screenWidth:app.SIH.screenWidth,
  }, 

  methods: { 
    _onShow(actInfo = {}) {
      let PrizeList = initPrize(actInfo.prizeList);
      PrizeList.splice(4,0,{});
      console.log('actInfo',actInfo, actInfo.prizeList,PrizeList)
      this.setData({
        actInfo,
        PrizeList,
      }) 
    },

    draw() {
      // this.triggerEvent('draw',{type:this.data.actInfo.activityTypeCode});
      if(this.loadding)return Promise.reject()
      this.loadding = true;
      let actInfo = this.data.actInfo||{};
      return this.allowJoin(actInfo).then(()=>{
        return this.drawResult(actInfo).then(res=>{
          console.log('resres',res)
          if(res.code == 1){
            let data = res.data||{};
            let index = actInfo.prizeList.findIndex(item=>item.prizeId == data.prizeId);
            this.prizeMsg = data;
            _setAnim.call(this,index);
            return res;
          }
          return Promise.reject(res)
        });
      }).catch(e=>{
        this.loadding = false; 
        app.SMH.showToast({
          title:e&&e.msg||"抽奖异常"
        })
        return Promise.reject(e)
      })
    },
  }
})
 
function initPrize(arr){
  let temp = [];
  arr && arr.forEach((item,index)=>{
    // console.log(item,index)
    temp[index] = arr[PageShowPrizeIndex[index]];
  })
  return temp;
}


function _setAnim(index = 0) {
  let realIndex = this.realIndex;
  // console.log('旧 新',realIndex,index)
  this.realIndex = index;
  let len = Rounds * OneRoundTimes + index; 
  _forSetData(this,realIndex,len); 
}

function _forSetData(that,i,len){
  that.setData({
    curIndex:TransIndex[i % (OneRoundTimes)]
  })
  // console.log(i % (OneRoundTimes),TransIndex[i % (OneRoundTimes)]);
  if(i == len){
    console.log('结束',i)
    that.loadding = false;
    let prizeMsg = that.prizeMsg||{};
    let actInfo = that.data.actInfo||{};
    setTimeout(() => {
      that.triggerEvent('result', {
        actInfo,
        prizeMsg,
      }, {
        bubbles: true,
        composed: true,
        capturePhase: true,
      })
    }, 800);
    return
  }else{
    let time = len - i <= (OneRoundTimes) ? parseInt(OneRoundTimes / (len - i) * BaseTime * 1.3) : BaseTime
    setTimeout(() => {
      i+=1;
      _forSetData(that,i,len);
    }, time);
  }
}