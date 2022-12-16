// pages/store_pay/store_pay_history/history_list.js
// Payed = 1,
// Unpay = 0,
// Canceld = 2 
var app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    time_array: [],
    hasData: true
  },
  page: 1,
  is_more: true,
  arr: {},
  years: [],
  onLoad(){ 
    this.getStorePayData();
  },
  onUnload(){
    clearTimeout(this.pullId);
  },
  onPullDownRefresh(e){
    this.getStorePayData('pull');
  }, 
  onReachBottom: function() {
    var is_more = this.is_more;
    if (!is_more) {
      app.SMH.showToast({
        "title": "已经到底啦！"
      })
      return;
    }
    this.page++;
    getList.call(this);
    return;
  },

  getStorePayData: function(type='') {
    getList.call(this, type);
    return;
  },
  /**
   * 针对修改数据结构
   */
  changeStructure: function(data) {
    // console.log(data);
    let time_array = [];
    let pay_array = [];
    let j = -1;
    for (let i in data) {
      let create_time = data[i].create_time;
      let year = "";
      if (create_time.indexOf("-") == -1) {
        year = create_time.split("/")[0];
      } else {
        year = create_time.split("-")[0];
      }
      if (time_array.indexOf(year) == -1) {
        time_array.push(year);
        j++;
        pay_array[j] = new Array();
        console.log(j, '新时间:', time_array)
      }
      pay_array[j].push(data[i]);
      console.log('pay_array', pay_array)
    }
    this.setData({
      time_array: time_array
    })
    return pay_array;
  }
}))

function getList(type='') {
  if (type && type == 'pull'){
    this.page = 1;
    this.data.listData = [];
    this.data.years = [];
    this.arr = {};
    this.years = [];
    this.setData({ 
      hasData: true
    });
  }
  var page = this.page;
  return app.SmktPayApi.getOfflineOrderInfoRecordList({
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
      var data = e.data;
      if (data.length == 0) {
        this.is_more = false;
        app.SMH.showToast({
          "title": "已经到底啦！"
        })
        return
      }
      mapYears.call(this, data);  
      this.is_more = data.length == app.Conf.PAGE_SIZE;
      this.setData({ 
        listData: this.arr || {},
        years: this.years || [],
        hasData: this.years.length > 0
      });
      console.log('?2', this.data.listData);
      console.log('?3', this.data.years);
      return Promise.resolve();
    }
    return Promise.reject();
  }).finally(()=>{
    let that = this;
    if(type && type=='pull'){
      that.pullId = setTimeout(()=>{
        clearTimeout(that.pullId);
        wx.stopPullDownRefresh();
      },320)
    }
  })
}


function mapYears(data) {
  this.years = this.years || [];
  data && data.forEach(item => {
    let getYear = '';
    item.all_amount = (parseFloat(item.order_amount ||0) + parseFloat(item.discount_amount || 0)).toFixed(2);
    if (item.create_time.indexOf('/') > -1) {
      getYear = item.create_time.split(' ')[0].split('/')[0];
    } else {
      getYear = item.create_time.split(' ')[0].split('-')[0];
    }
    if (getYear && this.years.indexOf(getYear) == -1) {
      this.years.push(getYear);
    }
    this.arr[getYear] = this.arr[getYear] || [];
    this.arr[getYear].push(item);
  })
  return
}