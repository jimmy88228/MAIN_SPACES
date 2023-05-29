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
  onHide() {
    stopCountDown.call(this);
  },
  handlePurchaseBtnTap() {
    getSumaryGoodsProductInfo.call(this)
      .then(data => {
        let goodsInfo = this.data.goods_info || {};
        data.goodsImg = goodsInfo.goods_img || "";
        data.goodsId = goodsInfo.goods_id || 0;
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
    this.sharePop.showModal({needLogin: true})
      .then(selectedItem => {
        if (selectedItem.shareId === 2) { // 生成海报
          let {goods_info, activity_info} = this.data;
          let posterData = {
            info:{
              goodsInfo: {
                ...goods_info,
                ...activity_info,
              },
              opKind: "QT_GOODS",
            },
            scene: {
              "shareType": "QT_GOODS",
              ...this.pageQuery
            }
          }
          this.posterPop = this.posterPop || this.selectComponent("#poster-pop");
          this.posterPop.showModal({type: "goods", data: posterData});
        }
      })
  },
  onShareAppMessage(e) {
    let {goods_name} = this.data.goods_info;
    let {goods_id, activity_id} = this.pageQuery || this.options;
    let firstImage = this.data.goods_gallery[0] || {};
    return {
      title: goods_name,
      imageUrl: firstImage.goods_img || "",
      goods_id,
      activity_id
    }
  },
  refreshPage() {
    this.onShow();
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
        let data = res.data || {},
        activity_info = data.activity_info || {},
        goods_info = data.goods_info || {};
        goods_info.down_price = App.Utils.StringUtils._toFixed(goods_info.market_price - goods_info.sale_price,2);
        activity_info.status = doubleCheckActivityStatus(activity_info);
        data.activity_info = activity_info;
        
        this.setData(data);
        return data || {};
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

function doubleCheckActivityStatus (activityInfo = {}) { // 前端再判断一次活动状态，以防万一
  const {start_time, date, end_time} = activityInfo;
  let status = 0; // 活动未开始
  if (!start_time && !date && !end_time) status = 2; // 活动已过期
  else if (date < start_time) status = 0; // 活动未开始
  else if (date >= end_time) status = 2; // 活动已过期
  else status = 1; // 活动进行中
  return status
}

function setCountDown() {
  let {
    status,
    start_time,
    end_time,
    date: server_time,
    id
  } = this.data.activity_info;
  start_time = start_time.replace(/-/g, '/'), end_time = end_time.replace(/-/g, '/'), server_time = server_time.replace(/-/g, '/'); // 兼容ios
  if (status == 2 || !id)return;// 活动已过期，就不用再进行倒计时了
  let targetDate = new Date(status == 1 ? end_time : start_time);
  if (!this.countDown) {
    this.countDown = new CountDown(new Date(server_time) || new Date());
  }
  console.log("targetDate", targetDate)
  this.countDown.setTarget(targetDate);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        this.refreshPage();
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