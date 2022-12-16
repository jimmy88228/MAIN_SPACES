import Vue from "vue";
import PageHelper from "@/helper/page-helper";
export default {
    vueDataMerge(oldData, newData) {
        for (let key in newData) {
            if (key in oldData) {
                oldData[key] = newData[key];
            } else {
                Vue.set(oldData, key, newData[key]);
            }
        }
        return oldData;
    }
};

Vue.directive('hasAction', {
    bind: (el, binding) => {

    },
    inserted: function (el, binding) {
        let value = binding.value;
        if (value) {
            hasActionHandle(el, value);
        }
    },
    update: (el, binding, vnode, oldVnode) => {
        let value = binding.value;
        if (value) {
            hasActionHandle(el, value);
        }
    },
    componentUpdated: () => {},
    unbind: () => {}
})

function hasActionHandle(el, value) {
    let actionCodeMap = PageHelper.actionCodeMap;
    if (value instanceof Array) {
        for (let i = 0; i < value.length; i++) {
            let item = value[i];
            if (!item) {
                el.style.display = 'none';
                break;
            } else if (typeof (item) == 'string') {
                if (!actionCodeMap[item] || actionCodeMap[item] && actionCodeMap[item].isAction != 1) {
                    el.style.display = 'none';
                    break;
                }
            } else {
                el.style.display = 'inline-block';
            }
        }
    } else if (typeof (value) == 'string') {
        if (!actionCodeMap[value] || actionCodeMap[value] && actionCodeMap[value].isAction != 1) {
            el.style.display = 'none';
        } else {
            el.style.display = 'inline-block';
        }
    }
}

// 背景图样式调整
Vue.directive('bgStyle', {
    imgUrl: "",
    bind: (el, binding) => {},
    inserted: function (el, binding) {
        setBgStyle(el, binding.def)
    },
    update: (el, binding, vnode, oldVnode) => {
        setBgStyle(el, binding.def)
    },
    componentUpdated: () => {},
    unbind: () => {}
})
function setBgStyle(el, def){
    def = def || {};
    let backgroundImage = el.style.backgroundImage;
    let src = el.getAttribute('img') || (backgroundImage && backgroundImage.slice(5,-2));
    el.style.backgroundPosition="center center";
    el.style.backgroundRepeat="no-repeat";
    let img = new Image();
    img.src = src;
    def.imgUrl = src;
    el.style.backgroundImage="url(" + src + ")";
    img.onload = function(detail){
        let _img = (detail.path&&detail.path[0]) || detail.target || {};
        if(_img.width < _img.height){
            el.style.backgroundSize="auto 100%";
        } else {
            el.style.backgroundSize="100% auto";
        }
    }
}