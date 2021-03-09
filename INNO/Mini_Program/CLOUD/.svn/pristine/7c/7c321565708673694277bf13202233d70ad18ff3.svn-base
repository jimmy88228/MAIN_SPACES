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
  methods: {
    funcJump(e){
      let dataset = e.currentTarget.dataset || {};
      userJump.jump(dataset, this.properties.sysConf);
    }
  }
}))