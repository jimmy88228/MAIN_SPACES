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
      this.setData({show: true}); 
    },
    dismiss() {
      this.setData({show: false})
    }, 
     
  }
}))