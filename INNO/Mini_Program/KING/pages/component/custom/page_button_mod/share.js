// pages/component/custom/page_button_mod/share.js
const app = getApp();
import PageJump from "../../../../helper/page-jump.js";
const PAGE_TYPE_INDEX = "CUSTOM_INDEX";
const PAGE_TYPE_CUSTOM = "CUSTOM_PAGE";
const PAGE_TYPE_INVITE = "STAFF_INVITE";
Component(app.BTAB({
  properties: {
    isLogin:{
      value:false,
      type:Boolean
    },
    url_value:{
      value:'',
      type:String
    },
    page_id_value:{
      value: '',
      type: String
    },
    is_home_page:{
      value: false,
      type: Boolean
    },
    customTab: {
      type: Boolean,
      value: false
    },
    setShare:{
      type: Boolean,
      value: true
    }
  },
  data: {
    staffConf: app.Conf.staffConf || {},
  },
  methods: {
    getShare() {
      let staffConf = this.data.staffConf || {};
      // if (this.data.is_home_page && this.data.isStaff) {  //主页 && 分销员
      //   // if (staffConf.service.isOpen == 1 && (staffConf.service.hotAct == 1 || staffConf.service.hotGoods == 1)){}
      //   this.choose = this.choose || this.selectComponent("#choose");
      //   this.choose.show();
      // } else {
      //   //分享海报
      //   this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      //   this.shareModule.checkIfStaffDstb(1);
      // }
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      this.shareModule.checkIfStaffDstb(1);
    },
    chooseType(e){
      console.log(e,'chooseType');
      let detail = e.detail||{};
      this.choose.dismiss();
      setTimeout(()=>{
        if (detail.shareId == 1) {
          this.shareModule = this.shareModule || this.selectComponent("#shareModule");
          this.shareModule.checkIfStaffDstb(1);
        } else if (detail.shareId == 2) {
          wx.navigateTo({
            url: '/pages/micro_mall/distribution_center/activity/activity',
          })
        }
      },100)
    
    },
    chooseShareType(data) {
      let detail = data.detail;
      if(detail.shareId == 6){
        wx.navigateTo({
          url: '/pages/micro_mall/distribution_center/activity/activity',
        })
        return
      }
      let options = this.options;
      let page = getCurrentPages().pop();
      let path = page.route||"";
      let cur_type_custom = this.cur_type ? this.cur_type : PAGE_TYPE_CUSTOM;
      let cur_type_index = this.cur_type ? this.cur_type : PAGE_TYPE_INDEX;
      let opKind = app.OpKind[cur_type_custom] || app.OpKind.NORMAL;
      let shareType = app.ShareType[cur_type_custom] || app.ShareType.NORMAL;
      if (path =="pages/micro_mall/index/index"){
        opKind = app.OpKind[cur_type_index] || app.OpKind.NORMAL;
        shareType = app.ShareType[cur_type_index] || app.ShareType.NORMAL;
      }
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      let allData = {
        info:{
          imgUrl: this.data.url_value || '',
          extend_id: this.data.page_id_value, 
          opKind: opKind,
        },
        scene: {
          "shareType": shareType,
          "page_id": this.data.page_id_value,
          'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
        },
        draw:{
          template:"custom"
        },
      }
      this.staffInfo = detail.staffInfo
      this.setData({
        allData: allData
      })
      this.shareImg.show();
    },
    checkIfStaffDstbCallBack(data) {
      let detail = data.detail;
      this.staffInfo = detail.staffInfo
    },
    staffLogin(e) {
      this.loginCallback(e);
    },

    loginCallback(e) {
      console.log('绑定回调', e);
      let dataset = {};
      dataset.func_type = "STAFF";
      dataset.order_amount = this.order_amount || 0;
      dataset.free_num_day = this.free_num_day || 0;
      dataset.dure_agreement = this.dure_agreement;
      dataset.page_id = this.page_id;
      if (!this.userName || !this.phone){
        getUserInfoEvent.call(this).then(e=>{
          dataset.phone = this.phone;
          dataset.userName = this.userName;
          PageJump(dataset);
        })
        return;
      }
      dataset.phone = this.phone;
      dataset.userName = this.userName;
      PageJump(dataset);
    },

    onShowFn(){ 
      this.page = getCurrentPages().pop();
      getStaffInfo.call(this);
      staffCheck.call(this, staffCheck);
    }, 
  },
  pageLifetimes: { 
    hide() { 
      if (this.staffInfoId) {
        app.EB.unListen('staffInfoChange', this.staffInfoId);
      }
    }
  }
}))



function staffCheck(callback) {
  return app.LM.checkIfStaffDstbEvent().then(res => {
    if ((typeof (res) == 'object' && Object.keys(res).length <= 0) || !res) {
      console.log('需要staff监听', res);
      return staffListen.call(this, callback);
    } else {
      console.log('不监听', res)
      this.setData({
        isStaffUser: res.isStaffDstbData || false,
        isStaff: res.isStaffDstbData || false,
      })
      // console.log(this.data.isStaff, this.data.showButton, '======show');
      return Promise.resolve(res);
    }
  })
}

function staffListen(callback) {
  let that = this;
  if (this.staffInfoId) {
    return
  }
  this.staffInfoId = app.EB.listen('staffInfoChange', () => {
      console.log('staff监听回调')
    if (this.staffInfoId) {
      app.EB.unListen('staffInfoChange', this.staffInfoId);
      delete this.staffInfoId
    }
    typeof (callback) == "function" && callback.call(that);
  });
}


//分销员申请页面匹配
function getStaffInfo() {
  let showButton = 1;
  staffInfoBefore.call(this).then(res => {
    if (res.code == 1) {
      const data = res.data || {};
      if (data.page_id && (this.data.page_id_value == data.page_id)) { //id相等
        showButton = 2;
        if(!this.page){
          this.page = getCurrentPages().pop();
        }
        this.page.pageType = "isStaffPage";
        this.cur_type = PAGE_TYPE_INVITE;
        this.triggerEvent('pageType', { type: PAGE_TYPE_INVITE }, {
          bubbles: true,
          composed: true
        });
        return staffCheck.call(this, staffCheck).then(res => {
          if (!this.data.isStaffUser && (data.is_enabled != 0)) {
            this.order_amount = data.order_amount || 0;
            this.dure_agreement = data.dure_agreement || '';
            this.dure_agreement = encodeURIComponent(this.dure_agreement)
            this.free_num_day = data.free_num_day || 0;
            // this.is_enabled = data.is_enabled || 0;
            this.page_id = data.page_id || 0;
            getUserInfoEvent.call(this);
          } else if (this.data.isStaffUser) {
            this.setData({
              isStaffUser: true,
            })
          } 
          this.setData({
            showButton: showButton,
            isLogin: app.LM.isLogin,
            free_num_day: data.free_num_day || 0,
            endActivity: !data.is_enabled ? true : false,
          })
        })
        return Promise.resolve();
      }
    }
    this.setData({
      showButton: showButton
    })
  }).catch(() => {
    this.setData({
      showButton: showButton
    })
  })
}

function staffInfoBefore() {
  if (this.data.is_home_page){  //主页不匹配
    return Promise.reject();
  }
  return app.DistrApi.applyStaff({
    params: {
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  })
}


function getUserInfoEvent() {
  if (!app.LM.isLogin) return;
  return app.UserApi.getUserSimpleInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      console.log('用户信息', e);
      let data = e.data;
      this.userName = data.realName || '';
      this.phone = data.mobilePhone || '';
      return Promise.resolve(this.phone);
    }
    return Promise.reject();
  })
}