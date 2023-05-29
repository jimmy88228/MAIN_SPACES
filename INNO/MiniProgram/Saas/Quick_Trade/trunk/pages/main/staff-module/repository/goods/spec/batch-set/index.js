const App = getApp();
Component(App.BC({
  properties:{
    fromType:String
  },
  methods: { 
    onBatchInput(e) {
      let key = this.getDataset(e, 'key');
      let value = e.detail.value;
      this.triggerEvent('onBatchInput',{key,value}); 
    },
    showModal() {
      this.customPop = this.customPop || this.selectComponent('#custom-pop');
      this.customPop.showModal();
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
      this.customPop.dismiss();
    },
  },
}))