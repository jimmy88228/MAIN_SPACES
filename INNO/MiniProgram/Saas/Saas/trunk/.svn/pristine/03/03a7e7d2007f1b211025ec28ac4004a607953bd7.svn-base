/**
 * Function:
 *   oncetap(e)  e: {wayToGetAvatar: "使用哪种方式上传"}
 *   processfinish(e) e: {wayToGetAvatar: "使用哪种方式上传", success: "是否成功", filePath: "图片地址"}
 */

import WindowBehaviors from "../../components/ui/cps/window/window-behaviors";
import {getRecommendedWayToUpdateAvatar, chooseImage, uploadAvatar} from "./uploadAvatarUtils.js"
const app = getApp();

Component(
  app.BTAB({
    externalClasses: ["avatar-btn-class"],
    behaviors: [WindowBehaviors],
    data: {
      wayToGetAvatar: getRecommendedWayToUpdateAvatar() || [],
      boxStyle: "transform: translate(0,110%); transition: all 300ms ease-in-out;",
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
        });
        return 300;
      },
      onceTap(){
        this.dismiss();
        this.triggerEvent("oncetap", {wayToGetAvatar: this.data.wayToGetAvatar})
      },
      processFinish(success, filePath, wayToGetAvatar){
        this.triggerEvent("processfinish", {wayToGetAvatar, success, filePath})
      },
      afterAuthrized(e = {}){
        let filePath = e.detail && e.detail.avatarUrl || "";
        this.processFinish(filePath ? true : false, filePath, "getuserprofile")
      },
      handleChooseAvatar(e){
        let path = e.detail.avatarUrl || "";
        uploadAvatar({path})
          .then(filePath => {this.processFinish(true, filePath, "button.chooseAvatar")})
          .catch(error => {
            console.log("error", error)
            app.SMH.showToast({title: error && error.errMsg || error})
            this.processFinish(false, "", "button.chooseAvatar")
          })
      },
      chooseImageBtnTap(){
        this.onceTap()
        chooseImage()
          .then(uploadAvatar)
          .then(filePath => {this.processFinish(true, filePath, "byself")})
          .catch(error => {
            console.log("error", error)
            this.processFinish(false, "", "byself")
            if (error && error.errMsg && error.errMsg.indexOf("cancel") >= 0) return Promise.resolve()
            else app.SMH.showToast({title: error && error.errMsg || error});
          })
      }
    }
  })
);
