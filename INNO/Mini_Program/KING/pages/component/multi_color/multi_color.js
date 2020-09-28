const app = getApp();
Component(app.BTAB({ 
   
  properties: {
    color_img:{  //多色对象
      type:Object,
      value:{},
    },
    defaultImgArr: { //默认第一个的对象
      type:Object,
      value:{},
    },
    label: {      //默认第一个的对象的color_id
      type:Number,
      value:0,
    },
    cur_c_id:{  //当前选中的color_id
      type:Number,
      value:0, 
    },
    colorNum:{  //颜色数量
      type:Number,
      value:0, 
    },
    colorName:{  //规格一的名称
      type:String,
      value:"", 
    },
  },
 
  data: {

  }, 
  methods: {
    changeGoodsColor: function (e) {
      let that = this;
      let dataset = e.target.dataset && e.target.dataset || {};
      let color_id = parseInt(dataset.color_id || 0);
      this.triggerEvent('changeGoodsColor', { color_id })
    },
    df_img_fnc(e){
      this.setData({
        df_show:true
      })
    }
  }
}))
