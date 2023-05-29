const App = getApp();
Component(App.BC({  
    options:{
        addGlobalClass:true
    },
    properties: {
        goodsList:Array,
        domainPath:String,
        isInit:Boolean,
        isSelect:Boolean,
    }, 
    data: {
        isSelectAll:false,
        selectNum:0, 
        curId:0,
        scrollTop:0,
    },
    observers:{
        goodsList:function(nV,oV) {
            console.log('goodsList ob',nV);
            if(nV && Array.isArray(nV) && nV.length>0){
                let isSelectAll = true,selectNum=0;
                nV.forEach(item=>{
                    isSelectAll && !item.disabled && (isSelectAll = !!item.isSelected);
                    item.isSelected && (selectNum += 1);
                }); 
                this.setData({isSelectAll,selectNum,empty:false,allDisabled:isSelectAll&&selectNum==0})
            }else{
              this.setData({isSelectAll:false,selectNum:0,empty:true})
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
              if(!item.disabled){
                item.isSelected = !this.data.isSelectAll;
              }
            })
            this.triggerEvent('onSelectAll',{goodsList});
        },
        save(e){
            let goodsList = this.properties.goodsList||[];
            this.triggerEvent('save',{goodsList})
        },
        delete(e){
            let item = this.getDataset(e,'item')||{}; 
            this._showModal({
              content: '确定要删除该商品?',
            }).then(()=>{
              this.triggerEvent('onDelete',{item});
            })
        },
        editGoods(e){
          let goodsInfo = this.getDataset(e,'item')||{};
          goodsInfo.goodsImgs = goodsInfo.goods_img?[goodsInfo.goods_img]:[];
          let transData = encodeURIComponent(JSON.stringify(goodsInfo));
          App.StorageH.set("ReposityGoodsGallery", {galleryList: goodsInfo.galleryList || [], domainPath: this.properties.domainPath});
          this.jumpAction(`/pages/main/staff-module/repository/goods/index?goodsInfo=${transData}&activity_id=${this.properties.activity_id || ""}&isEdit=1&goodsId=${goodsInfo.goods_id||0}&fromType=goods`);
        },
        copy(e) {
          let item = this.getDataset(e,'item')||{}; 
          this.triggerEvent('copy',{item});
        },
        scrolltolower(e){
          this.triggerEvent('scrolltolower');
        },
        scrollToTop(){
          this.setData({
            scrollTop:0
          },()=>{
            this.setData({scrollTop:''});
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
