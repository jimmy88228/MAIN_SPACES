import Vue from "vue";
import VueUtils from "@/helper/utils/vue-utils.js";
import PreviewImgManager from "@/components/preview-img-manager.js";
import LM from "@/helper/manager/login-manager";
import formMixin from "@/helper/mixin/form-mixin";
import OrgnHandle from "@/helper/handler/organize-handler";
Vue.mixin({
    mixins: [formMixin],
    data() {
        return {
            PreviewImgManager: PreviewImgManager,
            // pageQuery: {},
            // pageParams: {},
            pageLoading: false,
            jobIdCol: [],
            MATERIAL_TYPE_DATA:{
                'video':[],
                'audio':[],
                'article':[],
            },
        };
    },
    computed: {
        _loginAdmin() {
            return LM.userInfos|| {}
        },
        _adminName(){
            return this._loginAdmin.adminName || "";
        },
        _mainData(){
            return this._loginAdmin.main_data || {};
        },
        _mainId(){
            return this._loginAdmin.mainId || 0;
        },
        _supplier_res_key(){
            return this._mainData.supplier_res_key || "";
        },
        _supplier_name(){
            return this._mainData.supplier_name || "";
        },
        _logo(){
            return this._mainData.logo || "";
        },
        _supplier_logo(){
            return this._mainData.supplier_logo || "";
        },
        _pageScrollTop() {
            let pageScrollTop = this.$store.state.app.pageScrollTop || 0;
            return pageScrollTop > 70 ? parseFloat(pageScrollTop - 70) : 0;
        },
        pageQuery(){
            let query = (this.$route && this.$route.query) || {};
            return query;
        },
        pageParams(){
            let params = (this.$route && this.$route.params) || {};
            return params;
        }
    },
    methods: {
        _func(){
            event.stopPropagation();
        },
        _structureLimit(muster, type) {
            type = type || this._structureType || '';
            if(type == "structure"){
                return muster.includes(type) && muster.length == 1
            }
            if (type) return muster.includes(type);
            return true;
        },
        // _initParams() {
        //     let query = (this.$route && this.$route.query) || {};
        //     let params = (this.$route && this.$route.params) || {};
        //     this.pageQuery = query;
        //     this.pageParams = params;
        // },
        _copyText(elem) {
            console.log("elem", elem);
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
        _getOrgnData(){
            return OrgnHandle.getData();
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
                    onCancel:()=>{
                        rj();
                    }
                });
            })
        },
        _deepCopy(data){
            return data && JSON.parse(JSON.stringify(data)) || data;
        },
        _reqMessage(res,suc,fail){
            let status = 'info';
            res && res.code && (status = 'success');
            let message = res && (res.message || (res.data && res.data.message)) || (status == 'success'? suc||'操作成功' : fail||'操作失败');
            this.$Message[status](message);
        },
    },
    mounted() {
        // this._initParams();
    }
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