const App = getApp();
Component(App.BC({
  data:{
    value:""
  },
  ready(){
  },
  methods:{ 
    showModal() {
      console.log('batchSet');
      this.setData({value:""},()=>{
        this.customPop = this.customPop || this.selectComponent('#custom-pop');
        this.customPop.showModal();
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
      this.customPop.dismiss();
    },
  },
}))