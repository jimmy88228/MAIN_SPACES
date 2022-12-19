const App = getApp();
const base64 = require("../../../../common/support/libs/sign/base64");
import BindPhoneHelper from "../../../../common/helper/bind-phone-helper/index"
Page(App.BP({
  data:{
    avatar: "",
    nickName: "", 
  },
  onLoad(){
    updatePageUserProfile.call(this)
  },
  onUnload(){
    this.changed && App.LM.reSetSimpleInfo()
  },
  handleUserInput(e){
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value || "";
    this.setData({ [type]: value })
  },
  handleAfterUploadAvatar(e){
    let {wayToGetAvatar, success, filePath} = e.detail;
    console.log({wayToGetAvatar, success, filePath});
    wayToGetAvatar === "getuserprofile" && success && (this.changed = true) && App.SMH.showToast({title: "头像已保存"})
    success && this.setData({avatar: filePath});
  },
  handleSaveTap(){ // 保存
    if (!validate.call(this)) return
    modifyUserPortrait.call(this);
  },
  bindPhoneHandle(e){
    console.log('bindPhoneHandle',e)
    let userInfo = App.LM.userInfo||{};
    console.log('userInfo',userInfo.mobilePhone,userInfo)
    if(userInfo.mobilePhone){
      return BindPhoneHelper.changePhoneNumber(e);
    }else{
      return BindPhoneHelper.getPhoneNumber(e);
    }
  },
}))

function updatePageUserProfile(){
  let userInfo = App.LM.userInfo || {};
  let {portrait_path: avatar, realName: nickName} = userInfo;
  this.setData({
    avatar,
    nickName
  })
}

function validate(){
  let {avatar, nickName} = this.data;
  if (!avatar) {
    App.SMH.showToast({title: "请上传头像"})
    return false
  } else if (!nickName.trim()) {
    App.SMH.showToast({title: "请输入昵称"})
    return false
  }
  return true
}

function modifyUserPortrait(){
  let {avatar, nickName} = this.data;
  console.log('avatar, nickName',avatar, nickName)
  App.Http.UserApi.modifyUserPortrait({
    data: {
      avatarUrl: base64.encode(avatar),
      nickName,
      userToken: App.LM.userKey || "",
      brandCode: App.Conf.BRAND_CODE,
    },
    other: {
      isShowLoad: true
    }
  })
    .then(res => {
      console.log("提交结果", res)
      if (res.code == '1'){
        App.SMH.showToast({title: "保存成功"});
        this.changed = true;
        let timer = setTimeout(() => {
          wx.navigateBack()
          clearTimeout(timer);
          timer = null;
        }, 500)
        return Promise.resolve(res)
      }
      return Promise.reject(res)
    })
    .catch(err => {
      console.log("提交失败", err);
      App.SMH.showToast({title: `保存失败: ${err && err.msg || err}`});
    })
}