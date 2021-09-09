import LgMg from "../manager/log-manager.js";
import FM from "../helper/form-id-manager";
import GetSystemConfig from "../helper/handle/getSystemConfig";
import LM from "../manager/login-manager.js";

export default {
    noAction() {},
    addVisitLog(name, path, options) {
      LgMg.addVisitLog(name, path, options);
    },
    addPageLog(name, path, options, _isBack) {
      this._isBack = true;
      LgMg.addPageLog(name, path, options, _isBack);
    },
    addActionLog(name, position, options) {
      LgMg.addActionLog(name, position, options);
    },
    addSearchLog(words, isSetSto = true) {
      LgMg.addSearchLog(words, isSetSto);
    },
    addStaffActivityLog(shareType, relatedId) {
      LgMg.addStaffActivityLog(shareType, relatedId);
    },
    formAction(e) {
      let formId = e && e.detail && e.detail.formId;
      FM.push(formId, false);
    },
    nextTick() {
      return new Promise(rs => {
        wx.nextTick(rs);
      });
    },
    MyViewTask(id, label, key) {
      this._myview || (this._myview = {});
      let vs = this._myview;
      if (vs[label]) {
        return Promise.resolve(vs[label]);
      }
      if (key) {
        this.setData({
          [key]: true
        });
      }
      return this.nextTick().then(() => {
        vs[label] = this.selectComponent(id);
        return vs[label];
      });
    },
    jumpAction(e) {
        let url = this.getDataset(e,"url"); 
        url && wx.navigateTo({
          url: url,
          fail() {
            wx.switchTab({
              url: url,
            })
          }
        })
    },
    redirectAction(e) {
      let url = this.getDataset(e,"url");
      url && wx.redirectTo({
        url: url,
        fail() {
            wx.switchTab({
                url: url,
            })
        }
      });
    },
    getDataset(e,type) {
      let dataset = e && e.currentTarget && e.currentTarget.dataset || {};
      if(type)return dataset[type]
      return dataset;
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
    _getQuery(id, type, cb) {
      return new Promise((rs, rj) => {
        // setTimeout(() => {}, 300);
        this.nextTick().then(()=>{
            let query = wx.createSelectorQuery();
            let idSel = id || '#main';
            if (type == 'all') {
                query.selectAll(idSel).boundingClientRect()
            } else {
                query.select(idSel).boundingClientRect();
            }
            query.selectViewport().scrollOffset().exec(
                res => {
                cb && typeof (cb) == 'function' && cb();
                rs(res || {})
                }
            )
        })
      })
    },
    checkLoginChange(set = true,cb) {
      let isLogin = LM.isLogin;
      if (!this.isCheckLogined || this.isLogin !== isLogin) {
        this.isCheckLogined = true;
        this.isLogin = isLogin;
        set && this.setData({
          isLogin
        })
        typeof (cb) == "function" && cb(isLogin)
        return true; //登录状态改变
      }
      return false;  //登录状态没有变化
    },
    trimSysConfig(arr) {
      return GetSystemConfig.trimSysConfig(arr);
    },
    _imgLoad(e) { 
      let key = this.getDataset(e,"key") || "";
      console.log('_imgLoad', e);
      key && this.setData({
        [key]: e && e.detail || {}
      })
    },
};

