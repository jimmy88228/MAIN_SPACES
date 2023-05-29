// components/market/assist/coupon.js
const app = getApp();
import WxSub from "../../../common/helper/handle/wxSubscribe"
const PAGE_TYPE = "FRIEND_INVITE";
Component(app.BTAB({
  properties: {
    isLogin:{
      type:Boolean,
      default:false,
      observer:function(n,o){
        if (this.pageId){
          this.getCustomPageShareActivity(this.pageId);
        }
      }
    },
    pageId:{
      type: String,
      default: 0
    },
    share_bg:{
      type:String,
      default:""
    },
    is_home_page:{
      type:Boolean,
      default:false
    },
    customTab:{
      type:Boolean,
      default:false
    },
  },
  data: {
    actInfo:{},
    actList:{},
    assistCount:0,
    lastSharedMens:0,
    progress:0,
    //
    showActModel: false,
    subConfig: {
      type: "GLOBAL",
      label: "ASSISTANCE",
      extraTplsParam: {}
    }
  },
  lifetimes: {
    attached() {
      // 登录暂时这样处理，因为micro_page没有检测到isLogin的变动
      if(app.LM.isLogin) this.setData({isLogin: true})
      this.loginStateListenerId = app.EB.listen("LoginStateChange", () => {
        this.setData({isLogin: app.LM.isLogin})
      })
    },
    detached() {
      app.EB.unListen("LoginStateChange",this.loginStateListenerId)
    }
  },
  methods: {
    getData(pageId){
      console.log("assist pageId",pageId);
      this.pageId = pageId;
      app.LM.loginAsync().then(()=>{
        this.getCustomPageShareActivity(this.pageId);
      })
      // if (this.data.isLogin){
      //   this.getCustomPageShareActivity(this.pageId);
      //   return;
      // }
      // if (app.LM.isCheckLogin){
      //   if (!app.LM.isLogin){
      //     this.getCustomPageShareActivity(pageId);
      //   }
      // }
    },
    getCustomPageShareActivity(pageId){
      // if (!pageId) return;
      // if (this.isLoadData) return;
      this.isLoadData = true;
      return app.UserApi.getCustomPageShareActivity({
        params:{
          pageId: pageId,
          userToken:app.LM.userToken,
          brandCode: app.Conf.BRAND_CODE
        }
      }).then(res=>{
        if(res.code == 1){
          let data = res.data || {};
          if (!data.activityId || data.activityId == 0){ 
            this.setData({
              showActModel: false
            })
            return;
          }
          let detail = data.detail || [];
          let aleardyShareMens = parseInt(data.aleardyShareMens) || 0;
          computeprogress.call(this, detail, aleardyShareMens);
          this.setData({
            assistCount: aleardyShareMens,
            actInfo: data,
            actList: data.detail,
            showActModel: true,
            "subConfig.relatedId": data.activityId,
            "subConfig.extraTplsParam": {
              activityId: data.activityId
            }
          })
          this.setTabStyle();
        }
      }).finally(()=>{
        this.isLoadData = false; 
      })
    },
    setTabStyle(){
      this.triggerEvent('setTabStyle', {});
    },
    getActivityId(){
      let actInfo = this.data.actInfo || {};
      return actInfo.activityId || 0;
    },
    shareTap(e){
      let type = e && e.type||"";
      console.log('assistance',type,e);
      this.shareModule = this.shareModule || this.selectComponent("#shareModule");
      if(type == 'clickcallback' && app.LM.isLogin){
        // 登录暂时这样处理，因为micro_page没有检测到isLogin的变动
        this.setData({isLogin: true})
        return getTpls.call(this).then(res=>{
          console.log('订阅检测',this.tpls && this.tpls.length>0,this.tpls)
          if(this.tpls && this.tpls.length>0){
            app.SMH.showToast({
              title:"授权成功,请重新点击"
            })
          }else{
            this.shareModule.checkIfStaffDstb(1);
          }
        })
      }else{
        this.shareModule.checkIfStaffDstb(1);
      }
    },
    chooseShareType(data) {
      let detail = data.detail;
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      let actInfo = this.data.actInfo || {};
      let allData = {
        info:{
          imgUrl: this.data.share_bg || '',
          opKind:app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL,
          extend_id: this.data.pageId,
        },
        draw: {
          template: "custom"
        },
        scene: {
          "shareType": app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL ,
          "page_id": this.data.pageId,
          'staffCode': detail.shareId == 3 ? detail.staffInfo.staffCode : "",
          "activityId": actInfo.activityId || 0
        }, 
      }
      this.staffInfo = detail.staffInfo
      this.setData({
        allData: allData
      })
      this.shareImg.show();
    },
    checkIfStaffDstbCallBack(data) {
      // let detail = data.detail;
      // this.staffInfo = detail.staffInfo
    },
    
  }
}))
function computeprogress(detail, assistCount){
  if (detail.length > 0) {
    assistCount = parseInt(assistCount);
    let stages = detail.length * 2;
    let valueArr = [],maxValue=0;
    for (let i = 0; i < detail.length; i++){
      let thisSharedMens = parseInt(detail[i].sharedMens);
      if (i == 0){
        valueArr.push(thisSharedMens)
      }else{
        let pervSharedMens = parseInt(detail[i-1].sharedMens)
        let middleSharedMens = parseInt((thisSharedMens - pervSharedMens) / 2) + pervSharedMens;
        valueArr.push(middleSharedMens)
        valueArr.push(thisSharedMens)
      }
      if(thisSharedMens > maxValue){
        maxValue = thisSharedMens;
      }
    }
    let holdStages = 0, progress = 0;
    for (let i = 0; i < valueArr.length; i++){
      if(assistCount > maxValue || assistCount == maxValue){//超过最大
        progress = 100;
        break;
      }
      if (assistCount < valueArr[i] || assistCount == valueArr[i]){
        holdStages = (i + 1) * parseFloat((100 / stages)).toFixed(2);
        progress = holdStages - ((valueArr[i] - assistCount) / valueArr[i] * holdStages);
        break;
      }else{
        progress = 100;
      }
    }
    this.setData({
      progress: progress
    })
  }
}
function getTpls(){
  if(this.tpls) return Promise.resolve(this.tpls)
  return WxSub.getTpls("GLOBAL","ASSISTANCE").then(data => {
    this.tpls = data||[]; 
    return this.tpls;
  })
}