// pages/matrix/draw_box/draw_acts/draw_items/smash_eggs/smash_eggs.js
import DrawBehavior from '../../../help/draw-help' 
Component({
  behaviors: [Behavior.BaseBehavior,DrawBehavior],
  /**
   * 组件的属性列表
   */
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

  /**
   * 组件的初始数据
   */
  data: { 
    eggList: [],
    eggCurr: -1,
    eggHammerCurr: 1,
    isAnimateHammer: true,
  },
  ready(){
    let egg = this.data.brand_info.icon_url + "micro_mall/lottery/egg.png";
    let brokenEgg = this.data.brand_info.icon_url + "micro_mall/lottery/broken_egg.png";
    let ribbon = this.data.brand_info.icon_url + "micro_mall/lottery/ribbon.png";
    let hammer = this.data.brand_info.icon_url + "micro_mall/lottery/hammer.png";
    let eggList = [];
    for (let i = 0; i < 3; i++) {
        eggList.push({
            egg,
            brokenEgg,
            ribbon,
            left: i * 240,
            top: i == 1 ? 200 : 100
        });
    }
    this.setData({
        eggList,
        hammer
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    _onShow(actInfo = {}) {
      this.setData({
        actInfo,
      }) 
    },
  }
})
