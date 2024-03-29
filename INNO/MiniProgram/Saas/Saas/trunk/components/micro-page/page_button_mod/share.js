// components/custom/page_button_mod/share.js
const app = getApp();
import PageJump from "../../../common/helper/page-jump.js";
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
  },
  data: {
    staffConf: app.Conf.staffConf || {},
  },
  methods: {
    getShare() {
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      this.shareModule.checkIfStaffDstb(1);
    },
    chooseShareType(data) {
      let detail = data.detail;
      if(detail.shareId == 6 || detail.shareId == 7){
        wx.navigateTo({
          url: `/pages/micro_mall/distribution_center/activity/activity?type=${detail.shareId == 6?'activity':'goods'}`,
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
      dataset.func_type = this.needVerify == 1 ? "FILL_IDCARD" : "STAFF";
      dataset.order_amount = this.order_amount || 0;
      dataset.free_num_day = this.free_num_day || 0;
      dataset.dure_agreement = this.dure_agreement;
      dataset.page_id = this.page_id;
      dataset.fromRoute = "staff";
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
      checkNeedVerify.call(this);
      getStaffInfo.call(this);
      staffCheck.call(this, staffCheck);
    }, 
  },
  pageLifetimes: { }
}))



function staffCheck(callback) {
  return app.LM.checkIfStaffDstbEvent().then(res => {
    this.setData({
      isStaffUser: res.isStaffDstbData || false,
      isStaff: res.isStaffDstbData || false,
    })
    typeof (callback) == "function" && callback.call(this);
    return Promise.resolve(res);
  })
}


//分销员申请页面匹配
function getStaffInfo() {
  let showButton = 1;
  staffInfoBefore.call(this).then(res => {
    if (res.code == 1) {
      const data = res.data || {};
      if (data.page_id && (this.data.page_id_value == data.page_id)) { //id相等
        showButton = 2; //申请分销员页面 //已是分销员则显示邀请按钮，否则显示申请分销员按钮
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
    extraData: {
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
    extraData: {
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

function checkNeedVerify(){
  let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
  this.needVerify = storage.needVerify || 0;
}