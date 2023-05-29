const App = getApp();
Component(App.BC({
  data: {
    show: false,
    list: [
      {
        shareId: 1,
        shareTip: "发送给朋友",
        showed: true,
      },
      {
        shareId: 2,
        shareTip: "生成卡片保存并分享",
        showed: true,
      }
    ]
  },
  methods: {
    userIsLogin() {
      return App.LM.getUserTokenAsync(true)
      .then(data => {
        // cache
        if (data.userToken) return Promise.resolve(data);
        return Promise.reject();
      })
    },
    showProcess() {
      this.setData({show: true});
      return new Promise((rs, rj) => {
        this.resolveF = rs;
        this.rejectF = rj;
      })
    },
    showModal(options = {needLogin: false}) {
      const {needLogin} = options;
      if (needLogin) {
        return this.userIsLogin()
          .then(() => this.showProcess());
      }
      return this.showProcess();
    },
    dismiss() {
      if (typeof this.rejectF === "function") this.rejectF();
      this.resolveF = this.rejectF = null;
      this.setData({show: false})
    },
    handlePopItemTap(e) {
      this._throttle('handlePopItemTap');
      let item = this.getDataset(e, "item");
      this.setData({show: false}, () => {
        typeof this.resolveF === "function" && this.resolveF(item);
        this.resolveF = this.rejectF = null;
      })
    }
  }
}))