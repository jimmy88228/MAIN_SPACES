// pages/main/staff-module/repository/goods/index.js
import WxApi from "../../../../../common/utils/wxapi/index";
import {
  chooseImage,
  uploadImage
} from "./utils";
const App = getApp();
Page(App.BP({
  data: {
    goodsInfo: {
      goods_name:"",
      goods_img:"",
      min_price:0,
      max_price:0,
      min_market_price:0,
      max_market_price:0,
      productList:[],
      goodsImgs: [],
      goods_number:"",
      sale_price:"",
      market_price:"",
      
      specId:0,
      specCatId:0,
      specName:"",
      productSn:"",
    },
    specNav:[{key:'single',name:"单规格"},{key:'much',name:"多规格"}],
    curSpecType:"",
    mainColor:App.SH.pageStyleObj['main-color'],
    isEdit: false,
    catList: [], // 商品分类列表
    selectedCatIndex: 0, // 已选择的商品分类序号
    curCat:0, 
    hasSku:true,
    fromType:''
  },
  onLoad(options) {
    this.options = options;
    this.setView({ 
      catPopRef: { get: () => this.findView("#cat-pop") }, 
    })
    init.call(this);
  },
  onShow(){
    this.checkSet();
  },
  checkSet(){
    let curSetData = App.StorageH.get('curSetProductListInfo')||{};
    let CurGoodsDetail = App.StorageH.get('CurGoodsDetail')||{};
    let goodsInfo = this.data.goodsInfo||{};
    console.log('checkset',curSetData,CurGoodsDetail,goodsInfo)
    if(curSetData.goodsId == goodsInfo.goods_id) { //设置过sku数据
      this.setData({'goodsInfo.insert':curSetData.productList && curSetData.productList.length>0 ? 0:1});
      App.StorageH.remove('curSetProductListInfo');
    }
    this.getProductList().then(data=>{
      let {productList} = data;
      if(this.data.curSpecType == 'much' && productList && productList.length > 0){
        goodsInfo.productList = productList;
        goodsInfo.goods_number = 0;
        goodsInfo.min_price = 0;
        goodsInfo.max_price = 0;
        goodsInfo.min_market_price = 0;
        goodsInfo.max_market_price = 0;
        goodsInfo.productList.forEach(item=>{
          goodsInfo.min_price = !goodsInfo.min_price ? item.salePrice : Math.min(goodsInfo.min_price,item.salePrice) //秒杀价取最小
          goodsInfo.min_market_price = !goodsInfo.min_market_price ? item.marketPrice : Math.min(goodsInfo.min_market_price,item.marketPrice)//原价取最小
          goodsInfo.max_price = Math.max(goodsInfo.max_price,item.salePrice);
          goodsInfo.max_market_price = Math.max(goodsInfo.max_market_price,item.marketPrice);
          goodsInfo.goods_number = parseInt(item.goodsNumber) + parseInt(goodsInfo.goods_number); //取和
          
          goodsInfo.market_price = goodsInfo.min_market_price;
          goodsInfo.sale_price = goodsInfo.min_price;
        })
        this.setData({goodsInfo});
      }
    })
    if(CurGoodsDetail.goodsId == goodsInfo.goods_id && CurGoodsDetail.activityId == this.options.activity_id){
      goodsInfo.goods_detail = CurGoodsDetail.data||"";
      this.setData({'goodsInfo.goods_detail':goodsInfo.goods_detail});
    }
    App.StorageH.remove('CurGoodsDetail');
    // if(curSetData.goodsId == goodsInfo.goods_id && (!this.options.fromType||(curSetData.activityId == this.options.activity_id))){ //设置过sku数据
    //   if(curSetData.productList && curSetData.productList.length>0){
    //     goodsInfo.productList = curSetData.productList;
    //     goodsInfo.goods_number = 0;
    //     goodsInfo.min_price = 0;
    //     goodsInfo.max_price = 0;
    //     goodsInfo.min_market_price = 0;
    //     goodsInfo.max_market_price = 0;
    //     goodsInfo.productList.forEach(item=>{
    //       goodsInfo.min_price = !goodsInfo.min_price ? item.salePrice : Math.min(goodsInfo.min_price,item.salePrice) //秒杀价取最小
    //       goodsInfo.min_market_price = !goodsInfo.min_market_price ? item.marketPrice : Math.min(goodsInfo.min_market_price,item.marketPrice)//原价取最小
    //       goodsInfo.max_price = Math.max(goodsInfo.max_price,item.salePrice);
    //       goodsInfo.max_market_price = Math.max(goodsInfo.max_market_price,item.marketPrice);
    //       goodsInfo.goods_number = parseInt(item.goodsNumber) + parseInt(goodsInfo.goods_number); //取和
          
    //       goodsInfo.market_price = goodsInfo.min_market_price;
    //       goodsInfo.sale_price = goodsInfo.min_price;
    //     })
    //     this.setData({goodsInfo});
    //   } 
    //   App.StorageH.remove('curSetProductListInfo');
    // }
  },
  onInput(e) {
    let key = this.getDataset(e, 'key');
    let value = e.detail && e.detail.value;
    this.setData({
      [`goodsInfo.${key}`]: value
    })
  },
  onAddImg() {
    let goodsInfo = this.data.goodsInfo || {};
    let goodsImgs = goodsInfo.goodsImgs || [];
    let count = 9 - goodsImgs.length;
    return chooseImage(count)
      .then((images = []) => {
        let uploadPromiseList = images.map(({
          type,
          path,
          size
        }) => uploadImage({
          type,
          path,
          size
        }));
        return Promise.all(uploadPromiseList)
      })
      .then((imageList = []) => {
        goodsImgs = goodsImgs.concat(imageList.map(item => (item.domain_path + item.file_path)));
        this.goodsRelativePathList = [...(this.goodsRelativePathList || []), ...imageList.map(item => item.file_path)]
        this.setData({
          'goodsInfo.goodsImgs': goodsImgs,
        });
      })
      .catch(error => {
        console.log("error", error)
        if (error && error.errMsg && error.errMsg.indexOf("cancel") >= 0) return Promise.resolve()
        else App.SMH.showToast({
          title: error && error.errMsg || error
        });
      })
  },
  validate(tapType) {
    let validateError = "";
    let fromType = this.options.fromType;
    let goodsImg = this.goodsRelativePathList||[];
    let curSpecType = this.data.curSpecType;
    if(goodsImg.length<=0){
      validateError = "请上传商品图片";
      if(validateError){
        wx.MyAnims.error(this,'#add-pics')
      }
    }else if (tapType == 'save' && fromType === "goods"){
      let {productList=[]} = this.data.goodsInfo; 
      if(curSpecType == 'much' && productList.length<=0){
        validateError = "请先完善规格信息";
      }
      if(validateError){
        wx.MyAnims.offset(this,'#add-label')
      }
    }else if (fromType === "activity" || (tapType == 'save' && fromType === 'activityAdd')) {
      let {sale_price,min_price} = this.data.goodsInfo; 
      if((curSpecType == 'single' && !sale_price) || (curSpecType == 'much' && !min_price)){
        validateError = "请先完善规格信息";
      }
      if(validateError){
        wx.MyAnims.offset(this,'#add-label')
      }
    }
    return validateError;
  },
  save(tapType='save') {
    let goodsInfo = this.data.goodsInfo||{};
    let fromType = this.options.fromType;
    return this._checkAllValid().then(()=>{ //检测INPUT
      let validateError = this.validate(tapType); //检测上传图片和SKU数据
      if (validateError) {
        App.SMH.showToast({title: validateError});
        return Promise.reject(validateError);
      } 
      if (fromType == 'activity') {
        return Promise.resolve(goodsInfo);
      } else { // (商品库进入||活动新增商品)
        return createOrUpdateGoods.call(this, goodsInfo)
          .then(goodsId => { 
            this.options.goodsId = goodsId||0;
            goodsInfo.goods_id = goodsId||0;
            goodsInfo.isAdd = true;
            this.setData({goodsInfo})
            return goodsInfo
          })
      }
    })
  },
  handleSaveBtnTap(e) {
    this._setPageLoading('handleSaveBtnTap');
    let fromType = this.options.fromType;
    let type = this.getDataset(e,'type');
    return this.save() 
      .then(goodsInfo => { // 保存请求完成后操作
        if (fromType == 'activity' || fromType == 'activityAdd') {
          goodsInfo.goods_gallery = (this.goodsRelativePathList || []).map((img, index) => ({
            goods_img: img,
            goods_id:goodsInfo.goods_id,
            sort: index
          }))
          goodsInfo.insert = 0;
          App.StorageH.set('curSetGoodsInfo', {
              activity_id: this.options.activity_id || 0,
              goodsInfo
          }); 
        }
        return goodsInfo
      })
      .then((goodsInfo)=>{
        return this.productListSave(goodsInfo);
      })
      .then(() => {
        if(type == 'save'){
          let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.navigateBack();
          }, 600)
        }
        return true
      })
  },
  setProductList(goodsInfo){ 
    let {productList=[]} = this.data;
    return createOrUpdateSpec({id:goodsInfo.specId||0,specName:goodsInfo.specName,check:this.options.fromType == 'activity' ? 1:0}) //保存specName
    .then(res=>{
      if(res.code == 1){ 
        let data = res.data||{};
        let item = productList[0] || {};
        productList = [{
          ...item,
          id:item.id||0,
          marketPrice: goodsInfo.market_price||0,
          productId: item.productId||0,
          productKey: item.productKey || App.Utils.NormalUtils.uuid16ByTime(16),
          productSn: goodsInfo.productSn || "",
          specList:[{
            ...(item.specList && item.specList[0]||{}),
            productId:item.productId||0,
            specCatId: data.specCatId||0,
            specId: data.specId||0,
            specName: data.specName||"",
          }]
        }] 
        console.log('productList',productList)
        return productList;
      }
      return Promise.reject(res);
    }) 
  },
  productListSave(goodsInfo){
    if(this.data.curSpecType == 'single'){
      return this.setProductList(goodsInfo).then(productList=>{ 
        if (this.options.fromType == 'activity') {
          return this.activityProductUpdateOrInsert(productList);
        } else if(this.options.fromType == 'activityAdd'){ //活动新增:先走商品库逻辑再走活动商品逻辑
          return this.createOrUpdateGoodsProduct(productList).then(res=>{
            if(res.code == 1){
              let data = res.data||{},temp={};
              data.forEach(item=>{temp[item.productKey] = item;});
              productList = productList.map(item=>({...item,productId:temp[item.productKey].productId||0}))
            }
            return productList
          }).then(productList=>{
            return this.activityProductUpdateOrInsert(productList); 
          });
        } else {
          return this.createOrUpdateGoodsProduct(productList).then(res=>{ 
            if(res.code==1){
              App.SMH.showToast({title:"保存成功"});
            }
            return res;
          });
        } 
      })
    }else{
      return Promise.resolve(true)
    }
  },
  activityProductUpdateOrInsert(productList){
    let _productList = JSON.parse(JSON.stringify(productList));
    let params = {
      goodsId: this.data.goodsInfo.goods_id || 0,
      activityId: this.options.activity_id || 0,
      productList: _productList.map(item => ({ //接口传参格式
          id:item.id||0,
          product_id: item.productId || 0, 
          market_price: item.marketPrice || 0, 
          sale_price: this.data.goodsInfo.sale_price || 0,
          goods_number: this.data.goodsInfo.goods_number || 0,
          product_sn: item.productSn || "",
          specList: this.options.fromType == 'activityAdd' ? item.specList.map(c_item=>({...c_item,productId:item.productId})) : item.specList || [],
      })),
    }
    return activityProductUpdateOrInsert(params).then(res=>{
      if(res.code==1){
        App.SMH.showToast({title:"保存成功"});
      }
      return res;
    })
  },
  createOrUpdateGoodsProduct(productList){ 
    return createOrUpdateGoodsProduct({goodsId:this.data.goodsInfo.goods_id || 0,productList})
  },
  delImg(e) {
    let index = this.getDataset(e, 'index');
    let goodsInfo = this.data.goodsInfo || {};
    goodsInfo.goodsImgs.splice(index, 1); 
    this.goodsRelativePathList.splice(index, 1);
    this.setData({
      goodsInfo
    })
  }, 
  jumpSpec() {
    this._setPageLoading('jumpSpec');
    let options = this.options || {},goodsInfo=this.data.goodsInfo||{};
    (goodsInfo.goods_id ? Promise.resolve(goodsInfo) : this.save('jump'))
      .then(res => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          let url = `/pages/main/staff-module/repository/goods/spec/index?insert=${res.insert||0}&activityId=${options.activity_id||0}&fromType=${options.fromType||''}&goodsId=${res.goods_id||0}`;
          this.jumpAction(url);
        }, goodsInfo.goods_id ? 0 : 200)
      })
  },
  jumpDetailEdit() {
    this._setPageLoading('jumpDetailEdit');
    let options = this.options || {},goodsInfo=this.data.goodsInfo;
    (goodsInfo.goods_id ? Promise.resolve(this.data.goodsInfo) : this.handleSaveBtnTap())
      .then(res => {
        let goodsInfo = this.data.goodsInfo;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          App.StorageH.set('CurGoodsDetail',goodsInfo.goods_detail||"");
          WxApi.navigateTo({url: `/pages/main/staff-module/repository/goods/detail/index?goods_id=${goodsInfo.goods_id}&fromType=${this.options.fromType||''}&activity_id=${options.activity_id||0}`})
        }, goodsInfo.goods_id ? 0 : 200)
      })
  },
  pickerShow(){
    this.catPopRef.showModal()
      .then(curCat => {
        this.setData({curCat})
        return curCat
      })
      .then(() => { 
        this.refresh();
      })
      .catch(() => {
      })
  },
  refreshPickerList(){
    getGoodsCategoryInfo.call(this);
  },
  getProductList(){
    let apiFunc = null;
    if(this.options.fromType == 'activity' || this.options.fromType == 'activityAdd'){
      apiFunc = ()=>this.getAcitvityGoodsInfo();
    }else{
      apiFunc = ()=>this.getGoodsProductList();
    };
    this.showLoading();
    return apiFunc().then(data=>{
      let {productList,specList,identification} = data;
      let _setData={
        curSpecType:this.data.curSpecType || (!!identification ? "single":"much")
      };
      if(identification && productList.length>0){ //单规格
        let item = productList[0].specList && productList[0].specList[0] || {},goodsInfo = this.data.goodsInfo;
        let {specId=0,specName="",specCatId=0} = item , productSn = productList[0].productSn || "";
        goodsInfo.specCatId = specCatId;
        goodsInfo.specId = specId;
        goodsInfo.specName = specName; 
        goodsInfo.productSn = productSn; 
        _setData.goodsInfo = goodsInfo;
      }
      this.setData({productList,specList,..._setData});
      console.log('读取goodsinfo',this.data.goodsInfo)
      return data;
    }).finally(()=>{
      this.setData({curSpecType:this.data.curSpecType || "single"})
      this.hideLoading();
    });
  },
  getGoodsProductList() {
    let goodsId = this.options.goodsId || 0;
    if (!goodsId) return Promise.reject();
    return getGoodsProductList({goodsId})
  },
  getAcitvityGoodsInfo() {
    if(!this.options.goodsId)return Promise.reject(false)
    let params = {
        goodsId: this.options.goodsId || 0,
        activityId: this.options.activity_id || 0,
        insert: this.data.goodsInfo && this.data.goodsInfo.insert || 0,
    }
    return getAcitvityGoodsInfo(params).then(data => { 
        return data;
    }).catch((e)=>{ 
      this.setData({curSpecType:'much'})
      return Promise.reject(e)
    })
  },
  showMore(){
    this.setData({showMore:true})
  },
  radioSel(e){
    if(this.options.isEdit == 1){
      e.detail!=this.data.curSpecType && App.SMH.showToast({title:"无法修改规格类型"});
      return
    };
    this.setData({curSpecType:e.detail||""})
  }
}))

function getGoodsCategoryInfo() {
  return App.Http.QT_GoodsApi.getGoodsCategoryInfo({
    params: {
      pageIndex: 1,
      pageSize: 2000
    }
  })
    .then(res => {
      if (res.code == 1) {
        let list = res.data && res.data.goodsCategoryInfoResps||[];
        list = [{id:0,catName:"全部"},...list];
        let goodsInfo = this.data.goodsInfo||{};
        this.setData({catList: list},()=>{
          if(goodsInfo.cat_id){
            this.setData({curCat:list.findIndex(item=>item.id == goodsInfo.cat_id)})
          }
        });
        return list
      }
      return Promise.reject(res.msg || "获取分类列表失败")
    }) 
}

function init() {
  let options = this.options || {}; 
  let isEdit = options.isEdit == 1;
  WxApi.setNavigationBarTitle({
    title: `${isEdit?'编辑':'新增'}商品`
  })
  this.setData({
      isEdit,
      fromType:options.fromType||"", //activity,activityAdd,goods
  });
  if (options.isEdit == 1) {
    let goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo || '{}'));
    let {
      galleryList = [], domainPath = ""
    } = App.StorageH.get("ReposityGoodsGallery") || {};
    let goodsImgs = galleryList.map(item => (domainPath + item.goods_img));
    this.goodsRelativePathList = galleryList.map(item => item.goods_img);
    goodsInfo.goodsImgs = goodsImgs;
    this.setData({
      goodsInfo
    })
    console.log('goodsInfo',goodsInfo)
  }
  App.StorageH.remove("ReposityGoodsGallery");
  if(options.fromType!='activity'){
    getGoodsCategoryInfo.call(this);
  }
} 

function createOrUpdateGoods({
  goods_id: goodsId = 0,
  goods_name: goodsName,
  goods_sn: goodsSn,
  market_price: marketPrice,
  min_market_price:minMarketPrice
}) {
  let goodsRelativePathList = this.goodsRelativePathList || [];
  this.showLoading();
  let index = this.data.curCat||0;
  let params = {
    goodsId,
    goodsName,
    goodsSn,
    marketPrice,
    galleryList: goodsRelativePathList.map((img, index) => ({
      goodsImg: img,
      sort: index
    })),
    catId:this.data.catList[index] && this.data.catList[index].id||0,
  }
  this.data.curSpecType == 'much' && (params.marketPrice = minMarketPrice);
  return App.Http.QT_GoodsApi.createOrUpdateGoods({
      data : params
    })
    .then(res => {
      if (res.code == 1) {
        App.SMH.showToast({title: "保存成功"});
        return res.data
      }
      return Promise.reject(res)
    })
    .finally(() => {
      this.hideLoading();
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


function getAcitvityGoodsInfo(params) {
  return App.Http.QT_GoodsApi.getAcitvityGoodsInfo({
      data: params,
      other:{
        hideError:true
      }
  }).then(res => {
      if (res.code != 1) {
          return Promise.reject(res)
      }
      return res.data;
  })
}
function createOrUpdateSpec(params) {
  return App.Http.QT_GoodsApi.createOrUpdateSpec({
      data: params, 
  })
}
function createOrUpdateGoodsProduct(params) {
  return App.Http.QT_GoodsApi.createOrUpdateGoodsProduct({
      data: params, 
  })
}
function activityProductUpdateOrInsert(params) {
  return App.Http.QT_GoodsApi.activityProductUpdateOrInsert({
      data: params, 
  })
}