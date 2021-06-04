import "./common/init";
import Conf from "./conf";
import Wxp from "./common/support/tools/wx-api-promise";
import LM from "./common/manager/login-manager";
import RunApi from "./common/manager/apiPackage";
import * as Api from "./common/manager/http-manager";
import LgMg from "./common/manager/log-manager";
import SIH from "./common/helper/sys-infos-helper";

App({
    onLaunch(options){
        console.log('app-onLaunch',options);
    },
    onShow(options) {
        console.log('app-onShow',options);
        // LgMg.setChannel(options.query, options.scene);
        // LM.login(false).ignore(() => {
            // LgMg.init().createSession();
        // });
        LM.loginAsync(false).ignore(() => {
            console.log('进来 LM.loginAsync ignore')
        })
    },
    onHide() {
        // LgMg.setHideTag().submit();
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
    get RegApi() {
        return Api.RegApi;
    },
    get GoodsApi() {
        return Api.GoodsApi;
    },
    get LotteryApi() {
        return Api.LotteryApi;
    },
    get RunApi() {
        return RunApi;
    },
    get LM() {
        return LM;
    },
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
