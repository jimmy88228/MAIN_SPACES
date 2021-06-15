// pages/draw/draw_box/draw_acts/draw_items/matrix_act/matrix_act.js
import DrawBehavior from '../../../help/draw-help'
const app = getApp();
Component({
  behaviors: [Behavior.BaseBehavior, DrawBehavior],
  properties: {
    setting: {
      type: Object,
      default: {},
      observer: function (n, o) {
        console.log(n, o, 'setting')
      }
    }
  },
  attached() {
    this.showFst = true;
  },
  data: {
    actInfo: {},
    showType: "",
  },

  methods: {
    _onShow(actInfo = {}) {
      console.log('actInfo', actInfo, actInfo.prizeList)
      init.call(this, actInfo);
      this.setData({
        actInfo,
      })
    },
    draw(type) {
      // this.triggerEvent('draw',{type:this.data.actInfo.activityTypeCode});
      if (this.loadding) return
      this.loadding = true;
      let actInfo = this.data.actInfo || {};
      _setAnim(this, {
        isWinning: 1,
        prizeId: 2,
        prizeImg: "",
        prizeName: "50积分",
        prizeType: 1,
        record_sn: "W0000121061512250025954619"
      }, 0);
      return
      return this.allowJoin(actInfo).then(() => {
        return this.drawResult(actInfo).then(res => {
          console.log('resres', res)
          if (res.code == 1) {
            let data = res.data || {};
            let index = actInfo.prizeList.findIndex(item => item.prizeId == data.prizeId);
            _setAnim(this, data, index);
            return Promise.resolve();
          }
          return Promise.reject(res);
        });
      }).catch(e => {
        this.loadding = false;
        app.SMH.showToast({
          title: e && e.msg || "抽奖异常"
        })
      })
    },
    // transitionend(e) {
    //   console.log(e, 'transitionend');
    //   this.loadding && (this.loadding = false);
    // }, 
    loaded(e) {
      console.log('loaded', e)
      if (this.data.showRefresh) {
        if (this.initLoaded) {
          this.setData({
            init: false,
            showRefresh: false
          })
        }
        this.initLoaded = true;
      }
    },
    close(type) {
      console.log('close')
      // if (!this.listenClose) return
      if(type == 'again')return
      let randomNum = '' + new Date().getTime();
      let _data = {};
      if (this.afterGif) {
        if (this.data.showType == 'first') {
          _data.activeImg1 = this.initPath + '?' + randomNum;
        } else {
          _data.activeImg2 = this.initPath + '?' + randomNum;
        }
      }
      this.loadding = false;
      this.setData({
        ..._data,
        showType: "",
        // clickActive: false,
        // showfilter: false
      })
    },
  }
})

function _setAnim(that, prizeMsg, index) {
  // that.listenClose = true;
  let time = that.afterGif ? 950 : 200;
  if (that.showFst || !that.afterGif) {
    that.showFst = false;
    that.setData({
      showType: 'first',
    })
  } else {
    that.showFst = true;
    that.setData({
      showType: 'second',
    })
  }
  Promise.nextTick().then(() => {
    setTimeout(() => {
      that.draw_result = that.draw_result || that.selectComponent("#draw_result");
      that.setData({
        showfilter: true,
      })
      that.loadding = false;
      Promise.nextTick().then(() => {
        let actInfo = that.data.actInfo || {};
        that.triggerEvent('result', {
          actInfo,
          prizeMsg,
          index
        }, {
          bubbles: true,
          composed: true,
          capturePhase: true,
        })
        // that.draw_result && that.draw_result._show(actInfo,prizeMsg,index);
      })
    }, time);
  })
  // if (app.clickHold("draw", 2000)) { 
  // }
}

function init(actInfo) {
  if (!this.inited) {
    this.inited = true;
    this.afterActive = !!(actInfo.afterActive && actInfo.afterActive.img);
    this.afterGif = !!(actInfo.afterActive && actInfo.afterActive.img && actInfo.afterActive.img.indexOf('.gif') != -1);
    this.initPath = this.afterActive && actInfo.afterActive.img || "";
    console.log('after', this.afterActive, this.afterGif);
    if (this.afterGif) {
      let randomNum = '' + new Date().getTime();
      let [activeImg1, activeImg2] = [actInfo.afterActive.img + '?' + randomNum, actInfo.afterActive.img + '?' + randomNum + 1]
      this.setData({
        activeImg1,
        activeImg2,
        afterGif: true
      });
    }
  }
}
