import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {},
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    code: 0, // 分享有礼接口返回 -1为错误, 1为助力成功, 2为助力失败 
    msg: "", // 分享有礼接口返回 提示信息
    sourceUserAvatar: "", // 来源用户头像
  },
  attached() {
    this.visitRecordListenerId = app.EB.listen("visitRecord", res => {
      this.showFn(res)
    })
  },
  detached() {
    app.EB.unListen("visitRecord", this.visitRecordListenerId)
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    showFn({code, msg, data: sourceUserAvatar = ""}) {
      this.setData({code, msg, sourceUserAvatar}, () => {
        this.show()
      })
    }
  }
}))