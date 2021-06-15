// pages/draw/draw_result/draw_result.js
import {
  createBehavior
} from "../../../../components/window/anim-helper";
const app = getApp();
const anim = {
  enterTo: "transition: all 300ms ease-in-out;opacity: 1;",
  leaveTo: "opacity: 0; transition: all 300ms ease-in-out;",
  duration: 300
}
const SUM = 25; //奖品池大小
const IMG_BOX_W = 214; //基础盒子宽高
const ANIM_TIME = 4500; //CSS里是4s
Component({
  behaviors: [Behavior.BaseBehavior, createBehavior(anim)],
  properties: { 
  },
  data: {
    SUM,
    prizeList: []
  },
  attached() {
    let win_bg = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg.png";
    let failure_bg = this.data.brand_info.icon_url + "micro_mall/lottery/failure_bg.png";
    let win_bg_btn = this.data.brand_info.icon_url + "micro_mall/lottery/win_bg_btn.png";
    let default_img = this.data.brand_info.icon_url + "micro_mall/lottery/win_default.png";

    this.setData({
      win_bg,
      win_bg_btn,
      default_img,
      failure_bg,
    });
  },
  methods: {
    onTap(e) {
      if (app.clickHold("draw_result", 1000)) {
        let dataset = this.getDataset(e);
        let type = dataset.type || "";
        if (type == 'close') {
          _setAnim(this, 'prize', false);
          this.dismiss();
          this.triggerEvent('close');
        } else if (type == 'again') {
          _setAnim(this, 'prize', false);
          // this.triggerEvent('close');
          Promise.nextTick().then(() => {
            this.triggerEvent('again');
          })
        }else if(type == 'check'){
          let id = this.actInfo && this.actInfo.activityId||0;
          wx.navigateTo({
            url: `/pages/matrix/draw_box/draw_records/draw_records?activityId=${id}`,
          })
        }
      }
    },
    _show(actInfo = {}, prizeMsg = {}, index = -1) {
      let prizeList = actInfo.prizeList || [];
      let code = actInfo.activityTypeCode || "";
      this.actInfo = actInfo;
      this.setData({
        prizeMsg
      })
      if (code == 'zajingdan') {
        let newPrizeList = JSON.parse(JSON.stringify(prizeList));
        newPrizeList = shuffle(newPrizeList); //打乱
        //中奖逻辑
        let SUM = this.data.SUM;
        if (newPrizeList.length <= SUM) {
          const temp = newPrizeList;
          let len = Math.ceil((SUM / temp.length));
          for (let i = 0; i < len; i++) {
            if (newPrizeList.length >= SUM) {
              newPrizeList = newPrizeList.slice(0, SUM);
              break;
            }
            newPrizeList = newPrizeList.concat(temp);
          }
        } else {
          newPrizeList = newPrizeList.slice(0, SUM);
        }
        let random = parseInt(Math.random() * (newPrizeList.length - 5)); //随机取5个
        let lastPrizeList = newPrizeList.slice(random, random + 5);
        lastPrizeList.splice(2, 1, prizeMsg); //中奖内容在中间
        newPrizeList = newPrizeList.concat(lastPrizeList);
        console.log('newPrizeList', newPrizeList,lastPrizeList)
        this.setData({
          prizeList: newPrizeList,
          baseW: getBaseW(),
        })
        this.show();
        _setAnim(this, 'draw', true); //抽奖动画
        setTimeout(() => {
          _setAnim(this, 'draw', false, {
            noCancel: true
          });
          setTimeout(() => {
            _setAnim(this, 'prize', true);  //抽奖结果
          }, 300);
        }, ANIM_TIME);
      } else if (code == '') {

      }

    }
  }
})

function getBaseW() {
  return parseInt(app.SIH.systemInfo.windowWidth / 750 * IMG_BOX_W);
}

function _setAnim(that, type, bool, extra = {}) {
  if (type == 'draw') {
    if (bool) {
      that.setData({
        showAnimBool: true
      })
      Promise.nextTick().then(() => {
        that.setData({
          animBoxStyle: "opacity:1;",
          start: true,
        })
      })
    } else {
      that.setData({
        animBoxStyle: "opacity:0;"
      });
      if (!extra.noCancel) {
        setTimeout(() => {
          that.setData({
            showAnimBool: false
          })
        }, 300);
      }
    }
  } else if (type == 'prize') {
    if (bool) {
      that.setData({
        start: false,
        showAnimBool: false,
        showPrizeBool: true,
      });
      wx.nextTick(() => {
        that.setData({
          animBoxStyle: "opacity:1;"
        })
      })
    } else {
      that.setData({
        animBoxStyle: "opacity:0;",
      })
      setTimeout(() => {
        that.setData({
          showPrizeBool: false,
        })
      }, 300);
    }
  }
}

function shuffle(arr) {
  var input = arr;
  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}