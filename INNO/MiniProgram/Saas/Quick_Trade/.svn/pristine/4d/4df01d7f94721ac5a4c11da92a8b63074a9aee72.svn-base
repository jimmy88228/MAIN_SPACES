const App = getApp();
Component(App.BC({
  data:{
    value:""
  },
  ready(){
    this.setView({ 
      customPopRef: { get: () => this.findView("#custom-pop") }, 
    })
  },
  methods:{ 
    showModal() {
      console.log('batchSet');
      this.setData({value:""},()=>{
        this.customPopRef.showModal();
      })
    },
    onInput(e){
      let value = e.detail.value;
      this.setData({value})
    },
    confirm(){
      this._setPageLoading('add');
      this._checkAllValid().then(()=>{
        this.dismiss();
        this.triggerEvent('confirm',this.data.value);
      })
    },
    dismiss(){
      this.customPopRef.dismiss();
    },
  },
}))