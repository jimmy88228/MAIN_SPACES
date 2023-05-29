import WindowBehaviors from "../../../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      isLogin: {
        type: Boolean,
        value: false
      },
      stayH:{
        type:Number,
        value: 0,
      }
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      couponList:[],
    }, 
    detached() {
    },
    methods: {
      onAttached() { 
        let server_close = this.data.brand_info.icon_url + "micro_mall/server_close.png"; 
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;",
          server_close: server_close
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;"
        });
        return 300;
      },
      getCouponList(Gid){
        this.Gid = Gid;
        getGoodsReceiveBonusActivityDetail.call(this, Gid)
      },
      receiveBonus(e){
        let detail = e.detail || {};
        receiveBonusFromGoods.call(this, detail)
      },
    }
  })
);
function getGoodsReceiveBonusActivityDetail(Gid){
  if (!Gid) return;
  return app.GoodsApi.getGoodsReceiveBonusActivityDetail({
    params:{
      userToken: app.LM.userToken,
      goodsId: Gid,
      brandCode: app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      let couponList = res.data || [];
      couponList.sort(sortDistance)
      for (let i = 0; i < couponList.length; i++){
        couponList[i].discount = parseFloat(couponList[i].discount || 0);
        couponList[i].customData = {
          index: i,
          activity_id: couponList[i].activity_id,
          bonus_type_id: couponList[i].bonus_type_id
        }
      }
      this.setData({
        couponList: couponList
      })
      this.show();
    }
  })
}
function sortDistance(a, b) {
  if ((a.status == 1 && b.status == 1) || (a.status != 1 && b.status != 1)) { return 0 }
  if (b.status == 1 && a.status != 1) { return 1 }
  return -1
}
function receiveBonusFromGoods(couponItem = {}) {
  if (this.limitClick){
    app.SMH.showToast({
      title:"操作太频繁了"
    })
    return;
  }
  this.limitClick = true;
  let activity_id = couponItem.activity_id || "";
  let bonus_type_id = couponItem.bonus_type_id || "";
  if (!activity_id || !bonus_type_id || !this.Gid) return;
  return app.GoodsApi.receiveBonusFromGoods({
    data: {
      goodsId: this.Gid,
      activityId: activity_id,
      bonusTypeId: bonus_type_id,
      userToken: app.LM.userToken,
      brandCode: app.Conf.BRAND_CODE
    },
    other: {
      isShowLoad: true
    }
  }).then(res => {
    if (res.code == 1) {
      app.SMH.showToast({
        title:"领取成功"
      })
      if (res.data == 0 || res.data < 0 || !res.data){
        let couponList = this.data.couponList || [];
        let key = 'couponList[' + couponItem.index + '].status'
        this.setData({
          [key]: 2
        })
      }
      return Promise.resolve();
    }
    if (res.msg){
      app.SMH.showToast({
        title: res.msg
      })
    }
    getGoodsReceiveBonusActivityDetail.call(this, this.Gid)
    return Promise.resolve();
  }).finally(()=>{
    this.limitClick = false;
  })
}

