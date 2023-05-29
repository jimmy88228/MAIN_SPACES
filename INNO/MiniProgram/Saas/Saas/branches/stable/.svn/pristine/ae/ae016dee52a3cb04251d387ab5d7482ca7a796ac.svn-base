// pages/micro_mall/seeding_grass/seach/search.js
const app = getApp();
Component(app.BTAB({
  properties: {
    searchType:{
      type: "String",
      value: ""
    }
  },
  data: {
    searchReq:{
      "fans":"getMyFansList",
      "classify":"get_Grass_CategoryList",
      "label":"get_Grass_LabelList",
      "goods":"get_Goods_List",
      "recommend":"get_Goods_List",
      "relative":"get_Goods_List",
      "follow": "getMyFocouseList"
    },
    strWhere:"",
  },
  
  methods: {
    search(obj){
      if (this.properties.searchType === 'recommend' || 'relative') {
        this.triggerEvent("searchCallback", this.data.strWhere || "")
        return 
      }
      searchRequest.call(this, obj);
    },
    syncInput(e){
      let dataset = e.target.dataset || {};
      let detail = e.detail || {};
      let key = dataset.key;
      this.setData({
        [key]: detail.value
      })
    },
    cancel(e){
        let dataset = e.target.dataset || {}; 
        let key = dataset.key;
        this.setData({
            [key]: ''
        }) 
        searchRequest.call(this);
    },
  }
}))
function searchRequest(obj = {}){
  let searchType = this.data.searchType;
  let strWhere = this.data.strWhere;
  let searchReq = this.data.searchReq;
  let pageIndex = obj.pageIndex || 1;
  if (searchReq[searchType]) {
    return app.GrassApi[searchReq[searchType]]({
      params: {
        strWhere: strWhere,
        pageIndex: pageIndex,
        pageSize: app.Conf.PAGE_SIZE,
        userToken: app.LM.userToken,
        brandCode: app.Conf.BRAND_CODE
      }
    }).then(e => {
      if (e.code == 1) {
        let data = e.data || {};
        let list = data.data || [];
        let warn = ""
        if (list.length == 0) {
          warn = "已经到底啦！";
          if (pageIndex == 1) {
            warn = "没有数据"
          }
        }
        data.pageIndex = pageIndex;
        this.triggerEvent("searchCallback", { data: data });
        if (warn) {
          app.SMH.showToast({
            title: warn
          })
        }
        return Promise.resolve(e.data);
      }
      app.SMH.showToast({
        title: e.msg || "请求错误"
      })
      return Promise.reject(e);
    })
  }else{
      console.log('没有对应的请求api')
  }
}