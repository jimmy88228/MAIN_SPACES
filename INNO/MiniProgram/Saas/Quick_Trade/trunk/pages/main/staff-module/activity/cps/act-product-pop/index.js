const App = getApp();
Component(App.BC({
  methods:{
    showModal(options){
        this.customPop = this.customPop || this.selectComponent('#custom-pop');
        this.actProductList = this.actProductList || this.selectComponent('#act-product-list');
        this.customPop.showModal().then(()=>{
            this.actProductList.init(options)
        });
    },
    dismiss(){
        this.customPop.dismiss();
    },
    productSave(){
        console.log('act-product-pop',)
        this.dismiss();
        // this.triggerEvent('save');
    }
  },
}))