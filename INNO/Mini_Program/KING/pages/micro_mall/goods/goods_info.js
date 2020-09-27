// pages/micro_mall/goods/goods_info.js
// let WxParse = require("../../../wxParse/wxParse.js");
import MyDate from '../../../support/utils/date-util.js';
import MyStr from "../../../support/utils/string-util.js";
import {
  CountDown
} from "../../../helper/manager/timer-manager.js";
import PH from "../../../helper/handle/paramsHandle.js";
import StrH from "../../../helper/handle/strHandle.js";
import Utils from "../../../support/utils/utils";
let app = getApp();
let numArr = [1, 2, 3, 5];
let nameArr = ["满送优惠券", "满送赠品", "满免运费", "满送积分"]; //1=满送优惠券 、 2=满送赠品   3=满免运费   5=满送积分  
const PAGE_TYPE = "NORMAL_GOODS";
Page(app.BP({
  data: { 
    defaultImgArr:{},
    swiper_current: 0,
    isCollect: 0, //是否收藏
    goods_info: {},
    isBeginStart:false,
    color_img: [], //商品图片列表 
    // color_key_list: {}, //商品颜色
    // size_key_list: {}, //商品尺码
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
    commentList: [{
      'order_id': 1
    }, {
      'order_id': 2
    }],
    bigImgList: [], // 大图列表~具体根据点击情况动态填充对应的图片列表
    bigImgIndex: 0, // 默认大图轮播时从第一张开始
    // _maxCommentNum: 2,
    // showMoreComment: true,
    showBigImg: false,
    favCommentRatio: '100%',
    count_down: {
      day: 0,
      hour: 0,
      min: 0,
      sec: 0
    },
    sys_info: {},
    isLogin: app.LM.isLogin,
    packageNotEmpty: false,
    isSekillShow: false,
    showCountDown: true,
    fullPlay: false,
    fullPlay_embed: false,
    customData: {
      "now": {
        buy_type: "now"
      },
      "goodsId": {
        goodsId: ""
      }
    },
    //配送方式  0可全部，1仅限门店，2仅限快递配送（selectIndex一一对应）
    selectShipInfo:{
      selectIndex: 2
    }, 
    attr_show:false,
    cur_into_view:"",
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
    let g_home = bInfo.icon_url + "micro_mall/g_home.png";
    let carts = bInfo.icon_url + "micro_mall/carts.png";
    let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
    let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
    let g_reduce = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce.png";
    let g_reduce_none = bInfo.icon_url + "micro_mall/shopping_cart/g_reduce_none.png";
    let g_add = bInfo.icon_url + "micro_mall/shopping_cart/g_add.png";
    let g_add_none = bInfo.icon_url + "micro_mall/shopping_cart/g_add_none.png";
    let rightbutton = bInfo.icon_url + "micro_mall/rightbutton.png";
    let sk_color = bInfo.style.sk_color || {};
    this.setData({
      sk_color: sk_color,
      detail_share: detail_share,
      isCollect_img: isCollect_img,
      noCollect: noCollect,
      g_home: g_home,
      carts: carts,
      g_reduce: g_reduce,
      g_reduce_none: g_reduce_none,
      g_add: g_add,
      g_add_none: g_add_none,
      rightbutton: rightbutton,
      start_icon_active: start_icon_active,
      start_icon: start_icon,
      goods_id: options.goods_id,
      ls_icon2: ls_icon2,
      ls_icon1: ls_icon1
      // showImg: false
    });
    this.options = options;
    // checkDefaultSys.call(this);
    // app.StorageH.remove("select_store");
    this.assembleOptions();
  },
  onShow() {
    this.onShowRun = true;
    getShipStore.call(this);
    getCartNum.call(this);
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
      console.log("urlParams", urlParams)
      onShowEvent.call(this, this.options);
    } else {
      onShowEvent.call(this, this.options);
    }
  },
  handle_promote() {
    wx.navigateTo({
      url: `/pages/micro_mall/goods/promote_list/promote_list?goods_id=${this.options.goods_id || 0}`,
    })
  },
  onHide() {
    unListen.call(this);
    stopCountDown.call(this);
  },
  onUnload() {
    clearTimeout(this.delayDetailId);
    app.StorageH.remove("select_store");
    this.videoList && this.videoList.onUnloadFnc();
    clearTM.call(this);
    unListen.call(this);
    stopCountDown.call(this);
  },
  onReady: function () {
    this.initVideoId = setTimeout(function () {
      this.initVideo();
    }.bind(this), 500);

  },
  preView(e){
    let swiper_current = this.data.swiper_current || 0;
    let color_img = this.data.color_img || {};
    let select_goods = this.data.select_goods || {};
    let urls = color_img[select_goods.select_color_id];
    let imgs = [];
    for (let i = 0; i < urls.length; i++){
      imgs.push(urls[i].img_url)
    }
    wx.previewImage({
      current: urls[swiper_current].img_url,
      urls: imgs,
    })
    
  },
  shipSelect(e){
    let selectShipInfo = JSON.parse(JSON.stringify(this.data.selectShipInfo || {}));
    let selectIndex = selectShipInfo.selectIndex;
    let dataset = e.currentTarget.dataset || {};
    this.setData({
      "selectShipInfo.selectIndex": dataset.index || 0
    })
    if (selectIndex != dataset.index){
      getSumaryGoodsProductInfo.call(this,this.options);
    }
  },
  selectStore(){
    let selectShipInfo = this.data.selectShipInfo || {};
    console.log(selectShipInfo,"selectShipInfo");
    let store_id = selectShipInfo.id || 0;
    let key_word = selectShipInfo.key_word || "";
    let select_goods = this.data.select_goods || {}
    wx.navigateTo({
      url: `/pages/micro_mall/stores/store_nav?type=selectByGoods&select_store_id=${store_id}&loc_f=0&goods_id=${this.options.goods_id}&goodsNum=${select_goods.select_goods_count || 1}`,
    })
  },
  // pageScroll(e){
  //   let detail = e.detail || {};
  //   this.pageScrollTop = detail.scrollTop || 0;
  // },
  // scrollTouchStart(e){
  //   let touches = e.touches || [];
  //   this.touchY1 = parseFloat(touches[0].clientY) || 0;
  // },
  // scrollTouchMove(e) {
  //   let touches = e.touches || [];
  //   let touchY2 = parseFloat(touches[0].clientY) || 0;
  //   if (((this.touchY1 - touchY2) > 50) && (!this.pageScrollTop || this.pageScrollTop == 0)){
  //     this.scrollTolowerHandle();
  //   }
  // },
  scrollTolowerHandle(e) {
    // if (this.isShowDesc == true) return
    // if (!e && this.isShowDesc == true) return
    // this.scrollTime && clearTimeout(this.scrollTime);
    // this.scrollTime = setTimeout(()=>{
    //   let goods_info = this.data.goods_info || {};
    //   if (!this.data.reachBottom){
    //     this.setData({
    //       reachBottom:true
    //     })
    //   }
      // let that = this;
      // if (goods_info.goods_desc && !this.isShowDesc) {
      //   wx.nextTick(()=>{
      //       WxParse.wxParse('article', 'html', goods_info.goods_desc, that, 0);
      //       that.isShowDesc = true
      //   })
      // }
    //   clearTimeout(this.scrollTime);
    // },)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let goods_info = this.data.goods_info;
    let goods_id = this.goods_id;
    let issued_id = this.options.issued_id || 0;
    let path = '/pages/micro_mall/goods/goods_info?goods_id=' + goods_id + '&issued_id=' + issued_id;
    if (res.form == 'button') { }
    let position = issued_id ? "SECKILL" : "GOODS";
    this.addActionLog("GOODS_SHARE", position,{
      issued_id: issued_id || 0,
      goods_id: goods_id
    })
    return {
      addActionName:"GOODS_SHARE",
      shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL ,
      title: goods_info.goods_name,
      path: path,
      imageUrl: goods_info.goods_img,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }

    }
  },
  /**
   * 
   */
  handleScore(level) {
    let score = [true, true, true, true, true];
    for (let index = 0, len = score.length; index < len; index++) {
      if (index >= level) {
        score[index] = false;
      } else {
        score[index] = true;
      }
    }
    return score;
  },
  /**
   * 评论数据
   */
  loadCommentData: function (goodsId) {
    return app.GoodsApi.getGoodsCommentListOnline({
      params: {
        goodsId: goodsId,
        pageIndex: 1,
        pageSize: 2,
        brandCode: app.Conf.BRAND_CODE
      },
      other: {
        isShowLoad: true
      }
    }).then(e => {
      if (e.code == "1") {
        let data = e.data;
        if (!data) return Promise.reject();
        const commentData = data;
        commentData.comment_list.forEach((item) => {
          item.score = this.handleScore(item.comment_level);
          let imgList = [];
          for (let index = 1, len = 10; index < len; index++) {
            const key = `img${index}_path`;
            if (item[key]) {
              imgList.push(item[key]);
            }
            delete item[key];
          }
          item.imgList = imgList;
        });
        //
        this.setData({
          // showMoreComment: commentData.allCount > this.data._maxCommentNum,
          favCommentRatio: +commentData.fav_comment_ratio * 100 + '%',
          commentList: commentData.comment_list
        });
        return Promise.resolve(e);
      }
      // return Promise.reject();
    })
  },
  /**
   * 
   */
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

  /**
   *返回上一页
   */
  goBack: function () {
    wx.navigateBack();
  },
  /**
   * 轮播切换
   */
  changeSwiper: function (e) {
    console.log('changeSwiper',e)
    var swiper_current = e.detail.current;
    this.setData({
      swiper_current: swiper_current
    })
  },
  /**
   * 跳转购物车
   */
  toShoppingCart: function () {
    wx.navigateTo({
      url: '/pages/micro_mall/special_shopping/shopping_cart',
    });
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
          "goodsId": options.goods_id,
          "logId": 0,
          "userToken": app.LM.userToken,
          "brandCode": app.Conf.BRAND_CODE
        }
      } else {
        act = "addFavGoodsLog";
        reqData = {
          "goodsId": options.goods_id,
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
            // this.addActionLog("ADD_COLLECTION", "GOODS", {
            //   keyParam1: options.goods_id
            // });
          }
          app.SMH.showToast({
            title: txt,
          })

        }
      })
    }
  },
  /**
   * 显示属性选择框
   */
  showStylePop: function (e) {
    let dataset = e.currentTarget.dataset;
    let detail = e.detail || {};
    let buy_type = detail.buy_type;
    this.buy_type = buy_type;
    let click_type = dataset.click_type || "";
    // this.setData({
    //   style_select_show: 'isshow'
    // })
    getSumaryGoodsProductInfo.call(this, this.options, click_type);
    setAnim.call(this,"show"); 
  },
  /**
   * 关闭属性选择框
   */
  hideStylePop: function () {
    // this.setData({
    //   style_select_show: 'ishide',
    // })
    setAnim.call(this);
  },
  /**
   * 加入购物车
   */
  addToCart: function (e) {
    // //授权
    createShoppingCart.call(this).then(e => {
      getCartNum.call(this)
    });
  },
  /**
   * 颜色选择
   */
  colorSelect: function (e) {
    let dataset = e.currentTarget.dataset;
    let color_id = dataset.color_id;
    let color_name = dataset.color_name;
    let select_goods = this.data.select_goods;
    let that = this;
    if (color_id == select_goods.select_color_id) return;
    select_goods.select_color_id = color_id;
    select_goods.select_color = color_name;
    this.toggleFnc(0, true, { type:"toggle",setFalse:true });
    this.setData({
      swiper_current:0
    })
    wx.nextTick(()=>{
      that.setData({
        select_goods: select_goods
      })
    }) 
    // console.log('规格', select_goods, this.data.size_key_list, this.data.color_key_list)
    getSpecNumMap.call(this);
  },
  /**
   * 尺码选择
   */
  sizeSelect: function (e) {
    let dataset = e.currentTarget.dataset;
    let size_id = dataset.size_id;
    let size_name = dataset.size_name;
    let select_goods = this.data.select_goods;
    if (size_id == select_goods.select_size_id) {
      select_goods.select_size_id = 0;
      select_goods.select_size = "";
      select_goods.productInfo = {};
      this.setData({
        select_goods: select_goods,
      });
      getSpecNumMap.call(this);
      return
    };
    select_goods.select_size_id = size_id;
    select_goods.select_size = size_name;
    this.setData({
      select_goods: select_goods,
    });
    // console.log('规格2', select_goods, this.data.size_key_list, this.data.color_key_list)
    getSpecNumMap.call(this);
  },
  reduceGoodsNum(e) {
    // var select_goods = this.data.select_goods;
    // if (select_goods.select_goods_count > 1) {
    //   select_goods.select_goods_count--;
    //   this.setData({
    //     select_goods: select_goods
    //   })
    // }
    this.changeGoodsNum(e,"reduce")
  },
  inputGoodsNum(e){
    this.changeGoodsNum(e,"input")
  },
  addGoodsNum: function (e) {
    this.changeGoodsNum(e,"add")
    // let select_goods = this.data.select_goods || {};
    // let goodsExtend = this.data.goodsExtend || {};
    // let limit_count = select_goods.productInfo.product_number || 0;
    // if (goodsExtend.is_limit_buy == 1) {
    //   if (limit_count > goodsExtend.limit_buy_times) {
    //     limit_count = goodsExtend.limit_buy_times;
    //   }
    // }
    // if (select_goods.select_goods_count < limit_count) {
    //   select_goods.select_goods_count++;
    //   this.setData({
    //     select_goods: select_goods
    //   })
    // }
  },
  changeGoodsNum(e,click_type){
    click_type = click_type + "";
    let warn = "";
    let select_goods = this.data.select_goods;
    let num = 1;
    let o_num = parseInt(select_goods.select_goods_count) || 1;
    let goodsExtend = this.data.goodsExtend || {};
    let limit_count = select_goods.productInfo && parseInt(select_goods.productInfo.product_number) || 1;
    if (goodsExtend.is_limit_buy == 1 && limit_count > parseInt(goodsExtend.limit_buy_times)) {//获取最大数量限制
      limit_count = goodsExtend.limit_buy_times;
    }
    switch(click_type){
      case "input":
        let value = e.detail && parseInt(e.detail.value);
        if(value > o_num){
          if (value < limit_count) {//add
            num = value;
          }else{
            num = limit_count;
            warn = "超出了最大可选数量"
          }
        }else{//reduce
          if( value > 1 ){
            num = value;
          }else{
            num = 1
          }
        }
        break;
      case "add":
        if (o_num < limit_count) {
          num = o_num + 1;
        }else{
          return;
        }
        break;
      case "reduce":
        if ( o_num > 1 ) {
          num = o_num - 1;
        }else{
          return;
        }
        break;
      default:
          console.log("未知类型",click_type);
        return;
    }
    if(warn){
      app.SMH.showToast({
        title: warn
      })
    }
    this.setData({
      "select_goods.select_goods_count": num
    })
  },
  goIndexLink: function () {
    wx.switchTab({
      url: '../index/index',
    })
  },
  /**
   * ---------分销
   */
  getShare() {
    this.shareModule = this.shareModule || this.selectComponent("#shareModule");
    this.shareModule.checkIfStaffDstb();
  },
  chooseShareType(data) {
    let goods_gallery = this.goods_gallery;
    let goods_info = this.data.goods_info;
    let detail = data.detail;
    if (!!(goods_info.max_poster_price)){
      goods_info.max_price = goods_info.max_poster_price;
    }
    if (!!(goods_info.min_poster_price)){
      goods_info.min_price = goods_info.min_poster_price;
    }
    this.shareImg = this.shareImg || this.selectComponent("#shareImg");
    let opKind = app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL;
    let shareType = app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL;
    let allData = {
      info:{
        imgUrl: goods_info.goods_img,
        goodsInfo: goods_info,
        opKind:opKind,
      },
      scene: {
        "shareType": shareType,
        "goods_id": goods_info.goods_id,
        "issued_id": this.options.issued_id,
        'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : ""
      },
      draw: {
        template: "goods"
      },
    }
    this.staffInfo = detail.staffInfo
    this.setData({
      allData: allData
    })
    this.shareImg.show();

  },
  checkIfStaffDstbCallBack(data) {
    let detail = data.detail;
    this.staffInfo = detail.staffInfo
  },
  /**
   * ---------分销
   */
  /**
   * 初始化视频
   */
  initVideo() {
    this.videoContext = this.videoContext || wx.createVideoContext('goods_video');
  },
  handleService: function (e) {
    this.server = this.selectComponent('#service')
    this.server.show();
    this.server.getGoodsServiceData(this.data.goodsServices);
  },
  jump_comment: function (e) {
    wx.navigateTo({
      url: `/pages/micro_mall/comment/goods_comment_list/goods_comment_list?goods_id=${this.goods_id}`,
    })
  },
  jump_list: function (e) {
    wx.navigateTo({
      url: `/pages/micro_mall/goods_collocation/collocation_list/collocation_list?goods_id=${this.goods_id}`,
    })

  },
  collocationJump: function (e) {
    let package_id = e.currentTarget.dataset.id || 0;
    wx.navigateTo({
      url: `/pages/micro_mall/goods_collocation/goods_collocation?package_id=${package_id}`,
    })
  },
  handle_v_play(e){
    fullScreenToggle.call(this, e, true);
  },
  handle_v_pause(e){
    fullScreenToggle.call(this, e, false);
  },
  handle_v_end(e){
    this.toggleFnc(0, false, { type:"toggle",setFalse:true });
  },
  /*
   *查看多色 
   */
  MultiColorSwitch: function () {
    var Multicolor = this.data.Multicolor;
    Multicolor.c_switch = !Multicolor.c_switch;
    this.setData({
      Multicolor: Multicolor
    })
  },

  /**
   * 切换多色
   */
  changeGoodsColor: function (e) { 
    let that = this;
    // let color_id = e.target.dataset.color_id;
    let color_id = e.detail.color_id || 0; 
    // let color_key_list = this.data.color_key_list;
    let select_goods = this.data.select_goods;
    if(color_id != select_goods.select_color_id){
      this.toggleFnc(0, true, { type:"toggle",setFalse:true });
    }
    this.setData({
      swiper_current:0
    })
    let name = this.data.color_img[color_id] && this.data.color_img[color_id][0] && this.data.color_img[color_id][0].color_name || ''
    wx.nextTick(() => {
      select_goods.select_color_id = color_id;
      select_goods.select_color = name;
      that.setData({
        select_goods: select_goods
      })
    })
  },
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
    }
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
  videoJump(){
    setTimeout(()=>{
      this.setData({
        cur_into_view: "videoList"
      })
    },300)
  },
  _noFn(){},

}))
//
function onShowEvent(ops) {
  let goods_id = ops.goods_id;
  return getSumaryGoodsDetailData.call(this, ops).then(e => {
    let staffInfo = app.LM.staffInfo || {};
    if (staffInfo.isStaffDstbData) {
      return Promise.resolve(staffInfo);
    } else {
      return app.LM.checkIfStaffDstbEvent()
    }
  }).then(staffInfo => {
    staffInfo = staffInfo || {}
    if (staffInfo.isStaffDstbData) {
      this.commission = this.commission || this.selectComponent("#commission");
      return this.commission.getCommission("NORMAL", goods_id, ops.issued_id);
    }
  }).finally(()=>{
    let goods_info = this.data.goods_info || {};
    if(goods_info.is_on_sale == 0) return;
    let time = 500;
    Utils.delay(time).then(()=>{
      get_GoodsPackageList.call(this)
      getMatchLinkGoodList.call(this, ops);
      getGoodsServices.call(this, ops);
    })
    Utils.delay(time + 500).then(()=>{
      loadComments.call(this);
      addGoodsVisitLog.call(this, ops);
      showPriceExplain.call(this);
      if (!this.checkPromote) {
        getGoodsPromotionInfo.call(this);
      }
    })
    Utils.delay(time + 1000).then(()=>{
      param_Attr_List.call(this);
      getVideoList.call(this);
      is_show_share_info.call(this);
      this.couponTip = this.couponTip || this.selectComponent("#couponTip");
      this.couponTip.getTipData(goods_id);
      getGoodsActivityPrice.call(this, goods_id);
      getDiscountActivityPrice.call(this, goods_info);
    })
    //
    if (!this.embedLoad){ 
      checkEmbedCustom.call(this).then(resData=>{
        let that = this;
        this.setData({
          showEmbed : true
        })
        wx.nextTick(()=>{
          that.embedCustom = that.embedCustom || that.selectComponent('#embedId');
          that.embedCustom.getPageData(resData);
        })
      })
    }
  });
}
function getShipStore(){
  let select_store = app.StorageH.get("select_store") || {};
  if (select_store.id){
    let selectShipInfo = this.data.selectShipInfo || {};
    let goods_info = this.data.goods_info || {};
    let store_id = selectShipInfo.id;
    select_store.selectIndex = 1;
    this.setData({
      selectShipInfo: select_store
    })
    //不是仅限们店自提，从没选择到选择门店，刚好处于选择规则的状态
    // console.log("选择门店", store_id);
    // console.log("弹出方式",this.data.style_select_show)
    // console.log("配送方式", goods_info.self_get)
    // console.log("上次选择与今次对比", store_id != select_store.id)
    if (store_id != select_store.id && this.style_select_show && goods_info.self_get != 1) {
      // console.log("重新请求规格");
      getSumaryGoodsProductInfo.call(this,this.options);
    }
  }
}

function getSumaryGoodsDetailData(options = {}) {
  return app.GoodsApi.getSumaryGoodsDetailData({
    params: {
      goodsId: options.goods_id || 0,
      productId: options.product_id || 0, 
      colorId: 0,//options.color_id || 0,
      userToken: app.LM.userToken,
      issue_id: options.issued_id || 0,
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
      select_goods.select_color_id = (options.color_id && parseInt(options.color_id)) || goods_info.color_id || goods_gallery[0].color_id || 0;
      select_goods.select_color = color_img[select_goods.select_color_id][0].color_name || goods_info.colorname;
      console.log('select_goods', select_goods, typeof (select_goods.select_color_id))
      if (goods_gallery && goods_gallery.length>1){
        initImgArr.call(this, goods_gallery, color_img, select_goods.select_color_id);
      }
      //加载倒计时
      if (goods_info.is_show_count_down_time == -1 || typeof (goods_info.is_show_count_down_time) == 'undefined') { //促销商品
        app.sysTemConfig('is_show_countdown_by_discountgoods').then(sysConf => {
          if (sysConf && sysConf.Value == 1) {
            countDownFn.call(this, goods_info);
          } else {
            this.setData({
              showCountDown: false
            })
          }
        });
      } else if (goods_info.is_show_count_down_time == 1) { //非普通商品
        countDownFn.call(this, goods_info);
      } else if (goods_info.is_show_count_down_time == 0) {
        this.setData({
          showCountDown: false
        })
      }


      if (goods_info.sale_type == "5") {
        showAddCart.call(this);
      }
      let customData = this.data.customData;
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
      // this.goods_video = this.data.brand_info.videoUrl + 'SAAS_IMAGE/videos/JW/20181217/20181217183715598_0337464.mp4'
      this.goods_gallery = goods_gallery || {};
      this.goods_id = goods_id;
      goods_info.goods_desc = goods_info.goods_desc.replace(/<img/g, '<img class="rich_text_img" ');
      goods_info.scoreStr = StrH.numberCarryBit(goods_info.score);
      checkSalesVolume.call(this);
      this.setData({
        color_img: color_img,
        goods_info: goods_info,
        video: this.goods_video,
        select_goods: select_goods,
        isCollect: isCollect,
        customData: customData,
        colorNum:this.colorNum,
        video_list: this.video_list
      })
    setCardInfo.call(this,goods_info);
      this.delayDetailId = setTimeout(()=>{
        this.scrollTolowerHandle();
      },500)
      // console.log('多色', this.data.color_img,this.colorNum)
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
//获取规格
function getSumaryGoodsProductInfo(options = {}, click_type) {
  let selectShipInfo = this.data.selectShipInfo || {};
  let reqUrl = ""; 
  let params = {
    goodsId: options.goods_id,
    userToken: app.LM.userToken,
    brandCode: app.Conf.BRAND_CODE
  }
  if (selectShipInfo.id && selectShipInfo.selectIndex == 1){
    reqUrl = "getSumaryGoodsProductInfoByShippingStore";
    params.storeId = selectShipInfo.id;
  }else{
    reqUrl = "getSumaryGoodsProductInfo";
    params.issueId = options.issued_id || 0,
    params.colorId = 0;
  }
  return app.GoodsApi[reqUrl]({
    params: params,
    other: {
      isShowLoad: true
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      let TotalInfo = data.GoodsTotalInfoEntity;
      let ProductList = data.ListGoodsProductInfo;
      let goodsExtend = data.goodsExtend;
      let select_goods = this.data.select_goods;
      let color_spec = {},
        size_spec = {},
        color_size = {},
        size_color = {},
        color_arr = [],
        size_arr = [];
      select_goods.productInfo = select_goods.productInfo && select_goods.productInfo.goods_id ? select_goods.productInfo : TotalInfo;
      for (let i = 0; i < ProductList.length; i++) {
        
        let color_id = ProductList[i].color_id;
        let product_number = parseInt(ProductList[i].product_number);
        let color_item = {
          color_id: color_id,
          color_name: ProductList[i].color_name,
          color_n: StrH.ellipsisStr(ProductList[i].color_name),
          // product_number: ProductList[i].product_number
        }
        if (!color_spec[color_id]){
          color_spec[color_id] = [];
          color_arr.push(color_item)
        }
        color_spec[color_id].push(ProductList[i]);
        let size_id = ProductList[i].size_id;
        let size_item = {
          size_id: size_id,
          size_name: ProductList[i].size_name,
          size_n: StrH.ellipsisStr(ProductList[i].size_name),
          // product_number: ProductList[i].product_number
        }
        if (!size_spec[size_id]){
          size_spec[size_id] = [];
          size_arr.push(size_item)
        } 
        size_spec[size_id].push(ProductList[i]);


        if (!color_size[color_id]){
          color_size[color_id] = {
            total_num: product_number
          };
        }else{
          color_size[color_id]["total_num"] = color_size[color_id]["total_num"] ? color_size[color_id]["total_num"] + product_number : product_number
        }
        color_size[color_id][size_id] = ProductList[i];
        if (!size_color[size_id]) {
          size_color[size_id] = {
            total_num: product_number 
          };
        }else{
          size_color[size_id]["total_num"] = size_color[size_id]["total_num"] ? size_color[size_id]["total_num"] + product_number : product_number
        }
        size_color[size_id][color_id] = ProductList[i];

      }
      
      this.color_spec = color_spec || {};
      this.size_spec = size_spec || {};
      this.ProductList = ProductList || {};
      this.setData({
        color_size: color_size,
        size_color: size_color,
        goodsExtend: goodsExtend, 
        select_goods: select_goods,
        color_arr: color_arr,
        size_arr: size_arr
      })
      getSpecNumMap.call(this);
      showInventory.call(this);
    }
  })
}
//
function getSpecNumMap(type="") {
  let color_spec = this.color_spec;
  let size_spec = this.size_spec;
  let select_goods = this.data.select_goods;
  let specList = this.ProductList;
  let goodsExtend = this.data.goodsExtend;
  if ((select_goods.select_color_id && select_goods.select_size_id) || (select_goods.select_color_id && goodsExtend.attr_count == 1)) {
    let canSelectSpec = color_spec[select_goods.select_color_id];
    // let size_key_list = {};
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
      // size_key_list: size_key_list,
      size_arr: size_arr,
      select_goods: select_goods
    })

  } else { //选择颜色
    let canSelectSpec = [];
    let min_m_price = null,
      max_m_price = null,
      min_price = null,
      max_price = null,
      min_point = null,
      max_point = null;
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
    // console.log(canSelectSpec,"canSelectSpec");
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
        // size_key_list: size_key_list
        size_arr: size_arr
      })
    } else if (select_goods.select_size_id) {
      this.setData({
        // color_key_list: color_key_list
        color_arr: color_arr
      })
    }
    // console.log(size_key_list,"this size_key_list");
    productInfo.max_exchange_point = max_point;
    productInfo.max_market_price = max_m_price;
    productInfo.max_price = max_price;
    productInfo.min_exchange_point = min_point;
    productInfo.min_market_price = min_m_price;
    productInfo.min_price = min_price;
    this.setData({
      select_goods: select_goods
    })

    // console.log(this.data.select_goods,"select_goods");
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

function createShoppingCart() {
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
    tip = "请选择完整规格";
    if (goodsExtend.attr_count == 2) {
      tip = `请选择${goodsExtend.size_name_title}`
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
        // this.addActionLog("BUY_NOW", "GOODS", {
        //   keyParam1: productInfo.product_id,
        //   keyParam2: goods_info.goods_id
        // });
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
        // this.setData({
        //   style_select_show: 'ishide',
        // })
        // this.addActionLog("ADD_SHOPPING_CART", "GOODS", {
        //   keyParam1: productInfo.product_id,
        //   keyParam2: goods_info.goods_id
        // });
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
//商品搭配
function getMatchLinkGoodList(options = {}) {
  return app.GoodsApi.getMatchLinkGoodList({
    params: {
      goodsId: options.goods_id,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      this.setData({
        matchLinkGoods: data
      })
      return Promise.resolve();
    }
    // return Promise.reject();
  })
}

function getGoodsServices(options = {}) {
  return app.GoodsApi.getGoodsServices({
    params: {
      goodsId: options.goods_id,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(e => {
    if (e.code == "1") {
      let data = e.data;
      this.setData({
        goodsServices: data
      })
      return Promise.resolve();
    }
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
//授权
function authorizeUserInfo() {
  return app.LM.getUserTokenAsync(true);
}

function listen() {
  if (app.LM.isLogin) {
    this.setData({
      isLogin: app.LM.isLogin
    });
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    this.setData({
      isLogin: app.LM.isLogin
    });
  });
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


function getGoodsPromotionInfo() {
  let goodsId = this.options.goods_id || 0;
  if (!goodsId) return;
  let params = {
    goodsId
  };
  return app.RunApi.go('GoodsApi', 'getGoodsPromotionInfo', params).then(res => {
    if (res.code == 1) {
      let data = res.data || [];
      if ((data && data.length <= 0)) {
        this.setData({
          checkPromote: false,
        })
        return
      }
      let obj = {};
      numArr.forEach((item, index) => {
        obj[item] = obj[item] || {};
        obj[item].name = nameArr[index];
        obj[item].has = false;
        obj[item].label = true;
      });
      let arr = [];
      let temp = [];
      // let ellipsisEntireArr = [];
      let objLen = 0;
      let promoteData = data && data[0] || {};
      let endLabel = 0;
      let normalId = "";
      let tempFilter = data.filter((item, index) => {
        if(item.rule_type == 0 && !normalId){
          normalId = item.rule_id;
          promoteData = item;
        }
        console.log('jimmy',normalId,promoteData)
        if (obj[item.gift_type]) { // 1 2 3 5 其他  //省略
          if (obj[item.gift_type].label){
            obj[item.gift_type].has = true;
            obj[item.gift_type].label = false;
            objLen += 1;
          }
        } else {
          if ((normalId == item.rule_id || promoteData.rule_id==item.rule_id)) {
            if(normalId && normalId == item.rule_id){
              arr.push(item); // 4 6 7 8 9  //全称
            }else if(!normalId && (promoteData.rule_id == item.rule_id)){
              temp.push(item);
            }
          }
        }
        return (normalId || promoteData.rule_id) == item.rule_id
      })
      console.log('arrarr',arr,temp);
      arr = arr.concat(temp);
      for (let item in obj) {
        if (obj[item].has && !obj[item].label) {
          endLabel = item;
        }
      }
      this.checkPromote = true;
      console.log('promoteArray', arr); 
      console.log('ellipsisArr', objLen,obj);
      // console.log('ellipsisEntireArr', ellipsisArr);
      this.setData({
        arr: data,  //全部
        checkPromote: (data && data.length > 0) || false,
        promoteArray: arr || [], //第一行全称
        ellipsisArr: obj || {},  //第二行省略
        // ellipsisEntireArr: ellipsisEntireArr, 
        promoteData: promoteData,
        endLabel: endLabel || 0,
        objLen: objLen
      })
    }
  })
}

function clearTM() {
  clearTimeout(this.loadingId);
  clearTimeout(this.hideLoadId);
  clearTimeout(this.initVideoId);
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
      // console.log('初始化', arr, obj, col_id, temp,label);
      console.log('temptemp',label)
      this.setData({
        // defaultImgArr: temp,
        label
      });
    }
  }
}


function getGoodsActivityPrice(goodsId) {
  if (!goodsId) return;
  return app.GoodsApi.getGoodsActivityPrice({
    params: {
      goodsId: goodsId,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    }
  }).then(res => {
    if (res.code == 1) {
      let data = res.data||[];
      this.activityTipFirst = this.activityTipFirst || this.selectComponent("#activityTipFirst");
      this.activityTipFirst.loadData(data, goodsId);
      this.activityTipSecond = this.activityTipSecond || this.selectComponent("#activityTipSecond");
      this.activityTipSecond.loadData(data, goodsId);
    }
  })
}
function getDiscountActivityPrice(goods_info){
  if(goods_info.sale_type == 4 && goods_info.is_started == 0){
    let data = [{
      isTeaser: false,
      activityType: "DISCOUNT",
      price: goods_info.price,
      startTime: goods_info.stime
    }]
    this.discountActivityTip = this.discountActivityTip || this.selectComponent("#discountActivityTip");
    this.discountActivityTip.loadData(data, goods_info.goods_id);
  }
}

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
 
function  loadComments() {
  this.comments = this.comments || this.selectComponent('#comments');
  this.comments.initData(this.options.goods_id);
}