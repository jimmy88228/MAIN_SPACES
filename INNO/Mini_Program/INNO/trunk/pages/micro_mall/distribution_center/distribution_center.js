const app = getApp();
import CheckUpdateTimer from "../../../common/helper/check-update-timer";
Page(app.BP({
  data: {
    dataDetail: {},
    page_id: 0,
    sales_tabs:[],
    brok_tabs:[],
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
      checkShow.call(this).then(res => {
        this.nextTick().then(()=>{
          brokerageInit.call(this,res[0]);
          salesInit.call(this,res[1]);
        })
      });
    });
  },
  onHide: function() {
    // end.call(this);
  },
  onUnload() {
    // end.call(this);
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
        dataDetail: dataDetail,
        showData:true,
      })
      return Promise.resolve(res);
    }
    return Promise.reject();
  })
}

function end() {
  clearTimeout(this.label_b)
  clearTimeout(this.label_s)
  if (this.brokerage){
    this.brokerage && this.brokerage.end();
  }
  if (this.sales) {
    this.sales && this.sales.end();
  }
  let _timer = setTimeout(() => {
    clearTimeout(_timer);
    this.setData({
      brokerOnhide: this.brokerOnhide,
      salesOnhide: this.salesOnhide
    })
  }, 200)
}


function moduleInit() {
  let staffConf = app.Conf.staffConf || {};
  let service_mod_show = false;
  this.commission_mod = staffConf.commission || {};
  this.service_mod = staffConf.service || {};
  if (this.service_mod.isOpen != '0') { //服务
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
  return app.RunApi.go('DistributionApi', 'getMyStaffDstbInfo', params, extra).then(res => {
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

function checkShow() {
  let p = new Promise((rs, rj) => {
    if(!this.pr_all){
      let p1 = getMyStaffDstbInfo.call(this);
      let p2 = checkConfigFn.call(this);
      let arr = [p1,p2];
      return Promise.all(arr).then(res => {
        this.pr_all = res;
        return rs(res)
      })
    }else{
      return rs(this.pr_all)
    }
  })

  return p.then(res => {
    console.log('All', res);
    // let dataDetail = this.data.dataDetail || {};
    // let commission_mod = this.commission_mod;
    // let service_mod = this.service_mod;
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
    let dt = this.data.dataDetail||{};
    let broker_val = [];
    let brok_tabs = []; 
    let sales_val = [dt.total_sales, dt.month_sales, dt.week_sales,dt.develop_money];
    let sales_tabs = [{nm:"累计销售"},{nm:"月销售"},{nm:"周销售"},{nm:"邀请奖励",key:"invite"}];
    this.salesOnhide = ['0.00','0.00','0.00','0.00'];
    if(data_2.is_new_second_level_cash_back == 1){
      sales_val.splice(1,0,dt.self_sales);
      sales_tabs.splice(1,0,{nm:"自购销售"})
      this.salesOnhide.splice(1,0,'0.00');
    }
    if (data_1.can_visit_commission_duty == 1) {
      commission = true;
      if(this.commission_mod && this.commission_mod.isOpen != '0'){
        commission_mod_show = true;
        broker_val = [dt.total_income, dt.month_income, dt.week_income, dt.account_balance];
        brok_tabs = [{nm:"累计收益"},{nm:"本月收益"},{nm:"本周收益"},{nm:"当前收益",key:"cash"}];
        this.brokerOnhide = ['0.00','0.00','0.00','0.00'];
      }
    }
    this.setData({
      commission_mod_show,
      commission,
      sales_tabs,
      brok_tabs,
      brokerOnhide:this.brokerOnhide,
      salesOnhide:this.salesOnhide,
    })           
    return Promise.resolve([broker_val,sales_val]);
  })
}

function brokerageInit(val){
  if(!val || val.length<=0)return;
  this.brokerage = this.brokerage || this.selectComponent('#brokerage') || '';
  if (this.brokerage) {
    !this.init_T_B && (this.init_T_B = 1400) || (this.init_T_B != 400 && (this.init_T_B = 400));
    this.label_b = setTimeout(() => {
      this.brokerage.init(val);
      clearTimeout(this.label_b);
    }, this.init_T_B)
  }
}
function salesInit(val) {
  if(!val || val.length<=0)return;
  !this.init_T_S && (this.init_T_S = 1400) || (this.init_T_S != 400 && (this.init_T_S = 400));
  this.sales = this.sales || this.selectComponent('#sales') || '';
  if (this.sales) {
    this.label_s = setTimeout(() => {
      this.sales.init(val);
      clearTimeout(this.label_s);
    }, this.init_T_S)
  }
}

function tipVisit(){
  return CheckUpdateTimer.updateTimer("rankTip");
}
 