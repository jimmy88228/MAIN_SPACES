import RunApi from "../apiPackage.js"
class PromManager {
  static getInstance() {
    if (!PromManager.instance) {
      PromManager.instance = new PromManager();
    }
    return PromManager.instance;
  }
  constructor() {
    this.limitRuleType = this.limitRuleType || {
      1: "返券",
      2: "赠品",
      3: "包邮",
      4: "返积分",
      5: "返积分",
      6: "折扣",
      7: "一口价",
      8: "满减",
      9: "免件"
    }
    this.keyTip = this.keyTip || {//规定排列顺序
      "7":  { key: 0, showDetail: true}, 
      "8":  { key: 1, showDetail: true},
      "6":  { key: 2, showDetail: true},
      "9":  { key: 3, showDetail: true},
      "2":  { key: 4 },
      "1":  { key: 5 },
      "4,5":{ key: 6 },
      "3":  { key: 7 }
    }
  }
  getGiftRule(giftType){
    let key1 = "6,7,8,9", key2 = "4,5";
    if(key2.indexOf(giftType) != -1){
      return key2;
    }
    return giftType;
  }

  getGoodsPromotion(param,type='goods'){
    return getPromotionInfo.call(this,param,type);
  } 

}

function getPromotionInfo(param,type) {
  if (!param) return Promise.reject();
  let apiPack = {
    params:{},
    api:"CL_GoodsApi",
    url:""
  };
  if(type == 'goods'){
    apiPack.params.goodsId = param;
    apiPack.url = "getGoodsPromotionRuleList"
  }else if(type == 'ruleId'){
    apiPack.params.ruleId = param;
    apiPack.url = "getPromotionRuleInfo"
  }
  return RunApi.go(apiPack.api, apiPack.url, apiPack.params,{diy:true}).then(res => {
    if (res.code == 1) {
      let data = res.data || [];
      type == 'ruleId' && (data = [data]);
      if ((data && data.length <= 0)) {
        return Promise.reject();
      }
      let promList = [], promoteData = {}, ruleNickName="",tip1={},tip2="";
      for(let i = 0;i < data.length; i++){
        let promItem = JSON.parse(JSON.stringify(data[i]));
        delete promItem.conditionList;
        let giftItemList = [],keyTip = {};
        let conditionList = data[i].conditionList || [];
        ruleNickName = data[i].ruleNickName;
        for(let j = 0; j < conditionList.length;j++){
          let giftList = conditionList[j].giftList || [];
          for(let k = 0; k < giftList.length; k++){
            let giftType = giftList[k].giftType;
            let giftTips = giftList[k].giftTips;
            let mapGiftType = this.getGiftRule(giftType);
            let ruleTypeStr = this.limitRuleType[giftType];
            if(this.keyTip[mapGiftType] && this.keyTip[mapGiftType].showDetail){
              if(!tip1[giftType]){
                tip1[giftType] = {
                  tip: ruleTypeStr,
                  txt: ""
                };
              }
              tip1[giftType].txt = tip1[giftType].txt ? tip1[giftType].txt + "；" + giftTips : giftTips;
            }else{
              if(tip2.indexOf(ruleTypeStr) == -1){
                tip2 = tip2 ? tip2 + ";" + ruleTypeStr : ruleTypeStr
              }
            }
            //为促销详情拼装
            let index = keyTip[mapGiftType];
            let cdn_num = conditionList[j].conditionNumber;
            let condition = promItem.conditionType == 1 ? "满" + cdn_num + "元" : "满" + cdn_num + "件"
            if(typeof(index) == "undefined"){
              index = giftItemList.length;
              keyTip[mapGiftType] = index;
              giftItemList.push({
                txt: ruleTypeStr, 
                list:[],
                tip: [],
                condition:[],
                key: index,
                type: giftType,
              })
            }
            giftItemList[index].tip.push(giftTips)
            giftItemList[index].condition.push(condition)
            if(giftType == 1){
              giftItemList[index].list.push(giftList[k].giftList);
            }else if(giftType == 2){
              if(giftList[k].giftList.length>0){
                giftItemList[index].list = giftItemList[index].list || [];
                giftItemList[index].list.push(giftList[k].giftList);
              }
            }
            // promItem
          }
        }
        promList.push({
          giftList: giftItemList,
          ...promItem
        })
      } 
      promoteData.tip1 = tip1;
      promoteData.ruleNickName = ruleNickName;
      promoteData.tip2Arr = (tip2 && tip2.split(";")) || [];
      return Promise.resolve({promList,promoteData,data});
    }else{
      return Promise.reject();
    }
  })
}  
export default PromManager.getInstance();