const app = getApp();
Component(app.BTAB({
  options:{
    multipleSlots: true
  },
  properties: {
    customStyle: {
      value: "bottom: 300rpx;",
      type: String
    },
    levelStyle:{
      value: "right: 8rpx;",
      type: String
    }
  }
}))