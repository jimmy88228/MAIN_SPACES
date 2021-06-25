// components/auth/auth-phone-wd/auth-phone-wd.js
import { createBehavior } from "../../window/anim-helper";
const fade = {
  enterTo: "transition: all 300ms ease-in-out;opacity: 1;",
  leaveTo: "opacity: 0; transform: translate(-50%,-50%) scale(0.8, 0.8); transition: all 300ms ease-in-out;",
  duration: 300
}
const app = getApp();
Component({
  behaviors: [Behavior.BaseBehavior,createBehavior(fade)],
  properties: {

  },
  data: {

  }, 
  attached() {
    app.LM.getWxSessionIdAsync(); 
  },
  methods: {
    onAuth(e){
      this.getPhoneNumber(e).catch(err=>{
        app.SMH.showToast({
          title: err || "手机绑定失败",
          duration:3000
        })
      });
    },
    getPhoneNumber(e){
      let detail = e.detail||{};
      console.log('手机授权',e, detail);
      if (detail.errMsg.indexOf("ok") == -1) {
        return Promise.reject("手机授权失败");
      } else {
        return bindPhone(app.LM.sessionId, detail.encryptedData, detail.iv).then(()=>{
          // app.SMH.showToast({
          //   title: "绑定成功"
          // })
          this.triggerEvent("onPhoneWd",{isBind:true,errMsg:"ok"});
          this.dismiss();
          return Promise.resolve();
        }).catch((e) => Promise.reject(e&&e.msg||"手机绑定失败"));
      }
    }
  }
})


function bindPhone(sessionId, encryptedData, iv) {
	return app.RegApi.bindWxPhone({
		data: {
			sessionId,
			encryptedData,
			iv
		}
	}).netData();
}