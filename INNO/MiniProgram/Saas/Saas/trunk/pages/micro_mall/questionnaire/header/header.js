import WxApi from "../../../../common/helper/wx-api-helper.js";
const app = getApp();
Component(app.BTAB({
  properties: {
    info:{
      type: Object,
      value: {}
    },
    titleStyle:{
      type: String,
      value: ""
    },
    childTitleStyle:{
      type: String,
      value: ""
    }
  },
  data: {
  },
  methods: {
    previewImage(e){
      const paths = e.currentTarget.dataset.paths || "";
      paths && WxApi.previewImage({
        urls: paths || []
      })
    },
  }
}))