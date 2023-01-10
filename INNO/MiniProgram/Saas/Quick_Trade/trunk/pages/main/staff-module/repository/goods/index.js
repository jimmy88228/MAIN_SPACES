// pages/main/staff-module/repository/goods/index.js
import WxApi from "../../../../../common/utils/wxapi/index";
import {
  chooseImage,
  uploadImage
} from "./utils";
const App = getApp();
const ERR_KEY_FRAMES = [  
  { translateX: 0  },
  { translateX: -4 },
  { translateX: 3  },
  { translateX: -4 },
  { translateX: 3  }, 
  { translateX: -3 },
  { translateX: 3  }, 
  { translateX: 0  },
]
Page(App.BP({
  data: {
    goodsInfo: {
      goodsImgs: []
    },
    isEdit: false,
    catList: [], // 商品分类列表
    selectedCatIndex: 0, // 已选择的商品分类序号
    curCat:0, 
    hasSku:true,
  },
  onLoad(options) {
    this.options = options;
    let isEdit = options.isEdit == 1;
    WxApi.setNavigationBarTitle({
      title: `${isEdit?'编辑':'新增'}商品`
    })
    this.setData({
        isEdit,
        options,
    });
    init.call(this);
  },
  onShow(){
    this.checkSet();
  },
  checkSet(){
    let curSetData = App.StorageH.get('curSetProductListInfo')||{};
    let CurGoodsDetail = App.StorageH.get('CurGoodsDetail')||{};
    let goodsInfo = this.data.goodsInfo||{};
    console.log('checkSet',curSetData)
    if(curSetData.goodsId == goodsInfo.goods_id && (!this.options.fromType||(curSetData.activityId == this.options.activity_id))){ //设置过sku数据
      if(curSetData.productList && curSetData.productList.length>0){
        goodsInfo.productList = curSetData.productList;
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
      App.StorageH.remove('curSetProductListInfo');
    }
    if(CurGoodsDetail.goodsId == goodsInfo.goods_id && CurGoodsDetail.activityId == this.options.activity_id){
      goodsInfo.goods_detail = CurGoodsDetail.data||"";
      this.setData({'goodsInfo.goods_detail':goodsInfo.goods_detail});
    }
    App.StorageH.remove('CurGoodsDetail');
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
  validate() {
    let validateError = "";
    let fromType = this.options.fromType;
    let goodsImg = this.goodsRelativePathList||[];
    console.log('save',this.data.goodsInfo)
    if(goodsImg.length<=0){
      validateError = "请上传商品图片";
    }else if (fromType === "activity") {
      let {sale_price} = this.data.goodsInfo;
      if(!sale_price){
        validateError = "请先设置sku规格";
      }
      if(validateError){
        this.animate('#add-label',ERR_KEY_FRAMES,250,() => {
          this.clearAnimation('#add-label', { translate: true, rotate: true }); 
        })
      }
    }
    return validateError;
  },
  handleSaveBtnTap() {
    let fromType = this.options.fromType;
    let isEdit = this.data.isEdit;
    this.save()
      .then(goodsInfo => { // 保存请求完成后操作
        if (fromType == 'activity' || fromType == 'activityAdd') {
          goodsInfo.goods_gallery = (this.goodsRelativePathList || []).map((img, index) => ({
            goods_img: img,
            goods_id:goodsInfo.goods_id,
            sort: index
          }))
          App.StorageH.set('curSetGoodsInfo', {
              activity_id: this.options.activity_id || 0,
              goodsInfo
          });
        }
        return goodsInfo
      })
      .then(() => { // 判断是否要返回上一页
        if (fromType == 'activity' || !isEdit) {
          let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            wx.navigateBack();
          }, 500)
        }
      })
  },
  save() {
    let goodsInfo = this.data.goodsInfo||{};
    let fromType = this.options.fromType;
    let validateError = this.validate();
    if (validateError) {
      App.SMH.showToast({title: validateError});
      return Promise.reject(validateError);
    }
    return this._checkAllValid().then(()=>{
      if (fromType == 'activity' || fromType == 'activityAdd') {
        if(fromType=='activityAdd'){ // 活动管理进入增加商品
          return createOrUpdateGoods.call(this, goodsInfo)
            .then(goodsId => {
              goodsInfo.goods_id = goodsId||0;
              goodsInfo.isAdd = true;
              this.setData({goodsInfo})
              App.SMH.showToast({title: "保存成功"});
              return goodsInfo
            })
        }else{ // 活动管理进入
          return Promise.resolve(goodsInfo);
        }  
      } else { // (商品库进入)
        return createOrUpdateGoods.call(this, goodsInfo)
          .then(goodsId => {
            goodsInfo.goods_id = goodsId;
            return goodsInfo
          })
          .catch(err => {
            App.SMH.showToast({title: err});
            return Promise.reject(err);
          })
      }
    })
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
    const isEdit = this.data.isEdit;
    let options = this.options || {};
    (isEdit ? Promise.resolve(this.data.goodsInfo) : this.save())
      .then(goodsInfo => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          let insert = goodsInfo.insert == 0 || (goodsInfo.insert == 1 && (goodsInfo.productList && goodsInfo.productList.length>0)) ? 0 : 1; //0编辑 1新增
          let url = `/pages/main/staff-module/repository/goods/spec/index?insert=${insert}&activityId=${options.activity_id||0}&fromType=${options.fromType||''}&goodsId=${goodsInfo.goods_id||0}`;
          this.jumpAction(url);
        }, isEdit ? 0 : 500)
      })
  },
  jumpDetailEdit() {
    const isEdit = this.data.isEdit;
    (isEdit ? Promise.resolve(this.data.goodsInfo) : this.save())
      .then(goodsInfo => {
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          App.StorageH.set('CurGoodsDetail',goodsInfo.goods_detail||"");
          WxApi.navigateTo({url: `/pages/main/staff-module/repository/goods/detail/index?goods_id=${goodsInfo.goods_id}&fromType=${this.options.fromType||''}&activity_id=${this.options.activity_id||0}`})
        }, isEdit ? 0 : 500)
      })
  },
  pickerShow(){
    this.catPop = this.catPop || this.selectComponent('#cat-pop');
    this.catPop.showModal()
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
  checkProductInfo(){
    if(this.options.fromType != 'activity'){
      return Promise.resolve();
    }
    let params = {
      goodsId:this.data.goodsInfo.goods_id||0,
      activityId:this.options.activity_id||0,
      insert:this.data.goodsInfo.insert,
    }
    return checkProductInfo(params).then(res=>{
      if(res.code == 1){
        this.setData({hasSku:res.data==1});
      }
      return res;
    })
  },
  refreshPickerList(){
    getGoodsCategoryInfo.call(this);
  },
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
  console.log('init',options)
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

  this.checkProductInfo();
  getGoodsCategoryInfo.call(this);
} 

function createOrUpdateGoods({
  goods_id: goodsId = 0,
  goods_name: goodsName,
  goods_sn: goodsSn,
  market_price: marketPrice
}) {
  let goodsRelativePathList = this.goodsRelativePathList || [];
  this.showLoading();
  let index = this.data.curCat||0;
  return App.Http.QT_GoodsApi.createOrUpdateGoods({
      data: {
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
    })
    .then(res => {
      if (res.code == 1) {
        App.SMH.showToast({title: "保存成功"});
        return res.data
      }
      return Promise.reject(res.msg || `${goodsId ? '新建' : '编辑'}商品失败`)
    })
    .finally(() => {
      this.hideLoading();
    })
}

function checkProductInfo(params) { 
  return App.Http.QT_GoodsApi.checkProductInfo({
    params
  }) 
}