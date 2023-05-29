import {CL_UserApi} from "../manager/http-manager";
import DateUtil from "../support/utils/date-util.js"
import CDateH from "./handle/cacheDateHandle.js";
import Conf from "../../conf";
class SevenFishHelp {
  static getInstance() {
    if (!SevenFishHelp.instance) {
      SevenFishHelp.instance = new SevenFishHelp();
    }
    return SevenFishHelp.instance;
  }
  constructor() {
    this.inited = false;
    this._fish = {};
    this._params = {};
    this._userInfo = null;
    this._fromMnp = true;
    CDateH.delCacheDate('fishSetUserInfo');
  }
  init(){
    if(!this.inited){ //预加载页面 首次需要初始化
      const myPluginInterface = requirePlugin('sevenFish');
      myPluginInterface._$configAppKey(Conf.sevenFishConf.APP_KEY);
      myPluginInterface.__configAppId(Conf.sevenFishConf.APP_ID);
      this._fish = myPluginInterface;
      console.log('七鱼初始化',Conf.sevenFishConf,this._fish);
      this.inited = true;
      this.initOnClickAction();
    }
    this.preSetConfig().then(()=>{ //处理需要的数据
      wx.redirectTo({
        url: 'plugin://sevenFish/chat', //直接跳转七鱼插件
        complete:(res)=>{
          console.log('七鱼 跳转complete1',res)
        }
      })
    })
  }
  jump(params){
    if(this.inited){
      this._params = params||{};
      this.preSetConfig().then(()=>{ //处理需要的数据
        wx.navigateTo({
          url: 'plugin://sevenFish/chat', //直接跳转七鱼插件
          complete:(res)=>{
            console.log('七鱼 跳转complete2',res)
          }
        })
      })
    }else{ //首次跳转,先跳去预加载页面
      this._params = params||{};
      console.log('七鱼 先跳转去预加载')
      wx.navigateTo({
        url: '/pages/preload/index?fromType=fish', //跳转预加载页面
      })
    } 
  }
  preSetConfig(){
    return new Promise((rs,rj)=>{
      let obj = this._params||{};
      let arr = [];
      return fishSetUserInfo.call(this).then(()=>{ 
        if(HasKey(obj)){
          for(let key in obj){
            switch (key) {
              case "product":
                arr.push(fishSetProduct.call(this,obj[key]))
                break;
              case "order":
                arr.push(fishSetOrder.call(this,obj[key]))
                break;
              default: 
                break;
            }
          } 
        }
        return Promise.all(arr).then(res=>{
          console.log('Promise all res',res)
          return rs(res);
        })
      })
    })
  }
  initOnClickAction() {
    this._fish._$onClickAction((data, navigateTo) => {
      let url = data.extraParam && data.extraParam.url||"";
      console.log('七鱼 _$onClickAction', data,url);
      url && navigateTo({
        url
      })
    })
  }
  get FISH(){
    return this._fish || {}
  }
} 

function HasKey(obj){
  let has = false;
  for(let key in obj){
    has = true;
  }
  return has;
}

function fishSetProduct(data){
  console.log('七鱼 _$sendProduct',data)
  // this.FISH._$configProductSync({...data,});
  this.FISH._$sendProduct(data);
  return Promise.resolve(data);
}

function fishSetOrder(data){
  console.log('七鱼 _$sendProduct order',data)
  // this.FISH._$configProductSync(data);
  this.FISH._$sendProduct(data);
  return Promise.resolve(data);
}

function fishSetUserInfo(){
  return CDateH.setCatchDate('fishSetUserInfo', 2).then(()=>{
    return CL_UserApi.get_UserInfo({}).then(res=>{
      if(res.code == 1){
        this._userInfo = res.data||{};
        console.log('七鱼 _$setUserInfoSync',this._userInfo)
        this.FISH._$setUserInfoSync(setUserInfoDetail(this._userInfo));
      }
      return this._userInfo;
    })
  }).catch(()=>{
    console.log('七鱼 _$setUserInfoSync 缓存',this._userInfo)
    this._userInfo && this.FISH._$setUserInfoSync(setUserInfoDetail(this._userInfo));
    return Promise.resolve(this._userInfo);
  })
}

function setUserInfoDetail(data){
  return {
    userId: data.cardNumber || '',
    data: [
      { "index": 0, "key": "avatar", "label": "头像", "value": data.headPicture || "" },
      { "index": 1, "key": "nickName", "label": "昵称", "value": data.nickName || "--" },
      { "index": 2, "key": "userName", "label": "姓名", "value": data.userName || "--" },
      { "index": 3, "key": "sex", "label": "性别", "value": data.sex || "未知"}, 
      { "index": 4, "key": "years", "label": "年龄", "value": data.years||"--" },
      { "index": 5, "key": "brithday", "label": "生日", "value": data.brithday.indexOf('1900-01-01') == -1 ? (DateUtil.format(DateUtil.parse(data.brithday||''),'yyyy-MM-dd') || "") : '--' },
      { "index": 6, "key": "mobilePhone", "label": "手机号", "value": data.mobilePhone||"--" },
      { "index": 7, "key": "cardNumber", "label": "会员号", "value": data.cardNumber||"--" },
      { "index": 8, "key": "points", "label": "积分数量", "value": data.points||'0' },
      { "index": 9, "key": "storedValue", "label": "储值卡余额", "value": data.storedValue||'0' },
      { "index": 10, "key": "payNumbers", "label": "购买次数", "value": data.payNumbers||'0' },
      { "index": 11, "key": "avgPrice", "label": "平均客单价", "value": data.avgPrice||'0' },
      { "index": 12, "key": "lastPayMoney", "label": "最近消费金额", "value": data.lastPayMoney||'0' },
      { "index": 13, "key": "lastConsumptionTime", "label": "最近消费时间", "value": data.lastConsumptionTime || "--"},
      { "index": 14, "key": "couponQuantity", "label": "优惠券数量", "value": data.couponQuantity||'0' },
      { "index": 15, "key": "registrationDate", "label": "会员注册日期", "value": data.registrationDate||"--" },
      { "index": 16, "key": "homeAddress", "label": "家庭住址", "value": data.homeAddress||"--" }, 
    ]
  }
}

export default SevenFishHelp.getInstance();