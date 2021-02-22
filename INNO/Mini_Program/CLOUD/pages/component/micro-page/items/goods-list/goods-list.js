// pages/component/micro-page/items/goods-list/goods-list.js

const app = getApp();
Component(app.BTAB({
  properties: {
    _data:{
      type:Object,
      value:{},
      observer:function(n,o){
        if(!this.readyed)return
        this.init(n);
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
    listData:{
      type:Array,
      value:[]
    }
  },
  attached(){
    this.readyed = true;
  },
  data: {
    htmlNodes:""
  },
  methods: {
    init(data){
      console.log('init rich-text',data);
      let group =  data && data.goodsGroup||[];
      this.setData({
        showTab: group.length>1,
        listData: group
      })
    },
  }
}))