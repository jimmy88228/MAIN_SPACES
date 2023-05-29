const App = getApp();
Component(App.BC({
  data: {
    show: false,   
  }, 
  properties: { 
    transitionName:{
      type:String,
      value:""
    },
  },  
  methods: { 
    showModal() {
      return new Promise((rs)=>{
        this.setData({show: true},()=>{
          return rs();
        });
      })
    },
    dismiss() { 
      return new Promise((rs)=>{
        this.setData({show: false},()=>{
          return rs();
        });
      }) 
    }, 
     
  }
}))