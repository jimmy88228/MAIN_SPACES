const app = getApp();
Page(app.BP({
  data: {

  },
  WEEK: {
    1: "一",
    2: "二",
    3: "三",
    4: "四",
    5: "五",
    6: "六",
    7: "日",
  },
  giftSort:{
    "6,8":0,
    "2":  1,
    "1":  2,
    "4,5":3,
    "3":  4
  },
  onLoad: function(options) {
    this.options = options;
    getGoodsPromotionInfo.call(this);
  },
  jump(e) {
    let dataset = e.currentTarget.dataset || {};
    let ruleId = dataset.ruleId || '0';
    if (this.data.list[ruleId]) {
      let data = this.data.list[ruleId];
      app.StorageH.set('CurrentPromote', data);
      wx.redirectTo({
        url: `/pages/micro_mall/goods/promote_activity/promote_activity?ruleId=${ruleId}`,
      })
    }
    return
  },
}))

function getGoodsPromotionInfo() {
  let goodsId = this.options.goods_id || 0;
  let params = {
    goodsId
  };
  return app.RunApi.go('GoodsApi', 'getGoodsPromotionInfo', params).then(res => {
    if (res.code == 1) {
      let obj = {};
      let data = JSON.parse(JSON.stringify(res.data || [])) || [];
      data.sort(sortByGiftType);
      let promkeys = {},promList = [];
      for(let i = 0; i < data.length; i++){
        let rule_id = data[i].rule_id;
        let gift_type = data[i].gift_type;
        gift_type = getGiftRule(gift_type);
        if(!promkeys[rule_id]){
          let limit_weekdays = data[i].limit_weekdays;
          let limit_days = data[i].limit_days;
          let end_time = data[i].end_time;
          promkeys[rule_id] = {
            promIndex: promList.length,
            giftSort: {},
          };
          promList.push({
            rule_id: rule_id,
            rule_name: data[i].rule_nick_name || data[i].rule_name,
            limit_weekdays: limit_weekdays.split(","),
            limit_days: limit_days.replace(/\,/g, '、'),
            end_time: end_time,
            giftList: []
          }) 
        }
        let promIndex = promkeys[rule_id].promIndex,giftIndex = 0;
        if(typeof(promkeys[rule_id].giftSort[gift_type]) == "undefined"){
          giftIndex = promList[promIndex].giftList.length;
          promkeys[rule_id].giftSort[gift_type] = promList[promIndex].giftList.length;
          promList[promIndex].giftList[giftIndex] = []
        }
        giftIndex = promkeys[rule_id].giftSort[gift_type];
        promList[promIndex].giftList[giftIndex].push(data[i])
      }
      console.log("promList",promList);
      console.log("promkeys",promkeys);
      return;
      //
      data.sort((a, b) => {
        if (a.gift_type < b.gift_type) {
          return 1
        } else if (a.gift_type > b.gift_type) {
          return -1
        } else if (a.gift_type == b.gift_type) {
          return 0
        };
      });
      console.log('datadata', data);
      let  WEEK = {
        1: "一",
        2: "二",
        3: "三",
        4: "四",
        5: "五",
        6: "六",
        7: "日",
      }
      let idArr = [];
      let tempId = "";
      let resultArr = [];
      data.forEach((item, index) => {
        if(!obj[item.rule_id] && item.rule_type != 1){
          idArr.push(item.rule_id);
        }else if(!obj[item.rule_id] && item.rule_type == 1){
          tempId = item.rule_id;
        }
        obj[item.rule_id] = obj[item.rule_id] || item && JSON.parse(JSON.stringify(item)) || {};
        if (obj[item.rule_id] && typeof obj[item.rule_id].gift_tips == 'string') {
          obj[item.rule_id].gift_tips = {};
          if (item.time_type == 1) {
            let arr = obj[item.rule_id].limit_weekdays.split(',');
            for (let item in arr) {
              arr[item] = WEEK[arr[item]];
            }
            obj[item.rule_id].limit_weekdays = arr.join('、');
          }
          if (item.time_type == 2) {
            obj[item.rule_id].limit_days.replace(/\,/g, '、');
          }
          console.log('进来time_type', item.time_type, obj[item.rule_id].limit_weekdays,obj[item.rule_id].limit_days)
        }
        obj[item.rule_id].gift_tips[item.condition_id] = (obj[item.rule_id].gift_tips[item.condition_id] ? obj[item.rule_id].gift_tips[item.condition_id] + '、' : '') + item.gift_tips;
      });
      if(tempId){
        idArr.push(tempId);
      }
      for(let i = 0,len=idArr.length;i<len;i++){
        if(obj[idArr[i]]){
          resultArr.push(obj[idArr[i]])
        }
      }
      console.log('obj', obj,'idArr',idArr);
      this.setData({
        list: obj,
        resultArr
      })
    }
  })
}
function getGiftRule(giftType){
  if(giftType == 6 || giftType == 8){
    return "6,8";
  }
  if(giftType == 4 || giftType == 5){
    return "4,5"
  }
  return giftType
}
function sortByGiftType(a,b){
  if(a.gift_type == 6 || a.gift_type == 8){
    return -1
  }else if(b.gift_type == 6 || b.gift_type == 8){
    return 1
  }
  if(a.gift_type == 2){
    return -1
  }else if(b.gift_type == 2){
    return 1
  }
  if(a.gift_type == 1){
    return -1
  }else if(b.gift_type == 1){
    return 1
  }
  if(a.gift_type == 4 || a.gift_type == 5){
    return -1
  }else if(b.gift_type == 4 || b.gift_type == 5){
    return 1
  }
  if(a.gift_type == 3){
    return -1
  }else if(b.gift_type == 3){
    return 1
  }
  return 0;
}