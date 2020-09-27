import LgMg from "../manager/log-manager.js";
import FM from "../manager/form-id-manager";
import BI from "../handle/getBrandInfo.js";
import Conf from "../../conf.js";
import SIH from "../sys-infos-helper.js";
export default function(pageOptions) {
    if (pageOptions) {
        let data = pageOptions.data || {};
        pageOptions.data = {
          ...data,
          brand_info: Conf,
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
            formAction(e) {
                let formId = e && e.detail && e.detail.formId;
                FM.push(formId,true);
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
