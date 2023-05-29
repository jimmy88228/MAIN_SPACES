// pages/main/staff-module/repository/cps/search-box/index.js
const App = getApp();
Component(App.BC({  
    options:{
        addGlobalClass:true
    },
    properties: {
        categoryList:{
            type:Array,
            value:[]
        }
    }, 
    data: {
      searchInfo:{},
      curId:0,
    }, 
    methods: {
      onInput(e){
        this.onInputPublic(e);
      },
      onConfirm(){
        this.triggerEvent('onConfirm',this.data.searchInfo.name)
      }, 
      onCatSelect(e){
        let id = this.getDataset(e,'id');
        this.setData({curId:id})
        this.triggerEvent('onCatSelect',id);
      }
    }
}))
