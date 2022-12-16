// pages/micro_mall/video_shopping/v_page/v_components/v_goods_list.js
const app = getApp();
Component(app.BTAB({
  properties: {

  },
  data: {
    goodsList:[],
    ac_conf: app.Conf.style.v_color || {},
    opacity:"",
  },

  /**
   * 组件的方法列表
   */
  ready(){
    let v_cart = this.data.brand_info.icon_url + "micro_mall/video_shop/v_cart.png";
    this.setData({
      v_cart
    })
  },
  methods: {
    loadData(data=[]){
      // console.log('商品列表加载',data);
      this.setData({
        opacity:"opacity:0;"
      })
      clearTimeout(this.opacityId);
      this.opacityId = setTimeout(()=>{
        this.setData({
          opacity: "transition: opacity 0.7s;",
          goodsList: data || []
        })
      },150);
    },
    onTap(e){
      let dataset = e.currentTarget.dataset || {};
      let id = dataset.id || 0;
      let cur_g = dataset.cur_g || 0;
      let data = {};
      data.id = id;
      data.cur_g = cur_g;
      this.triggerEvent('popupShow', data);
    },
  }
}))
