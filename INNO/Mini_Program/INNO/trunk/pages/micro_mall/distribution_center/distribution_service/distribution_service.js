const app = getApp();
import CheckUpdateTimer from "../../../../common/manager/check-update-timer";

Component(app.BTAB({
  properties: {
    user: {
      type: String,
      value: ''
    },
    service_mod: {
      type: Object,
      value: {}
    },
    page_id: {
      type: String,
      value: 0
    }
  },
  data: {
  },
  ready() {
    let icon_url = this.data.brand_info.icon_url;
    let staff_fans = icon_url + "micro_mall/staff/staff_fans.png";
    let staff_hot_goods = icon_url + "micro_mall/staff/hot_goods.png";
    let staff_hot_activity = icon_url + "micro_mall/staff/hot_activity.png";
    let green_hands = icon_url + "micro_mall/staff/green_hands.png";
    let staff_share = icon_url + "micro_mall/staff/invitate_icon.png";
    let guest_follows = icon_url + "micro_mall/staff/guest_follows.png";
    let dataWeb = icon_url + "micro_mall/staff/dataWeb.png";
    let storesWeb = icon_url + "micro_mall/staff/storesWeb.png";
    let rank = icon_url + "micro_mall/staff/rank.png";
    let sCouponIcon = icon_url + "micro_mall/staff/s_coupon_icon.png"
    let staff_myShare = this.data.brand_info.default_icon_url + "staff_share.png";

    this.setData({
      staff_fans: staff_fans,
      staff_hot_goods: staff_hot_goods,
      staff_hot_activity: staff_hot_activity,
      green_hands: green_hands,
      user: this.properties.user || '',
      staff_share: staff_share,
      guest_follows: guest_follows,
      dataWeb,
      storesWeb,
      rank,
      sCouponIcon,
      staff_myShare
    });
  },
  methods: {
    jump(e) {
      let dataset = e.currentTarget.dataset || {};
      let url = dataset.url || '';
      let data = dataset.data||'';
      let type = dataset.type||'';
      if (url) {
        if (url == "share") {
          getStaffInfo.call(this).then(page_id => {
            wx.navigateTo({
              url: `/pages/micro_mall/custom_page/custom_page?page_id=${page_id}`,
            })
          })
        } else {
          if (data){
            if(type=='web'){
              data = '?link_url=' + encodeURIComponent(data);
            }
            url = url + data;
          }
          console.log('jump',url)
          wx.navigateTo({
            url: url
          })
        }
      }
    },  
  },
  pageLifetimes:{
    show(){
      checkTips.call(this);
    }
  }
}))


// function loadPageId() {
//     return app.DistrApi.staffInfo({
//         params: {
//             "brandCode": app.Conf.BRAND_CODE
//         },
//         other: {
//             isShowLoad: false
//         }
//     }).then(res => {
//         console.log('res', res)
//         if (res.code == 1) {
//             const data = res.data || {};
//             let page_id = data.guide_page || 0 ;
//             this.setData({
//                 page_id: page_id
//             })
//         }
//     })
// }
//获取申请分销活动页面
function getStaffInfo() {
  return app.DistrApi.applyStaff({
    params: {
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      // this.staff_page_id = data.page_id || ""
      return Promise.resolve(data.page_id);
    }
    return Promise.reject(e);
  })
}


function checkTips(){
  return CheckUpdateTimer.checkTimer('staffRankTip').then(res=>{
    this.setData({
      showRankTip:true
    })
  }).catch(e=>{
    if(this.data.showRankTip){
      this.setData({
        showRankTip:false
      })
    }
  })
}