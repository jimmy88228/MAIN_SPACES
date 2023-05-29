import Conf from "../../conf.js";
import SIH from "../helper/sys-infos-helper.js";
import baseHelper from "./base-helper.js";
const BaseTab = function(pageOptions){
  let po = pageOptions || {}, bpo = {};
  po.data = {
    ...(po.data || {}),
    brand_info: Conf,
    brandStyle: Conf.style,
    isIphoneX: SIH.isIphoneX,
    microType:Conf.microType || "pageTab",
    main_bg_color:Conf.style.bg_color,
    main_font_color:Conf.style.font_color,
    customTabStyle:"",
    ipx_p_b_style:SIH.isIphoneX?"ipx_p_b":"",
    ipx_b_b_style:SIH.isIphoneX?"ipx_b_b":"",
    defaultAvatar: "/images/micro_mall/cn/avatar.jpg",
    isShowModifyPrice: Conf.BRAND_CODE == 'ISE' || Conf.BRAND_CODE == 'EMZ' || Conf.BRAND_CODE == 'YNTY' || Conf.BRAND_CODE == 'INNOVATION' //代客下单调整价格(写死品牌)
  }
  po.methods = {
    ...baseHelper,
    ...po.methods,
    ...bpo
  }
  return {
    ...po,
  } 
}
export default BaseTab;