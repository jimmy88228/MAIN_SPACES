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
Component({
  behaviors: [Behavior.BaseBehavior, DrawBehavior],
  properties: {},
  attached() {},
  data: {
    actInfo: {},
    isActive: false
  },

  methods: {
    _onShow(actInfo = {}) {
      console.log('actInfo', actInfo, actInfo.prizeList)
      let flopActList = [];
      for (let i = 1; i <= 12; i++) {
        let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
        flopActList.push({
          isSelected: false,
          path: path,
          times: Time[i]
        });
      }
      this.setData({
        actInfo,
        flopActList,
      })
      setTimeout(() => {
        this.setData({
          isActive: true,
        })
      }, 450);
    },

    draw(e) {
      let curIndex = e.currentTarget.dataset.index;
      flopActReset.call(this, curIndex);
      setTimeout(() => {
        this.setData({
          [`flopActList[${curIndex}].isSelected`]: false,
        });
      }, 1000)
      setTimeout(() => {
        _setAnim.call(this, curIndex); //洗牌
      }, 1600)
      return
      // this.triggerEvent('draw',{type:this.data.actInfo.activityTypeCode});
      // if (this.loadding) return
      // this.loadding = true;
      // let actInfo = this.data.actInfo || {};
      // let curIndex = e.currentTarget.dataset.index;
      // this.allowJoin(actInfo).then(() => {
      //   this.drawResult(actInfo).then(res => {
      //     console.log('resres', res)
      //     if (res.code == 1) {
      //       // let data = res.data||{};
      //       // let index = actInfo.prizeList.findIndex(item=>item.prizeId == data.prizeId);
      //       _setAnim.call(this, curIndex);
      //     }
      //   });
      // }).catch(e => {
      //   this.loadding = false;
      // })
    },
  }
})


function _setAnim(curIndex = 0) {
  let flopActList = this.data.flopActList || [];
  // 调用洗牌算法
  flopActList = flopActList.shuffle();
  for (let i = 1; i <= 12; i++) {
    flopActList[i - 1].times = Time[i];
  }
  this.setData({
    flopActList,
    isActive: false
  });
  // 加setTimeout为了和动画达到同步效果
  setTimeout(() => {
    this.setData({
      isActive: true
    });
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