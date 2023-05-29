import WxApi from "../../../../../common/helper/wx-api-helper";
import RequestLogH from "../../../../../common/helper/handle/requestLogHandle";
const app = getApp();


const checkErrorProcess = {
  potentialProblems: [
    {
      tips: "wlgz",
      isOk(){
        return WxApi.getNetworkType()
          .then(res => {
            if (res && res.networkType != "none") return Promise.resolve() 
          })
          .catch(() => Promise.reject(this.tips))
      }
    },
    {
      tips: "mdqh",
      isOk(){
        return new Promise((rs, rj) => {
          let logsInThisCircle = RequestLogH.logsInThisCircle || {};
          let logs = logsInThisCircle["ChangeVisitStore"];
          if (Array.isArray(logs)){
            let resp = logs[logs.length - 1] || {};
            let code = resp && resp.code;
            if (code != undefined && code != 1) {
              console.log("logsInThisCircle", logsInThisCircle)
              wx.clearStorage();
              rj(this.tips)
            }
          }
          rs();
        })
      }
    },
    {
      tips: "hqmd",
      isOk(){
        return new Promise((rs, rj) => {
          let logsInThisCircle = RequestLogH.logsInThisCircle || {};
          let logs = logsInThisCircle["GetVisitStore"];
          if (Array.isArray(logs)){
            let resp = logs[logs.length - 1] || {};
            let code = resp && resp.code;
            if (code != undefined && code != 1) {
              console.log("logsInThisCircle", logsInThisCircle)
              wx.clearStorage();
              rj(this.tips)
            }
          }
          rs();
        })
      }
    },
    {
      tips: "mdcs",
      isOk(){
        return new Promise(((rs, rj) => {
          setTimeout(() => {
            let storeId = app.StoreH.storeId;
            if (!storeId) {
              wx.clearStorage();
              rj(this.tips)
            } else {
              rs()
            }
          }, 1000)
        }))
      }
    }
  ],
  check(){
    console.log("logsInThisCircle", RequestLogH.logsInThisCircle)
    let promiseArray = this.potentialProblems.map(item => item.isOk())
    return Promise.all(promiseArray)
  }
}

Component(app.BTAB({
  properties: {

  },
  data: {
    tips: `zdyy`
  },
  ready(){
    console.log("errorArea ready")
    this.checkErrorInfo()
  },
  methods: {
    checkErrorInfo() {
      checkErrorProcess.check()
        .catch(err => {
          console.log("出错啦", err)
          this.setData({tips: err})
        })
    }
  }
}))