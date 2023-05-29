const App = getApp();
Component(App.BC({
  data: {
    show: false,
    cateName: ""
  },
  ready(){
    this.setView({ 
      confirmPopRef: { get: () => this.findView("#confirm-pop") }, 
    })
  },
  methods: {
    onfocus() {
      this.triggerEvent('onfocus')
    },
    onblur() {
      this.triggerEvent('onblur')
    },
    handleInput(e) {
      let value = e.detail.value || "";
      this.setData({cateName: value})
    },
    showModal(name) {
      this.setData({show: true, cateName: name||""});
      return new Promise((rs, rj) => {
        this.confirmPopRef.showModal(rs,rj);
        // this.resolveF = rs;
        // this.rejectF = rj;
      })
    },
    dismiss() {
      if (typeof this.rejectF === "function") this.rejectF();
      this.resolveF = this.rejectF = null;
      this.setData({show: false})
    },
    handlePopItemTap(e) {
      let cateName = this.data.cateName || "";
      if (!cateName.trim()) {
        App.SMH.showToast({title: "请输入商品分类名称"});
        return 
      }
      this.setData({show: false}, () => {
        typeof this.resolveF === "function" && this.resolveF(this.data.cateName);
        this.resolveF = this.rejectF = null;
      })
    },
    onconfirm(e) {
      let detail = e.detail||null;
      let cateName = this.data.cateName || "";
      console.log('create pop confirm',e,cateName);
      if (!cateName.trim()) {
        App.SMH.showToast({title: "请输入商品分类名称"});
        return 
      }
      detail && typeof(detail) == 'function' && detail(cateName); 
    }
  }
}))