/**
 * Function:
 *   oncetap(e)  e: {wayToGetAvatar: "使用哪种方式上传"}
 *   processfinish(e) e: {wayToGetAvatar: "使用哪种方式上传", success: "是否成功", filePath: "图片地址"}
 */

import {getRecommendedWayToUpdateAvatar, chooseImage, uploadAvatar} from "./avatar-btn-utils.js"
const App = getApp();

Component(App.BC({
    externalClasses: ["avatar-btn-class"],
    data: {
      show:false,
      wayToGetAvatar: getRecommendedWayToUpdateAvatar() || [],
    }, 
    methods: {
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
      },
      show(){
        this.setData({show:true})
      },
      dismiss(){
        this.setData({show:false}) 
      }
    }
  })
);
