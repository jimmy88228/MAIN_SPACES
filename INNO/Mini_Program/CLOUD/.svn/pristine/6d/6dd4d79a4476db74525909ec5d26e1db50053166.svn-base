import WindowBehaviors from "../../../../../ui/cps/window/window-behaviors.js";
const app = getApp();
const animStyle = "animation:animShow_cart 0.8s linear";
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  properties: {
    isLogin:{
      type:Boolean,
      value:false
    }
  },
  data: {
    ac_conf: app.Conf.style.v_color || {},
    boxStyle: "bottom: -100%;transition: bottom 300ms ease-in-out"
  },
  ready(){
    let icon_url = this.data.brand_info.icon_url||'';
    let carts = icon_url + "micro_mall/carts.png";
    let v_go_detail = icon_url + 'micro_mall/video_shop/v_go_detail.png' ;
    let v_close = icon_url + 'micro_mall/video_shop/v_close.png?123' ;
    let v_add = icon_url + 'micro_mall/video_shop/v_add.png' ;
    let v_add_active = icon_url + 'micro_mall/video_shop/v_add_active.png' ;
    let v_reduce = icon_url + 'micro_mall/video_shop/v_reduce.png' ;
    let v_reduce_active = icon_url + 'micro_mall/video_shop/v_reduce_active.png' ;

    this.setData({
      v_add,
      v_add_active,
      v_reduce,
      v_reduce_active,
      v_close,
      carts,
      v_go_detail
    })
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "bottom: 0;transition: bottom 300ms ease-in-out"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "bottom: -100%;transition: bottom 300ms ease-in-out"
      });
      return 300;
    },
    colorSelect(e) {
      let dataset = e.currentTarget.dataset || {};
      let selected = this.selected || {};
      if (this.data.extend.attr_count == 1 && (!dataset.invent || dataset.invent <= 0)) return
      let color_id = dataset.color_id || 0;
      if (color_id == selected.select_color_id) return
      selected.select_color_id = color_id;
      this.triggerEvent('colorSelect', { color_id });
    },
    sizeSelect(e) {
      let dataset = e.currentTarget.dataset || {};
      let selected = this.selected || {};
      if (!dataset.invent || dataset.invent <= 0) return
      let size_id = dataset.size_id || 0;
      if (size_id == selected.select_size_id) return
      selected.select_size_id = size_id;
      this.triggerEvent('sizeSelect', { size_id });
    },
    updateSku(data={}){
      let selected = data || {};
      // console.log('更新sku', selected);
      this.setData({
        selected
      });
    },
    skuConfirm(e) {
      if (this.isLoading) return
      if (!this.data.checkBuy){
        this.setData({
          checkBuy:true
        })
      }
      let detail = e.detail || {};
      if(e.type=='tap'){
        let dataset = e.currentTarget.dataset||{};
        detail = dataset.type || {};
      }
      this.isLoading = true;
      this.triggerEvent('skuConfirm', detail);
    },
    loadData(data={}){
      console.log('商品规格:', data, this.last_goods_id, data.total_info.goods_id);
      data=data || {};
      let g_id = data.total_info && data.total_info.goods_id || 0;
      let selected = data.selected || {};
      let extend = data.extend || {};
      let total_info = data.total_info || {};
      let goods_info = data.goods_info || {};
      let gallery = data.gallery || {};
      let colorArr = data.colorArr || {};
      let sizeArr = data.sizeArr || {};
      let sku=data.sku;
      this.setData({
        extend,
        total_info,
        sku,
        goods_info,
        selected,
        gallery,
        colorArr,
        sizeArr
      });
      initType.call(this);
    },
    onTapNum(e){
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
      let selected = this.data.selected || {};
      let now = selected.select_goods_count || 0;
      let num = selected.product_info.product_number;
      if (type == 'add' && (now < num)){
        selected.select_goods_count += 1;
        this.updateSku(selected);
        this.triggerEvent('numTap', { num:selected.select_goods_count });
        return
      } else if (type == 'reduce' && (now >1)){
        selected.select_goods_count -= 1;
        this.updateSku(selected);
        this.triggerEvent('numTap', { num:selected.select_goods_count });
        return
      }
      let name = ""
      if (this.data.extend.attr_count == 2 &&  !this.data.selected.select_size_id){
        name = "请选择" + this.data.extend.size_name_title;
      } else if (this.data.extend.attr_count == 1 && !this.data.selected.select_color_id) {
        name = "请选择" + this.data.extend.color_name_title;
      } else if (type == 'add'){
        name = "该商品不能购买更多哦";
      }else if (type == 'reduce'){
        name = "该商品不能再减少了哦";
      }
      if(!name)return
      this.setToast(true,name,2000);
    },
    cartJump(e){
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type|| '';
      let goodsId = this.data.goods_info && this.data.goods_info.goodsId || 0;
      this.triggerEvent('cartJump', { goodsId, type});
    },
    onClose(){
      this.dismiss();
    },
    setThrottle(bool=false){
      this.isLoading = bool;
    },
    setToast(bool=false,name="",time=1200){
      time = time - 200;
      this.setData({
        showToast:bool||false,
        showToastName:name || "",
      },function (){
        if (!this.data.showToastStyle) {
          this.setData({
            showToastStyle: "opacity:1;"
          })
        }
      })
      if(bool){
        clearTimeout(this.showToastId);
        this.showToastId = setTimeout(()=>{
          this.setData({
            showToastStyle:""
          })
          setTimeout(()=>{
            this.setData({
              showToast: false,
              showToastName: ""
            })
          },150)
        }, time)
      }
    },
    setAnim(bool=false){
      if (this.data.showCir)return
      this.setData({
        showCir:true
      })
      setTimeout(()=>{
        this.setData({
          animStyle: animStyle
        })
      },50);
      setTimeout(()=>{
        this.setData({
          animStyle: "",
          showCir: false
        })
      },850);
    },
    _noFn() { }
  }
}))


function throttle(time = 500) {
  this.isLoading = true;
  let _timer = setTimeout(() => {
    this.isLoading = false;
    clearTimeout(_timer);
  }, 500)
}

function initType(){
  let id = this.data.goods_info && this.data.goods_info.goodsId||0;
  let customCart = {
    type: 0,
    goodsId: id
  }
  let customBuy = {
    type: 1,
    goodsId: id
  }
  this.setData({
    customCart,
    customBuy
  })
}
 