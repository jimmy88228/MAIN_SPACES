import EasyHttp from "../../libs/easy-http/easy-http.min";
import EasyHttpMiniApp from "../../libs/easy-http/easy-http-miniapp";
import LocationM from "./location-manager.js";
import Utils from "../../support/utils/utils";
import LM from "./login-manager.js";
import AppUtil from "../app-utils";
import SMH from "../show-msg-helper";
import SIH from "../sys-infos-helper";
import SIM from "./sys-infos-manager.js";
import Conf from "../../conf";

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
  // UserDockApiList
} from "./http-api";

const apiDomain = Conf.api_domain || {};
const checkNetwork = Utils.throttle(() => {
  wx.getNetworkType({
    success: function(res) {
      // setTimeout(e => {
      //   SMH.showToast({
      //     title:
      //       !res.networkType || res.networkType === "none" ?
      //       "网络连接已断开，请检查网络" :
      //       "网络出错或服务器异常，请先检查网络"
      //   });
      // }, 500);
      let warn = ""
      warn = !res.networkType || res.networkType === "none" ? "网络连接已断开，请检查网络" : "网络出错或服务器异常，请先检查网络";
      AppUtil.log(warn);
    }
  });
}, 10000);

let basePostHandler = p => {
  return p
    .finally(() => {
      // wx.nextTick(()=>{
      //   SMH.hideLoading();
      // })
    })
    .then(e => {
      let rq = e.request;
      let rp = e.response;
      if (!rq.other || rq.other.isShowLoad !== false){
        SMH.hideLoading();
      }
      if (rp.statusCode == 200) {
        AppUtil.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\nresponse:", rp.data);
        if (rp.data.code == "10002") {
          //token失效
          // LM.logout();
          // data.msg = "登录过期，请重新登录！";
        }
        return rp.data;
      } else {
        return Promise.reject(e);
      }
    })
    .catch(e => {
      let msg;
      let rq = e.request || {};
      if (!rq.other || rq.other.isShowLoad !== false) {
        SMH.hideLoading();
      }
      if (!rq.other || typeof rq.other.error == "undefined" || rq.other.error) {
        let rp = e.response;
        console.log("EasyHttp-Response e:",e);
        if (e.errType === 0) {
          AppUtil.log("EasyHttp-Response:", "没有网络");
          checkNetwork();
        } else if (rp) {
          msg = `code:${rp.statusCode}`;
          AppUtil.log("EasyHttp-Response:", `[${rq.action}] ${rq.url}`, "\n", msg);
        }
      }
      if (msg) {
        SMH.showToast({
          title: msg
        });
      }
      return Promise.reject();
    });
};


/******************************  全局配置 ***********************************/
EasyHttp
  //插件
  .use(EasyHttpMiniApp)
  //前置处理器
  .bindPreHandler(rq => {
    rq.header.lat = LocationM.lat;
    rq.header.lon = LocationM.lon;
    //
    if (rq.params && rq.data) {
      AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\nparams:", rq.params, "\ndata:", rq.data);
    } else if (rq.params) {
      AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\nparams:", rq.params);
    } else if (rq.data) {
      AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`, "\ndata:", rq.data);
    } else {
      AppUtil.log("EasyHttp-Request:", `[${rq.action}] ${rq.url}`);
    }
    if (!rq.other || rq.other.isShowLoad !== false) {
      rq.other = rq.other ? rq.other : {};
      SMH.showLoading({
        title: rq.other.title || "",
      }, rq.other.loadDelay);
    }
  })
  //后置处理器
  .bindPostHandler(basePostHandler)
  //默认Action
  .setAction("GET")
  //默认请求头
  .addHeader({
    cookieId: SIH.cookieId,
    "content-type": "application/json",
    "platform_src": Conf.PLATFORM && Conf.PLATFORM.TYPE,
    "lat": LocationM.lat,
    "lon": LocationM.lon
  })

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

// export const UserDockApi = new EasyHttp().setBaseUrl(apiDomain.USERDOCKAPI).addRequests(UserDockApiList);

