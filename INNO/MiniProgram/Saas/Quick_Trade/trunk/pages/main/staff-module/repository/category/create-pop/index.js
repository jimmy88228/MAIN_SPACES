const App = getApp();
Component(App.BC({
  data: {
    show: false,
    cateName: ""
  },
  methods: {
    showModal() {
      this.setData({show: true, cateName: ""});
      return new Promise((rs, rj) => {
        this.resolveF = rs;
        this.rejectF = rj;
      })
    },
    dismiss() {
      if (typeof this.rejectF === "function") this.rejectF();
      this.resolveF = this.rejectF = null;
      this.setData({show: false})
    },
    handlePopItemTap(e) {
      let item = this.getDataset(e, "item");
      this.setData({show: false}, () => {
        typeof this.resolveF === "function" && this.resolveF(item);
        this.resolveF = this.rejectF = null;
      })
    }
  }
}))