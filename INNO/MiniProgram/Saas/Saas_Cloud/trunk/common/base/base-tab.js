 
import Conf from "../../conf.js";
import SIH from "../helper/sys-infos-helper.js"; 
import baseHelper from "./base-helper.js";

const BaseTab = function(pageOptions){
    let po = pageOptions || {}, bpo = {};
    po.data = {
      ...(po.data || {}),
      customTabStyle:"",
      brand_info: Conf,
      brandStyle: Conf.style,
      isIphoneX: SIH.isIphoneX,
      main_bg_color:Conf.style.bg_color,
      main_font_color:Conf.style.font_color,
      defaultIcon:  Conf.default_icon_url,
      ipx_p_b_style:SIH.isIphoneX?"ipx_p_b":"",
      ipx_b_b_style:SIH.isIphoneX?"ipx_b_b":"",
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