import MobileM from "../../../common/helper/handle/mobileHandle";
import LM from "../../../common/manager/login-manager";
import SConf from "../../../common/helper/handle/getSystemConfig.js"

const AUTHORIZE = {
  name: "AT", 
  checkAccomplished(){
    return Promise.resolve(!!LM.userToken)
  }
},
  BINDPHONE = {
    name: "BP",
    checkAccomplished(){
      return MobileM.getBindMobile()
    }
  },
  FULLFILLPROFILE = {
    name: "FP",
    checkAccomplished(){
      return Promise.resolve(LM.userInfo && LM.userInfo.profile_modify || 0)
    }
  };
const REGISTER_PROCEDURES = {
  0: [AUTHORIZE],
  1: [AUTHORIZE, BINDPHONE],
  2: [AUTHORIZE],
  3: [AUTHORIZE, FULLFILLPROFILE],
  4: [AUTHORIZE],
  5: [AUTHORIZE, BINDPHONE]
}

class RegisterCoupondHandle {
  static getInstance() {
    if (!RegisterCoupondHandle.instance) {
      RegisterCoupondHandle.instance = new RegisterCoupondHandle();
    }
    return RegisterCoupondHandle.instance;
  }
  constructor() {

  }

  checkDisplayCoupons(componentInstance, data = {}, validate = true){
    return hadBindPhoneOrRegisterSucceedInThisCircle() //检测是否注册完或绑定手机
      .then(() => validate ? appletAuthRequired.call(this) : Promise.reject("validate = ", validate))
      .then(checkAccomplished)
      .then(() => initializeCouponPop(componentInstance, data)) //检测优惠券弹窗,that.getCouponsPop
      .catch((err) => {
        console.log("不用弹出优惠券列表弹窗, 原因: ", err)
        return Promise.resolve(false)
      })
  }
}

function appletAuthRequired(){
  if (this._appletAuth != undefined) return Promise.resolve(this._appletAuth)
  return SConf.getSysConfig("applet_auth_required").then(data=>{
    let value = parseFloat(data.Value) || 0;
    this._appletAuth = value;
    return Promise.resolve(value);
  })
}

function checkAccomplished(registerType){
  let procedures = REGISTER_PROCEDURES[registerType] || [];
  if (!procedures.length) return Promise.reject();
  let promiseArray = [];
  procedures.forEach(item => promiseArray.push(item.checkAccomplished()))
  return Promise.all(promiseArray)
    .then(res => {
      if (res.every(status => status)) return Promise.resolve(true)
      else return Promise.reject({procedures, res})
    })
}

function initializeCouponPop(componentInstance, data = {}){
  console.log("==============>", data)
  componentInstance.getCouponsPop = componentInstance.getCouponsPop || componentInstance.selectComponent("#getCouponsPop");
  if (!componentInstance.getCouponsPop) return Promise.resolve(false);
  data.name = "register";
  return componentInstance.getCouponsPop.initData(data)
}

function hadBindPhoneOrRegisterSucceedInThisCircle(){
  if (LM.registerCalledAndSuceess >= 1 || MobileM.bindPhoneInThisCircle) return Promise.resolve()
  else return Promise.reject("该周期没有完成过注册或绑定手机", LM.registerCalledAndSuceess, MobileM.bindPhoneInThisCircle)
}

/////////////////// 切换到归属店铺和切换到归属店铺后的刷新或跳转逻辑放在storeH里

export default RegisterCoupondHandle.getInstance();