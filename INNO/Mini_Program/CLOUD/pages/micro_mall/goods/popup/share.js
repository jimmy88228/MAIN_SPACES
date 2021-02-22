import WindowBehaviors from "../../../../ui/cps/window/window-behaviors";
import WxSub from "../../../../helper/handle/wxSubscribe.js"
import Promise from "../../../../libs/promise/promise.js";
const app = getApp();

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      customTab: {
        type: Boolean,
        value: false
      },
      shareType: {
        type: String,
        value: ""
      },
      tplsList: {
        type: Array,
        value: []
      },
      acState: {
        type: Number,
        value: 0
      },
      subState: {
        type: Object,
        value: {},
      },
      subStateAll: {
        type: Object,
        value: {},
      },
    },
    data: {
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
      iconUrl: app.Conf.ICON_URL,
      //分销
      shareList: [
        {
          shareId: 1,
          shareTip: "发送给朋友",
          showed: true,
        },
        {
          shareId: 2,
          shareTip: "生成卡片保存并分享",
          showed: true,
        },
        {
          shareId: 3,
          shareTip: "生成卡片保存并分享",//生成分销员卡片保存并分享
          showed: false,
        },
        {
          shareId: 4,
          shareTip: "公众号二维码海报",
          showed: false,
        },
        {
          shareId: 5,
          shareTip: "小程序二维码海报",
          showed: false,
        },
        {
          shareId: 6,
          shareTip: "热门活动",
          showed: false,
          icon:app.Conf.default_icon_url +  "share/jump_staff.png"
        },
        {
          shareId: 7,
          shareTip: "热销商品",
          showed: false,
          icon:app.Conf.default_icon_url +  "share/jump_activity.png"
        },
      ],
      staffInfo: {

      },
      isWxSub: false
    },
    attached() {
    },
    detached() {
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "transform: translate(0,0);transition: all 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "transform: translate(0,110%);transition: all 300ms ease-in-out;",
          // boxStyle2: "opacity:0;"
        });
        return 300;
      },
      checkIfStaffDstb(hideIndex) { //检测分销
        let p = null;
        let staffInfo = app.LM.staffInfo;
        if (!staffInfo.isStaffDstbData) {
          p = app.LM.checkIfStaffDstbEvent();
        } else {
          p = Promise.resolve(staffInfo)
        }
        p.then(staffInfo => {
          let shareList = this.data.shareList;
          if (staffInfo.isStaffDstbData) {
            shareList[1].showed = false;
            shareList[2].showed = true;
            if (this.data.shareType == 'STAFF_SHARE_HELP') {
              shareList[5].showed = true;
              shareList[6].showed = true;
            }
          } else {
            shareList[1].showed = true;
            shareList[2].showed = false;
            let storeInfo = app.LM.storeInfo;
            if (!storeInfo && !this.staffCheckStore) {
              this.staffCheckStore = true;
              app.LM.checkIfStore();
            }
          }
          // if (hideIndex){
          //   shareList[hideIndex].showed = false;
          // }
          this.setData({
            shareList: shareList
          })
          this.show();
          this.staffInfo = staffInfo;
          this.triggerEvent("checkIfStaffDstbCallBack", { staffInfo: staffInfo });
        })
      },
      checkIfStore() { //检测店员
        let p = null;
        let storeInfo = app.LM.storeInfo;
        if (!storeInfo) {
          p = app.LM.checkIfStore();
        } else {
          p = Promise.resolve(storeInfo)
        }
        p.then(storeInfo => {
          console.log('检测会员,then=======', storeInfo);
          let shareList = this.data.shareList;
          if (storeInfo && storeInfo.staff_id) {
            getSysTemConfig.call(this, 'my_qrcode_create_type').then(res => {
              console.log('Conf', res)
              let data = res && res.Value || '';
              shareList[0].showed = false;
              shareList[1].showed = false;
              if (data) {
                if (data == '0') {
                  shareList[3].showed = true;
                  shareList[4].showed = true;
                } else if (data == '1') {
                  shareList[3].showed = true;
                } else if (data == '2') {
                  shareList[4].showed = true;
                }
              } else {
                shareList[0].showed = true;
                shareList[1].showed = true;
              }
              this.setData({
                shareList: shareList
              })
              this.show();
              this.storeInfo = storeInfo;
              this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: storeInfo });
            });
          } else {
            this.setData({
              shareList: shareList
            })
            this.show();
            this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: {} });
          }
        })
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
        Promise.all([p, p2]).then((result) => {
          let allInfo = {
            ...result[0],
            ...result[1]
          }
          return Promise.resolve(allInfo);
        }).then(userInfo => {
          let shareList = this.data.shareList;
          getSysTemConfig.call(this, 'my_user_qrcode_create_type').then(res => {
            let data = res && res.Value || '';
            shareList[0].showed = false;
            shareList[1].showed = false;
            if (data) {
              if (data == '0') {
                shareList[3].showed = true;
                shareList[4].showed = true;
              } else if (data == '1') {
                shareList[3].showed = true;
              } else if (data == '2') {
                shareList[4].showed = true;
              }
            } else {
              shareList[0].showed = true;
              shareList[1].showed = true;
            }
            this.setData({
              shareList: shareList
            })
            this.show();
            this.storeInfo = {
              staff_code: userInfo.staff_code,
              store_id: userInfo.fromStoreId,
              user_id: userInfo.uId
            };
            console.log('进来',this.storeInfo)
            this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: this.storeInfo });
          }); 
        })
      },
      closeList() {
        this.dismiss();
      },
      chooseShareType(e) {
        let dataset = e.currentTarget.dataset;
        let shareId = dataset.shareId;
        this.dismiss();
        this.triggerEvent("chooseShareType", { staffInfo: this.staffInfo, storeInfo: this.storeInfo, shareId: shareId });
      }, 
      subscriptNormal(e){
        let tplsList = this.properties.tplsList || [];
        let dataset = e.currentTarget.dataset||{};
        let bool = dataset.bool || false;
        console.log('需遍历的模板', bool,tplsList);
        let tmplIds = [];
        let select = 0;
        let acState = this.data.acState || 0;
        let subState = this.data.subState || {};
        let subStateAll = this.data.subStateAll || {};
        for (let i = 0; i < tplsList.length; i++) {
          if (tplsList[i].wxTplId) {
            tmplIds.push(tplsList[i].wxTplId);
          }
          if (subState[tplsList[i].tplType] != 0 || subStateAll[tplsList[i].tplType] != 0) {
            select += 1;
          }
          console.log('允许状态占比:', select, '/', tplsList.length, tplsList[i].tplType, '组件状态:',subState[tplsList[i].tplType], '页面状态:', subStateAll[tplsList[i].tplType]);
        }
        // let bool = (subState.BARGAIN_PROGRESS == 1 || subState.BARGAIN_SUCC == 1) ? true:false;
        // let bool = ((acState == 2 && subState.SECKILL_START == 1) || (acState == 2 && subState.SECKILL_LAUNCH_SUCC == 1)) ? true : false
        console.log('tmplIds',bool,tmplIds)
        if (select == tmplIds.length || bool) {
          let subResult = {}; 
          for (let i = 0; i < tmplIds.length; i++) {
            let tempTplType = tplsList[i].tplType;
            subResult[tmplIds[i]] = bool ? subState[tempTplType] == 0 ? 'reject' : 'rejectInner' : 'accept'
          }
          console.log('subResult', subResult);
          this.triggerEvent("updateSubState", { subResult: subResult });
          this.triggerEvent("wxSubCallback", { subResult: subResult, setSub: !bool });
          return;
        }
        WxSub.setWxSubscribe(tmplIds).then(res => {
          if (res.errMsg.indexOf("ok") != -1) {
            this.triggerEvent("updateSubState", { subResult: res });
            this.triggerEvent("wxSubCallback", { subResult: res, setSub: true });
          } else {
            app.SMH.showToast({
              title: res.errMsg
            })
          }
        }).catch(error => {
          console.log(error,'error')
          if (error && error.type == 'showError') {
            app.SMH.showToast({
              title: "请允许订阅消息在小程序设置中开启"
            })
          }
        })
      },

    }
  })
);

function getSysTemConfig(type = "") {
  return app.sysTemConfig(type)
}