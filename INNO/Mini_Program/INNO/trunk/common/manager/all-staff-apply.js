import LM from "./login-manager.js";
// import GetSystemConfig from '../handle/getSystemConfig';
import {GoodsApi} from "./http-manager"
import Conf from "../../conf"
class AllStaffApply {
  constructor() {
    this.showedWd = false;
  }
  static getInstance() {
    if (!AllStaffApply.instance) {
      AllStaffApply.instance = new AllStaffApply();
    }
    return AllStaffApply.instance;
  }
  checkAllStaffApply(that,{goods_id,goodsType,relatedId}){
    if(this.showedWd)return Promise.reject();
    return LM.loginAsync(false).finally(()=>{
      return checkStaffApply().then(msg=>{
        return getGoodsCommissionAmountByType({goods_id,goodsType,relatedId}).then(res=>{
          if(res.code == '1'){
            let data = res.data||{};
            if(data.max_commission_amount>0){
              if(!msg || (msg && !msg.applyDstbRepeatShow)){
                this.showedWd = true;
              }
              let staffApply = that.selectComponent("#staffApply");
              staffApply._show(msg);
            }
          }
        })
      })
    })
  }
}
 
function checkStaffApply(){
  return LM.checkIfStaffDstbEvent(true).then(res => {
    if(res && (!res.isStaffDstbData && res.enableWholeDstb)){ 
      return {applyDstbDesc:res.applyDstbDesc ||"",applyDstbHint:res.applyDstbHint ||"",applyDstbRepeatShow:res.applyDstbRepeatShow||0}
    }else{
      return Promise.reject();
    } 
  })
}

function getGoodsCommissionAmountByType({goods_id,relatedId,goodsType}){
  console.log('goodsId,relatedId,goodsType',goods_id,relatedId,goodsType)
  return GoodsApi.getGoodsCommissionAmountByType({
    params: {
      goodsId: goods_id||0,
      brandCode: Conf.BRAND_CODE,
      userToken: LM.userToken,
      relatedId: relatedId || 0,
      goodsType: goodsType || "",
    },
    other: { isShowLoad: false }
  })
}


export default AllStaffApply.getInstance(); 