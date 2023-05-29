import SIH from "../../common/helper/sys-infos-helper";
import SMH from "../../common/helper/show-msg-helper";
import WxApi from "../../common/helper/wx-api-helper";
import Conf from "../../conf";
import md5 from "../../common/support/utils/md5"
import retainSessionH from "../../common/helper/handle/retainSessionHandle";

let FileSystemManager = null;

const MAX_SIZE = 2 * 1000 * 1024; // 上传图片最大体积 2M

const CAN_GET_AVATAR_BY_WX_COM = wx.canIUse && wx.canIUse("button.open-type.chooseAvatar") || false, // 可以使用微信新组件获取头像
  CAN_GET_AVATAR_BY_GET_USERPROFILE = wx.canIUse && wx.canIUse("getUserProfile") && SIH.compareVersion("2.21.2") < 0 || false, // 可以使用getUserProfile获取头像
  CAN_ONLY_UPLOAD_AVATAR_BYSELF = SIH.compareVersion("2.10.4") < 0, // 只能让用户自主上传头像
  CAN_USE_CHOOSE_MEDIA = wx.canIUse && wx.canIUse("chooseMedia") || false; // 可以使用新的方法选择图片

export const updateAvatarWays = [CAN_GET_AVATAR_BY_WX_COM, CAN_GET_AVATAR_BY_GET_USERPROFILE, CAN_ONLY_UPLOAD_AVATAR_BYSELF, CAN_USE_CHOOSE_MEDIA];

export function getRecommendedWayToUpdateAvatar(){ // 判断该种哪种方式 获取头像
  if (CAN_GET_AVATAR_BY_GET_USERPROFILE) return ["getuserprofile", "byself"];
  else if (CAN_GET_AVATAR_BY_WX_COM) return ["button.chooseAvatar"];
  else if (CAN_ONLY_UPLOAD_AVATAR_BYSELF) return ["byself"];
  else return ["byself"];
}

export function chooseImage(){
  retainSessionH.saveRetainSession({
    shortPath: (getCurrentPages().slice(-1)[0] || {}).route,
    shortHome: true
  })
  if (CAN_USE_CHOOSE_MEDIA) {
    return WxApi.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed']
    })
    .then(res => {
      let tempFiles = res.tempFiles || [];
      let {sizeType: type, tempFilePath: path, size} = tempFiles[0] || {};
      return Promise.resolve({type, path, size})
    })
  }
  return WxApi.chooseImage({
    count: 1,
    sourceType: ['album', 'camera'],
    sizeType: ['compressed']
  })
  .then(res => {
    let tempFiles = res.tempFiles || [];
    return Promise.resolve(tempFiles[0])
  })
}

function getImageInfo(path){
  return WxApi.getImageInfo({
    src: path
  })
  .then(res => {
    return Promise.resolve(res.type)
  })
  .catch(err => {
    console.log("getImageInfo.error", err);
    return Promise.resolve("unknown")
  })
}

function getFileInfo(path){
  FileSystemManager = FileSystemManager || wx.getFileSystemManager();
  return new Promise((resolve, reject) => {
    FileSystemManager.getFileInfo({
      filePath: path,
      success: resolve,
      fail: reject
    })
  })
  .then(res => {
    console.log("res=>", res)
    if (res && res.size) return Promise.resolve(res.size);
    return Promise.reject("获取文件信息错误")
  })
}

function checkImageIsValid({path, size, suffix}){
  console.log("checkImage", arguments)
  if (!path) return Promise.reject("没有检测到图片")
  else if (suffix === "unknown") return Promise.reject("图片格式错误")
  else if (size > MAX_SIZE) return Promise.reject("图片大小不能超过2M")
  else if (typeof size === "undefined") return getFileInfo(path).then(_size => _size > MAX_SIZE ? Promise.reject("图片大小不能超过2M") : Promise.resolve())
  else return Promise.resolve()
}

function uploadImageRequest({filePath, suffix}){
  let brand_name = Conf.BRAND_CODE,
    time = new Date().getTime(),
    domain_name = Conf.UPLOAD_DOMIN,
    req_type = "user",
    req_id = new Date().getTime(),
    c_req_type = "avatar",
    operate_name = "admin",
    remark = "",
    sign_key = "123456",
    signStr = "brand_name=" + brand_name + "&time=" + time + "&domain_name=" + domain_name + "&req_type=" + req_type + "&req_id=" + req_id + "&c_req_type=" + c_req_type + "&operate_name=" + operate_name + "&remark=" + remark + "&img_code=" + img_code + "&suffix=" + suffix + "&image_data=" + filePath,
    img_code = md5.hexMD5(md5.hexMD5(signStr) + sign_key);
    SMH.showLoading();
    console.log("upload_params", {      brand_name,
      time,
      domain_name,
      req_type,
      req_id,
      c_req_type,
      operate_name,
      remark,
      img_code: img_code,
      suffix: suffix})
  return WxApi.uploadFile({
    url: Conf.uploadImgUrl,
    filePath,
    name: 'upload_file',
    formData: {
      brand_name,
      time,
      domain_name,
      req_type,
      req_id,
      c_req_type,
      operate_name,
      remark,
      img_code: img_code,
      suffix: suffix
    },
    header: {
      'content-type': 'application/json'
    }
  })
  .then(res => {
    let data = {};
    try {data = JSON.parse(res.data)} catch (error) {}
    let domain_path = data.data && data.data.ImgDomain || "";
    let file_path = data.data && data.data.file_path || "";
    return Promise.resolve(domain_path + file_path)
  })
  .finally(() => {SMH.hideLoading()})
}

export function uploadAvatar({path, size, type}){
  let suffix = ""
  return (type ? Promise.resolve(type) : getImageInfo(path))
    .then(type => {suffix = type})
    .then(() => checkImageIsValid({path, size, suffix}))
    .then(() => uploadImageRequest({filePath: path, suffix}))
}