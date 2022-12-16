// pages/component/pop/adsPop.js
import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
import Mydate from '../../common/support/utils/date-util.js'
const app = getApp();
const PAGE_TYPE = {
  "pages/micro_mall/index/index":1,
  "pages/micro_mall/user/user":2,
  "pages/micro_mall/custom_page/custom_page":0
}
Component(app.BTAB({
  behaviors: [WindowBehaviors],
  options: {
    styleIsolation: 'isolated'
  },
  properties: {
    popData: {
      type: Object,
      value: {},
      observer: function (n) {
        if (n) {
          checkLogin.call(this, n);
        }
      }
    }
  },
  data: {
    showData:{},
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
    userName:"",
  },
  methods: {
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    close(e) {
      let showData = this.data.showData || {};
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
      let last = false;
      for (let item in showData) {
        if (item == type && showData[item].showPage) {
          showData[item].showPage = false;
          if (item == this.lastType) {
            last = true;
          }
          if (last) break
          this.setData({
            showData: showData
          })
          break
        }
      }
      if (last) {
        this.dismiss();
      }
    },
    onTap(e) {
      let dataset = e.currentTarget.dataset || {};
      let type = dataset.type || "";
      let url = "";
      let jump_type = "";
      if (type == 'more') {
        wx.navigateTo({
          url: '/pages/micro_mall/coupon/my_coupon',
        })
      } else if (type == 'ads') {
        jump_type = dataset.jump_type || "";
        url = '/' + dataset.url || "";
        if (jump_type == "PAGE_PATH") {
          wx.navigateTo({
            url: url,
            fail() {
              wx.switchTab({
                url: url,
              })
            }
          })
        }
      }
    }
  },
}))

function init(popData = {}) {
  // console.log('进来init',this.inited)
  if(this.inited || (!this.inited && this.unLoginInited))return //登录状态只弹一次、非登录状态也只弹一次
  popData = popData || {};
  let params = {
    pageId: popData.page_id || 0,
    pageType: popData.isIndex || 0, //0普通页面，1首页，2个人中心，3签到页, 4商品详情
    isIndex: popData.isIndex || 0,
    brandCode: app.Conf.BRAND_CODE
  }
  let temp = {};
  !app.LM.isLogin && (this.unLoginInited = true);
  return app.RunApi.go('CL_UserApi', 'getPopupAdvert', params,{diy:true}).then(res => {
    if (res.code != '1') {
      return Promise.reject();
    }
    temp = res;
    this.obj = {
      activity: temp.data.activity || (this.data.showData.activity) || {},
      assets: temp.data.assets ||  (this.data.showData.assets) || {},
    };
    this.obj.activity && this.obj.activity.topPicture && (this.obj.activity.topPicture = this.obj.activity.topPicture.trim());
    //展示活动推广
    if (this.obj.activity && this.obj.activity.activityId) {
      this.obj.activity.showPage = true; 
      this.lastType = "activity"
    } 
    //展示资产(目前仅首页)
    if (popData.isIndex == 1 && this.obj.assets && this.obj.assets.activityId) {
    // if (PAGE_TYPE[popData.route] == 1 && this.obj.assets && this.obj.assets.activityId) {
      this.obj.assets.showPage = true;
      this.obj.assets.showList = this.obj.assets.assetsList && this.obj.assets.assetsList.length > 0;
      this.obj.assets.bgColor = this.obj.assets.bgColor || "#FF3400";

      this.lastType = "assets"
      if(this.obj.assets.showList){
        this.obj.assets.assetsList.forEach(item => {
          let time = (Mydate.parse(item.useEndDate || "") - Mydate.parse(this.obj.assets.serverTime || "")) / 1000 / 60 / 60 / 24;
          item.timeLeft = time > 1 ? parseInt(time) + "天" : parseInt(time * 24) > 0 ? parseInt(time * 24) + "小时" : parseInt(time * 24 * 60) + "分钟";
        })
      }
    }
    this.setData({
      showData: this.obj || {}
    })
    if (this.data.showData.activity.showPage || this.data.showData.assets.showPage) {
      setTimeout(()=>{
        this.show();
      },700)
    }
    // console.log('showData', this.data.showData, this.lastType);
  })
}

function checkLogin(popData = {}) {
  console.log('popData',popData)
  app.LM.loginAsync(false).then(()=>{
    init.call(this,popData);
    getUserInfo.call(this);
    app.LM.isLogin && (this.inited = true);
    console.log('adsPopup 进来登录 init loginAsync then',app.LM.isLogin)
  })
}

function getUserInfo(){
  let storage = app.StorageH.get('SIMPLE_USER_INFO')||{};
  if(storage.realName){
    this.setData({
      userName:storage.realName
    })
  }
}

// let jimmy = {
//   "data": {
//     "activity": {
//       "activityId": 1,
//       "topPicture": "",
//       "bgColor": "#FF0000",
//       "itemList": [{
//           "picture": "https://KLIMG.innourl.cn/IMAGES/images/KLTY/index/gallery/20211125/20211125195758649_5563363.jpg",
//           "jump_type": "PAGE_PATH",
//           "jump_value": "pages/micro_mall/user/user"
//         },
//         {
//           "picture": "https://KLIMG.innourl.cn/IMAGES/images/KLTY/index/gallery/20211125/20211125195758649_5563363.jpg",
//           "jump_type": "PAGE_PATH",
//           "jump_value": "pages/micro_mall/sk/activity-sk/activity-sk?activityId=33&groupId=11&target=1"
//         },
//         {
//           "picture": "https://KLIMG.innourl.cn/IMAGES/images/KLTY/index/gallery/20211125/20211125195758649_5563363.jpg",
//           "jump_type": "PAGE_PATH",
//           "jump_value": "pages/micro_mall/sign/app/app_sign"
//         },
//         {
//           "picture": "https://KLIMG.innourl.cn/IMAGES/images/KLTY/index/gallery/20211125/20211125195758649_5563363.jpg",
//           "jump_type": "PAGE_PATH",
//           "jump_value": "pages/micro_mall/shopping/shopping_cart"
//         }
//       ]
//     },
//     "assets": 
//     {
//       "serverTime": "2020-04-15 18:29:30",
//       "totalBonus": 5,
//       "assetsList": [{
//           "bonusTypeName": "comtapresale",
//           "bonusType": 1,
//           "imageMain": "",
//           "discount": 1,
//           "minAmount": 0,
//           "maxAmount": 0,
//           "minGoodsAmount": 0.01,
//           "useEndDate": "2020-04-15 19:55:00"
//         },
//         {
//           "bonusTypeName": "comtapresale",
//           "bonusType": 4,
//           "imageMain": "",
//           "discount": 5,
//           "minAmount": 1,
//           "maxAmount": 2,
//           "minGoodsAmount": 0.01,
//           "useEndDate": "2020-04-15 18:30:00"
//         },
//         {
//           "bonusTypeName": "comtapresale",
//           "bonusType": 1,
//           "imageMain": "",
//           "discount": 1,
//           "minAmount": 0,
//           "maxAmount": 0,
//           "minGoodsAmount": 0,
//           "useEndDate": "2020-04-18 00:00:00"
//         },
//         {
//           "bonusTypeName": "",
//           "bonusType": 1,
//           "imageMain": "",
//           "discount": 1,
//           "minAmount": 0,
//           "maxAmount": 0,
//           "minGoodsAmount": 100,
//           "useEndDate": "2020-04-19 00:00:00"
//         }
//       ],
//       "activityId": 1,
//       "bgColor": "#FF0000",
//       "assetsType": "BONUS"
//     }
//   },
//   "code": "1",
//   "msg": "succ"
// }; 