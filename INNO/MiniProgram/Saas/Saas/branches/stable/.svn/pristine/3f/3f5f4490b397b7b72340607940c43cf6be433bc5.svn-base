const app = getApp();
Component(app.BTAB({
  properties: {
    selectGoodsInfo:{
      type: Object,
      value: {},
    },
    select_goods:{
      type: Object,
      value: {},
    },
    goodsExtend:{
      type: Object,
      value: {}  
    },
    goodsType:{ //normal
      type: String,
      value: ""
    },
  },
  data: {
    selectShipInfo: {
      selectIndex: 0  //配送方式  0可全部，1仅限门店，2仅限快递配送（selectIndex一一对应）
    },
  },
  ready(){
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    this.setData({
      ls_icon2,
      ls_icon1
    })
  },
  methods: { 
    initShippingInfo() { //init
      let stoKey = "select_store";
      let select_goods = this.data.select_goods||{};
      select_goods.shippingInfo || (select_goods.shippingInfo = {});
      let shippingInfo = select_goods.shippingInfo||{};
      let lastStoreId = shippingInfo.storeId;
      let select_store = app.StorageH.get(stoKey) || {};  
      let storeId = select_store.id||0;
      (shippingInfo.selfGet == 1 || shippingInfo.selfGet == 2) && (shippingInfo.shippingType = shippingInfo.selfGet);
      console.log('initShippingInfo',select_store.id,shippingInfo.shippingType)
      if(select_store.id && (shippingInfo.shippingType == 0 ||shippingInfo.shippingType == 1)){
          shippingInfo.storeId = storeId;
          shippingInfo.name = select_store.name || "";
          shippingInfo.shippingType = 1;
      }else if(shippingInfo.shippingType != 1){
        shippingInfo.storeId = storeId;
        shippingInfo.name = select_store.name || "";
        shippingInfo.shippingType = 2;
      }
      let update = shippingInfo.shippingType == 1 && shippingInfo.storeId && ((lastStoreId != shippingInfo.storeId)) || false;
      console.log('updateupdate',shippingInfo.shippingType == 1 , shippingInfo.storeId , ((lastStoreId != shippingInfo.storeId)))

    //   let update = shippingInfo.shippingType == 1 && shippingInfo.storeId && lastStoreId && ((lastStoreId != shippingInfo.storeId)) || false;
      emitData(this,update);
    },
    onTap(e){
      if (this.isLoading)return
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      let index = dataset.index || "2";
      throttle.call(this,this.lastIndex == index?500:200);
      this.lastIndex = index;
      let select_goods = this.data.select_goods || {};
      let shippingInfo = select_goods.shippingInfo||{};
      let productInfo = select_goods.productInfo||{};
      if (type =="shippingChange"){ //单纯切换index
        shippingInfo.shippingType = index;
        emitData(this,true);
      } else if (type == "selectStore"){ //需要跳转去店铺列表(所以不需要shippingChange)
        if(!(productInfo.product_id)){
          let goodsExtend = this.data.goodsExtend||{};
          let tip = select_goods.select_color_id ? goodsExtend.size_name_title : goodsExtend.color_name_title
          app.SMH.showToast({
            title:"请选择" + (tip || "完整规格")
          })
          return
        }
        let store_id = shippingInfo.storeId;
        let pId = productInfo.product_id||0;
        let url = "";
        shippingInfo.shippingType = index;
        emitData(this,true);
        if(pId){
          url = `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&pId=${pId}&goodsNum=${select_goods.select_goods_count || 1}&paramsType=${this.properties.goodsType == 'sk'?1:0}`
        }else{
          url = `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&goods_id=${select_goods.goods_id}&goodsNum=${select_goods.select_goods_count || 1}&paramsType=${this.properties.goodsType == 'sk'?1:0}`
        }
        wx.navigateTo({
          url,
          complete: ()=>{
            this.triggerEvent('jumpStoreNav');
          }
        })
      }
    }
  },
}))

function throttle(time=350){
  this.isLoading = true;
  let _timer = setTimeout(()=>{
    this.isLoading = false;
    clearTimeout(_timer);
  },time)
}

function emitData(_this,update=false){
  let data = _this.data.select_goods||{};
  _this.triggerEvent('ChangeData',{data,update,fromType:"shipping"},{
    bubbles: true,
    composed: true,
    capturePhase:true,
  })
}