import WindowBehaviors from "../../../../components/ui/cps/window/window-behaviors";
const app = getApp();

Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {
      customTab:{
        type:Boolean,
        value:false
      }
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
      ],
      staffInfo:{

      }
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
      checkIfStaffDstb(hideIndex){ //检测分销
        let p = null;
        let staffInfo = app.LM.staffInfo;
        if (!staffInfo.isStaffDstbData){
          p = app.LM.checkIfStaffDstbEvent();
        }else{
          p = Promise.resolve(staffInfo)
        }
        p.then(staffInfo =>{
          let shareList = this.data.shareList;
          if (staffInfo.isStaffDstbData) {
            shareList[1].showed = false;
            shareList[2].showed = true;
          } else {
            shareList[1].showed = true;
            shareList[2].showed = false;
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
        if (!storeInfo){
          p = app.LM.checkIfStore();
        }else{
          p = Promise.resolve(storeInfo)
        }
        p.then(storeInfo =>{
          console.log('检测会员,then=======',storeInfo);
          let shareList = this.data.shareList;
          if (storeInfo && storeInfo.staff_id) {
            getSysTemConfig.call(this, 'my_qrcode_create_type').then(res => {
              console.log('Conf',res)
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
          }else{
            this.setData({
              shareList: shareList
            })
            this.show();
            this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: {} });
          } 
        })
      },
      checkIfMyStore(){//普通会员
        let p = null;
        let userInfo = app.LM.userInfo || {};
        if (!userInfo.fromStoreId) {
          p = app.LM.getUserSimpleInfo();
        } else {
          p = Promise.resolve(userInfo)
        }
        p.then(userInfo => {
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
                store_id: userInfo.fromStoreId,
                user_id: userInfo.uId
              };
              this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: this.storeInfo });
            });
          // } 
          // else {
          //   this.setData({
          //     shareList: shareList
          //   })
          //   this.show();
          //   this.triggerEvent("checkIfstoreInfoCallBack", { storeInfo: {} });
          // }
        })
      },
      closeList(){
        this.dismiss();
      },
      chooseShareType(e){
        let dataset = e.currentTarget.dataset;
        let shareId = dataset.shareId;
        this.dismiss();
        this.triggerEvent("chooseShareType", { staffInfo: this.staffInfo, storeInfo: this.storeInfo, shareId: shareId});
      }
    }
  })
);


function getSysTemConfig(type=""){
  return app.sysTemConfig(type)
}