// pages/micro_mall/video_shopping/v_page/index.js
import {
  TabKeys,
} from "../../../../common/manager/log-map.js";
import CheckVideo from "../../../../common/manager/check-video-update.js";
import DrawTemplate from '../../goods/popup/help/template.js';
const PAGE_TYPE = "VIDEO_SHOP";
const app = getApp();
Page(app.BP({
  data: {
    showPause: false,
    cur_v: 0,
    initLoadingAnim: true,
    guideData: {},
    hasMore: true,
    typeData: {
      type: 'share'
    }
  },
  select_goods: { //选择的商品
    select_color: "", //选择颜色对象
    select_size: "", //选择尺码对象
    select_color_id: 0, //选择颜色id
    select_size_id: 0, //选择尺码id
    select_goods_count: 1, //选择商品数量
    product_info: {}
  },
  allProInfo: {},
  goods_obj: {},
  cur_v: 0,
  v_arr: [],
  page: 1,
  isLoading: false,
  hasMore: true,
  onLoad: function (options) {
    this.options = options;
    let v_home = this.data.brand_info.icon_url + "micro_mall/video_shop/v_home.png";
    let v_like = this.data.brand_info.icon_url + "micro_mall/video_shop/v_like.png";
    let v_no_like = this.data.brand_info.icon_url + "micro_mall/video_shop/v_no_like.png";
    let v_share = this.data.brand_info.icon_url + "micro_mall/video_shop/v_share.png";
    let v_pause = this.data.brand_info.icon_url + "micro_mall/video_shop/v_pause.png";
    let v_empty = this.data.brand_info.default_icon_url + "v_empty.png";
    this.setData({
      v_home,
      v_like,
      v_no_like,
      v_share,
      v_pause,
      v_empty
    })
    // checkGuide.call(this);
    CheckVideo.setStatus(0);
    assembleOptions.call(this);
    // initData.call(this);
  },
  onReady: function () {

  },
  onShow: function () {
    listen.call(this);
  },
  onHide: function () {
    unListen.call(this);
  },
  onUnload: function () {
    let v_arr = this.v_arr || [];
    let index = this.cur_v || 0;
    if (!v_arr[index]) return
    let id = v_arr[index].id;
    let type = 'onFinish';
    calculateTime.call(this, { id, index, type })
    unListen.call(this);
  },
  onShareAppMessage: function () {
    let arr = this.v_arr || [];
    let cur = this.cur_v || 0;
    let title = arr[cur] && arr[cur].shareTitle || arr[cur] && arr[cur].title || ""
    let id = arr[cur] && arr[cur].id || 0;
    onShare.call(this, id);
    return {
      shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
      isCustom: true,
      imageUrl: arr[cur] && arr[cur].sharePicture || '',
      title: title,
      path: `pages/micro_mall/video_shopping/v_page/index?id=${id}`,
      // shareType: app.ShareType.VIDEO_SHOP || app.ShareType.NORMAL
    }
  },
  onChange(e) {
    if (this.data.showGuide) {
      this.showGuide = false;
      this.setData({
        showGuide: false
      })
    }
    // showloadFnc.call(this);
  },
  onFinish(e) {
    // console.log('onStaus onFinish',e)
    let detail = e.detail || {};
    let v_arr = this.v_arr || [];
    let index = detail.cur_last || 0;
    let id = v_arr[index] && v_arr[index].id || 0;
    let type = 'onFinish';
    let len = v_arr.length || 0;
    let cur_v = detail.cur_v || 0;
    this.cur_v = cur_v;
    this.setData({
      cur_v
    });
    if (!(v_arr[cur_v] && v_arr[cur_v].t_check)) {
      checkRoll.call(this, cur_v)
    }
    calculateTime.call(this, { id, index, type })
    addActionLog.call(this, 'VIDEO_SHOPPING_SHOW', {});
    goodsLoadData.call(this, cur_v);
    if ((cur_v + 1) >= len) {
      initData.call(this, false);
    }
  },
  popupShow(e) {
    // console.log('popupShow',e);
    let detail = e.detail || {};
    let cur_g = detail.cur_g || 0;
    let cur_v = this.cur_v || 0;
    // let data = this.data.tempGoods[cur_v] && this.data.tempGoods[cur_v][cur_g]  || {};
    let data = this.goods_obj[cur_v] && this.goods_obj[cur_v][cur_g] || {};
    this.tempGoodsData = data;
    let goodsId = data.goodsId;
    this.addCart = true;
    getSku.call(this, data).then(res => {
      addActionLog.call(this, 'VIDEO_GOODS_CLICK', { goodsId });
      this.popup = this.popup || this.selectComponent('#popup');
      this.popup.show();
    });
    // this.popup = this.popup || this.selectComponent('#popup');
    // this.popup.loadData(data);
    // this.popup.show();
  },
  doubleTap(e, type = '') {
    let x = 0;
    let y = 0;
    if (type == 'percent') {
      x = '50%';
      y = '65%';
    } else {
      let detail = e.detail || {};
      x = detail.x + 'px' || 0;
      y = detail.y + 'px' || 0;
    }
    this.like = this.like || this.selectComponent("#like");
    this.like.showAnim({ x, y });
    if (!type && this.data.isLogin) {
      setLike.call(this);
    }
  },
  singleTap(e, type = '') {
    // console.log('singleTap',e);
    let bool = !this.data.showPause;
    this.setData({
      showPause: bool
    })
  },
  pauseTap(e) {
    // this.singleTap(e,'setFalse');
    this.v_video = this.v_video || this.selectComponent("#v_video");
    this.v_video.tap_v(e);
  },
  onTap(e) {
    let dataset = e.currentTarget.dataset || {};
    let type = dataset.type || '';
    if (type == 'home') {
      wx.switchTab({
        url: '/pages/micro_mall/index/index',
      })
      console.log('123456', "跳首页")
    } else if (type == 'onLike') {
      setLike.call(this, 'single');
    }
    if (e && e.type == 'clickcallback') {
      let detail = e && e.detail || {};
      let type = detail.type || '';
      if (type == 'share') {
        this.shareModule = this.shareModule || this.selectComponent("#shareModule");
        this.shareModule.checkIfStaffDstb();
      }
    }
  },
  loginBack(e) {
    console.log(e, 'loginBack')
    setLike.call(this, 'single');
  },
  checkIfStaffDstbCallBack(data) {
    let detail = data.detail;
    this.staffInfo = detail.staffInfo
  },
  chooseShareType(data) {
    let detail = data.detail;
    let arr = this.v_arr || [];
    let cur = this.cur_v || 0;
    let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL; ;
    let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL; ;
    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    let staffCode = detail.shareId == 3 ? detail.staffInfo.staffCode : "";
    initTemplate.call(this, staffCode);
    let allData = {
      info: {
        opKind: opKind,
        imgUrl: arr[cur] && arr[cur].posterPicture || '',
      },
      scene: {
        "id": arr[cur] && arr[cur].id || 0,
        "shareType": shareType,
        "staffCode": detail.shareId == 3 ? detail.staffInfo.staffCode : ""
      },
      draw: {
        diy: true,
        drawArr: this.drawArr || [],
        baseInfo: {
          codeDiy: true,
          canvasW: 600,
          canvasH: 950
        }
      }
    }
    this.staffInfo = detail.staffInfo
    this.setData({
      allData: allData
    })
    this.shareImg.show();
  },
  colorSelect(e) {
    let detail = e.detail;
    // console.log('颜色选择', detail);
    setSelectInfo.call(this, 'color', detail.color_id);
    setProductInfo.call(this);
  },
  sizeSelect(e) {
    let detail = e.detail;
    // console.log('尺码选择', detail);
    setSelectInfo.call(this, 'size', detail.size_id);
    setProductInfo.call(this);
  },
  numTap(e) {
    let detail = e.detail;
    let num = detail.num || 0;
    let select_goods = this.select_goods || {};
    select_goods.select_goods_count = num;
  },
  skuConfirm(e) {
    // console.log('skuConfirm',e);
    let detail = e.detail || {};
    let type = detail.type;
    let goodsId = detail.goodsId;
    checkSkuSelect.call(this).then(res => {
      // if(type==0){
      //   addActionLog.call(this,'VIDEO_GOODS_ADDCART',{goodsId})
      // }
      buy.call(this, type);
    }).catch(e => {
      this.popup = this.popup || this.selectComponent('#popup');
      this.popup.setThrottle(false);
    })
  },
  cartJump(e) {
    let detail = e.detail || {};
    let goodsId = detail.goodsId || 0;
    let type = detail.type || 0;
    let v_arr = this.v_arr || [];
    let cur_v = this.cur_v || 0;
    let ac_id = v_arr[cur_v] && v_arr[cur_v].id || 0;
    let url = '';
    addActionLog.call(this, 'VIDEO_GOODS_GO_DETAIL', { goodsId })
    if (type == "detail") {
      url = `/pages/micro_mall/goods/goods_info?goods_id=${goodsId}&issued=${ac_id}&fromType=videoShop`
    } else if (type == 'cart') {
      url = `/pages/micro_mall/special_shopping/shopping_cart`
    }
    if (!url) return
    wx.navigateTo({
      url: url,
    })
  },
  onPause(e) {
    let detail = e.detail || {};
    let id = detail.id || 0;
    let index = detail.index || 0;
    let type = 'onPause';
    // console.log('onStaus onPause',index,id);
    calculateTime.call(this, { id, index, type })
  },
  onPlay(e) {
    let detail = e.detail || {};
    let id = detail.id || 0;
    let index = detail.index || 0;
    let type = 'onPlay';
    if (!this.firstPlay) {
      this.firstPlay = true;
      addActionLog.call(this, 'VIDEO_SHOPPING_SHOW', {});
    }
    checkShowInfo.call(this);
    this.setData({
      showPause: false
    })
    calculateTime.call(this, { id, index, type })
  },
  handleEnd(e) {
    if (this.data.showGuide && !this.checkMove) {
      this.checkMove = true;
      this.showGuide = false;
      this.setData({
        showGuide: false
      })
    }
  },
}))

function init() {
  this.select_goods = { //选择的商品
    select_color: "", //选择颜色对象
    select_size: "", //选择尺码对象
    select_color_id: 0, //选择颜色id
    select_size_id: 0, //选择尺码id
    select_goods_count: 1, //选择商品数量
    product_info: {}
  },
    this.allProInfo = {};
}

function initData(init = true, reset = false) {
  let cur_v = this.cur_v || 0;
  videoLoadData.call(this, cur_v).then(res => {
    if (init) {
      goodsLoadData.call(this, cur_v);
    }
  })
}

function videoLoadData(cur_v = 0) {
  if (!this.hasMore || this.isLoading) {
    return Promise.reject();
  }
  this.isLoading = true;
  let params = {
    pageIndex: this.page,
    pageSize: app.Conf.PAGE_SIZE
  };
  return app.RunApi.go('VideoShopApi', 'getVideoShoppingList', params, { isShowLoad: false }).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let list = data.list || [];
      let shareId = this.options.id || 0;
      if (list && list.length <= 0 && (this.page == 1)) {
        setEmpty.call(this);
        return Promise.reject(res);
      }
      return checkShare.call(this, shareId).then(shareData => {
        if (shareData) {
          this.shareData = shareData;
          list.unshift(shareData);
        }
        let total = data.totalCount || 0;
        this.v_arr = this.v_arr || [];
        this.hasMore = total > this.page * app.Conf.PAGE_SIZE;
        this.page += 1;
        let deleteNum = -1;
        let len = this.v_arr.length || 0;
        list.forEach((item, index) => {
          item.startTime = 0,
            item.durationTime = 0,
            item.isPlaying = false
          if (shareId && (item.id == this.options.id)) {
            deleteNum = index;
          }
        })
        if (deleteNum != -1 && !(deleteNum == 0 && this.page == 2)) {
          list.splice(deleteNum, 1);
        }
        this.v_arr = this.v_arr.concat(list);
        this.setData({
          v_arr: this.v_arr,
          showPage: true,
          hasMore: this.hasMore
        })
        this.v_video = this.v_video || this.selectComponent("#v_video");
        this.v_video.loadData(list);
        if (cur_v == 0) {
          checkRoll.call(this, cur_v);
        }
        return Promise.resolve(res);
      })
    }
    return Promise.reject(res);
  }).finally(() => {
    this.isLoading = false;
  })
}

function goodsLoadData(cur_v = 0) {
  cur_v = cur_v || 0;
  if (this.goods_obj[cur_v || 0]) {
    let len = this.goods_obj[cur_v].length;
    this.setData({
      goods_list_len: len
    })
    this.goods_list = this.goods_list || this.selectComponent("#goods_list");
    this.goods_list.loadData(this.goods_obj[cur_v] || []);
    return
  }
  let v_arr = this.v_arr || [];
  let params = {
    activeId: v_arr[cur_v] && v_arr[cur_v].id || 0,
    brandCode: app.Conf.BRAND_CODE
  };
  return app.RunApi.go('VideoShopApi', 'getVideoShoppingGoodsList', params, { diy: true, isShowLoad: false }).then(res => {
    if (res.code == '1') {
      this.goods_obj = this.goods_obj || {};
      this.goods_obj[cur_v] = res.data || [];
      let len = this.goods_obj[cur_v].length;
      this.setData({
        goods_list_len: len
      })
      this.goods_list = this.goods_list || this.selectComponent("#goods_list");
      this.goods_list.loadData(this.goods_obj[cur_v]);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
  // this.goods_list = this.goods_list || this.selectComponent("#goods_list");
  // this.goods_list.loadData(this.data.tempGoods[cur_v]); 
}

function getSku(data = {}) {
  let goods_info = data || {};
  let params = {
    goodsId: goods_info.goodsId || 0,
    activeId: goods_info.activieId || 0,
    issueId: 0,
    colorId: 0,
  };
  let extra = { isShowLoad: false };
  return app.RunApi.go('VideoShopApi', 'getVideoShoppingProductInfo', params, extra).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      let goodsExtend = data.goodsExtend || {};
      let GoodsDetail = data.GoodsDetail || {}; //区间
      let productList = data.ListGoodsProductInfo || [];
      let goodsGallery = data.goodsGallery || [];
      goodsGallery = createObjKeyVal.call(this, goodsGallery, 'color_id', 'initImg') || {};
      let select_goods = this.select_goods || {};
      if (this.last_goods_id != goods_info.goodsId) {
        init.call(this);
        select_goods = this.select_goods || {};
        for (let item in goodsGallery) {
          select_goods.select_color_id = item;
          select_goods.select_color = goodsGallery[item][0] && goodsGallery[item][0].color_name || '';
          break
        }
      } else {
        select_goods.select_goods_count = 1
      }
      this.last_goods_id = goods_info.goodsId;
      if (!select_goods.product_info.product_id) {
        select_goods.product_info = GoodsDetail;
      }
      let skuObj = {};
      let colorArr = [];
      let sizeArr = [];
      let tempSize = {};
      let firstSku = "";
      let firstName = "";
      let exsist = false;
      productList.forEach((item, index) => {
        if (!firstSku) {
          firstSku = item.color_id;
          firstName = item.color_name;
        }
        if (!exsist) {
          exsist = item.color_id == select_goods.select_color_id
        }
        if (!skuObj[item.color_id]) {
          skuObj[item.color_id] = {};
          colorArr.push({ color_id: item.color_id, color_name: item.color_name });
          if (goodsExtend.attr_count == 1) {
            skuObj[item.color_id] = { ...item };
          } else {
            skuObj[item.color_id].color_id = item.color_id;
            skuObj[item.color_id].color_name = item.color_name;
            skuObj[item.color_id].min_market_price = item.market_price;
            skuObj[item.color_id].max_market_price = item.market_price;
            skuObj[item.color_id].min_sale_price = item.sale_price;
            skuObj[item.color_id].max_sale_price = item.sale_price;
          }
        }
        if (!tempSize[item.size_id]) {
          tempSize[item.size_id] = {};
          tempSize[item.size_id].size_id = item.size_id || '';
          tempSize[item.size_id].size_name = item.size_name || '';
          sizeArr.push(tempSize[item.size_id]);
        }
        if (goodsExtend.attr_count == 2) {
          skuObj[item.color_id].sizeList = skuObj[item.color_id].sizeList || {};
          skuObj[item.color_id].sizeList[item.size_id] = item;
          if (item.market_price < skuObj[item.color_id].min_market_price) {
            skuObj[item.color_id].min_market_price = item.market_price;
          } else if (item.market_price > skuObj[item.color_id].max_market_price) {
            skuObj[item.color_id].max_market_price = item.market_price;
          }
          if (item.sale_price < skuObj[item.color_id].min_sale_price) {
            skuObj[item.color_id].min_sale_price = item.sale_price;
          } else if (item.sale_price > skuObj[item.color_id].max_sale_price) {
            skuObj[item.color_id].max_sale_price = item.sale_price;
          }
        }
      });
      if (!exsist) {
        select_goods.select_color_id = firstSku;
        select_goods.select_color = firstName;
      }
      this.allProInfo = {
        extend: goodsExtend,
        total_info: GoodsDetail,
        selected: select_goods,
        sku: skuObj,
        gallery: goodsGallery,
        goods_info,
        sizeArr,
        colorArr,
      };
      if (goodsExtend.attr_count == 1 && !select_goods.product_info.product_id) { //单规格初始化 赋值productInfo
        this.colorSelect({ detail: { 'color_id': select_goods.select_color_id } });
      }
      let allProInfo = JSON.parse(JSON.stringify(this.allProInfo));
      this.popup = this.popup || this.selectComponent('#popup');
      this.popup.loadData(allProInfo);
      return Promise.resolve(res);
    }
    return Promise.reject();
  })
}


function setSelectInfo(type = '', data = 0) {
  let select_goods = this.select_goods || {};
  let sku = this.allProInfo.sku || {};
  let tempColor = type == 'color' ? data : select_goods.select_color_id
  if (!sku[tempColor]) return
  if (type == 'color') {
    // let goodsExtend = this.allProInfo.extend || {};
    select_goods.select_color_id = data;
    select_goods.select_color = sku[data].color_name || '';
    let size_id = select_goods.select_size_id;
    this.setData({
      swiper_current: 0
    })
    if (size_id && sku[data].sizeList) {
      if ((!sku[data].sizeList[size_id])) { //点颜色时 已选中的尺寸不存在于点击的颜色 清除操作
        // console.log('清除尺码 ', sku[data].sizeList[size_id]);
        select_goods.select_size_id = 0;
        select_goods.select_size = '';
        select_goods.product_info = this.allProInfo.total_info || {};
        // (!this.popup) && (this.popup = this.selectComponent('#popup'));
        // this.popup.resetSku('size');
      }
    }
  } else if (type == 'size') {
    let color_id = select_goods.select_color_id;
    let size_id = data;
    select_goods.select_size_id = data;
    select_goods.select_size = color_id && sku[color_id].sizeList && sku[color_id].sizeList[size_id] && sku[color_id].sizeList[size_id].size_name || '';
  }
  // console.log('select_goods', select_goods);
}


function setProductInfo() {
  let extend = this.allProInfo.extend || {};
  let select_goods = this.select_goods || {};
  let sku = this.allProInfo.sku || {};
  if (extend.attr_count == 1) {
    if (select_goods.select_color_id) {
      select_goods.product_info = sku[select_goods.select_color_id] || {};
      // console.log('选满', select_goods);
    }
  } else if (extend.attr_count == 2) {
    let color_id = select_goods.select_color_id;
    let size_id = select_goods.select_size_id;
    if (color_id && size_id) {
      select_goods.product_info = sku[color_id] && sku[color_id].sizeList && sku[color_id].sizeList[size_id] || {};
      // console.log('选满', select_goods);
    }
  }
  this.popup = this.popup || this.selectComponent('#popup');
  this.popup.updateSku(select_goods);
}


function checkSkuSelect() {
  //缺一个检查库存逻辑
  let name = '';
  let color_id = this.select_goods.select_color_id;
  let size_id = this.select_goods.select_size_id;
  let goodsExtend = this.allProInfo.extend;
  if (!color_id) {
    name = `请选择${goodsExtend.color_name_title || "完整规格"}`
  } else if (!size_id && goodsExtend.attr_count == 2) {
    name = `请选择${goodsExtend.size_name_title || "完整规格"}`
  }
  if (name) {
    this.popup = this.popup || this.selectComponent('#popup');
    this.popup.setToast(true, name, 2000);
    return Promise.reject();
  }
  let product_number = this.select_goods.product_info && this.select_goods.product_info.product_number || 0
  if (!product_number) {
    this.popup = this.popup || this.selectComponent('#popup');
    this.popup.setToast(true, '商品已售罄', 2000);
    return Promise.reject();
  }
  return Promise.resolve();

}

function onShare(id = 0) {
  addActionLog.call(this, 'VIDEO_SHOPPING_SHARE');
  let params = {
    activeId: id || 0
  }
  return app.RunApi.go('post', 'VideoShopApi', 'createVideoShoppingShared', params, { isShowLoad: false }).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      // console.log('分享成功', v_arr[cur_v].id);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}

function setLike(type = '') {
  // clearTimeout(this.setLikeId);
  if (this.setLikeLoading) return
  this.setLikeLoading = true;
  let v_arr = this.v_arr || [];
  let cur_v = this.cur_v || 0;
  let bool = v_arr[cur_v].is_like == 1 ? 0 : 1;
  if (bool == 0 && !type) {
    this.setLikeLoading = false;
    return
  }
  v_arr[cur_v].is_like = bool;
  this.setData({
    [`v_arr[${cur_v}].is_like`]: bool
  })
  let params = {
    activeId: v_arr[cur_v].id || 0
  }
  let extra = {
    isShowLoad: false
  }
  return app.RunApi.go('post', 'VideoShopApi', 'likeOrUnLikeVideo', params, extra).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).finally(() => {
    if (type == 'single' && bool == 1) {
      this.doubleTap({}, 'percent');
    }
    setTimeout(() => {
      this.setLikeLoading = false;
    }, 300)
  })
}

function buy(type = 0) {
  let obj = this.select_goods || {};
  let v_arr = this.v_arr || [];
  let cur_v = this.cur_v || 0;
  let goodsId = obj.product_info.goods_id
  let params = {
    "goods_id": obj.product_info.goods_id,
    "product_id": obj.product_info.product_id,
    "goods_type": obj.product_info.goods_type,
    "goods_number": obj.select_goods_count,
    "is_buy_now": type == 1 ? 1 : 0,
    "issued_id": 0,
    // "issued_id": v_arr[cur_v] && v_arr[cur_v].id || 0 || 0,
    "url_code": "",
    "shippingStoreId": 0,
    "clientSessionId": app.LgMg.channel && app.LgMg.channel.clientSessionId,
    "visitLogId": app.LgMg.pageLog && app.LgMg.pageLog.logId
  }
  let extra = { isShowLoad: type == 1 ? true : false };
  this.popup = this.popup || this.selectComponent('#popup');
  return app.RunApi.go('post', 'BuyApi', 'createBuyCarInsert', params, extra).then(res => {
    if (res.code == 1) {
      let data = res.data;
      if (this.addCart) {
        addActionLog.call(this, 'VIDEO_GOODS_ADDCART', { goodsId })
      }
      if (type == 1) {
        var userChoiceData = app.StorageH.get('userChoiceData') || {};
        userChoiceData.rec_str = data;
        app.StorageH.set('userChoiceData', userChoiceData);
        // let selectShipInfo = this.data.selectShipInfo || {};
        // let store_id = selectShipInfo.id || 0;
        wx.navigateTo({
          url: '/pages/micro_mall/buy/buy?rec_str=' + data + '&store_id=' + 0,
        })
      } else {
        this.popup.setAnim();
        setTimeout(() => {
          this.popup.setToast(true, "加入成功");
        }, 900)
      }
      // init.call(this);
      // this.popup = this.popup || this.selectComponent('#popup');
      // this.popup.dismiss();
      let tempGoodsData = this.tempGoodsData || {};
      getSku.call(this, tempGoodsData)
      return Promise.resolve(res);
    } else {
      app.SMH.showToast({
        "title": res.msg
      })
    }
    return Promise.reject();
  }).finally(e => {
    setTimeout(() => {
      this.popup.setThrottle(false);
    }, 400)
  })
}

function listen() {
  if (app.LM.isLogin) {
    if (!this.data.isLogin) {
      this.setData({
        isLogin: true
      });
    }
    return
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
}

function unListen() {
  clearTimeout(this.showGuideId);
  this.v_video = this.v_video || this.selectComponent("#v_video");
  this.v_video.toggleFnc(this.cur_v, true, { setFalse: true });
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
}

function checkRoll(cur_v = 0) {
  wx.nextTick(() => {
    setTimeout(() => {
      queryMultipleNodes.call(this, cur_v);
    }, 500)
  })
}

function queryMultipleNodes(cur_v) {
  let that = this;
  let v_arr = this.v_arr || [];
  const query = wx.createSelectorQuery();
  query.select('#title').boundingClientRect(function (res) {
    v_arr[cur_v] = v_arr[cur_v] || {};
    let width = res && res.width || 0;
    v_arr[cur_v].t_check = true;
    v_arr[cur_v].t_roll = parseFloat(width * (750 / app.SIH.windowWidth)) > 420;
    v_arr[cur_v].t_roll_width = '-' + (parseFloat(width * 0.7)) + 'px';
    that.setData({
      [`v_arr[${cur_v}]`]: v_arr[cur_v]
    })
    // console.log('title', cur_v, res, v_arr[cur_v]);
  }).exec()
}


function addActionLog(name = '', _p) {
  let v_arr = this.v_arr || [];
  let cur = this.cur_v || 0;
  let activityId = v_arr[cur] && v_arr[cur].id || 0;
  let params = {
    activityId
  }
  if (name == 'VIDEO_SHOPPING_SHARE') {

  } else if (name == 'VIDEO_GOODS_CLICK') {
    params.goodsId = _p.goodsId || 0;
  } else if (name == 'VIDEO_GOODS_ADDCART') {
    params.goodsId = _p.goodsId || 0;
    this.addCart = false;
  } else if (name == 'VIDEO_SHOPPING_PLAY') {
    params.activityId = _p.activityId || 0;
    params.seconds = _p.seconds || 0;
  } else if (name == 'VIDEO_GOODS_GO_DETAIL') {
    params.goodsId = _p.goodsId || 0;
  } else if (name == 'VIDEO_SHOPPING_SHOW') {

  } else if (name == 'VIDEO_GOODS_DETAIL_ADDCART') {

  }
  if (!name) return;
  let position = 'VIDEO_SHOP_PAGE';
  console.log('行为', name, params)
  this.addActionLog(name, position, params);
}

function calculateTime(params = {}) {
  params = params || {};
  let type = params.type || '';
  let id = params.id || 0;
  let index = params.index || 0;
  let v_arr = this.v_arr || [];
  let cur_v = this.cur_v || 0;
  let new_time = new Date().getTime();
  if (!v_arr[cur_v]) return
  if (type == 'onPlay') {
    v_arr[cur_v].startTime = new_time;
    v_arr[cur_v].isPlaying = true;
    //console.log('jimmy onPlay', v_arr[cur_v])
  } else if (type == 'onPause') {
    if (cur_v == index) {
      v_arr[cur_v].durationTime = (new_time - v_arr[cur_v].startTime) + v_arr[cur_v].durationTime;
      v_arr[cur_v].isPlaying = false;
    }
    //console.log('jimmy onPause', v_arr[cur_v])
  } else if (type == 'onFinish') {
    let finalDurationTime = 0;
    if (v_arr[index].isPlaying) {
      finalDurationTime = (v_arr[index].durationTime + (new_time - v_arr[index].startTime)) / 1000
      v_arr[cur_v].isPlaying = false;
    } else {
      finalDurationTime = v_arr[index].durationTime / 1000;
    }
    finalDurationTime = parseFloat((finalDurationTime).toFixed(1));
    //console.log('jimmy finalDurationTime', finalDurationTime, v_arr[index])
    let temp = {
      activityId: id,
      seconds: finalDurationTime
    }
    addActionLog.call(this, 'VIDEO_SHOPPING_PLAY', temp);
    v_arr[index].durationTime = 0;
  }
  this.setData({
    v_arr
  })
}


function createObjKeyVal(obj, key, type) {
  if (obj instanceof Array) {
    let json = {};
    let initImg = {};
    for (let i = 0; i < obj.length; i++) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = [];
      }
      json[Id].push(obj[i]);

      if (type && type == 'initImg') {
        if (!initImg[Id]) {
          initImg[Id] = [];
        }
        initImg[Id].push(obj[i] && obj[i].imgUrl || '')
      }
    }
    this.gallery_init = initImg || {};
    return json;
  }
}

function showloadFnc(type = '') {
  if (!this.setLoading) {
    this.v_video = this.v_video || this.selectComponent("#v_video");
    this.v_video.setLoad(true);
  }
  this.setLoading = true;
  clearTimeout(this.setLoadId);
  this.setLoadId = setTimeout(() => {
    this.setLoading = false;
    this.v_video.setLoad(false);
  }, 1000)
}

function checkGuide() {
  let obj = app.StorageH.get('VIDEO_UPDATE') || {};
  let check = obj && obj.checkGuide || false;
  if (!check) {
    this.showGuide = true;
    let guideData = {
      arrows: this.data.brand_info.default_icon_url + 'arrows.png',
      hand: this.data.brand_info.default_icon_url + 'hand.png',
      text: "上滑查看更多视频"
    }
    this.setData({
      guideData,
    })
    let sto = {
      checkGuide: true,
      ...obj
    };
    app.StorageH.set('VIDEO_UPDATE',sto)
  }
}

function setEmpty() {
  this.setData({
    hidePage: true,
    showPage: true
  })
}

function checkShowInfo() {
  if (this.v_arr && this.v_arr.length > 1) {
    checkGuide.call(this);
  }
  if (this.data.showGuide != this.showGuide) {
    this.setData({
      showGuide: this.showGuide,
    })
  }
  if (this.showGuide) {
    this.showGuideId = setTimeout(() => {
      this.showGuide = false;
      this.setData({
        showGuide: false
      })
    }, 4500)
  }
  if (this.data.initLoadingAnim) {
    this.setData({
      initLoadingAnim: false
    })
  }
}

function checkShare(id = 0) {
  if (!id || this.shareData) {
    return Promise.resolve(false);
  }
  let params = {
    activeId: id
  }
  return app.RunApi.go('VideoShopApi', 'getVideoShippingById', params).then(res => {
    if (res.code == '1') {
      return Promise.resolve(res.data);
    }
    return Promise.resolve(false);
  }).catch(e => {
    return Promise.resolve(false);
  })
}


function initTemplate(staffCode = '') {
  if (this.drawArr && this.drawArr.length > 0) { return }
  // goods_info = goods_info || {};
  let arr = this.v_arr || [];
  let cur = this.cur_v || 0;
  let arrInfo = arr[cur] || {};
  let canvasW = 600;
  let canvasH = 950;
  let postW = 600;
  let postH = 761;
  let padding = 36;
  let baseH = 30;
  let baseTopLine = 0;
  let codeW = 120;
  let baseBottomLine = canvasH;
  this.drawArr = this.drawArr || [];
  let img_user = 60;
  let bg = DrawTemplate.initData('image', 0, 0, postW, postH);
  bg.url = arrInfo.posterPicture || '';
  bg.mode = 'aspectFill';
  this.drawArr.push(bg);
  baseTopLine = postH + padding;
  let userHead = DrawTemplate.initData('image', padding, baseTopLine, img_user, img_user);
  userHead.type = 'userHead';
  this.drawArr.push(userHead);
  let eq_params = {
    img_y: baseTopLine,
    img_h: img_user,
  }
  let realName = DrawTemplate.initData('text', img_user + padding + 20, DrawTemplate.equation('v_m', eq_params), 200, 0);
  realName.type = "realName"
  realName.size = 20;
  realName.ellipsis = 2;
  realName.color = '#000';
  this.drawArr.push(realName);

  baseTopLine = baseTopLine + img_user + baseH - 5;
  let tip = DrawTemplate.initData('text', padding, baseTopLine);
  tip.text = "长按识别小程序码，进入观看"
  tip.size = 20;
  tip.color = "#7f7f7f";
  this.drawArr.push(tip);

  let arrow = DrawTemplate.initData('image', padding + 280, baseTopLine + 8, 59, 8);
  arrow.url = this.data.brand_info.icon_url + "micro_mall/video_shop/arrow.png";
  arrow.mode = 'normal';
  this.drawArr.push(arrow);

  if (staffCode) {
    let staff = DrawTemplate.initData('text', canvasW - padding - codeW, baseBottomLine - padding - 5);
    staff.size = 16;
    realName.color = '#7f7f7f';
    staff.text = staffCode;
    staff.position = 'fixed';
    staff.extra.type = 'column_middle';
    staff.extra.codeW = codeW;
    this.drawArr.push(staff);
  }
  baseBottomLine -= (padding + 5);
  baseBottomLine -= codeW + 6;
  let code = DrawTemplate.initData('image', canvasW - padding - codeW, baseBottomLine, codeW, codeW);
  code.type = 'code';
  this.drawArr.push(code);
  console.log('drawArr', this.drawArr)
}


function assembleOptions() {
  let scene = this.options.scene;
  if (scene) {
    app.SHP.getParams(["id"]).then((params) => {
      this.options = {
        ...this.options,
        ...params
      }
      initData.call(this);
    })
  } else {
    initData.call(this);
  }
}