import CheckUpdateTimer from "../../../../../common/helper/check-update-timer";
import userJump from "../userJumpHandle";
import Utils from "../../../../../common/support/utils/utils";
const app = getApp();
Component(app.BTAB({
  properties: {
    userData: {
      type: Object,
      value: {}
    },
    setting: {
      type: Object,
      value: {}
    },
    sysConf: {
      type: Object,
      value: {}
    },
    sessionFrom: {
      type: Object,
      value: {}
    },
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  attached() {
  },
  detached() {
  },
  data: {
    assetsObj: {}
  },
  ready(){},
  observers: {
    'setting': function(){
      let setting = this.properties.setting || {};
      if(setting.is_enable){
        checkTips.call(this);
      }
    }
  },
  methods: {
    funcJump(e){
      Utils.throttle(() => {
        let dataset = e.currentTarget.dataset || {};
        let userData = this.properties.userData || {};
        if(dataset.key == "distribution"){
          dataset.MobileNo = userData.MobileNo || "";
        }
        userJump.jump(dataset, this.properties.sysConf);
      }, 3000)()
    }
  }
}))
function checkTips(){
  CheckUpdateTimer.checkTimer('rankTip').then(res=>{
    this.setData({
      showRankTip:true
    })
  }).catch(e=>{
    if(this.data.showRankTip){
      this.setData({
        showRankTip:false
      })
    }
  })
}