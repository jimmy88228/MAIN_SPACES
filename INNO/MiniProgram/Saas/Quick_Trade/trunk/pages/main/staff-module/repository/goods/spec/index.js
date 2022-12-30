const { default: WxApi } = require("../../../../../../common/utils/wxapi/index");

// pages/main/staff-module/repository/goods/spec/index.js
const App = getApp();
Page(App.BP({   
    data: { 
        specInfo:{ //暂时没接口，先用测试数据  
        },
        detail:{},
        productInfo:{
            'default':{ 
                market_price:"",
                sale_price:"",
                product_sn:"",
                goods_number:"",
            }
        },
        curSel:"default",
        
    },
    onLoad(options){
        this.options = options;
        this.setData({options})
        this.ids = this.options.id && this.options.id.split(',') || [];
        if(this.options.fromType == 'activity'){
            this.activityGoodsProductInfo()
        }else{
            this.getSpecCategoryInfo();
        }
    },
    checkOptions(data){
        let productInfo = data||this.data.productInfo||{}; 
        let {market_price,sale_price,product_sn,goods_number} = this.options;
        console.log('market_price,sale_price,product_sn,goods_number',market_price,sale_price,product_sn,goods_number,productInfo)
        for(let key in productInfo){
            let item = productInfo[key]||{};
            console.log('进来',key,item)
            if(market_price || market_price == 0){
                item.market_price = market_price
            }
            if(sale_price || sale_price == 0){
                item.sale_price = sale_price
            }
            if(product_sn){
                item.product_sn = product_sn
            }
            if(goods_number || goods_number == 0){
                item.goods_number = goods_number;
            } 
        }
        console.log('productInfo',productInfo)
        this.setData({productInfo});
    },
    createDefault(){
        if(this.options.fromType == 'activity'){
            let specInfo = { 
                "default":{
                    name:"",
                    list:[{id:0}]
                }
            }
            this.setData({specInfo})
        }
        this.checkOptions();
    },
    getSpecCategoryInfo() {
      this.showLoading();
      return getSpecCategoryInfo()
        .then(data => {
          this.setData({specInfo: handleSpecInfo(data)})
        })
        .finally(() => {
          this.hideLoading();
        })
    },
    activityGoodsProductInfo(){
        if(this.ids.length<=0){this.createDefault(); return Promise.reject();};
        let params = {
            id:this.ids.map(item=>parseInt(item)),
            activityId:this.options.activityId
        }
        return activityGoodsProductInfo(params).then(res=>{
            if(res.code==1){
                let data = res.data||{};
                let productEntities = data.productEntities||[];
                let productInfo = {},specInfo={'default':{list:[]}};
                productEntities.forEach(item=>{
                    productInfo[item.product_id] = item;
                });
                specInfo.default.list = productEntities||[];
                this.setData({specInfo})
                console.log('productInfo',productInfo);
                console.log('specInfo',specInfo);
                this.checkOptions(productInfo);
            }
        })
    },
    onSelect(e){
        let curSel = this.getDataset(e,'index');
        console.log(e,curSel)
        this.setData({curSel})
    },
    deleteSpec(e){
        let index = this.getDataset(e,'index');
        let specInfo = this.data.specInfo||{},curSel = this.data.curSel;
        if(index==-1){
            delete specInfo[curSel]
        }else{
            specInfo[curSel] && specInfo[curSel].list && specInfo[curSel].list.splice(index,1);
        }
        console.log('index',index,specInfo)
        this.setData({specInfo})
    },
    onInput(e){
        let key = this.getDataset(e,'key');
        let id = this.getDataset(e,'id');
        let specCatId = this.getDataset(e,'specCatId');
        let value = e.detail && e.detail.value; 
        this.setData({
            [`productInfo.${id}.${key}`]:value,
            [`productInfo.${id}.specCatId`]: specCatId
        })
    },
    save(){
        let fromType = this.options.fromType || "";
        return fromType === "activity" ? this.activityProductUpdateOrInsert() : this.createOrUpdateGoodsProduct();
    },
    activityProductUpdateOrInsert(){
        let productInfo = this.data.productInfo || {};
        let productList = Object.values(productInfo); 
        let params = {
            goodsId:this.options.goodsId||0,
            activityId:this.options.activityId||0,
            productList,
        }
        console.log('Object.values',Object.values(productInfo))
        return activityProductUpdateOrInsert(params).then(res=>{
            let title = "保存成功";
            if(res.code==1){}else{
                title = res.msg||"保存失败";
            } 
            App.SMH.showToast({title})
            return res;
        }) 
    },
    createOrUpdateGoodsProduct() {
      let goodsId = this.options.goodsId || 0;
      let productInfo = this.data.productInfo || {};
      let specInfo = this.data.specInfo || {};
      let productList = [];
      for (let specId of Object.keys(productInfo)) {
        if (specId === "default") continue;
        console.log("specId", specId, productInfo[specId], productInfo[specId].specCatId, specInfo)
        productList.push({
          productId: 0,
          productSn: productInfo[specId].product_sn,
          marketPrice: productInfo[specId].market_price,
          specList: (specInfo[(productInfo[specId].specCatId)].list || []).map(item => ({
            specId: item.id,
            specName: item.name
          })),
        })
      }
      return App.Http.QT_GoodsApi.createOrUpdateGoodsProduct({
        data: {
          goodsId,
          productList
        }
      })
        .then(res => {
          if (res.code == 1) {
            App.SMH.showToast({title: "保存成功"});
            setTimeout(() => {WxApi.navigateBack()}, 500);
            return res.data
          }
          return Promise.reject(res.msg || "保存规格失败")
        })
        .catch(err => {
          App.SMH.showToast({title: err});
          console.log("createOrUpdateGoodsProduct err", err)
        })
    }
}))

function getSpecCategoryInfo() {
  return App.Http.QT_GoodsApi.getSpecCategoryInfo()
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取规格信息失败")
    })
}

function handleSpecInfo(specList) {
  let specInfo = {};
  specList.forEach((spec, index) => {
    specInfo[index === 0 ? "default" : spec.specCatId] = {
      name: spec.specCatName,
      list: (spec.SpecInfoList).map(item => ({
        name: item.specName || "",
        id: item.specId
      })),
      specCatId: spec.specCatId
    }
  })
  return specInfo
}

function activityGoodsProductInfo(params){
    return App.Http.QT_GoodsApi.activityGoodsProductInfo({
        data: params,
    })
}
function activityProductUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityProductUpdateOrInsert({
        data: params,
    })
}