const App = getApp();
Component(App.BC({
  data: {
    show: false,  
    catValue:[0],
  }, 
  properties: {
    curCat:{
        type:Number,
        value:0, 
    },
    catList:{
        type:Array,
        value:[]
    },
  }, 
  observers:{
    curCat : function (nV){
      nV && this.setData({
        catValue : [nV]
      })  
    }
  },
  methods: { 
    showModal() {
      this.setData({show: true});
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
     
    pickerChange(e){
      const val = e.detail.value;
      this.setData({
        catValue:val
      })
    }, 
    pickerSel(){
      setTimeout(() => {
        this.setData({curCat:this.data.catValue[0]});
        this.setData({show: false}, () => {
          typeof this.resolveF === "function" && this.resolveF(this.data.curCat);
          this.resolveF = this.rejectF = null;
        })
      }, 600);
    },
    pickerAdd() {
      this.createPop = this.createPop || this.selectComponent("#create-pop");
      this.createPop.showModal()
      .then(catName => {
        this.showLoading();
        return createOrUpdateCategoryInfo({catName, id: 0})
      })
      .then(() => {
        App.SMH.showToast({title: "添加商品分类成功"});
        this.triggerEvent('refreshPickerList');
      })
      .finally(() => {
        this.hideLoading();
      })
      .catch(() => {
      })
    },
  }
}))

function createOrUpdateCategoryInfo(data) {
  return App.Http.QT_GoodsApi.createOrUpdateCategoryInfo({
    data
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "添加商品分类失败")
    })
}