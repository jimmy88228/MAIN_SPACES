const app = getApp();
import CheckUpdateTimer from "../../../helper/manager/check-update-timer";
Page(app.BP({
  data: {
    dataDetail: {},
    array: ['0.00', '0.00', '0.00', '0.00'],
    saleArray: ['0.00', '0.00', '0.00'],
    page_id: 0
  },
  onLoad: function(options) {
    let name = options && options.name || "分销中心";
    wx.setNavigationBarTitle({
      title: name
    })
    let bg_color = app.getColor(this.data.brand_info.style.bg_color, -53, -10, 21, 1);
    this.setData({
      bg_color: bg_color
    });
    tipVisit.call(this);
    moduleInit.call(this); 
  },
  onShow: function() {
    loadData.call(this).then(res=>{
      let p1 = getMyStaffDstbInfo.call(this);
      let p2 = checkConfigFn.call(this);
      if (this.commission_mod && this.commission_mod.isOpen == '1') {
        checkShow.call(this, [p1, p2]).then(res => {
          brokerageInit.call(this);
        });
      }
    });
  },
  onHide: function() {
    end.call(this);
  },
  onUnload() {
    end.call(this);
  }
}))

function loadData() {
  return app.DistrApi.staffDstbInfo({
    params: {
      "brandCode": app.Conf.BRAND_CODE,
      "userToken": app.LM.userToken || "",
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      let dataDetail = res.data || {};
      this.dataDetail = dataDetail;
      this.setData({
        dataDetail: dataDetail
      }) 
      brokerageInit.call(this);
      salesInit.call(this);
      return Promise.resolve(res);
    }
    return Promise.reject();
  })
}

function end() {
  clearTimeout(this.label)
  if (this.brokerage){
    this.brokerage && this.brokerage.end();
  }
  if (this.sales) {
    this.sales && this.sales.end();
  }
  let _timer = setTimeout(() => {
    clearTimeout(_timer);
    this.setData({
      arrayOnhide: ['0.00', '0.00', '0.00', '0.00'],
      saleArrayOnhide: ['0.00', '0.00', '0.00']
    })
  }, 200)
}


function moduleInit() {
  let initInfo = app.Conf || {};
  let staffConf = initInfo.staffConf || {};
  let service_mod_show = false;
  console.log('staffConf', staffConf)
  this.commission_mod = staffConf.commission || {};
  this.service_mod = staffConf.service || {};
  if (this.service_mod.isOpen == '1') { //服务
    service_mod_show = true;
  }
  this.setData({
    service_mod: staffConf.service,
    service_mod_show,
  }) 
}



function checkConfigFn() {
  return app.DistrApi.staffInfo({
    params: {
      "brandCode": app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data;
      let page_id = data.guide_page || 0;
      this.setData({
        page_id
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}

function getMyStaffDstbInfo() {
  let params = {
    staffCode: app.LM.staffInfo.staffCode,
    brandCode: app.Conf.BRAND_CODE,
  }
  let extra = {
    diy: true
  }
  return app.RunApi.go('DistrApi', 'getMyStaffDstbInfo', params, extra).then(res => {
    if (res.code == '1') {
      let data = res.data || {};
      app.globalData.staffSimpleIno = data || {};
      this.setData({
        can_cashout: data.can_apply_cashout_duty
      })
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  })
}

function checkShow(arr) {
  let p = new Promise((rs, rj) => {
    return Promise.all(arr).then(res => {
      return rs(res)
    })
  })

  return p.then(res => {
    console.log('All', res);
    let dataDetail = this.data.dataDetail || {};
    let commission_mod = this.commission_mod;
    let service_mod = this.service_mod;
    let data_1 = res && res[0] && res[0].data || {};
    let data_2 = res && res[1] && res[1].data || {};
    let commission_mod_show = false;
    let commission = false;

    // //佣金判断
    // if (data_1.can_visit_commission_duty == 1 && ((data_2.is_show_commission == 1) || (data_2.is_show_commission == 2 && dataDetail.status != 1))) {
    //   commission_mod_show = true;
    // }

    // //订单里面的细节展示的权力判断
    // if ((data_2.is_show_commission == 1) || (data_2.is_show_commission == 2 && dataDetail.status != 1)) {
    //   commission = true
    // } 
    if (data_1.can_visit_commission_duty == 1) {
      commission_mod_show = true;
      commission = true;
    }
    this.setData({
      commission_mod_show,
      commission,
    })                      
    return Promise.resolve(res);
  })
}

function brokerageInit(){
  let dataDetail = this.dataDetail || {}; 
  let array = [];
  array = [dataDetail.total_income, dataDetail.month_income, dataDetail.week_income, dataDetail.account_balance];
  this.setData({
    array: array
  })
  this.brokerage = this.brokerage || this.selectComponent('#brokerage') || '';
  if (this.brokerage) {
    this.label = setTimeout(() => {
      this.brokerage.init(array);
      // clearTimeout(this.label);
    }, 500)
  }
}
function salesInit() {
  let dataDetail = this.dataDetail || {};
  let array = [];
  array = [dataDetail.total_sales, dataDetail.month_sales, dataDetail.week_sales, dataDetail.develop_money];
  this.setData({
    saleArray: array
  })
  this.sales = this.sales || this.selectComponent('#sales') || '';
  if (this.sales) {
    this.label = setTimeout(() => {
      this.sales.init(array);
      // clearTimeout(this.label);
    }, 500)
  }
}

function tipVisit(){
  return CheckUpdateTimer.updateTimer("rankTip");
}
 