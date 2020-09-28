// pages/micro_mall/buy/buy_coupon.js
const app = getApp();
Page(app.BP({
    data: {
        brand_info: {},
        coupon_list: [],
        no_use_coupon: false,
        use_coupon: '',
        choiceIds:{},
        selectInfo:{
          count:0,
          saveMoney:0.00,
          realityMoney:0.00,
          totalMoney:0.00
        },
    },
    mulSelect:true,
    idsArr:[],
    choiceIds:[],
    page: 0,
    hasMore: true,
    onLoad: function(options) {
        this.options = options;
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
        loadCoupon.call(this);
        // let userChoiceData = app.StorageH.get("userChoiceData")||{};
        // this.bonus_id = userChoiceData.use_coupon && userChoiceData.use_coupon.bonus_id || 0;
    },
    onShow() {
        // useBonusList.call(this, this.options);
      
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},
    onShowUseLimit: function(e) {
        let id = e.currentTarget.dataset.id;
        let coupon_list = this.data.coupon_list;
        for (var i in coupon_list) {
            if (i == id) {
                coupon_list[i].showLimit = !coupon_list[i].showLimit;
            } else {
                coupon_list[i].showLimit = false;
            }
        }
        this.setData({
            coupon_list: coupon_list
        });


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
        let timer = setTimeout(function() {
            clearTimeout(timer);
            wx.navigateBack();
        }, 500);
    },
    beforeUseCoupon(e){
      let event = e;
      let dataset = e.currentTarget.dataset || {};
      let index = parseInt(dataset.index);
      let coupon_list = this.data.coupon_list;
      let selectData = coupon_list[index] || {};
      let that = this;
      if (selectData.bonus_type == 4 && this.idsArr.length > 0 && !this.data.choiceIds[selectData.bonus_id]) {
        this.pageDialog = this.pageDialog || this.selectComponent("#pageDialog");
        this.pageDialog.setTitle("温馨提示");
        this.pageDialog.setTouchCancel(false);
        this.pageDialog.setCentent("勾选折扣券，会清空之前的叠加券操作，是否继续？");
        this.pageDialog.setTwoBtn(
          {
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
        },
        
        )
        this.pageDialog.show();
      }else{
        this.useCoupon(event);
      }
    },
    useCoupon: function(e) {
        if (this.lock) { return }
        this.lock = true;
        let dataset = e.currentTarget.dataset || {};
        let bonus_id = dataset.bonus_id;
        let index = parseInt(dataset.index);
        let coupon_list = this.data.coupon_list;
        let selectData = coupon_list[index] || {};
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
        let len = this.idsArr.length;
        let bonus_ids = this.idsArr.join(",");
        this.setData({
          choiceIds: choiceIds,
          'selectInfo.count': len
        })
        let options = this.options || {};
        let couponOption = typeof(options.couponOption) == "string" ? JSON.parse(options.couponOption) : options.couponOption;
        couponOption = couponOption || {};
        couponOption.bonusId = bonus_ids;
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
      let that = this;
      let timer = setTimeout(function() {
          wx.navigateBack({
            complete(){
              that.lock = false;
            }
          });
          clearTimeout(timer);
      }, 500);
      return
    },
    cancelChoice(){
      wx.navigateBack({})
    }
}))
function changeUseCoupon(couponOption){
  return couponByJieSuan.call(this, couponOption).then(res=>{
    let data = res.data || {};
    let couponList = data.couponList || [];
    for (let i in couponList) {
      couponList[i].bonus_id = couponList[i].bonusId;
      couponList[i].showLimit = false;
      couponList[i].typeMoney && (couponList[i].typeMoney = parseFloat(couponList[i].typeMoney));
      // couponList[i].type_money = parseInt(couponList[i].type_money || couponList[i].typeMoney);
      couponList[i].discountStr = app.NH.getDiscount(couponList[i].discount);
    }
    let selectInfo = this.data.selectInfo || {};
    selectInfo.realityMoney = data.totalAmount || 0.00;
    selectInfo.totalMoney = data.allTotalAmount || 0.00;
    selectInfo.saveMoney = (parseFloat(selectInfo.totalMoney) - parseFloat(selectInfo.realityMoney)).toFixed(2);
    this.setData({
      coupon_list: couponList,
      selectInfo: selectInfo
    })

  })
}
function loadCoupon(){
  couponByJieSuan.call(this).then(res=>{
    let data = res.data || {};
    let couponList = data.couponList || [];
    let userChoiceData = app.StorageH.get('userChoiceData') || {};
    let use_coupon = userChoiceData.use_coupon || [];
    let choiceIds = {};
    for (let i in couponList) {
      couponList[i].bonus_id = couponList[i].bonusId;
      couponList[i].showLimit = false;
      couponList[i].typeMoney && (couponList[i].typeMoney = parseFloat(couponList[i].typeMoney)); 
      // couponList[i].type_money = parseInt(couponList[i].type_money || couponList[i].typeMoney);
      couponList[i].discountStr = app.NH.getDiscount(couponList[i].discount);
      // for (let j in use_coupon) {
      //   if (use_coupon[j].bonus_id == couponList[i].bonus_id ) {
      //     choiceIds[couponList[i].bonus_id] = parseInt(i) + 1;
      //   } else {
      //     continue;
      //   }
      // }
    }
    for (let i = 0; i < use_coupon.length; i++){
      let bonus_id = use_coupon[i].bonus_id || 0;
      choiceIds[bonus_id] = parseInt(i) + 1;
      this.idsArr.push(bonus_id);
    }
    let selectInfo = this.data.selectInfo || {};
    selectInfo.count = use_coupon.length || 0;
    selectInfo.realityMoney = data.totalAmount || 0.00;
    selectInfo.totalMoney = data.allTotalAmount || 0.00;
    selectInfo.saveMoney = (parseFloat(selectInfo.totalMoney) - parseFloat(selectInfo.realityMoney)).toFixed(2);
    this.choiceDatas = use_coupon;
    this.setData({
      coupon_list: couponList,
      choiceIds: choiceIds,
      selectInfo: selectInfo
    })
  })
}
function couponByJieSuan(couponOption){
  let options = this.options;
  if (!couponOption){
    couponOption = options.couponOption ? JSON.parse(options.couponOption) : {};
  }
  if (!couponOption.recIds) { return Promise.reject();}
  return app.BuyApi.canUseCouponByJieSuan({
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
      let lists = []
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


// function useBonusList(options = {}) {
//     this.page = this.page + 1;
//     return app.GoodsApi.useBonusList({
//         params: {
//             userToken: options.userToken || app.LM.userToken,
//             bonus_ids: options.bonus_ids,
//             pageIndex: this.page,
//             pageSize: app.Conf.PAGE_SIZE,
//             brandCode: app.Conf.BRAND_CODE
//         },
//         other: {
//             isShowLoad: true
//         }
//     }).then(e => {
//         if (e.code == "1") {
//             let data = e.data;
//             let userChoiceData = app.StorageH.get('userChoiceData') || {};
//             let use_coupon = userChoiceData.use_coupon || [];
//             let choiceIds = {};
//             for (let i in data) {
//                 data[i].showLimit = false;
//                 data[i].type_money = parseInt(data[i].type_money);
//                 data[i].discountStr = app.NH.getDiscount(data[i].discount);
//                 if(this.mulSelect){
//                   for (let j in use_coupon) {
//                     if (use_coupon[j].bonus_id == data[i].bonus_id) {
//                       choiceIds[data[i].bonus_id] = parseInt(i) + 1;
//                     } else {
//                       continue;
//                     }
//                   }
//                 } else if (use_coupon.bonus_id == data[i].bonus_id){
//                   choiceIds[use_coupon.bonus_id] = parseInt(i) + 1;
//                 }
//                 // if (this.bonus_id){
//                 //     if (data[i].bonus_id == this.bonus_id){
//                 //         this.setData({
//                 //             [`use_coupon.bonus_id`]: this.bonus_id
//                 //         })
//                 //     }
//                 // }
//             }
//             console.log("初始化缓存",choiceIds);
//             this.setData({
//               coupon_list: data,
//               choiceIds: choiceIds
//             })
//             return Promise.resolve(e);
//         }
//         return Promise.reject();
//     })
// }