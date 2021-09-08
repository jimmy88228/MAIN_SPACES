import LgMg from "../../manager/log-manager.js";
import FM from "../form-id-manager";
import BI from "../handle/getBrandInfo.js";
import Conf from "../../../conf.js";
import SIH from "../sys-infos-helper.js";
import GetSystemConfig from "../handle/getSystemConfig";
export default function(pageOptions) {
    if (pageOptions) {
        let data = pageOptions.data || {};
        pageOptions.data = {
          ...data,
          brand_info: Conf,
          brandStyle: Conf.style,
          isIphoneX: SIH.isIphoneX
        }
        let rCreated = pageOptions.created;
        let rReady = pageOptions.ready;
        let bpData = {};
        pageOptions.created = function(...args) {
            //必须function
            rCreated && rCreated.call(this, ...args);
            if (bpData.autoAddLog) {
                this.addVisitLog(null, this.is);
                this.addPageLog(null, this.is);
            }
            
        };
        let baseMethods = {
            setBpData(obj) {
                if (!obj) {
                    return;
                }
                bpData = {
                    ...bpData,
                    ...obj
                };
            },
            addVisitLog(name, path, options) {
                LgMg.addVisitLog(name, path, options);
            },
            addPageLog(name, path, options){
                LgMg.addPageLog(name, path, options);
            },
            addActionLog(name, position, options) {
                LgMg.addActionLog(name, position, options);
            },
            addSearchLog(words,isSetSto=true) {
                LgMg.addSearchLog(words,isSetSto);
            },
            formAction(e) {
                let formId = e && e.detail && e.detail.formId;
                FM.push(formId,true);
            },
            addStaffActivityLog(shareType,relatedId) {
                LgMg.addStaffActivityLog(shareType,relatedId);
            },
            jumpAction(e){
                let dataset = e.currentTarget.dataset || {};
                let url = dataset.url;
                if(url){
                    wx.navigateTo({
                      url: url,
                      fail(){
                          wx.switchTab({
                            url: url,
                          })
                      }
                    })
                }
            },
            _getQuery(id,type,fnc){
                return new Promise((rs,rj)=>{
                    setTimeout(() => { 
                        let query = this.createSelectorQuery();
                        let idSel = id || '#main';
                        if(type == 'all'){
                        query.selectAll(idSel).boundingClientRect()
                        }else{
                        query.select(idSel).boundingClientRect();
                        }
                        query.selectViewport().scrollOffset().exec(
                        res=>{
                            fnc && typeof(fnc) == 'function' && fnc();
                            rs(res || {})
                        }
                        )
                    }, 300);
                })
            },
            nextTickTask() {
                return new Promise(rs => {
                    wx.nextTick(rs);
                });
            },
            getDataset(e){
                let dataset = e && e.currentTarget && e.currentTarget.dataset||{};
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
            checkLoginChange(set = true) {
                let isLogin = LM.isLogin;
                let token = LM.token;
                this.token = isLogin ? token : "";
                if (!this.isCheckLogined || this.isLogin !== isLogin) {
                    this.isCheckLogined = true;
                    this.isLogin = isLogin;
                    set && this.setData({ isLogin: isLogin })
                    return true;
                }
                return false;
            },
            _checkUserLogin(callback){
                return LM.loginAsync().finally(()=>{
                    this._setUserLogin(callback);
                    return Promise.resolve(LM.isLogin);
                })
            },
            _setUserLogin(callback){
                if(this.data.isLogin != LM.isLogin){
                    this.setData({
                        isLogin: LM.isLogin
                    })
                }
                typeof(callback) == "function" && callback(LM.isLogin)
            },
            trimSysConfig(arr){ 
                return GetSystemConfig.trimSysConfig(arr);
            },
			_noFn(e) { }
        };
        if (pageOptions.methods) {
            pageOptions.methods = {
                ...baseMethods,
                ...pageOptions.methods
            };
        } else {
            pageOptions.methods = baseMethods;
        }
    }
    return pageOptions;
}