const app = getApp();
Component(
  app.BTAB({
    options:{
      addGlobalClass:true
    },
    properties: {
      pageOptions:{
        type:Object,
        value:{}
      }
    },
    
    data: {
      valetMember:{},
      selectValet:false,
      showValet:false,
      // storeAssist:{}
    },
    ready() {
      
    },
    pageLifetimes:{
      show(){
        // getStoreStaffInfo.call(this);
        app.sysTemConfig("is_valet_order").then(data=>{
          if (data && data.Value == 1){
            getStoreStaffInfo.call(this);
          }
        })
      }
    },
    methods: {
      selectValetEvent(){
        //
        if (!this.data.selectValet){
          this.changeValet();
        }else{
          // app.SMH.showToast({
          //   title: ""
          // })
          return;
          this.setData({
            selectValet: false
          })
          clearUserOperate.call(this);
          this.triggerEvent("getvaletinfo", {});
        }
      },
      changeValet(){
        this.searchByMobile = this.searchByMobile || this.selectComponent("#searchByMobile");
        this.searchByMobile.show();
      },
      valetPhoneSms(valetInfo, nextSendSeconds,type) {
        this.phoneSms = this.phoneSms || this.selectComponent("#phoneSms");
        this.phoneSms.initSms(valetInfo, nextSendSeconds,type);
      },
      valetPhonePaySms(valetInfo, nextSendSeconds,type) {
        this.phonePaySms = this.phonePaySms || this.selectComponent("#phonePaySms");
        this.phonePaySms.initSms(valetInfo, nextSendSeconds,type);
      },
      searchResult(e){
        let detail = e.detail || {};
        detail.isValet = true;
        // this.setData({
        //   valetMember: detail,
        //   selectValet: true
        // })
        orderForCustom.call(this, detail);
      },
      // checkValetOrder(e){
      //   let detail = e.detail || {};
      //   this.triggerEvent("pageCheckValetOrder", detail);
      // }
    }
  })
)

function orderForCustom(detail){
  let valetInfo = detail;
  let pageOptions = this.data.pageOptions;
  return app.GoodsApi.orderForCustom({
    data:{
      recIds: pageOptions.rec_str,
      customUserToken: valetInfo.userToken,
      brandCode:app.Conf.BRAND_CODE
    },other:{
      isShowLoad:true
    }
  }).then(res=>{
    if(res.code == 1){
      clearUserOperate.call(this);
      valetInfo.recIds = res.data;
      this.setData({
        valetMember: valetInfo,
        selectValet: true,
        // "pageOptions.rec_str": res.data
      })
      this.triggerEvent("getvaletinfo", valetInfo);
    }else{
      app.SMH.showToast({
        title: res.msg
      })
    }
  })
}

function getStoreStaffInfo(){
  app.UserApi.getStoreStaffInfo({
    params:{
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    }
  }).then(res=>{
    if(res.code == 1){
      let data = res.data || {};
      if (data.staff_id){
        this.setData({
          showValet:true
        })
      }
    }
  })
}
//清除旧用户选项
function clearUserOperate(){
  app.StorageH.remove("userChoiceData");
  app.StorageH.remove("select_store");
  app.StorageH.remove("store_data");
}