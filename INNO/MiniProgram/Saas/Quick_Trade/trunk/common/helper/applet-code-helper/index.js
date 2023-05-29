import LM from "../../manager/login-manager/index"
import Conf from "../../../config/index"
import SMH from "../show-message-helper/index"
import StoreH from "../store-helper/index";
import { BarCodeApi, UserApi} from "../../manager/http-manager/index"
function appletCode(data) {
  /**
   * data = {
   *    goodsInfo:{
   *      opKind: //user_share_page(自定义页面)， 
   *              user_share_pin（拼团），
   *              user_share_pr（预售），
   *              staff_personal（店员分享）,
   *              new_user_share(普通我的二维码)，
   *              user_share(正常)
   *    },
   *    scene,
   *    path,
   *    createType,
   *    extend_id
   * }
   * 
  */
  let page = getCurrentPages().pop();
  let info = data.info || {};
  let path = info.path || page.route;
  let opKind = info.opKind || '';
  let scene = data.scene;//页面需要带上的参数
  console.log('进来生成二维码',opKind,data);
  if (opKind == 'STORE_STAFF' || opKind == 'NEW_USER_SHARE'){
    return getWxCodeForWap.call(this, data);
  }else{
    let storeInfo = StoreH.storeInfo || {}
    let storeStaff = LM.storeInfo || {};
    if(storeInfo.storeCode){
      scene.storeCode = storeInfo.storeCode
    }
    let staffCode = StoreH.lastShareInfo && StoreH.lastShareInfo.staffCode ? storeInfo.staffCode : storeStaff.staff_code||storeInfo.staffCode;
    if (staffCode){
      scene.staffCode = staffCode;
    }
    if(LM.shareCode){ //云店fromUser
      scene.fromUser = LM.shareCode
    }
    return BarCodeApi.getWxCode({
      data: {
        "userToken": LM.userKey,
        "brandCode": Conf.BRAND_CODE,
        "scene": JSON.stringify(scene || {}),
        "path": path,
        "width": "450",
        "createType": info.createType || 3,
        "opKind": info.opKind || "user_share",
        "isBackGround": 0,
        "is_White_Bg": info.is_White_Bg || 0,
        "extend_id": info.extend_id || "",
        "transPage": "", 
        // "appId": "wx657efe00b45e3a6a",
      }
    }).then(e => {
      if (e.code == "1") {
        return Promise.resolve(e.data);
      }
      return Promise.resolve('');
    }).catch((e)=>{
        return Promise.resolve('');
    })
 
  }
 }


function getWxCodeForWap(data={}) {   //公众号二维码
  /**
   * data = {
   *    storeId : 店铺ID
   *    reqId   : 店员ID 
   *    opKind  : STORE_STAFF
   * }
   * 
  */ 

  let info = data.info || {};
  let goodsInfo = info.goodsInfo || {};
  let opKind = info.opKind || '';
  let scene = data.scene;//页面需要带上的参数

  // let goodsInfo = data.goodsInfo;
  // let scene = data.scene || {}; //页面需要带上的参数
  return UserApi.getWxCodeForWap({
    data: {
      "userToken": LM.userToken,
      "brandCode": Conf.BRAND_CODE,
      "storeId": scene.store_id||0,
      "reqId": scene.staff_id||0,
      "opKind": opKind,
    }, other: { isShowLoad: false }
  }).then(e => { 
      if (e.code == "1") {
        return Promise.resolve(e.data);
      }
      SMH.showToast({
          'title': e.msg || "生成二维码错误"
      })
      return Promise.resolve('');
    }).catch((e) => {
      return Promise.resolve('');
    })
}
 
export default appletCode