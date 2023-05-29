const App = getApp();

Component(App.BC({ 
  data: {
    show: false,
    isFull:false,
  },
  methods: {
    showLoading(isFull=false){
      return new Promise(rs => {
        this.setData({isFull:!!isFull})
        if(!this.data.show){
          this.setData({show: true}, rs)
        }else{
          rs();
        }
      })
    },
    hideLoading(){
      return new Promise(rs => {
        if(this.data.show){
          this.setData({show: false}, rs)
        }else{
          rs();
        }
      })
    }
  }
}))