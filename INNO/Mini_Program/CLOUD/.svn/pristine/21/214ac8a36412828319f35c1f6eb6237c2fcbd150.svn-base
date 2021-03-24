// pages/component/micro-page/items/goods-list/goods-list.js
import mcBehavior from '../../../help/mc-behavior.js'
const app = getApp();
const NumTextTrans={
  "one":1,
  "two":2,
  "three":3,
  "four":4,
}
Component(app.BTAB({
  behaviors: [mcBehavior],
  properties: {
    _data:{
      type:Object,
      value:{},
      observer:function(n,o){
        n && this.init(n);
      }
    },
    showTab:{
      type:Boolean,
      value:false,
    },
    curTab:{
      type:Number,
      value:0
    },
    getList:{
      type:Array,
      value:[],
      observer:function(n,o){
        if(!this.readyed)return
        n && this.initList(n);
      }
    }
  },
  attached(){
    this.readyed = true;
  },
  data: {
    htmlNodes:"",
    NumTextTrans,
    screenWidth:app.SIH.screenWidth
  },
  methods: {
    init(data){
      // console.log('init goods-list',data);
      let group =  data && data.goodsGroup||[];
      this.setData({
        showTab: group.length>1,
      })
    },
    initList(data){
      this.setData({
        listData:data,
        init:true
      }) 
    },

    onTap(e){
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      if(type == 'tab'){
        let curTab = dataset.index||0;
        this.setData({
          curTab
        })
        this.refreshData(curTab)
      }
    },
    refreshData(index){
      this.triggerEvent('singleSwitch',{index})
    }
  }
}))