// pages/draw/draw_box/draw_acts/draw_items/flop_act/flop_act.js 
import DrawBehavior from '../../../help/draw-help'
const app = getApp();
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
      let zodiacList = [];
      let zodiacReverse = this.data.brand_info.icon_url + "micro_mall/lottery/fan-fan.png";
      for (let i = 1; i <= 12; i++) {
        let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
        zodiacList.push({
          isSelected: false,
          path: path,
          times: 0
        });
      }
      this.setData({
        actInfo,
        zodiacList,
        zodiacReverse
      })
      setTimeout(() => {
        this.setData({
          isActive: true,
        })
      }, 1000);
    },

    draw(e) {
      let curIndex = e.currentTarget.dataset.index;
      zodiacReset.call(this, curIndex);
      setTimeout(() => {
        this.setData({
          [`zodiacList[${curIndex}].isSelected`]: false,
        });
      }, 1000)
      setTimeout(() => {
        _setAnim.call(this, curIndex);
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


    zodiacStart(e) {
      if (this.data.disabled) return;
      setBg.call(this, 'zodiacStart');
      let curIndex = e.currentTarget.dataset.index;
      allowJoin.call(this, () => {
        getLotteryResult.call(this).then(res => {
          zodiacReset.call(this, curIndex);
          this.setData({
            zodiacName: res.prizeName,
          });
          setTimeout(() => {
            this.setData({
              [`zodiacList[${curIndex}].isSelected`]: false,
              isActive: false
            });
            // audioRun(this.audioCtx2,'play');
            cancelBg.call(this);
            // this.lotteryStart(res);
            let time = {
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
            // jimmy
            console.log('zodiac call 回调');
            // if(this.initPlay){
            //     audioRun(this.audioCtx1,'play')
            // }
            // this.initPlay = true;
            // audioRun(this.audioCtx1,'seek',1.5)
            let zodiacList = [];
            let zodiacReverse = this.data.brand_info.icon_url + "micro_mall/lottery/fan-fan.png";
            let res_zodiacList = [];
            for (let i = 1; i <= 12; i++) {
              let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
              zodiacList.push({
                isSelected: false,
                path: path,
                times: 0
              });
            }

            // 调用洗牌算法
            res_zodiacList = zodiacList.shuffle();
            for (let i = 1; i <= 12; i++) {
              res_zodiacList[i - 1].times = time[i];
            }
            this.setData({
              zodiacList,
              zodiacReverse
            });
            // 加setTimeout为了和动画达到同步效果
            setTimeout(() => {
              this.loadAudioData = true;
              if (checkLoad.call(this)) {
                this.setData({
                  // isActive: true
                });
              }
            }, 600);

          }, 1000);
        });
      });
    },
  }
})


function _setAnim(curIndex = 0) {

  this.setData({
    // [`zodiacList[${curIndex}].isSelected`]: false,
    isActive: false
  });
  let time = {
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
  let zodiacList = [];
  let zodiacReverse = this.data.brand_info.icon_url + "micro_mall/lottery/fan-fan.png";
  for (let i = 1; i <= 12; i++) {
    let path = this.data.brand_info.icon_url + `micro_mall/lottery/fan-${i}.png`;
    zodiacList.push({
      isSelected: false,
      path: path,
      times: 0
    });
  }

  // 调用洗牌算法
  zodiacList = zodiacList.shuffle();
  for (let i = 1; i <= 12; i++) {
    zodiacList[i - 1].times = time[i];
  }
  this.setData({
    zodiacList,
    zodiacReverse
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


function zodiacReset(curIndex) {
  this.setData({
    zodiacList: this.data.zodiacList.map((item, index) => {
      return Object.assign(item, {
        isSelected: (curIndex === index) ? !item.isSelected : false
      });
    })
  });
  console.log('zodiacList', curIndex, this.data.zodiacList)
}