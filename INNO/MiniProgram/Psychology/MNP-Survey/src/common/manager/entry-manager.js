import StorageH from "@/common/helper/storage-handler.js";
import stringUtil from '@/common/support/utils/string-util.js'

const LOGIN_TYPE_KEY = "LOGIN_TYPE";
const loginPathConf = {
  default: "pages/login/login",
  classSID: "pages/login/class-sid-login"
}
// 区别不同入口进行登录，维护退出登录
class entryManager {
  static getInstance() {
    if (!entryManager.instance) {
      entryManager.instance = new entryManager();
    }
    return entryManager.instance;
  }
  constructor() {
    this._loginType = StorageH.get(LOGIN_TYPE_KEY) || "";
  }
  get loginType(){
    return this._loginType || ""
  }
  get loginPath(){
    let _loginType = this._loginType;
    return loginPathConf[_loginType] || loginPathConf['default']
  }
  init(ops){
    let path = ops.path || "";
    // 入口如果是startup,登录配置重置为默认
    if(path == "pages/startup/startup"){
        this.setloginType("")
    }
  }
  setloginType(type){
    this._loginType = type || ""
    StorageH.set(LOGIN_TYPE_KEY, this._loginType);
    // #ifdef H5
    // #endif
    // #ifdef MP
    // #endif
  }
}
export default entryManager.getInstance();