// pages/micro_mall/goods/goods_info.js
let WxParse = require("../../../../components/thirdParty/wxParse/wxParse.js");
import MyDate from '../../../../common/support/utils/date-util.js';
import MyStr from "../../../../common/support/utils/string-util.js";
import {
  CountDown
} from "../../../../common/manager/timer-manager.js";
import PH from "../../../../common/helper/handle/paramsHandle.js";
import WxApi from "../../../../common/helper/wx-api-helper.js";
import StrH from "../../../../common/helper/handle/strHandle.js";
import Utils from "../../../../common/support/utils/utils";
import AS from "../../../../common/manager/authorize-set.js";
const app = getApp();
const PAGE_TYPE = "NORMAL_GOODS";
Page(app.BP({
  data: { 
    showTip:"",
    longTipW:130,
    longTipH:70,
    defaultImgArr:{},
    swiper_current: 0,
    isCollect: 0, //是否收藏
    goods_info: {},
    isBeginStart:false,
    color_img: [], //商品图片列表 
    select_goods: { //选择的商品
      select_color: "", //选择颜色对象
      select_size: "", //选择尺码对象
      select_color_id: 0, //选择颜色id
      select_size_id: 0, //选择尺码id
      select_goods_count: 1, //选择商品数量
      productInfo: {}
    },
    style_select_show: false,
    goodsServices: [],
    shopping_cart_num: 0, //购物车 
    bigImgList: [], // 大图列表~具体根据点击情况动态填充对应的图片列表
    bigImgIndex: 0, // 默认大图轮播时从第一张开始
    showBigImg: false,
    favCommentRatio: '100%',
    sys_info: {},
    isLogin: app.LM.isLogin,
    packageNotEmpty: false,
    isSekillShow: false,
    showCountDown: true,
    fullPlay: false,
    fullPlay_embed: false,
    attr_show:false,
    cur_into_view:"",
    long_tip_x:0,
    long_tip_y:0,
    saleStatus:true,
    fixBox:[{
      title:"商品",
      id:"head",
      index:0,
      top:0,
      h:0
    },{
      title:"详情",
      id:"desc",
      index:2,
      top:0,
      h:0
    }],
    fixCurId:"head",
    fixOpacity:0,
    isHideFixBox:false
  },
  getDetails: true,
  goods_id: 0,
  buy_type: "",
  videoContext: "",
  staffInfo: {},
  colorNum:1,
  onLoad: function (options) {
    let bInfo = this.data.brand_info || {};
    let detail_share = bInfo.icon_url + "micro_mall/detail_share.png?123";
    let start_icon_active = bInfo.icon_url + "micro_mall/comment/start_icon_active.png";
    let start_icon = bInfo.icon_url + "micro_mall/comment/start_icon.png";
    let isCollect_img = bInfo.icon_url + "micro_mall/isCollect.png";
    let noCollect = bInfo.icon_url + "micro_mall/noCollect.png";
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    let rightbutton = bInfo.icon_url + "micro_mall/rightbutton.png";
    let sk_color = bInfo.style.sk_color || {};
    this.setData({
      sk_color: sk_color,
      detail_share: detail_share,
      isCollect_img: isCollect_img,
      noCollect: noCollect,
      rightbutton: rightbutton,
      start_icon_active: start_icon_active,
      start_icon: start_icon,
      goods_id: options.goods_id,
      ls_icon2: ls_icon2,
      ls_icon1: ls_icon1
      // showImg: false
    });
    this.options = options;
    this.screenHeight = app.SIH.screenHeight||0;
    this.assembleOptions();
  },
  onShow() {
    this.onShowRun = true;
    // let paramsJson = app.PH.paramsJson("options") || {};
    // getShipStore.call(this);
    // getCartNum.call(this);
    listen.call(this);
  },
  assembleOptions(){
    let scene = this.options.scene;
    if (scene) {
      app.SHP.getParams(["goods_id", "issued_id", "img_color", "staffCode"]).then((params) => {
        this.options = {
          ...this.options,
          ...params
        }
        onShowEvent.call(this, this.options);
      })
    } else if (this.options.q && this.options.scancode_time) {
      let urlParams = MyStr.getUrlParam(this.options.q);
      this.options = {
        ...this.options,
        ...urlParams
      }
      onShowEvent.call(this, this.options);
    } else {
      onShowEvent.call(this, this.options);
    }
  },
  onHide() {
    this.onHided = true;
    unListen.call(this);
    stopCountDown.call(this);
  },
  onUnload() {
    this.onHided = true;
    clearTimeout(this.delayDetailId);
    clearTM.call(this);
    unListen.call(this);
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    delete userChoiceData.idProductChooseGoods;
    delete userChoiceData.chooseGoods;
    app.StorageH.set("userChoiceData", userChoiceData)
  },
  onReady: function () {
    // this.initVideoId = setTimeout(function () {
    //   this.initVideo();
    // }.bind(this), 500);
  },
  preView(e){
    let swiper_current = this.data.swiper_current || 0;
    let color_img = this.data.color_img || {};
    let select_goods = this.data.select_goods || {};
    let urls = color_img[select_goods.select_color_id || this.data.defaultColor];
    let imgs = [];
    for (let i = 0; i < urls.length; i++){
      imgs.push(urls[i].img_url)
    }
    wx.previewImage({
      current: urls[swiper_current].img_url,
      urls: imgs,
    })
  },
  chooseSpecView(){
    let options = this.options || {};
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    let chooseGoods = userChoiceData.chooseGoods || {}
    let idProductChooseGoods = userChoiceData.idProductChooseGoods || {};
    if(!options.goodsId || !options.isFit) return;
    return app.GoodsApi.getActivityGoodsProduct({
      data:{
        "activityId": options.activityId,
        "goodsId": options.goodsId,
        "needGallery": 1,
        "userToken": app.LM.userToken,
        "brandCode": app.Conf.BRAND_CODE
      },
      other:{
        isShowload:true
      }
    }).then(res=>{
      if(res.code == 1){
        let data = res.data || {};
        let ListGoodsProductInfo = data.ListGoodsProductInfo || [];
        let defaultProductId = 0;
        //换算每个规格剩余可选数量
        for(let i = 0; i < ListGoodsProductInfo.length; i++){
          let activtyProductId = ListGoodsProductInfo[i].activtyProductId || 0;
          ListGoodsProductInfo[i].product_id = activtyProductId;
          let product_number = parseInt(ListGoodsProductInfo[i].product_number);
          let selectNumber = (idProductChooseGoods[activtyProductId] && idProductChooseGoods[activtyProductId].number) || 0;
          let limitNum = Math.min((chooseGoods.mixNum - selectNumber), product_number);
          ListGoodsProductInfo[i].product_number = limitNum;
          if(!defaultProductId && limitNum > 0){
            defaultProductId = activtyProductId
          }
          //
        }
        this.specView = this.specView || this.selectComponent("#specView");
        this.specView && this.specView.initData({
          isCustom: 1,
          product_id: defaultProductId,
          data: data
        });
        return Promise.resolve(res);
      }
      return Promise.reject(res);
    })
  },
  confirmSpec(e){
    let detail = e.detail || {};
    this.setData({
      select_goods: detail
    })
    let userChoiceData = app.StorageH.get("userChoiceData") || {};
    userChoiceData.select_goods = detail;
    app.StorageH.set("userChoiceData", userChoiceData)
    app.SMH.showToast({
      title: "返回超值购中..."
    })
    setTimeout(()=>{
      wx.navigateBack();
    }, 2000);
  },
  // shipSelect(e){
  //   let selectShipInfo = JSON.parse(JSON.stringify(this.data.selectShipInfo || {}));
  //   let selectIndex = selectShipInfo.selectIndex;
  //   let dataset = e.currentTarget.dataset || {};
  //   this.setData({
  //     "selectShipInfo.selectIndex": dataset.index || 0
  //   })
  //   if (selectIndex != dataset.index){
  //     getSumaryGoodsProductInfo.call(this,this.options);
  //   }
  // },
  // selectStore(){
  //   let selectShipInfo = this.data.selectShipInfo || {};
  //   let store_id = selectShipInfo.id || 0;
  //   // let key_word = selectShipInfo.key_word || "";
  //   let select_goods = this.data.select_goods || {}
  //   let goodsExtend = this.data.goodsExtend || {}
  //   let productInfo = select_goods.productInfo || {};
  //   let pId = productInfo.product_id||0;
  //   if(!pId){
  //     let tip;
  //     if (goodsExtend.attr_count == 2) {
  //       tip = `请选择${!select_goods.select_color_id ? goodsExtend.color_name_title : goodsExtend.size_name_title}`
  //     }else{
  //       tip = `请选择${goodsExtend.color_name_title||"完整规格"}`
  //     }
  //     app.SMH.showToast({
  //       title:tip
  //     })
  //     return
  //   }
  //   wx.navigateTo({
  //     url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&pId=${pId}&goodsNum=${select_goods.select_goods_count || 1}`,
  //   })
  // },
  onPageScroll(e){
    // console.log(e.scrollTop);
    if(this.limitScroll)return
    this.scrollTop = (e.scrollTop || 0);
    let opacity = parseFloat(this.scrollTop/(this.screenHeight/3));
    if(!(opacity >=1 && this.data.fixOpacity>=1)){
      this.setData({
        fixOpacity:opacity>=1?1:opacity
      })
    }
    //高亮定位
    let fixBox = this.data.fixBox||[];
    let curId = this.data.fixCurId; 
    // console.log(this.scrollTop,fixBox)
    fixBox.some(item=>{
      if(this.scrollTop>=item.top && this.scrollTop<=(item.top+item.h)){
        if(curId!=item.id){
          this.setData({
            fixCurId:item.id
          })
          console.log('fixCurId',this.data.fixCurId)
        }
        return true;
      }
    })
  },
  scrollTolowerHandle(e) {},

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function (res) {
  //   let goods_info = this.data.goods_info;
  //   let goods_id = this.goods_id;
  //   let issued_id = this.options.issued_id || 0;
  //   console.log("route",this.route);
  //   let path = this.route + '?goods_id=' + goods_id + '&issued_id=' + issued_id;
  //   if (res.form == 'button') { }
  //   let position = issued_id ? "SECKILL" : "GOODS";
  //   this.addActionLog("GOODS_SHARE", position,{
  //     issued_id: issued_id || 0,
  //     goods_id: goods_id
  //   })
  //   return {
  //     addActionName:"GOODS_SHARE",
  //     shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL ,
  //     title: goods_info.goods_name,
  //     path: path,
  //     imageUrl: goods_info.goods_img,
  //     success: function (res) {
  //       // 转发成功
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }

  //   }
  // },
  handleShowBigImg: function (e) {
    const itemIndex = e.target.dataset.itemindex;
    const imgIndex = e.target.dataset.imgindex;
    this.setData({
      showBigImg: true,
      bigImgList: this.data.commentList[itemIndex].imgList,
      bigImgIndex: imgIndex
    });
  },

  handlehideBigImg: function () {
    this.setData({
      showBigImg: false,
    });
  },
  /*** 轮播切换*/
  changeSwiper: function (e) {
    console.log('changeSwiper',e)
    var swiper_current = e.detail.current;
    this.setData({
      swiper_current: swiper_current
    })
  },
  /*
   *加入收藏
   */
  collectEvent: function () {
    if (app.LM.isLogin) {
      let options = this.options;
      let isCollect = this.data.isCollect;
      console.log(isCollect);
      let act = "",
        reqData = {};
      if (isCollect == 1) {
        act = "delFavGoodsLog";
        reqData = {
          "goodsId": options.goodsId,
          "logId": 0,
          "userToken": app.LM.userToken,
          "brandCode": app.Conf.BRAND_CODE
        }
      } else {
        act = "addFavGoodsLog";
        reqData = {
          "goodsId": options.goodsId,
          "userToken": app.LM.userToken,
          "brandCode": app.Conf.BRAND_CODE
        }
      }
      return app.GoodsApi[act]({
        data: reqData,
        other: {
          isShowLoad: true
        }
      }).then(e => {
        if (e.code == "1") {
          let txt;
          if (isCollect == 1) {
            txt = "已取消收藏";
            this.setData({
              isCollect: 0
            })
          } else {
            txt = "已收藏";
            this.setData({
              isCollect: 1
            })
          }
          app.SMH.showToast({
            title: txt,
          })

        }
      })
    }
  },
  // addToCart: function (e) {
  //   // //授权
  //   createShoppingCart.call(this).then(e => {
  //     getCartNum.call(this)
  //   });
  // },
  // getShare() {
  //   this.shareModule = this.shareModule || this.selectComponent("#shareModule");
  //   this.shareModule.checkIfStaffDstb();
  // },
  // chooseShareType(data) {
  //   let goods_gallery = this.goods_gallery;
  //   let goods_info = this.data.goods_info;
  //   let detail = data.detail;
  //   if (!!(goods_info.max_poster_price)){
  //     goods_info.max_price = goods_info.max_poster_price;
  //   }
  //   if (!!(goods_info.min_poster_price)){
  //     goods_info.min_price = goods_info.min_poster_price;
  //   }
  //   this.shareImg = this.shareImg || this.selectComponent("#shareImg");
  //   let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
  //   let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
  //   let allData = {
  //     info:{
  //       imgUrl: goods_info.goods_img,
  //       goodsInfo: goods_info,
  //       opKind:opKind,
  //     },
  //     scene: {
  //       "shareType": shareType,
  //       "goods_id": goods_info.goods_id,
  //       "issued_id": this.options.issued_id,
  //       'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
  //     },
  //     draw: {
  //       template: "goods"
  //     },
  //   }
  //   this.staffInfo = detail.staffInfo
  //   this.setData({
  //     allData: allData
  //   })
  //   this.shareImg.show();

  // },
  // checkIfStaffDstbCallBack(data) {
  //   let detail = data.detail;
  //   this.staffInfo = detail.staffInfo
  // },
  /**
   * ---------分销
   */
  // initVideo() {
  //   this.videoContext = this.videoContext || wx.createVideoContext('goods_video');
  // },
  // handleService: function (e) {
  //   this.server = this.selectComponent('#service')
  //   this.server.show();
  //   this.server.getGoodsServiceData(this.data.goodsServices);
  // },
  // jump_comment: function (e) {
  //   wx.navigateTo({
  //     url: `/pages/micro_mall/comment/goods_comment_list/goods_comment_list?goods_id=${this.goods_id}`,
  //   })
  // },
  // jump_list: function (e) {
  //   wx.navigateTo({
  //     url: `/pages/micro_mall/goods_collocation/collocation_list/collocation_list?goods_id=${this.goods_id}`,
  //   })

  // },
  // collocationJump: function (e) {
  //   let package_id = e.currentTarget.dataset.id || 0;
  //   wx.navigateTo({
  //     url: `/pages/micro_mall/goods_collocation/goods_collocation?package_id=${package_id}`,
  //   })
  // },
  // handle_v_play(e){
  //   fullScreenToggle.call(this, e, true);
  // },
  // handle_v_pause(e){
  //   fullScreenToggle.call(this, e, false);
  // },
  // handle_v_end(e){
  //   this.toggleFnc(0, false, { type:"toggle",setFalse:true });
  // },
  onTap(e){
    if(this.isLoadingTap)return;
    isLoadingTap.call(this,350);
    let dataset = e.currentTarget.dataset || {};
    let index = dataset.index || 0;
    let type = dataset.type || "";
    let label = dataset.label || "";
    if (type == "attr"){
      this.setData({
        attr_show: !this.data.attr_show
      })
    }else if (type == "toggle" || type == "mute" || type == "fullScreen") {
      this.toggleFnc(index, true, { type,label});
    }else if(type == 'keepVideo'){
      if(this.lockVideoKeep)return
      AS.checkAuthorize('scope.writePhotosAlbum', ()=>{
        console.log('keepVideo');
        longTipAnim.call(this,false);
        keepVideo.call(this)
      }, ()=>{
        this.lockVideoKeep = false;
        this.setData({
          showTip:""
        });
        app.SMH.showToast({
          title:"保存失败"
        })
      }, true); 
    }else if(type == 'fixTap'){
      let id = dataset.id || 0;
      let top = dataset.top || 0;
      let fixCurId = this.data.fixCurId;
      if(fixCurId != id){
        this.setData({
          fixCurId: id,
          fixOpacity:1,
          // cur_into_view: id
        })
        setFixLimit.call(this,true);
        anchorFixed.call(this,top>=0?top:0);
        // console.log(this.data.fixCurId,this.data.fixCurId,top)
      }
    }
  },
  scrolltoupper(e){
    this.limitScroll = true;
    setTimeout(() => {
      this.setData({
        fixOpacity:0,
      })
      this.limitScroll = false;
    }, 100);
  },
  longTap(e){
    // console.log('longTap',e,app.SIH.systemInfo);
    longTipAnim.call(this,true,e.detail||{});
  },
  toggleFnc(index=0,action = true, obj = {}) {
    let label = index || 0;
    obj = obj || {};
    let arr = this.videoContextArr || [];
    let data = this.data.video_list || [];
    if (!data[index]) {
      return
    }
    if (obj.type == "toggle") {
      if (data[index].toggle || obj.setFalse) {
        data.forEach((item, i) => {
          item.toggle = false;
          if(obj.label == "goods"){
            item.showCover = true;
          }
          (action || obj.fullScreenSet) && arr[i].pause();
        })
      } else if (!data[index].toggle || obj.setTrue) {
        data.forEach((item, i) => {
          if (label == i) {
            item.toggle = true;
            item.showCover = false;
            (action && !obj.fullScreenSet) && arr[i].play();
          } else {
            item.toggle = false;
            (action || obj.fullScreenSet) && arr[i].pause();
          }
        })
      };
    } else if (obj.type == "mute") {
      data[index].muteActive = !data[index].muteActive;
    } else if (obj.type == "fullScreen") {
      data[index].fullScreen = !data[index].fullScreen;
      action && arr[index] && arr[index].requestFullScreen();
    }
    this.setData({
      video_list: this.data.video_list || {}
    })
  },
  fullscreenchange(e) {
    let dataset = e.currentTarget.dataset || {};
    let detail = e.detail || {};
    let index = dataset.index || 0;
    let arr = this.videoContextArr || [];
    let v_info = arr[index] || {};
    let data = this.data.video_list || [];
    data[index] && (data[index].fullScreen = detail.fullScreen || detail.fullscreen || false);
    this.setData({
      [`video_list[${index}]`]: this.data.video_list[index] || {}
    })
  },
  commentEvent(e){
    let detail = e && e.detail;
    if(detail){
      let fixBox = this.data.fixBox||[];
      fixBox.splice(1,0,{
        title:"评论",
        id:"comments",
        index:1,
        top:0
      });
      setTimeout(() => {
        getFixQuery.call(this,()=>{
          this.setData({
            fixBox:this.data.fixBox
          });
        });
      }, 1000);
    }
  },
  _noFn(){},

}))
//
function onShowEvent(ops) {
  let goods_id = ops.goods_id;
  return getSumaryGoodsDetailData.call(this, ops).then(e => {
    // this.commission = this.commission || this.selectComponent("#commission");
    // return this.commission.getCommission("NORMAL", goods_id, ops.issued_id);
  }).finally(()=>{
    let goods_info = this.data.goods_info || {};
    if(goods_info.is_on_sale == 0) return;
    let time = 500;
    Utils.delay(time + 500).then(()=>{
      getFixQuery.call(this);
      // loadComments.call(this);
      // addGoodsVisitLog.call(this, ops);
      showPriceExplain.call(this);
      // if (!this.checkPromote) {
      //   getGoodsPromotionInfo.call(this,goods_id);
      // }
    })
    Utils.delay(time + 1000).then(()=>{
      setTimeout(() => {
        getFixQuery.call(this);
      }, 2000);
      // param_Attr_List.call(this);
      // getVideoList.call(this);
      // is_show_share_info.call(this);
      // this.couponTip = this.couponTip || this.selectComponent("#couponTip");
      // this.couponTip.getTipData(goods_id);
      // getGoodsActivityPrice.call(this, goods_id);
      // getDiscountActivityPrice.call(this, goods_info);
    })
    //
    // if (!this.embedLoad){
    //   checkEmbedCustom.call(this).then(resData=>{
    //     let that = this;
    //     this.setData({
    //       showEmbed : true
    //     })
    //     wx.nextTick(()=>{
    //       that.embedCustom = that.embedCustom || that.selectComponent('#embedId');
    //       that.embedCustom.getPageData(resData);
    //     })
    //   })
    // }
  });
}


// function getShipStore(){
//   let select_store = app.StorageH.get("select_store") || {};
//   if (select_store.id){
//     let selectShipInfo = this.data.selectShipInfo || {};
//     let goods_info = this.data.goods_info || {};
//     let store_id = selectShipInfo.id;
//     select_store.selectIndex = 1;
//     this.setData({
//       selectShipInfo: select_store
//     })
//     //不是仅限们店自提，从没选择到选择门店，刚好处于选择规则的状态
//     if (store_id != select_store.id && this.style_select_show && goods_info.self_get != 2) {
//       getSumaryGoodsProductInfo.call(this,this.options);
//     }
//   }
// }

function getSumaryGoodsDetailData(options = {}) {
  return app.GoodsApi.getActivityGoodsDetail({
    params: {
      goodsId: options.goodsId || 0,
      activityId: options.activityId || 0,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let goods_info = data.goods_info;
      if (goods_info.is_on_sale == 0){
        app.SMH.showToast({
          "title": "商品已下架"
        })
        this.setData({
          goods_info: goods_info
        })
        return Promise.reject();
      }
      let goods_gallery = data.goods_gallery;
      let select_goods = this.data.select_goods;
      let isCollect = goods_info.is_fav_goods;
      let goods_id = goods_info.goods_id;
      let _that = this;
      let color_img = createObjKeyVal.call(this, goods_gallery, "color_id") || {};
      let defaultColor = (options.color_id && parseInt(options.color_id)) || goods_info.color_id || (goods_gallery && goods_gallery[0] && goods_gallery[0].color_id) || 0;
      if (goods_gallery && goods_gallery.length>1){
        initImgArr.call(this, goods_gallery, color_img, defaultColor);
      }
      // let saleStatus = !goods_info.begin_sale_time? true : MyDate.parse(goods_info.begin_sale_time) < MyDate.parse(goods_info.server_time);
      // if (goods_info.sale_type == "5") {
      //   showAddCart.call(this);
      // }
      let customData = this.data.customData || {};
      customData.goodsId = {
        goodsId: goods_id
      };
      this.goods_video = this.data.brand_info.videoUrl  + goods_info.video_url;
      if (goods_info.video_url){
        let context = this.videoContext || wx.createVideoContext('goods_video');
        this.videoContextArr = this.videoContextArr || [];
        this.video_list = this.video_list || [];
        this.videoContextArr.push(context);
        let temp = {
          videoPath: this.goods_video,
          toggle:false,
          showCover:true,
          muteActive:false,
          fullScreen:false
        };
        this.video_list.push(temp);
      }
      this.goods_gallery = goods_gallery || {};
      this.goods_id = goods_id;
      goods_info.goods_desc = goods_info.goods_desc.replace(/<img/g, '<img class="rich_text_img" ');
      goods_info.scoreStr = StrH.numberCarryBit(goods_info.score);
      checkSalesVolume.call(this);
      if(goods_info.goods_desc){
        wx.nextTick(()=>{
            WxParse.wxParse('goodsDesc', 'html', goods_info.goods_desc, this, 0);
        })
      }
      if(goods_info.size_desc){
        wx.nextTick(()=>{
            WxParse.wxParse('sizeDesc', 'html', goods_info.size_desc, this, 0);
        })
      }
      this.setData({
        goods_gallery: goods_gallery,
        color_img: color_img,
        defaultColor:defaultColor,
        goods_info: goods_info,
        video: this.goods_video,
        select_goods: select_goods,
        isCollect: isCollect,
        customData: customData,
        colorNum:this.colorNum,
        video_list: this.video_list,
        // saleStatus
      })
    setCardInfo.call(this,goods_info);
      this.delayDetailId = setTimeout(()=>{
        this.scrollTolowerHandle();
      },500)
      return Promise.resolve(e);
    } else if (e.code == "-1") {
      app.SMH.showToast({
        "title": e.msg
      })
      return Promise.reject();
    }
    return Promise.reject();
  }).finally(()=>{
    if (this.data.pageHidden){
      this.setData({
        pageHidden: false
      })
    }
  })
}
function setCardInfo(goods_info){
  let ops = this.options || {};
  let cardInfo = {
    title: goods_info.goods_name,
    img: goods_info.goods_img,
    showCard: true
  }
  this.setData({
    cardInfo: cardInfo
  })
}
// //获取促销
// function getGoodsPromotionInfo(goods_id){
//   this.promoteList = this.promoteList || this.selectComponent("#promoteList");
//   this.promoteList.getGoodsPromotion(goods_id);
// }
//获取规格
// function getSumaryGoodsProductInfo(options = {}, click_type) {
//   let selectShipInfo = this.data.selectShipInfo || {};
//   let reqUrl = ""; 
//   let params = {
//     goodsId: options.goods_id,
//     userToken: app.LM.userToken,
//     brandCode: app.Conf.BRAND_CODE
//   }
//   if (selectShipInfo.id && selectShipInfo.selectIndex == 1){
//     reqUrl = "getSumaryGoodsProductInfoByShippingStore";
//     params.storeId = selectShipInfo.id;
//   }else{
//     reqUrl = "getSumaryGoodsProductInfo";
//     params.issueId = options.issued_id || 0,
//     params.colorId = 0;
//   }
//   return app.GoodsApi[reqUrl]({
//     params: params,
//     other: {
//       isShowLoad: true
//     }
//   }).then(e => {
//     if (e.code == "1") {
//       let data = e.data;
//       let TotalInfo = data.GoodsTotalInfoEntity || {};
//       let ProductList = data.ListGoodsProductInfo || {};
//       let goodsExtend = data.goodsExtend || {};
//       let select_goods = this.data.select_goods;
//       let color_spec = {},
//         size_spec = {},
//         color_size = {},
//         size_color = {},
//         color_arr = [],
//         size_arr = [];
//       this.TotalInfo = TotalInfo;
//       select_goods.productInfo = select_goods.productInfo && select_goods.productInfo.goods_id ? select_goods.productInfo : TotalInfo;
//       console.log('看看1',select_goods.productInfo && select_goods.productInfo.goods_id,select_goods.productInfo,TotalInfo)
//       for (let i = 0; i < ProductList.length; i++) {
//         let color_id = ProductList[i].color_id;
//         let product_number = parseInt(ProductList[i].product_number);
//         let color_item = {
//           color_id: color_id,
//           color_name: ProductList[i].color_name,
//           color_n: StrH.ellipsisStr(ProductList[i].color_name),
//           // product_number: ProductList[i].product_number
//         }
//         if (!color_spec[color_id]){
//           color_spec[color_id] = [];
//           color_arr.push(color_item)
//         }
//         color_spec[color_id].push(ProductList[i]);
//         let size_id = ProductList[i].size_id;
//         let size_item = {
//           size_id: size_id,
//           size_name: ProductList[i].size_name,
//           size_n: StrH.ellipsisStr(ProductList[i].size_name),
//           // product_number: ProductList[i].product_number
//         }
//         if (!size_spec[size_id]){
//           size_spec[size_id] = [];
//           size_arr.push(size_item)
//         } 
//         size_spec[size_id].push(ProductList[i]);


//         if (!color_size[color_id]){
//           color_size[color_id] = {
//             total_num: product_number
//           };
//         }else{
//           color_size[color_id]["total_num"] = color_size[color_id]["total_num"] ? color_size[color_id]["total_num"] + product_number : product_number
//         }
//         color_size[color_id][size_id] = ProductList[i];
//         if (!size_color[size_id]) {
//           size_color[size_id] = {
//             total_num: product_number 
//           };
//         }else{
//           size_color[size_id]["total_num"] = size_color[size_id]["total_num"] ? size_color[size_id]["total_num"] + product_number : product_number
//         }
//         size_color[size_id][color_id] = ProductList[i];

//       }
      
//       this.color_spec = color_spec || {};
//       this.size_spec = size_spec || {};
//       this.ProductList = ProductList || {};
//       this.setData({
//         color_size: color_size,
//         size_color: size_color,
//         goodsExtend: goodsExtend, 
//         select_goods: select_goods,
//         color_arr: color_arr,
//         size_arr: size_arr
//       })
//       getSpecNumMap.call(this);
//       showInventory.call(this);
//     }
//   })
// }
//
function getSpecNumMap(type="") {
  let color_spec = this.color_spec;
  let size_spec = this.size_spec;
  let select_goods = this.data.select_goods;
  let specList = this.ProductList;
  let goodsExtend = this.data.goodsExtend;
  if ((select_goods.select_color_id && select_goods.select_size_id) || (select_goods.select_color_id && goodsExtend.attr_count == 1)) {
    //选完
    let canSelectSpec = color_spec[select_goods.select_color_id];
    let size_arr = [],tem_size = {};
    let size_exsit = false;
    let check_exsit = false;
    for (let i = 0; i < canSelectSpec.length; i++) {
      if (goodsExtend.attr_count == 1) {
        select_goods.select_size_id = canSelectSpec[i].size_id;
        select_goods.productInfo = canSelectSpec[i];
        select_goods.select_color = select_goods.select_color || canSelectSpec[i].color_name
        break;
      } else {
        let size_id = canSelectSpec[i].size_id;
        !check_exsit && goodsExtend.attr_count == 2 && (check_exsit = true);
        !size_exsit && goodsExtend.attr_count == 2 && (size_exsit = (size_id == select_goods.select_size_id));
        if (!tem_size[size_id]){
          size_arr.push({
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true;
        }
        if (canSelectSpec[i].size_id == select_goods.select_size_id) {
          select_goods.productInfo = canSelectSpec[i] && JSON.parse(JSON.stringify(canSelectSpec[i])) || {};
          select_goods.select_color = select_goods.select_color || canSelectSpec[i].color_name
          // break;
        }
      }
    }
    if(check_exsit && !size_exsit){ //切换颜色，颜色中不包含当前已选中尺码的情况处理
      select_goods.productInfo && (select_goods.productInfo.product_id = 0); 
    }
    this.setData({
      size_arr: size_arr,
      select_goods: select_goods
    })

  } else { //单选
    let canSelectSpec = []; 
    let tl_info = this.TotalInfo||{};
    let min_m_price = tl_info.min_market_price,
        max_m_price = tl_info.max_market_price,
        min_price = tl_info.min_price,
        max_price = tl_info.max_price,
        min_point = tl_info.min_exchange_point,
        max_point = tl_info.max_exchange_point;
    let color_arr = [],
        size_arr = [],
        tem_color = {},
        tem_size = {};
    let productInfo = select_goods.productInfo; 
    if (select_goods.select_color_id) {
      canSelectSpec = color_spec[select_goods.select_color_id];
    } else if (select_goods.select_size_id) {
      canSelectSpec = size_spec[select_goods.select_size_id];
    }
    console.log(canSelectSpec,"canSelectSpec");
    for (let i = 0; i < canSelectSpec.length; i++) {
      if (select_goods.select_color_id) { //设置尺码
        let size_id = canSelectSpec[i].size_id;
        if (!tem_size[size_id]) {
          size_arr.push({
            size_id: size_id,
            size_name: canSelectSpec[i].size_name,
            size_n: StrH.ellipsisStr(canSelectSpec[i].size_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_size[size_id] = true
        }
      } else if (select_goods.select_size_id) { //设置颜色
        let color_id = canSelectSpec[i].color_id;
        if (!tem_color[color_id]){
          color_arr.push({
            color_id: color_id,
            color_name: canSelectSpec[i].color_name,
            color_n: StrH.ellipsisStr(canSelectSpec[i].color_name),
            product_number: canSelectSpec[i].product_number,
          })
          tem_color[color_id] = true
        }
        
      } 
      //获取价格区间
      let market_price = canSelectSpec[i].market_price;
      let sale_price = canSelectSpec[i].sale_price;
      let exchange_point = canSelectSpec[i].exchange_point;
      if (min_m_price == null || min_m_price > parseFloat(market_price)) {
        min_m_price = parseFloat(market_price).toFixed(2);
      }
      if (max_m_price == null || max_m_price < parseFloat(market_price)) {
        max_m_price = parseFloat(market_price).toFixed(2);
      }
      if (min_price == null || min_price > parseFloat(sale_price)) {
        
        min_price = parseFloat(sale_price).toFixed(2);
      }
      if (max_price == null || max_price < parseFloat(sale_price)) {
        max_price = parseFloat(sale_price).toFixed(2);
      }
      if (min_point == null || min_point > parseFloat(exchange_point)) {
        min_point = parseFloat(exchange_point).toFixed(2);
      }
      if (max_point == null || max_point < parseFloat(exchange_point)) {
        max_point = parseFloat(exchange_point).toFixed(2);
      }
    }
    if (select_goods.select_color_id) {
      this.setData({
        size_arr: size_arr
      })
    } else if (select_goods.select_size_id) {
      this.setData({
        color_arr: color_arr
      })
    }
    productInfo.max_exchange_point = max_point;
    productInfo.max_market_price = max_m_price;
    productInfo.max_price = max_price;
    productInfo.min_exchange_point = min_point;
    productInfo.min_market_price = min_m_price;
    productInfo.min_price = min_price;
    this.setData({
      select_goods: select_goods
    })

    console.log(this.data.select_goods,"select_goods");
  }
}

function showInventory(){
  app.sysTemConfig("goods_detail_show_inv_num").then(data=>{
    this.setData({
      inventoryConf: parseInt(data.Value) || 0
    })
  })
}
//获取购物车数量
function getCartNum() {
  if (!app.LM.isLogin) return;
  return app.BuyApi.getCartStoageCount({
    params: {
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(e => {
    if (e.code == 1) {
      if (e.code == "1") {
        this.setData({
          shopping_cart_num: e.data || 0
        })
      }
      return Promise.resolve(e);
    }
    return Promise.reject();
  })
}

function createShoppingCart(isCheckStore=false) {
  if (!app.LM.isLogin) return;
  let options = this.options;
  let select_goods = this.data.select_goods;
  let productInfo = select_goods.productInfo || {};
  let goods_info = this.data.goods_info;
  let goodsExtend = this.data.goodsExtend;
  let selectShipInfo = this.data.selectShipInfo || {};
  let tip = "";
  console.log(selectShipInfo,"selectShipInfo");
  if (!productInfo.product_id){
    if (goodsExtend.attr_count == 2 && goodsExtend) {
      tip = `请选择${!select_goods.select_color_id ? goodsExtend.color_name_title : goodsExtend.size_name_title}`
    }else{
      tip = `请选择${goodsExtend.color_name_title||"完整规格"}`
    }
  }  else if(!selectShipInfo.selectIndex && goods_info.self_get == 0){
    tip = "请选择配送方式" 
  }
  else if ((goods_info.self_get == 0 || goods_info.self_get == 1) && selectShipInfo.selectIndex == 1 && !selectShipInfo.id || (goods_info.self_get == 1 && !selectShipInfo.selectIndex)){
    tip = "请选择自提店铺"
  }
  if(tip){
    app.SMH.showToast({
      "title": tip
    })
    return Promise.reject();
  }
  if(isCheckStore){
    return Promise.resolve();
  }
  let issued_id = (goods_info.sale_type == "5" && goods_info.is_started == "0") ? 0 : options.issued_id;
  let goods_type = (goods_info.sale_type == "5" && goods_info.is_started == "0") ? productInfo.goods_type : goods_info.sale_type;
  return app.BuyApi.createBuyCarInsert({
    data: {
      "userToken": app.LM.userToken,
      "goods_id": goods_info.goods_id,
      "product_id": productInfo.product_id,
      "goods_number": select_goods.select_goods_count,
      "goods_type": goods_type,
      "brandCode": app.Conf.BRAND_CODE,
      "issued_id": issued_id || 0,
      "url_code": options.url_code || "",
      "is_buy_now": this.buy_type == 'now' ? 1 : 0,
      "shippingStoreId": selectShipInfo.selectIndex == 1 ? selectShipInfo.id : 0,
      "clientSessionId": app.LgMg.channel && app.LgMg.channel.clientSessionId,
      "visitLogId": app.LgMg.pageLog && app.LgMg.pageLog.logId
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      let data = e.data;
      checkFromType.call(this);
      if (this.buy_type) {
        var userChoiceData = app.StorageH.get('userChoiceData') || {};
        userChoiceData.rec_str = data;
        app.StorageH.set('userChoiceData', userChoiceData);
        let selectShipInfo = this.data.selectShipInfo || {};
        let store_id = selectShipInfo.id || 0;
        wx.navigateTo({
          url: '/pages/micro_mall/buy/buy?rec_str=' + data + '&store_id=' + store_id,
        })
      } else {
        app.SMH.showToast({
          "title": "加入成功"
        })
        setAnim.call(this);
      }
      return Promise.resolve(e);
    } else {
      app.SMH.showToast({
        "title": e.msg
      })
    }
    return Promise.reject();
  })
}


//加入足迹
function addGoodsVisitLog(options = {}) {
  if (!app.LM.isLogin) return;
  return app.GoodsApi.addGoodsVisitLog({
    data: {
      userToken: app.LM.userToken,
      goodsId: options.goods_id,
      brandCode: app.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == 1) {
      return Promise.resolve(e);
    } else {
      this.setData({
        nothing: true
      })
    }
  })
}


//数组转jSON
function createObjKeyVal(obj, key) {
  if (obj instanceof Array) {
    let json = {};
    for (let i = 0; i < obj.length;i++) {
      let Id = obj[i][key];
      if (!json[Id]) {
        json[Id] = [];
      }
      json[Id].push(obj[i])
    }
    return json;
  }
}

function listen() {
  app.LM.loginAsync().then(()=>{
    if (app.LM.isLogin != this.data.isLogin) {
      this.setData({
        isLogin: app.LM.isLogin
      });
    }
  })
}

function unListen() {
  clearTimeout(this.loadingId);
  app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
}
//倒计时
function startCountDown(startTime, endTime) {
  if (!this.countDown) {
    stopCountDown.call(this);
    this.countDown = new CountDown(MyDate.parse(startTime));
  }
  this.countDown.setTarget(MyDate.parse(endTime));
  setTime.call(this, this.countDown);
  if (!this.countDown.isRunning) {
    this.countDown.start(e => {
      if (e.value <= 0) {
        stopCountDown.call(this);
        onShowEvent.call(this, this.options).then(res=>{
          getSumaryGoodsProductInfo.call(this, this.options);
        });
      }
      setTime.call(this, e);
    });
  }
}

function stopCountDown() {
  if (this.countDown) {
    this.countDown.stop();
  }
}

function setTime(e) {
  let day = Math.floor(e.value / (60 * 60 * 24 * 1000));
  let hour = parseInt(e.value % (60 * 60 * 24 * 1000) / (1000 * 60 * 60));
  let minutes = parseInt((e.value % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = parseInt((e.value % (1000 * 60)) / 1000);
  let count_down = {
    day: day,
    hour: hour,
    min: minutes,
    sec: seconds
  }
  this.setData({
    count_down: count_down
  });
}

function get_GoodsPackageList() {
  return app.GoodsApi.get_GoodsPackageList({
    params: {
      goodsId: this.options.goods_id,
      pageIndex: 1,
      pageSize: 3,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res => {
    if (res.code == 1) {
      const data = res.data || {};
      let dataList = data && data.dataList || [];
      let packageNotEmpty = false;
      if (dataList.length >= 1) {
        packageNotEmpty = true
      }
      this.setData({
        package_list: dataList,
        packageNotEmpty: packageNotEmpty
      })
    }
  })
}

function showAddCart() {
  app.sysTemConfig("is_sekill_buy_cart_show").then(e => {
    this.setData({
      isSekillShow: e.Value
    });
  });
}

//
function showPriceExplain() {
  app.sysTemConfig("is_show_price_explain").then(res => {
    if (res.Value == "1") {
      app.sysTemConfig("brand_url").then(data1 => {
        app.sysTemConfig("goods_price_explain").then(data2 => {
          this.setData({
            priceExplain: data1.Value + data2.Value
          })
        })
      })

    }
  })
}


function countDownFn(goods_info) {
  let stime = MyDate.parse(goods_info.stime);
  let etime = MyDate.parse(goods_info.etime);
  let now_time = MyDate.parse(goods_info.server_time)
  let startTime = "",
    endTime = "";
  if (goods_info.is_started == "1") {
    startTime = goods_info.server_time;
    endTime = goods_info.etime;
    startCountDown.call(this, startTime, endTime);
  } else if (stime > now_time) {
    startTime = goods_info.server_time;
    endTime = goods_info.stime;
    this.setData({
      isBeginStart: true
    })
    startCountDown.call(this, startTime, endTime);
  }
}

function is_show_share_info() {
  if (!app.LM.isLogin) return;
  return app.DistrApi.staffInfo({
    params: {
      "brandCode": app.Conf.BRAND_CODE,
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data || {};
      let is_show_share_staffinfo = data.is_show_share_staffinfo == 0 ? false : true;
      this.setData({
        is_show_share_staffinfo: is_show_share_staffinfo
      });
      if (is_show_share_staffinfo) {
        readStaffLeader.call(this);
      }
    }
  })
}


function readStaffLeader() {
  let params = PH.paramsJson();
  if (params.options && params.options.query) {
    let query = params.options.query;
    if (query.staffCode && query.fromUser) {
      return app.DistrApi.getMyStaffDstbInfo({
        params: {
          "staffCode": query.staffCode,
          "brandCode": app.Conf.BRAND_CODE,
        }
      }).then(res => {
        this.setData({
          showStaffInfo: true,
          staffInfo: res.data || {}
        })
      })
    }
  }
}

function btn_load_fn() {
  let that = this;
  this.btn_loading = true;
  this.loadingId = setTimeout(() => {
    that.btn_loading = false;
  }, 500)
}


// function getGoodsPromotionInfo() {
//   let goodsId = this.options.goods_id || 0;
//   if (!goodsId) return;
//   let params = {
//     goodsId
//   };
//   return app.RunApi.go('GoodsApi', 'getGoodsPromotionRuleList', params).then(res => {
//     if (res.code == 1) {
//       let data = res.data || [];
//       if ((data && data.length <= 0)) {
//         this.setData({
//           checkPromote: false,
//         })
//         return
//       }
//       let promoteData = {}, tip1="",tip2="";
//       let promList = data;
//       for(let i = 0;i < promList.length; i++){
//         //
//         let promItem = [];
//         let conditionList = promList[i].conditionList || [];
//         for(let j = 0; j < conditionList.length;j++){
//           let giftList = conditionList[j].giftList || [];
//           for(let k = 0; k < giftList.length; k++){
//             let giftType = giftList[k].giftType;
//             promItem
//             //
//             if(this.limitRuleType[giftType] == "detail"){
//               tip1 = tip1 ? tip1 + "；" + giftList[k].giftTips : giftList[k].giftTips
//             }else{
//               if(tip2.indexOf(this.limitRuleType[giftType]) == -1){
//                 tip2 = tip2 ? tip2 + ";" + this.limitRuleType[giftType] : this.limitRuleType[giftType]
//               }
//             }
//           }
//         }
//       }
//       promoteData.tip1 = tip1;
//       promoteData.tip2Arr = tip2.split(";");
//       this.checkPromote = true;
//       this.setData({
//         checkPromote: (data && data.length > 0) || false,
//         promoteData: promoteData,
//         promoteArray: data,
//       })
//     }
//   })
// }


function clearTM() {
  clearTimeout(this.loadingId);
  clearTimeout(this.hideLoadId);
  // clearTimeout(this.initVideoId);
}

function checkEmbedCustom(){
  // test.call(this); 
  let params = {
    goodsId: this.options.goods_id || 0,
    brandCode:app.Conf.BRAND_CODE
  };
  let extra = {
    diy:true
  }
  return app.RunApi.go('GoodsApi','get_recommend_template_List',params,extra).then(res=>{
    if (res && res.code =='1' && res.data){
      this.embedLoad = true;
      return Promise.resolve(res.data);
    }
    console.log('reject', res);
    return Promise.reject();
  }).catch(e=>{
    this.embedLoad = true;
    console.log('catch:',e)
    return Promise.reject();
  })
}


function initImgArr(arr=[],obj={},col_id=""){
  let label = '';
  this.colorNum = 0;
  for (let item in obj){ 
    this.colorNum += 1;
    if(item==col_id){
      let temp = {};
      temp[item] = obj[item]
      label = item;
      this.setData({
        label
      });
    }
  }
}


// function getGoodsActivityPrice(goodsId) {
//   if (!goodsId) return;
//   return app.GoodsApi.getGoodsActivityPrice({
//     params: {
//       goodsId: goodsId,
//       userToken: app.LM.userToken,
//       brandCode: app.Conf.BRAND_CODE
//     }
//   }).then(res => {
//     if (res.code == 1) {
//       let data = res.data||[];
//       let goods_info = this.data.goods_info || {};
//       this.activityTipFirst = this.activityTipFirst || this.selectComponent("#activityTipFirst");
//       this.activityTipFirst.loadData(data, goodsId,goods_info.server_time);
//       this.activityTipSecond = this.activityTipSecond || this.selectComponent("#activityTipSecond");
//       this.activityTipSecond.loadData(data, goodsId,goods_info.server_time);
//     }
//   })
// }
// function getDiscountActivityPrice(goods_info){
//   if(goods_info.sale_type == 4 && (goods_info.is_started == 0)){
//     let data = [{
//       isTeaser: false,
//       activityType: "DISCOUNT",
//       price: goods_info.price,
//       startTime: goods_info.stime
//     }]
//     this.discountActivityTip = this.discountActivityTip || this.selectComponent("#discountActivityTip");
//     this.discountActivityTip.loadData(data, goods_info.goods_id,goods_info.server_time);
//   }
// }

function checkFromType(){
  if (this.options.fromType == 'videoShop' && !this.alreadyAddCart) {
    this.alreadyAddCart = true;
    let params = {
      activityId: parseInt(this.options.issued) || 0,
      goodsId: parseInt(this.options.goods_id) || 0,
    }
    this.addActionLog('VIDEO_GOODS_DETAIL_ADDCART', 'SPXQ', params);
  }
}

function param_Attr_List(){
  return app.GoodsApi.get_Goods_Param_Attr_List({
    params:{
      goodsId: this.options.goods_id || 0,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: false
    }
  }).then(res=>{
    this.setData({
      attr_list:res.data||[]
    })
  })
}

function isLoadingTap(time=350){
  if (this.isLoadingTap)return
  this.isLoadingTap = true;
  this.isLoadingTapId = setTimeout(()=>{
    this.isLoadingTap = false
    clearTimeout(this.isLoadingTapId);
  }, time)
}

function getVideoList(){
  this.videoList = this.videoList || this.selectComponent('#videoList');
  this.videoList && this.videoList.loadData(this.options.goods_id || 0);
}
 
function fullScreenToggle(e, bool = false) {
  let dataset = e.currentTarget.dataset || {};
  let index = dataset.index || 0;
  let data = this.data.video_list || [];
  if (data[index] && data[index].fullScreen && (data[index].toggle != bool)) {
    this.toggleFnc(index, true, { type: "toggle", fullScreenSet: true });
  }
}

function setAnim(type){
  this.specPop = this.specPop || this.selectComponent('#specPop') ;
  if(type == "show"){
    this.style_select_show = true;
    this.specPop.setShow(); 
  }else {
    this.style_select_show = false;
    this.specPop.setHide();
  }
}

function checkSalesVolume(){
  app.sysTemConfig("is_show_goods_sales_volume").then(data=>{
    this.setData({
      showSalesVolume: data.Value||0
    })
  })
} 
 
// function loadComments() {
//   this.comments = this.comments || this.selectComponent('#comments');
//   this.comments.initData(this.options.goods_id);
// }

function longTipAnim(bool=false,dataset={}){
  if(bool){
    this.tipAnimId && clearTimeout(this.tipAnimId);
    this.setData({
      tip_anim_show:false,
      longTipShow:false,
    })
    wx.nextTick(()=>{
      let tipW = app.SIH.systemInfo.screenWidth / 750  * this.data.longTipW;
      let tipH = app.SIH.systemInfo.screenWidth / 750  * this.data.longTipH;
      let base = 16;
      let maxX =  dataset.x + tipW + base;
      let maxY =  dataset.y - tipH - base * 1.2;
      // let maxY =  dataset.y + tipH + 8;
      let x = maxX > app.SIH.systemInfo.screenWidth? (app.SIH.systemInfo.screenWidth - tipW) : dataset.x + base;
      let y = maxY > app.SIH.systemInfo.screenWidth? (app.SIH.systemInfo.screenWidth - tipH) : maxY;
      // let y = maxY > app.SIH.systemInfo.screenWidth? (app.SIH.systemInfo.screenWidth - tipH) : dataset.y + 8;
      this.setData({
        longTipShow:true,
        long_tip_x:x,
        long_tip_y:y,
      })
      wx.nextTick(()=>{
        this.setData({
          tip_anim_show:true,
        })
        this.tipAnimId = setTimeout(() => {
          longTipAnim.call(this,false)
        }, 2500);
      })
    }) 
  }else{
    clearTimeout(this.tipAnimId);
    this.setData({
      tip_anim_show:false
    })
    setTimeout(()=>{
      this.setData({
        longTipShow:false
      })
    },400)
  }
}

function keepVideo(){
  let path = this.data.video||"";
  if(path){
    this.setData({
      showTip:"保存中"
    })
    this.lockVideoKeep = true;
    return WxApi.downloadFile({
      url:path
    }).then(res=>{
      console.log('downloadFile',res);
      let tempPath = res && res.tempFilePath||"";
      return WxApi.saveVideoToPhotosAlbum({
        filePath: tempPath
      }).then(res=>{
        this.setData({
          showTip:""
        });
        let tip = res && res.errMsg && res.errMsg.indexOf('ok')!= -1 ? "保存成功" : "保存失败";
        this.setData({
          showTip:tip
        })
        this.showTipId = setTimeout(() => {
          this.setData({
            showTip:""
          })
          this.lockVideoKeep = false;
        }, 2000);
        return res
      }).catch(e=>{
        this.lockVideoKeep = false;
        this.setData({
          showTip:""
        })
        app.SMH.showToast({
          title:"保存失败"
        })
        return Promise.reject(e);
      })
    })
  }
} 

function getFixQuery(){
  let ids = [];
  let fixBox =  this.data.fixBox||[];
  fixBox.forEach(item=>{
    ids.push('#'+item.id); 
  })
  ids = ids.join(',');
  ids && this._getQuery(ids,'all').then(res=>{
    let arr = res[0]||[];
    arr.forEach((item,index)=>{
      // fixBox[index].top = (item.top||0) + (this.scrollTop||0);
      fixBox[index].top = (item.top||0) + (this.scrollTop||0) - (80*(app.SIH.screenWidth/750));
      fixBox[index].h = (item.height||0);
    })
    this.setData({
      fixBox 
    })
    console.log('resres',ids,res,this.data.fixBox);
  })
}

function setFixLimit(bool=true){
  if(this.limitScrollId){
    clearTimeout(this.limitScrollId);
    delete this.limitScrollId
  }
  if(bool){
    this.limitScroll = bool;
  }else{
    this.limitScrollId = setTimeout(() => {
      this.limitScroll = false;
    }, 100);
  }
}

function anchorFixed(params,type="top"){
  let data = {
    duration:400
  };
  if(type == 'top'){
    data.scrollTop = params;
  }else{
    data.selector = params; 
  }
  wx.pageScrollTo({
    ...data,
    complete:res=>{
      console.log('跳转',res);
      setTimeout(() => {
        setFixLimit.call(this,false);
      }, 100);
    }
  })
}