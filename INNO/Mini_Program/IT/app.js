import "./common/init";
import Conf from "./conf";
import Wxp from "./common/support/tools/wx-api-promise";
import LM from "./common/manager/login-manager";
import * as Api from "./common/manager/http-manager";
import LgMg from "./common/manager/log-manager";
import SIH from "./common/helper/sys-infos-helper";

App({
    onShow(options) {
        LgMg.setChannel(options.query, options.scene);
        LM.login(false).ignore(() => {
            LgMg.init().createSession();
        });
    },
    onHide() {
        LgMg.setHideTag().submit();
    },
    get Conf() {
        return Conf;
    },
    get SIH() {
        return SIH;
    },
    get Wxp() {
        return Wxp;
    },
    get LoginApi() {
        return Api.LoginApi;
    },
    get UserApi() {
        return Api.UserApi;
    },
    get WebApi() {
        return Api.WebApi;
    },
    get LogApi() {
        return Api.LogApi;
    },
    get DrawApi() {
        return Api.DrawApi;
    },
    get LayoutApi() {
        return Api.LayoutApi;
    },
    get SpecialApi() {
        return Api.SpecialApi;
    },
    //
    clickHold(key = "DEF", d = 800) {
        this.clickHoldMap || (this.clickHoldMap = {});
        let chm = this.clickHoldMap
        if (chm[key]) {
            return false;
        } else {
            chm[key] = true;
            let timer = setTimeout(() => {
                delete chm[key];
                clearTimeout(timer);
            }, d);
            return true;
        }
    },
    lockPageScroll() {
        let page = getCurrentPages().pop();
        page &&
            page.setData({
                noScroll: true
            });
    },
    unLockPageScroll() {
        let page = getCurrentPages().pop();
        page &&
            page.setData({
                noScroll: false
            });
    },
});
