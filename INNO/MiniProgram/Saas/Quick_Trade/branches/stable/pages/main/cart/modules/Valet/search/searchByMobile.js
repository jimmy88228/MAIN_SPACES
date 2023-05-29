const App = getApp();
Component(
  App.BC({
    properties: {

    },
    data: {
      show: false,
      mobilePhone:'',
    },
    methods: {
      showModal() {
        this.setData({show: true})
      },
      dismiss() {
        this.setData({show: false})
      },
      mobileInput(e){
        let mobile = e.detail.value || "";
        this.setData({
          mobilePhone: mobile
        })
      },
      searchByMobile(){
        let mobile = this.data.mobilePhone || "";
        let reg = /^[0-9]*$/;
        if (mobile.length == 11 && reg.test(mobile)){
          searchUserInfo.call(this,mobile);
        }else{
          App.SMH.showToast({
            title:"请输入正确手机号码"
          })
        }
      }
    }
  })
)
function searchUserInfo(mobilePhone){
  this.showLoading();
  return App.Http.QT_UserApi.searchUserInfo({
    params:{
      mobilePhone: mobilePhone,
      userToken: App.LM.userToken,
    }
  }).then(res=>{
    if (res.code == 1){
      let data = res.data || {};
      let warn = "";
      if (data.userToken == App.LM.userKey){ 
        warn = "不能为自己下单";
      } else if (!data.userToken){
        warn = "找不到该会员";
      }
      if (warn){
        App.SMH.showToast({
          title: warn
        })
        return;
      }
      data.mobilePhone = mobilePhone;
      this.triggerEvent("searchresult", data);
      this.dismiss();
      return Promise.resolve(res)
    }
    return Promise.reject(res)
  })
  // .catch(err => {
  //   console.log("查找用户信息出错: ", err);
  //   App.SMH.showToast({title: err && err.msg || err || "查找该用户出错"})
  // })
  .finally(() => {
    this.hideLoading();
  })
}
