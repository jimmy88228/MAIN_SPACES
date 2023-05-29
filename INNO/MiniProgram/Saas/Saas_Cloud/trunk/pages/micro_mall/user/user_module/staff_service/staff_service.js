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
  methods: {
    funcJump(e){
      Utils.throttle(() => {
        let dataset = e.currentTarget.dataset || {};
        userJump.jump(dataset, this.properties.sysConf);
      }, 3000)()
    }
  }
}))