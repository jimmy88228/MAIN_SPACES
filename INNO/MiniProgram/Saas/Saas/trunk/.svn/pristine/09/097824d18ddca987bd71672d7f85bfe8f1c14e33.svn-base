// pages/micro_mall/sk/orders-sk/order-list.js
import GetStatus from '../help/getStatus.js'
const app = getApp();
Page(app.BP({
  data: {
    ac_conf: app.Conf.style.n_sk_color,
    list: [],
    cur_index:0,
    baseWidth:33.33,
    jumpType: "custom",
    tab: [{title: "全部", id: 1},
          {title: "已完成",id: 2},
          {title: "已结束",id: 3}],
  },
  page: 1,
  type: 1,
  hasMore: true,
  isLoading: false,
  onLoad: function(options) {},
  onReady: function() {
  },
  onShow: function() {
    init.call(this);
    iniTabbar.call(this);
    loadData.call(this);
  },
  handle_scroll(e){
    loadData.call(this);
  },
  handle_tab(e) {
    // console.log(e);
    let dataset = e.currentTarget.dataset || {};
    let id = dataset.id || 0;
    let cur_index = dataset.index || 0;
    if (this.type == id) return
    // console.log(id);
    this.type = id;
    this.setData({
      cur_type: id,
      cur_index
    })
    init.call(this);
    loadData.call(this);
  },
  jump(e){
    let dataset = e.currentTarget.dataset || {};
    let url = dataset.url || 0;
    let type = dataset.type || '';
    let order_id = dataset.order_id || 0;
    let out_order_id = dataset.out_order_id || 0;
    if(type=='detail'){
      if (!out_order_id){
        app.SMH.showToast({
          title:"订单号同步中"
        })
        return
      }
      wx.navigateTo({
        url: `${url}?order_id=${out_order_id}`,
      })
    }else{
      let name = '记录详情';
      if (type == 'pay'){
        name = '订单详情'
      }
      wx.navigateTo({
        url: `${url}?order_id=${order_id}&type=${name}`,
      })
    }
  },
  cancel(e){
    let dataset = e.currentTarget.dataset || {};
    let orderId = dataset.order_id || 0;
    this.dialog = this.dialog || this.selectComponent("#dialog");
    this.dialog.setTitle("提示");
    this.dialog.setTouchCancel(true);
    this.dialog.setCentent("确定要取消该订单吗？");
    this.dialog.show();
    let that = this;
    this.dialog.setTwoBtn(
      {
        name: "取消",
        tap: function () {
         that.dialog.dismiss();
        }
      },
      {
        name: "确认",
        tap: function () {
          cancelOrder.call(that, orderId).then(res=>{
            init.call(that);
            loadData.call(that);
          });
          that.dialog.dismiss();
        }
      },
    );
  },
}))

function loadData() {
  if (!this.hasMore || this.isLoading) return
  this.isLoading = true;
  let params = {
    // userToken: app.LM.userToken,
    pageIndex: this.page,
    pageSize: app.Conf.PAGE_SIZE,
    type: this.type,
  }
  return app.RunApi.go('SecKillApi', 'getOrderList', params).then(res => {
    // console.log('getOrderList', res);
    if (res.code == '1') {
      let data = res.data || {};
      let list = data.list || [];
      let none = false;
      list.forEach(item => {
        let status = GetStatus.getOrderStatus(item.state);
        item.status = status;
      });
      if (data.count==0){
        none = true
      }
      this.setData({
        none,
        list: [...this.data.list,...list],
      })
      // console.log('hasmore', data.count, this.page * app.Conf.PAGE_SIZE)
      this.hasMore = data.count > this.page * app.Conf.PAGE_SIZE;
      this.page +=1;
      return Promise.resolve();
    }
    return Promise.reject();
  }).finally(() => {
    this.isLoading = false;
  })
}

function init() {
  this.page = 1;
  this.hasMore = true;
  this.isLoading = false;
  this.data.list = [];
}

function cancelOrder(orderId){ 
  return app.SecKillApi.cancelOrder({
    params:{
      userToken: app.LM.userToken,
      orderId: orderId || 0,
      brandCode: app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code==1){
      // console.log('取消订单成功',res); 
      app.SMH.showToast({
        title:"取消成功"
      })
      return Promise.resolve();
    }
    return Promise.reject(res);
  }).catch(e=>{
    app.SMH.showToast({
      title:e.msg||"订单异常"
    })
  })
}

function iniTabbar() {
  if (this.first_init_tab) return
  this.first_init_tab = true;
  let ac_conf = this.data.ac_conf;
  let brand_info = this.data.brand_info;
  this.tababr = this.tababr || this.selectComponent("#custom_tabbar");
  this.tababr.setTabbar([{
    "pagePath": "pages/micro_mall/sk/activity-sk/activity-sk",
    "text": "秒杀列表",
    "iconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_home.png?123",
    "selectedIconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_home_active.png",
    "is_this_page": false,
    "select_color": ac_conf.theme_color,
    "is_original_tab": false
  },
  {
    "pagePath": "pages/micro_mall/sk/orders-sk/order-list",
    "text": "我的秒杀",
    "iconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_order.png?123",
    "selectedIconPath": brand_info.icon_url + "micro_mall/sec_kill/sk_order_active.png",
    "is_this_page": false,
    "select_color": ac_conf.theme_color,
    "is_original_tab": false,
    "need_login": true,
    "is_this_page": true,
  }
  ]);
}
