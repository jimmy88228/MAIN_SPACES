import Vue from "vue";
import VueUtils from "@/helper/utils/vue-utils.js";
import PreviewImgManager from "@/components/preview-img-manager.js";
Vue.mixin({
    data() {
        return {
            PreviewImgManager: PreviewImgManager
        };
    },
    methods: {
        vueDataMerge(oldData, newData) {
            VueUtils.vueDataMerge(oldData, newData);
        }
    }
});
Vue.directive("focusNext", {
    bind: function(el, { value }, vnode) {
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
