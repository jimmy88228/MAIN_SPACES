import PMRouter from "@/support/libs/pm/page-manager";
import EasyBar from "@y-bao/easy-bar";
import ViewUI from 'view-design';
import SlideVerify from 'vue-monoplasty-slide-verify';
import vuescroll from 'vuescroll/dist/vuescroll-native';
// import 'vuescroll/dist/vuescroll.css';
import Viewer from 'v-viewer';
import 'viewerjs/dist/viewer.css';
import selectTemplate from '@/components/select-components';
import UIModule from '@/components/UI-components';
//
import vueScrollConfig from "@/config/vue-scroll-config/index";
// import selectMaterial from "@/components/material-center/func.js";

function installAll(Vue) {
    Vue.use(PMRouter);
    Vue.use(EasyBar);
    //
    Vue.use(vuescroll, {
        ops: vueScrollConfig
    });
    // iView配置
    Vue.use(ViewUI);
    // 滑动验证组件
    Vue.use(SlideVerify);
    // // 图片查看器
    Vue.use(Viewer);
    Viewer.setDefaults({
        title: [1, (image, imageData) => `${image.alt} (${imageData.naturalWidth} × ${imageData.naturalHeight})`]
    });
    Vue.use(selectTemplate);
	Vue.use(UIModule);
    // 选择素材
    // Vue.prototype.$selectMaterial = selectMaterial;
}
export {
    installAll
}

