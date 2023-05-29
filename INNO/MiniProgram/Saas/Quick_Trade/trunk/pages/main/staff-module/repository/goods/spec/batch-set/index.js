const App = getApp();
Component(App.BC({
  properties:{
    fromType:String,
    setBlur:Boolean,
    setFocus:Boolean,
  },
  ready(){
    this.setView({ 
      customPopRef: { get: () => this.findView("#custom-pop") }, 
    })
  },
  methods: { 
    onBatchInput(e) {
      let key = this.getDataset(e, 'key');
      let value = e.detail.value;
      this.triggerEvent('onBatchInput',{key,value}); 
    },
    showModal() {
      this.customPopRef.showModal();
    },
    confirm() {
      this._checkAllValid().then(()=>{
          setTimeout(() => {
            this.dismiss();
            this.triggerEvent('onBatchConfirm');
          }, 150)
        }
      )
    },
    dismiss() {
      this.customPopRef.dismiss();
    }
  },
}))