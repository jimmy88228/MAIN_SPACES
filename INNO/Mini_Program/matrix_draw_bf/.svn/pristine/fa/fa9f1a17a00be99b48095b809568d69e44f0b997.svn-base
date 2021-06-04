import EasyHttp from "../support/libs/easy-http.min";
import Conf from "../../conf";
import Smm from "../helper/show-msg-helper";
import SysInfos from "../helper/sys-infos-helper";
import LM from "./login-manager";
import { LoginApis, UserApis, WebApis, LogApis, DrawApis, LayoutApis, SpecialApis, SubApis } from "./http-api";
import Wxp from "../support/tools/wx-api-promise";

const LOG_TAG = "http-manager";

Promise.prototype.netData = function (...args) {
    return this.then(res => {
        if (res && res.code === 1) {
            return res.data;
        }
        if (args && args.length > 0)
            return args[0];
        return Promise.reject(res);
    });
};

/******************************  全局配置 ***********************************/
EasyHttp.setRequestHandler(req => {
    console.debug(LOG_TAG, "Request:", req.url, "\n", { req });
    return Wxp.request({
        url: req.url,
        data: req.data || {},
        method: req.method,
        header: req.headers
    }).then(resp => {
        console.debug(LOG_TAG, "Response:", req.url, "\n", { req, resp });
        return resp;
    })
})
    //默认Action
    .setDefaultMethod("GET")
    //默认请求头
    .setHeaders({
        "Cookie-Id": SysInfos.cookieId,
        "Content-Type": "application/json",
        "IsTest": Conf.IS_DEBUG ? 1 : 0
    })
    //LOG拦截器
    .addInterceptor((req, proceed) => {
        if (LM.isLogin) {
            req.headers["User-Token"] = LM.token;
        }
        return proceed(req).catch(err => {
            console.warn(LOG_TAG, "Error:", req.url, "\n", { req, err });
            return Promise.reject(err);
        });
    })
    //session，token自动更新拦截器
    .addInterceptor((req, proceed) => {
        return proceed(req).then(resp => {
            let data = resp;
            let extra = req.extraData;
            if (data.code === -10000 && (!extra || !extra.noReLogin)) {//token失效自动刷新
                return LM.relogin(false).ignore(() => {
                    if (LM.isLogin && req.headers["User-Token"] != LM.token) {
                        req.headers["User-Token"] = LM.token;
                        return proceed(req); //重发
                    }
                    return Promise.reject({ code: -10000, msg: "登录授权已过期，请刷新重试", tag: LOG_TAG });
                });
            } else if (data.code === -10001 && (!extra || !extra.noReSessionKey)) {//sessionKey失效自动刷新
                return LM.reCreateWxSession(false).ignore(() => {
                    if (LM.sessionKey) {
                        return Promise.reject({ code: -10001, msg: "会话已过期，已重新创建，请刷新重试", tag: LOG_TAG });
                    } else {
                        return Promise.reject({ code: -10001, msg: "会话已过期，请稍后再试", tag: LOG_TAG });
                    }
                });
            }
            return data;
        });
    })
    //数据预处理拦截器
    .addInterceptor((req, proceed) => {
        return proceed(req)
            .then(resp => {
                if (resp.statusCode != 200) {
                    return Promise.reject(resp);
                }
                let data = resp.data;
                try {
                    //兼容字符串code
                    data.code = parseInt(data.code);
                } catch (e) { }
                return data;
            }).catch(err => {
                if (err) {
                    const msg = !err.networkType || err.networkType === "none" ? "网络连接已断开，请检查网络" : "网络出错或服务器异常，请先检查网络";
                    return Promise.reject({ msg: msg, error: err, tag: LOG_TAG });
                } else {
                    return Promise.reject({ msg: "网络请求失败", tag: LOG_TAG });
                }
            });
    })
    //loading对话框拦截器
    .addInterceptor((req, proceed) => {
        let extra = req.extraData;
        let showLoading = false;
        if (extra && extra.showLoading) {
            showLoading = true;
            Smm.showLoading();
        }
        return proceed(req).finally(() => {
            showLoading && Smm.hideLoading();
        });
    });


export const LoginApi = new EasyHttp().setBaseUrl(Conf.LOGIN_DOMIN).addRequests(LoginApis);

export const UserApi = new EasyHttp().setBaseUrl(Conf.USER_DOMIN).addRequests(UserApis);

export const LayoutApi = new EasyHttp().setBaseUrl(Conf.LAYOUT_DOMIN).addRequests(LayoutApis);

export const DrawApi = new EasyHttp().setBaseUrl(Conf.DRAW_DOMIN).addRequests(DrawApis);

export const SpecialApi = new EasyHttp().setBaseUrl(Conf.SPECIAL_DOMIN).addRequests(SpecialApis);

export const SubApi = new EasyHttp().setBaseUrl(Conf.SUB_DOMIN).addRequests(SubApis);

export const WebApi = new EasyHttp().setBaseUrl(Conf.WAP_DOMIN).addRequests(WebApis);

export const LogApi = new EasyHttp().setBaseUrl(Conf.LOG_DOMIN).addRequests(LogApis);





