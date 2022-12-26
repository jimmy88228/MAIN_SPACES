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

    },
    pageLifetimes: {
      show() {
        getStoreStaffInfo.call(this);
      }
    },
    methods: {
      changeValet() {
        this.searchByMobile = this.searchByMobile || this.selectComponent("#searchByMobile");
        this.searchByMobile.showModal();
      },
      valetPhoneSms(valetInfo, nextSendSeconds, type) {
        this.phoneSms = this.phoneSms || this.selectComponent("#phoneSms");
        this.phoneSms.initSms(valetInfo, nextSendSeconds, type);
      },
      valetPhonePaySms(valetInfo, nextSendSeconds, type) {
        this.phonePaySms = this.phonePaySms || this.selectComponent("#phonePaySms");
        this.phonePaySms.initSms(valetInfo, nextSendSeconds, type);
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