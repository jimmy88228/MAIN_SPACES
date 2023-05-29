import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
import PromH from "../../../../../common/helper/handle/promHandle";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      isLogin: {
        type: Boolean,
        value: false
      }
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      couponList:[],
    }, 
    
    detached() {
    },
    methods: {
      onAttached() { 
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;",
          server_close: server_close
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      getGoodsPromotion(goods_id){
        getGoodsPromotionInfo.call(this,goods_id);
      },
      getMore(e) {
        let dataset = e.currentTarget.dataset || {};
        let ruleId = dataset.ruleId || '0';
        let index = dataset.index || 0;
        if (this.data.promList[index]) {
          let data = this.data.promList[index];
          app.StorageH.set('CurrentPromote', data);
          wx.navigateTo({
            url: `/pages/micro_mall/goods/promote_activity/promote_activity?ruleId=${ruleId}`,
          })
        }
        return
      }
    }
  })
);
function getGoodsPromotionInfo(goods_id) {
  let goodsId = goods_id || 0;
  if (!goodsId) return;
  let params = {
    goodsId
  };
  return app.RunApi.go('GoodsApi', 'getGoodsPromotionRuleList', params).then(res => {
    if (res.code == 1) {
      let data = res.data || [];
      if ((data && data.length <= 0)) {
        this.setData({
          checkPromote: false,
        })
        return
      }
      let promoteData = {}, ruleNickName="",tip1={},tip2="",ruleRemark = "";
      let promList = [];
      for(let i = 0;i < data.length; i++){
        //
        let promItem = JSON.parse(JSON.stringify(data[i]));
        delete promItem.conditionList;
        let giftItemList = [],keyTip = {};
        let conditionList = data[i].conditionList || [];
        ruleNickName = data[i].ruleNickName;
        ruleRemark || (ruleRemark = (data[i].ruleRemark || ""));
        for(let j = 0; j < conditionList.length;j++){
          let giftList = conditionList[j].giftList || [];
          for(let k = 0; k < giftList.length; k++){
            let giftType = giftList[k].giftType;
            let giftTips = giftList[k].giftTips;
            let mapGiftType = PromH.getGiftRule(giftType);
            let ruleTypeStr = PromH.limitRuleType[giftType];
            if(PromH.keyTip[mapGiftType] && PromH.keyTip[mapGiftType].showDetail){
              if(!tip1[mapGiftType]){
                tip1[mapGiftType] = {
                  tip: ruleTypeStr,
                  txt: ""
                };
              }
              tip1[mapGiftType].txt = tip1[mapGiftType].txt ? tip1[mapGiftType].txt + "；" + giftTips : giftTips;
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
      promoteData.ruleRemark = ruleRemark;
      promoteData.ruleNickName = ruleNickName;
      promoteData.tip2Arr = (tip2 && tip2.split(";")) || [];
      this.checkPromote = true;
      let page = getCurrentPages().slice(-1)[0];
      page.checkPromote = true;
      console.log("promList",promList);
      console.log("promoteData", promoteData);
      page.setData({
        checkPromote: data.length > 0 ? true : false,
        promoteData: promoteData
      })
      this.setData({
        promList: promList
      })
    }
  })
} 