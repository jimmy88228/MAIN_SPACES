import {
  CountDown
} from "../../../common/manager/timer-manager/index";
import WxApi from "../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  data: {
    countDownTime: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },
    activity_info: {},
    goods_gallery: [],
    goods_info: {},
    img_domain: "",
  },
  onLoad(pageQuery) {
    this.pageQuery = pageQuery;
  },
  onShow() {
    getGoodsDetail.call(this)
      .then(data => handleGoodsDetail.call(this, data))
      .catch(err => {
        console.log("onShow", err);
        App.SMH.showToast({title: err});
      })
  },
  handlePurchaseBtnTap() {
    getSumaryGoodsProductInfo.call(this)
      .then(data => {
        this.goodsSpecPop = this.goodsSpecPop || this.selectComponent("#goods-spec-pop");
        this.goodsSpecPop.showModal(data)
      })
      .catch(err => {
        console.log("handlePurchaseBtnTap err", err);
        App.SMH.showToast({title: err})
      })
  },
  handleSwpierItemTap(e) {
    const goodsGallery = this.data.goods_gallery || [];
    let src = this.getDataset(e, "src");
    WxApi.previewImage({
      urls: goodsGallery.map(item => item.goods_img),
      current: src
    })
  },
  handleShareBtnTap() {
    this.sharePop = this.sharePop || this.selectComponent("#share-pop");
    this.sharePop.showModal()
      .then(selectedItem => {
        console.log("selectedItem", selectedItem)
      })
  },
  navigateF(e) {
    const dataset = e.currentTarget.dataset || {};
    const {
      delta
    } = dataset;
    console.log("delta", delta)
    if (delta) {
      WxApi.navigateBack({
        delta
      })
    }
  }
}))

function getGoodsDetail() {
  this.showLoading();
  return App.Http.QT_GoodsApi.get_Sumary_GoodsDetailData({
    params: {
      activityId: this.pageQuery.activity_id || 0,
      goodsId: this.pageQuery.goods_id || 0
    }
  })
    .then(res => {
      if (res.code == 1) {
        this.setData(res.data);
        return res.data || {};
      }
      return Promise.reject(res.msg || "获取商品详情失败")
    })
    .finally(() => {this.hideLoading()})
}

function handleGoodsDetail(data) {
  setCountDown.call(this);
  
}

function getSumaryGoodsProductInfo() {
  let {goods_id} = this.data.goods_info || {};
  return App.Http.QT_GoodsApi.get_Sumary_GoodsProductInfo({
    params: {
      activityId: this.pageQuery.activity_id || 0,
      goodsId: goods_id,
      colorId: 0
    }
  })
    .then(res => {
      if (res.code == 1) {
        let {CategoryInfoList: skuList, ListGoodsProductInfo: productList} = res.data || {};
        return {skuList, productList}
      }
      return Promise.reject(res.msg || "获取商品数据失败");
    })
}

function setCountDown() {
  let {
    status,
    start_time,
    end_time,
    date: server_time,
  } = this.data.activity_info;
  start_time = start_time.replace(/-/g, '/'), end_time = end_time.replace(/-/g, '/'), server_time = server_time.replace(/-/g, '/'); // 兼容ios
  let targetDate = new Date(status == 1 ? end_time : start_time);
  if (!this.countDown) {
    this.countDown = new CountDown(new Date(server_time) || new Date());
  }
  console.log("targetDate", targetDate)
  this.countDown.setTarget(targetDate);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this);
      } else {
        let days = parseInt(e.value / (1000 * 60 * 60 * 24));
        let hours = parseInt(days * 24 + (e.value % (24 * 3600 * 1000)) / (3600 * 1000));
        let minutes = parseInt((e.value % (3600 * 1000)) / (60 * 1000));
        let seconds = parseInt((e.value % (1000 * 60)) / 1000);
        this.setData({
          "countDownTime.hours": hours,
          "countDownTime.minutes": minutes,
          "countDownTime.seconds": seconds,
        })
      }
    });
  }
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
    delete this.countDown;

    console.log("stop")
  }
}