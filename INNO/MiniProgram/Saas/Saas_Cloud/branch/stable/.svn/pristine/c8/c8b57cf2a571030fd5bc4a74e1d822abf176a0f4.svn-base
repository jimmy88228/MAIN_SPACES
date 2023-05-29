import CheckUpdateTimer from "../../../../../common/helper/check-update-timer";
import userJump from "../userJumpHandle";
import Utils from "../../../../../common/support/utils/utils";
// import SG from "../../../../../common/helper/handle/shopGuideHandle.js"

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
    staffInfoBind:{
      type: Object,
      value: {}
    },
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  attached() {
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
    }, 
    completemessage(e){
      this.triggerEvent('completemessage',e);
    },
    activeCustomerService(){
      this.triggerEvent('activeCustomerService');
    },
    startmessage(e){
      this.triggerEvent('startmessage',e);
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