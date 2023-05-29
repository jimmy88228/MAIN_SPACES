// // components/custom/page_button_mod/share.js
// const app = getApp();
// import PageJump from "../../../common/helper/page-jump.js";
// const PAGE_TYPE_INDEX = "CUSTOM_INDEX";
// const PAGE_TYPE_CUSTOM = "CUSTOM_PAGE";
// const PAGE_TYPE_INVITE = "STAFF_INVITE";
// Component(app.BTAB({
//   properties: {
//     isLogin:{
//       value:false,
//       type:Boolean
//     },
//     url_value:{
//       value:'',
//       type:String
//     },
//     page_id_value:{
//       value: '',
//       type: String
//     },
//     is_home_page:{
//       value: false,
//       type: Boolean
//     },
//     customTab: {
//       type: Boolean,
//       value: false
//     },
//   },
//   data: {
//     staffConf: app.Conf.staffConf || {},
//   },
//   methods: {
//     getShare() {
//       this.shareModule = this.shareModule || this.selectComponent("#shareModule");
//       this.shareModule.checkIfStaffDstb(1);
//     },
//     chooseShareType(data) {
//       let detail = data.detail;
//       if(detail.shareId == 6 || detail.shareId == 7){
//         wx.navigateTo({
//           url: `/pages/micro_mall/distribution_center/activity/activity?type=${detail.shareId == 6?'activity':'goods'}`,
//         })
//         return
//       }
//       let options = this.options;
//       let page = getCurrentPages().pop();
//       let path = page.route||"";
//       let cur_type_custom = this.cur_type ? this.cur_type : PAGE_TYPE_CUSTOM;
//       let cur_type_index = this.cur_type ? this.cur_type : PAGE_TYPE_INDEX;
//       let opKind = app.OpKind[cur_type_custom] || app.OpKind.NORMAL;
//       let shareType = app.ShareType[cur_type_custom] || app.ShareType.NORMAL;
//       if (path =="pages/micro_mall/index/index"){
//         opKind = app.OpKind[cur_type_index] || app.OpKind.NORMAL;
//         shareType = app.ShareType[cur_type_index] || app.ShareType.NORMAL;
//       }
//       this.shareImg = this.shareImg || this.selectComponent("#shareImg");
//       let allData = {
//         info:{
//           imgUrl: this.data.url_value || '',
//           extend_id: this.data.page_id_value, 
//           opKind: opKind,
//         },
//         scene: {
//           "shareType": shareType,
//           "page_id": this.data.page_id_value,
//           'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
//         },
//         draw:{
//           template:"custom"
//         },
//       }
//       this.staffInfo = detail.staffInfo
//       this.setData({
//         allData: allData
//       })
//       this.shareImg.show();
//     },
//     checkIfStaffDstbCallBack(data) {
//       let detail = data.detail;
//       this.staffInfo = detail.staffInfo
//     },
//     staffLogin(e) {
//       this.loginCallback(e);
//     },

//     loginCallback(e) {
//       console.log('绑定回调', e);
//       let dataset = {};
//       dataset.func_type = this.needVerify == 1 ? "FILL_IDCARD" : "STAFF";
//       dataset.order_amount = this.order_amount || 0;
//       dataset.free_num_day = this.free_num_day || 0;
//       dataset.dure_agreement = this.dure_agreement;
//       dataset.page_id = this.page_id;
//       dataset.fromRoute = "staff";
//       if (!this.userName || !this.phone){
//         getUserInfoEvent.call(this).then(e=>{
//           dataset.phone = this.phone;
//           dataset.userName = this.userName;
//           PageJump(dataset);
//         })
//         return;
//       }
//       dataset.phone = this.phone;
//       dataset.userName = this.userName;
//       PageJump(dataset);
//     }, 
//     onShowFn(){ 
//       this.page = getCurrentPages().pop();
//       checkNeedVerify.call(this);
//       getStaffInfo.call(this);
//       staffCheck.call(this, staffCheck);
//     }, 
//   },
//   pageLifetimes: { }
// }))



// function staffCheck(callback) {
//   return app.LM.checkIfStaffDstbEvent().then(res => {
//     this.setData({
//       isStaffUser: res.isStaffDstbData || false,
//       isStaff: res.isStaffDstbData || false,
//     })
//     typeof (callback) == "function" && callback.call(this);
//     return Promise.resolve(res);
//   })
// }


// //分销员申请页面匹配
// function getStaffInfo() {
//   let showButton = 1;
//   staffInfoBefore.call(this).then(res => {
//     if (res.code == 1) {
//       const data = res.data || {};
//       if (data.page_id && (this.data.page_id_value == data.page_id)) { //id相等
//         showButton = 2; //申请分销员页面 //已是分销员则显示邀请按钮，否则显示申请分销员按钮
//         if(!this.page){
//           this.page = getCurrentPages().pop();
//         }
//         this.page.pageType = "isStaffPage";
//         this.cur_type = PAGE_TYPE_INVITE;
//         this.triggerEvent('pageType', { type: PAGE_TYPE_INVITE }, {
//           bubbles: true,
//           composed: true
//         });
//         return staffCheck.call(this, staffCheck).then(res => {
//           if (!this.data.isStaffUser && (data.is_enabled != 0)) {
//             this.order_amount = data.order_amount || 0;
//             this.dure_agreement = data.dure_agreement || '';
//             this.dure_agreement = encodeURIComponent(this.dure_agreement)
//             this.free_num_day = data.free_num_day || 0;
//             // this.is_enabled = data.is_enabled || 0;
//             this.page_id = data.page_id || 0;
//             getUserInfoEvent.call(this);
//           } else if (this.data.isStaffUser) {
//             this.setData({
//               isStaffUser: true,
//             })
//           } 
//           this.setData({
//             showButton: showButton,
//             free_num_day: data.free_num_day || 0,
//             endActivity: !data.is_enabled ? true : false,
//           })
//         })
//       }
//     }
//     this.setData({
//       showButton: showButton
//     })
//   }).catch(() => {
//     this.setData({
//       showButton: showButton
//     })
//   })
// }

// function staffInfoBefore() {
//   if (this.data.is_home_page){  //主页不匹配
//     return Promise.reject();
//   }
//   return app.DistrApi.applyStaff({
//     params: {
//       brandCode: app.Conf.BRAND_CODE,
//     },
//     other: {
//       isShowLoad: true
//     }
//   })
// }


// function getUserInfoEvent() {
//   if (!app.LM.isLogin) return;
//   return app.UserApi.getUserSimpleInfo({
//     params: {
//       brandCode: app.Conf.BRAND_CODE,
//       userToken: app.LM.userToken
//     },
//     other: {
//       isShowLoad: true
//     }
//   }).then(e => {
//     if (e.code == "1") {
//       console.log('用户信息', e);
//       let data = e.data;
//       this.userName = data.realName || '';
//       this.phone = data.mobilePhone || '';
//       return Promise.resolve(this.phone);
//     }
//     return Promise.reject();
//   })
// }

// function checkNeedVerify(){
//   let storage = app.StorageH.get("SIMPLE_USER_INFO") || {};
//   this.needVerify = storage.needVerify || 0;
// }


// components/custom/page_button_mod/share.js
const app = getApp();
import PageJump from "../../../common/helper/page-jump.js";
const PAGE_TYPE_INDEX = "CUSTOM_INDEX";
const PAGE_TYPE_CUSTOM = "CUSTOM_PAGE";
const PAGE_TYPE_INVITE = "STAFF_INVITE";
const STORAGE_USER_INFOS_KEY = "USER_INFOS";
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
      if(detail.shareId == 6 || detail.shareId == 7){
        wx.navigateTo({
          url: `/pages/micro_mall/distribution_center/activity/activity?type=${detail.shareId == 6?'activity':'goods'}`,
        })
        return
      } else if (detail.shareId == 11){
        wx.navigateTo({
          url: `/pages/micro_mall/employee_center/activity/activity?type=activity`
        })
        return 
      } else if (detail.shareId == 12){
        wx.navigateTo({
          url: `/pages/micro_mall/employee_center/activity/activity?type=goods`
        })
        return 
      } else if(detail.shareId == 9){
          let staffInfo = app.LM.staffInfo;
          let dstbGuidePage = staffInfo.dstbGuidePage||"";
          dstbGuidePage && wx.navigateTo({
            url: '/pages/micro_mall/custom_page/custom_page?page_id=' + dstbGuidePage,
            fail:res=>{
              wx.switchTab({
                url: '/pages/micro_mall/custom_page/custom_page?page_id=' + dstbGuidePage,
              })
            }
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
      try{

        console.log('绑定回调', e);
        let dataset = {};
        dataset.func_type = this.needVerify == 1 ? "FILL_IDCARD" : "STAFF";
        dataset.order_amount = this.order_amount || 0;
        dataset.free_num_day = this.free_num_day || 0;
        dataset.dure_agreement = this.dure_agreement;
        dataset.page_id = this.page_id;
        dataset.fromRoute = "staff";
        console.log('进来1')
        if (!this.userName || !this.phone){
          console.log('进来2')
          getUserInfoEvent.call(this).then(e=>{
            console.log('进来3')
            dataset.phone = this.phone;
            dataset.userName = this.userName;
            PageJump(dataset);
          })
          return;
        }
        dataset.phone = this.phone;
        dataset.userName = this.userName;
        PageJump(dataset);
      }catch(e){
        console.log(e);
      }
    },

    onShowFn(){ 
      app.LM.loginAsync(false).finally(()=>{
        this.page = getCurrentPages().pop();
        checkNeedVerify.call(this);
        getStaffInfo.call(this);
      })
    }, 
  },
}))

function staffCheck() {
  return app.LM.checkIfStaffDstbEvent().then(res => {
    this.setData({
      isStaff: res.isStaffDstbData || false,
    })
  })
}

//分销员申请页面匹配
function getStaffInfo() {
  let showButton = 1;
  staffInfoBefore.call(this).then(res => {
    if (res.code == 1) {
      const data = res.data || {};
      console.log('id',this.data.page_id_value , data.cloup_shop_page_id)
      if (data.cloup_shop_page_id && (this.data.page_id_value == data.cloup_shop_page_id)) { //id相等
        showButton = 2; //当前为申请分销员页面 （已是分销员则显示邀请按钮，否则显示申请分销员按钮）
        !this.page && (this.page = getCurrentPages().slice(-1)[0]);
        this.page.pageType = "isStaffPage";
        this.cur_type = PAGE_TYPE_INVITE;
        this.triggerEvent('pageType', { type: PAGE_TYPE_INVITE }, {
          bubbles: true,
          composed: true
        });
        return staffCheck.call(this).then(() => { //检测是否已经为分销员
          if (!this.data.isStaff && (data.is_enabled != 0)) {
            this.order_amount = data.order_amount || 0;
            this.dure_agreement = data.dure_agreement || '';
            this.dure_agreement = encodeURIComponent(this.dure_agreement)
            this.free_num_day = data.free_num_day || 0;
            this.page_id = data.cloup_shop_page_id || 0;
            getUserInfoEvent.call(this);
          }
          this.setData({
            showButton: showButton,
            free_num_day: data.free_num_day || 0,
            endActivity: !data.is_enabled ? true : false,
            applyStaffDstb:data
          })
        })
      }else{
        staffCheck.call(this);
      }
    }
    this.setData({
      showButton: showButton
    })
  }).catch(() => {
    staffCheck.call(this);
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
      userToken: app.LM.userKey
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

function checkNeedVerify(){
  let storage = app.StorageH.get(STORAGE_USER_INFOS_KEY) || {};
  this.needVerify = storage.needVerify || 0;
}