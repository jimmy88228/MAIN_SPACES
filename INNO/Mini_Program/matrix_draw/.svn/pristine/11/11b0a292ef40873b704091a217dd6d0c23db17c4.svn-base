// pages/component/shippingTypeMod/shippingTypeMod.js
const app = getApp();
Component(app.BTAB({
  properties: {
    selectGoodsInfo:{
      type: Object,
      value: {}
    },
    goodsExtend:{
      type: Object,
      value: {}  
    },
    fromType:{
      type: String,
      value: ""
    },
    goodsNum:{
      type: Number,
      value: 1
    },
  },
  data: {
    selectShipInfo: {
      selectIndex: 0
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
    shipSelect(e) {
      let detail = e.detail || {};
      let selectShipInfo = JSON.parse(JSON.stringify(this.data.selectShipInfo || {}));
      let selectIndex = selectShipInfo.selectIndex;
      // let dataset = e.currentTarget.dataset || {};
      this.setData({
        "selectShipInfo.selectIndex": detail.index || 0
      })
      if (selectIndex != detail.index && (!detail.jump)) {
        // getSku.call(this);
      }
    },
    selectStore(e) {
      let selectShipInfo = this.data.selectShipInfo || {};
      console.log(selectShipInfo, "selectShipInfo");
      let store_id = selectShipInfo.id || 0;
      let selectGoodsInfo = this.data.selectGoodsInfo || {};
      wx.navigateTo({
        url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&goods_id=${selectGoodsInfo.goods_id||0}&goodsNum=${selectGoodsInfo.select_goods_count || 1}&fromType=${this.properties.fromType}`,
      })
    },
    initShippingInfo() { //init
      let stoKey = "";
      if(this.properties.fromType=='sk'){
        stoKey = 'select_store';
      }else{
        stoKey = 'select_store';
      }
      let select_store = app.StorageH.get(stoKey) || {};
      let selectShipInfo = this.data.selectShipInfo || {};
      if (select_store.id && (selectShipInfo.selectIndex == 0 || selectShipInfo.selectIndex == 1)) {
        let store_id = select_store.id;
        selectShipInfo.id = store_id;
        selectShipInfo.name = select_store.name || "";
        selectShipInfo.selectIndex == 0 && (selectShipInfo.selectIndex = 1);
        this.setData({
          selectShipInfo: selectShipInfo
        })
        console.log('jimmy 自提',selectShipInfo);
        this.triggerEvent('shippingChange',{index:1,store_id});
      } else {
        selectShipInfo.selectIndex = 2;
        this.setData({
          selectShipInfo: selectShipInfo
        })
        this.triggerEvent('shippingChange',{index:2});
        console.log('jimmy 快递',selectShipInfo)
      }
    },
    onTap(e){
      if (this.isLoading)return
      let dataset = e.currentTarget.dataset||{};
      let type = dataset.type||"";
      let index = dataset.index || "2";
      throttle.call(this,this.lastIndex == index?500:200);
      this.lastIndex = index;
      let selectShipInfo = this.data.selectShipInfo || {};
      let selectGoodsInfo = this.data.selectGoodsInfo || {};
      if (type =="shippingChange"){
        let update = selectShipInfo.selectIndex!=index;
        selectShipInfo.selectIndex = index;
        this.triggerEvent('shippingChange',{index,update});
      } else if (type == "selectStore"){
        let update = selectShipInfo.selectIndex!=index;
        this.triggerEvent('shippingChange', {index,update});
        selectShipInfo.selectIndex = index;
        let store_id = selectShipInfo.id || 0;
        wx.navigateTo({
          url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&goods_id=${selectGoodsInfo.goods_id}&goodsNum=${selectGoodsInfo.select_goods_count || 1}`,
        })
      }
      if(type=="shippingChange" || type=="selectStore"){
        this.setData({
          selectShipInfo
        })
      }
    },
    _noFn(){}
  },
  
}))

function throttle(time=350){
  this.isLoading = true;
  let _timer = setTimeout(()=>{
    this.isLoading = false;
    clearTimeout(_timer);
  },time)
}