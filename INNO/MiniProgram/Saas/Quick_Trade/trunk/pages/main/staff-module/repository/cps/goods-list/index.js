const App = getApp();
Component(App.BC({  
    options:{
        addGlobalClass:true
    },
    properties: {
        goodsList:{
            type:Array,
            value:[]
        },
        isSelect:{
            type:Boolean,
            value:false
        }
    }, 
    data: {
        isSelectAll:false,
        selectNum:0
    },
    observers:{
        goodsList:function(nV,oV) {
            if(nV && Array.isArray(nV) && nV.length>0){
                let isSelectAll = true,selectNum=0;
                nV.forEach(item=>{
                    isSelectAll && (isSelectAll = item.isSelected);
                    item.isSelected && (selectNum += 1);
                }); 
                this.setData({isSelectAll,selectNum})
            }
        }     
    },
    /**
     * 组件的方法列表
     */
    methods: {
        onSelect(e){
            let goodsList = this.properties.goodsList||[];
            let item = this.getDataset(e,'item')||{};
            let index = this.getDataset(e,'index')||0;
            item.isSelected = !!!item.isSelected; 
            console.log('onSelect',item,goodsList) 
            this.triggerEvent('onSelect',{index,item});
        },
        selectAll(){
            let goodsList = this.properties.goodsList||[];
            goodsList.forEach(item=>{
                item.isSelected = !this.data.isSelectAll;
            })
            this.triggerEvent('onSelectAll',{goodsList});
        },
        save(e){
            let goodsList = this.properties.goodsList||[];
            this.triggerEvent('save',{goodsList})
        },
        delete(e){
            let item = this.getDataset(e,'item')||{};
            this.triggerEvent('onDelete',{item});
        },
        editGoods(e){ 
          let goodsInfo = this.getDataset(e,'item')||{}; 
          goodsInfo.goodsImgs = goodsInfo.goods_img?[goodsInfo.goods_img]:[];
          let transData = encodeURIComponent(JSON.stringify(goodsInfo));
          this.jumpAction(`/pages/main/staff-module/repository/goods/index?goodsInfo=${transData}&activity_id=${this.properties.activity_id}&isEdit=1`);
        },
        copy(e) {
          let goodsId = this.getDataset(e, "goodsId");
          copyGoods(goodsId)
            .then(() => {
              this.triggerEvent('onRefresh');
            })
            .catch(err => {
              console.log("copy err", err);
              App.SMH.showToast({title: err});
            })
        }
    }
}))

function copyGoods(goodsId = 0) {
  if (!goodsId) return Promise.reject("商品id 不能为0");
  return App.Http.QT_GoodsApi.copyGoods({
    params: {
      goodsId
    }
  })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || "复制商品失败")
    })
}
