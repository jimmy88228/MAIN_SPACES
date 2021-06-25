import LM from "../manager/login-manager";
import BaseHelper from "./base-helper";
import Util from "../utils/util";
import Conf from "../../conf";
import {ShareTypeMap} from '../manager/log-map'
const LOG_TAG = "base-page";
const BasePage = function (pageOptions) {
    let po = pageOptions || {};
    let paramsOnLoad;
    let setPageScrollThrottle;
    let pConfig = { autoSetPageScroll: false, autoLog: true };
    let bpo = {
        onLoad(...args) {
            try {
                let q = args && args.length > 0 && args[0];
                if (q && q instanceof Object) {
                    paramsOnLoad = { ...q };
                }
            } catch (e) { }
            let page = getCurrentPages().pop(); 
            page && page.setData({
                brand_info: Conf,
                // isIphoneX: SIH.isIphoneX,
            })
            po.onLoad && po.onLoad.call(this, ...args);
        },
        onShow(...args) {
            try {
                this.addVisitLog(null, this.route, paramsOnLoad);
            } catch (e) { }
            po.onShow && po.onShow.call(this, ...args);
        },
        configuration(config) {
            pConfig = { ...pConfig, ...config }
        },
        onPageScroll(event) {
            try {
                if (pConfig.autoSetPageScroll) {
                    if (!setPageScrollThrottle) {
                        setPageScrollThrottle = Util.throttle(value => {
                            this.setData({ pageScrollTop: value });
                        }, 24);
                    }
                    setPageScrollThrottle(event.scrollTop);
                }
            } catch (e) { }
            po.onPageScroll && po.onPageScroll.call(this, ...arguments);
        }
    };
    bpo.onShareAppMessage = function (...args) {
        let shareData = po.onShareAppMessage && po.onShareAppMessage.call(this, ...args);
        shareData = {
            title: "分享",
            ...(shareData || {})
        };
        if (LM.shareCode) {
            shareData = shareData ? { ...shareData } : {};
            shareData.path || (shareData.path = this.route);
            if (shareData.path) {
                shareData.path += (shareData.path.indexOf("?") >= 0 ? "&" : "?") + `shareCode=${LM.shareCode}`;
            }
        }
        let shareType = ShareTypeMap[this.route] || "";
        if (LM.isLogin && shareType) {
            shareData = shareData ? { ...shareData } : {};
            shareData.path || (shareData.path = this.route);
            if (shareData.path) {
                shareData.path += (shareData.path.indexOf("?") >= 0 ? "&" : "?") + `shareType=${shareType}`;
            }
        }
        console.debug(LOG_TAG, "ShareData:", shareData);
        console.log(LOG_TAG, "ShareData:", shareData);
        return shareData;
    };
    Page({
        ...BaseHelper,
        ...po,
        ...bpo
    })
}

Page.BasePage = BasePage;

export default BasePage