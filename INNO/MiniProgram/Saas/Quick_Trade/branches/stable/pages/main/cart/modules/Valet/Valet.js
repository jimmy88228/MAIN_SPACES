const App = getApp();
Component(
  App.BC({
    options: {
      addGlobalClass: true
    },
    properties: {
      pageOptions: {
        type: Object,
        value: {}
      }
    },

    data: {
      valetMember: {},
      selectValet: false,
      showValet: false,
    },
    ready() {
      this.setView({
        searchByMobileRef:{ get: () => this.findView("#searchByMobile") }, 
        phoneSmsRef:{ get: () => this.findView("#phoneSms") }, 
        phonePaySmsRef:{ get: () => this.findView("#phonePaySms") }, 
      })
    },
    pageLifetimes: {
      show() {
        getStoreStaffInfo.call(this);
      }
    },
    methods: {
      changeValet() {
        this.searchByMobileRef.showModal();
      },
      valetPhoneSms(valetInfo, nextSendSeconds, type) {
        this.phoneSmsRef.initSms(valetInfo, nextSendSeconds, type);
      },
      valetPhonePaySms(valetInfo, nextSendSeconds, type) {
        this.phonePaySmsRef.initSms(valetInfo, nextSendSeconds, type);
      },
      searchResult(e) {
        let detail = e.detail || {};
        detail.isValet = true;
        this.triggerEvent("getvaletinfo", detail);
      },
    }
  }))

function getStoreStaffInfo() {
  return App.LM.checkIfStore().then(data => {
    if (data && data.staff_id) {
      this.setData({
        showValet: true
      })
    }
  })
}
//清除旧用户选项
function clearUserOperate() {
  App.StorageH.remove("userChoiceData");
  App.StorageH.remove("select_store");
  App.StorageH.remove("store_data");
}