import Conf from "../../conf.js";
import SIH from "../helper/sys-infos-helper.js";
import baseHelper from "./base-helper.js";
const BaseTab = function(pageOptions){
  let po = pageOptions || {};
  po.data = {
    ...(po.data || {}),
    brand_info: Conf,
    brandStyle: Conf.style,
    isIphoneX: SIH.isIphoneX
  }
  po.methods = {
    ...baseHelper,
    ...po.methods,
  }
  return {
    ...po,
  } 
}
export default BaseTab;