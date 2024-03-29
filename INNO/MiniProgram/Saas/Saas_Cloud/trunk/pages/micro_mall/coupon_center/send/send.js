import MyDate from "../../../../common/support/utils/date-util"
const PAGE_TYPE = "STAFF_COUPON";
const app = getApp();
Page(app.BP({ 
  data: {
    tab:[
      {key:"list",name:"派券列表"},
      {key:'record',name:"派券记录"}
    ],
    listData:[
      {
        key: "list",
        page: 0,
        hasMore:true,
        data:[],
      },
      {
        key: "record",
        page: 0,
        hasMore:true,
        data:[],
      },
    ],
    //通过下标标识
    current: 0,
  },

  onLoad: function (options) {
    this.options = options;
  },

  onReady: function () {
    this.isReady = true;
    limitLoad.call(this,"init");
  },

  onShow: function () {
    limitLoad.call(this,"init");
  },

  onHide: function () {

  },

  onUnload: function () {
    this.isReady = false;
  },
 
  onShareAppMessage: function (e) {
    console.log("分享",e)
    if(e.from == "button"){//分享券
      let dataset = e.target.dataset || {};
      let shareInfo = dataset.shareInfo;
      if(shareInfo){
        // this.choice = this.choice || this.selectComponent("#choice");
        // this.choice.dismiss();
        return shareInfo
      }
      if(dataset.type == "record"){
        let lIndex = dataset.lIndex;
        let index = dataset.index;
        let listData = this.data.listData  || {};
        let bonusInfo = listData[lIndex].data[index] || {};
        return {
          isCustom: true,
          shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL,
          title: bonusInfo.shareTitle,
          path: "/pages/micro_mall/coupon_center/receive/receive?shareId=" + bonusInfo.shareId,
          imageUrl: bonusInfo.shareImage
        }
      }
    }
  },
  onTap(e){
    let dataset = e.currentTarget.dataset || {};
    this.setData({
      current: dataset.key
    })
    limitLoad.call(this,"init");
  },
  swiperChangeCallback(e){
    let detail = e.detail;
    this.setData({
      current: detail.current
    })
    limitLoad.call(this,"init");
  },
  scrolltolowerCallback(e){
    let listData = this.data.listData || {};
    let current = this.data.current;
    if(listData[current].hasMore){
      limitLoad.call(this);
    }else{
      app.SMH.showToast({
        isNoData: true
      })
    }
  },
  refreshCallback(){
    let that = this;
    limitLoad.call(this, "init",function(){
      that.list = that.list || that.selectComponent("#list");
      that.list.refreshEnd();
    })
  },
  sendCoupon(e){
    let dataset = e.currentTarget.dataset || {};
    console.log(dataset);
    let lIndex = dataset.lIndex;
    let index = dataset.index;
    let listData = this.data.listData  || {};
    let bonusInfo = listData[lIndex].data[index] || {};
    console.log("bonusInfo",bonusInfo)
    if(bonusInfo.canSendCount < 1) return;
    this.setData({
      choiceBonus: bonusInfo
    })
    this.choice = this.choice || this.selectComponent("#choice");
    this.choice.show();
  },
  showDesc(e){
    let dataset = e.currentTarget.dataset;
    let activieTaskId = this.data.activieTaskId || ""
    if(activieTaskId == (dataset.taskId + "" + dataset.index)){
      activieTaskId = ""
    }else{
      activieTaskId = dataset.taskId + "" + dataset.index
    }
    this.setData({
      activieTaskId: activieTaskId
    })
  },
  choiceHide(){
    limitLoad.call(this,"init");
  }
}))
function limitLoad(isInit,callback){
  if(!this.isReady) return;
  this.loadTimer && clearTimeout(this.loadTimer);
  this.loadTimer = setTimeout(()=>{
    return loadData.call(this,isInit).then(()=>{
      typeof(callback) == "function" && callback();
    })
  },500)
}
function loadData(type){
  let current = this.data.current || 0;
  let listData = this.data.listData || [];
  let req = "getStaffSendCouponList";
  if(current == 0){
    req = "getStaffSendCouponList"
  }else if(current == 1){
    req = "getStaffShareCouponList" 
  }
  let itemData = listData[current] || {};
  let page = type == "init" ? 0 : itemData.page;
  page = page + 1; 
  return app.DistrApi[req]({
    params: {
      pageIndex: page,
      pageSize: app.Conf.PAGE_SIZE,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let dataList = data.dataList || [];
      let totalCount = data.totalCount || 0;
      let showData = itemData.data;
      //status 0可领取，1已领取，2已派完，3无效
      for(let i = 0; i < dataList.length; i++){
        let fromTime,toTime;
        //记录处理
        if(itemData.key == "record"){
          fromTime = dataList[i].fromDate && dataList[i].fromDate.replace(/\-/g, "/");
          toTime = dataList[i].toDate && dataList[i].toDate.replace(/\-/g, "/");
          dataList[i].surplusCount = parseInt(parseInt(dataList[i].totalCount) - parseInt(dataList[i].sendCount));
          dataList[i].sendPercen = dataList[i].sendCount == 0 ? 0 : ((parseInt(dataList[i].sendCount) / parseInt(dataList[i].totalCount))* 100).toFixed(0);
        }else{
          fromTime = dataList[i].fromTime && dataList[i].fromTime.replace(/\-/g, "/");
          toTime = dataList[i].toTime && dataList[i].toTime.replace(/\-/g, "/");
        }
        dataList[i].fromTimeStr = MyDate.format(new Date(fromTime), "MM月dd日 hh:mm");
        dataList[i].toTimeStr = MyDate.format(new Date(toTime), "MM月dd日 hh:mm");
      }
      if(page != 1){
        dataList = dataList.concat(showData);
      }
      
      itemData.page = page;
      itemData.hasMore = dataList.length < totalCount;
      itemData.data = dataList;
      let key = `listData[${current}]`
      this.setData({
        [key]: itemData
      })
      console.log("listData",this.data.listData);
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}
