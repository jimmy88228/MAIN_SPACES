import MyDate from "../../../../common/support/utils/date-util"
const PAGE_TYPE = "STAFF_COUPON";
const app = getApp();
Page(app.BP({ 
  data: {
    tab:[
      {key:"toUse",name:"待使用"},
      {key:"used_expired",name:"已使用/已过期"},
      // {key:'isUsed',name:"已使用"},
      // {key:'isExpired',name:"已过期"}
    ],
    listData:[
      {
        key: "toUse",
        page: 0,
        hasMore:true,
        loaded:false,
        data:[],
      },
      {
        key: "used_expired",
        page: 0,
        hasMore:true,
        loaded:false,
        data:[],
      }
    ],
    //通过下标标识
    current: 0,
  },

  onLoad: function (options) {
    this.options = options;
    let img_past = this.data.brand_info.default_icon_url + "coupon_past.png";
    let img_used = this.data.brand_info.default_icon_url + "coupon_used.png";
    this.setData({
      img_past,
      img_used
    })
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
    let listData = this.data.listData||[];
    this.setData({
      current: detail.current
    });
    if(listData[detail.current].loaded)return;
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
  let typeParam = current==0?0:current==1?3:0;
  console.log('current',current,typeParam);
  let listData = this.data.listData || [];
  let req = "getUserRedpackList";
  let itemData = listData[current] || {};
  let page = type == "init" ? 0 : itemData.page;
  page = page + 1; 
  return app.UserApi[req]({
    params: {
      type:typeParam,
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
      let dataList = data.list || [];
      let totalCount = data.totalCount || 0;
      let showData = itemData.data; 
      for(let i = 0; i < dataList.length; i++){
        let fromDate,toDate; 
        // fromDate = dataList[i].fromDate && dataList[i].fromDate.replace(/\-/g, "/");
        // toDate = dataList[i].toDate && dataList[i].toDate.replace(/\-/g, "/");    
        // dataList[i].fromTimeStr = MyDate.format(MyDate.parse(fromDate), "yyyy.MM.dd");
        // dataList[i].toTimeStr = MyDate.format(MyDate.parse(toDate), "MM.dd");
        dateFormat.call(this,dataList[i]);
      }
      if(page != 1){
        dataList = dataList.concat(showData);
      }
      
      itemData.page = page;
      itemData.hasMore = dataList.length < totalCount;
      itemData.data = dataList;
      itemData.loaded = true;
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

function dateFormat(item={}) {
  let fromDay = MyDate.format(MyDate.parse(item.fromDate), "yyyy.MM.dd");
  let fromTimeHm = MyDate.format(MyDate.parse(item.fromDate), "HH:mm");
  let toDay = MyDate.format(MyDate.parse(item.toDate), "yyyy.MM.dd");
  let toTimeHm = MyDate.format(MyDate.parse(item.toDate), "HH:mm");
  if(fromDay == toDay){
    let format = "yyyy.MM.dd HH:mm"
    item.fromTimeStr = MyDate.format(MyDate.parse(item.fromDate), format)
    item.toTimeStr = MyDate.format(MyDate.parse(item.toDate), "HH:mm")
  }else if(item.type == 0){
    let format = fromTimeHm == "00:00" ? "yyyy.MM.dd": "yyyy.MM.dd HH:mm"
    item.fromTimeStr = MyDate.format(MyDate.parse(item.fromDate), format)
    item.toTimeStr = MyDate.format(MyDate.parse(item.toDate), "MM.dd HH:mm")
  }else if(item.type == 1 || item.type==3){
    let format = "MM.dd HH:mm"
    item.fromTimeStr = MyDate.format(MyDate.parse(item.fromDate), "yyyy.MM.dd")
    item.toTimeStr = MyDate.format(MyDate.parse(item.toDate), format)
  }
}