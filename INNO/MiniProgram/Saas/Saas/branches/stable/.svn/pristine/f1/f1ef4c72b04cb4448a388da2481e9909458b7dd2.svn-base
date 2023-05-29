import PageJump from "../../../../common/helper/page-jump.js";
import LM from "../../../../common/manager/login-manager.js";
import SMH from "../../../../common/helper/show-msg-helper"
import Conf from "../../../../conf.js";
import { DistributionApi } from "../../../../common/manager/http-manager.js"
class userJumpManager {
  static getInstance() {
    if (!userJumpManager.instance) {
      userJumpManager.instance = new userJumpManager();
    }
    return userJumpManager.instance;
  }
  constructor() {
    this._linkMap = {
      'retailList': '/pages/micro_mall/order/order_list?order_type=store',
      'unpaid': '/pages/micro_mall/order/order_list?orderType=wait_to_pay',
      'deliver': '/pages/micro_mall/order/order_list?orderType=wait_to_shipping',
      'receive': '/pages/micro_mall/order/order_list?orderType=wait_to_receiving',
      'change': '/pages/micro_mall/order/order_list?orderType=order_exchange',
      'allOrder': '/pages/micro_mall/order/order_list?orderType=all',
      'nearbyShop': '/pages/micro_mall/stores/store_nav',
      'customer_service': '',
      'personal': '/pages/micro_mall/user_info/user_info',
      'user_card': '/pages/micro_mall/membership_card/membership_card',
      'publicNumber': '/pages/micro_mall/wx_service/follow_wx',
      // 'pointExchange':'/pages/micro_mall/store_mod/qr_code',
      'pointExchange':'',
      'myCollect': '/pages/micro_mall/collection/my_collection',
      'bonus_package': '/pages/micro_mall/buyBonus/getBonusActivityList',
      // 'history':'/pages/micro_mall/sk/activity-sk/activity-sk?groupId=4&activityId=5',
      'history':'/pages/micro_mall/footmark/my_footmark',
      'myAddress':'/pages/micro_mall/address/address_list?visit_type=check',
      'exchangeShop':'/pages/micro_mall/point/point_goods_list/point_goods_list',
      //我的资产
      'my_point': '/pages/micro_mall/integral/my_integral',
      'balance':'/pages/micro_mall/balance/my_balance',
      'coupon':'/pages/micro_mall/coupon/my_coupon',
      'prepay_card':'/pages/micro_mall/prepaid/erp/prepaid_card_erp',
      // 'prepay_card':'/pages/micro_mall/prepaid/user_prepaid_card',
      'recharge_card': '/pages/micro_mall/prepaid/prepaid_card_erp',
      "redpack": "/pages/micro_mall/red_packet/red_balance/red_balance",
      "prepaidcard": "/pages/micro_mall/prepaid/erp/prepaid_card_erp",
      'retailList':'/pages/micro_mall/order/order_list?order_type=store',
      'collageGroup':'/pages/micro_mall/collageGroup/my_collage',
      'distribution':'/pages/micro_mall/distribution_center/distribution_center',
      'presell':'/pages/micro_mall/plugins/presale/presale_order_list',
      'storeQRPay':'/pages/store_pay/pay_center/pay_center',
      'modify_pwd':'/pages/micro_mall/changeInfo/pw/password',
      'sign_gift':"/pages/micro_mall/sign/app/app_sign",
      'invitingFriends':"/pages/micro_mall/distribution_center/distribution_service/guest_follows/guest_follows",
      'share_code': ["/pages/micro_mall/store_mod/qr_code", "/pages/micro_mall/my_store_mod/qr_code"],
      "valet_order":"/pages/micro_mall/order/assist_guest",
      "bargain": "/pages/micro_mall/bargain/index/my_bargain",
      "my_present": "/pages/micro_mall/lottery/lottery_record/lottery_record",
      "paypal":"/pages/micro_mall/paypal/paypal",
      "staff_guide":"/pages/micro_mall/guide_point/guide_point?pageType=staffGuide",
      "return_exchange_agreement":"/pages/micro_mall/custom_page/custom_page?pageType=exchangeExplain&hideIndexHeader=true",
      "seckill":"/pages/micro_mall/sk/orders-sk/order-list",
      "memberInterests":"/pages/micro_mall/articles/agreet/agreet?type=USER_RIGHT",
      "electronic_invoice_setting":"/pages/micro_mall/invoice/invoice_list/list",
      "old_cs": "/pages/micro_mall/customer_service/contact_page?type=old_cs",
      "feedback": "/pages/micro_mall/web/webForSF/SF?type=m_h5&route=%2Fpages%2Fmy%2Fsetting%2Ffeedback-list",
      "kefu_h5": "/pages/micro_mall/web/webForSF/SF?type=h5_admin&route=%2Fpages%2Fapp%2Fcustomer-service-worker%2Findex",
      "invite_user": "/pages/micro_mall/inviteAward/inviteAward",
      "payMembers": "/pages/micro_mall/users_upgrade/grade_info/grade_info"
    }
  }
  get linkMap(){
    return this._linkMap || {};
  }
  jump(dataset, sysConf){
    console.log('jump',dataset,sysConf)
    dataset = dataset || {};
    sysConf = sysConf || {};
    console.log('dataset',dataset)
    let key = dataset.key;
    let type = dataset.type;
    let url = this.linkMap[key] || "";
    if (!LM.isLogin) return;
    if (key == 'distribution') {
        return LM.checkIfStaffDstbEvent(true).then(e => {
          if(!e || (e && !e.isStaffDstbData)){ 
            let pageId = e && e.pageId || 0;
            return DistributionApi.applyStaff({
              params: {
                  brandCode: Conf.BRAND_CODE,
              },
              other: {
                  isShowLoad: true
              }
            }).then(res=>{
              if (res.data && res.data.is_enabled!=0){
                pageId = pageId || res.data.page_id
                wx.navigateTo({
                    url: `/pages/micro_mall/custom_page/custom_page?page_id=${pageId}&isStaff=${e && e.isStaffDstbData||false}&phone=${this.phone}`,
                })
              }else{
                SMH.showToast({
                  title:'敬请期待...'
                })
              } 
            })
          }else{
            let name = dataset.name || ''; 
            url = url + `?name=${name || ''}`
            wx.navigateTo({
                url: url,
            })
            return Promise.reject();
          }
        })  
    } else if(key == 'invitingFriends'){
      url = url + '?type=' + type;
    } else if (key === 'thirdCs' && sysConf.third_cs_open){
      LM.getUserSimpleInfo(LM.userToken).then(userInfo=>{
        let uId = userInfo.uId || 0;
        url = "/pages/micro_mall/customer_service/contact_page?userId=" + uId;
        wx.navigateTo({
          url: url,
        })
      })
      return;
    } else if (key == "share_code"){
      let urlArr = this.linkMap[key] || [];
      if (type == "service"){
        url = urlArr[1] || "";
      }else{
        url = urlArr[0] || "";
      }
    } else if(key == "redpack"){
      wx.navigateTo({
        url: url + `?sum=${dataset.redpack_amount_sum || 0}&un_amount=${dataset.unusable_redpack_amount || 0}`,
      })
      return;
    } else if(key == "balance"){
      wx.navigateTo({
        url: url + `?balance=${dataset.account_balance}&title=${dataset.name}`,
      })
      return;
    }
    if(!url) return;
    //跳转
    wx.navigateTo({
      url: url,
    })
  }
  pageJump(params){
    PageJump(params);
  }
}

export default userJumpManager.getInstance();