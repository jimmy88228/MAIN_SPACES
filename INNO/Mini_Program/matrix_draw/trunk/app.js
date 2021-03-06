import "./common/init";
import Conf from "./conf";
import Wxp from "./common/support/tools/wx-api-promise";
import LM from "./common/manager/login-manager";
import RunApi from "./common/manager/apiPackage";
import * as Api from "./common/manager/http-manager";
// import LgMg from "./common/manager/log-manager";
import SIH from "./common/helper/sys-infos-helper";
import SMH from './common/helper/show-msg-helper'
import AS from "./common/helper/authorize-set"
import StorageH from './common/helper/storageHandle'
import OptionsH from './common/helper/options-helper'
import StringUtil from './common/support/utils/string-util'
App({
    onLaunch(options){
        console.log('app-onLaunch',options);
        console.log('ConfConf',Conf);
        this.init(options);
    },
    onShow(options) {
        console.log('app-onShow',options);
        // LgMg.setChannel(options.query, options.scene);
        // LM.login(false).ignore(() => {
            // LgMg.init().createSession();
        // });
        LM.login(false).ignore(() => {
            console.log('进来app LM.login ignore')
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
    get SMH() {
        return SMH;
    },
    get Wxp() {
        return Wxp;
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
    get UserApi() {
        return Api.UserApi;
    },
    get RunApi() {
        return RunApi;
    },
    get LM() {
        return LM;
    },
    get AS() {
        return AS;
    },
    get StorageH() {
        return StorageH;
    },
    get StringUtil() {
        return StringUtil;
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
    init(options){
        OptionsH.setOptions('options',options);
    }
});
