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
    handleInput(e) {
      let value = e.detail.value || "";
      this.setData({cateName: value})
    },
    showModal(name,type="") {
      this.setData({show: true, cateName: name||"",type});
      return new Promise((rs, rj) => {
        this.confirmPopRef.showModal(rs,rj);
      })
    }, 
    onconfirm(e) {
      let detail = e.detail||null;
      let cateName = this.data.cateName || "";
      if (!cateName.trim()) {
        App.SMH.showToast({title: "请输入商品分类名称"});
        return 
      }
      detail && typeof(detail) == 'function' && detail(cateName); 
    }
  }
}))