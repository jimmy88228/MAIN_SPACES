import CheckUpdateTimer from "../../../../../helper/manager/check-update-timer";
import userJump from "../userJumpHandle";
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
      let dataset = e.currentTarget.dataset || {};
      let userData = this.properties.userData || {};
      if(dataset.key == "distribution"){
        dataset.MobileNo = userData.MobileNo || "";
      }
      userJump.jump(dataset, this.properties.sysConf);
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