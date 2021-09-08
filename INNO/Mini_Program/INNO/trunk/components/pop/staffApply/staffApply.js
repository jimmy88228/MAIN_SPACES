// pages/component/pop/staffApply/staffApply.js
import WindowBehaviors from "../../../components/ui/cps/window/window-behaviors";
const app = getApp();
Component(app.BTAB({
  behaviors: [WindowBehaviors], 
  properties: {
    applyDstbMsg:{
      type:Object,
      value:{}
    },
    isLogin:{
      type:Boolean,
      value:false
    }
  }, 
  data: {
    boxStyle: "opacity:0;transition: all 300ms ease-in-out;",
  },

  /**
   * 组件的方法列表
   */
  methods: { 
    onAttached() {
      this.setData({
        boxStyle: "opacity:1;transition: all 300ms ease-in-out;"
      });
    },
    onDetached() {
      this.setData({
        boxStyle: "opacity:0;transition: all 300ms ease-in-out;"
      });
      return 300;
    },
    _show(applyDstbMsg,cb){
      this.callBack = cb;
      console.log('_show',applyDstbMsg)
      app.globalData.staffApplyWd || (app.globalData.staffApplyWd = true);
      this.setData({
        applyDstbMsg
      })
      this.show();
    },
    cancel(){
      this.dismiss();
      this.callBack && typeof(this.callBack) == 'function' && this.callBack();
    },
    ok(e){
      console.log('okokok',e)
      let detail = e && e.detail||{};
      let isGoBindPhone = detail.bindPhoneSucceed;
      let time = 50;
      if(isGoBindPhone){
        app.SMH.showToast({
          title:"请进行最后一次授权"
        })
        time = 700;
      }
      setTimeout(() => {
        // 目前接口逻辑是强制拿手机的加密信息
        this.loginPhone = this.loginPhone || this.selectComponent("#loginPhone");
        this.loginPhone.checkLogin({},'',false);
      }, time);
    },
    loginPhoneCallBack(e){
      console.log('loginPhoneCallBack',e);
      let detail = e.detail || {};
      let encryptedData = detail.encryptedData || "";
      let iv = detail.iv||"";
      let ivData = {
        encryptedData,
        iv
      }
      let uf = app.LM.userInfos || {};
      if(!uf.realName){
        return getUserSimpleInfo.call(this).then(res=>{
          let data = res && res.data || {};
          let userName = data.realName || '';
          return apply_Staff.call(this,userName,ivData);
        })
      }else{
        return apply_Staff.call(this,uf.realName,ivData);
      }
    }
  }
}))



function getUserSimpleInfo() {
  if (!app.LM.isLogin) return Promise.reject();
  return app.UserApi.getUserSimpleInfo({
    params: {
      brandCode: app.Conf.BRAND_CODE,
      userToken: app.LM.userToken
    },
    other: {
      isShowLoad: true
    }
  })
}

function apply_Staff(name,ivData) {
  if (!ivData.encryptedData || !ivData.iv) return Promise.reject();
  return app.DistrApi.applyStaffDstbInfoNoPhone({
        data: {
          "userToken": app.LM.userToken,
          "brandCode": app.Conf.BRAND_CODE,
          "apply_name": name||"",
          "encryptedData": ivData.encryptedData,
          "iv": ivData.iv,
          "sessionId": app.LM.sessionId,
          "isFromWholeStaff":1
        },
        other: {
            isShowLoad: true
        }
    }).then(res=>{
        if (res.code == 1) {
        setTimeout(() => {
          app.CDateH.delCacheDate('checkStaff');
          app.StorageH.remove('STAFFINFO');
          app.SMH.showToast({
            title: "申请成功"
          })
        }, 300);
        setTimeout(() => {
          this.dismiss();
          this.callBack && typeof(this.callBack) == 'function' && this.callBack();
        }, 600);
        return res
      } else {
        setTimeout(() => {
          app.SMH.showToast({
              title: res && res.msg || "申请失败"
          })
        }, 300);
        return Promise.reject()
      }
    })
}