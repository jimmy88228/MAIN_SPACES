import SMH from '../../../../common/helper/show-msg-helper'
import { LotteryApi } from '../../../../common/manager/http-manager';
import LM from '../../../../common/manager/login-manager';
import Conf from '../../../../conf';
const DrawBehavior = Behavior({
  data: {},
  methods: {
    allowJoin(actInfo) {
      return new Promise((rs, rj) => {
        //没有次数
        // if (actInfo.canJoinTimes == 0) {
        //   wx.vibrateShort({
        //     type: "heavy",
        //     complete: () => {
        //       wx.nextTick(() => {
        //         SMH.showToast({
        //           "title": "今日抽奖次数用完了"
        //         });
        //       })
        //     }
        //   })
        //   this._loading = false;
        //   return rj();
        // }
        //活动状态
        if (actInfo.activityStatus != 1) {
          let name;
          if (actInfo.activityStatus == 2) {
            name = "活动未开启";
          } else if (actInfo.activityStatus == 3) {
            name = "活动未开始";
          } else {
            name = "活动已过期";
          }
          SMH.showToast({
            "title": name
          });
          this._loading = false;
          return rj();
        }
        rs();
      })
    },
    drawResult(actInfo) {
      return LotteryApi.create_Lottery({
        data: {
          activityId: actInfo.activityId || 0, 
        },
        extraData: {
          isShowLoad: true
        }
      })
    }
  }
});

function clickHold(key = "DEF", d = 800) {
  this.clickHoldMap || (this.clickHoldMap = {});
  let chm = this.clickHoldMap
  if (chm[key]) {
    return false;
  } else {
    chm[key] = true;
    let timer = setTimeout(() => {
      delete chm[key];
      clearTimeout(timer);
    }, d);
    return true;
  }
}
export default DrawBehavior;