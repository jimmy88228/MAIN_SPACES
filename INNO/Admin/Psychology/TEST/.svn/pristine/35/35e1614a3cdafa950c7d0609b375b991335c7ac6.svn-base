import Vue from "vue";
import VueUtils from "@/helper/utils/vue-utils.js";
import PreviewImgManager from "@/components/preview-img-manager.js";
import LM from "@/helper/manager/login-manager";
import formMixin from "@/helper/mixin/form-mixin";
import PageHelper from "@/helper/page-helper.js";
Vue.mixin({
    mixins: [formMixin],
    data() {
        return {
            PreviewImgManager: PreviewImgManager,
            pageLoading: false,
            saveBtnLoading:{base:false},
            jobIdCol: [],
            MATERIAL_TYPE_DATA:{
                'video':[],
                'audio':[],
                'article':[],
            },
            textareaMaxLength:200,
        };
    },
    computed: {
        _adminUserInfos(){
            return LM.userInfos || {}
        },
        _isNeedResetPwd(){
            return LM.isNeedResetPwd || false
        },
        _mainId(){
            return (LM.userInfos && LM.userInfos.mainId) || 0
        },
        _mainData(){
            return (LM.userInfos && LM.userInfos.mainData) || {}
        },
        _loginAdmin() {
            return (LM.userInfos && LM.userInfos.admin_data) || {}
        },
        _appCode(){
            return (LM.userInfos && LM.userInfos.appCode) || "";
        },
        _getReqStructureId(){
            // 登录的组织ID,由于班级，心理老师需要用到上级组织ID
            if(this._structureType == 'edu_class'){
                return this._loginAdmin.structure_pid;
            } else {
                return this._structureId;
            }
        },
        _getReqStructureName(){
            // 登录的组织ID,由于班级，心理老师需要用到上级组织name
            if(this._structureType == 'edu_class'){
                return this._loginAdmin.structure_pname;
            } else {
                return this._structureName;
            }
        },
        _roleType(){
            return this._loginAdmin.role_type || "";   
        },
        _structureType() {
            // edu_customer,edu_area,edu_street,edu_school,edu_class(psyc_teacher, class_teacher)
            return this._loginAdmin.structure_type || "";
        },
        _structureName() {
            return this._loginAdmin.structure_name || "";
        },
        _structureId() {
            return this._loginAdmin.structure_id || 0;
        },
        _adminRoleData() {
            return LM.adminRoleData || []
        },
        _pageScrollTop() {
            let pageScrollTop = this.$store.state.app.pageScrollTop || 0;
            return pageScrollTop > 70 ? parseFloat(pageScrollTop - 70) : 0;
        },
        _isThird(){
            let isThird = LM.loginState == 1 || LM.accessToken;
            return isThird;
        },
        pageQuery(){
            let query = (this.$route && this.$route.query) || {};
            return query;
        },
        pageParams(){
            let params = (this.$route && this.$route.params) || {};
            return params;
        },
        _setBodyScroll(isScroll){
            document.body.style.overflow = isScroll ? 'unset' : 'hidden'
        },
        // PageHelper
        _actionCodeMap(){
            return PageHelper.actionCodeMap
        }
    },
    methods: {
        _structureLimit(muster, type) {
            type = type || this._structureType || ''
            if (type) return muster.includes(type);
            return true;
        },
        _copyText(elem) {
            if(!elem) return;
            function otherEle(element) {
                if (document.selection) {
                    var range = document.body.createTextRange();
                    range.moveToElementText(element);
                    range.select();
                } else {
                    window.getSelection().removeAllRanges();
                    var range = document.createRange();
                    range.selectNode(element);
                    window.getSelection().addRange(range);
                }
            }
            if (elem.select) {
                elem.select();
            } else {
                otherEle(elem);
            }
            document.execCommand('Copy');
            window.getSelection().removeAllRanges();
            this.$Message.warning("已复制好，可贴粘。");
        },
        vueDataMerge(oldData, newData) {
            VueUtils.vueDataMerge(oldData, newData);
        },
        modalTipPop({title = "操作提示",content = "",setLoading=false}) {
            return new Promise((rs, rj) => {
                this.$Modal.confirm({
                    title: title,
                    content: content,
                    onOk: () => {
                        setLoading && this.$store.commit('setLoading', true);
                        rs();
                    },
                });
            })
        },
        _deepCopy(data){
            return data && JSON.parse(JSON.stringify(data)) || data;
        },
        _back(){
            this.$router.back();
        },
        _reqMessage(res,suc,fail){
            let status = 'info';
            res && res.code && (status = 'success');
            let message = res && (res.message || (res.data && res.data.message)) || (status == 'success'? suc||'操作成功' : fail||'操作失败');
            this.$Message[status](message);
        },
        _setSaveBtnLoading(key='base',time=800){
            if(this.saveBtnLoading[key])return
            this.saveBtnLoading[key] = true
            setTimeout(() => {
                this.saveBtnLoading[key] = false;
            }, time);
        }, 
		_getDomProperty(dom, property) {
            if (!dom) return 0;
            let domItem = window.getComputedStyle(dom) || {} , result=0;
            let propertyItem = domItem[property];
            propertyItem && (result = Number(Number(propertyItem.replace('px','')).toFixed(1)));
            return result;
        },
        _getDom(id) {
            const dom = document.getElementById(id);
            return dom;
        },
        _getRef(name=""){
            let ref = this.$refs[name];
            ref && Array.isArray(ref) && (ref = ref[0]);
            return ref || {}
        },
        //全屏
        _fullScreen(id, callback) {
            let el = this._getDom(id);
            let rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen,
                wscript;
            if (typeof rfs != "undefined" && rfs) {
                rfs.call(el);
                typeof(callback) == 'function' && callback();
                return;
            }
            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript) {
                    wscript.SendKeys("{F11}");
                    typeof(callback) == 'function' && callback();
                }
            }
        },
        //退出全屏
        _exitFullScreen(id, callback) {
            let el = document;
            let cfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.exitFullScreen,
                wscript;
            if (typeof cfs != "undefined" && cfs) {
                cfs.call(el);
                typeof(callback) == 'function' && callback();
                return;
            }
            if (typeof window.ActiveXObject != "undefined") {
                wscript = new ActiveXObject("WScript.Shell");
                if (wscript != null) {
                    wscript.SendKeys("{F11}");
                    typeof(callback) == 'function' && callback();
                }
            }
        },
        _func(){}
    },
    mounted() {}
});
Vue.directive("focusNext", {
    bind: function (el, {
        value
    }, vnode) {
        el.addEventListener("keyup", ev => {
            let v = value || {};
            if (ev.keyCode === (v.keyCode || 13)) {
                if (v.action) {
                    let action = vnode.context[v.action];
                    if (action && typeof action === "function") {
                        action();
                    }
                } else if (v.ref) {
                    let nextInput = vnode.context.$refs[v.ref];
                    if (nextInput && typeof nextInput.focus === "function") {
                        nextInput.focus();
                    }
                }
            }
        });
    }
});