import StrH from "../../../support/utils/string-util" 
import {
  LogMap
} from "../../../helper/manager/log-map.js";
const app = getApp();
Component(app.BTAB({
  properties: {
    posType:{
      value: "right",
      type: String
    },
    sysConf:{
      value:{},
      type:Object,
      observer(o,n){
        // if(typeof o == "object" && JSON.stringify(o) != "{}"){
        //   console.log("监听initSessionFrom");
        //   this.initSessionFrom();
        // }
      }
    },
    goods_id:{
      value:0,
      type:String
    },
    cardInfo:{
      value:{},
      type:Object,
      observer(n,o){
        setCardInfo.call(this, n);
      }
    }
  },
  data: {
    brand_info:{},
    noLimit:false,
    sessionFrom:"",
    isLogin:app.LM.isLogin,
    // style:""
    winW: app.SIH.windowWidth,
    winH: app.SIH.windowHeight,
    itemX: 645,
    itemY: 550,
    itemW: 90,
    itemH: 90,
    _cardInfo:{}
  },
  ready(){
    this.baseW = app.SIH.screenWidth / 750;
    this.phoneInfo = {
      width: app.SIH.windowWidth,
      height: app.SIH.windowHeight
    }
    this.initData();
  },
  pageLifetimes:{
    show(){
      checkLimit.call(this).then(res => {
        this.setData({
          noLimit: !res
        })
      }).catch(() => {
        this.setData({
          noLimit: true
        })
      });
      app.sysTemConfig().then(sysConf => {
        this.setData({
          sysConf: sysConf
        })
        this.initSessionFrom();
      });
      setCardInfo.call(this);
    },
    hide(){
      app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
    }
  },
  methods: {
    initSessionFrom(){
      let that = this;
      console.log("检测用户授权",app.LM.isLogin);
      let user_info = app.LM.isLogin && app.StorageH.get("USER_INFOS") || null;
      if(!user_info){
        console.log("检测用户授权2",app.LM.isLogin);
        this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
          // app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
          this.setData({
            isLogin: app.LM.isLogin
          })
          this.initSessionFrom();
        });
        return;
      }else{
        this.setData({
          isLogin: app.LM.isLogin
        })
        // app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
      }
      let source = user_info.mobilePhone ? `${user_info.cardNum}/${user_info.mobilePhone}` : user_info.cardNum || "";
      let sessionFrom = `${source}|${user_info.realName}|${user_info.portrait_path}`;
      this.setData({
        sessionFrom: sessionFrom
      })
      console.log('sessionFrom',sessionFrom)
    },
    setShow(){
      let page = getCurrentPages().pop();
      this.setData({
        always:true,
      })
    },
    initData() {
      let itemY = this.data.itemY;
      let itemW = this.data.itemW;
      let itemH = this.data.itemH;
      let posType = this.properties.posType || "right";
      let itemX = parseFloat(this.data.winW - (itemW * this.baseW));
      if(posType == "left"){
        itemX = 0;
      }
      this.setData({
        itemX: itemX,
        itemY: parseFloat(itemY * this.baseW),
        itemW: parseFloat(itemW * this.baseW),
        itemH: parseFloat(itemH * this.baseW),
      })
    },
    authorizeUserInfo(){
      this.setData({
        isLogin: app.LM.isLogin
      })
    },
    getContact(e){
      let dataset = e.currentTarget.dataset;
      let url = dataset.url || e.detail.url || "/pages/micro_mall/customer_service/contact_page";
      url = url.indexOf("?") == -1 ? url + "?goods_id=" + this.data.goods_id : url + "&goods_id=" + this.data.goods_id
      this.addActionLog("CONTACT_CLICK", null, null)
      wx.navigateTo({
        url: url,
      })
    },
    getWxContact(){
      this.addActionLog("CONTACT_CLICK", null, null)
    },
    contactCallback(e){
      console.log("客服回调",e);
      let detail = e.detail || {};
      let path = detail.path;
      if(!path) return;
      let query = detail.query || {};
      let paramStr = StrH.getPageParamsStr(query);
      let thisPage = getCurrentPages().pop();
      if("/" + thisPage.route == path){
        wx.redirectTo({
          url: paramStr ? path + "?" + paramStr : path,
          fail(){
            wx.switchTab({
              url: paramStr ? path + "?" + paramStr : path,
            })
          }
        })
      }else{
        wx.navigateTo({
          url: paramStr ? path + "?" + paramStr : path,
          fail(){
            wx.switchTab({
              url: paramStr ? path + "?" + paramStr : path,
            })
          }
        })
      }
    }
  }
}))

// 
function checkLimit(){
  let page = getCurrentPages().pop();
  let routeKey = LogMap[page.route] || ''
  let key = 'serviceLimit_' + routeKey;
  return app.CDateH.setCatchDate(key, 5).then(() => {
    let params = {
      path: page.route,
      assembly_type: 'service',
      brandCode:app.Conf.BRAND_CODE
    }
    return app.RunApi.go('GoodsApi', 'limit_page_show_assembly', params,{diy:true}).then(res=>{
      if(res.code == '1'){
        app.CDateH.setCacheData(key, res.data == 1);
        return Promise.resolve(res.data == 1);
      }
      return Promise.reject();
    })
  }).catch(() => {
    let data = app.CDateH.getResult(key);
    return Promise.resolve(data);
  })
}
function setCardInfo(cardInfo){
  cardInfo = cardInfo || {}
  let _cardInfo = this.data._cardInfo;
  if(!_cardInfo.title){
    _cardInfo.title = cardInfo.title || ""
  }
  if(!_cardInfo.img){
    _cardInfo.img = cardInfo.img || ""
  }
  if(!_cardInfo.showCard){
    _cardInfo.showCard = cardInfo.showCard || false
  }
  if(!cardInfo.path){
    if(cardInfo.path){
      _cardInfo.path = cardInfo.path
    }else{
      this.page = getCurrentPages().pop() || {};
      let paramStr = StrH.getPageParamsStr(this.page.options);
      if(this.page.route == "pages/micro_mall/goods/goods_info"){
        paramStr = paramStr ? paramStr + "&keyword=商品详情" : "keyword=商品详情";
      }
      _cardInfo.path = paramStr ? "/" + this.page.route + "?" + paramStr : "/" + this.page.route
    }
  }
  if(!_cardInfo.img){
    delete _cardInfo.img
  }
  if(!_cardInfo.title){
    delete _cardInfo.title
  }
  console.log("_cardInfo 客服的配置",_cardInfo,this.page)
  this.setData({
    _cardInfo: _cardInfo
  })
}