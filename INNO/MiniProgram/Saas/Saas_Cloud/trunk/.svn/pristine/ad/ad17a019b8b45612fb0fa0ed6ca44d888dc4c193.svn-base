import userJump from "../userJumpHandle";
import Utils from "../../../../../common/support/utils/utils";
import DrawTemplate from '../../../goods/popup/help/template.js';
const app = getApp();
Component(app.BTAB({
  properties: {
    userData: {
      type: Object,
      value: {}
    },
    setting: {
      type: Object,
      value: {}
    },
    sysConf: {
      type: Object,
      value: {}
    },
    sessionFrom: {
      type: Object,
      value: {}
    },
    selfStaffInfoBind:Object,
    storeStaff:Object
  },
  options: {
    styleIsolation: 'apply-shared'
  },
  attached() {
  },
  detached() {
  },
  data: {
    assetsObj: {}
  },
  ready(){},
  methods: {
    funcJump(e){
      Utils.throttle(() => {
        let dataset = e.currentTarget.dataset || {};
        userJump.jump(dataset, this.properties.sysConf);
      }, 3000)()
    },
    completemessageStaff(e){
      this.triggerEvent('completemessageStaff',e);
    }, 
    startmessage(e){
      this.triggerEvent('startmessage',e);
    },
    selfStaffPoster(){ 
      this.shareImg = this.shareImg || this.selectComponent("#shareImg");
      return getWechatWorkerQrCode.call(this).then(res=>{
        initTemplate.call(this);
        let allData = {
          info: {
            imgUrl: `${this.data.brand_info.icon_url}micro_mall/staff/selfStaff.jpg`,
            opKind: app.ShareType["STAFF_WECHAT"],
            path:"pages/micro_mall/index/index"
          },
          scene: {
            shareType: app.ShareType["STAFF_WECHAT"],
            staffCode:app.LM.staffInfo && app.LM.staffInfo.staffCode || ""
          },
          draw: {
            diy: true,
            drawArr: this.drawArr,
            template:"restoreSave",
            baseInfo: {
              canvasW: 600,
              canvasH: 812,
              background: '#fff',
              codeDiy: true
            }
          }
        }
        this.setData({
          allData: allData
        },()=>{this.shareImg&&this.shareImg.show();});
        return res
      })
    }
  }
})) 

function initTemplate() {
  if (this.drawArr && this.drawArr.length > 0) { return }
  let canvasW = 600;
  let canvasH = 812;
  let codeW = 232;
  let baseBottomLine = canvasH - 111;
  this.drawArr = this.drawArr || [];

  let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasH);
  bg.url = `${this.data.brand_info.icon_url}micro_mall/staff/selfStaff.jpg`;
  bg.mode = 'widthFix';
  this.drawArr.push(bg);
  baseBottomLine -= codeW;
  let code = DrawTemplate.initData('image', canvasW - 66 - codeW, baseBottomLine, codeW, codeW);
  code.url = this.selfStaffUser;
  this.drawArr.push(code);
}

function getWechatWorkerQrCode(){
  if(this.selfStaffUser){return Promise.resolve(this.selfStaffUser)}
  return app.UserApi.getWechatWorkerQrCode({
    params:{
      workerNo:this.properties.storeStaff && this.properties.storeStaff.staff_code||"",
      brandCode:app.Conf.BRAND_CODE
    },
    other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      this.selfStaffUser = res && res.data||"";
      return this.selfStaffUser;
    }else{
      let msg = res.msg||"生成二维码失败";
      app.SMH.showToast({title:msg});
      return Promise.reject(res.msg||"生成二维码失败");
    }
  })
}