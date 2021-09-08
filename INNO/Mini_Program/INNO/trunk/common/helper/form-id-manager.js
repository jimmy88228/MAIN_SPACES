import LM from "../manager/login-manager";
import Conf from "../../conf.js";
import { FromApi } from "../manager/http-manager";
import Mydate from "../support/utils/date-util.js"
class FormIdManager {
    static getInstance() {
        if (!FormIdManager.instance) {
            FormIdManager.instance = new FormIdManager();
        }
        return FormIdManager.instance;
    }
    constructor() {
        this.isFrist = true;
    }
    next(dl) {
        if (!this.tid) {
            this.tid = setTimeout(this.submit.bind(this), dl);
        }
    }
    submit() {
        if (this.tid) {
            clearTimeout(this.tid);
            delete this.tid;
        }
        if (LM.isLogin && this.formIds && this.formIds.length > 0) {
            this.isFrist = false;
            let formIds = this.formIds;
            delete this.formIds;
            FromApi.uploadUserFormId({
                data: {
                    userToken: LM.userToken,
                    brandCode: Conf.BRAND_CODE,
                    formIdList: formIds || []
                },
                other: {
                    isShowLoad: false
                }
            });
        }
    }
    push(formId, now) {
        if (!formId || formId.indexOf("formId") > 0) {
            return;
        }
        this.formIds || (this.formIds = []);
        this.formIds.push({
            formId: formId,
          createTime: Mydate.format(new Date(),"yyyy-MM-dd HH:mm:ss")
        });

        if (now || this.isFrist || this.formIds.length > 10) {
            this.submit();
        } else {
            this.next(30000);
        }
    }
}
export default FormIdManager.getInstance();
