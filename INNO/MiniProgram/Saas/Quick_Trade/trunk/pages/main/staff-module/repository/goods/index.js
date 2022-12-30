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
      goodsImgs: []
    },
    isEdit: false,
  },
  onLoad(options) {
    this.options = options;
    let isEdit = options.isEdit == 1;
    //   goodsInfo = this.data.goodsInfo;
    // isEdit && (goodsInfo = JSON.parse(decodeURIComponent(options.goodsInfo || '{}')));
    this.setData({
        isEdit,
        options,
        //   goodsInfo
    })
    this.getAcitvityGoodsInfo();
    handleGoodsGallery.call(this) 
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
        console.log("imageList", imageList)
        // {domain_path, file_path}
        goodsImgs = goodsImgs.concat(imageList.map(item => (item.domain_path + item.file_path)));
        this.goodsRelativePathList = [...(this.goodsRelativePathList || []), ...imageList.map(item => item.file_path)]
        this.setData({
          'goodsInfo.goodsImgs': goodsImgs
        });
        console.log('goodsInfo', this.data.goodsInfo)
      })
      .catch(error => {
        console.log("error", error)
        if (error && error.errMsg && error.errMsg.indexOf("cancel") >= 0) return Promise.resolve()
        else App.SMH.showToast({
          title: error && error.errMsg || error
        });
      })
    // return WxApi.chooseMedia({
    //     count,
    //     mediaType:'image',
    // }).then(res=>{
    //     console.log('res',res)
    //     let tempFiles = res&&res.tempFiles||[];
    //     goodsImgs = goodsImgs.concat(tempFiles.map(item=>item.tempFilePath||''));
    //     this.setData({
    //         'goodsInfo.goodsImgs':goodsImgs
    //     });
    //     console.log('goodsInfo',this.data.goodsInfo)
    // })
  },
  save() {
    let goodsInfo = this.data.goodsInfo||{};
    if (this.options.fromType == 'activity' || this.options.fromType == 'activityAdd') {
      let cb = ()=>{
        App.StorageH.set('curSetGoodsInfo', {
            activity_id: this.options.activity_id || 0,
            goodsInfo
          });
          wx.navigateBack();
      }
      if(this.options.fromType=='activityAdd'){
        createOrUpdateGoods.call(this, goodsInfo)
        .then(goodsId => {
          goodsInfo.goods_id = goodsId||0;
          goodsInfo.isAdd = true;
          this.setData({goodsInfo})
          App.SMH.showToast({title: "保存成功"});
          cb();
        })
      }else{
        cb();
      }  
    } else {
      createOrUpdateGoods.call(this, goodsInfo)
        .then(data => {
          App.SMH.showToast({title: "保存成功"});
          WxApi.navigateBack()
        })
        .catch(err => {
          App.SMH.showToast({title: err})
        })
    }
  },
  delImg(e) {
    let index = this.getDataset(e, 'index');
    let goodsInfo = this.data.goodsInfo || {};
    goodsInfo.goodsImgs.splice(index, 1);
    this.setData({
      goodsInfo
    })
  },
  jumpSpec() {
    let goodsInfo = this.data.goodsInfo || {};
    let options = this.options || {};
    let url = `/pages/main/staff-module/repository/goods/spec/index?id=${goodsInfo.activity_product_id||""}&activityId=${options.activity_id||0}&fromType=${options.fromType||''}&market_price=${goodsInfo.market_price||0}&sale_price=${goodsInfo.sale_price||0}&goods_sn=${goodsInfo.goods_sn||''}&goods_number=${goodsInfo.goods_number||0}&goodsId=${goodsInfo.goods_id||0}`;
    console.log('goodsInfo',goodsInfo)
    this.jumpAction(url);
  },
  getAcitvityGoodsInfo(){ 
      if(!this.options.goodsId){return Promise.reject()};
      let params = {
        goodsId:this.options.goodsId||0,
        activityId:this.options.activity_id||0,
      }
      return getAcitvityGoodsInfo(params).then(res=>{
          if(res.code==1){
              let data = res.data||{};
              let goodsInfo = data.goodsInfo||{};
              goodsInfo.goods_id = this.options.goodsId||0;
              this.setData({goodsInfo});
          }
      })
  },
}))

function handleGoodsGallery() {
  let {
    galleryList = [], domainPath = ""
  } = App.StorageH.get("ReposityGoodsGallery") || {};
  console.log("domainPath", domainPath)
  let goodsImgs = galleryList.map(item => (domainPath + item.goods_img));
  this.goodsRelativePathList = galleryList.map(item => item.goods_img);
  this.setData({
    'goodsInfo.goodsImgs': goodsImgs,
  })
  App.StorageH.remove("ReposityGoodsGallery")
}

function createOrUpdateGoods({
  goods_id: goodsId = 0,
  goods_name: goodsName,
  goods_sn: goodsSn,
  market_price: marketPrice
}) {
  let goodsRelativePathList = this.goodsRelativePathList || [];
  return App.Http.QT_GoodsApi.createOrUpdateGoods({
      data: {
        goodsId,
        goodsName,
        goodsSn,
        marketPrice,
        galleryList: goodsRelativePathList.map((img, index) => ({
          goodsImg: img,
          sort: index
        }))
      }
    })
    .then(res => {
      if (res.code == 1) {
        return res.data
      }
      return Promise.reject(res.msg || `${goodsId ? '新建' : '编辑'}商品失败`)
    })
}

function getAcitvityGoodsInfo(params){
    return App.Http.QT_GoodsApi.getAcitvityGoodsInfo({
        data: params
    })
}