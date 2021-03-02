import WxSub from  "../../../../../helper/handle/wxSubscribe.js" 
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    groupId:{
      type: Number,
      value: 0
    }, 
    acState:{
      type: Number,
      value: 0
    }, 
    tplsList:{
      type: Array,
      value: []
    },
    tplsListObj:{
      type: Object,
      value: {}
    },
    isLogin:{
      type:Boolean,
      value:false
    }, 
    subStateAll: {
      type: Object,
      value: {},
    },
  },
  data: {
    ac_conf: app.Conf.style.n_sk_color,
    goodsList:[], 
  },
  goodsHash:{},
  ready(){
    let none_color = app.getColor(this.data.ac_conf.theme_color, 0, 0, 0, 0.2) || '';
    console.log('none_color', none_color)
    this.setData({
      none_color
    })
  },
  methods: {
    loadData(activityId=0,carry_params={}){
      if(!this.inited){
        init.call(this);
      }
      this.activityId = activityId;
      if (carry_params.init){
        init.call(this);
        if (this.lastId && this.lastId != activityId){
          this.jumpInfo = false;
          init.call(this,"goodsHash");
        }
        this.lastId = activityId;
      }
      if (!this.hasMore || this.isLoading) return Promise.reject();
      this.isLoading = true;
      let goodsHash = this.goodsHash || {};
      let params = {
        activityId,
        pageIndex: goodsHash.page || this.page,
        pageSize: app.Conf.PAGE_SIZE, 
      };
      let extra = {
        diy: false
      }
      return app.RunApi.go('SecKillApi', 'getGoodsList', params, extra).then(res => {
        if (res.code == '1') {
          let data = res.data || {};
          let list = data.list || [];
          let clickItem;
          this.page = params.pageIndex;
          list.forEach(item=>{
            //
            item.page = params.pageIndex;
            if (this.goodsHash && this.goodsHash.goodsId && this.goodsHash.goodsId == item.goodsId){
                clickItem = item;
                clickItem.percent = getPercent.call(this, item.inventoryRemnant, item.inventory);
                clickItem.isUpdate = true;
                return;
            } else {
              item.percent = getPercent.call(this, item.inventoryRemnant, item.inventory);
            }
          })
          let carryData = {};
          carryData.layout = carry_params.layout || '';
          carryData.acState = carry_params.acState || 0;
          if (clickItem){
            let goodsList = this.data.goodsList;
            let index = this.goodsHash.index;
            this.setData({
              ['goodsList[' + index + ']']: clickItem
            })
            init.call(this,"goodsHash");
          }else{
            if (carry_params.init || (this.page == 1)) {
              this.data.goodsList = [];
            }
            this.setData({
              layout: carryData.layout || this.data.layout || "ONE",
              acState: carryData.acState || this.data.acState || 0,
              goodsList: [...this.data.goodsList, ...list || []]
            });
          }
          this.hasMore = data.count > this.page * app.Conf.PAGE_SIZE;
          this.page += 1;
          return Promise.resolve(data);
        }
        return Promise.reject();
      }).finally(()=>{
        this.isLoading = false;
      })
    }, 
    jump(e){
      let dataset = e.currentTarget.dataset || {};
      let goodsId= dataset.goodsId || 0;
      let activityId= dataset.activityId || 0;
      let page = dataset.page;
      let index = dataset.index;
      this.jumpInfo = true;
      this.goodsHash = {
        activityId,
        goodsId,
        page,
        index
      }
      wx.navigateTo({
        url: `/pages/micro_mall/sk/goods-info-sk/goods-info-sk?goodsId=${goodsId}&activityId=${activityId}&groupId=${this.data.groupId}`,
      })
    },
    checkSubState(all = false, subState={}){
      return Promise.resolve(all)
      // if (!all && this.jumpInfo && (this.data.acState == 1 || this.data.acState == 2)){
      //   let keyTemplate = WxSub.skKeyTemplate    || {};
      //   return WxSub.checkSubState(this.activityId).then(res=>{
      //     let tplsList = this.properties.tplsList || []; 
      //     let select = 0;
      //     let subState = this.data.subState || {};
      //     for (let i = 0; i < tplsList.length; i++) {
      //       if (res[keyTemplate[tplsList[i].tplType]] == 1 || res[keyTemplate[tplsList[i].tplType]] == 2) {
      //         select += 1;
      //       }
      //       // console.log('重新赋值', subState, tplsList[i].tplType, res[keyTemplate[tplsList[i].tplType]])
      //       subState[tplsList[i].tplType] = res[keyTemplate[tplsList[i].tplType]];
      //     }
      //     all = select == tplsList.length;
      //     console.log('重新检测已选:', select, tplsList.length);
      //     this.jumpInfo = false;
      //     return Promise.resolve(all)
      //   }).catch(()=>{
      //     this.jumpInfo = false;
      //     return Promise.resolve(all)
      //   });
      // }else{
      //   return Promise.resolve(all)
      // }
    },
    setSubscribe(e){
      let that = this;
      let dataset = e.currentTarget.dataset || {};
      let index = dataset.index;
      let isSubscribeReady = dataset.isSubscribeReady || 0;
      let isSubscribeStart = dataset.isSubscribeStart || 0;
      let subState = {
        SECKILL_READY:isSubscribeReady,
        SECKILL_START:isSubscribeStart
      }
      let subStateAll = this.data.subStateAll || {};
      let tplsList = this.properties.tplsList || [];
      let tmplIds = [];
      let goodsList = this.data.goodsList;
      let goodsInfo = goodsList[index];
      let select = 0;
      let acState = this.data.acState || 1;
      let bool = ((acState == 2 && subState.SECKILL_START == 1) || (acState == 1 && subState.SECKILL_READY == 1)) || false;
      for (let i = 0; i < tplsList.length; i++) {
        if (tplsList[i].wxTplId) {
          tmplIds.push(tplsList[i].wxTplId);
        }
        if (subState[tplsList[i].tplType] != 0 || subStateAll[tplsList[i].tplType] != 0) {
          select += 1;
        }
        console.log('历史订阅:', select, '/', tplsList.length, tplsList[i].tplType,subState[tplsList[i].tplType], '总的:', subStateAll[tplsList[i].tplType]);
      }
      let selectAll = select == tmplIds.length;
      selectAll = this.checkSubState(selectAll, subState).then(res=>{
        selectAll = res || false;
        if (selectAll || bool) {
          let subResult = {};
          for (let i = 0; i < tmplIds.length; i++) { //遍历拒绝
            let tempTplType = tplsList[i].tplType;
            subResult[tmplIds[i]] = bool ? subState[tempTplType] == 0 ? "reject" : "rejectInner" : "accept";
          }
          this.triggerEvent("updateSubState", { subResult: subResult });
          that.reqSubscribe(index, subResult, !bool);
          return;
        }
        WxSub.setWxSubscribe(tmplIds).then(res => {
          if (res.errMsg.indexOf("ok") != -1) {
            this.triggerEvent("updateSubState", { subResult: res });
            that.reqSubscribe(index, res, true);
          } else {
            app.SMH.showToast({
              title: res.errMsg
            })
          }
        }).catch(error => {
          if (error && error.type == 'showError') {
            app.SMH.showToast({
              title:"请允许订阅消息在小程序设置中开启"
            })
          }else{
            // app.SMH.showToast({
            //   title: "已取消提醒"
            // })
          }
        })
      })
      
    },
    reqSubscribe(index, subResult,setSub){
      let that = this;
      let tplsList = this.properties.tplsList || [];
      let reqList = [];
      let goodsList = this.data.goodsList||[];
      let goodsInfo = goodsList[index] || {};
      for (let i = 0; i < tplsList.length; i++) {
        let wxTplId = tplsList[i].wxTplId || "";
        let tplType = tplsList[i].tplType || "";
        reqList.push({
          tplType: tplType,
          activityId: this.activityId,
          goodsId: goodsInfo.goodsId,
          brandTplId: tplsList[i].brandTplId,
          state: subResult[wxTplId] || 2 
        })
        if (subResult[wxTplId]){
          console.log(subResult[wxTplId], WxSub.getKeyTemplate("SECKILL")[tplType], goodsInfo[WxSub.getKeyTemplate("SECKILL")[tplType]],WxSub.SubStatus[subResult[wxTplId]])
          goodsInfo[WxSub.getKeyTemplate("SECKILL")[tplType]] = WxSub.SubStatus[subResult[wxTplId]];
          // console.log(subResult[wxTplId], WxSub.skKeyTemplate[tplType], goodsInfo[WxSub.skKeyTemplate[tplType]],WxSub.SubStatus[subResult[wxTplId]])
          // goodsInfo[WxSub.skKeyTemplate[tplType]] = WxSub.SubStatus[subResult[wxTplId]]
        }
      }
      WxSub.setSubscribe(reqList, setSub,"SECKILL").then(() => {
        that.setData({
          ['goodsList['+ index + ']']: goodsInfo
        })
      });
    },
    loginBack(){
      app.SMG.showToast({
        title:"注册成功，请重新操作",
        duration:3000
      })
    },
    _onFu(){}
  },
  pageLifetimes: {
    show: function () {
    },
  }
}))

function init(type) {
  if(type == "goodsHash"){
    this.goodsHash = {}
  }else{
    this.inited = true;
    this.hasMore = true;
    this.isLoading = false;
    this.page = 1;
  }
  
} 

function getPercent(inven = 0, invenSum = 0) {
  let percent = (invenSum == 0) ? 0 : inven / invenSum >= 1 ? 100 : inven / invenSum > 0.01 ? parseInt(((inven / invenSum) * 100).toFixed(2)) : parseFloat((inven / invenSum) * 100);
  percent = percent > 0 && percent < 1 ? 1 : percent;
  return percent;
}