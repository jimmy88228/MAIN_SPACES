// pages/micro_mall/store_mod/qr_code.js
import appletCode from "../../../common/helper/appleCode"
import DrawTemplate from '../goods/popup/help/template.js';

const app = getApp();
const PAGE_TYPE = "GUIDE_MY_CODE";
const PAGE_TYPE_STORE = "STORE_STAFF";
Page(app.BP({
    data: {
        circle_current: 0,
        swiperArr: [],
        isShowList:false,
    },
    onLoad: function(options) {
        storeStaffBarBg.call(this);
        let brand_info = this.data.brand_info;
        let agreetS = `${brand_info.icon_url}micro_mall/agreet/Selected.png`;
        let agreetNoS = `${brand_info.icon_url}micro_mall/agreet/noSelected.png`;
        this.setData({
          isLogin:app.LM.isLogin,
          agreetS: agreetS,
          agreetNoS: agreetNoS
        })
    },
    onShow(){
      listen.call(this);
    },
    onHide(){
      unListen.call(this);
    },
    onUnload(){
      unListen.call(this); 
    },
    handle_change(e) {
        let dataset = e.currentTarget && e.currentTarget.dataset || {};
        let value = e.detail && e.detail.current || 0;
        let type = dataset.type || '';
        if (type) {
            this.setData({
                [type]: value
            })
        }
    },
    onShareAppMessage: function() {
      return {
        shareType: app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL
      }
    },

    getShare() {
        if (this.isLoading_check) {
            return
        }
        if (!this.data.swiperArr[this.data.circle_current]) {
          app.SMH.showToast({
            "title": "请选择海报背景图"
          })
          return;
        }
        //分享海报
        this.shareModule = this.shareModule || this.selectComponent("#shareModule");
        this.isLoading_check = true;
        let _timer = setTimeout(() => {
            clearTimeout(_timer);
            this.isLoading_check = false;
        }, 3000)
        this.shareModule.checkIfStore();
        this.setData({
            isLogin: true
        })
    },

    chooseShareType(data) {
        let detail = data.detail || {};
        console.log('choose:', detail);
        let storeInfo = detail.storeInfo || {};
        console.log('导购二维码', storeInfo) 
        let opKind = detail.shareId == 4 ? (app.OpKind[PAGE_TYPE_STORE] || app.OpKind.NORMAL) : (detail.shareId == 5 || detail.shareId == 8) ? (app.OpKind[PAGE_TYPE] || app.OpKind.NORMAL) : "";
        let shareType = detail.shareId == 4 ? (app.ShareType[PAGE_TYPE_STORE] || app.ShareType.NORMAL) : (detail.shareId == 5 || detail.shareId == 8) ? (app.ShareType[PAGE_TYPE] || app.ShareType.NORMAL) : "";
        this.shareImg = this.shareImg || this.selectComponent("#shareImg");
        let allData = {};
        let cb = ()=>{
          let _timer = setTimeout(() => {
            clearTimeout(_timer);
            this.shareImg.show();
          }, 260)
        }
        if(detail.shareId == 8){
          allData = {
            info:{
              opKind: opKind,
              path: 'pages/micro_mall/index/index',
            },
            scene: {
              "shareType": shareType,
              "staff_code": storeInfo.staff_code,
              "staff_id": storeInfo.staff_id || '',
              "store_id": storeInfo.store_id || '',
              "codeType":"myStoreCode",
              "staffCode": app.LM.staffInfo && app.LM.staffInfo.staffCode || "",
            }, 
            draw: {
              diy:true,
              drawArr:[],
              baseInfo:{codeDiy:true,canvasW:600,canvasH:600}
            }
          }
        }else{
          allData = {
            info:{
              opKind: opKind,
              path: 'pages/micro_mall/index/index',
              imgUrl: this.data.swiperArr[this.data.circle_current] || '',
            },
            scene: {
              "shareType": shareType,
              "staff_code": storeInfo.staff_code,
              "staff_id": storeInfo.staff_id || '',
              "store_id": storeInfo.store_id || '',
              "codeType":"myStoreCode",
              "staffCode": app.LM.staffInfo && app.LM.staffInfo.staffCode || "",
            },
            draw:{
              template:"custom",
              codeType: detail.shareId == 4 ? "QR" : ""
            }
          } 
        }
        
        if(detail.shareId == 8){
          appletCode.call(this,allData).then(code=>{
            this.codeUrl = code;
            initTemplate.call(this);
            allData.draw.drawArr = this.drawArr||[];
            this.setData({
              allData: allData
            })
            console.log('allData',allData)
            cb(); 
          });
        }else{
          this.setData({
            allData: allData
          })
          cb();
        }
         
    },
    checkIfstoreInfoCallBack(data) {
        this.isLoading_check = false;
    },
    selectViewType(){
      this.setData({
        isShowList: !this.data.isShowList
      })
    }
}))


function listen() {
  if (app.LM.isLogin && !this.data.isLogin) {
    this.setData({
      isLogin: true
    })
    return;
  }
  this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
    if (app.LM.isLogin) {
      this.setData({
        isLogin: true
      })
    }
  });
}

function unListen() {
  if (this.listenLoginStatuId) {
    app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
  }
}



function storeStaffBarBg() {
    return app.UserApi.getStoreStaffBar({
        params: {
            brandCode: app.Conf.BRAND_CODE,
        },
        other: {
            isShowLoad: true
        }
    }).then(res => {
        // console.log('arr', res);
        if (res.code == 1) {
            this.setData({
                swiperArr: res.data || []
            })
        }
    })
} 

function initTemplate() {
  if (this.drawArr && this.drawArr.length > 0) { return }
  let canvasW = 600;
  let canvasH = 600; 
  this.drawArr = this.drawArr || [];

  let bg = DrawTemplate.initData('image', 0, 0, canvasW, canvasW);
  bg.url = this.codeUrl;
  bg.mode = 'fitORfill';
  this.drawArr.push(bg);
}