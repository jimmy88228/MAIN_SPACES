import WxApi from "../../../../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  data: {
    specInfoList: [], // 所有的规格列表
    selectedSpecInfoList: [ // 已选择的规格列表
      // { 
      //   name: "性价比",
      //   specList: [{
      //       specId: 1,
      //       specName: "高"
      //     },
      //     {
      //       specId: 2,
      //       specName: "中"
      //     },
      //     {
      //       specId: 3,
      //       specName: "低"
      //     }
      //   ]
      // },
      // {
      //   name: "颜色",
      //   specList: [{
      //       specId: 1,
      //       specName: "红"
      //     },
      //     {
      //       specId: 2,
      //       specName: "蓝"
      //     },
      //     {
      //       specId: 3,
      //       specName: "白"
      //     }
      //   ]
      // }
    ],
    selectedSpecInfoRef: { // 已选择的规格字典
      // 5: { // "specCatId"
      //   1: "白色" // specId:specName
      // },
    },
    productList: [],
    invalid:false,
  },
  onLoad(options) {
    this.options = options;
    this.batchInputData={};
    this.setData({fromType:options.fromType||"",insert:options.insert||0})
    if(this.options.fromType == 'activity'){
      this.getAcitvityGoodsInfo().catch(e=>{
        this.setInvalid(e);
      })
    }else{
      this.getSpecCategoryInfo()
        .then(() => this.getGoodsProductList());
    }
    this.onShowed = true;
  }, 
  onShow(){
    if(this.options.fromType != 'activity'){
      this.onShowed && this.getSpecCategoryInfo();
    }
  },
  getAcitvityGoodsInfo(){
    let params = {
      goodsId:this.options.goodsId||0,
      activityId:this.options.activityId||0,
      insert:this.options.insert,
    } 
    return getAcitvityGoodsInfo(params).then(res=>{
      if(res.code==1){
          let data = res.data||{};
          let productList = data.productList||{}; 
          this.setData({productList});
          console.log('productList',productList)
      }
    })
  }, 
  onInput(e) {
    let {index, key} = this.getDataset(e);
    this.setData({
      [`productList[${index}].${key}`]: e.detail.value
    })
  },
  getSpecCategoryInfo() {
    this.showLoading();
    return getSpecCategoryInfo()
      .then(data => {
        this.setData({
          specInfoList: data
        })
        return data
      })
      .finally(() => {
        this.hideLoading();
      })
  },
  getGoodsProductList() {
    let goodsId = this.options.goodsId || 0;
    if (!goodsId) return Promise.resolve();
    this.showLoading();
    return getGoodsProductList({goodsId})
      .then(data => {
        let {productList = [], specList = []} = data;
        let selectedSpecInfoRef = {};
        specList.forEach(specCat => {
          let selectedSpecInfo = {};
          (specCat.specList || []).forEach(spec => {
            selectedSpecInfo[spec.specId] = spec.specName || "";
          })
          selectedSpecInfoRef[specCat.catId] = selectedSpecInfo;
        })
        this.setData({
          productList,
          selectedSpecInfoList: specList.map(specCat => ({ // 这里是因为接口返回的字段名不一样
            specCatId: specCat.catId,
            specCatName: specCat.catName,
            SpecInfoList: specCat.specList.map(spec => ({
              specCatId: specCat.catId,
              specId: spec.specId,
              specName: spec.specName
            }))
          })),
          selectedSpecInfoRef
        })
      })
      .finally(() => {
        this.hideLoading();
      })
  },
  onSelect(e) {
    let {specCatId, isSelected} = this.getDataset(e);
    let specInfoList = this.data.specInfoList || [];
    let selectedSpecInfoList = JSON.parse(JSON.stringify(this.data.selectedSpecInfoList || []));
    if (isSelected) { // 已经选择了，就去掉
      let selectedSpecIndex = selectedSpecInfoList.findIndex(item => item.specCatId === specCatId);
      let removeItem = selectedSpecInfoList.splice(selectedSpecIndex, 1)[0] || {};
      let selectedSpecInfoRef = this.data.selectedSpecInfoRef || {};
      delete selectedSpecInfoRef[removeItem.specCatId];
      this.setData({
        selectedSpecInfoRef,
        selectedSpecInfoList
      })
    } else { // 增加
      let selectedSpecIndex = specInfoList.findIndex(item => item.specCatId === specCatId);
      let selectedSpecInfo = specInfoList[selectedSpecIndex] || {};
      let selectedSpecInfoRef = {};
      selectedSpecInfo.SpecInfoList.forEach(item => {
        selectedSpecInfoRef[`${item.specId}`] = item.specName;
      })
      this.setData({
        [`selectedSpecInfoList[${selectedSpecInfoList.length}]`]: JSON.parse(JSON.stringify(selectedSpecInfo)),
        [`selectedSpecInfoRef.${selectedSpecInfo.specCatId}`]: selectedSpecInfoRef
      })
    }

    this.constructProductList();
  },
  deleteSpec(e) {
    let {specCatId, specId} = this.getDataset(e);
    let {selectedSpecInfoList = [], selectedSpecInfoRef = {}, productList = []} = this.data;
    productList = JSON.parse(JSON.stringify(productList));
    let specCatIndex = selectedSpecInfoList.findIndex(item => item.specCatId === specCatId);
    let specCatItem = selectedSpecInfoList[specCatIndex] || {};
    let specInfoList = JSON.parse(JSON.stringify(specCatItem.SpecInfoList || []));
    console.log("deleteSpec", {specCatId, specId})
    if (specInfoList.length === 1) {
      this.onSelect({currentTarget: {dataset: {specCatId, isSelected: true}}});
      return 
    }
    let specIndex = specInfoList.findIndex(item => item.specId === specId);
    for (let i = 0; i < productList.length; i++) {
      let product = productList[i];
      let specList = product.specList || [];
      // let specI = specList.findIndex(spec => (spec.specId === specId && spec.specCatId === specCatId));
      let specI = specList.findIndex(spec => (spec.specId === specId)); // specId具有唯一性
      if (specI >= 0) {
        productList.splice(i, 1);
        i--;
      }
    }
    specInfoList.splice(specIndex, 1);
    delete selectedSpecInfoRef[specCatId][specId];
    this.setData({
      [`selectedSpecInfoList[${specCatIndex}].SpecInfoList`]: specInfoList,
      selectedSpecInfoRef,
      productList
    })
  },

  constructProductList() {
    let selectedSpecInfoList = this.data.selectedSpecInfoList || [];
    let productList = constructProductListByCartesian(selectedSpecInfoList);
    this.setData({
      productList
    })
    console.log("productList", productList)
  },

  createOrUpdateGoodsProduct() {
    let productList = this.data.productList || [];
    let goodsId = this.options.goodsId || 0;
    this.showLoading()
    return createOrUpdateGoodsProduct({goodsId, productList})
      .then((res) => {
        if(res.code==1){
          let productList = this.data.productList||[]; 
          App.StorageH.set('curSetProductListInfo', {
            goodsId:this.options.goodsId||0, 
            productList
          }); 
          App.SMH.showToast({title:"保存成功"});
          let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            WxApi.navigateBack();
          }, 500)
        }
        return res;
      })
      .finally(() => {
        this.hideLoading();
      })
  }, 
  activityProductUpdateOrInsert(){
    let productList = this.data.productList||[];
    let params = {
        goodsId:this.options.goodsId||0,
        activityId:this.options.activityId||0,
        productList:productList.map(item=>({ //接口传参格式
          id:item.id||0,
          product_id:item.productId||item.product_id||0, 
          market_price:item.marketPrice||0,
          sale_price:item.salePrice||0,
          goods_number:item.goodsNumber||0,
          product_sn:item.productSn||"",
          specList:item.specList||[]
        })),
    }
    return activityProductUpdateOrInsert(params).then(res=>{
      if(res.code==1){
        App.StorageH.set('curSetProductListInfo', {
          goodsId:this.options.goodsId||0,
          activityId:this.options.activityId||0,
          productList
        });
        App.SMH.showToast({title:"保存成功"});
        setTimeout(() => {wx.navigateBack();}, 500)
      }
    });
  },
  save() {
    this._checkAllValid().then(()=>{
      if(this.options.fromType == 'activity'){
        this.activityProductUpdateOrInsert();
      }else{
        this.createOrUpdateGoodsProduct();
      }
    })
    // this.oriInputArr = this.selectAllComponents('.ori-label');
    // let arr = this.oriInputArr.map(item=>item.checkValid());
    // Promise.all(arr).then(()=>{
    //   if(this.options.fromType == 'activity'){
    //     this.activityProductUpdateOrInsert();
    //   }else{
    //     this.createOrUpdateGoodsProduct();
    //   }
    // });
  },
  setInvalid(e){
    this.setData({invalid:true});
    this._showModal({
      content:e&&e.msg||"数据异常",
      showCancel:false,
    }).then(()=>{
      wx.navigateBack();
    })
  },
  batchSet(){
    this.batchSetCpt = this.batchSetCpt || this.selectComponent('#batch-set');
    this.batchSetCpt.showModal();
  },
  onBatchConfirm(){ 
    let productList = this.data.productList || [];
    productList = productList.map(item => ({
      ...item,
      ...this.batchInputData
    }))
    this.setData({
      productList
    })
  },
  onBatchInput(e){
    let detail = e.detail||{};
    let {key,value}=detail;
    if(value || value == '0'){
      this.batchInputData[key] = value
    }else if(this.batchInputData[key]){
      delete this.batchInputData[key];
    }
  },
}))

function getSpecCategoryInfo() {
  return App.Http.QT_GoodsApi.getSpecCategoryInfo({
      params: {
        catId: 0
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data || []
      }
      return Promise.reject(res.msg || "获取规格信息失败")
    })
}

function getGoodsProductList(params) {
  return App.Http.QT_GoodsApi.getGoodsProductList({
    params
  })
  .then(res => {
    if (res.code == 1) {
      return res.data || {}
    }
    return Promise.reject(res.msg || "获取规格信息失败")
  })
}

function createOrUpdateGoodsProduct(data) {
  return App.Http.QT_GoodsApi.createOrUpdateGoodsProduct({
    data
  })
    .then(res => {
      if (res.code == 1) {
        App.SMH.showToast({title: "保存成功"});
        return res
      }
      return Promise.reject(res.msg || "保存规格失败")
    })
    .catch(err => {
      console.log("createOrUpdateGoodsProduct err", err);
      App.SMH.showToast({title: err});
      return Promise.reject(err)
    })
}

function constructProductListByCartesian(arr) {
  let productSpecList;
  if (arr.length === 0) return [];
  else if (arr.length === 1) {
    productSpecList = arr[0].SpecInfoList.map(item => [item]);
  } else {
    productSpecList = [].reduce.call(arr, function (col, set) {
      console.log("col", col, "set", set)
        let res = [];
        (col.SpecInfoList || col).forEach(c => {
            set.SpecInfoList.forEach(s => {
                let t = [].concat(Array.isArray(c) ? c : [c]);
                t.push(s);
                res.push(t);
            })
        });
        return res;
    });
  }
  console.log("productSpecList", productSpecList)
  return productSpecList.map(specList => ({
    marketPrice: '',
    productId: 0,
    productSn: '',
    specList: specList || []
  }))
}

function getAcitvityGoodsInfo(params){
    return App.Http.QT_GoodsApi.getAcitvityGoodsInfo({
        data: params,
    }).then(res=>{
      if(res.code!=1){ 
        return Promise.reject(res)
      }
      return res;
    })
}
function activityProductUpdateOrInsert(params){
    return App.Http.QT_GoodsApi.activityProductUpdateOrInsert({
        data: params,
    })
}