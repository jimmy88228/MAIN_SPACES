// pages/micro_mall/inviteAward/inviteAward.js
// import WxApi from '../../../common/helper/wx-api-helper.js';
const app = getApp();
const PAGE_TYPE_CODE = "NEW_USER_SHARE";
import DrawTemplate from '../goods/popup/help/template.js';
Page(app.BP({
  data: {
    hideContent:true,
    carousel_list: [],
    interval: 3000,
    autoplay: true,
    vertical: true,
    duration: 2000,
    circular: true,
    currentSwiper: 0,
    opacity_0: "opacity:0;transition: all 300ms ease-in-out;",
    opacity_1: "opacity:1;transition: opacity 400ms ease-in-out 1000ms;",
    emptyTipText:"暂无新的活动",
    mid:parseInt(app.SIH.statusBarHeight + (app.SIH.navPlace - app.SIH.statusBarHeight) / 2) - 28 + 3,
    ruleH: parseInt(app.SIH.navPlace) + 20
  },
  onLoad: function (options) {
    let acShare = this.data.brand_info.default_icon_url + "inviteAward/acShare.png";
    let buyAc = this.data.brand_info.default_icon_url + "inviteAward/buyAc.png";
    let buy = this.data.brand_info.default_icon_url + "inviteAward/buy.png";
    let down = this.data.brand_info.default_icon_url + "inviteAward/down.png";
    let friHead = this.data.brand_info.default_icon_url + "inviteAward/friHead.png";
    let invite = this.data.brand_info.default_icon_url + "inviteAward/invite.png";
    let inviteAc = this.data.brand_info.default_icon_url + "inviteAward/inviteAc.png";
    this.setData({
      acShare, buyAc, buy, down, friHead, invite, inviteAc
    })
    loadData.call(this);
  },
  onReady: function () { 
  },
  onShow: function () {
    listen.call(this);
  },
  onHide(){
    unListen.call(this);
  },
  getNavH(e) {
  }, 
  toogle: function (e) {
    this.setData({
      currentSwiper: e.detail.current
    });
  },
  inviteShare(data) {
    if(this.lockShare)return;
    this.lockShare = true;
    return this.checkIfMyStore().then(storeInfo=>{
      let opKind = app.OpKind[PAGE_TYPE_CODE] || app.OpKind.NORMAL;
      let shareType = app.ShareType[PAGE_TYPE_CODE] || app.ShareType.NORMAL;
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      initTemplate.call(this);
      let allData = {
        info: {
          opKind: opKind,
          imgUrl: this.data.acData.sharePoster||"",
          path: 'pages/micro_mall/index/index',
        },
        scene: {
          "shareType": shareType,
          // "codeType": "myCode",
          "staff_id": storeInfo.user_id || "",//普通店员id
          "store_id": storeInfo.store_id || "",
          "staff_code": storeInfo.staff_code || "",
          "staffCode": app.LM.staffInfo && app.LM.staffInfo.staffCode || "",
        },
        draw: {
          diy: true,
          drawArr: this.drawArr,
          codeType: "QR",
          // template:"custom",
          baseInfo: {
            canvasW: 600,
            canvasH: 900,
            background: '#fff',
            codeDiy: true
          },
        }
      }
      console.log('allData',allData,this.drawArr);
      this.setData({
        allData: allData
      })
      wx.nextTick(()=>{
        this.shareImg.show();
        this.lockShare = false;
      })
    }).catch(e=>{
      this.lockShare = false;
    }); 
  },
  checkIfMyStore() {//普通会员
    let p = null, p2 = null;
    let userInfo = app.LM.userInfo || {};
    let storeInfo = app.LM.storeInfo;
    if (!userInfo.fromStoreId) {
      p = app.LM.getUserSimpleInfo().catch(() => { });
    } else {
      p = Promise.resolve(userInfo)
    }
    if (!storeInfo) {
      p2 = app.LM.checkIfStore().catch(() => { });
    } else {
      p2 = Promise.resolve(storeInfo)
    }
    return Promise.all([p, p2]).then((result) => {
      let allInfo = {
        ...result[0],
        ...result[1]
      }
      return Promise.resolve(allInfo);
    }).then(userInfo => {
      let result = {
        staff_code: userInfo.staff_code,
        store_id: userInfo.fromStoreId,
        user_id: userInfo.uId
      };
      return Promise.resolve(result);
    })
  },
  onTap(e){
    let dataset = e.currentTarget.dataset||{};
    let type = dataset.type||"";
    if(type == 'moreJump'){
      wx.navigateTo({
        url: `/pages/micro_mall/inviteAward/extraPage/friMore?id=${this.activityId||0}`,
      })
    }else if(type == 'rule'){
      wx.navigateTo({
        url: `/pages/micro_mall/articles/agreet/agreet?articleId=${dataset.id||0}`,
      })
    }
  },
  imgLoad(e){
    this.data.hideContent && this.setData({
      hideContent:false
    })
  }
}))

function loadData() {
  if(this.loaded)return
  this.loaded = true;
  let params = { url: "getInviteUserActivity", params: { brandCode: app.Conf.BRAND_CODE }, extra: { diy: true } }
  return setApi(params).then(res => {
    if (res.code == '1') {
      this.setData({
        showPage: true,
        acData: res.data
      });
      this.data.hideContent && setTimeout(()=>{
        this.setData({
          hideContent:false
        })
      },400)
      let data = res.data || {};
      this.activityId = data.activityId;
      return promiseAll(data.activityId).then(all => {
        if (all) {
          let _setData = {}
          for (let i = 0, len = all.length; i < len; i++) {
            _setData[i == 0 ? 'friData' : 'carouselData'] = all[i] && all[i].data || {};
          }
          this.setData({
            ..._setData
          })
        }
      })
    } else {
      this.setData({
        showPage: true,
        empty: true,
        msg:res&&res.msg || "暂无活动"
      });
    }
  })
}

function promiseAll(id) {
  let arr = [{ url: "getInviteUserRecord", params: { activityId: id, pageIndex: 1, pageSize: 3} },
  { url: "getInviteUserLogList", params: { activityId: id, pageIndex: 1, pageSize: app.Conf.PAGE_SIZE } },];
  let pm_arr = [];
  for (let i = 0, len = arr.length; i < len; i++) {
    pm_arr.push(setApi(arr[i]));
  }
  return Promise.all(pm_arr)
}

function setApi(data = {}) {
  let { api = "UserApi", url = "", params, extra = {} } = data;
  return app.RunApi.go(api, url, params, extra).catch(e => {
    return Promise.resolve(e);
  });
}


function initTemplate(staffCode = '') {
  if (this.drawArr && this.drawArr.length > 0) { return }
  let canvasW = 600;
  let canvasH = 900;
  let padding = 20;
  let baseH = 30;
  let baseTopLine = canvasW + 80;
  let codeW = 120;
  let baseBottomLine = canvasH - padding;

  this.drawArr = this.drawArr || [];
  let posterH = canvasH - codeW - padding * 2;
  let bg = DrawTemplate.initData('image', 0, 0, canvasW, posterH);
  bg.url = this.data.acData.sharePoster || '';
  bg.mode = 'fitORfill';
  bg.adaptive = 'middle';
  this.drawArr.push(bg);

  let brand = DrawTemplate.initData('image', canvasW - codeW - padding, canvasH - codeW - padding, codeW, codeW);
  brand.position = 'absolute';
  brand.url = this.data.brand_info.icon_url + 'micro_mall/applet_logo.png';
  this.drawArr.push(brand);

  let code = DrawTemplate.initData('image', padding, posterH + padding, codeW, codeW);
  code.position = 'absolute';
  code.type = 'code';
  this.drawArr.push(code);

  let tip1 = DrawTemplate.initData('text', padding + codeW + padding, posterH + padding + 5);
  tip1.text = "1.扫码进入" + "公众号";
  tip1.position = 'absolute'; 
  tip1.size = 22;
  this.drawArr.push(tip1); 

  let tip2 = DrawTemplate.initData('text', padding + codeW + padding , 0);
  tip2.text = "2.关注公众";  
  tip2.size = 22; 
  tip2.position = 'relative';
  tip2.extraH = 20;
  this.drawArr.push(tip2);

  let tip3 = DrawTemplate.initData('text', padding + codeW + padding , 0);
  tip3.text = "3.领取福利";  
  tip3.size = 22; 
  tip3.position = 'relative';
  tip3.extraH = 20;
  this.drawArr.push(tip3);
}

function listen(){
  if (app.LM.isLogin){
    this.setData({
      isLogin:true
    })
    loadData.call(this);
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if(app.LM.isLogin){
      this.setData({
        isLogin:true
      })
      loadData.call(this);
    }
  });
}
function unListen(){
  if (this.listenLoginStatuId){
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
}