const app = getApp();
Component(app.BTAB({ 
   
  properties: {
    color_img:{  //多色数组
      type: Array,
      value: [],
      observer(n){
        console.log("multi_color", n);
        this.getViewData(n);
      }
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
    },
    getViewData(data = []){
      let viewArr = [], viewKey = {};
      for(let i = 0; i < data.length; i++){
        let color_id = data[i].color_id || data[i].colorId;
        let img_url = data[i].img_url || data[i].imgUrl;
        if (!viewKey[color_id]){
          viewKey[color_id] = {}
          viewArr.push({
            color_id: color_id,
            img_url: img_url
          })
        }
      }
      if(!this.properties.cur_c_id){
        this.setData({
          cur_c_id: (viewArr[0] && viewArr[0].color_id) || 0
        })
      }
      this.setData({
        viewArr: viewArr
      })
    }
  }
}))
