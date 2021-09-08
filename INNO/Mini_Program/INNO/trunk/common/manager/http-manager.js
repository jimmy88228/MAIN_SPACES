import EasyHttp from "../support/libs/easy-http/easy-http.min";
import LocationM from "../helper/location-manager.js";
import LM from "./login-manager.js";
// import Utils from "../support/utils/utils";
// import AppUtil from "../helper/app-utils";
import SMH from "../helper/show-msg-helper";
import SIH from "../helper/sys-infos-helper";
import Conf from "../../conf";
import WxApi from "../support/tools/wx-api-promise";

import {
  MainApiList,
  GoodsApiList,
  BuyApiList,
  CollageApiList,
  PointApiList,
  PreSaleApiList,
  UserApiList,
  RegApiList,
  VSlogApiList,
  BrandApiList,
  FromApiList,
  DstbApiList,
  PayApiList,
  SmktPayApiList,
  DistributionApiList,
  GrassApiList,
  PageApiList,
  BargainApiList,
  MemberCardList,
  ActApiList,
  LotteryApiList,
  SecKillApiList,
  VoteApiList,
  VideoShopApiList,
  BarCodeApiList,
  LiveApiList,
  ElectricApiList,
  PDAApiList,
  NewPayApiList,
  // UserDockApiList
} from "./http-api";

const apiDomain = Conf.api_domain || {};
const LOG_TAG = "http-manager";

/***********************************全局请求配置*************************************/
EasyHttp.setRequestHandler(req => {
    return WxApi.request({
      url: req.url,
      data: req.data || {},
      method: req.method,
      header: req.headers
    }).then(resp => {
      console.debug("请求后", LOG_TAG, "Response:", req.url, "\n", {
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
    "cookieId": SIH.cookieId,
    "content-type": "application/json",
    "platform_src": Conf.PLATFORM && Conf.PLATFORM.TYPE,
    "lat": LocationM.lat,
    "lon": LocationM.lon
  })
  //LOG拦截器
  .addInterceptor((req, proceed) => { 
    return proceed(req).catch(err => {
      console.warn("请求错误", LOG_TAG, "Error:", req.url, "\n", {
        req,
        err
      });
      return Promise.reject(err);
    });
  })
  // //session，token自动更新拦截器
  // .addInterceptor((req, proceed) => {
  //   return proceed(req).then(resp => {
  //     let data = resp;
      // if (data.code == 1001) { //token失效
      //   console.log('token失效')
      //   LM.pastLogout();
      //   return LM.loginAsync(false).then(() => {
      //     if (LM.isLogin && req.headers["userToken"] != LM.userToken) {
      //       req.headers["userToken"] = LM.userToken;
      //       console.log("重新登录成功, 触发重发");
      //       return proceed(req); //重发
      //     }
      //     return Promise.reject({
      //       code: 1001,
      //       msg: "登录授权已过期，请刷新重试",
      //       tag: LOG_TAG
      //     });
      //   })
      // } else if (data.code == 1002) {
      //   // return Promise.reject({ ...data, tag: LOG_TAG });
      // } else if (data.code == 10000) { // WxSessionKey已过期
      //   return Promise.reject({
      //     ...data,
      //     tag: LOG_TAG
      //   });
      // }
  //     return data;
  //   });
  // })
  //数据预处理拦截器
  .addInterceptor((req, proceed) => {
    if (LM.isLogin && req.headers["userToken"] != LM.userToken) {
      req.headers["userToken"] = LM.userToken;
    }
    if ((LocationM.lat != req.headers["lat"]) || (LocationM.lon != req.headers["lon"])) {
      req.headers["lat"] = LocationM.lat || 0;
      req.headers["lon"] = LocationM.lon || 0;
    }
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
          error: err,
          tag: LOG_TAG
        });
      } else {
        return Promise.reject({
          msg: "网络请求失败",
          tag: LOG_TAG
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
      SMH.showLoading({title: rq.other.title || "加载中"});
    }
    return proceed(req).finally(() => {
      showLoading && SMH.hideLoading();
    });
  });

// const checkNetwork = Utils.throttle(() => {
//   wx.getNetworkType({
//     success: function(res) {
//       // setTimeout(e => {
//       //   SMH.showToast({
//       //     title:
//       //       !res.networkType || res.networkType === "none" ?
//       //       "网络连接已断开，请检查网络" :
//       //       "网络出错或服务器异常，请先检查网络"
//       //   });
//       // }, 500);
//       let warn = ""
//       warn = !res.networkType || res.networkType === "none" ? "网络连接已断开，请检查网络" : "网络出错或服务器异常，请先检查网络";
//       AppUtil.log(warn);
//     }
//   });
// }, 10000);

// let basePostHandler = p => {
//   return p
//     .finally(() => {
//       wx.nextTick(()=>{
//         SMH.hideLoading();
//       })
//     })
//     .then(e => {
//       let rq = e.request;
//       let rp = e.response;
//       if (!rq.other || rq.other.isShowLoad !== false){
//         SMH.hideLoading();
//       }
//       if (rp.statusCode == 200) {
//         AppUtil.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\nresponse:", rp.data);
//         if (rp.data.code == "10002") {
//           //token失效
//           // LM.logout();
//           // data.msg = "登录过期，请重新登录！";
//         }
//         return rp.data;
//       } else {
//         return Promise.reject(e);
//       }
//     })
//     .catch(e => {
//       let msg;
//       let rq = e.request || {};
//       if (!rq.other || rq.other.isShowLoad !== false) {
//         SMH.hideLoading();
//       }
//       if (!rq.other || typeof rq.other.error == "undefined" || rq.other.error) {
//         let rp = e.response;
//         console.log("EasyHttp-Response e:",e);
//         if (e.errType === 0) {
//           AppUtil.log("EasyHttp-Response:", "没有网络");
//           checkNetwork();
//         } else if (rp) {
//           msg = `code:${rp.statusCode}`;
//           AppUtil.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\n", msg);
//         }
//       }
//       if (msg) {
//         SMH.showToast({
//           title: msg
//         });
//       }
//       return Promise.reject();
//     });
// };


// /******************************  全局配置 ***********************************/
// EasyHttp
//   //插件
//   .use(EasyHttpMiniApp)
//   //前置处理器
//   .bindPreHandler(rq => {
//     rq.header.lat = LocationM.lat;
//     rq.header.lon = LocationM.lon;
//     //
//     if (rq.params && rq.data) {
//       AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\nparams:", rq.params, "\ndata:", rq.data);
//     } else if (rq.params) {
//       AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\nparams:", rq.params);
//     } else if (rq.data) {
//       AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\ndata:", rq.data);
//     } else {
//       AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`);
//     }
//     if (!rq.other || rq.other.isShowLoad !== false) {
//       rq.other = rq.other ? rq.other : {};
//       SMH.showLoading({
//         title: rq.other.title || "加载中",
//       }, rq.other.loadDelay);
//     }
//   })
//   //后置处理器
//   .bindPostHandler(basePostHandler)
//   //默认Action
//   .setAction("GET")
//   //默认请求头
//   .addHeader({
//     cookieId: SIH.cookieId,
//     "content-type": "application/json",
//     "platform_src": Conf.PLATFORM && Conf.PLATFORM.TYPE,
//     "lat": LocationM.lat,
//     "lon": LocationM.lon
//   })

//主接口
export const MainApi = new EasyHttp().setBaseUrl(apiDomain.MAINAPI).addRequests(MainApiList);
//用户接口
export const UserApi = new EasyHttp().setBaseUrl(apiDomain.USERAPI).addRequests(UserApiList);
//注册登录接口
export const RegApi = new EasyHttp().setBaseUrl(apiDomain.REGAPI).addRequests(RegApiList);
//商品接口
export const GoodsApi = new EasyHttp().setBaseUrl(apiDomain.GOODSAPI).addRequests(GoodsApiList);
//下单
export const BuyApi = new EasyHttp().setBaseUrl(apiDomain.BUYAPI).addRequests(BuyApiList);
//配置接口
export const BrandApi = new EasyHttp().setBaseUrl(apiDomain.USERAPI).addRequests(BrandApiList);
//支付接口
export const PayApi = new EasyHttp().setBaseUrl(apiDomain.PAYAPI).addRequests(PayApiList);
//form
export const FromApi = new EasyHttp().setBaseUrl(apiDomain.VSLOGAPI).addRequests(FromApiList);
//积分商城
export const PointApi = new EasyHttp().setBaseUrl(apiDomain.POINTAPI).addRequests(PointApiList);
//预售
export const PreSaleApi = new EasyHttp().setBaseUrl(apiDomain.PRESALEAPI).addRequests(PreSaleApiList);
//分销
export const DstbApi = new EasyHttp().setBaseUrl(apiDomain.USERAPI).addRequests(DstbApiList);
//分销
export const DistributionApi = new EasyHttp().setBaseUrl(apiDomain.STAFFAPI).addRequests(DistributionApiList);
//拼团
export const CollageApi = new EasyHttp().setBaseUrl(apiDomain.COLLAGEAPI).addRequests(CollageApiList);
//log
export const VsLogApi = new EasyHttp().setBaseUrl(apiDomain.VSLOGAPI).addRequests(VSlogApiList);
//log
export const SmktPayApi = new EasyHttp().setBaseUrl(apiDomain.SMKTPAYAPI).addRequests(SmktPayApiList);

export const GrassApi = new EasyHttp().setBaseUrl(apiDomain.GRASSAPI).addRequests(GrassApiList);
//
export const PageApi = new EasyHttp().setBaseUrl(apiDomain.PAGEAPI).addRequests(PageApiList);
// 砍价
export const BargainApi = new EasyHttp().setBaseUrl(apiDomain.BARGAINAPI).addRequests(BargainApiList);
//会员卡
export const MemberCardApi = new EasyHttp().setBaseUrl(apiDomain.MEMBERCARDAPI).addRequests(MemberCardList);
//活动
export const ActApi = new EasyHttp().setBaseUrl(apiDomain.ACTAPI).addRequests(ActApiList);
//活动
export const LotteryApi = new EasyHttp().setBaseUrl(apiDomain.LOTTERYAPI).addRequests(LotteryApiList);

export const SecKillApi = new EasyHttp().setBaseUrl(apiDomain.SECKILLAPI).addRequests(SecKillApiList);

export const VoteApi = new EasyHttp().setBaseUrl(apiDomain.VOTEAPI).addRequests(VoteApiList);

export const VideoShopApi = new EasyHttp().setBaseUrl(apiDomain.VIDEOSHOPAPI).addRequests(VideoShopApiList);

export const BarCodeApi = new EasyHttp().setBaseUrl(apiDomain.BARCODEAPI || apiDomain.VSLOGAPI).addRequests(BarCodeApiList);

export const LiveApi = new EasyHttp().setBaseUrl(apiDomain.LIVEAPI).addRequests(LiveApiList);

export const ElectricApi = new EasyHttp().setBaseUrl(apiDomain.ELECTRICAPI).addRequests(ElectricApiList);

export const PdaApi = new EasyHttp().setBaseUrl(apiDomain.PDAAPI).addRequests(PDAApiList);

export const NewPayApi = new EasyHttp().setBaseUrl(apiDomain.NEWPAYAPI).addRequests(NewPayApiList);