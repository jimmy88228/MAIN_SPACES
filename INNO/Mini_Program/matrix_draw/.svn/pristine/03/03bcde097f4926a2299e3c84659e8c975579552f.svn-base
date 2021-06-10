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
  properties: {},
  attached() {
    this.realIndex = 0;
    let fruitBg = this.data.brand_info.icon_url + "micro_mall/lottery/sgj-box.png";
    let fruitStart = this.data.brand_info.icon_url + "micro_mall/lottery/lottery_start.png";
    let friutItem = this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg.png";
    let friutItemActive = this.data.brand_info.icon_url + "micro_mall/lottery/sg_bg_active.png";
    this.setData({
        fruitBg,
        fruitStart,
        friutItem,
        friutItemActive
    });
  },
  data: {
    actInfo: {},
    curIndex:-1,
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
    return
  }else{
    let time = len - i <= (OneRoundTimes) ? parseInt(OneRoundTimes / (len - i) * BaseTime * 1.3) : BaseTime
    setTimeout(() => {
      i+=1;
      _forSetData(that,i,len);
    }, time);
  }
}