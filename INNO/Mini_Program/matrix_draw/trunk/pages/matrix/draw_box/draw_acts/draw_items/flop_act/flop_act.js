// pages/draw/draw_box/draw_acts/draw_items/flop_act/flop_act.js 
import DrawBehavior from '../../../help/draw-help'
const app = getApp();
const Time = {
  1: 0,
  2: 0.1,
  3: 0.2,
  4: 0.3,
  5: 0,
  6: 0.1,
  7: 0.2,
  8: 0.3,
  9: 0,
  10: 0.1,
  11: 0.2,
  12: 0.3
};
const AnimTime = 1000;
Component({
  behaviors: [Behavior.BaseBehavior, DrawBehavior],
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
          this.init(n);
        }
      }
    }
  },
  attached() {},
  data: {
    actInfo: {},
    isActive: false,
    curIndex:-1,
  },

  methods: {
    _onShow(actInfo = {}) {
      // console.log('actInfo', actInfo, actInfo.prizeList)
      this.setData({
        actInfo
      })
    },

    draw(e) {
      let dataset = this.getDataset(e);
      let curIndex = dataset.index||0;
      // flopActReset.call(this, curIndex);
      // this.setData({
      //   curIndex:curIndex
      // })
      // setTimeout(() => {
      //   this.setData({
      //     curIndex: -1,
      //     // [`flopActList[${curIndex}].isSelected`]: false,
      //   });
      // }, 1000)
      // setTimeout(() => {
      //   _setAnim.call(this, curIndex); //洗牌
      // }, 1600)
      // return
      // _setAnim(this,1,curIndex);  
      // return
      if(this.loadding)return Promise.reject()
      this.loadding = true;
      let actInfo = this.data.actInfo||{};
      return this.allowJoin(actInfo).then(()=>{
        return this.drawResult(actInfo).then(res=>{
          if(res.code == 1){
            let data = res.data||{};
            let index = actInfo.prizeList.findIndex(item=>item.prizeId == data.prizeId);
            index < 0 && (index = 0)
            this.prizeMsg = data;
            console.log(index,data.prizeId,actInfo.prizeList[index])
            _setAnim(this,index,curIndex); 
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
    init(setting={}){
      if(!this.inited){
        this.inited = true;
        let flopActList = [];
        let data = setting && setting.images||[];
        for (let i = 1,len=data.length; i <= len; i++) {
          flopActList.push({
            isSelected: false,
            path: data[i-1].img,
            times: Time[i]
          });
        }
        this.setData({ 
          flopActList,
        })
        setTimeout(() => { //卡片显示
          this.setData({
            isActive: true,
          })
        }, 450);
      }
    },
    close(type){
      if(type == 'again'){
        this.loadding = false;
        return
      }
      _reset.call(this);
    }
  }
})


function _setAnim(that,index,curIndex = 0) { //中奖index、点击index
  // flopActReset.call(that, curIndex);
  // console.log('curIndex',curIndex)
  that.setData({
    curIndex:curIndex,
    showAnimBool:true,
  });
  let actInfo = that.data.actInfo||{};
  let prizeMsg = that.prizeMsg||{};
  let flopActList = that.data.flopActList||[];
  that.triggerEvent('result', {
    actInfo,
    prizeMsg,
    extra:{curImg:flopActList[curIndex].path}
  }, {
    bubbles: true,
    composed: true,
    capturePhase: true,
  })
}
function _reset() {
  console.log('洗牌') 
  this.setData({
    isActive: false
  });
  // 加setTimeout为了和动画达到同步效果
  setTimeout(() => {
    let flopActList = this.data.flopActList || [];
    // 调用洗牌算法
    flopActList = flopActList.shuffle();
    for (let i = 1; i <= 12; i++) {
      flopActList[i - 1].times = Time[i];
    }
    this.setData({
      flopActList,
      isActive: true
    });
    this.loadding = false;
  }, 600);
}

Array.prototype.shuffle = function () {
  var input = this;
  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}


function flopActReset(curIndex) {
  this.setData({
    flopActList: this.data.flopActList.map((item, index) => {
      return Object.assign(item, {
        isSelected: (curIndex === index) ? !item.isSelected : false
      });
    })
  });
  console.log('flopActList', curIndex, this.data.flopActList)
}