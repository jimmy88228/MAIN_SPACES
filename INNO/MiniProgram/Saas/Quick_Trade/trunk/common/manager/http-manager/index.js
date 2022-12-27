import EasyHttp from "../../support/easy-http/easy-http.min";
import Conf from "../../../config/index";
import LM from "../login-manager/index";
import SMH from "../../helper/show-message-helper/index"
import WxApi from "../../utils/wxapi/index";
import StoreH from "../../helper/store-helper/index"
import {
  UserApiList,
  DstbApiList,
  // RegApiList, 
  // VSlogApiList,
} from "./http-api";
import {
  QT_UserApiList,
  QT_RegApiList,
  QT_DstbApiList,
  QT_VSlogApiList,
  QT_GoodsApiList,
  QT_BuyApiList,
  QT_PayApiList
} from "./qt-api";

const apiDomain = Conf.api_domain || {};
const platform_src = "WXAPP";

/***********************************全局请求配置*************************************/
EasyHttp.setRequestHandler(req => {
    return WxApi.request({
      url: req.url,
      data: req.data || {},
      method: req.method,
      header: req.headers
    }).then(resp => {
      console.debug("请求后", "Response:", req.url, "\n", {
        req,
        resp
      });
      return resp;
    })
  })
  //默认Action
  .setDefaultMethod("GET")
  //默认请求头
  .setHeaders({
    "content-type": "application/json",
    "platform_src": platform_src,
    "platformSrc": Conf.PLATFORM && Conf.PLATFORM.TYPE,
    "userToken": LM && LM.userToken || "",
    "brandCode": Conf.BRAND_CODE,
    "storeId": StoreH && StoreH.storeInfo && StoreH.storeInfo.storeId||0
  })
  //LOG拦截器
  .addInterceptor((req, proceed) => {
    return proceed(req).catch(err => {
      console.warn("请求错误", "Error:", req.url, "\n", {
        req,
        err
      });
      return Promise.reject(err);
    });
  })
    //session，token自动更新拦截器
    .addInterceptor((req, proceed) => {
      return proceed(req).then(resp => {
          let data = resp;
          // let other = req.other;
          if(data.code == 1001){//token失效
            console.log('token失效')
            LM.pastLogout();
            return LM.loginAsync(false).then(()=>{
              if (LM.isLogin && req.headers["userToken"] != LM.userToken){
                req.headers["userToken"] = LM.userToken;
                console.log("重新登录成功, 触发重发");
                return proceed(req); //重发
              }
              return Promise.reject({ code: 1001, msg: "登录授权已过期，请刷新重试", tag: LOG_TAG });
            })
          } else if(data.code == 1002){ //未注册
            
          } else if(data.code == 10000){ // WxSessionKey已过期
            LM.createWxSessionId(false).then(() => {
              SMH.showToast({
                title: "状态已过期，请重新授权",
                duration: 3000,
              })
            });
            return Promise.reject({ ...data, tag: LOG_TAG });
          }
          return data;
      });
  })
  //数据预处理拦截器
  .addInterceptor((req, proceed) => {
    console.log('reqreq',LM.userToken,req)
    req.headers && (req.headers.userToken = LM.userToken);
    req.headers && (req.headers.storeId = StoreH.storeInfo && StoreH.storeInfo.storeId||0);
    return proceed(req).then(resp => {
      if (resp.statusCode != 200) {
        return Promise.reject(resp);
      }
      let data = resp.data;
      return data;
    }).catch(err => {
      if (err) {
        const msg = !err.networkType || err.networkType === "none" ? "网络连接已断开，请检查网络" : "网络出错或服务器异常，请先检查网络";
        return Promise.reject({
          msg: msg,
          error: err
        });
      } else {
        return Promise.reject({
          msg: "网络请求失败"
        });
      }
    });
  })
  //loading对话框拦截器
  .addInterceptor((req, proceed) => {
    let other = req.other;
    let showLoading = false;
    if (other && other.isShowLoad) {
      showLoading = true;
      SMH.showLoading({title: req.other.title || "加载中"});
    }
    return proceed(req).finally(() => {
      showLoading && SMH.hideLoading();
    });
  });

// 商城用户
export const UserApi = new EasyHttp().setBaseUrl(apiDomain.USERAPI).addRequests(UserApiList);
export const DstbApi = new EasyHttp().setBaseUrl(apiDomain.USERAPI).addRequests(DstbApiList);
// 用户
export const QT_UserApi = new EasyHttp().setBaseUrl(apiDomain.QT_USERAPI).addRequests(QT_UserApiList);
// 注册登录
export const QT_RegApi = new EasyHttp().setBaseUrl(apiDomain.QT_REGAPI).addRequests(QT_RegApiList);
// 分销
export const QT_DstbApi = new EasyHttp().setBaseUrl(apiDomain.QT_USERAPI).addRequests(QT_DstbApiList);
// 日志
export const QT_VsLogApi = new EasyHttp().setBaseUrl(apiDomain.QT_VSLOGAPI).addRequests(QT_VSlogApiList);
export const QT_GoodsApi = new EasyHttp().setBaseUrl(apiDomain.QT_GOODSAPI).addRequests(QT_GoodsApiList);
// 订单
export const QT_BuyApi = new EasyHttp().setBaseUrl(apiDomain.QT_BUYAPI).addRequests(QT_BuyApiList);
// 支付
export const QT_NewPayApi = new EasyHttp().setBaseUrl(apiDomain.QT_NEWPAYAPI).addRequests(QT_PayApiList);

export default {
  UserApi,
  DstbApi,
  QT_UserApi,
  QT_RegApi,
  QT_DstbApi,
  QT_VsLogApi,
  QT_GoodsApi,
  QT_BuyApi,
  QT_NewPayApi
}