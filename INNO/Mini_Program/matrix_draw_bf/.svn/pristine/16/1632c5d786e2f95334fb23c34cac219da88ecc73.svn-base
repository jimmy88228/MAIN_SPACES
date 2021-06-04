import LgMg from "../manager/log-manager";
import Wxp from "../support/tools/wx-api-promise";
import LM from "../manager/login-manager";
export default {
    addVisitLog(name, path, options) {
        LgMg.addVisitLog(name, path, options);
    },
    addActionLog(name, position, options) {
        LgMg.addActionLog(name, position, options);
    },
    afterAction(e) {
        var data = e.currentTarget.dataset;
        let action;
        if (data.action && (action = this[data.action])) {
            action(e);
        }
    },
    jumpAction(e) {
        let url = e.currentTarget.dataset.url;
        Wxp.navigateTo({
            url: url
        }).catch(() => {
            Wxp.switchTab({
                url: url
            });
        });
    },
    redirectAction(e) {
        let url = e.currentTarget.dataset.url;
        Wxp.redirectTo({
            url: url
        });
    },
    reLaunchAction(e) {
        let url = e.currentTarget.dataset.url;
        Wxp.reLaunch({
            url: url
        });
    },
    findView(id, key) {
        let v = this.selectComponent(id);
        if (v) return v;
        else if (key) {
            this.setData({ [key]: true });
            v = this.selectComponent(id);
        }
        return v;
    },
    checkLoginChange(set = true) {
        let isLogin = LM.isLogin;
        let token = LM.token;
        this.token = isLogin ? token : null;
        if (!this.isCheckLogined || this.isLogin !== isLogin) {
            this.isCheckLogined = true;
            this.isLogin = isLogin;
            set && this.setData({ isLogin: isLogin })
            return true;
        }
        return false;
    },
};
