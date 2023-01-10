// pages/main/staff-module/repository/goods/detail/index.js
import WxApi from "../../../../../../common/utils/wxapi/index";
import { uploadImage, chooseImage } from "./utils";

const App = getApp();
Page(App.BP({
  data: {
    htmlStr: "",
    showFooter: true,
  },
  onLoad(query) { // goods_id
    this.pageQuery = query;
    let {goods_id = 0,fromType=""} = query;
    if(fromType == 'activity'){
      let curGoodsDetail = App.StorageH.get('CurGoodsDetail')||"";
      initialEditorData.call(this, curGoodsDetail);
    }else if (goods_id) {
      getGoodsDetails.call(this)
        .then(htmlStr => initialEditorData.call(this, htmlStr))
        .catch(err => {
          console.log("getGoodsDetails err", err);
         App.SMH.showToast({title: err});
        })
    }
  },
  onInput(e) {
    let value = e.detail.value || "";
    this.setData({inputVal: value})
  },
  onFocus() {
    if (!this.data.showFooter) {
      this.setData({showFooter: true})
    }
  },
  onBlur() {
    if (this.data.showFooter) {
      this.setData({showFooter: false})
    }
  },
  getEditorContent() {
    this.customEditor = this.customEditor || this.selectComponent("#custom-editor");
    return this.customEditor.getContents()
  },
  insertImage() {
    chooseImage(9)
    .then((images = []) => {
      let uploadPromiseList = images.map(({type, path, size}) => uploadImage({
        type, path, size
      }));
      return Promise.all(uploadPromiseList)
    })
    .then(imageList => {
      imageList = imageList.map(item => (item.domain_path + item.file_path));
      this.customEditor = this.customEditor || this.selectComponent("#custom-editor");
      this.customEditor.insertImageNode(imageList);
    })
    .catch(error => {
      console.log("error", error)
      if (error && error.errMsg && error.errMsg.indexOf("cancel") >= 0) return Promise.resolve()
      else App.SMH.showToast({title: error && error.errMsg || error});
    })
  },
  handlePreviewBtnTap() {
    this.getEditorContent()
      .then(({html: htmlStr}) => {
        console.log("this", this);
        this.previewPop = this.previewPop || this.selectComponent("#preview-pop");
        this.previewPop.showModal({htmlStr})
        console.log("htmlstr", htmlStr)
      })
  },
  handleSaveBtnTap() {
    this.getEditorContent()
      .then(({html: htmlStr}) => {
        if(this.options.fromType == 'activity'){
          return this.activityDetailSave(htmlStr);
        }else{
          return this.updateGoodsDetails(htmlStr); 
        }
      })
  },
  updateGoodsDetails(htmlStr){
    this.showLoading();
    return App.Http.QT_GoodsApi.updateGoodsDetails({
      data: {
        goods_id: this.options.goods_id,
        goods_detail: encodeURIComponent(htmlStr)
      }
    })
      .then(res => {
        if (res.code == 1) {
          App.SMH.showToast({title: "保存成功"});
          setTimeout(() => {WxApi.navigateBack()}, 500);
          return 
        }
        return Promise.reject(res.msg || "保存失败")
      })
      .catch(err => {
        console.log("handleSaveBtnTap err", err);
        App.SMH.showToast({title: err});
        return Promise.reject(err)
      })
      .finally(() => {this.hideLoading()})
  },
  activityDetailSave(htmlStr){
    App.StorageH.set('CurGoodsDetail',{activityId:this.pageQuery.activity_id||0,goodsId:this.pageQuery.goods_id||0,data:htmlStr});
    App.SMH.showToast({title: "保存成功"});
    setTimeout(() => {WxApi.navigateBack()}, 500);
  },
}))

function getGoodsDetails() {
  let goodsId = this.pageQuery && this.pageQuery.goods_id || 0;
  if (!goodsId) return Promise.reject("getGoodsDetails 没有goods_id");
  this.showLoading();
  return App.Http.QT_GoodsApi.getGoodsDetails({
    params: {
      goodsId
    }
  })
    .then(res => {
      if (res.code == 1) {
        let htmlStr = res.data || "";
        this.setData({htmlStr})
        return htmlStr
      }
      return Promise.reject(res.msg || "获取商品详情失败")
    })
    .finally(() => {this.hideLoading()})
}

function initialEditorData(html) {
  this.customEditor = this.customEditor || this.selectComponent("#custom-editor");
  console.log('setContents',html)
  return this.customEditor.setContents({html})
}