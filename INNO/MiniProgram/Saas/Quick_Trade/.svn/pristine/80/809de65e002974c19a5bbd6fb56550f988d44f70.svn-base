const App = getApp();
Component(App.BC({
  ready(){
    this.setView({ 
      customPopRef: { get: () => this.findView("#custom-pop") }, 
      actProductListRef: { get: () => this.findView("#act-product-list") }, 
    })
  },
  methods:{
    showModal(options){
        this.customPopRef.showModal().then(()=>{
            this.actProductListRef.init(options);
        });
    },
    dismiss(){
        this.customPopRef.dismiss();
    },
    productSave(){
        this.dismiss();
        // this.triggerEvent('save');
    }
  },
}))