const app = getApp();
Page(app.BP({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
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