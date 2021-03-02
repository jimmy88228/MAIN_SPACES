// pages/micro_mall/buy/buy_coupon.js
import WindowBehaviors from "../../../../ui/cps/window/window-behaviors.js";
import MyDate from "../../../../support/utils/date-util.js"
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {

    },
    data: {
        brand_info: {},
        // coupon_list: [],
        no_use_coupon: false,
        use_coupon: '',
        choiceIds:{},
        tab:[
          {key:"usable",name:"可使用优惠券"},
          {key:'unusable',name:"不可用优惠券"}
        ],
        coupon_list:[
          {
            key: "usable",
            page: 0,
            hasMore:true,
            data:[],
          },
          {
            key: "unusable",
            page: 0,
            hasMore:true,
            data:[],
          },
        ],
        //通过下标标识
        current: 0,
        selectInfo:{
          count:0,
          saveMoney:0.00,
          realityMoney:0.00,
          totalMoney:0.00
        },
        boxStyle: "opacity:0;transform: translateY(100%);"
    },
    showRestoreTip:false,
    onShow() {},
    ready() {
      let arrow = this.data.brand_info.icon_url + "micro_mall/coupon/arrow.png";
      let ls_icon2 = this.data.brand_info.icon_url + "micro_mall/return_active.png";
      let ls_icon1 = this.data.brand_info.icon_url + "micro_mall/return.png";
      let storeBonus = this.data.brand_info.icon_url + "micro_mall/coupon/storeBonus.jpg";
      let onlineBonus = this.data.brand_info.icon_url + "micro_mall/coupon/onlineBonus.jpg";
      let bonus_none = this.data.brand_info.icon_url + "micro_mall/coupon/bonus_none.png";
      this.setData({
          arrow: arrow,
          ls_icon2: ls_icon2,
          ls_icon1: ls_icon1,
          storeBonus: storeBonus,
          onlineBonus: onlineBonus,
          bonus_none: bonus_none
      });
    },
    methods:{
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transform: translateY(0%);transition: all 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transform: translateY(100%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      initData(params,type){
        this.show();
        this.options = params;
        this.type = type || "normal";
        this.idsArr = [];
        this.choiceIds = [];
        return loadCoupon.call(this);
      },
      onTap(e){
        let dataset = e.currentTarget.dataset || {};
        this.setData({
          current: dataset.key
        })
      },
      swiperChangeCallback(e){
        let detail = e.detail;
        this.setData({
          current: detail.current
        })
      },
      scrolltolowerCallback(e){ 
      },
      refresherrefreshCallBack(){
        this.list = this.list || this.selectComponent('#list');
        this.list && this.list.refreshEnd();
      },
      onShowUseLimit: function(e) {
        let dataset = e.currentTarget.dataset;
        let bonusId = dataset.bonusId || "";
        if(!bonusId) return;
        let activieBonusId = this.data.activieBonusId || "";
        activieBonusId = activieBonusId == bonusId ? "" : bonusId
        if(activieBonusId != this.data.activieBonusId){
          this.setData({
            activieBonusId: activieBonusId
          })
        } 
    },
    noUseCoupon: function() {
        if (this.lock){return}
        let no_use_coupon = this.data.no_use_coupon;
        this.setData({
            no_use_coupon: !no_use_coupon,
            choiceIds: {},
        })
        //删除缓存数据
        let userChoiceData = app.StorageH.get('userChoiceData') || {};
        delete userChoiceData.use_coupon;
        app.StorageH.set('userChoiceData', userChoiceData);
        this.choiceDatas = [];
        this.idsArr = [];
        this.lock = true;
        let timer = setTimeout(()=> {
            clearTimeout(timer);
            // wx.navigateBack();
            this.dismiss();
            this.triggerEvent("chooseCouponCallback");
        }, 500);
    },
    beforeUseCoupon(e){
      let event = e;
      let dataset = e.currentTarget.dataset || {};
      let listKey = parseInt(dataset.listKey);
      let index = parseInt(dataset.index);
      let coupon_list = this.data.coupon_list;
      let selectData = coupon_list[listKey].data[index] || {};
      let that = this;
      if (selectData.bonus_type == 4 && this.idsArr.length > 0 && !this.data.choiceIds[selectData.bonus_id]) {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent("勾选折扣券，会清空之前的叠加券操作，是否继续？");
        this.pageDialog.setTwoBtn({
            name: "取消",
            tap: function () {
              that.pageDialog.dismiss();
            }
          },
          {
          name: "确认",
          tap: function () {
            that.idsArr = [];
            that.choiceDatas = [];
            that.setData({
              choiceIds:{}
            })
            that.useCoupon(event);
            that.pageDialog.dismiss();
          }
        })
        this.pageDialog.show();
      }else if(selectData.restore_market_price == 1 && !this.showRestoreTip){
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent("使用该券时，商品价格将以原价结算,是否继续?");
        this.pageDialog.setTwoBtn({
            name: "取消",
            tap: function () {
              that.pageDialog.dismiss();
            }
          },
          {
          name: "确认",
          tap: function () {
            that.idsArr = [];
            that.choiceDatas = [];
            that.setData({
              choiceIds:{}
            })
            that.useCoupon(event);
            that.pageDialog.dismiss();
          }
        })
        this.showRestoreTip = true;
        this.pageDialog.show();
      }else{
        this.useCoupon(event);
      }
    },
    useCoupon: function(e) {
        if (this.lock) { return }
        this.lock = true;
        let dataset = e.currentTarget.dataset || {};
        let listKey = dataset.listKey;
        let bonus_id = dataset.bonus_id;
        let index = parseInt(dataset.index);
        let coupon_list = this.data.coupon_list;
        let selectData = coupon_list[listKey].data[index] || {};
        let choiceIds = this.data.choiceIds || {}; 
        if(choiceIds[bonus_id]){
          for (let i = 0; i < this.idsArr.length; i++) {
            if (bonus_id == this.idsArr[i]){
              this.idsArr.splice(i, 1);
              this.choiceDatas.splice(i, 1);
            }
          }
          delete choiceIds[bonus_id];
        }else{
          this.idsArr.push(bonus_id);
          this.choiceDatas.push(selectData);
          choiceIds[bonus_id] = this.idsArr.length;
        };
        console.log(choiceIds,this.idsArr);
        console.log('coupon_list',listKey,index,coupon_list,selectData)
        let len = this.idsArr.length;
        let bonus_ids = this.idsArr.join(",");
        this.setData({
          choiceIds: choiceIds,
          'selectInfo.count': len
        })
        let options = this.options || {};
        let couponOption = typeof(options.couponOption) == "string" ? JSON.parse(options.couponOption) : options.couponOption;
        couponOption = couponOption || {};
        if(this.type == "presale"){
          couponOption.bonusIds = bonus_ids; //pre
        }else{
          couponOption.bonusId = bonus_ids;
        }
        changeUseCoupon.call(this,couponOption).catch((res)=>{
          app.SMH.showToast({
            "title": res.msg
          })
          if (choiceIds[bonus_id]){
            for (let i = 0; i < this.idsArr.length; i++) {
              if (bonus_id == this.idsArr[i]) {
                this.idsArr.splice(i, 1);
                this.choiceDatas.splice(i, 1);
              }
            }
            delete choiceIds[bonus_id];
            this.setData({
              choiceIds: choiceIds
            })
          }
        })
    },
    confirmChoice(){
      if (this.lock) { return }
      let choiceDatas = this.choiceDatas || [];
      let userChoiceData = app.StorageH.get('userChoiceData') || {};
      userChoiceData.use_coupon = choiceDatas;
      app.StorageH.set('userChoiceData', userChoiceData);
      this.lock = true; 
      let timer = setTimeout(()=>{
          this.dismiss();
          this.triggerEvent("chooseCouponCallback");
          clearTimeout(timer);
      }, 500);
      return
    },
  },
    
}))
function changeUseCoupon(couponOption){
  return couponByJieSuan.call(this, couponOption).then(res=>{
    let data = res.data || {};
    installData.call(this,data);
  })
}
function loadCoupon(params){
  return couponByJieSuan.call(this,params).then(res=>{
    let data = res.data || {};
    installData.call(this, data,"init");
    return Promise.resolve(res);
  })
}
function couponByJieSuan(couponOption){ //pre
  let options = this.options;
  if (!couponOption){
    couponOption = options.couponOption || {};
  }
  let api = "BuyApi";
  let url = "canUseCouponByJieSuan";
  if(this.type == "normal"){
    if (!couponOption.recIds) { return Promise.reject();}
  }else if(this.type == "presale"){
    api = "PreSaleApi";
    url = "getPresaleUsableBonusList"
    // if (!couponOption.preOrderId) { return Promise.reject();}
  }
  return app[api][url]({
    data:{
      "userToken": options.userToken || app.LM.userToken,
      "brandCode": app.Conf.BRAND_CODE,
      ...couponOption
    },
    other:{
      isShowload:true
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      let couponList = data.couponList || [];
      //排序： 折扣券 大优惠 > 小优惠 > 满减券 > 大优惠 > 小优惠 
      couponList.sort(sortArr);
      return Promise.resolve(res);
    }
    return Promise.reject(res);
  }).finally(() => {
    setTimeout(()=>{
      this.lock = false;
    },200)
  })
}
function installData(data,type){
  let couponList = data.couponList || [];
  let userChoiceData = app.StorageH.get('userChoiceData') || {};
  let use_coupon = userChoiceData.use_coupon || [];
  console.log("use_coupon",use_coupon)
  if(type == "init"){
    let choiceIds = {};
    for (let i = 0; i < use_coupon.length; i++){
      let bonus_id = use_coupon[i].bonus_id || 0;
      choiceIds[bonus_id] = parseInt(i) + 1;
      this.idsArr.push(bonus_id);
    }
    this.choiceDatas = use_coupon;
    this.setData({
      choiceIds: choiceIds
    })
  }
  let coupon_list = this.data.coupon_list,usable=[],unusable=[];
  for (let i in couponList) {
    couponList[i].bonus_id = couponList[i].bonusId;
    couponList[i].showLimit = false;
    couponList[i].typeMoney && (couponList[i].typeMoney = parseFloat(couponList[i].typeMoney));
    couponList[i].discountStr = app.NH.getDiscount(couponList[i].discount);
    let fromTime = couponList[i].use_start_date && couponList[i].use_start_date.replace(/\-/g, "/");
    let toTime = couponList[i].use_end_date && couponList[i].use_end_date.replace(/\-/g, "/");
    couponList[i].fromTimeStr = MyDate.format(new Date(fromTime), "MM月dd日 hh:mm");
    couponList[i].toTimeStr = MyDate.format(new Date(toTime), "MM月dd日 hh:mm");
    if(couponList[i].isEnabled){
      usable.push(couponList[i]);
    }else{
      unusable.push(couponList[i]);
    }
  }
  coupon_list[0].data = usable;
  coupon_list[1].data = unusable;
  let selectInfo = this.data.selectInfo || {};
  if(type == "init"){
    selectInfo.count = use_coupon.length || 0;
  }
  selectInfo.realityMoney = data.totalAmount || 0.00;
  selectInfo.totalMoney = data.allTotalAmount || 0.00;
  selectInfo.saveMoney = (parseFloat(selectInfo.totalMoney) - parseFloat(selectInfo.realityMoney)).toFixed(2);
  console.log("selectInfo",selectInfo)
  console.log("coupon_list",coupon_list)
  this.setData({
    coupon_list: coupon_list,
    selectInfo: selectInfo
  })
}
function sortArr(a,b){
  if (a.bonus_type == 4 && b.bonus_type == 4) {
    return parseFloat(a.discount) - parseFloat(b.discount)
  } else if (a.bonus_type != 4 && b.bonus_type != 4) {
    return parseFloat(b.typeMoney) - parseFloat(a.typeMoney)
  } else if (a.bonus_type == 4 && b.bonus_type != 4) {
    return -1
  } else {
    return 1
  }
}