import LM from "./manager/login-manager.js";
import { UserApi } from "./manager/http-manager.js";
import SMH from "./show-msg-helper.js";
import Conf from "../conf.js";
import LgMg from "./manager/log-manager.js"
import { ActionRoute, ActionName } from "./manager/log-map.js"
import WxGH from "./handle/wxGroupHandle.js";

export const FuncType = {
  CA: {
    type: "CA",
    action1: "NCATE_GOODS",
    action2: "NORMAL_CATEGORY"
  },
  VC: {
    type: "VC",
    action1: "VCATE_GOODS",
    action2: "VIRTUAL_CATEGORY"
  },
  CMPAGE: {
    type: "CMPAGE",
    action: "CUSTOM_PAGE"
  },
  TOJUMP: {
    type: "TOJUMP",
    action: "JUMP"
  },
  GOOD: {
    type: "GOOD",
    action: "GOODS"
  },
  GOODS: {
    type: "GOODS",
    action: "GOODS"
  },
  COUPON: {
    type: "COUPON",
    action: "CLICK_COUPON"
  },
  GROUPBUY: {
    type: "GROUPBUY",
    action: "MORE_COLLAGE_GOODS"
  },
  BRANDCODE: {
    type: "BRANDCODE",
    action: "BRAND_GOODS"
  },
  BRANDGOODS: {
    type: "BRANDGOODS",
    action: "BRAND_GOODS"
  },
  COLLAGEGOODS: {
    type: "COLLAGEGOODS",
    action: "COLLAGE_GOODS"
  },
  PRESELLGOODS: {
    type: "PRESELLGOODS",
    action: "PRESELL_GOODS"
  },
  APPLETJUMP: {
    type: "APPLETJUMP",
    action: "WX_MINIAPP"
  },
  STAFF: {
    type: "STAFF",
    action: ""
  },
  FILL_IDCARD: {
    type: "FILL_IDCARD",
    action: ""
  },
  STAFF_CENTER: {
    type: "STAFF_CENTER",
    action: ""
  },
  Lottery: {
    type: "Lottery",
    action: "YXHD"
  },
  SK: {
    type: "SK",
    action: "SECKILL"
  },
  SK_GROUP: {
    type: "SK_GROUP",
    action: "SK_GROUP"
  },
  LINKURL: {
    type: "LINKURL",
    action: "EXTERNAL_LINK"
  },
  CS_LINK: {
    type: "CS_LINK",
    action: "EXTERNAL_LINK"
  },
  VIDEO:{
    type: "VIDEO",
    action: "VIDEO"
  },
  PACKGOODS:{
    type:"PACKGOODS",
    action:"PACKGOODS_GOODS"
  },
  7: {
    type: "7",
    action1: "SECKILL_GOODS",
    action2: "MORE_SECKILL_GOODS"
  },
  8: {
    type: "8",
    action1: "COLLAGE_GOODS",
    action2: "MORE_COLLAGE_GOODS"
  },
  SKGROUP:{
    type:"SKGROUP",
    action1:"SK_HELP_GOODS",
    action2: "SK_HELP_AD"
  },
  9: {
    type: "9",
    action1: "SECKILL_HELP_GOODS",
    action2: "MORE_SECKILL_HELP_GOODS"
  },
  10: {
    type: "10",
    action1: "PRE_SALE_GOODS",
    action2: "MORE_PRE_SALE_GOODS"
  },
  11: {
    type: "11",
    action1: "POINT_GOODS",
    action2: "MORE_POINT_GOODS"
  },
  12: {
    type: "12",
    action1: "POINT_GOODS",
    action2: "MORE_POINT_GOODS"
  },
  14: {
    type: "14",
    action1: "PACKAGE_LIST",
    action2: "MORE_PACKAGE_LIST"
  },
  POINTGOODS: {
    type: "POINTGOODS",
    action: "SECKILL"
  },
};




function PageJump(obj) {
  obj = initObj(obj);
  console.log("obj",obj);
  let url = "",navType = "NAVIGATETO";
  let page = getCurrentPages().pop();
  let type = obj.func_type ? obj.func_type + "" : obj.module_type ? obj.module_type + "" : "";
  let actionParams = "" , action = "";
  switch (type) {
    case FuncType.CA.type:
      if(obj.goods_id){
        action = "action1"
        actionParams = 'related_id=' + obj.related_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/goods/goods_info?goods_id=' + obj.goods_id + '&color_id=' + (obj.color_id || "" )
      }else{
        action = "action2"
        actionParams = 'related_id=' + obj.related_id;
        url = '/pages/micro_mall/category/category?func_type=' + obj.func_type + '&related_id=' + obj.related_id
      }
      break;
    case FuncType.VC.type:
      if (obj.goods_id) {
        action = "action1"
        actionParams = 'related_id=' + obj.related_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/goods/goods_info?goods_id=' + obj.goods_id + '&color_id=' + (obj.color_id || "")
      } else {
        action = "action2"
        actionParams = 'related_id=' + obj.related_id;
        url = '/pages/micro_mall/category/category?func_type=' + obj.func_type + '&related_id=' + obj.related_id
      }
      break;
    case FuncType["7"].type:
      //秒杀
      if (obj.issue_id && obj.goods_id) {
        action = "action1"
        actionParams = 'issued_id=' + obj.issue_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/goods/goods_info?' + actionParams
      } else {
        action = "action2"
        actionParams = "issue_id=" + obj.activity_id;
        url = '/pages/micro_mall/activity/goods_seckill?issue_id=' + obj.activity_id
      }
      break;
    case FuncType["8"].type:
      //拼团
      if (obj.activity_id && obj.activity_id != '0') {
        action = "action1";
        actionParams = 'activity_id=' + obj.activity_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/collageGroup/activity_goods_detail?' + actionParams;
      } else {
        action = "action2";
        url = '/pages/micro_mall/collageGroup/activity_list'
      }
      break;
    case FuncType["9"].type:
      //助力秒杀
      if (obj.goods_id) {
        action = "action1"
        actionParams = 'activityId=' + obj.activity_id + '&goodsId=' + obj.goods_id + '&groupId=' + obj.group_id;
        url = '/pages/micro_mall/sk/goods-info-sk/goods-info-sk?' + actionParams
      } else {
        action = "action2"
        actionParams = 'activityId=' + obj.activity_id + '&groupId=' + obj.group_id;
        url = '/pages/micro_mall/sk/activity-sk/activity-sk?' + actionParams
      }
      break;
    case FuncType["10"].type:
      //预售广告模块
      if (obj.activity_id) {
        action = "action1"
        actionParams = 'activity_id=' + obj.activity_id;
        url = '/pages/micro_mall/plugins/presale/presale_activity_detail?' + actionParams
      } else {
        action = "action2"
        actionParams = "";
        url = '/pages/micro_mall/plugins/presale/presale_activity_list'
      }
      break;
    case FuncType["11"].type:
      //积分广告模块
      if (obj.goods_id) {
        action = "action1"
        actionParams = 'goodsId=' + obj.goods_id + '&mkGoodsId=' + obj.mk_goods_id;
        url = '/pages/micro_mall/point/point_goods_detail/point_goods_detail?' + actionParams
      } else {
        action = "action2"
        actionParams = 'type=goods';
        url = '/pages/micro_mall/point/point_goods_list/point_goods_list?' + actionParams
      }
      break;
    case FuncType["12"].type:
      //积分广告模块
      if (obj.activity_id) {
        action = "action1"
        actionParams = 'activityId=' + obj.activity_id;
        url = '/pages/micro_mall/bargain/goods/goods_detail?' + actionParams
      } else {
        action = "action2"
        actionParams = '';
        url = '/pages/micro_mall/bargain/index/bargain_index' + actionParams
      }
      break;
    case FuncType["14"].type:
      //积分广告模块
      if (obj.activity_id) {
        action = "action1"
        actionParams = 'package_id=' + obj.activity_id;
        url = '/pages/micro_mall/goods_collocation/goods_collocation?' + actionParams
      } else {
        action = "action2"
        actionParams = '';
        url = '/pages/micro_mall/goods_collocation/act_list/act_list' + actionParams
      }
      break;
    case FuncType.SKGROUP.type:
      //助力秒杀
      if (obj.goods_id) {
        action = "action1"
        actionParams = 'activityId=' + obj.activity_id + '&goodsId=' + obj.goods_id + '&groupId=' + obj.group_id;
        url = '/pages/micro_mall/sk/goods-info-sk/goods-info-sk?' + actionParams
      } else {
        action = "action2"
        actionParams = 'activityId=' + obj.activity_id + '&groupId=' + obj.group_id;
        url = '/pages/micro_mall/sk/activity-sk/activity-sk?' + actionParams
      }
      break;
    case FuncType.CMPAGE.type:
      actionParams = "page_id=" + obj.related_id;
      url = '/pages/micro_mall/custom_page/custom_page?' + actionParams
      break;
    case FuncType.TOJUMP.type:
      if (obj.related_id == '1') {
        actionParams = "key_params2=QDY";
        url = '/pages/micro_mall/sign/app/app_sign'
      }else if (obj.related_id == '3') {
        actionParams = "key_params2=HYZY";
        url = '/pages/micro_mall/user/user'
        navType = "SWITCHTAB";
      } else if (obj.related_id == '4') {
        actionParams = "key_params2=DPDH";
        url = '/pages/micro_mall/stores/store_nav'
      } else if (obj.related_id == '6') {
        url = '/pages/micro_mall/prepaid/erp/prepaid_card_erp'
      } else if (obj.related_id == '8') {
        url = '/pages/micro_mall/category/category?public_praise=true'
      } else if (obj.related_id == '9') {
        actionParams = "key_params2=JFDH";
        url = '/pages/micro_mall/point/point_goods_list/point_goods_list?type=goods'
      }
      else if (obj.related_id == '11') {
        actionParams = "key_params2=COLLAGE_ACT_LIST";
        url = '/pages/micro_mall/collageGroup/activity_list'
      }
      else if (obj.related_id == '12') {
        actionParams = "key_params2=PRESALE_ACT_LIST";
        url = '/pages/micro_mall/plugins/presale/presale_activity_list'
      }
      else if (obj.related_id == '14') {
        actionParams = "key_params2=BUY_BONUS_ACT_LIST";
        url = '/pages/micro_mall/buyBonus/getBonusActivityList'
      }
      else if (obj.related_id == '15') {
        actionParams = "key_params2=FX_PAGE&page_id=" + obj.page_id;
        url = `/pages/micro_mall/custom_page/custom_page?page_id=${obj.page_id}`
      } else if (obj.related_id == '16') {
        actionParams = "key_params2=QDY";
        url = '/pages/micro_mall/sign/app/app_sign'
      } else if (obj.related_id == '17') {
        actionParams = "key_params2=BARGAIN_ACT_LIST";
        url = '/pages/micro_mall/bargain/index/bargain_index'
      } else if (obj.related_id == '18') {
        actionParams = "key_params2=CZK1&type=recharge";
        url = '/pages/micro_mall/prepaid/erp/prepaid_card_erp_recharge?type=recharge'
      } else if (obj.related_id == '19') {
        actionParams = "key_params2=memberInterests";
        url = '/pages/micro_mall/articles/agreet/agreet?type=USER_RIGHT'
      }
      break;
    case FuncType.GROUPBUY.type:
      url = "/pages/micro_mall/collage/activity_list/activity_list?periodId=" + obj.cateId
      break;
    case FuncType.GOOD.type:
      actionParams = "goods_id=" + (obj.related_id || obj.goods_id) + "&color_id=" + ( obj.color_id || "" );
      url = '/pages/micro_mall/goods/goods_info?goods_id=' + (obj.related_id || obj.goods_id || 0) + '&color_id=' + ( obj.color_id || "" )
      break;
    case FuncType.GOODS.type:
      actionParams = "goods_id=" + (obj.related_id || obj.goods_id) + "&color_id=" + (obj.color_id || "");
      url = '/pages/micro_mall/goods/goods_info?goods_id=' + (obj.related_id || obj.goods_id || 0) + '&color_id=' + (obj.color_id || "" )
      break;
    case FuncType.VIDEO.type:
      actionParams = "key_params2=" + obj.type + "&videoId=" + obj.related_id;
      url = "";
      break;
    case FuncType.PACKGOODS.type:
      actionParams = 'package_id=' + obj.related_id;
      url = '/pages/micro_mall/goods_collocation/goods_collocation?' + actionParams
      break;
    case FuncType.COUPON.type:
      url = "";
      if (!obj.related_id) return;
      actionParams = "bonus_type_id=" + obj.related_id;
      postUserReceiveBonus.call(this,obj);
      break;
    case FuncType.BRANDGOODS.type:
      if(obj.goods_id){
        action = "action1";
        actionParams = 'brand_ids=' + obj.related_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/goods/goods_info?goods_id=' + obj.goods_id + '&color_id=' + (obj.color_id || "")
      }else{
        action = "action2";
        actionParams = 'brand_ids=' + obj.related_id;
        url = '/pages/micro_mall/category/category?func_type=SE&brand_ids=' + obj.related_id;
      }
      break;
    case FuncType.BRANDCODE.type:
      if (obj.goods_id) {
        action = "action1";
        actionParams = 'brand_ids=' + obj.related_id + '&goods_id=' + obj.goods_id;
        url = '/pages/micro_mall/goods/goods_info?goods_id=' + obj.goods_id + '&color_id=' + (obj.color_id || "")
      } else {
        action = "action2";
        actionParams = 'brand_ids=' + obj.related_id;
        url = '/pages/micro_mall/category/category?func_type=SE&brand_ids=' + obj.related_id;
      }
      break;
    case FuncType.COLLAGEGOODS.type:
      actionParams = 'activity_id=' + obj.related_id + '&goods_id=' + (obj.goods_id || obj.extent_id || 0);
      url = '/pages/micro_mall/collageGroup/activity_goods_detail?' + actionParams
      break;
    case FuncType.PRESELLGOODS.type:
      actionParams = 'activity_id=' + obj.related_id + '&goods_id=' + (obj.goods_id || obj.extent_id || 0);
      url = '/pages/micro_mall/plugins/presale/presale_activity_detail?' + actionParams
      break;
    case FuncType.STAFF.type:
      url = `/pages/micro_mall/distribution_center/apply_for_staff/fill_information/fill_information?order_amount=${obj.order_amount}&dure_agreement=${obj.dure_agreement}&free_num_day=${obj.free_num_day}&page_id=${obj.page_id}&phone=${obj.phone}&userName=${obj.userName}&cName=${obj.cName}`
      obj.navType && (navType = obj.navType)
      break;
    case FuncType.FILL_IDCARD.type:
      if(obj.fromRoute == 'brokerage'){
        url = `/pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/identity_fill/identity_fill?balance=${obj.balance || 0}&fromRoute=${obj.fromRoute}`
      }else if(obj.fromRoute == 'staff'){
        url = `/pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/identity_fill/identity_fill?order_amount=${obj.order_amount}&dure_agreement=${obj.dure_agreement}&free_num_day=${obj.free_num_day}&page_id=${obj.page_id}&phone=${obj.phone}&userName=${obj.userName}&fromRoute=${obj.fromRoute}`
      }else{
        url = `/pages/micro_mall/distribution_center/distribution_brokerage/brokerage_content/identity_fill/identity_fill?fromRoute=${obj.fromRoute}`
      }
      break;
    case FuncType.STAFF_CENTER.type:
      url = `/pages/micro_mall/distribution_center/distribution_center`
      break;
    case FuncType.Lottery.type:
      actionParams = `activityId=${obj.related_id}`
      url = `/pages/micro_mall/lottery/lottery?` + actionParams
      break;
    case FuncType.APPLETJUMP.type:
      let appId = obj.appId || 0;
      let path = obj.applet_path;
      actionParams = "appId=" + appId + "&pagePath=" + path;
      wx.navigateToMiniProgram({
        appId: appId,
        path: path,
        fail(res) {
          console.log('fail', res);
          if (res.errMsg.indexOf('cancel') == -1) {
            SMH.showToast({
              title: '跳转失败'
            })
          }
        }
      })
      break;
    case FuncType.SK.type:
      actionParams = 'issue_id=' + obj.related_id
      url = '/pages/micro_mall/activity/goods_seckill?' + actionParams
      break;
    case FuncType.CS_LINK.type:
    case FuncType.LINKURL.type:
      let link_url = obj.link_url || obj.related_id;
      actionParams = 'link_url=' + link_url
      if (link_url.indexOf("http") != -1) {
        url = '/pages/micro_mall/web/webForSF/SF?link_url=' + encodeURIComponent(link_url)
      } else {
        navType = "LINK"
        url = "/" + link_url
      } 
      break;
    case FuncType.SK_GROUP.type:
      actionParams = 'groupId=' + obj.related_id
      url = '/pages/micro_mall/sk/activity-sk/activity-sk?' + actionParams
      break;
    default:
      if (obj.goods_id && obj.goods_id != 0) {
        url = '/pages/micro_mall/goods/goods_info?goods_id=' + obj.goods_id + '&color_id=' + ( obj.color_id || "" )
      }
      break;
  }
  //统一跳转
  if(url){
    if(obj.tag && navType != "SWITCHTAB"){//统一加上tag
      url = url.indexOf("?") == -1 ? url + "?tag=" + obj.tag : url + "&tag=" + obj.tag
    }
    if(navType == "SWITCHTAB"){
      wx.switchTab({
        url: url
      })
    }else if(navType == "LINK"){
      wx.switchTab({
        url: url,
        fail(){
          wx.navigateTo({
            url: url
          })
        }
      })
    }else if(navType == 'redirect'){
      wx.redirectTo({
        url: url
      })
    }else{
      wx.navigateTo({
        url: url
      })
    }
    
  }
  addActionLogHandle.call(this, obj, page, action, actionParams,type);
}


function initObj(obj) {
  for (let i in obj) {
    if (!obj[i] || typeof (obj[i]) == "undefined" || obj[i] == "undefined") {
      if (i == "func_type"){
        obj[i] = "GOOD";
        continue;
      }
      let str = i.toLocaleUpperCase();
      obj[i] = str.indexOf("ID") != -1 ? 0 : "";
    } else {
      continue;
    }
  }
  return obj;
}


function getJsonByStr(actionParams, key = "&") {
  if (!actionParams) return {};
  let result = {};
  let params = actionParams.split(key);
  for (let i = 0; i < params.length; i++) {
    let param = params[i];
    let itemArr = param.split("=");
    result[itemArr[0]] = itemArr[1] || ""
  }
  return result;
}


function addActionLogHandle(obj, page, action, actionParams,type){
  let name = obj.name && ActionName[obj.name];
  let route = page.route;
  if (route[0] == "/") { route = route.substr(1) }
  route = page.pageType ? route + '?pageType=' + page.pageType : route;
  let position = (ActionRoute[route] && ActionRoute[route].position) || ""
  let params = {};
  if (FuncType[type]){
    if (action && FuncType[type][action]){
      params["key_params1"] = FuncType[type][action];
    }else{
      params["key_params1"] = FuncType[type].action || "";
    }
    params["key_params1"] = FuncType[type][action];
  }else{
    params["key_params1"] = "";
  }
  params = {
    ...params,
    ...getJsonByStr.call(this, actionParams)
  }
  LgMg.addActionLog(name, position, params, obj.tag);
}

function postUserReceiveBonus(obj = {}){
  UserApi.postUserReceiveBonus({
    data: {
      bonus_type_id: obj.related_id,
      pageId: obj.page_id || 0,
      wxGroupId: WxGH.groupId || ""
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    let msg = "";
    if (e.code == 1) {
      msg = "领取成功，可到个人中心查看或直接下单用券";
    } else {
      msg = e.msg;
    }
    SMH.showToast({
      title: msg,
      duration:3000
    });
  });
}




export default PageJump;


