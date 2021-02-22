// pages/component/progress_bar/progress_bar.js
const app = getApp();
Component(app.BTAB({
  options: {
    multipleSlots: true,
    addGlobalClass: true,
  },
  properties: {
    tip:{
      type:String,
      value:''
    },
    acBg:{
      type:String,
      value:''
    },
    percent:{
      type:Number,
      value:0
    }, 
    showCircle:{
      type: Boolean,
      value: false
    },
    showTran:{
      type: Boolean,
      value: false
    },
    auto_h:{
      type: Boolean,
      value: false
    },
  },
  data: {
    ac_conf: app.Conf.style.n_sk_color,
  },
  methods: {

  }
}))
