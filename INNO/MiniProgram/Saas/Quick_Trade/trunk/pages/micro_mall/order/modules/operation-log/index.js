const App = getApp();
Component(App.BC({
  properties:{
    list:Array
  },
  data:{
    allRecord:false,
  },
  methods:{
    handleMoreRecordTap() {
      this.setData({allRecord: !this.data.allRecord})
    },
  }
}))