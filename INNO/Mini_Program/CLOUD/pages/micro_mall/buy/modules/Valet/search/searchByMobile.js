import WindowBehaviors from "../../../../../../ui/cps/window/window-behaviors.js";
const app = getApp();
Component(
  app.BTAB({
    behaviors: [WindowBehaviors],
    properties: {

    },
    data: {
      boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
      mobilePhone:''
    },
    methods: {
      onAttached() {
        this.setData({
          boxStyle: "opacity:1;transition: opacity 300ms ease-in-out;"
        });
      },
      onDetached() {
        this.setData({
          boxStyle: "opacity:0;transition: opacity 300ms ease-in-out;"
        });
        return 300;
      },
      mobileInput(e){
        // console.log(e);
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
          app.SMH.showToast({
            title:"请输入正确手机号码"
          })
        }
      }
    }
  })
)
function searchUserInfo(mobilePhone){
  return app.UserApi.searchUserInfo({
    params:{
      mobilePhone: mobilePhone,
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userKey
    },
    extraData:{
      isShowLoad:true
    }
  }).then(res=>{
    if (res.code == 1){
      let data = res.data || {};
      let warn = "";
      if (data.userToken == app.LM.userToken){ 
        warn = "不能为自己下单";
      } else if (!data.userToken){
        warn = "找不到该会员";
      }
      if (warn){
        app.SMH.showToast({
          title: warn
        })
        return;
      }
      data.mobilePhone = mobilePhone;
      this.triggerEvent("searchresult", data);
      this.dismiss();
    }
  })
}
